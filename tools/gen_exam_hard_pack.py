#!/usr/bin/env python3
"""One-off generator for tools/pnle_exam_hard_pack.py — run to refresh pack source."""
from __future__ import annotations

import textwrap

SRC = "NCM 112 / MedSurg exam-style Hard bank (author-generated; unofficial)"

# Each entry: id suffix, topic, typ, stem, choices, correct (int or list), reasons
# correct list => SATA
RAW: list[tuple] = []

def q(
    num: int,
    topic: str,
    typ: str,
    stem: str,
    choices: list[str],
    correct,
    reasons: list[str],
):
    RAW.append((f"exam-hard-{num:03d}", topic, typ, stem, choices, correct, reasons))


# —— Oxygenation / pulmonary (16) ——
q(
    1,
    "oxygenation",
    "prioritization",
    "The nurse receives morning reports on four clients. Which client should the nurse see first?",
    [
        "COPD with SpO₂ 92% on 2 L/min O₂ and clear breath sounds",
        "Post-op client with new onset shortness of breath and SpO₂ 88% on room air",
        "Asthma client with wheezes that clear after prescribed bronchodilator",
        "Client with pneumonia completing the third day of IV antibiotics and stable vitals",
    ],
    1,
    [
        "Stable on low-flow oxygen with acceptable saturation.",
        "Sudden hypoxemia after surgery suggests PE, atelectasis, or complication — assess first.",
        "Response to bronchodilator suggests improvement.",
        "Stable on treatment is lower immediate priority.",
    ],
)
q(
    2,
    "oxygenation",
    "application",
    "A client with emphysema is taught pursed-lip breathing. Which outcome indicates the client understands the technique?",
    [
        "Takes rapid shallow breaths through the mouth during exertion",
        "Exhales slowly through pursed lips to prolong exhalation",
        "Holds the breath at the end of inspiration for 30 seconds",
        "Uses abdominal muscles only and avoids using the diaphragm",
    ],
    1,
    [
        "Rapid mouth breathing worsens air trapping.",
        "Prolonged exhalation reduces air trapping and improves gas exchange.",
        "Prolonged breath-holding is not pursed-lip breathing.",
        "Diaphragmatic breathing is encouraged, not avoided.",
    ],
)
q(
    3,
    "oxygenation",
    "nclex_sata",
    "Which actions should the nurse include when caring for a client with active tuberculosis in airborne isolation? Select all that apply.",
    [
        "Place a surgical mask on the client during transport",
        "Use an N95 respirator when entering the room",
        "Keep the door closed and negative pressure when available",
        "Cluster care to limit room entries",
        "Reuse the same N95 without fit-check between shifts",
    ],
    [1, 2, 3],
    [
        "Surgical masks on the client do not replace airborne precautions for staff.",
        "N95 or equivalent respiratory protection is required for airborne pathogens.",
        "Closed door and negative pressure reduce particle spread.",
        "Clustering care limits exposure time.",
        "N95 must be fit-tested and used per policy — not reused improperly.",
    ],
)
q(
    4,
    "oxygenation",
    "prioritization",
    "A client with a new tracheostomy begins coughing violently and cannot speak. The nurse finds the inner cannula obstructed. What should the nurse do first?",
    [
        "Suction the tracheostomy tube",
        "Remove and clean or replace the inner cannula",
        "Call the rapid response team before any intervention",
        "Deflate the cuff completely and leave it deflated",
    ],
    1,
    [
        "Suction helps secretions but a lodged cannula needs removal first.",
        "Restoring airway patency by addressing the obstructed cannula is immediate.",
        "Call for help but do not delay opening the airway.",
        "Cuff management follows patency; blind deflation alone may not clear obstruction.",
    ],
)
q(
    5,
    "oxygenation",
    "evaluation",
    "A client receiving continuous positive airway pressure (CPAP) at home reports morning headaches and daytime sleepiness despite use. Which question is the nurse's priority?",
    [
        "What brand of mask do you prefer?",
        "Is the mask leaking or coming off during sleep?",
        "Do you drink caffeine in the afternoon?",
        "Have you changed your pillow recently?",
    ],
    1,
    [
        "Mask brand is secondary to effectiveness.",
        "Leak or dislodgement reduces delivered pressure and causes poor rest and hypercapnia symptoms.",
        "Caffeine may matter but equipment fit/leak is first.",
        "Pillow change is less likely than mask leak.",
    ],
)
q(
    6,
    "oxygenation",
    "application",
    "A client with cystic fibrosis has thick secretions. Which intervention should the nurse recommend?",
    [
        "Restrict fluids to reduce secretion volume",
        "Perform airway clearance techniques and maintain hydration as ordered",
        "Provide only dry oxygen without humidification",
        "Avoid activity to prevent coughing",
    ],
    1,
    [
        "Fluid restriction thickens secretions.",
        "Hydration and clearance techniques mobilize thick mucus.",
        "Humidification helps thin secretions.",
        "Activity and coughing aid clearance when appropriate.",
    ],
)
q(
    7,
    "oxygenation",
    "prioritization",
    "After chest tube insertion for a pneumothorax, which finding requires immediate action?",
    [
        "Gentle tidaling in the water seal chamber with respiration",
        "Continuous bubbling in the water seal chamber without coughing",
        "Drainage of 50 mL serosanguineous fluid in the first hour",
        "Client reports mild incisional pain rated 3/10",
    ],
    1,
    [
        "Tidaling can be normal early after placement.",
        "Continuous bubbling suggests an air leak that may need assessment.",
        "Small initial drainage can be expected.",
        "Mild pain is common and not the highest priority.",
    ],
)
q(
    8,
    "oxygenation",
    "therapeutic_communication",
    "A client with newly diagnosed lung cancer says, \"I don't see the point of quitting smoking now.\" Which response is most therapeutic?",
    [
        "You should have quit years ago.",
        "Quitting now can still improve treatment tolerance and healing; we can discuss options together.",
        "Smoking doesn't matter once you have cancer.",
        "The doctor will be angry if you keep smoking.",
    ],
    1,
    [
        "Blame shuts down communication.",
        "Acknowledges feelings and offers support with a realistic benefit.",
        "False reassurance minimizes teaching.",
        "Fear-based appeals are not therapeutic.",
    ],
)
q(
    9,
    "oxygenation",
    "application",
    "A client with pulmonary embolism is on anticoagulation. Which finding should the nurse report promptly?",
    [
        "Small ecchymosis at an old venipuncture site",
        "Sudden dyspnea with chest pain and oxygen desaturation",
        "Mild headache relieved by acetaminophen",
        "Steady therapeutic aPTT within range",
    ],
    1,
    [
        "Old bruising may be monitored.",
        "Sudden symptoms may indicate extension of clot or complication — urgent.",
        "Mild headache may be monitored unless severe or neurologic.",
        "Therapeutic aPTT is expected.",
    ],
)
q(
    10,
    "oxygenation",
    "delegation",
    "The charge nurse assigns staff on a pulmonary unit. Which task is appropriate to delegate to an assistive personnel (UAP) who has been trained on the unit?",
    [
        "Teaching incentive spirometry after surgery",
        "Ambulating a stable post-op client with oxygen as ordered",
        "Adjusting oxygen flow rate based on SpO₂ readings",
        "Assessing breath sounds after a bronchodilator",
    ],
    1,
    [
        "Teaching requires nursing judgment.",
        "Ambulation within stable parameters can be delegated with clear orders.",
        "Oxygen titration requires nursing assessment.",
        "Breath sound assessment is nursing.",
    ],
)
q(
    11,
    "oxygenation",
    "application",
    "A client with acute asthma has wheezing, accessory muscle use, and a silent chest on auscultation. What should the nurse recognize?",
    [
        "Improvement because wheezes stopped",
        "Impending respiratory failure — notify provider and prepare for advanced airway support",
        "Expected finding after albuterol only",
        "Sign that bronchodilators should be withheld",
    ],
    1,
    [
        "Silent chest can mean minimal air movement — danger, not improvement.",
        "Severe bronchospasm with silent chest is an emergency.",
        "Not expected without clinical improvement.",
        "Bronchodilators are indicated unless contraindicated.",
    ],
)
q(
    12,
    "oxygenation",
    "nclex_sata",
    "The nurse is discharging a client with obstructive sleep apnea using CPAP. Which instructions should the nurse include? Select all that apply.",
    [
        "Clean the mask and tubing per manufacturer instructions",
        "Stop using CPAP when you feel rested",
        "Report persistent mask discomfort or air leaks",
        "Avoid alcohol and sedatives unless approved by the provider",
        "Use CPAP only when sleeping on the back",
    ],
    [0, 2, 3],
    [
        "Equipment hygiene prevents infection and maintains function.",
        "CPAP should be used consistently as prescribed, not stopped when rested.",
        "Leak and fit problems reduce effectiveness.",
        "Sedatives and alcohol worsen apnea.",
        "CPAP is used for all sleep positions unless otherwise directed.",
    ],
)
q(
    13,
    "oxygenation",
    "application",
    "A client with cor pulmonale related to chronic lung disease develops peripheral edema. Which pathophysiology should the nurse understand?",
    [
        "Left ventricular failure is the primary cause",
        "Right ventricular strain from pulmonary hypertension leads to fluid retention",
        "Excess aldosterone is unrelated to cor pulmonale",
        "Edema indicates only renal failure",
    ],
    1,
    [
        "Cor pulmonale is right-sided failure from lung disease.",
        "RV failure increases venous pressure and edema.",
        "Neurohormonal changes can contribute to fluid retention.",
        "Edema has multiple causes; context is RV failure here.",
    ],
)
q(
    14,
    "oxygenation",
    "prioritization",
    "Four clients need spirometry teaching. Which client should the nurse teach first?",
    [
        "Pre-op client scheduled for abdominal surgery tomorrow",
        "Client with stable chronic bronchitis in for routine follow-up",
        "Client discharged last week who already demonstrated IS correctly",
        "Client with mild allergic rhinitis",
    ],
    0,
    [
        "Pre-op IS teaching prevents post-op atelectasis — time-sensitive.",
        "Chronic stable client is important but less urgent than pre-op.",
        "Already demonstrated skill needs reinforcement only.",
        "Rhinitis is lower priority for IS.",
    ],
)
q(
    15,
    "oxygenation",
    "application",
    "A client on a ventilator has high peak airway pressures and decreased breath sounds on the right. What should the nurse suspect first?",
    [
        "Pneumothorax or mainstem intubation on the right",
        "Improved compliance from resolving edema",
        "Excess humidity in the circuit only",
        "Normal finding during suctioning",
    ],
    0,
    [
        "Unilateral decreased sounds with high pressures suggest pneumothorax or malposition.",
        "Improving compliance lowers pressures.",
        "Humidity affects resistance but unilateral findings point elsewhere.",
        "Not normal without intervention.",
    ],
)
q(
    16,
    "oxygenation",
    "evaluation",
    "A client with DVT on anticoagulation asks about air travel in two weeks. Which instruction is most appropriate?",
    [
        "Travel is forbidden forever",
        "Discuss plans with the provider; compression, movement, and medication timing may be advised",
        "Stop anticoagulation before flying to prevent bleeding",
        "Wear tight knee-high stockings only at the airport",
    ],
    1,
    [
        "Absolute prohibition is not always required.",
        "Provider-guided plan balances clot risk and bleeding risk.",
        "Stopping anticoagulation increases clot risk.",
        "Stockings alone are insufficient teaching.",
    ],
)

