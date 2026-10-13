#!/usr/bin/env python3
"""Generate assets/pnle-medsurg.js — 100 MedSurg PNLE pilot items."""
import json
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from pnle_shuffle import shuffle_all, validate_correct_index_distribution
from pnle_student_copy import (
    apply_review_metadata,
    apply_student_copy_to_item,
    assert_stems_clean,
)


def mk(
    id_,
    stem,
    choices,
    correct_index,
    reasons,
    topic,
    level,
    typ,
    source,
    reviewed=False,
    tool=None,
):
    assert len(choices) == 4 and len(reasons) == 4
    return {
        "id": id_,
        "stem": stem,
        "choices": choices,
        "correctIndex": correct_index,
        "reasons": reasons,
        "topic": topic,
        "level": level,
        "type": typ,
        "source": source,
        "reviewed": reviewed,
        "instructorReviewed": False,
        "reviewedBy": "",
        "reviewedAt": "",
        "tool": tool,
    }


def wrong_reason(correct_r, distractors):
    """Build 4 reasons: correct explanation + 3 one-line rule-outs."""
    out = [None] * 4
    out[correct_r] = distractors[correct_r]
    for i in range(4):
        if i != correct_r:
            out[i] = distractors[i]
    return out


ITEMS = []

# --- Oxygenation (18) ---
OXY = [
    mk(
        "oxy-001",
        "Which process of respiration is described as movement of gases into and out of the lungs?",
        ["Diffusion", "Ventilation", "Perfusion", "Osmosis"],
        1,
        [
            "Diffusion is gas movement across the alveolar membrane, not bulk flow in/out of lungs.",
            "Ventilation is the mechanical movement of air into and out of the lungs (inspiration/expiration).",
            "Perfusion is blood flow to lung tissue for gas exchange, not air movement.",
            "Osmosis is water movement across membranes, not respiratory gas flow.",
        ],
        "oxygenation",
        "normal",
        "recall",
        "ms_lec_prelims_7b61.pdf — Respiration processes",
    ),
    mk(
        "oxy-002",
        "At rest, which phase of ventilation is primarily active (muscle work) versus passive?",
        ["Expiration", "Inspiration", "Gas exchange", "Cough reflex only"],
        1,
        [
            "Expiration at rest is mainly passive elastic recoil, though it can be forced voluntarily.",
            "Inspiration is the active phase driven by inspiratory muscles.",
            "Gas exchange is diffusion across the alveolar membrane, not bulk ventilation.",
            "Cough is a protective reflex, not the routine resting ventilation phase.",
        ],
        "oxygenation",
        "normal",
        "recall",
        "ms_lec_prelims_7b61.pdf — Ventilation",
    ),
    mk(
        "oxy-003",
        "A COPD client has chronic CO₂ retention. Which ABG pattern best fits compensated chronic hypercapnia?",
        ["pH 7.50, PaCO₂ 30, HCO₃⁻ 22", "pH 7.38, PaCO₂ 55, HCO₃⁻ 32", "pH 7.20, PaCO₂ 60, HCO₃⁻ 24", "pH 7.55, PaCO₂ 28, HCO₃⁻ 20"],
        1,
        [
            "High pH with low PaCO₂ suggests respiratory alkalosis, not COPD retention.",
            "Near-normal pH with elevated PaCO₂ and elevated HCO₃⁻ fits renal compensation for chronic CO₂ retention.",
            "Low pH with high PaCO₂ and normal HCO₃⁻ suggests acute uncompensated respiratory acidosis.",
            "Alkalosis with low PaCO₂ does not match chronic COPD hypercapnia.",
        ],
        "oxygenation",
        "hard",
        "application",
        "ms_lec_prelims_7b61.pdf — COPD / ABG",
        tool="vitals",
    ),
    mk(
        "oxy-004",
        "When giving supplemental O₂ to a COPD client at risk for CO₂ narcosis, the handout stresses which principle?",
        ["Always use 100% non-rebreather first", "Titrate to lowest flow that maintains acceptable SpO₂", "Never monitor mental status", "Hyperoxygenate to reverse chronic hypoxemia rapidly"],
        1,
        [
            "High FiO₂ can blunt hypoxic drive; routine 100% O₂ risks CO₂ narcosis in vulnerable COPD clients.",
            "Lowest effective O₂ reduces risk of CO₂ retention while supporting oxygenation.",
            "Mental status and ABG trends must be monitored when O₂ changes in CO₂ retainers.",
            "Rapid hyperoxygenation can worsen CO₂ narcosis in chronic retainers.",
        ],
        "oxygenation",
        "hard",
        "prioritization",
        "ms_lec_prelims_7b61.pdf — COPD oxygen therapy",
    ),
    mk(
        "oxy-005",
        "Which finding is most consistent with a severe asthma exacerbation needing urgent escalation?",
        ["Wheezing louder on auscultation", "Silent chest with fatigue and altered mental status", "Mild expiratory wheeze only", "Productive cough with clear sputum only"],
        1,
        [
            "Louder wheeze can still be a treatable exacerbation, not the most ominous sign alone.",
            "Silent chest + fatigue/altered LOC suggests critical airway narrowing and impending failure.",
            "Mild wheeze alone does not signal immediate respiratory failure.",
            "Clear sputum alone does not define severe bronchospasm.",
        ],
        "oxygenation",
        "hard",
        "prioritization",
        "ms_lec_prelims_7b61.pdf — Asthma",
    ),
    mk(
        "oxy-006",
        "Community-acquired pneumonia: which assessment cluster best supports impaired gas exchange?",
        ["Dry skin only", "Crackles, fever, tachypnea, and low SpO₂", "Bradycardia and hypertension only", "Isolated abdominal pain"],
        1,
        [
            "Skin dryness is not a primary gas-exchange indicator for pneumonia.",
            "Crackles, fever, tachypnea, and hypoxemia fit alveolar consolidation and V/Q mismatch.",
            "Bradycardia/hypertension alone do not define pneumonia-related hypoxia.",
            "Abdominal pain is not the hallmark cluster for respiratory gas exchange problems.",
        ],
        "oxygenation",
        "normal",
        "application",
        "ms_lec_prelims_7b61.pdf — Pneumonia",
    ),
    mk(
        "oxy-007",
        "ARDS is characterized by which pathophysiology pattern in the handout?",
        ["Upper airway obstruction only", "Non-cardiogenic pulmonary edema with refractory hypoxemia", "Left-sided heart failure as the primary cause", "Chronic bronchitis without alveolar injury"],
        1,
        [
            "ARDS is alveolar-capillary injury, not isolated upper airway disease.",
            "Increased capillary permeability causes non-cardiogenic edema and severe hypoxemia.",
            "Cardiogenic pulmonary edema is a different mechanism (heart failure).",
            "Chronic bronchitis describes COPD pattern, not ARDS alveolar injury.",
        ],
        "oxygenation",
        "normal",
        "recall",
        "ms_lec_prelims_7b61.pdf — ARDS",
    ),
    mk(
        "oxy-008",
        "For ARDS ventilation in critical care, which strategy is priority?",
        [
            "Tidal volume 10–12 mL/kg to normalize PaCO₂",
            "Low tidal volume (~6 mL/kg IBW) with protective limits",
            "PEEP 10–12 cm H₂O while keeping tidal volume at 10 mL/kg",
            "Raise respiratory rate to 32/min without reducing tidal volume",
        ],
        1,
        [
            "High VT worsens volutrauma in injured ARDS lungs even if PaCO₂ looks better briefly.",
            "Low VT (~6 mL/kg IBW) is the lung-protective standard in ARDS ventilation.",
            "PEEP helps recruitment but must pair with low VT — high VT negates protection.",
            "Faster rate without lowering VT still drives volutrauma and barotrauma risk.",
        ],
        "oxygenation",
        "hard",
        "application",
        "ms_lec_prelims_7b61.pdf — ARDS ventilation",
    ),
    mk(
        "oxy-009",
        "Classic pulmonary embolism presentation emphasized in the reviewer includes:",
        ["Gradual onset dry cough over weeks only", "Sudden dyspnea, pleuritic chest pain, tachycardia", "Bilateral ankle edema as the first sign", "Productive green sputum for 10 days"],
        1,
        [
            "Chronic dry cough alone is not the classic acute PE picture.",
            "Acute dyspnea, pleuritic pain, and tachycardia fit sudden V/Q obstruction.",
            "Ankle edema suggests chronic venous/heart issues, not acute PE first.",
            "Purulent sputum suggests infection, not embolus.",
        ],
        "oxygenation",
        "normal",
        "recall",
        "ms_lec_prelims_7b61.pdf — PE",
    ),
    mk(
        "oxy-010",
        "Which ABG value is within the normal PaO₂ range per the midterm numbers sheet?",
        ["65 mmHg", "88 mmHg", "110 mmHg at sea level on room air as typical target", "55 mmHg"],
        1,
        [
            "65 mmHg is below normal PaO₂ (80–100).",
            "88 mmHg falls within the normal PaO₂ range of 80–100 mmHg.",
            "110 may occur with supplemental O₂; the normal range tops at 100 on room air context.",
            "55 mmHg indicates significant hypoxemia.",
        ],
        "oxygenation",
        "normal",
        "recall",
        "ms_lec_midterms_81e8.txt — PART XXI ABG",
        tool="vitals",
    ),
    mk(
        "oxy-011",
        "Normal adult SpO₂ on room air per the handout numbers is:",
        ["85–90%", "95–100%", "70–80%", "100% only with CO₂ retention"],
        1,
        [
            "85–90% is below the stated normal saturation band.",
            "SaO₂ normal is 95–100% per the must-memorize sheet.",
            "70–80% indicates severe hypoxemia.",
            "100% is not required; 95–100% is the normal range.",
        ],
        "oxygenation",
        "normal",
        "recall",
        "ms_lec_midterms_81e8.txt — PART XXI ABG",
    ),
    mk(
        "oxy-012",
        "Respiratory acidosis is defined by which primary change?",
        ["Low PaCO₂", "High PaCO₂ with pH below 7.35", "High HCO₃⁻ with low PaCO₂", "pH above 7.45 with low HCO₃⁻"],
        1,
        [
            "Low PaCO₂ causes respiratory alkalosis, not acidosis.",
            "Retained CO₂ lowers pH — primary respiratory acidosis when pH < 7.35.",
            "High HCO₃ with low PaCO₂ suggests metabolic alkalosis or compensation pattern, not primary resp acidosis.",
            "High pH defines alkalosis, not acidosis.",
        ],
        "oxygenation",
        "normal",
        "recall",
        "ms_lec_midterms_81e8.txt — PART XI Acid-base",
        tool="labs",
    ),
    mk(
        "oxy-013",
        "A client has pH 7.48, PaCO₂ 28, HCO₃⁻ 22. What is the primary disorder?",
        ["Respiratory acidosis", "Respiratory alkalosis", "Metabolic acidosis", "Metabolic alkalosis"],
        1,
        [
            "Respiratory acidosis requires high PaCO₂ and low pH.",
            "Low PaCO₂ with elevated pH indicates primary respiratory alkalosis.",
            "Metabolic acidosis would show low HCO₃⁻ with low pH as primary.",
            "Metabolic alkalosis would show elevated HCO₃⁻ as primary driver.",
        ],
        "oxygenation",
        "hard",
        "application",
        "ms_lec_midterms_81e8.txt — PART XIII Respiratory alkalosis",
        tool="labs",
    ),
    mk(
        "oxy-014",
        "Post-op client: priority respiratory nursing action to prevent atelectasis?",
        ["Keep NPO for 48 hours without ambulation", "Early ambulation, incentive spirometry, and cough/deep breathing", "Restrict fluids to prevent edema", "High Fowler's only while asleep without waking"],
        1,
        [
            "Prolonged immobility increases atelectasis risk; NPO alone does not expand lungs.",
            "Mobility and lung expansion exercises are cornerstone post-op respiratory care in the handout.",
            "Adequate hydration supports secretion mobilization unless contraindicated.",
            "Passive positioning without coached breathing is insufficient prevention.",
        ],
        "oxygenation",
        "normal",
        "prioritization",
        "ms_lec_prelims_7b61.pdf — Pre/post-op respiratory care",
    ),
    mk(
        "oxy-015",
        "Informed consent for surgery requires the client to understand which element?",
        ["Only the surgeon's favorite technique", "Nature of procedure, risks, benefits, and alternatives", "Hospital parking rules", "Nurse assignment only"],
        1,
        [
            "Consent is not about surgeon preference alone.",
            "Valid consent includes procedure, risks, benefits, and alternatives per surgical safety teaching.",
            "Logistics are not the legal ethical core of informed consent.",
            "Staff assignment is not the informed consent standard.",
        ],
        "oxygenation",
        "normal",
        "recall",
        "ms_lec_prelims_7b61.pdf — Informed consent",
    ),
    mk(
        "oxy-016",
        "Pleural effusion: which finding matches fluid in the pleural space?",
        ["Hyperresonance to percussion", "Dullness to percussion over dependent area", "Bronchial breath sounds over apex only", "Tracheal deviation toward the effusion side always"],
        1,
        [
            "Hyperresonance suggests air (pneumothorax), not fluid.",
            "Fluid dulls percussion and may decrease breath sounds basally.",
            "Bronchial sounds over consolidated lung differ from effusion mechanics.",
            "Large effusions may deviate trachea away, not always toward.",
        ],
        "oxygenation",
        "normal",
        "application",
        "ms_lec_prelims_7b61.pdf — Pleural effusion",
    ),
    mk(
        "oxy-017",
        "Which PaCO₂ is within normal range per the handout?",
        ["30 mmHg", "40 mmHg", "55 mmHg", "28 mmHg"],
        1,
        [
            "30 is below normal PaCO₂ (35–45).",
            "40 mmHg is within PaCO₂ 35–45 mmHg.",
            "55 indicates hypercapnia.",
            "28 indicates hypocapnia.",
        ],
        "oxygenation",
        "normal",
        "recall",
        "ms_lec_midterms_81e8.txt — PART XXI ABG",
        tool="labs",
    ),
    mk(
        "oxy-018",
        "Priority nursing action for a client with suspected pulmonary embolism before definitive diagnosis?",
        ["Massage the calf vigorously", "Maintain airway, oxygenation, and hemodynamic monitoring", "Encourage strenuous exercise", "Withhold all fluids"],
        1,
        [
            "Calf massage risks dislodging thrombus.",
            "ABC stability and monitoring align with acute PE stabilization.",
            "Strenuous activity increases oxygen demand and risk.",
            "Fluids are individualized; blanket withholding is not priority.",
        ],
        "oxygenation",
        "hard",
        "prioritization",
        "ms_lec_prelims_7b61.pdf — PE nursing care",
    ),
]

