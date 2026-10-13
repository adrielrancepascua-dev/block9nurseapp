#!/usr/bin/env python3
"""Export markdown review sheet: stem, each choice + reason, correct marked, source."""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from generate_pnle_bank import ITEMS, validate  # noqa: E402
from pnle_shuffle import shuffle_all, validate_correct_index_distribution  # noqa: E402
from pnle_student_copy import (  # noqa: E402
    apply_review_metadata,
    apply_student_copy_to_item,
    assert_stems_clean,
)


def build_export_items():
    validate()
    shuffle_all(ITEMS)
    validate_correct_index_distribution(ITEMS)
    for it in ITEMS:
        apply_student_copy_to_item(it)
    assert_stems_clean(ITEMS)
    apply_review_metadata(ITEMS)
    return list(ITEMS)


def render_markdown(items) -> str:
    letters = "ABCD"
    lines = [
        "# PNLE MedSurg pilot — instructor review sheet",
        "",
        "Verify each choice is paired with the correct reason. Sources are generator citations only (not verified against PDFs in repo).",
        "",
    ]
    for it in sorted(items, key=lambda x: x["id"]):
        ci = it["correctIndex"]
        lines.append(f"## {it['id']} ({it['level']}, {it['topic']})")
        lines.append("")
        lines.append(f"**Stem:** {it['stem']}")
        lines.append("")
        lines.append(f"**Source:** `{it.get('source', '')}`")
        lines.append("")
        for i, choice in enumerate(it["choices"]):
            mark = " **CORRECT**" if i == ci else ""
            lines.append(f"- **{letters[i]}:** {choice}{mark}")
            lines.append(f"  - Reason: {it['reasons'][i]}")
        lines.append("")
        lines.append(
            f"*selfChecked:* `{bool(it.get('selfChecked'))}` · "
            f"*instructorReviewed:* `{bool(it.get('instructorReviewed'))}`"
        )
        lines.append("")
        lines.append("---")
        lines.append("")
    return "\n".join(lines)


def main():
    items = build_export_items()
    out_path = Path(__file__).resolve().parent / "pnle-review-sheet.md"
    out_path.write_text(render_markdown(items), encoding="utf-8")
    print(f"Wrote {out_path} ({len(items)} items)")


if __name__ == "__main__":
    main()