# Heart (20) — nums 17-36
q(
    17,
    "heart",
    "prioritization",
    "Which client should the nurse assess first?",
    [
        "Stable angina relieved by rest and nitroglycerin",
        "Chest pain unrelieved by nitroglycerin with diaphoresis",
        "Hypertension reading 148/92 before morning medications",
        "Client post cardiac catheterization with warm, dry insertion site",
    ],
    1,
    [
        "Stable pattern with relief is monitored.",
        "Unrelieved pain with diaphoresis suggests MI — immediate assessment.",
        "Mild elevation may be treated per protocol but not first.",
        "Stable site is lower priority.",
    ],
)
q(
    18,
    "heart",
    "application",
    "A client with atrial fibrillation has an irregularly irregular pulse and is on apixaban. Which intervention is essential?",
    [
        "Assess for signs of bleeding and stroke risk factors",
        "Massage the carotid artery to restore rhythm",
        "Hold apixaban whenever the pulse is irregular",
        "Encourage vigorous isometric exercise during episodes",
    ],
    0,
    [
        "Anticoagulation requires bleeding precautions and stroke risk awareness.",
        "Carotid massage is not routine nursing action for AF.",
        "Do not hold anticoagulant without provider order.",
        "Strenuous isometrics may be contraindicated.",
    ],
)
q(
    19,
    "heart",
    "nclex_sata",
    "Which findings are consistent with left-sided heart failure? Select all that apply.",
    [
        "Crackles in lung bases",
        "Jugular venous distention as the earliest sign",
        "Orthopnea and frothy pink sputum",
        "Peripheral pitting edema as the primary lung finding",
        "Pulmonary congestion on chest x-ray",
    ],
    [0, 2, 4],
    [
        "Pulmonary crackles reflect fluid in alveoli.",
        "JVD is more classic for right-sided failure.",
        "Orthopnea and pink frothy sputum are left-sided congestion signs.",
        "Peripheral edema is more right-sided.",
        "CXR may show vascular congestion.",
    ],
)
q(
    20,
    "heart",
    "prioritization",
    "A client with suspected acute myocardial infarction is admitted. Which order should the nurse implement first?",
    [
        "Morphine sulfate IV as ordered",
        "Obtain 12-lead ECG and attach continuous monitor",
        "Administer stool softeners",
        "Schedule cardiac rehabilitation education",
    ],
    1,
    [
        "Pain control follows stabilization and diagnosis support.",
        "ECG and monitoring guide reperfusion therapy — early priority.",
        "Stool softeners are not first in acute MI.",
        "Rehab is later in the course.",
    ],
)
q(
    21,
    "heart",
    "application",
    "A client receiving IV heparin has aPTT 110 seconds (goal 60–80). What should the nurse do?",
    [
        "Continue infusion unchanged",
        "Hold heparin and notify the provider per protocol",
        "Double the infusion rate",
        "Administer protamine without an order",
    ],
    1,
    [
        "Supratherapeutic aPTT increases bleeding risk.",
        "Hold and notify per anticoagulation protocol.",
        "Increasing rate worsens supratherapeutic level.",
        "Protamine requires provider order and calculation.",
    ],
)
q(
    22,
    "heart",
    "therapeutic_communication",
    "A client afraid of dying during a cardiac catheterization says, \"What if my heart stops on the table?\" Which response is best?",
    [
        "Don't worry, that never happens.",
        "The team monitors you closely and is prepared for emergencies; tell me what you're most worried about.",
        "You shouldn't have agreed to the procedure.",
        "Think positive thoughts only.",
    ],
    1,
    [
        "False reassurance dismisses fear.",
        "Validates concern, explains safety measures, invites expression.",
        "Blaming is non-therapeutic.",
        "Minimizing feelings blocks trust.",
    ],
)
q(
    23,
    "heart",
    "application",
    "Which murmur description best matches mitral regurgitation?",
    [
        "Harsh systolic ejection murmur at the right upper sternal border",
        "Holosystolic murmur at the apex radiating to the axilla",
        "Diastolic decrescendo murmur at the left sternal border",
        "Fixed split S2 at the left upper sternal border",
    ],
    1,
    [
        "RUSB systolic ejection suggests aortic stenosis.",
        "Apical holosystolic radiating to axilla fits MR.",
        "Diastolic decrescendo suggests aortic regurgitation.",
        "Fixed split S2 suggests ASD.",
    ],
)
q(
    24,
    "heart",
    "prioritization",
    "After pacemaker insertion, which finding should the nurse report immediately?",
    [
        "Mild soreness at the pocket site",
        "Hiccups that persist with pacing spikes on monitor",
        "Stable telemetry with capture",
        "Small dressing stain the size of a dime",
    ],
    1,
    [
        "Mild soreness is expected.",
        "Diaphragmatic pacing from lead malposition causes hiccups — notify provider.",
        "Capture is desired.",
        "Minimal staining may be monitored.",
    ],
)
q(
    25,
    "heart",
    "application",
    "A client with heart failure is prescribed furosemide and digoxin. Which lab is most important to monitor?",
    [
        "Potassium",
        "Sodium only",
        "Cholesterol",
        "Blood urea nitrogen only",
    ],
    0,
    [
        "Diuretic-induced hypokalemia increases digoxin toxicity risk.",
        "Sodium matters but K⁺ is the classic pair here.",
        "Lipids are not the immediate interaction.",
        "BUN reflects renal function but K⁺ is priority with digoxin.",
    ],
)
q(
    26,
    "heart",
    "nclex_sata",
    "Which teaching points should the nurse include for a client with a new automatic implantable cardioverter-defibrillator (AICD)? Select all that apply.",
    [
        "Avoid placing cell phones directly over the device pocket",
        "Report dizziness, palpitations, or shocks to the provider",
        "Resume driving immediately without provider guidance",
        "Wear a medical alert identifier",
        "Avoid MRI unless cleared by the electrophysiology team",
    ],
    [0, 1, 3, 4],
    [
        "Electromagnetic interference precautions are taught.",
        "Symptoms and shocks need evaluation.",
        "Driving restrictions depend on local law and provider orders.",
        "Alert jewelry aids emergency care.",
        "MRI is generally contraindicated unless device is MRI-conditional and cleared.",
    ],
)
q(
    27,
    "heart",
    "application",
    "A client with pericarditis complains of sharp chest pain worse when lying flat and better leaning forward. Which position should the nurse encourage?",
    [
        "Supine with legs elevated",
        "High Fowler's or leaning forward",
        "Prone with pillow under abdomen",
        "Trendelenburg",
    ],
    1,
    [
        "Supine often worsens pericarditic pain.",
        "Sitting up/leaning forward reduces pericardial friction.",
        "Prone is not typical relief position.",
        "Trendelenburg is not indicated.",
    ],
)
q(
    28,
    "heart",
    "prioritization",
    "During cardiac arrest with a shockable rhythm, what is the priority after defibrillation?",
    [
        "Check pulse for two minutes before compressions",
        "Resume high-quality CPR immediately",
        "Administer oral fluids",
        "Place client in side-lying recovery position",
    ],
    1,
    [
        "Brief pulse check only; prolonged pause harms outcomes.",
        "Immediate CPR after shock per ACLS.",
        "Oral fluids are contraindicated.",
        "Recovery position is for unconscious breathing clients, not arrest.",
    ],
)
q(
    29,
    "heart",
    "application",
    "A client with infective endocarditis is on IV antibiotics. Which assessment finding suggests complication?",
    [
        "Low-grade fever day 2 of therapy",
        "New murmur with splinter hemorrhages and petechiae",
        "Mild fatigue",
        "Stable WBC trending down",
    ],
    1,
    [
        "Early low fever may persist initially.",
        "Embolic/vascular phenomena with murmur change need urgent evaluation.",
        "Fatigue alone is nonspecific.",
        "Improving WBC is favorable.",
    ],
)
q(
    30,
    "heart",
    "delegation",
    "Which activity can the nurse delegate to experienced UAP for a stable cardiac client?",
    [
        "Interpret rhythm strip changes",
        "Measure and record daily weights",
        "Titrate nitroglycerin drip",
        "Educate on sodium restriction",
    ],
    1,
    [
        "Rhythm interpretation is nursing.",
        "Routine weights with clear parameters can be delegated.",
        "IV titration is nursing.",
        "Teaching is nursing.",
    ],
)
q(
    31,
    "heart",
    "application",
    "A client reports chest pain after eating a large meal and lying down. Which condition is most likely?",
    [
        "Stable angina with exertion",
        "Gastroesophageal reflux mimicking angina",
        "Pericarditis pain pattern",
        "Aortic dissection tearing pain to back",
    ],
    1,
    [
        "Exertional pattern differs.",
        "Postprandial supine pain suggests reflux.",
        "Pericarditis improves leaning forward.",
        "Dissection is sudden severe ripping pain.",
    ],
)
q(
    32,
    "heart",
    "prioritization",
    "A client with hypertension has a reading of 210/120 mmHg with headache and blurred vision. What should the nurse do first?",
    [
        "Recheck BP in one week",
        "Notify provider and assess neurologic status; prepare for hypertensive emergency protocol",
        "Administer PRN acetaminophen only",
        "Encourage strenuous exercise to lower BP",
    ],
    1,
    [
        "Severe BP with symptoms is an emergency.",
        "Hypertensive emergency requires immediate provider involvement.",
        "Analgesic alone is insufficient.",
        "Exercise is contraindicated acutely.",
    ],
)
q(
    33,
    "heart",
    "application",
    "Which electrolyte imbalance increases the risk of digoxin toxicity?",
    [
        "Hyperkalemia",
        "Hypokalemia",
        "Hypercalcemia only",
        "Hypermagnesemia",
    ],
    1,
    [
        "High K⁺ generally reduces digoxin effect/toxicity risk.",
        "Low K⁺ sensitizes the myocardium to digoxin.",
        "Calcium affects contractility but K⁺ is classic.",
        "High magnesium is not the classic toxicity trigger.",
    ],
)
q(
    34,
    "heart",
    "evaluation",
    "A client with a mechanical heart valve is on warfarin. INR is 1.4 (goal 2.5–3.5). Which action is appropriate?",
    [
        "Continue warfarin; INR is therapeutic",
        "Notify provider; subtherapeutic INR increases thrombosis risk",
        "Hold warfarin permanently",
        "Double the dose without consulting anyone",
    ],
    1,
    [
        "1.4 is below goal for mechanical valve.",
        "Provider may adjust dose — clot risk is elevated.",
        "Do not stop without order.",
        "Nurses do not independently double warfarin.",
    ],
)
q(
    35,
    "heart",
    "nclex_sata",
    "Which interventions should the nurse include for a client with acute decompensated heart failure and pulmonary edema? Select all that apply.",
    [
        "Administer oxygen and position upright",
        "Encourage large volumes of oral fluids",
        "Monitor breath sounds and SpO₂",
        "Prepare for diuretic and vasodilator therapy as ordered",
        "Ignore weight changes",
    ],
    [0, 2, 3],
    [
        "Upright position and oxygen improve work of breathing.",
        "Fluid restriction/restriction of excess intake is usual — large volumes worsen edema.",
        "Ongoing respiratory monitoring is essential.",
        "Diuretics and vasodilators are cornerstone therapy.",
        "Daily weights track fluid status.",
    ],
)
q(
    36,
    "heart",
    "application",
    "A client with second-degree AV block type II on monitor has dropped QRS complexes. What should the nurse anticipate?",
    [
        "No treatment ever required",
        "Possible temporary transcutaneous pacing or permanent pacemaker",
        "Only oral beta-blocker increase",
        "Discharge home without monitoring",
    ],
    1,
    [
        "Mobitz II can progress to complete heart block.",
        "Pacing is often required.",
        "Beta-blockers may worsen conduction.",
        "Requires monitoring and intervention.",
    ],
)