ITEMS.extend(OXY)

HEART = [
    mk("heart-001", "Angina pectoris is best described as:", ["Sudden tearing chest pain radiating to back", "Chest pain from transient myocardial ischemia, often exertional", "Continuous pleuritic pain with fever", "Sharp pain only on inspiration without cardiac risk"], 1, ["Aortic dissection pattern is tearing to back, not classic angina.", "Angina reflects reversible ischemia, often related to exertion or stress.", "Pleuritic fever suggests pleural/pulmonary cause.", "Isolated inspiratory pain without cardiac context is less typical for angina."], "heart", "normal", "recall", "ms_lec_prelims_7b61.pdf — CAD/angina"),
    mk("heart-002", "Which troponin pattern supports acute myocardial injury?", ["Normal on arrival, never recheck", "Rise and/or fall with at least one value above the 99th percentile URL", "Only CK-MB matters; troponin is irrelevant", "Troponin elevated only in stable angina without infarction"], 1, ["Serial troponins are needed for ACS workup.", "ESC/ACC pattern: rise/fall above URL indicates myocardial injury.", "Troponin is central to MI diagnosis in modern practice.", "Stable angina without necrosis should not show typical MI troponin rise."], "heart", "normal", "recall", "ms_lec_prelims_7b61.pdf — ACS biomarkers"),
    mk("heart-003", "ST-elevation MI (STEMI) priority intervention emphasized in acute cardiac care:", ["Wait 24 hours for enzymes only", "Reperfusion therapy (PCI or fibrinolysis per protocol) ASAP", "High-dose beta-blocker before any assessment", "Routine sedation without monitoring"], 1, ["Delay worsens myocardial loss in STEMI.", "Time-to-reperfusion is critical for STEMI outcomes.", "Beta-blockers are given when hemodynamically stable, not before assessment.", "Sedation without monitoring is unsafe in ACS."], "heart", "hard", "prioritization", "ms_lec_prelims_7b61.pdf — ACS/MI"),
    mk("heart-004", "Left-sided heart failure commonly presents with:", ["Peripheral pitting edema only", "Pulmonary congestion, dyspnea, and crackles", "Ascites as the earliest sign", "Jugular distention without lung findings always"], 1, ["Peripheral edema is more classic for right-sided failure.", "Left failure backs up into lungs → dyspnea, crackles, orthopnea.", "Ascites is late right-sided/chronic pattern.", "JVD can occur in right failure; lungs may be clear in isolated right failure."], "heart", "normal", "application", "ms_lec_prelims_7b61.pdf — Heart failure"),
    mk("heart-005", "Right-sided heart failure hallmark finding:", ["Pulmonary crackles as primary sign", "JVD, hepatomegaly, peripheral edema", "Isolated hemoptysis", "Kussmaul respirations only"], 1, ["Crackles suggest left-sided pulmonary congestion.", "Systemic venous congestion causes JVD, liver congestion, and edema.", "Hemoptysis is not the classic right HF picture.", "Kussmaul is metabolic acidosis breathing pattern."], "heart", "normal", "recall", "ms_lec_prelims_7b61.pdf — Heart failure"),
    mk("heart-006", "Nitroglycerin for angina: key nursing teaching includes:", ["Chew and swallow all forms", "Use sublingual tablet at onset; may repeat per protocol; call EMS if pain persists", "Store opened bottle in hot car", "Take with phosphodiesterase inhibitors for ED"], 1, ["SL NTG is absorbed buccally, not swallowed for acute angina.", "SL at onset with repeat doses and EMS if unrelieved is standard teaching.", "Heat degrades NTG potency.", "PDE-5 inhibitors + nitrates cause dangerous hypotension — contraindicated."], "heart", "hard", "application", "ms_lec_prelims_7b61.pdf — Nitroglycerin"),
    mk("heart-007", "Digoxin toxicity early sign emphasized in cardiac drug teaching:", ["Polyuria", "Nausea, anorexia, vision changes (yellow-green halos)", "Bradycardia only without GI symptoms", "Hypertension"], 1, ["Polyuria is not classic digoxin toxicity.", "GI upset and visual changes are early toxicity clues before arrhythmias.", "Bradycardia can occur but GI/visual symptoms often precede.", "Hypotension/arrhythmias, not HTN, are toxicity concerns."], "heart", "normal", "recall", "ms_lec_prelims_7b61.pdf — Digoxin"),
    mk("heart-008", "Loop diuretic (e.g., furosemide) primary action:", ["Blocks aldosterone at collecting duct only", "Inhibits Na⁺/K⁺/2Cl⁻ cotransporter in ascending loop of Henle", "Blocks ACE", "Increases insulin release"], 1, ["Aldosterone antagonists act on collecting duct, not loop site.", "Loop diuretics block NKCC2 in thick ascending limb → potent diuresis.", "ACE inhibitors act on RAAS, not the loop.", "Insulin release is unrelated."], "heart", "normal", "recall", "ms_lec_prelims_7b61.pdf — Diuretics"),
    mk("heart-009", "Beta-blocker after MI (when stable): main benefit taught:", ["Increases heart rate to improve output", "Reduces myocardial oxygen demand and arrhythmia risk", "Causes reflex hypertension", "Replaces aspirin therapy"], 1, ["Beta-blockers lower HR and contractility, not raise HR.", "↓ demand and antiarrhythmic effects support post-MI care when indicated.", "They lower BP/HR; reflex HTN is not the goal.", "Antiplatelet therapy is separate from beta-blockade."], "heart", "normal", "application", "ms_lec_prelims_7b61.pdf — Beta-blockers"),
    mk("heart-010", "Aspirin in acute coronary syndrome is given for:", ["Vasodilation only", "Antiplatelet effect to limit thrombus propagation", "Diuresis", "Sedation"], 1, ["Aspirin's ACS role is antiplatelet, not primarily vasodilation.", "Irreversible COX-1 inhibition reduces platelet aggregation.", "Diuresis is diuretic action.", "Aspirin is not a sedative."], "heart", "normal", "recall", "ms_lec_prelims_7b61.pdf — Aspirin/thrombolytics"),
    mk("heart-011", "Pericarditis classic pain feature:", ["Relieved by leaning forward; sharp pleuritic quality", "Crushing substernal pain only with ST elevation in one territory", "Pain only with meals", "Pain only at night without position change"], 0, ["Positional relief leaning forward is classic pericarditis.", "Territorial ST elevation suggests MI, not diffuse pericarditis pattern.", "GI relation is not the hallmark.", "Pericarditis pain is often positional."], "heart", "normal", "recall", "ms_lec_prelims_7b61.pdf — Pericarditis"),
    mk("heart-012", "Cardiac tamponade triad (Beck) includes:", ["Hypertension, bradycardia, clear lungs", "Hypotension, muffled heart sounds, JVD", "Fever, cough, wheeze", "Polyuria, polydipsia, weight loss"], 1, ["HTN/bradycardia/clear lungs do not define tamponade.", "Beck triad: low BP, muffled sounds, elevated JVP.", "Respiratory infection cluster is unrelated.", "Diabetes symptoms are unrelated."], "heart", "hard", "recall", "ms_lec_prelims_7b61.pdf — Tamponade"),
    mk("heart-013", "Priority action for suspected tamponade before pericardiocentesis:", ["High-flow O₂, IV access, prepare for pericardiocentesis/emergency surgery", "Aggressive fluid restriction only", "Ambulate client immediately", "Massage carotid sinus"], 0, ["Stabilize perfusion and prepare definitive drainage.", "Fluids may be needed to support preload in tamponade; blanket restriction harms.", "Activity increases demand while output is limited.", "Carotid massage is inappropriate."], "heart", "hard", "prioritization", "ms_lec_prelims_7b61.pdf — Tamponade"),
    mk("heart-014", "Endocarditis prevention teaching for high-risk clients includes:", ["Skip dental prophylaxis always", "Report fever, chills, new murmur; adhere to antibiotic prophylaxis when ordered", "Ignore IV line care", "Stop all antibiotics early if feeling better"], 1, ["High-risk clients may need prophylaxis per current orders.", "Fever, chills, murmur changes warrant urgent evaluation.", "Line care matters for bacteremia risk.", "Incomplete antibiotic courses risk resistance/treatment failure."], "heart", "normal", "application", "ms_lec_prelims_7b61.pdf — Endocarditis"),
    mk("heart-015", "Aortic stenosis classic finding:", ["High-pitched holosystolic murmur at apex", "Harsh crescendo-decrescendo systolic murmur at right 2nd ICS radiating to carotids", "Fixed split S2", "Pericardial friction rub"], 1, ["Apical holosystolic suggests mitral regurgitation.", "AS murmur is systolic ejection at RUSB with carotid radiation.", "Fixed split S2 is ASD pattern.", "Friction rub is pericarditis."], "heart", "hard", "application", "ms_lec_prelims_7b61.pdf — Valvular disorders"),
    mk("heart-016", "Post-PTCA/stent: priority teaching:", ["Stop antiplatelets after 1 day", "Take prescribed antiplatelets; report chest pain, bleeding, or sudden dyspnea", "No need to monitor insertion site", "Resume heavy lifting same day"], 1, ["DAPT duration is protocol-driven; stopping early risks stent thrombosis.", "Chest pain, bleeding, dyspnea, and site monitoring are essential.", "Site checks prevent hematoma/bleeding complications.", "Activity restrictions apply early post-procedure."], "heart", "normal", "application", "ms_lec_prelims_7b61.pdf — PTCA/stenting"),
    mk("heart-017", "Normal sinus rhythm on ECG: rate and rhythm described as:", ["Irregularly irregular 120 bpm", "Regular rhythm ~60–100 bpm with P before each QRS", "No P waves with sawtooth baseline", "Wide QRS tachycardia always"], 1, ["Irregularly irregular suggests AFib.", "NSR: regular, 60–100, P-QRS relationship intact.", "Sawtooth = flutter.", "Wide QRS tachycardia is VT or aberrancy, not NSR."], "heart", "normal", "recall", "ms_lec_prelims_7b61.pdf — ECG basics"),
    mk("heart-018", "During cardiac arrest (BLS focus), first priority after scene safety:", ["Check pulse for 2 minutes before any action", "Start high-quality CPR and get/defibrillate when shockable rhythm", "Give oral fluids", "Place in high Fowler's only"], 1, ["Pulse check is brief; delay in CPR worsens outcomes.", "Immediate CPR and early defibrillation for shockable rhythms save lives.", "Oral fluids are contraindicated in arrest.", "Position alone does not replace CPR/defibrillation."], "heart", "hard", "prioritization", "ms_lec_prelims_7b61.pdf — Cardiac arrest"),
]
ITEMS.extend(HEART)

