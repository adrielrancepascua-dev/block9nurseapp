"""Deterministic per-item choice shuffle so correctIndex is spread across A–D."""
import hashlib
import random
from typing import List


def _rng_for_item(item_id: str) -> random.Random:
    digest = hashlib.sha256(f"pnle-choice-shuffle:v1:{item_id}".encode()).hexdigest()
    seed = int(digest[:16], 16)
    return random.Random(seed)


def shuffle_item_choices(item: dict) -> None:
    """Permute choices, reasons, and correctIndex together (in place)."""
    n = len(item["choices"])
    assert n == len(item["reasons"]) == 4
    perm = list(range(n))
    _rng_for_item(item["id"]).shuffle(perm)
    old_choices = item["choices"]
    old_reasons = item["reasons"]
    old_correct = item["correctIndex"]
    item["choices"] = [old_choices[i] for i in perm]
    item["reasons"] = [old_reasons[i] for i in perm]
    item["correctIndex"] = perm.index(old_correct)


def shuffle_all(items: List[dict]) -> None:
    for it in items:
        shuffle_item_choices(it)


def validate_correct_index_distribution(
    items: List[dict],
    *,
    min_per_bucket: int = 18,
    max_per_bucket: int = 32,
) -> None:
    """Fail build if correct answers cluster on one letter (100-item pilot band)."""
    counts = [0, 0, 0, 0]
    for it in items:
        ci = it["correctIndex"]
        if ci not in range(4):
            raise AssertionError(f"Invalid correctIndex {ci} on {it['id']}")
        counts[ci] += 1
    labels = "ABCD"
    detail = ", ".join(f"{labels[i]}={counts[i]}" for i in range(4))
    for i, c in enumerate(counts):
        if c < min_per_bucket or c > max_per_bucket:
            raise AssertionError(
                f"correctIndex distribution out of band ({detail}); "
                f"want {min_per_bucket}–{max_per_bucket} per letter for {len(items)} items"
            )