# Blood (16) — 37-52
for i, item in enumerate(
    [
        (
            "prioritization",
            "Which client should the nurse see first?",
            [
                "Sickle cell client with fever 38.9°C and joint pain",
                "Iron-deficiency anemia client taking oral iron with constipation",
                "Postpartum client with Hgb 10 g/dL and no symptoms",
                "Client post transfusion 2 hours ago, stable vitals",
            ],
            0,
            [
                "Fever in sickle cell suggests infection/sequestration — urgent.",
                "Constipation is common and manageable.",
                "Mild asymptomatic anemia can wait.",
                "Stable post-transfusion is lower priority.",
            ],
        ),
        (
            "nclex_sata",
            "Which interventions are appropriate for a client with thrombocytopenia? Select all that apply.",
            [
                "Use an electric razor for shaving",
                "Encourage contact sports",
                "Monitor for petechiae and mucosal bleeding",
                "Avoid IM injections when possible",
                "Apply firm pressure after venipuncture",
            ],
            [0, 2, 3, 4],
            [
                "Electric razors reduce skin trauma.",
                "Contact sports increase bleeding risk.",
                "Bleeding signs need monitoring.",
                "IM injections can cause hematomas.",
                "Pressure prevents bleeding at sites.",
            ],
        ),
        (
            "prioritization",
            "A client receiving a PRBC transfusion develops flank pain and red urine. What should the nurse do first?",
            [
                "Slow the transfusion to half rate",
                "Stop the transfusion and maintain IV line with normal saline",
                "Administer antihistamine",
                "Document and continue if vitals stable",
            ],
            1,
            [
                "Slowing may still allow hemolysis.",
                "Acute hemolytic reaction — stop blood immediately.",
                "Antihistamine does not treat hemolysis.",
                "Never continue with hemolysis signs.",
            ],
        ),
        (
            "application",
            "Which finding is most consistent with vitamin B12 deficiency anemia?",
            [
                "MCV 68 fL with microcytic cells",
                "MCV 110 fL with neurologic tingling",
                "Normal MCV with high ferritin",
                "Low reticulocyte count only without size change",
            ],
            1,
            [
                "Microcytic pattern fits iron deficiency.",
                "Macrocytosis plus neuro symptoms fit B12 deficiency.",
                "High ferritin suggests iron overload.",
                "Size change helps classify anemia.",
            ],
        ),
        (
            "therapeutic_communication",
            "A client refuses a blood transfusion for religious reasons and is alert. What is the nurse's best action?",
            [
                "Transfuse anyway in the client's best interest",
                "Ensure informed refusal is documented and notify provider; respect autonomous decision",
                "Hide the consent form",
                "Tell family to convince client without involving provider",
            ],
            1,
            [
                "Competent adults may refuse after informed decision.",
                "Document, advocate, and involve provider for alternatives.",
                "Consent must be transparent.",
                "Family pressure without ethics/provider involvement is inappropriate.",
            ],
        ),
        (
            "application",
            "A client with DIC has prolonged PT, low fibrinogen, and petechiae. Which nursing priority is most important?",
            [
                "Prevent injury and monitor bleeding",
                "Encourage vigorous coughing exercises",
                "Massage reddened areas firmly",
                "Discontinue all IV access regardless of orders",
            ],
            0,
            [
                "Bleeding precautions are central in DIC.",
                "Aggressive coughing may traumatize tissues.",
                "Firm massage increases bruising.",
                "IV access may be needed for treatment — follow orders.",
            ],
        ),
        (
            "prioritization",
            "Four clients need phlebotomy. Which order should the nurse question?",
            [
                "CBC on client with severe thrombocytopenia when labs are due",
                "Repeat hemolysis labs during suspected transfusion reaction",
                "Routine yearly lipids on stable client",
                "Type and screen pre-op tomorrow",
            ],
            0,
            [
                "Needles with very low platelets need provider judgment — may question timing.",
                "Labs are indicated during reaction workup.",
                "Routine lipids are standard.",
                "Pre-op type and screen is appropriate.",
            ],
        ),
        (
            "application",
            "Oral iron teaching: which client statement shows understanding?",
            [
                "I will take iron with my morning coffee",
                "I will take iron on an empty stomach if tolerated and expect dark stools",
                "Iron will raise my platelet count within hours",
                "I can stop iron when I feel less tired",
            ],
            1,
            [
                "Coffee/tea inhibit absorption.",
                "Empty stomach improves absorption; dark stools are expected.",
                "Iron treats anemia, not platelets acutely.",
                "Complete course per provider.",
            ],
        ),
        (
            "nclex_sata",
            "Before starting a transfusion, which actions should the nurse complete? Select all that apply.",
            [
                "Verify blood product with another licensed nurse per policy",
                "Obtain vital signs baseline",
                "Confirm informed consent",
                "Use 0.9% NS with blood administration set",
                "Warm blood in a microwave",
            ],
            [0, 1, 2, 3],
            [
                "Two-nurse verification is standard.",
                "Baseline vitals detect reactions.",
                "Consent is required.",
                "0.9% NS is compatible; D5W is not.",
                "Microwave damages cells — never warm that way.",
            ],
        ),
        (
            "application",
            "A client with polycythemia vera has elevated hematocrit. Which intervention may be ordered?",
            [
                "Therapeutic phlebotomy and hydration",
                "Force oral iron supplements",
                "Restrict all fluids",
                "Encourage high altitude travel",
            ],
            0,
            [
                "Phlebotomy reduces viscosity.",
                "Iron is not indicated unless deficient.",
                "Hydration helps viscosity.",
                "Altitude worsens hypoxia stimulus.",
            ],
        ),
        (
            "evaluation",
            "A client on epoetin alfa for anemia of chronic kidney disease should monitor for which effect?",
            [
                "Hypertension",
                "Immediate cure of kidney failure",
                "Guaranteed iron overload without labs",
                "Loss of all need for dialysis",
            ],
            0,
            [
                "EPO can raise BP — monitor.",
                "CKD persists; EPO treats anemia.",
                "Iron status is monitored.",
                "Dialysis needs continue per plan.",
            ],
        ),
        (
            "prioritization",
            "A client with neutropenia has ANC 400/mm³. Which precaution is essential?",
            [
                "Fresh flowers and raw vegetable salads from home",
                "Strict hand hygiene and avoid ill visitors",
                "Shared nebulizer without cleaning",
                "No oral care",
            ],
            1,
            [
                "Fresh flora and raw foods increase infection risk.",
                "Hand hygiene and visitor restrictions reduce exposure.",
                "Shared equipment increases infection risk.",
                "Oral care is important with gentle technique.",
            ],
        ),
        (
            "application",
            "Which symptom cluster suggests iron-deficiency anemia?",
            [
                "Pica, brittle nails, and glossitis",
                "Jaundice and dark urine only",
                "Flushed skin and weight gain only",
                "Polyuria and polydipsia only",
            ],
            0,
            [
                "Pica and epithelial changes fit iron deficiency.",
                "Jaundice suggests hemolysis.",
                "Flushing is not classic.",
                "Diabetes symptoms unrelated.",
            ],
        ),
        (
            "delegation",
            "For a stable client post autologous blood donation prep, which task can be delegated?",
            [
                "Assess for dizziness after donation",
                "Escort ambulatory client to restroom with standby assistance per policy",
                "Interpret hemoglobin result",
                "Decide if client may donate",
            ],
            1,
    [
                "Assessment of reactions is nursing.",
                "Escort with training may be delegated with parameters.",
                "Interpretation is nursing.",
                "Eligibility is provider/nurse decision.",
            ],
        ),
        (
            "application",
            "A client with HIT (heparin-induced thrombocytopenia) should expect:",
            [
                "Continued heparin infusion",
                "Alternative non-heparin anticoagulant per provider",
                "Platelet transfusion routinely",
                "No change in therapy",
            ],
            1,
            [
                "All heparin products must stop in HIT.",
                "Direct thrombin inhibitors or similar are used.",
                "Platelets are generally avoided unless bleeding.",
                "HIT is immune-mediated thrombosis risk.",
            ],
        ),
        (
            "prioritization",
            "After bone marrow biopsy, which finding needs immediate report?",
            [
                "Mild pressure pain at site",
                "Bleeding that soaks dressings with tachycardia",
                "Small bruise at site",
                "Anxiety before procedure",
            ],
            1,
            [
                "Mild pain is expected.",
                "Significant bleeding with tachycardia is hemorrhage — act.",
                "Small bruise can be monitored.",
                "Anxiety is pre-procedure.",
            ],
        ),
    ],
    start=37,
):
    typ, stem, choices, correct, reasons = item[0], item[1], item[2], item[3], item[4]
    q(num=i, topic="blood", typ=typ, stem=stem, choices=choices, correct=correct, reasons=reasons)