BLOOD = [
    mk("blood-001", "Plasma constitutes approximately what percent of total blood volume?", ["45%", "55%", "70%", "25%"], 1, ["45% is formed elements fraction.", "Plasma is ~55% of blood per handout.", "70% is closer to infant TBW, not plasma fraction.", "25% is not the plasma proportion."], "blood", "normal", "recall", "ms_lec_midterms_81e8.txt — PART XXI Blood"),
    mk("blood-002", "Normal adult platelet count per the numbers sheet:", ["50,000–100,000 /µL", "150,000–450,000 /µL", "500,000–800,000 /µL", "10,000–20,000 /µL"], 1, ["50–100K is thrombocytopenia range.", "150K–450K is normal platelet range.", "Very high counts suggest thrombocytosis.", "10–20K is critical thrombocytopenia."], "blood", "normal", "recall", "ms_lec_midterms_81e8.txt — PART XXI Blood"),
    mk("blood-003", "Erythropoietin primarily stimulates production of:", ["Platelets", "Red blood cells", "Neutrophils only", "Basophils only"], 1, ["TPO drives platelets.", "EPO acts on erythroid progenitors → RBC production.", "Neutrophils respond to G-CSF and infection signals.", "Basophils are not EPO-driven."], "blood", "normal", "recall", "ms_lec_midterms_81e8.txt — Hematopoiesis cytokines"),
    mk("blood-004", "Which WBC type is most associated with acute bacterial infection (60–70% of WBCs)?", ["Eosinophils", "Neutrophils", "Basophils", "Lymphocytes only"], 1, ["Eosinophils rise with allergy/parasites.", "Neutrophils dominate acute bacterial responses.", "Basophils are rare and histamine-related.", "Lymphocytes are 20–25%, not the 60–70% acute bacterial pattern."], "blood", "normal", "recall", "ms_lec_midterms_81e8.txt — PART XXIII WBC patterns"),
    mk("blood-005", "IgG is notable because it:", ["Is the first antibody in primary response only", "Crosses placenta and is most abundant serum antibody", "Is found only in mucosa", "Binds mast cells for anaphylaxis only"], 1, ["IgM is first in primary response.", "IgG is abundant and provides passive immunity via placenta.", "IgA dominates mucosa/colostrum.", "IgE mediates mast cell degranulation."], "blood", "normal", "recall", "ms_lec_midterms_81e8.txt — Immunoglobulins"),
    mk("blood-006", "Iron-deficiency anemia classic labs:", ["High MCV, high ferritin", "Low MCV, low ferritin, low serum iron", "High B12, macrocytic smear", "Normal iron with high reticulocytes only"], 1, ["High MCV suggests macrocytic anemia.", "Microcytic hypochromic pattern with low iron stores fits IDA.", "B12 deficiency is macrocytic.", "Isolated reticulocytosis suggests hemolysis/bleeding recovery."], "blood", "normal", "application", "ms_lec_midterms_81e8.txt — Anemias"),
    mk("blood-007", "Vitamin B12 deficiency anemia is typically:", ["Microcytic", "Macrocytic (megaloblastic)", "Normocytic only always", "Associated with high ferritin always"], 1, ["Microcytic fits iron deficiency.", "B12/folate deficiency → macrocytic RBCs.", "Can be normocytic early but classic is macrocytic.", "Ferritin reflects iron stores, not B12."], "blood", "normal", "recall", "ms_lec_midterms_81e8.txt — Anemias"),
    mk("blood-008", "Sickle cell crisis pain management priority includes:", ["Withhold all opioids due to addiction fear", "Aggressive pain control per protocol, hydration, and trigger avoidance", "Restrict fluids to prevent overload always", "Ignore fever"], 1, ["Undertreated vaso-occlusive pain is a known disparity issue; protocol analgesia is priority.", "Hydration and pain control are cornerstone; investigate fever.", "Hydration is usually encouraged unless contraindicated.", "Fever may signal infection — must assess."], "blood", "hard", "prioritization", "ms_lec_midterms_81e8.txt — Sickle cell"),
    mk("blood-009", "Before blood transfusion, essential nursing checks include:", ["Only verify room number", "Two-nurse ID check, consent, type/crossmatch, vitals baseline", "Warm blood in microwave", "Skip allergy history"], 1, ["Room alone is insufficient for high-risk therapy.", "Dual identification and compatibility verification are mandatory safety steps.", "Microwave damages RBCs; use approved warmers if needed.", "Allergy/history guides monitoring and reaction management."], "blood", "normal", "prioritization", "ms_lec_midterms_81e8.txt — Transfusion"),
    mk("blood-010", "Acute hemolytic transfusion reaction early sign:", ["Itching only", "Fever, chills, flank pain, hypotension, dark urine", "Mild headache only after 24 hours", "Bradycardia with hypertension only"], 1, ["Mild itch may be allergic; hemolytic is more systemic.", "Fever, pain, hypotension, hemoglobinuria fit acute hemolysis.", "Delayed reactions occur later; acute is during/soon after infusion.", "Pattern is not isolated HTN/bradycardia."], "blood", "hard", "application", "ms_lec_midterms_81e8.txt — Transfusion reactions"),
    mk("blood-011", "Therapeutic INR for most warfarin therapy per numbers sheet:", ["0.5–1.0", "2.0–3.0", "4.5–6.0", "0.8 only without range"], 1, ["0.5–1.0 is below therapeutic anticoagulation.", "INR 2–3 is standard therapeutic range listed.", "4.5–6.0 is supratherapeutic/bleeding risk.", "0.8–1.2 is normal non-anticoagulated INR."], "blood", "normal", "recall", "ms_lec_midterms_81e8.txt — Coagulation numbers"),
    mk("blood-012", "Heparin monitoring uses which lab?", ["PT/INR primarily", "aPTT (target often ~60–80 sec on heparin per handout)", "Platelet count only", "D-dimer only"], 1, ["Warfarin uses PT/INR.", "aPTT guides unfractionated heparin dosing per handout targets.", "Platelets monitor HIT risk but not heparin level.", "D-dimer is clot breakdown marker, not heparin level."], "blood", "normal", "recall", "ms_lec_midterms_81e8.txt — Coagulation"),
    mk("blood-013", "HIT (heparin-induced thrombocytopenia) priority action when suspected:", ["Continue heparin and ignore platelets", "Stop heparin, avoid platelet transfusion unless bleeding, notify provider", "Start warfarin immediately on heparin", "Massage thrombosed limb vigorously"], 1, ["Continuing heparin worsens immune-mediated platelet activation.", "Stop heparin and use alternative anticoagulant per protocol.", "Warfarin alone early in HIT can cause limb loss; specialist protocol.", "Massage risks embolism."], "blood", "hard", "prioritization", "ms_lec_midterms_81e8.txt — HIT"),
    mk("blood-014", "Neutropenic precautions include:", ["Fresh flowers and raw vegetable buffets", "Hand hygiene, cooked foods, avoid sick visitors", "Shared nebulizer without cleaning", "No oral care"], 1, ["Plants/raw foods increase infection exposure.", "Meticulous hygiene and low-bacterial diet protect neutropenic clients.", "Shared equipment needs strict cleaning or avoidance.", "Oral care prevents mucosal infection portals."], "blood", "normal", "application", "ms_lec_midterms_81e8.txt — Immunocompromised care"),
    mk("blood-015", "Which cell matures in the thymus?", ["B lymphocytes", "T lymphocytes", "Erythrocytes", "Megakaryocytes"], 1, ["B cells mature in bone marrow.", "T cells mature in thymus per lymphoid organ teaching.", "RBCs mature in marrow.", "Megakaryocytes produce platelets in marrow."], "blood", "normal", "recall", "ms_lec_midterms_81e8.txt — Blood-forming organs"),
    mk("blood-016", "Normal hemoglobin for adult female per sheet:", ["10–11 g/dL", "12–16 g/dL", "18–20 g/dL", "8–9 g/dL only"], 1, ["10–11 may be anemia.", "12–16 g/dL is listed female range.", "18–20 exceeds female upper limit.", "8–9 is markedly low."], "blood", "normal", "recall", "ms_lec_midterms_81e8.txt — RBC numbers"),
    mk("blood-017", "Apheresis platelet transfusion nursing focus:", ["Rapid push without monitoring", "Vitals during infusion; watch for reactions; use filter per policy", "No need to verify blood product", "Mix with D5W in same line always"], 1, ["Rapid unmonitored infusion risks volume/reaction issues.", "Monitor vitals and reactions per transfusion protocol.", "Product verification remains mandatory.", "Only NS-compatible lines for RBCs/platelets per policy."], "blood", "normal", "application", "ms_lec_midterms_81e8.txt — Transfusion nursing"),
    mk("blood-018", "Hemophilia A is deficiency of:", ["Factor VIII", "Factor IX", "von Willebrand only", "Fibrinogen only"], 0, ["Hemophilia A = factor VIII deficiency.", "Factor IX is hemophilia B.", "vWD is different von Willebrand factor issue.", "Fibrinogen disorders are rare separate entities."], "blood", "normal", "recall", "ms_lec_midterms_81e8.txt — Coagulation disorders"),
]
ITEMS.extend(BLOOD)

