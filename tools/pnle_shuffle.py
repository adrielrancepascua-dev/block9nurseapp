"""Deterministic per-item choice shuffle so correctIndex is spread across A–D."""
import hashlib
import random
from typing import List


def _rng_for_item(item_id: str) -> random.Random:
    digest = hashlib.sha256(f"pnle-choice-shuffle:v1:{item_id}".encode()).hexdigest()
    seed = int(digest[:16], 16)
    return random.Random(seed)


def shuffle_item_choices(item: dict) -> None:
    """Permute choices, reasons, and correct index/indices together (in place)."""
    n = len(item["choices"])
    assert n == len(item["reasons"]) and n in (4, 5)
    perm = list(range(n))
    _rng_for_item(item["id"]).shuffle(perm)
    old_choices = item["choices"]
    old_reasons = item["reasons"]
    old_correct = item["correctIndex"]
    old_indices = item.get("correctIndices") or [old_correct]
    item["choices"] = [old_choices[i] for i in perm]
    item["reasons"] = [old_reasons[i] for i in perm]
    item["correctIndex"] = perm.index(old_correct)
    item["correctIndices"] = sorted(perm.index(i) for i in old_indices)


def shuffle_all(items: List[dict]) -> None:
    for it in items:
        shuffle_item_choices(it)


def validate_correct_index_distribution(
    items: List[dict],
    *,
    min_per_bucket: int = 18,
    max_per_bucket: int = 32,
) -> None:
    """Fail build if 4-option single-select correct answers cluster on one letter."""
    pool = [
        it
        for it in items
        if it.get("format", "single") == "single" and len(it["choices"]) == 4
    ]
    if len(pool) < 80:
        return
    counts = [0, 0, 0, 0]
    for it in pool:
        ci = it["correctIndex"]
        if ci not in range(4):
            raise AssertionError(f"Invalid correctIndex {ci} on {it['id']}")
        counts[ci] += 1
    labels = "ABCD"
    detail = ", ".join(f"{labels[i]}={counts[i]}" for i in range(4))
    scale = len(pool) / 100.0
    lo = max(8, int(min_per_bucket * scale))
    hi = min(len(pool), int(max_per_bucket * scale) + 5)
    for i, c in enumerate(counts):
        if c < lo or c > hi:
            raise AssertionError(
                f"correctIndex distribution out of band ({detail}); "
                f"want ~{lo}–{hi} per letter for {len(pool)} single 4-choice items"
            )