# Fluids / ABG (16) — 53-68
fluids_items = [
    (
        "application",
        "ABG: pH 7.31, PaCO₂ 55, HCO₃⁻ 26. Which interpretation is correct?",
        ["Respiratory acidosis", "Metabolic acidosis", "Respiratory alkalosis", "Metabolic alkalosis"],
        0,
        [
            "Low pH with elevated PaCO₂ indicates respiratory acidosis.",
            "Metabolic acidosis would show low HCO₃⁻.",
            "Alkalosis has high pH.",
            "Metabolic alkalosis has high HCO₃⁻.",
        ],
    ),
    (
        "prioritization",
        "A client has serum sodium 118 mEq/L and confusion. What should the nurse do first?",
        [
            "Encourage free water bolus orally",
            "Notify provider and implement seizure precautions; prepare for cautious sodium correction",
            "Administer 3% saline IV push bolus independently",
            "Restrict all sodium including maintenance IV fluids",
        ],
        1,
        [
            "Water bolus worsens hyponatremia.",
            "Severe hyponatremia with neuro symptoms is emergency — provider-driven correction.",
            "Hypertonic saline is never IV push without protocol.",
            "Correction is calculated — not blanket restriction only.",
        ],
    ),
    (
        "nclex_sata",
        "Which findings are consistent with hypokalemia? Select all that apply.",
        [
            "Flattened T waves on ECG",
            "Muscle weakness",
            "Paralytic ileus",
            "Peaked T waves",
            "Increased risk of digoxin toxicity",
        ],
        [0, 1, 2, 4],
        [
            "Flat T waves and U waves occur with low K⁺.",
            "Weakness is common.",
            "GI motility decreases.",
            "Peaked T waves suggest hyperkalemia.",
            "Low K⁺ sensitizes heart to digoxin.",
        ],
    ),
    (
        "application",
        "A client with metabolic alkalosis and vomiting is most likely losing:",
        [
            "Hydrochloric acid from stomach",
            "Bicarbonate only",
            "Potassium only without acid loss",
            "No electrolytes",
        ],
        0,
        [
            "Vomiting loses gastric HCl leading to alkalosis.",
            "Bicarbonate is not primary loss in vomiting.",
            "K⁺ can be lost but acid loss drives alkalosis.",
            "Electrolyte losses occur.",
        ],
    ),
    (
        "prioritization",
        "Which client should the nurse assess first?",
        [
            "Hypernatremia with dry mucosa and confusion",
            "Mild hypocalcemia without symptoms",
            "Chronic metabolic acidosis with stable compensating HCO₃⁻",
            "Client receiving maintenance IV fluids at prescribed rate",
        ],
        0,
        [
            "Hypernatremia with neuro changes needs urgent evaluation.",
            "Asymptomatic mild hypoCa is lower priority.",
            "Chronic compensated states are monitored.",
            "Stable maintenance is routine.",
        ],
    ),
    (
        "application",
        "A client receiving large-volume IV 0.9% NS may develop:",
        [
            "Hypernatremia and hyperchloremic metabolic acidosis",
            "Hypotonic hyponatremia immediately always",
            "Hyperkalemia from saline",
            "No electrolyte effect",
        ],
        0,
        [
            "Isotonic saline excess can cause hypernatremia and acidosis.",
            "Saline is not hypotonic.",
            "Saline does not provide K⁺.",
            "Fluids shift electrolytes.",
        ],
    ),
    (
        "therapeutic_communication",
        "A client on fluid restriction says, \"I am thirsty all the time.\" Which response is best?",
        [
            "Too bad; you cannot drink anything ever.",
            "Let's review your allowed fluids for the day and use ice chips or mouth care to help comfort.",
            "Drink water secretly so the doctor doesn't know.",
            "Thirst means you need IV bolus now.",
        ],
        1,
        [
            "Dismissive response harms rapport.",
            "Collaborative planning and comfort measures are appropriate.",
            "Encouraging deception is unsafe.",
            "Bolus requires assessment and orders.",
        ],
    ),
    (
        "application",
        "Serum potassium 6.2 mEq/L with peaked T waves. Which intervention should the nurse anticipate first?",
        [
            "Calcium gluconate IV to stabilize myocardium",
            "Oral potassium supplement",
            "Kayexelate only without cardiac protection",
            "Discharge home",
        ],
        0,
        [
            "Calcium stabilizes cardiac membrane in hyperkalemia.",
            "Oral K worsens hyperkalemia.",
            "Kayexelate helps elimination but cardiac protection comes first.",
            "6.2 with ECG changes is inpatient care.",
        ],
    ),
    (
        "nclex_sata",
        "Which assessments support monitoring of fluid balance in heart failure? Select all that apply.",
        [
            "Daily weight",
            "Intake and output",
            "Breath sounds",
            "Ignore edema",
            "Jugular venous distention",
        ],
        [0, 1, 2, 4],
        [
            "Weight tracks fluid retention.",
            "I&O documents balance.",
            "Lungs reveal pulmonary congestion.",
            "Edema must be assessed.",
            "JVD reflects volume status.",
        ],
    ),
    (
        "application",
        "A client with SIADH has concentrated urine and low serum sodium. Which fluid restriction teaching applies?",
        [
            "Increase oral free water intake",
            "Restrict fluids as ordered to prevent worsening hyponatremia",
            "Drink only hypertonic beverages",
            "No monitoring needed",
        ],
        1,
        [
            "More water worsens SIADH dilution.",
            "Fluid restriction is cornerstone therapy.",
            "Hypertonic drinks are not routine home teaching.",
            "Na⁺ and neuro status need monitoring.",
        ],
    ),
    (
        "prioritization",
        "After NG tube irrigation, the client develops dyspnea and absent breath sounds on the left. What should the nurse suspect?",
        [
            "Pulmonary embolism only",
            "Possible aspiration or pneumothorax — stop and assess airway",
            "Expected finding",
            "Hyperkalemia",
        ],
        1,
        [
            "PE is possible but acute unilateral findings after procedure suggest aspiration/pneumothorax.",
            "Airway and respiratory emergency take priority.",
            "Not expected.",
            "Unrelated acute presentation.",
        ],
    ),
    (
        "application",
        "ABG pH 7.48, PaCO₂ 30, HCO₃⁻ 22. Best interpretation:",
        ["Respiratory alkalosis", "Metabolic alkalosis", "Respiratory acidosis", "Normal"],
        0,
        [
            "High pH with low PaCO₂ fits respiratory alkalosis.",
            "Metabolic alkalosis has high HCO₃⁻.",
            "Acidosis has low pH.",
            "Values are abnormal.",
        ],
    ),
    (
        "evaluation",
        "A client with burns receives LR per protocol. Which lab trend suggests adequate resuscitation?",
        [
            "Rising hematocrit from hemoconcentration only",
            "Stable urine output about 0.5 mL/kg/hr and improving mental status",
            "Serum sodium 155 with oliguria",
            "Metabolic alkalosis with no urine output",
        ],
        1,
        [
            "Rising Hct may mean ongoing hypovolemia.",
            "Urine output and mentation reflect perfusion.",
            "Hypernatremia and oliguria are concerning.",
            "No urine output is failure.",
        ],
    ),
    (
        "application",
        "Which IV solution is hypotonic after metabolism and provides free water?",
        ["0.45% NaCl", "3% NaCl", "D5W after insulin metabolism", "0.9% NaCl"],
        2,
        [
            "0.45% is hypotonic relative to plasma but D5W becomes free water after glucose use.",
            "3% is hypertonic.",
            "D5W distributes as water after metabolism — classic teaching.",
            "0.9% is isotonic.",
        ],
    ),
    (
        "prioritization",
        "A client has magnesium 1.0 mEq/L with tremors and increased deep tendon reflexes. Which priority applies?",
        [
            "Seizure precautions and magnesium replacement per order",
            "Encourage vigorous exercise",
            "Restrict breathing exercises",
            "No monitoring",
        ],
        0,
        [
            "Low Mg increases neuromuscular irritability and seizure risk.",
            "Exercise does not replace Mg.",
            "Breathing exercises are not contraindicated.",
            "Requires monitoring and replacement.",
        ],
    ),
    (
        "application",
        "A client with chronic respiratory failure has compensated CO₂ retention. Expected ABG pattern:",
        [
            "Low PaCO₂ with low HCO₃⁻",
            "High PaCO₂ with elevated HCO₃⁻ and near-normal pH",
            "Low PaCO₂ with high pH always",
            "Normal PaCO₂ with low HCO₃⁻",
        ],
        1,
        [
            "Uncompensated would alter pH markedly.",
            "Renal retention of HCO₃⁻ compensates chronic hypercapnia.",
            "Low PaCO₂ is not retention.",
            "Pattern does not fit.",
        ],
    ),
]
for idx, item in enumerate(fluids_items, start=53):
    typ, stem, choices, correct, reasons = item
    q(idx, "fluids_abg", typ, stem, choices, correct, reasons)