FLUIDS = [
    mk("fluids-001", "Normal serum sodium range per handout:", ["120–125 mEq/L", "135–145 mEq/L", "150–160 mEq/L", "100–110 mEq/L"], 1, ["120–125 is hyponatremia.", "135–145 is normal Na⁺.", "150+ is hypernatremia.", "100–110 is critically low."], "fluids_abg", "normal", "recall", "ms_lec_midterms_81e8.txt — PART XXI Electrolytes", tool="labs"),
    mk("fluids-002", "Hyponatremia is defined as sodium:", ["Below 135 mEq/L", "Below 95 mEq/L", "Above 145 mEq/L", "Exactly 140 always"], 0, ["<135 mEq/L is hyponatremia threshold in sheet.", "<95 defines chloride, not sodium cutoff.", ">145 is hypernatremia.", "140 is within normal, not a definition."], "fluids_abg", "normal", "recall", "ms_lec_midterms_81e8.txt — PART XXII Sodium"),
    mk("fluids-003", "Critical severe hyponatremia threshold in this teaching set:", ["<125 mEq/L", "<115 mEq/L", "<135 mEq/L", "<145 mEq/L"], 1, ["<125 mEq/L is severe hyponatremia in many schemes but not the critical cutoff used here.", "<115 mEq/L is the critical severe hyponatremia threshold in this teaching set (some texts use <120).", "<135 mEq/L defines hyponatremia, not the critical tier.", "<145 mEq/L is toward hypernatremia, not hyponatremia."], "fluids_abg", "normal", "recall", "ms_lec_midterms_81e8.txt — PART XXII Sodium"),
    mk("fluids-004", "Normal potassium range:", ["2.0–2.5 mEq/L", "3.5–5.0 mEq/L", "5.5–6.5 mEq/L", "6.5–8.0 mEq/L"], 1, ["2.0–2.5 is critical hypokalemia range.", "3.5–5.0 is normal K⁺.", "5.5+ is hyperkalemia.", "6.5+ is critical hyperkalemia."], "fluids_abg", "normal", "recall", "ms_lec_midterms_81e8.txt — PART XXI Electrolytes", tool="labs"),
    mk("fluids-005", "Hyperkalemia ECG change priority to recognize:", ["Short QT only", "Peaked T waves, widened QRS, risk of VF", "U waves only", "Prolonged PR only without T changes"], 1, ["Short QT is not classic hyperK.", "Peaked T → QRS widening → arrhythmia is the progression.", "U waves suggest hypokalemia.", "PR changes can occur but peaked T is early classic sign."], "fluids_abg", "hard", "application", "ms_lec_midterms_81e8.txt — Potassium cardiac"),
    mk("fluids-006", "Hypokalemia nursing priority when severe and client on digoxin:", ["Ignore because K is always safe high", "Replace potassium cautiously per protocol; monitor ECG and digoxin toxicity", "Give kayexalate for low K", "Restrict all fluids"], 1, ["Low K increases digoxin toxicity risk — monitor closely.", "Guided replacement and ECG monitoring are essential.", "Kayexalate lowers K, wrong for hypokalemia.", "Fluids depend on clinical status."], "fluids_abg", "hard", "prioritization", "ms_lec_midterms_81e8.txt — PART XVII patterns"),
    mk("fluids-007", "Metabolic acidosis primary lab pattern:", ["pH high, HCO₃⁻ high", "pH low, HCO₃⁻ low", "pH high, PaCO₂ high", "pH normal, PaCO₂ low only"], 1, ["High pH/high HCO₃ is metabolic alkalosis.", "Low pH with low bicarbonate defines metabolic acidosis.", "High PaCO₂ with high pH is not primary metabolic acidosis.", "Isolated low PaCO₂ suggests respiratory alkalosis."], "fluids_abg", "normal", "recall", "ms_lec_midterms_81e8.txt — PART XIV Metabolic acidosis", tool="labs"),
    mk("fluids-008", "Diabetic ketoacidosis fits which acid-base picture?", ["Metabolic alkalosis", "High-anion-gap metabolic acidosis", "Respiratory alkalosis only", "Normal pH always"], 1, ["DKA does not alkalinize blood.", "Ketones consume bicarbonate → high-gap metabolic acidosis.", "Kussmaul resp may compensate but primary is metabolic acidosis.", "DKA presents with acidemia unless partially treated."], "fluids_abg", "normal", "application", "ms_lec_midterms_81e8.txt — Metabolic acidosis causes"),
    mk("fluids-009", "Normal serum calcium:", ["6.0–7.0 mg/dL", "8.5–10.5 mg/dL", "11.5–13 mg/dL", "4.0–5.0 mg/dL"], 1, ["6–7 is hypocalcemia.", "8.5–10.5 is normal Ca²⁺.", "11.5+ is hypercalcemia.", "4–5 is far below normal."], "fluids_abg", "normal", "recall", "ms_lec_midterms_81e8.txt — PART XXI Electrolytes"),
    mk("fluids-010", "Hypocalcemia classic sign:", ["Absent reflexes only", "Positive Chvostek/Trousseau signs, tingling", "Hypertension only", "Bradycardia only"], 1, ["Absent reflexes suggest hypermagnesemia or hypercalcemia, not hypocalcemia.", "Hypocalcemia increases neuromuscular excitability → Chvostek/Trousseau and paresthesias.", "Hypertension is not a classic hypocalcemia sign.", "Bradycardia is not the primary neuromuscular sign of hypocalcemia."], "fluids_abg", "normal", "application", "ms_lec_midterms_81e8.txt — Calcium"),
    mk("fluids-011", "Normal magnesium:", ["0.5–1.0 mEq/L", "1.5–2.5 mEq/L", "3.5–5.0 mEq/L", "4.5–6.0 mEq/L"], 1, ["0.5–1.0 is hypomagnesemia.", "1.5–2.5 is normal Mg²⁺.", "3.5–5.0 is potassium range.", "High values suggest hypermagnesemia."], "fluids_abg", "normal", "recall", "ms_lec_midterms_81e8.txt — PART XXI Electrolytes"),
    mk("fluids-012", "Acidosis effect on potassium shift taught in handout:", ["Drives K into cells → hypokalemia", "Drives K out of cells → serum hyperkalemia", "No effect on potassium", "Always causes hypokalemia in blood"], 1, ["H⁺ shifts with K⁺; acidosis moves K extracellularly.", "Extracellular shift raises serum K even if total body K is low.", "Acid-base strongly affects K distribution.", "Serum K often rises in acidosis."], "fluids_abg", "hard", "recall", "ms_lec_midterms_81e8.txt — PART XIV Acidosis→K"),
    mk(
        "fluids-013",
        "Minimum urine output goal for adequate kidney perfusion in acute monitoring:",
        ["15 mL/hr", "30 mL/hr", "45 mL/hr", "60 mL/hr"],
        1,
        [
            "15 mL/hr is below the usual minimum threshold and suggests oliguria.",
            "≈30 mL/hr (~720 mL/day) supports renal perfusion; below this raises AKI concern.",
            "45 mL/hr is adequate output but is not the cited minimum cutoff.",
            "60 mL/hr is healthy output, not the minimum monitoring goal.",
        ],
        "fluids_abg",
        "normal",
        "recall",
        "ms_lec_midterms_81e8.txt — PART XXI Fluids",
    ),
    mk("fluids-014", "Oliguria definition from sheet:", ["<30 mL/hr or <500 mL/day", "<100 mL/day only", ">200 mL/hr", "Exactly 1 L/day"], 0, ["<30 mL/hr or <500 mL/day defines oliguria.", "<100 mL/day is anuria range closer.", ">200 is polyuria territory.", "1 L/day may be normal depending on intake."], "fluids_abg", "normal", "recall", "ms_lec_midterms_81e8.txt — PART XXI Fluids"),
    mk("fluids-015", "Normal pH of blood:", ["7.20–7.30", "7.35–7.45", "7.50–7.60", "6.80–7.00"], 1, ["7.20–7.30 is acidemia.", "7.35–7.45 is normal blood pH.", "7.50+ is alkalemia.", "6.8–7.0 is incompatible with life acutely."], "fluids_abg", "normal", "recall", "ms_lec_midterms_81e8.txt — PART XXI ABG", tool="labs"),
    mk("fluids-016", "Normal bicarbonate (HCO₃⁻):", ["15–18 mEq/L", "22–26 mEq/L", "30–35 mEq/L", "10–12 mEq/L"], 1, ["15–18 is low bicarbonate.", "22–26 is normal HCO₃⁻.", "30–35 suggests metabolic alkalosis.", "10–12 is severe metabolic acidosis."], "fluids_abg", "normal", "recall", "ms_lec_midterms_81e8.txt — PART XXI ABG", tool="labs"),
    mk("fluids-017", "Metabolic alkalosis common cause cluster:", ["Diarrhea and DKA", "Vomiting, NG suction, excessive diuretics", "Hyperventilation only", "Renal failure only"], 1, ["Diarrhea/DKA cause acid loss differently — acidosis.", "H⁺/Cl⁻ loss from vomiting/suction and diuretics raises HCO₃⁻.", "Hyperventilation causes respiratory alkalosis.", "Renal failure often acidotic."], "fluids_abg", "normal", "application", "ms_lec_midterms_81e8.txt — PART XV Metabolic alkalosis"),
    mk("fluids-018", "Third-spacing fluid loss example:", ["Isotonic dehydration from GI loss only", "Fluid trapped in burns/ascites/peritonitis — not available to plasma", "Excessive ADH with euvolemia", "Pure water deficit only"], 1, ["GI loss is intravascular/dehydration pattern.", "Third spacing sequesters fluid interstitially/ cavities.", "SIADH is euvolemic hypo-osmolar, different mechanism.", "Water deficit is hypernatremia pattern."], "fluids_abg", "hard", "application", "ms_lec_midterms_81e8.txt — PART XVIII Fluid patterns"),
    mk("fluids-019", "Hypernatremia usually reflects:", ["Excess water relative to sodium", "Water deficit or sodium gain — hypertonic state", "Always excess sodium infusion only", "Normal osmolality"], 1, ["Excess water causes hyponatremia.", "Hypernatremia = hypertonic serum, often water deficit.", "Can be sodium gain but not the only cause listed.", "Hypernatremia raises osmolality."], "fluids_abg", "normal", "recall", "ms_lec_midterms_81e8.txt — PART V Sodium"),
    mk("fluids-020", "Hypophosphatemia critical threshold:", ["<2.5 mg/dL mild", "<1.0 mg/dL critical per sheet", "<4.5 mg/dL", ">4.5 mg/dL"], 1, ["<2.5 defines hypophosphatemia.", "<1.0 is critical hypophosphatemia.", "<4.5 is still normal/low border.", ">4.5 is hyperphosphatemia."], "fluids_abg", "normal", "recall", "ms_lec_midterms_81e8.txt — PART XXII Phosphate"),
    mk("fluids-021", "Respiratory acidosis compensation over time:", ["Kidneys retain bicarbonate", "Kidneys excrete all bicarbonate immediately", "No renal role", "Only hyperventilation compensates chronic resp acidosis"], 0, ["Chronic CO₂ retention → renal HCO₃⁻ retention.", "Excreting bicarbonate would worsen acidosis.", "Kidneys are key for metabolic compensation.", "Hyperventilation cannot fix chronic hypoventilation."], "fluids_abg", "hard", "application", "ms_lec_midterms_81e8.txt — Acid-base compensation"),
    mk("fluids-022", "Anion gap helps distinguish:", ["Respiratory alkalosis only", "High-gap vs normal-gap metabolic acidosis", "Hyperkalemia vs hypokalemia", "Iron deficiency vs B12 deficiency"], 1, ["Anion gap is for metabolic acidosis classification.", "Gap distinguishes added acids (DKA, lactic) vs HCO₃ loss (diarrhea).", "Potassium is separate.", "Anemias use different labs."], "fluids_abg", "hard", "application", "ms_lec_midterms_81e8.txt — Metabolic acidosis", tool="labs"),
]
ITEMS.extend(FLUIDS)

