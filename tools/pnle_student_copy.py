"""Student-facing copy rules for PNLE stems (no instructor handout references)."""
import json
import re
from pathlib import Path

_HANDOUT_PATTERNS = [
    (re.compile(r"^According to the handout,?\s*", re.I), ""),
    (re.compile(r"\bper the handout numbers?\b", re.I), "in standard references"),
    (re.compile(r"\bper the handout\b", re.I), ""),
    (re.compile(r"\bin the handout\b", re.I), ""),
    (re.compile(r"\bthe handout stresses which\b", re.I), "which"),
    (re.compile(r"\bthe handout stresses\b", re.I), ""),
    (re.compile(r"\bper handout:?\s*", re.I), ""),
    (re.compile(r"\bfrom sheet:?\s*", re.I), ""),
    (re.compile(r"\bemphasized in the reviewer includes?:?\s*", re.I), "includes "),
    (re.compile(r"\btaught in handout:?\s*", re.I), ""),
    (re.compile(r"\bused in the handout for:?\s*", re.I), "is used for "),
    (re.compile(r"\bprimary use per handout:?\s*", re.I), "primary use: "),
    (re.compile(r"\bgoal per handout:?\s*", re.I), "goal: "),
    (re.compile(r"\bminimum urine output goal per handout:?\s*", re.I), "Minimum urine output goal: "),
    (re.compile(r"\bNormal serum sodium range per handout:?\s*", re.I), "Normal serum sodium range: "),
    (re.compile(r"\bAcidosis effect on potassium shift taught in handout:?\s*", re.I), "Acidosis effect on potassium shift: "),
    (re.compile(r"\bARDS is characterized by which pathophysiology pattern in the handout\?\s*", re.I), "ARDS is characterized by which pathophysiology pattern? "),
    (re.compile(r"\bWhen giving supplemental O₂ to a COPD client at risk for CO₂ narcosis, the handout stresses which principle\?\s*", re.I), "When giving supplemental O₂ to a COPD client at risk for CO₂ narcosis, which principle applies? "),
    (re.compile(r"\bWhich PaCO₂ is within normal range per the handout\?\s*", re.I), "Which PaCO₂ is within the normal range? "),
    (re.compile(r"\bNormal adult SpO₂ on room air per the handout numbers is:?\s*", re.I), "Normal adult SpO₂ on room air is: "),
    (re.compile(r"\b3% NaCl is used in the handout for:?\s*", re.I), "3% NaCl is used for: "),
    (re.compile(r"\bColloid IV fluids primary use per handout:?\s*", re.I), "Colloid IV fluids primary use: "),
    (re.compile(r"\bPlasma is ~55% of blood per handout\.\s*", re.I), "Plasma is ~55% of blood volume. "),
    (re.compile(r"\bper handout targets\.\s*", re.I), "per protocol targets. "),
    (re.compile(r"\bin the handout\.\s*", re.I), "in standard teaching. "),
    (re.compile(r"\bper the handout\.\s*", re.I), ""),
    (re.compile(r"\bper handout\.\s*", re.I), ""),
    (re.compile(r"\bthe handout warns\b", re.I), "teaching warns"),
    (re.compile(r"\bper the midterm numbers sheet\b", re.I), ""),
    (re.compile(r"\bper the numbers sheet:?\s*", re.I), ""),
    (re.compile(r"\bper numbers sheet:?\s*", re.I), ""),
    (re.compile(r"\bper numbers sheet\b", re.I), ""),
    (re.compile(r"\bfrom sheet:?\s*", re.I), ""),
    (re.compile(r"\bper sheet:?\s*", re.I), ""),
    (re.compile(r"\bper sheet\.\s*", re.I), ""),
    (re.compile(r"\bcritical per sheet\b", re.I), "critical"),
    (re.compile(r"\bdefinition from sheet:?\s*", re.I), "definition: "),
    (re.compile(r"\bdefinition from sheet\b", re.I), "definition"),
    (re.compile(r"\blisted:\s*", re.I), "threshold: "),
]

# Build fails if any stem matches (after sanitize pass).
_BANNED_IN_STEM = re.compile(
    r"\b(handout|sheet|reviewer|per\s+the)\b",
    re.I,
)

_STATUS_PATH = Path(__file__).resolve().parent / "pnle_review_status.json"


def sanitize_student_line(text: str) -> str:
    if not text:
        return text
    out = text.strip()
    for pat, repl in _HANDOUT_PATTERNS:
        out = pat.sub(repl, out)
    out = re.sub(r"\s+", " ", out).strip()
    out = re.sub(r"\s+([?:])", r"\1", out)
    return out


def apply_student_copy_to_item(item: dict) -> None:
    item["stem"] = sanitize_student_line(item["stem"])
    item["choices"] = [sanitize_student_line(c) for c in item["choices"]]
    item["reasons"] = [sanitize_student_line(r) for r in item["reasons"]]


def assert_stems_clean(items: list) -> None:
    bad = []
    for it in items:
        stem = it["stem"] or ""
        if _BANNED_IN_STEM.search(stem):
            bad.append(it["id"])
    if bad:
        raise AssertionError(
            f"Stems still contain banned terms (handout|sheet|reviewer|per the): {bad}"
        )


def load_review_status() -> dict:
    if not _STATUS_PATH.is_file():
        return {"items": {}}
    with open(_STATUS_PATH, encoding="utf-8") as f:
        data = json.load(f)
    return data if isinstance(data.get("items"), dict) else {"items": {}}


def apply_review_metadata(items: list) -> None:
    """Ship only items you mark instructorReviewed in pnle_review_status.json."""
    status = load_review_status().get("items", {})
    for it in items:
        row = status.get(it["id"], {})
        instructor = bool(row.get("instructorReviewed"))
        it["instructorReviewed"] = instructor
        it["reviewed"] = instructor
        it["reviewedBy"] = (row.get("reviewedBy") or "").strip() if instructor else ""
        it["reviewedAt"] = (row.get("reviewedAt") or "").strip() if instructor else ""
        note = (row.get("reviewNote") or "").strip()
        if instructor:
            it.pop("reviewNote", None)
        elif note:
            it["reviewNote"] = note
        else:
            it["reviewNote"] = "Not instructor-reviewed — hidden from Study until signed off in pnle_review_status.json"