# Periop / IV (12) — 69-80
periop_items = [
    (
        "prioritization",
        "Pre-op client took warfarin at home this morning for atrial fibrillation. Elective surgery is in 4 hours. What should the nurse do first?",
        [
            "Proceed without telling anyone",
            "Notify surgeon and anesthesia per protocol; verify INR and hold plan",
            "Give vitamin K IM without order",
            "Cancel surgery independently",
        ],
        1,
        [
            "Anticoagulation must be communicated before surgery.",
            "Team coordinates hold/reversal based on INR and risk.",
            "Vitamin K requires order.",
            "Nurse does not unilaterally cancel.",
        ],
    ),
    (
        "nclex_sata",
        "Which actions reduce surgical site infection risk? Select all that apply.",
        [
            "Hair removal by clipping if needed",
            "Shaving the site with a razor the night before",
            "Perioperative antibiotics per orders",
            "Hand hygiene and sterile technique",
            "Reusing single-use sterile supplies",
        ],
        [0, 2, 3],
        [
            "Clipping is preferred over shaving.",
            "Shaving causes micro-abrasions increasing infection.",
            "Prophylactic antibiotics per protocol reduce SSI.",
            "Asepsis is foundational.",
            "Single-use items must not be reused.",
        ],
    ),
    (
        "application",
        "A client returns from PACU after general anesthesia and is drowsy but arousable. Priority nursing action:",
        [
            "Assess airway, breathing, circulation, and surgical site",
            "Offer a cheeseburger immediately",
            "Remove all oxygen without orders",
            "Ambulate to bathroom alone",
        ],
        0,
        [
            "PACU focus is ABCs and surgical site.",
            "NPO until awake enough to protect airway.",
            "Oxygen weaned per orders.",
            "Assist with ambulation when criteria met.",
        ],
    ),
    (
        "prioritization",
        "IV infiltration noted with cool skin and edema at site. First action:",
        [
            "Stop infusion and remove or restart line per protocol",
            "Apply heat pack and increase rate",
            "Ignore until patient complains more",
            "Push IV potassium through infiltrated site",
        ],
        0,
        [
            "Stop irritant infusion to limit tissue damage.",
            "Heat and increased rate worsen infiltration.",
            "Early intervention prevents necrosis.",
            "Never push meds through infiltrated line.",
        ],
    ),
    (
        "application",
        "NPO after midnight before surgery primarily prevents:",
        [
            "Aspiration during induction of anesthesia",
            "Dehydration only",
            "Hypertension",
            "Surgical site bleeding",
        ],
        0,
        [
            "Empty stomach reduces aspiration risk.",
            "Dehydration is managed perioperatively.",
            "BP not primary NPO reason.",
            "Bleeding is not prevented by NPO alone.",
        ],
    ),
    (
        "delegation",
        "Post-op day 1 stable client. Which task may be delegated to UAP?",
        [
            "Wound infection assessment",
            "Assist with ambulation per mobility order",
            "Decide PCA dose",
            "Interpret drainage color changes alone",
        ],
        1,
        [
            "Wound assessment is nursing.",
            "Ambulation assistance within orders can be delegated.",
            "PCA is nursing-controlled.",
            "Drainage interpretation is nursing.",
        ],
    ),
    (
        "prioritization",
        "Client on PCA morphine becomes somnolent with RR 8/min. First action:",
        [
            "Stimulate client and notify provider; prepare naloxone per protocol",
            "Increase PCA dose",
            "Leave client to sleep",
            "Ambulate immediately",
        ],
        0,
        [
            "Respiratory depression is opioid emergency.",
            "Increasing dose worsens depression.",
            "Unresponsive sleep is dangerous.",
            "Ambulation unsafe with sedation.",
        ],
    ),
    (
        "application",
        "Central line dressing change uses:",
        [
            "Sterile technique per policy",
            "Clean technique only always",
            "No hand hygiene",
            "Reuse old dressing if dry",
        ],
        0,
        [
            "Sterile technique prevents CLABSI.",
            "Central lines require sterile care.",
            "Hand hygiene is mandatory.",
            "Dressings changed per schedule and if soiled.",
        ],
    ),
    (
        "evaluation",
        "Client teaching after laparoscopic cholecystectomy: which statement needs correction?",
        [
            "Report fever, increasing abdominal pain, or redness of incisions",
            "I can return to heavy lifting today",
            "I will splint my abdomen when coughing",
            "I will gradually advance diet as tolerated",
        ],
        1,
        [
            "Warning signs teaching is correct.",
            "Heavy lifting is restricted early post-op.",
            "Splinting reduces pain.",
            "Gradual diet advance is standard.",
        ],
    ),
    (
        "application",
        "Tourniquet time during peripheral IV start should be:",
        [
            "Left inflated indefinitely",
            "Released within recommended time to avoid complications",
            "Applied only on the same arm as BP cuff simultaneously always",
            "Never used",
        ],
        1,
        [
            "Prolonged tourniquet causes pain and hemolysis risk.",
            "Limit duration per policy.",
            "Avoid concurrent with BP on same limb when possible.",
            "Tourniquet aids venous distension briefly.",
        ],
    ),
    (
        "nclex_sata",
        "DVT prevention for post-op clients may include which measures? Select all that apply.",
        [
            "Early ambulation when cleared",
            "Sequential compression devices as ordered",
            "Prophylactic anticoagulation per risk score",
            "Prolonged bed rest without movement",
            "Adequate hydration when not contraindicated",
        ],
        [0, 1, 2, 4],
        [
            "Ambulation improves venous return.",
            "SCDs reduce stasis.",
            "Chemoprophylaxis per guidelines.",
            "Bed rest increases risk.",
            "Hydration reduces viscosity when appropriate.",
        ],
    ),
    (
        "prioritization",
        "Fire in the OR — first response per safety protocol:",
        [
            "Announce fire, stop flow of oxidizers if safe, remove drapes, use CO₂ extinguisher on patient if fire on client",
            "Hide and continue surgery",
            "Use water on electrical fire at panel",
            "Open oxygen wide to blow out flames",
        ],
        0,
        [
            "OR fire algorithm: announce, stop oxidizers, smother/appropriate extinguisher.",
            "Continuing is unsafe.",
            "Water on electrical equipment is dangerous.",
            "More oxygen fuels fire.",
        ],
    ),
]
for idx, item in enumerate(periop_items, start=69):
    typ, stem, choices, correct, reasons = item
    q(idx, "periop_iv", typ, stem, choices, correct, reasons)