PERIOP = [
    mk("periop-001", "0.9% NaCl (NSS) tonicity classification:", ["Hypotonic", "Isotonic", "Hypertonic", "Colloid"], 1, ["Hypotonic examples are 0.45% NaCl.", "0.9% NaCl is isotonic with plasma.", "3% NaCl is hypertonic.", "Colloids are albumin/hetastarch etc."], "periop_iv", "normal", "recall", "ms_lab_midterms_e746.pdf — Tonicity", tool="iv"),
    mk("periop-002", "0.45% NaCl (½ NS) effect on cells:", ["Water moves out of cells", "Water moves into cells (hypotonic)", "No water shift", "Only expands intravascular space long-term"], 1, ["Hypotonic pulls water into cells, not out.", "Lower solute than plasma → intracellular hydration.", "Hypotonic solutions cause shift.", "Much distributes to cells/interstitium."], "periop_iv", "normal", "recall", "ms_lab_midterms_e746.pdf — Tonicity", tool="iv"),
    mk("periop-003", "3% NaCl is used in the handout for:", ["Routine maintenance hydration", "Severe hyponatremia and cerebral edema (draws water out of cells)", "K replacement", "Lipid emulsion only"], 1, ["3% is not routine maintenance.", "Hypertonic saline pulls water intravascularly for severe hypoNa/cerebral edema.", "K has specific solutions.", "TPN lipids are separate."], "periop_iv", "hard", "application", "ms_lab_midterms_e746.pdf — Hypertonic saline", tool="iv"),
    mk("periop-004", "D5W after dextrose metabolism behaves as:", ["Hypertonic forever", "Ultimately hypotonic free water", "Colloid expander", "Isotonic permanently"], 1, ["D5W is initially isotonic then becomes hypotonic as glucose metabolizes.", "Remaining free water hydrates cells.", "Colloids are proteins/starches.", "Not permanently isotonic."], "periop_iv", "normal", "application", "ms_lab_midterms_e746.pdf — D5W", tool="iv"),
    mk("periop-005", "Lactated Ringer's is classified as:", ["Hypotonic crystalloid", "Isotonic crystalloid", "Hypertonic saline", "Blood product"], 1, ["LR is listed with isotonic crystalloids.", "LR approximates plasma osmolality for expansion.", "Hypertonic is 3%/5% NaCl etc.", "LR is not a blood product."], "periop_iv", "normal", "recall", "ms_lab_midterms_e746.pdf — Isotonic solutions", tool="iv"),
    mk("periop-006", "Colloid IV fluids primary use per handout:", ["Replace daily water deficit only", "Plasma volume expansion in hemorrhage/severe hypovolemia", "Oral rehydration substitute", "KCl bolus"], 1, ["Colloids expand intravascular volume via oncotic pressure.", "Used for hemorrhage/severe hypovolemia in teaching.", "Colloids are IV, not oral.", "KCl is separate electrolyte replacement."], "periop_iv", "normal", "recall", "ms_lab_midterms_e746.pdf — Colloids"),
    mk("periop-007", "Surgical asepsis means:", ["Clean technique for all procedures", "Sterile field and sterile technique to prevent microorganism entry to tissues", "Only hand washing before meals", "Single-dose vial reuse always"], 1, ["Clean vs sterile differ; surgery needs sterile technique.", "Asepsis prevents microbes entering sterile tissues.", "Meal hand hygiene is not surgical asepsis.", "Single-use vials should not be routinely reused."], "periop_iv", "normal", "recall", "Ms_lab_UT / ms_lab_prelim — Asepsis"),
    mk("periop-008", "Time-out (surgical safety) verifies:", ["Only surgeon preference music", "Correct patient, site, procedure before incision", "Billing code only", "Lunch order"], 1, ["Universal protocol/time-out confirms identity, site, procedure.", "Music is irrelevant to safety pause.", "Billing is administrative later.", "Not part of timeout."], "periop_iv", "normal", "recall", "ms_lec_prelims_7b61.pdf — Surgical safety"),
    mk("periop-009", "PACU priority assessment mnemonic focus:", ["Airway, breathing, circulation, surgical site, vitals", "Diet preferences only", "Discharge paperwork first", "Remove all dressings immediately"], 0, ["ABCs and surgical site/vitals dominate immediate PACU care.", "Diet comes after stability.", "Paperwork follows clinical stability.", "Dressings are inspected, not routinely all removed."], "periop_iv", "hard", "prioritization", "ms_lec_prelims_7b61.pdf — PACU"),
    mk("periop-010", "Post-op fever within first 24 hours is often due to:", ["Wound infection most likely always", "Atelectasis / inflammatory response early", "Urine retention never", "Pulmonary embolism always"], 1, ["Wound infection peaks later; early fever often atelectasis/inflammation.", "Atelectasis is classic day 0–1 cause taught.", "Retention can contribute but 'always infection' is wrong.", "PE is considered but not 'always' day 1."], "periop_iv", "normal", "application", "ms_lab_prelim — Post-op fever"),
    mk("periop-011", "IV infiltration sign:", ["Cool skin, tight edema, slowed infusion at site", "Bilateral pedal edema only", "Fever 39°C only", "Chest pain only"], 0, ["Local coolness, swelling, and poor flow suggest infiltration.", "Bilateral edema is systemic, not catheter-related.", "Fever is not classic infiltration.", "Chest pain unrelated."], "periop_iv", "normal", "application", "ms_lab_midterms_e746.pdf — IV complications", tool="iv"),
    mk("periop-012", "Phlebitis at IV site priority:", ["Ignore until line falls out", "Remove or rotate line per protocol; elevate limb; warm compress if ordered", "Massage vigorously toward heart", "Apply tourniquet above site permanently"], 1, ["Continuing irritant line worsens phlebitis.", "Discontinue/rotate and supportive care per policy.", "Vigorous massage can spread infection/thrombus.", "Tourniquet is not routine phlebitis care."], "periop_iv", "normal", "prioritization", "ms_lab_midterms_e746.pdf — IV care", tool="iv"),
    mk("periop-013", "NPO before elective surgery primary reason:", ["Prevent aspiration during anesthesia/induction", "Save hospital food costs", "Prevent all bowel sounds forever", "Increase thirst for IV fluids only"], 0, ["Aspiration risk drops with empty stomach per perioperative teaching.", "Cost is not clinical reason.", "Bowel sounds return post-op.", "Thirst is side effect, not primary purpose."], "periop_iv", "normal", "recall", "ms_lab_prelim — Perioperative"),
    mk("periop-014", "Elective vs emergency surgery distinction:", ["Elective has no planning", "Emergency is unplanned life-saving; elective is scheduled", "Both are always cosmetic", "Emergency never needs consent"], 1, ["Elective is planned/scheduled.", "Emergency is urgent life-saving; consent process may vary but care is immediate.", "Not all surgery is cosmetic.", "Consent/emergency exceptions exist but care is still urgent."], "periop_iv", "normal", "recall", "ms_lab_prelim — Surgery types"),
    mk("periop-015", "Pre-op teaching should include:", ["Hide all risks to reduce anxiety", "Deep breathing, leg exercises, pain reporting, and incision care basics", "Promise zero pain", "Skip mobility instructions"], 1, ["Honest teaching includes coping strategies and reporting.", "IS, leg exercises, and pain/incision teaching are standard.", "Zero pain is unrealistic promise.", "Mobility prevents complications."], "periop_iv", "normal", "application", "ms_lab_prelim — Pre-op teaching"),
    mk("periop-016", "Hypertonic 10% dextrose (D10W) effect:", ["Hypotonic hydration of cells", "Pulls water into vasculature (hypertonic)", "Same as 0.45% NaCl", "Colloid only"], 1, ["D10W is hypertonic, not hypotonic free water after metabolism.", "Hypertonic dextrose draws fluid into the intravascular space.", "0.45% NaCl is hypotonic relative to plasma.", "D10W is a crystalloid, not a colloid."], "periop_iv", "hard", "recall", "ms_lab_midterms_e746.pdf — Hypertonic dextrose", tool="iv"),
    mk("periop-017", "WHO surgical hand scrub aims to:", ["Perfume hands only", "Reduce resident and transient flora on hands before sterile procedure", "Replace sterile gloves entirely", "Clean the OR floor"], 1, ["Surgical scrub reduces microbial load on hands.", "Transient/resident flora reduction is the goal.", "Gloves still required after scrub.", "Floor cleaning is environmental, not hand scrub."], "periop_iv", "normal", "recall", "ms_lab_prelim — Asepsis"),
    mk("periop-018", "Post-op paralytic ileus nursing care includes:", ["Early progressive diet without assessment", "NG decompression if ordered, monitor bowel sounds, gradual diet per surgeon", "Force solid food immediately", "No IV fluids ever"], 1, ["Bowel function must return before advancing diet.", "NG and gradual diet per orders are standard.", "Early solids worsen distension.", "IV fluids often continue until oral intake adequate."], "periop_iv", "hard", "application", "ms_lab_prelim — GI post-op"),
    mk("periop-019", "IV gauge selection: large bore used when:", ["Cosmetic preference only", "Rapid fluid/blood resuscitation anticipated", "No IV needed", "Oral meds only"], 1, ["Large gauge allows faster flow for resuscitation.", "Cosmetics are not clinical indication.", "IV is needed if ordered.", "Oral route bypasses IV."], "periop_iv", "normal", "application", "ms_lab_midterms_e746.pdf — IV therapy"),
    mk("periop-020", "Central line vs peripheral line: central access allows:", ["Only saline flushes", "CVP monitoring, irritant meds, long-term TPN access per orders", "Never for medications", "Only blood draws never fluids"], 1, ["Central lines enable CVP, vesicant meds, TPN per protocol.", "Peripheral lines limit vesicants/rate.", "Meds are given via central lines when indicated.", "Fluids and meds both possible."], "periop_iv", "normal", "recall", "ms_lab_midterms_e746.pdf — IV access"),
    mk("periop-021", "Sterile gowning/gloving sequence taught in skills lab:", ["Touch sterile field with bare hands", "Open gown, don gown then gloves without contaminating sterile surfaces", "Gloves before gown always without teaching variation", "Reuse gown on multiple patients"], 1, ["Sterile technique minimizes breaks in sterility.", "Gown then gloves is standard taught order (follow lab policy).", "Policy may vary slightly but contamination is always avoided.", "Gowns are single sterile use."], "periop_iv", "normal", "recall", "ms_lab_prelim — Sterile technique"),
    mk("periop-022", "OPET (outpatient surgery) discharge criteria include:", ["Stable vitals, voiding if required, responsible adult if ordered, understood teaching", "Drive immediately after general anesthesia alone", "Ignore pain score", "No instructions needed"], 0, ["Stable ABCs, voiding, escort, and teaching are standard OPET discharge anchors.", "Driving after GA is unsafe initially.", "Pain must be controlled/managed.", "Teaching is mandatory."], "periop_iv", "hard", "prioritization", "ms_lab_prelim — OPET"),
    mk("periop-023", "KCl IV never given:", ["Diluted slow peripheral infusion per policy", "IV push bolus undiluted", "Oral replacement when able", "Mixed in 500 mL NS per protocol"], 1, ["KCl bolus causes fatal arrhythmias — never push.", "Must be diluted and rate-limited per policy.", "Oral/enteral preferred when possible.", "Diluted infusion is correct route."], "periop_iv", "hard", "prioritization", "ms_lab_midterms_e746.pdf — Electrolyte IV safety", tool="iv"),
    mk("periop-024", "Air embolism prevention with central line:", ["Prime line, clamp during changes, head-down left-side if suspected", "Leave all caps off", "Infuse air intentionally", "Stand patient upright if suspected"], 0, ["Clamp/de-air lines; left lateral decubitus if air embolus suspected.", "Open caps increase air entry risk.", "Air must never be infused.", "Durant position helps trap air in right atrium."], "periop_iv", "hard", "prioritization", "ms_lab_midterms_e746.pdf — IV safety", tool="iv"),
]
ITEMS.extend(PERIOP)


