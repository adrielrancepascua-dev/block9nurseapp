"""Legacy choice-text overrides (deprecated — do not call apply_balance).

apply_balance only replaced choices, not reasons or correctIndex, which mis-paired
explanations. Use tools/pnle_shuffle.py after authoring instead.
"""

# id -> (choices, reasons or None to keep existing reasons)
BALANCE = {
    "oxy-004": (
        [
            "Use 100% non-rebreather first for all COPD clients",
            "Lowest O₂ flow that maintains acceptable SpO₂",
            "Do not monitor mental status when titrating oxygen",
            "Hyperoxygenate rapidly to reverse chronic hypoxemia",
        ],
        None,
    ),
    "oxy-005": (
        [
            "Louder wheeze with good air entry on auscultation",
            "Silent chest, fatigue, and altered mental status",
            "Mild expiratory wheeze at rest without distress",
            "Productive cough with clear sputum and stable SpO₂",
        ],
        None,
    ),
    "oxy-009": (
        [
            "Gradual dry cough worsening over several weeks",
            "Sudden dyspnea, pleuritic pain, and tachycardia",
            "Bilateral ankle edema before any breathing changes",
            "Purulent green sputum for more than seven days",
        ],
        None,
    ),
    "oxy-006": (
        [
            "Dry skin and mucous membranes without fever",
            "Crackles, fever, tachypnea, and low SpO₂",
            "Bradycardia and hypertension with clear lungs",
            "Isolated abdominal pain without respiratory signs",
        ],
        None,
    ),
    "oxy-007": (
        [
            "Upper airway obstruction without alveolar injury",
            "Non-cardiogenic edema with refractory hypoxemia",
            "Cardiogenic pulmonary edema from left failure",
            "Chronic bronchitis without capillary leak",
        ],
        None,
    ),
    "oxy-008": (
        [
            "Tidal volume 10–12 mL/kg to normalize PaCO₂",
            "Low tidal volume (~6 mL/kg IBW) with protective limits",
            "PEEP 10–12 cm H₂O while keeping tidal volume at 10 mL/kg",
            "Raise respiratory rate to 32/min without reducing tidal volume",
        ],
        [
            "High VT worsens volutrauma in injured ARDS lungs even if PaCO₂ looks better briefly.",
            "Low VT (~6 mL/kg IBW) is the lung-protective standard in ARDS ventilation.",
            "PEEP helps recruitment but must pair with low VT — high VT negates protection.",
            "Faster rate without lowering VT still drives volutrauma and barotrauma risk.",
        ],
    ),
    "oxy-014": (
        [
            "NPO for 48 hours without lung expansion exercises",
            "Early ambulation, incentive spirometry, cough/deep breathe",
            "Restrict all oral and IV fluids to prevent edema",
            "High Fowler's during sleep only without coaching",
        ],
        None,
    ),
    "oxy-015": (
        [
            "Surgeon's preferred technique without alternatives",
            "Procedure nature, risks, benefits, and alternatives",
            "Hospital parking, visiting hours, and room rules",
            "Assigned nurse name and shift schedule only",
        ],
        None,
    ),
    "oxy-018": (
        [
            "Vigorous calf massage to improve circulation",
            "Airway, oxygenation, and hemodynamic monitoring",
            "Strenuous exercise to improve ventilation",
            "Withhold IV fluids and oral intake entirely",
        ],
        None,
    ),
    "heart-001": (
        [
            "Tearing chest pain radiating to the back",
            "Transient ischemic chest pain, often exertional",
            "Continuous pleuritic pain with high fever",
            "Sharp inspiratory pain without cardiac risk",
        ],
        None,
    ),
    "heart-002": (
        [
            "Single normal troponin; no serial testing needed",
            "Rise and/or fall with value above 99th percentile URL",
            "CK-MB alone defines MI; troponin not used",
            "Stable troponin elevation without acute change",
        ],
        None,
    ),
    "heart-003": (
        [
            "Observe 24 hours; treat only if enzymes rise",
            "Reperfusion (PCI or fibrinolysis per protocol) ASAP",
            "IV beta-blocker bolus before any assessment",
            "Sedation without monitoring until pain resolves",
        ],
        None,
    ),
    "heart-006": (
        [
            "Chew and swallow sublingual tablet with water",
            "SL at onset; repeat per protocol; call EMS if persists",
            "Store opened bottle in heat and direct sunlight",
            "Take with PDE-5 inhibitor if chest pain continues",
        ],
        None,
    ),
    "heart-007": (
        [
            "Polyuria, weight loss, and glucose intolerance",
            "Nausea, anorexia, and yellow-green vision changes",
            "Bradycardia without GI or visual symptoms",
            "Sustained hypertension and bounding pulses",
        ],
        None,
    ),
    "heart-008": (
        [
            "Blocks aldosterone at the collecting duct only",
            "Inhibits Na⁺/K⁺/2Cl⁻ cotransporter in loop of Henle",
            "Inhibits ACE and reduces angiotensin II",
            "Stimulates insulin release from pancreatic beta cells",
        ],
        None,
    ),
    "heart-009": (
        [
            "Increases heart rate to improve cardiac output",
            "Reduces myocardial O₂ demand and arrhythmia risk",
            "Raises blood pressure via reflex vasoconstriction",
            "Replaces antiplatelet therapy after MI",
        ],
        None,
    ),
    "heart-010": (
        [
            "Primary coronary vasodilation without antiplatelet effect",
            "Antiplatelet effect limiting thrombus propagation",
            "Loop diuresis and rapid sodium excretion",
            "Central sedation for anxiety during ACS",
        ],
        None,
    ),
    "heart-013": (
        [
            "O₂, IV access, monitoring, prepare drainage team",
            "Fluid restriction and ambulation without monitoring",
            "Vagal maneuvers and carotid massage first-line",
            "High Fowler's only; defer IV access and O₂",
        ],
        [
            "Stabilize perfusion and prepare definitive drainage.",
            "Fluids may support preload; blanket restriction and activity harm.",
            "Vagal maneuvers do not relieve tamponade physiology.",
            "Position alone without ABC support is insufficient.",
        ],
    ),
    "heart-014": (
        [
            "Skip dental prophylaxis in all high-risk clients",
            "Report fever/chills/murmur; follow prophylaxis orders",
            "Ignore central line care and injection-site hygiene",
            "Stop prescribed antibiotics when symptoms improve",
        ],
        None,
    ),
    "heart-015": (
        [
            "Holosystolic murmur at apex radiating to axilla",
            "Harsh systolic murmur at RUSB to carotids",
            "Fixed split S2 without murmur at rest",
            "Pericardial friction rub with positional pain",
        ],
        None,
    ),
    "heart-016": (
        [
            "Stop antiplatelets after 24 hours post-stent",
            "Take antiplatelets; report pain, bleeding, dyspnea",
            "No insertion-site checks unless bleeding is obvious",
            "Resume heavy lifting and driving same day",
        ],
        None,
    ),
    "heart-017": (
        [
            "Irregularly irregular rhythm about 120 bpm",
            "Regular 60–100 bpm with P wave before each QRS",
            "Sawtooth baseline without discernible P waves",
            "Wide-complex tachycardia without P waves",
        ],
        None,
    ),
    "heart-018": (
        [
            "Palpate pulse for 2 minutes before any action",
            "Start CPR; defibrillate when shockable rhythm present",
            "Administer oral fluids once airway is checked",
            "Place in high Fowler's and wait for team arrival",
        ],
        None,
    ),
    "blood-005": (
        [
            "First antibody in primary response; does not cross placenta",
            "Crosses placenta; most abundant serum immunoglobulin",
            "Dominates mucosal secretions and colostrum primarily",
            "Binds mast cells and mediates type I hypersensitivity",
        ],
        None,
    ),
    "blood-008": (
        [
            "Avoid opioids entirely to prevent dependence",
            "Analgesia per protocol, hydration, avoid triggers",
            "Restrict all fluids to prevent pulmonary overload",
            "Defer fever workup until pain resolves completely",
        ],
        None,
    ),
    "blood-009": (
        [
            "Verify room number matches chart only",
            "Two-nurse ID, consent, type/crossmatch, baseline vitals",
            "Warm blood product in microwave before infusion",
            "Transfuse without allergy or reaction history review",
        ],
        None,
    ),
    "blood-010": (
        [
            "Mild pruritus without fever or hemodynamic change",
            "Fever, chills, flank pain, hypotension, dark urine",
            "Headache 24 hours after infusion without fever",
            "Isolated bradycardia with normal blood pressure",
        ],
        None,
    ),
    "blood-012": (
        [
            "PT/INR for unfractionated heparin monitoring",
            "aPTT targeting therapeutic range on heparin protocol",
            "Platelet count alone to titrate heparin dose",
            "D-dimer to adjust heparin infusion rate",
        ],
        None,
    ),
    "blood-013": (
        [
            "Continue heparin; recheck platelets in one week",
            "Stop heparin; avoid platelets unless bleeding; notify MD",
            "Start warfarin immediately while continuing heparin",
            "Massage affected limb to improve collateral flow",
        ],
        None,
    ),
    "blood-014": (
        [
            "Fresh flowers, raw salads, and shared nebulizers",
            "Hand hygiene, cooked foods, avoid ill visitors",
            "Skip oral care to reduce mucosal trauma",
            "Allow sick family at bedside without PPE",
        ],
        None,
    ),
    "blood-017": (
        [
            "Rapid push without pre-infusion vitals or monitoring",
            "Monitor vitals during infusion; filter per policy",
            "Skip product verification if label looks correct",
            "Infuse platelets mixed with D5W in same line",
        ],
        None,
    ),
    "fluids-008": (
        [
            "Primary metabolic alkalosis with elevated bicarbonate",
            "High-anion-gap metabolic acidosis",
            "Isolated respiratory alkalosis without acidosis",
            "Normal pH and bicarbonate throughout untreated DKA",
        ],
        None,
    ),
    "fluids-012": (
        [
            "Shifts K⁺ into cells, lowering serum potassium",
            "Shifts K⁺ out of cells, raising serum potassium",
            "Does not change intracellular/extracellular K⁺ balance",
            "Always lowers serum potassium despite total body deficit",
        ],
        None,
    ),
    "fluids-014": (
        [
            "Under 30 mL/hr or under 500 mL urine per day",
            "Under 100 mL urine per day as sole definition",
            "Greater than 200 mL/hr urine output consistently",
            "Exactly 1000 mL urine output every 24 hours",
        ],
        None,
    ),
    "fluids-022": (
        [
            "Classifies respiratory alkalosis severity categories",
            "High-gap versus normal-gap metabolic acidosis",
            "Hyperkalemia versus hypokalemia on basic chemistries",
            "Iron deficiency anemia versus B12 deficiency anemia",
        ],
        None,
    ),
    "fluids-005": (
        [
            "Isolated short QT without T-wave changes",
            "Peaked T waves, widened QRS, risk of VF",
            "Prominent U waves and ST depression only",
            "Prolonged PR without T-wave abnormalities",
        ],
        None,
    ),
    "fluids-006": (
        [
            "Ignore low K⁺ because digoxin is always safe",
            "Replace K⁺ per protocol; monitor ECG and digoxin",
            "Give kayexalate for confirmed hypokalemia",
            "Restrict all IV fluids until K⁺ normalizes",
        ],
        None,
    ),
    "fluids-010": (
        [
            "Absent deep tendon reflexes without paresthesias",
            "Positive Chvostek/Trousseau and perioral tingling",
            "Sustained hypertension with bounding pulses",
            "Marked bradycardia without neuromuscular signs",
        ],
        None,
    ),
    "fluids-017": (
        [
            "Diarrhea and diabetic ketoacidosis as primary cause",
            "Vomiting, NG suction, and excessive diuretic use",
            "Hyperventilation as sole cause of alkalosis",
            "Chronic renal failure as typical alkalosis driver",
        ],
        None,
    ),
    "fluids-018": (
        [
            "Isotonic GI fluid loss from diarrhea only",
            "Fluid sequestered in burns, ascites, or peritonitis",
            "Excess ADH with euvolemic hypo-osmolar state",
            "Pure free-water deficit without sodium change",
        ],
        None,
    ),
    "fluids-019": (
        [
            "Excess free water relative to sodium (dilutional)",
            "Water deficit or sodium gain (hypertonic state)",
            "Always iatrogenic hypertonic saline infusion only",
            "Normal serum osmolality with low sodium",
        ],
        None,
    ),
    "fluids-020": (
        [
            "Below 2.5 mg/dL — mild hypophosphatemia",
            "Below 1.0 mg/dL — critical per numbers sheet",
            "Below 4.5 mg/dL — borderline low phosphate",
            "Above 4.5 mg/dL — hyperphosphatemia range",
        ],
        None,
    ),
    "periop-004": (
        [
            "Stays hypertonic after all dextrose is metabolized",
            "Becomes hypotonic free water after metabolism",
            "Acts as colloid expander like albumin infusion",
            "Remains isotonic indefinitely in the bloodstream",
        ],
        None,
    ),
    "periop-003": (
        [
            "Routine maintenance hydration for stable clients",
            "Severe hyponatremia and cerebral edema management",
            "Primary potassium replacement in hypokalemia",
            "Lipid emulsion carrier for parenteral nutrition",
        ],
        None,
    ),
    "periop-006": (
        [
            "Replace routine daily water deficit only",
            "Plasma volume expansion in hemorrhage/hypovolemia",
            "Substitute for oral rehydration in mild dehydration",
            "Rapid undiluted potassium chloride replacement",
        ],
        None,
    ),
    "periop-007": (
        [
            "Clean technique adequate for all invasive procedures",
            "Sterile field and technique to prevent tissue contamination",
            "Hand washing before meals in the cafeteria",
            "Reuse single-dose vials across multiple patients",
        ],
        None,
    ),
    "periop-008": (
        [
            "Surgeon music preference and team introductions",
            "Correct patient, site, and procedure before incision",
            "Insurance authorization code and billing details",
            "Cafeteria meal order for operating room staff",
        ],
        None,
    ),
    "periop-010": (
        [
            "Wound infection is the most likely cause on day one",
            "Atelectasis or inflammatory response within 24 hours",
            "Urinary retention never causes postoperative fever",
            "Pulmonary embolism is the usual cause on day one",
        ],
        None,
    ),
    "periop-009": (
        [
            "Airway, breathing, circulation, site, and vitals",
            "Diet preferences and food allergies only",
            "Complete discharge paperwork before assessment",
            "Remove all surgical dressings immediately on arrival",
        ],
        None,
    ),
    "periop-011": (
        [
            "Cool skin, tight edema, slowed infusion at site",
            "Bilateral pedal edema without catheter tenderness",
            "Fever 39°C without local IV site findings",
            "Substernal chest pain without infusion site change",
        ],
        None,
    ),
    "periop-012": (
        [
            "Leave cannula in place until it falls out on its own",
            "Rotate/remove line; elevate limb; warm compress if ordered",
            "Massage inflamed site firmly toward the heart",
            "Apply permanent proximal tourniquet above the site",
        ],
        None,
    ),
    "periop-013": (
        [
            "Reduce aspiration risk during anesthesia induction",
            "Reduce hospital dietary and catering expenses",
            "Eliminate all bowel sounds before surgery forever",
            "Increase thirst to promote post-op oral intake",
        ],
        None,
    ),
    "periop-014": (
        [
            "Elective surgery requires no preoperative planning",
            "Emergency is urgent life-saving; elective is scheduled",
            "Both elective and emergency are cosmetic only",
            "Emergency surgery never requires informed consent",
        ],
        None,
    ),
    "periop-015": (
        [
            "Withhold risks to minimize preoperative anxiety",
            "Deep breathing, leg exercises, pain and incision teaching",
            "Guarantee complete absence of postoperative pain",
            "Defer mobility teaching until after discharge",
        ],
        None,
    ),
    "periop-016": (
        [
            "Hypotonic hydration shifting water into cells",
            "Pulls water into vasculature (hypertonic effect)",
            "Equivalent tonicity and effect to 0.45% NaCl",
            "Colloid oncotic expansion like albumin infusion",
        ],
        None,
    ),
    "periop-017": (
        [
            "Apply scented lotion for staff comfort only",
            "Reduce resident and transient hand flora before procedure",
            "Eliminate need for sterile gloves after scrubbing",
            "Clean operating room floors and equipment wheels",
        ],
        None,
    ),
    "periop-018": (
        [
            "Advance diet quickly without assessing bowel function",
            "NG decompression, bowel sounds, gradual diet per surgeon",
            "Offer solid meals immediately upon PACU arrival",
            "Withhold IV fluids until client tolerates full diet",
        ],
        None,
    ),
    "periop-019": (
        [
            "Cosmetic preference for smaller insertion site",
            "Anticipated rapid fluid or blood resuscitation",
            "Routine oral medication administration only",
            "Clients who will not receive any IV therapy",
        ],
        None,
    ),
    "periop-020": (
        [
            "Saline flushes only; no medication administration",
            "CVP monitoring, irritant meds, long-term TPN per orders",
            "Blood draws only; fluids and meds contraindicated",
            "Short peripheral access for all vesicant infusions",
        ],
        None,
    ),
    "periop-021": (
        [
            "Touch sterile field with bare hands to test sterility",
            "Don gown then gloves without contaminating sterile surfaces",
            "Don gloves before gown regardless of policy teaching",
            "Reuse sterile gown for multiple surgical cases",
        ],
        None,
    ),
    "periop-022": (
        [
            "Stable vitals, voiding if required, escort, teaching understood",
            "Drive self home immediately after general anesthesia",
            "Discharge with uncontrolled severe pain untreated",
            "No discharge instructions or follow-up teaching",
        ],
        None,
    ),
    "periop-024": (
        [
            "Prime line, clamp during changes, left-side-down if suspected",
            "Leave all line caps open during dressing changes",
            "Intentionally prime line with small air bubbles",
            "Keep client upright if air embolism is suspected",
        ],
        None,
    ),
}


def apply_balance(items):
    for it in items:
        fix = BALANCE.get(it["id"])
        if not fix:
            continue
        choices, reasons = fix
        assert len(choices) == 4
        it["choices"] = choices
        if reasons is not None:
            assert len(reasons) == 4
            it["reasons"] = reasons
