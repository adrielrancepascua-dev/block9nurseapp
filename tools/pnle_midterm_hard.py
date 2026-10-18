"""Exam-style Hard items from UDD MedSurg I midterm pattern (Maria Santos case + standalone)."""

MARIA_CASE_2200 = """2200 — NURSE'S NOTES
Maria Santos, 29-year-old female, hospitalized for symptomatic iron-deficiency anemia with GI fluid losses. History of heavy menstrual bleeding (8–10 days/cycle) and low dietary iron.
Labs earlier: Hgb 8.2 g/dL, Hct 25%, MCV 72 fL, ferritin 6 ng/mL, TIBC 460 mcg/dL.
After vomiting/diarrhea she had hypovolemia, hypokalemia, hypomagnesemia, and metabolic acidosis; improved with IV replacement.
Now: BP 110/70, HR 88, RR 18, SpO₂ 98% RA, UOP 45 mL/hr, moist mucosa, no PVCs.
Client: "I feel much better now, but I still get tired when I walk."
"""


def build_midterm_items(mk_exam):
    """Return exam-style hard items; mk_exam is the extended builder from generate_pnle_bank."""
    src = "UDD MedSurg I Midterms Quiz — exam-style hard (unofficial)"
    items = []

    items.append(
        mk_exam(
            "ms-exam-001",
            "The nurse writes a diagnosis of altered tissue perfusion for a client with anemia. Which interventions should be included in the plan of care? Select all that apply.",
            [
                "Monitor the client's hemoglobin and hematocrit",
                "Move the client to a room near the nurse's desk",
                "Limit the client's dietary intake of green vegetables",
                "Assess the client for numbness and tingling",
                "Allow for rest periods during the day for the client",
            ],
            [
                "Trending Hgb/Hct shows whether perfusion interventions are working.",
                "Proximity alone does not address tissue perfusion in anemia.",
                "Green vegetables provide iron; restricting them worsens anemia.",
                "Hypoxia-related perfusion problems can present with neuro symptoms.",
                "Rest reduces oxygen demand while Hgb is low.",
            ],
            topic="blood",
            typ="nclex_sata",
            source=src,
            choice_format="sata",
            correct_indices=[0, 3, 4],
        )
    )

    items.append(
        mk_exam(
            "ms-exam-002",
            "The charge nurse is making assignments on a medical floor. Which client should be assigned to the most experienced nurse?",
            [
                "Iron-deficiency anemia on oral iron supplements",
                "Pernicious anemia receiving vitamin B12 IM",
                "Aplastic anemia with pancytopenia",
                "Renal disease with erythropoietin deficiency",
            ],
            [
                "Oral iron teaching is routine when stable.",
                "B12 injections need skill but aplastic anemia is higher risk.",
                "Pancytopenia = infection, bleeding, and transfusion risks — highest acuity here.",
                "EPO deficiency is often chronic and managed on a schedule.",
            ],
            topic="blood",
            typ="delegation",
            source=src,
            correct_index=2,
        )
    )

    items.append(
        mk_exam(
            "ms-exam-003",
            "The client has Hct 22.3% and Hgb 7.7 g/dL. Two units of PRBCs are ordered. Which interventions should the nurse implement? Select all that apply.",
            [
                "Obtain signed consent",
                "Initiate a 22-gauge IV",
                "Assess the client's lungs",
                "Check for allergies",
                "Hang a keep-open IV of D5W",
            ],
            [
                "Consent is required before transfusion.",
                "Large-bore IV is preferred for blood; 22-gauge limits flow.",
                "Baseline lung assessment detects fluid overload early.",
                "Allergy history guides monitoring for reactions.",
                "Blood products are given with 0.9% NS, not D5W.",
            ],
            topic="blood",
            typ="nclex_sata",
            source=src,
            choice_format="sata",
            correct_indices=[0, 2, 3],
        )
    )

    items.append(
        mk_exam(
            "ms-exam-004",
            "A client arrives in the ED after an MVA with profuse bleeding from a right abdominal injury. Which intervention should the nurse implement first?",
            [
                "Type and crossmatch for RBCs STAT",
                "Initiate IV with an 18-gauge needle and hang normal saline",
                "Have the client sign consent for exploratory laparotomy",
                "Notify the significant other of admission",
            ],
            [
                "Blood typing is urgent but circulation comes first (ABC).",
                "Restore intravascular volume with large-bore access before definitive surgery.",
                "Consent matters but does not precede stopping hemorrhagic shock.",
                "Notification is not the first nursing action in active bleeding.",
            ],
            topic="blood",
            typ="prioritization",
            source=src,
            correct_index=1,
        )
    )

    items.append(
        mk_exam(
            "ms-exam-007",
            "A client receiving PRBCs begins to chill and develops hives. What should the nurse do first?",
            [
                "Notify the laboratory and health-care provider",
                "Administer diphenhydramine IV",
                "Assess the client for further complications",
                "Stop the transfusion and change the tubing at the hub",
            ],
            [
                "Notification follows stopping the blood per reaction protocol.",
                "Antihistamine may be ordered after the line is secured and blood stopped.",
                "Further assessment continues after the transfusion is stopped.",
                "Stop blood first — even allergic reactions require halting the infusion and new tubing.",
            ],
            topic="blood",
            typ="prioritization",
            source=src,
            correct_index=3,
        )
    )

    items.append(
        mk_exam(
            "ms-exam-010",
            "A client with sickle cell anemia has joint pain, oral temperature 102.4 °F, and SpO₂ 91%. What should the ED nurse implement first?",
            [
                "Request arterial blood gases STAT",
                "Administer oxygen via nasal cannula",
                "Start IV with an 18-gauge catheter",
                "Prepare to administer analgesics as ordered",
            ],
            [
                "ABGs do not precede correcting hypoxemia in acute crisis.",
                "Hypoxemia worsens sickling; oxygen is an early priority when SpO₂ is 91%.",
                "IV access supports fluids/analgesia but hypoxemia is addressed first.",
                "Pain control is essential but not before addressing oxygenation.",
            ],
            topic="blood",
            typ="prioritization",
            source=src,
            correct_index=1,
        )
    )

    items.append(
        mk_exam(
            "ms-exam-016",
            "Mr. Reynolds receives furosemide and digoxin. Which laboratory value is most crucial for the nurse to assess?",
            [
                "Potassium level",
                "Calcium level",
                "Magnesium level",
                "Sodium level",
            ],
            [
                "Loop diuretics lower K⁺; hypokalemia increases digoxin toxicity risk.",
                "Calcium is monitored but K⁺ is the classic diuretic + digoxin interaction.",
                "Magnesium matters with diuretics but K⁺ is the priority lab pair here.",
                "Sodium shifts with diuretics but digoxin toxicity ties most to potassium.",
            ],
            topic="fluids_abg",
            typ="prioritization",
            source=src,
            correct_index=0,
        )
    )

    items.append(
        mk_exam(
            "ms-exam-022",
            "A client with chronic COPD has ABG: pH 7.37, PaCO₂ 58 mmHg, HCO₃⁻ 33 mEq/L. Which interpretation should the nurse document?",
            [
                "Uncompensated respiratory acidosis",
                "Partially compensated respiratory acidosis",
                "Fully compensated respiratory acidosis",
                "Fully compensated metabolic alkalosis",
            ],
            [
                "Uncompensated would show pH still acidotic with normal HCO₃⁻.",
                "pH near normal with high PaCO₂ and elevated HCO₃⁻ fits partial renal compensation.",
                "Fully compensated would normalize pH completely with chronic retention.",
                "Metabolic alkalosis would show high HCO₃⁻ with low PaCO₂, not hypercapnia.",
            ],
            topic="fluids_abg",
            typ="application",
            source=src,
            correct_index=1,
        )
    )

    items.append(
        mk_exam(
            "ms-exam-026",
            "Which finding most strongly indicates that the client's acute hypovolemic state has improved?",
            [
                "Hemoglobin remains below the expected range",
                "MCV remains decreased",
                "Urine output has increased to 45 mL/hr",
                "Ferritin remains below the expected range",
                "The client continues to report exertional fatigue",
            ],
            [
                "Low Hgb reflects anemia, not acute volume status.",
                "MCV reflects chronic iron deficiency, not current volume.",
                "Adequate urine output shows renal perfusion and improved volume.",
                "Ferritin tracks iron stores, not acute hypovolemia resolution.",
                "Fatigue can persist while volume status is improved.",
            ],
            topic="blood",
            typ="application",
            source=src,
            correct_index=2,
            case_id="maria-santos-2026",
            case_segment="2200",
            case_narrative=MARIA_CASE_2200,
        )
    )

    items.append(
        mk_exam(
            "ms-exam-033",
            "Which finding represents the highest priority?",
            [
                "Sodium 132 mEq/L",
                "Potassium 2.9 mEq/L with PVCs",
                "Chloride 98 mEq/L",
                "HCO₃⁻ 18 mEq/L",
                "Generalized fatigue",
            ],
            [
                "Mild hyponatremia is concerning but not the immediate cardiac threat.",
                "Severe hypokalemia with PVCs risks lethal dysrhythmias — treat first.",
                "Chloride supports acid-base context but is not the priority finding.",
                "Low bicarbonate reflects acidosis but PVCs with K⁺ 2.9 dominate priority.",
                "Fatigue is nonspecific compared with ectopy on the monitor.",
            ],
            topic="fluids_abg",
            typ="prioritization",
            source=src,
            correct_index=1,
            case_id="maria-santos-2026",
            case_segment="0000",
            case_narrative=(
                "0000 — NURSE'S NOTES\n"
                "Diarrhea continues. Client reports weak legs and \"heart beating strangely.\" "
                "Occasional PVCs on monitor.\n"
                "Labs: Na⁺ 132, K⁺ 2.9, Mg 1.4, Cl⁻ 98, HCO₃⁻ 18 mEq/L."
            ),
        )
    )

    return items