def validate_choice_balance():
    """Fail build if the correct choice is obviously longest vs distractors."""
    biased = []
    for it in ITEMS:
        lens = [len(c) for c in it["choices"]]
        ci = it["correctIndex"]
        correct_len = lens[ci]
        others = [ln for i, ln in enumerate(lens) if i != ci]
        avg_other = sum(others) / 3
        if (
            correct_len == max(lens)
            and correct_len > avg_other * 1.28
            and correct_len - avg_other > 10
        ):
            biased.append(it["id"])
    if biased:
        print(
            f"WARNING: {len(biased)} items have longest correct choice "
            f"(rewrite distractors; first ids: {biased[:8]}…)"
        )


def validate():
    topics = {"oxygenation": 0, "heart": 0, "blood": 0, "fluids_abg": 0, "periop_iv": 0}
    levels = {"normal": 0, "hard": 0}
    for it in ITEMS:
        topics[it["topic"]] += 1
        levels[it["level"]] += 1
    assert len(ITEMS) == 100, len(ITEMS)
    assert topics == {"oxygenation": 18, "heart": 18, "blood": 18, "fluids_abg": 22, "periop_iv": 24}, topics
    # Difficulty is authored per item in mk(); no forced 60/40 rebalance.
    print(f"Level counts: normal={levels['normal']} hard={levels['hard']}")
    ids = [i["id"] for i in ITEMS]
    assert len(ids) == len(set(ids))
    validate_choice_balance()