assert len(RAW) == 80, len(RAW)


def emit():
    lines = [
        '"""Exam-style Hard pack (80 items) — NCM112 / MedSurg patterns."""',
        "",
        f'SRC = "{SRC}"',
        "",
        "",
        "def build_exam_hard_pack(mk_exam):",
        "    items = []",
        "",
    ]
    for id_, topic, typ, stem, choices, correct, reasons in RAW:
        fmt = "sata" if isinstance(correct, list) else "single"
        lines.append("    items.append(")
        lines.append("        mk_exam(")
        lines.append(f'            "{id_}",')
        lines.append(f'            {repr(stem)},')
        lines.append(f"            {repr(choices)},")
        lines.append(f"            {repr(reasons)},")
        lines.append(f'            topic="{topic}",')
        lines.append(f'            typ="{typ}",')
        lines.append("            source=SRC,")
        if fmt == "sata":
            lines.append('            choice_format="sata",')
            lines.append(f"            correct_indices={correct},")
        else:
            lines.append(f"            correct_index={correct},")
        lines.append("        )")
        lines.append("    )")
        lines.append("")
    lines.append("    return items")
    lines.append("")
    Path = __import__("pathlib").Path
    out = Path(__file__).resolve().parent / "pnle_exam_hard_pack.py"
    out.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {out} ({len(RAW)} items)")


if __name__ == "__main__":
    emit()