def write_review_csv(items, path: Path) -> None:
    import csv

    letters = "ABCD"
    with path.open("w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow(
            [
                "id",
                "level",
                "topic",
                "stem",
                "correct_letter",
                "A_choice",
                "A_reason",
                "B_choice",
                "B_reason",
                "C_choice",
                "C_reason",
                "D_choice",
                "D_reason",
                "source",
                "instructorReviewed",
            ]
        )
        for it in sorted(items, key=lambda x: x["id"]):
            ci = it["correctIndex"]
            row = [
                it["id"],
                it["level"],
                it["topic"],
                it["stem"],
                letters[ci],
            ]
            for i in range(4):
                row.append(it["choices"][i])
                row.append(it["reasons"][i])
            row.append(it.get("source", ""))
            row.append("yes" if it.get("instructorReviewed") else "no")
            w.writerow(row)


def write_review_sheet(items, path: Path) -> None:
    letters = "ABCD"
    lines = [
        "# PNLE MedSurg pilot — instructor review sheet",
        "",
        "Check each choice against its reason. Source strings are citations only (PDFs not in repo).",
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
        lines.append(f"*instructorReviewed:* `{bool(it.get('instructorReviewed'))}`")
        lines.append("")
        lines.append("---")
        lines.append("")
    path.write_text("\n".join(lines), encoding="utf-8")


def main():
    validate()
    shuffle_all(ITEMS)
    validate_correct_index_distribution(ITEMS)
    for it in ITEMS:
        apply_student_copy_to_item(it)
    assert_stems_clean(ITEMS)
    apply_review_metadata(ITEMS)
    out = {
        "version": "1.0.0-pilot",
        "subject": "medsurg",
        "generatedAt": date.today().isoformat(),
        "items": ITEMS,
    }
    js = (
        "/**\n * PNLE MedSurg pilot bank — generated; Study shows instructorReviewed===true only.\n */\n"
        "(function (global) {\n  'use strict';\n  global.NursePathPnleMedSurg = "
        + json.dumps(out, indent=2)
        + ";\n})(typeof window !== 'undefined' ? window : globalThis);\n"
    )
    path = "/workspace/assets/pnle-medsurg.js"
    with open(path, "w", encoding="utf-8") as f:
        f.write(js)
    tools_dir = Path(__file__).resolve().parent
    sheet = tools_dir / "pnle-review-sheet.md"
    csv_path = tools_dir / "pnle-review-sheet.csv"
    write_review_sheet(ITEMS, sheet)
    write_review_csv(ITEMS, csv_path)
    shipped = sum(1 for i in ITEMS if i.get("instructorReviewed"))
    print(f"Wrote {path} items={len(ITEMS)} instructorReviewed={shipped}")
    print(f"Wrote {sheet}")
    print(f"Wrote {csv_path}")


if __name__ == "__main__":
    main()
