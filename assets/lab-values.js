// NursePath lab ranges: teaching pocket reference for nursing students.
// Adult typical textbook ranges. Hospital printouts and CI always win.

(function () {
  const ACCENT = '#34d399';

  const CHIPS = [
    { id: 'all', label: 'All' },
    { id: 'cbc', label: 'CBC' },
    { id: 'chem', label: 'Chem' },
    { id: 'abg', label: 'ABG' },
    { id: 'coag', label: 'Coags' },
    { id: 'cardiac', label: 'Cardiac' },
    { id: 'endo', label: 'Endo' },
    { id: 'lipids', label: 'Lipids' },
    { id: 'ua', label: 'UA' }
  ];

  const PANEL_ORDER = [
    'CBC', 'Electrolytes', 'Renal', 'Glucose', 'Liver', 'ABG',
    'Coagulation', 'Cardiac', 'Lipids', 'Thyroid', 'Inflammation', 'Urinalysis', 'Other'
  ];

  const labDatabase = [
    { id: 'wbc', name: 'White Blood Cells', abbrev: 'WBC', panel: 'CBC', category: 'cbc', specimen: 'Whole blood (EDTA)', adultRange: '4.5–11.0 ×10⁹/L', units: '×10⁹/L', aliases: ['leukocytes', 'white count', 'leukocytosis', 'leukopenia'], high: 'Infection, inflammation, steroids, stress, leukemia.', low: 'Viral illness, marrow suppression, chemo, severe sepsis.', nursing: 'Trend with fever and cultures. Neutropenic precautions if very low.', notes: 'Differential tells you which line is driving the change.' },
    { id: 'rbc', name: 'Red Blood Cells', abbrev: 'RBC', panel: 'CBC', category: 'cbc', specimen: 'Whole blood (EDTA)', adultRange: 'M 4.5–5.9 · F 4.0–5.2 ×10¹²/L', units: '×10¹²/L', aliases: ['erythrocytes', 'red count'], high: 'Dehydration, polycythemia, COPD, high altitude.', low: 'Anemia, bleeding, hemodilution, chronic disease.', nursing: 'Pair with Hgb/Hct and volume status before you call it anemia.', notes: 'Sex-specific. Hydration shifts the count.' },
    { id: 'hgb', name: 'Hemoglobin', abbrev: 'Hgb', panel: 'CBC', category: 'cbc', specimen: 'Whole blood (EDTA)', adultRange: 'M 13.0–17.0 · F 12.0–15.0 g/dL', units: 'g/dL', aliases: ['hb', 'haemoglobin', 'anemia'], high: 'Polycythemia, dehydration, COPD.', low: 'Bleeding, iron/B12/folate deficiency, CKD, hemolysis.', nursing: 'Watch symptoms (pallor, tachycardia, dyspnea) more than a single number. Transfusion is a CI/MD call.', notes: 'Pregnancy and altitude change the expected band.' },
    { id: 'hct', name: 'Hematocrit', abbrev: 'Hct', panel: 'CBC', category: 'cbc', specimen: 'Whole blood (EDTA)', adultRange: 'M 40–50% · F 36–46%', units: '%', aliases: ['pcv', 'packed cell volume'], high: 'Dehydration, polycythemia.', low: 'Anemia, bleeding, overhydration.', nursing: 'Hct is roughly 3× Hgb. A sudden drop after fluids may be dilution, not new blood loss.', notes: 'Very sensitive to IV fluids.' },
    { id: 'plt', name: 'Platelets', abbrev: 'Plt', panel: 'CBC', category: 'cbc', specimen: 'Whole blood (EDTA)', adultRange: '150–450 ×10⁹/L', units: '×10⁹/L', aliases: ['thrombocytes', 'thrombocytopenia', 'thrombocytosis'], high: 'Inflammation, iron deficiency, myeloproliferative disease.', low: 'ITP, DIC, chemo, HIT, hypersplenism, viral illness.', nursing: 'Bleeding precautions if low. Avoid IM shots and rectal temps when the count is critically low.', notes: 'Clumped platelets can falsely lower the count — ask the lab to review.' },
    { id: 'mcv', name: 'Mean Corpuscular Volume', abbrev: 'MCV', panel: 'CBC', category: 'cbc', specimen: 'Whole blood (EDTA)', adultRange: '80–100 fL', units: 'fL', aliases: ['microcytic', 'macrocytic'], high: 'B12/folate deficiency, alcohol, liver disease, reticulocytosis.', low: 'Iron deficiency, thalassemia, anemia of chronic disease.', nursing: 'Use MCV to sort the type of anemia before you recite causes.', notes: 'Microcytic vs normocytic vs macrocytic is the first fork.' },
    { id: 'mch', name: 'Mean Corpuscular Hemoglobin', abbrev: 'MCH', panel: 'CBC', category: 'cbc', specimen: 'Whole blood (EDTA)', adultRange: '27–33 pg', units: 'pg', aliases: ['hypochromic'], high: 'Macrocytosis.', low: 'Iron deficiency, thalassemia.', nursing: 'Read with MCV and MCHC, not alone.', notes: 'Tracks with cell size most of the time.' },
    { id: 'mchc', name: 'Mean Corpuscular Hemoglobin Concentration', abbrev: 'MCHC', panel: 'CBC', category: 'cbc', specimen: 'Whole blood (EDTA)', adultRange: '32–36 g/dL', units: 'g/dL', aliases: [], high: 'Spherocytosis, lab artifact (lipemia).', low: 'Iron deficiency, thalassemia.', nursing: 'A very high MCHC is often a lab flag, not a clinical trophy.', notes: 'Confirm unexpected spikes with the lab.' },
    { id: 'rdw', name: 'Red Cell Distribution Width', abbrev: 'RDW', panel: 'CBC', category: 'cbc', specimen: 'Whole blood (EDTA)', adultRange: '11.5–14.5%', units: '%', aliases: ['anisocytosis'], high: 'Mixed anemias, recent bleed with reticulocytes, deficiency anemias.', low: 'Uniform cell size (not usually a problem by itself).', nursing: 'High RDW + low MCV often points to iron deficiency.', notes: 'Useful when two anemias overlap.' },
    { id: 'neut', name: 'Neutrophils', abbrev: 'Neut', panel: 'CBC', category: 'cbc', specimen: 'Whole blood (EDTA)', adultRange: '40–70% · 1.8–7.7 ×10⁹/L', units: '% and absolute', aliases: ['segs', 'bands', 'neutrophilia', 'neutropenia', 'anc'], high: 'Bacterial infection, steroids, stress, inflammation.', low: 'Viral illness, chemo, agranulocytosis, severe sepsis.', nursing: 'Absolute neutrophil count (ANC) drives isolation decisions more than the percent.', notes: 'Left shift / bands belong in the clinical story, not just the %.' },
    { id: 'lymph', name: 'Lymphocytes', abbrev: 'Lymph', panel: 'CBC', category: 'cbc', specimen: 'Whole blood (EDTA)', adultRange: '20–40% · 1.0–4.8 ×10⁹/L', units: '% and absolute', aliases: ['lymphocytosis', 'lymphopenia'], high: 'Viral illness, CLL, pertussis.', low: 'Steroids, HIV, chemo, acute bacterial stress.', nursing: 'Percent can mislead if the WBC is very high or very low — use the absolute count.', notes: 'Kids normally run higher lymphocytes than adults.' },
    { id: 'mono', name: 'Monocytes', abbrev: 'Mono', panel: 'CBC', category: 'cbc', specimen: 'Whole blood (EDTA)', adultRange: '2–8%', units: '%', aliases: [], high: 'Recovery from infection, TB, endocarditis, malignancy.', low: 'Rarely isolated; marrow suppression.', nursing: 'A lone high monocyte % is a clue, not a diagnosis.', notes: 'Look at the whole differential.' },
    { id: 'eos', name: 'Eosinophils', abbrev: 'Eos', panel: 'CBC', category: 'cbc', specimen: 'Whole blood (EDTA)', adultRange: '1–4%', units: '%', aliases: ['eosinophilia'], high: 'Allergy, asthma, parasites, some drugs.', low: 'Steroids, acute stress (usually not a problem).', nursing: 'Ask about new rashes, wheeze, and stool ova/parasite context.', notes: 'Steroids rapidly drop the eosinophil count.' },
    { id: 'baso', name: 'Basophils', abbrev: 'Baso', panel: 'CBC', category: 'cbc', specimen: 'Whole blood (EDTA)', adultRange: '0–1%', units: '%', aliases: [], high: 'Myeloproliferative disease, allergy, hypothyroidism.', low: 'Usually not clinically useful alone.', nursing: 'Do not over-read a 0% basophil count.', notes: 'Tiny fraction of the differential.' },
    { id: 'esr', name: 'Erythrocyte Sedimentation Rate', abbrev: 'ESR', panel: 'CBC', category: 'cbc', specimen: 'Whole blood (EDTA or citrate)', adultRange: 'M <15 · F <20 mm/hr', units: 'mm/hr', aliases: ['sed rate'], high: 'Inflammation, infection, anemia, pregnancy, autoimmune disease.', low: 'Polycythemia, sickle cell, extreme leukocytosis.', nursing: 'Nonspecific. Trend with CRP and the clinical picture.', notes: 'Rises slowly; CRP reacts faster.' },

    { id: 'na', name: 'Sodium', abbrev: 'Na⁺', panel: 'Electrolytes', category: 'chem', specimen: 'Serum / plasma', adultRange: '135–145 mmol/L', units: 'mmol/L', aliases: ['na', 'hyponatremia', 'hypernatremia', 'serum sodium'], high: 'Free-water loss, DI, hypertonic saline, poor intake of water.', low: 'SIADH, heart failure, cirrhosis, thiazides, hyperglycemia (dilution).', nursing: 'Neuro checks if it is changing fast. Correct slowly unless your team says otherwise.', notes: 'mmol/L = mEq/L for sodium. Pair with volume status.' },
    { id: 'k', name: 'Potassium', abbrev: 'K⁺', panel: 'Electrolytes', category: 'chem', specimen: 'Serum / plasma', adultRange: '3.5–5.0 mmol/L', units: 'mmol/L', aliases: ['k', 'hypokalemia', 'hyperkalemia', 'kayexalate'], high: 'CKD, ACEI/ARB, K-sparing diuretics, acidosis, hemolyzed sample.', low: 'Loop/thiazide diuretics, vomiting, diarrhea, insulin, alkalosis.', nursing: 'Cardiac monitoring if very high or very low. Recheck a hemolyzed “high K” before you panic.', notes: 'Never IV-push potassium. Hemolysis falsely raises K.' },
    { id: 'cl', name: 'Chloride', abbrev: 'Cl⁻', panel: 'Electrolytes', category: 'chem', specimen: 'Serum / plasma', adultRange: '98–106 mmol/L', units: 'mmol/L', aliases: ['hypochloremia', 'hyperchloremia'], high: 'Normal-saline load, diarrhea, RTA, hypernatremia.', low: 'Vomiting, NG suction, loop diuretics, SIADH.', nursing: 'Read with Na and bicarbonate for acid–base context.', notes: 'Helps compute anion gap.' },
    { id: 'hco3', name: 'Bicarbonate', abbrev: 'HCO₃⁻', panel: 'Electrolytes', category: 'chem', specimen: 'Serum / plasma (venous CO₂)', adultRange: '22–26 mmol/L', units: 'mmol/L', aliases: ['co2', 'bicarb', 'total co2'], high: 'Metabolic alkalosis, compensation for respiratory acidosis.', low: 'Metabolic acidosis, compensation for respiratory alkalosis.', nursing: 'This venous CO₂ is not the same as ABG PaCO₂.', notes: 'Use with anion gap when acidosis is on the table.' },
    { id: 'ag', name: 'Anion Gap', abbrev: 'AG', panel: 'Electrolytes', category: 'chem', specimen: 'Calculated from electrolytes', adultRange: '8–12 mmol/L (lab formula varies)', units: 'mmol/L', aliases: ['high anion gap', 'hagmet', 'mudpiles'], high: 'Lactic acidosis, ketoacidosis, toxins, renal failure.', low: 'Low albumin, lithium, lab error.', nursing: 'Always check albumin — a low albumin shrinks the gap.', notes: 'Formula is usually Na − (Cl + HCO₃). Confirm your lab’s version.' },
    { id: 'ca', name: 'Calcium (total)', abbrev: 'Ca', panel: 'Electrolytes', category: 'chem', specimen: 'Serum', adultRange: '8.5–10.5 mg/dL', units: 'mg/dL', aliases: ['hypocalcemia', 'hypercalcemia', 'corrected calcium'], high: 'Hyperparathyroidism, malignancy, excess vitamin D, thiazides.', low: 'Hypoparathyroidism, CKD, vitamin D deficiency, low albumin, pancreatitis.', nursing: 'Correct for albumin or look at ionized Ca. Chvostek/Trousseau if symptomatic.', notes: 'Total Ca falls when albumin is low even if ionized Ca is fine.' },
    { id: 'ica', name: 'Ionized Calcium', abbrev: 'iCa', panel: 'Electrolytes', category: 'chem', specimen: 'Whole blood / serum (anaerobic)', adultRange: '1.12–1.32 mmol/L', units: 'mmol/L', aliases: ['free calcium'], high: 'Same drivers as total hypercalcemia.', low: 'True hypocalcemia, citrate from massive transfusion, alkalosis.', nursing: 'Preferred when albumin is abnormal or the patient is unstable.', notes: 'Handle like a blood gas — air in the syringe changes it.' },
    { id: 'mg', name: 'Magnesium', abbrev: 'Mg', panel: 'Electrolytes', category: 'chem', specimen: 'Serum', adultRange: '1.7–2.2 mg/dL', units: 'mg/dL', aliases: ['hypomagnesemia', 'hypermagnesemia', 'magnesium sulfate', 'mgso4'], high: 'CKD, Mg-containing antacids/cathartics, treatment of preeclampsia.', low: 'GI loss, alcohol, diuretics, PPIs, refeeding.', nursing: 'Low Mg often keeps K and Ca from correcting. On a preeclampsia drip, a “high” level can be the goal — watch reflexes and breathing.', notes: 'OB MgSO₄ patients can run above the usual band on purpose.', rangeNote: 'Not on a magnesium drip.', targets: [{ label: 'On MgSO₄', range: '4–7 mg/dL', note: 'Common textbook band for preeclampsia seizure prevention. Reflexes fade as the level climbs past it. The order wins.' }] },
    { id: 'phos', name: 'Phosphorus', abbrev: 'PO₄', panel: 'Electrolytes', category: 'chem', specimen: 'Serum', adultRange: '2.5–4.5 mg/dL', units: 'mg/dL', aliases: ['phosphate', 'hypophosphatemia'], high: 'CKD, hypoparathyroidism, rhabdo, phosphate enemas.', low: 'Refeeding, insulin, alcohol, hungry-bone, malabsorption.', nursing: 'Very low phosphate → weakness and respiratory failure risk. Recheck after feeding starts.', notes: 'Kids run higher than adults.' },

    { id: 'bun', name: 'Blood Urea Nitrogen', abbrev: 'BUN', panel: 'Renal', category: 'chem', specimen: 'Serum / plasma', adultRange: '7–20 mg/dL', units: 'mg/dL', aliases: ['urea', 'azotemia'], high: 'Dehydration, GI bleed, high protein, AKI/CKD, steroids.', low: 'Low protein, overhydration, severe liver disease.', nursing: 'BUN:creatinine ratio helps sort pre-renal vs intrinsic — still confirm with the team.', notes: 'PH slips usually print mg/dL.' },
    { id: 'crea', name: 'Creatinine', abbrev: 'Crea', panel: 'Renal', category: 'chem', specimen: 'Serum / plasma', adultRange: 'M 0.7–1.3 · F 0.6–1.1 mg/dL', units: 'mg/dL', aliases: ['cr', 'scr', 'aki'], high: 'AKI, CKD, rhabdo, some drugs (trimethoprim can bump it).', low: 'Low muscle mass, pregnancy.', nursing: 'Trend beats a single value. Hold nephrotoxics only per protocol/CI.', notes: 'A 0.3 mg/dL rise can already be AKI even if still “in range”.' },
    { id: 'egfr', name: 'Estimated GFR', abbrev: 'eGFR', panel: 'Renal', category: 'chem', specimen: 'Calculated from creatinine', adultRange: '≥90 mL/min/1.73 m² (stage-dependent)', units: 'mL/min/1.73 m²', aliases: ['gfr', 'ckd stage'], high: 'Hyperfiltration (early diabetes) or overestimate in low muscle mass.', low: 'CKD, AKI, age-related decline.', nursing: 'Drug dosing and contrast decisions often follow eGFR, not creatinine alone.', notes: 'Equation and race coefficients vary by lab — use the printed value.' },
    { id: 'uric', name: 'Uric Acid', abbrev: 'UA acid', panel: 'Renal', category: 'chem', specimen: 'Serum', adultRange: 'M 3.5–7.2 · F 2.6–6.0 mg/dL', units: 'mg/dL', aliases: ['urate', 'gout'], high: 'Gout, tumor lysis, CKD, diuretics.', low: 'SIADH, some drugs, liver disease.', nursing: 'Hydration and TLS protocols matter more than a lone high number on the ward.', notes: 'Not a stand-alone gout test.' },

    { id: 'glu-fast', name: 'Glucose (fasting)', abbrev: 'FBS', panel: 'Glucose', category: 'endo', specimen: 'Serum / plasma (fasting 8h)', adultRange: '70–99 mg/dL', units: 'mg/dL', aliases: ['fbs', 'fasting blood sugar', 'hypoglycemia', 'hyperglycemia'], high: 'Diabetes, steroids, stress, pancreatitis.', low: 'Insulin/OHA excess, sepsis, liver failure, skipped meals.', nursing: 'Treat the patient, not only the strip. Recheck after you treat a low.', notes: '100–125 mg/dL fasting is impaired; ≥126 on two tests suggests diabetes (textbook).' },
    { id: 'glu-random', name: 'Glucose (random)', abbrev: 'RBS', panel: 'Glucose', category: 'endo', specimen: 'Serum / capillary', adultRange: '70–140 mg/dL (context-dependent)', units: 'mg/dL', aliases: ['rbs', 'random blood sugar', 'cbg'], high: 'Diabetes, steroids, post-meal, stress.', low: 'Same as fasting hypoglycemia.', nursing: 'Know if it is fasting, post-meal, or CBG. Document the timing.', notes: 'A random ≥200 mg/dL with classic symptoms is a diabetes clue, not a solo diagnosis here.' },
    { id: 'hba1c', name: 'Glycated Hemoglobin', abbrev: 'HbA1c', panel: 'Glucose', category: 'endo', specimen: 'Whole blood (EDTA)', adultRange: '<5.7%', units: '%', aliases: ['a1c', 'glycated hb'], high: '5.7–6.4% prediabetes; ≥6.5% diabetes category (textbook). Poor control if already diabetic.', low: 'Hemolysis, blood loss, some hemoglobinopathies (assay-dependent).', nursing: 'Reflects ~3 months. Do not use it for hour-to-hour insulin decisions.', notes: 'A treatment target is not the same as the no-diabetes band.', rangeNote: 'No diabetes.', targets: [{ label: 'Many adults with diabetes', range: 'Often <7%', note: 'A common textbook aim. Pregnancy, older adults, and frequent lows change it. The plan wins.' }] },

    { id: 'ast', name: 'Aspartate Aminotransferase', abbrev: 'AST', panel: 'Liver', category: 'chem', specimen: 'Serum', adultRange: '10–40 U/L', units: 'U/L', aliases: ['sgot'], high: 'Hepatitis, alcohol, ischemia, rhabdo, MI (less specific).', low: 'Rarely useful alone.', nursing: 'AST:ALT ratio and CK help sort liver vs muscle.', notes: 'Not liver-specific. Read with ALT.' },
    { id: 'alt', name: 'Alanine Aminotransferase', abbrev: 'ALT', panel: 'Liver', category: 'chem', specimen: 'Serum', adultRange: '7–56 U/L', units: 'U/L', aliases: ['sgpt'], high: 'Viral/drug hepatitis, fatty liver, ischemia.', low: 'Rarely useful alone.', nursing: 'More liver-specific than AST. Watch hepatotoxic meds.', notes: '' },
    { id: 'alp', name: 'Alkaline Phosphatase', abbrev: 'ALP', panel: 'Liver', category: 'chem', specimen: 'Serum', adultRange: '44–147 U/L', units: 'U/L', aliases: ['alk phos'], high: 'Cholestasis, bone growth/turnover, pregnancy (placenta), Paget.', low: 'Zinc deficiency, hypothyroidism, malnutrition.', nursing: 'If ALP is up, look at GGT and bilirubin to sort bone vs bile.', notes: 'Kids and third-trimester pregnancy run higher.' },
    { id: 'ggt', name: 'Gamma-Glutamyl Transferase', abbrev: 'GGT', panel: 'Liver', category: 'chem', specimen: 'Serum', adultRange: '9–48 U/L', units: 'U/L', aliases: ['ggtp'], high: 'Alcohol, cholestasis, enzyme-inducing drugs.', low: 'Not usually significant.', nursing: 'GGT up + ALP up → biliary pattern more than bone.', notes: 'Sensitive, not specific.' },
    { id: 'tbili', name: 'Total Bilirubin', abbrev: 'TBil', panel: 'Liver', category: 'chem', specimen: 'Serum (protect from light)', adultRange: '0.1–1.2 mg/dL', units: 'mg/dL', aliases: ['jaundice', 'hyperbilirubinemia'], high: 'Hemolysis, hepatitis, obstruction, Gilbert, newborn physiologic.', low: 'Not usually significant.', nursing: 'Look at the patient (sclera, urine, stool) plus the fractionated bili.', notes: 'Newborns have a different chart — do not use the adult band for neonates.' },
    { id: 'dbili', name: 'Direct (conjugated) Bilirubin', abbrev: 'DBil', panel: 'Liver', category: 'chem', specimen: 'Serum', adultRange: '0.0–0.3 mg/dL', units: 'mg/dL', aliases: ['conjugated bilirubin'], high: 'Obstruction, hepatitis, Dubin–Johnson.', low: 'Not usually significant.', nursing: 'Dark urine + pale stool + high direct bili → think cholestasis and escalate.', notes: 'Indirect = total − direct.' },
    { id: 'alb', name: 'Albumin', abbrev: 'Alb', panel: 'Liver', category: 'chem', specimen: 'Serum', adultRange: '3.5–5.0 g/dL', units: 'g/dL', aliases: ['hypoalbuminemia'], high: 'Dehydration (relative).', low: 'Liver failure, nephrosis, malnutrition, inflammation, burns.', nursing: 'Low albumin changes calcium, drugs, and edema picture. It is a slow marker.', notes: 'Not a good “today’s nutrition” lab — half-life is long.' },
    { id: 'tp', name: 'Total Protein', abbrev: 'TP', panel: 'Liver', category: 'chem', specimen: 'Serum', adultRange: '6.0–8.3 g/dL', units: 'g/dL', aliases: [], high: 'Dehydration, chronic inflammation, myeloma (check SPEP).', low: 'Same as low albumin plus immunoglobulin loss.', nursing: 'Pair with albumin. A wide globulin gap needs the team, not a guess.', notes: 'Globulin ≈ total protein − albumin.' },
    { id: 'amy', name: 'Amylase', abbrev: 'Amy', panel: 'Liver', category: 'chem', specimen: 'Serum', adultRange: '30–110 U/L', units: 'U/L', aliases: ['pancreatitis'], high: 'Pancreatitis, parotitis, bowel ischemia, renal failure, macroamylase.', low: 'Not usually useful.', nursing: 'Lipase is more pancreas-specific. Pain + enzymes + imaging belong together.', notes: 'Can stay normal in some pancreatitis cases.' },
    { id: 'lip', name: 'Lipase', abbrev: 'Lip', panel: 'Liver', category: 'chem', specimen: 'Serum', adultRange: '0–160 U/L (lab-dependent)', units: 'U/L', aliases: ['pancreatitis'], high: 'Pancreatitis, renal failure, some GI perforations.', low: 'Not usually useful.', nursing: 'Preferred over amylase for pancreatitis workups in many wards.', notes: 'Cutoff varies widely by kit — read the slip.' },
    { id: 'nh3', name: 'Ammonia', abbrev: 'NH₃', panel: 'Liver', category: 'chem', specimen: 'Plasma on ice, send STAT', adultRange: '15–45 µg/dL', units: 'µg/dL', aliases: ['hepatic encephalopathy'], high: 'Liver failure, GI bleed, urea-cycle disorders, valproate.', low: 'Not usually useful.', nursing: 'Send on ice immediately. Treat the neuro picture, not the number alone.', notes: 'Poor correlation with encephalopathy grade — still used as a clue.' },
    { id: 'ldh', name: 'Lactate Dehydrogenase', abbrev: 'LDH', panel: 'Liver', category: 'chem', specimen: 'Serum', adultRange: '140–280 U/L', units: 'U/L', aliases: [], high: 'Hemolysis, MI, liver injury, tumor lysis, pneumocystis.', low: 'Not usually useful.', nursing: 'Very nonspecific. A hemolyzed tube falsely raises it.', notes: 'Isoenzymes are rarely used now.' },

    { id: 'ph', name: 'Arterial pH', abbrev: 'pH', panel: 'ABG', category: 'abg', specimen: 'Arterial blood, anaerobic, on ice if delayed', adultRange: '7.35–7.45', units: '', aliases: ['acidosis', 'alkalosis', 'abg'], high: 'Alkalosis (metabolic or respiratory).', low: 'Acidosis (metabolic or respiratory).', nursing: '7.40 is the midline. Use pH + PaCO₂ + HCO₃ together, never pH alone.', notes: 'Venous pH runs a little lower than arterial.' },
    { id: 'paco2', name: 'Arterial PaCO₂', abbrev: 'PaCO₂', panel: 'ABG', category: 'abg', specimen: 'Arterial blood', adultRange: '35–45 mmHg', units: 'mmHg', aliases: ['pco2', 'hypercapnia', 'hypocapnia'], high: 'Hypoventilation, COPD, over-sedation.', low: 'Hyperventilation, anxiety, compensation for metabolic acidosis, PE.', nursing: 'This is ventilation, not oxygenation.', notes: 'Acute vs chronic compensation changes the expected HCO₃.' },
    { id: 'pao2', name: 'Arterial PaO₂', abbrev: 'PaO₂', panel: 'ABG', category: 'abg', specimen: 'Arterial blood', adultRange: '80–100 mmHg (room air)', units: 'mmHg', aliases: ['po2', 'hypoxemia'], high: 'Supplemental oxygen.', low: 'Lung disease, hypoventilation, shunt, high altitude.', nursing: 'Interpret with FiO₂. A PaO₂ of 90 on 100% O₂ is not “normal.”', notes: 'Age lowers expected PaO₂ a bit.' },
    { id: 'abg-hco3', name: 'ABG Bicarbonate', abbrev: 'HCO₃ (ABG)', panel: 'ABG', category: 'abg', specimen: 'Arterial blood (calculated)', adultRange: '22–26 mmol/L', units: 'mmol/L', aliases: ['abg bicarb'], high: 'Metabolic alkalosis or renal compensation for chronic CO₂ retention.', low: 'Metabolic acidosis or compensation for hyperventilation.', nursing: 'Should be close to the chemistry CO₂, not identical.', notes: 'ROME: Respiratory opposite, metabolic equal.' },
    { id: 'sao2', name: 'Arterial SaO₂', abbrev: 'SaO₂', panel: 'ABG', category: 'abg', specimen: 'Arterial blood / pulse ox (SpO₂)', adultRange: '95–100%', units: '%', aliases: ['spo2', 'oxygen sat', 'copd'], high: 'Supplemental O₂ (watch COPD targets).', low: 'Hypoxemia, poor perfusion, nail polish artifact on SpO₂.', nursing: 'SpO₂ is a probe; SaO₂ is the ABG. Confirm a weird sat with the patient and the waveform.', notes: 'A COPD oxygen order is a target, not the healthy-adult band.', rangeNote: 'Healthy adult.', targets: [{ label: 'Some COPD orders', range: '88–92%', note: 'Follow the written oxygen order. A sat in this band can be the goal, not a low.' }] },
    { id: 'be', name: 'Base Excess', abbrev: 'BE', panel: 'ABG', category: 'abg', specimen: 'Arterial blood (calculated)', adultRange: '−2 to +2 mmol/L', units: 'mmol/L', aliases: ['base deficit'], high: 'Metabolic alkalosis.', low: 'Metabolic acidosis (base deficit).', nursing: 'Read it with HCO₃ for the metabolic side of the ABG.', notes: 'Sign convention: negative = deficit.' },
    { id: 'lactate', name: 'Lactate', abbrev: 'Lac', panel: 'ABG', category: 'abg', specimen: 'Arterial or venous plasma, on ice', adultRange: '0.5–2.0 mmol/L', units: 'mmol/L', aliases: ['lactic acid', 'sepsis'], high: 'Shock, sepsis, ischemia, metformin, seizures, poor draw.', low: 'Not usually a problem.', nursing: 'Trend clearance after fluids/source control. A rising lactate is a shout, not a whisper.', notes: 'Do not leave the sample sitting on the ward.' },

    { id: 'pt', name: 'Prothrombin Time', abbrev: 'PT', panel: 'Coagulation', category: 'coag', specimen: 'Citrate tube, filled to the line', adultRange: '11–13.5 sec', units: 'sec', aliases: ['protime'], high: 'Warfarin, vitamin K deficiency, liver failure, DIC, factor VII.', low: 'Not usually clinically useful (short PT).', nursing: 'A short-filled blue top falsely prolongs PT/aPTT. Fill it.', notes: 'INR is how we compare PT across labs.' },
    { id: 'inr', name: 'International Normalized Ratio', abbrev: 'INR', panel: 'Coagulation', category: 'coag', specimen: 'Citrate tube', adultRange: '0.8–1.1', units: '', aliases: ['warfarin', 'coumadin'], high: 'Above the intended band: liver disease, DIC, vitamin K deficiency, or too much warfarin.', low: 'Off warfarin, a low-normal INR is usual. On warfarin, below the target means clots form more easily than the team wanted.', nursing: 'Read the usual band only if the patient is not on warfarin. On warfarin, use the therapeutic card that matches the indication.', notes: 'Do not call 2.4 “too high” on a typical warfarin order.', rangeNote: 'Not on warfarin.', targets: [{ label: 'Most warfarin', range: '2.0–3.0', note: 'Atrial fibrillation, DVT, and PE in most textbooks.' }, { label: 'Some mechanical valves', range: '2.5–3.5', note: 'A higher target on some valve orders. The prescription wins.' }] },
    { id: 'aptt', name: 'Activated Partial Thromboplastin Time', abbrev: 'aPTT', panel: 'Coagulation', category: 'coag', specimen: 'Citrate tube, filled to the line', adultRange: '25–35 sec', units: 'sec', aliases: ['ptt', 'heparin'], high: 'Heparin, lupus anticoagulant, hemophilia, DIC, liver disease.', low: 'Possible hypercoagulable state or lab artifact.', nursing: 'Off heparin, use the usual band. On a heparin drip, use the hospital nomogram or anti-Xa, not this estimate alone.', notes: 'Reagent ranges differ. A short-filled blue top falsely prolongs the time.', rangeNote: 'Not on heparin.', targets: [{ label: 'Unfractionated heparin', range: '1.5–2.5 × control', note: 'A common teaching multiple. Your lab’s nomogram is the number that counts.' }] },
    { id: 'ddimer', name: 'D-dimer', abbrev: 'D-D', panel: 'Coagulation', category: 'coag', specimen: 'Citrate plasma', adultRange: '<0.5 µg/mL FEU (kit-dependent)', units: 'µg/mL FEU', aliases: ['dimer', 'pe', 'dvt'], high: 'VTE, DIC, pregnancy, cancer, inflammation, age, post-op.', low: 'Helps argue against VTE when pre-test probability is low.', nursing: 'A high D-dimer is not a PE. A negative one is more useful in the right patient.', notes: 'Units and cutoffs differ a lot. Read the slip.' },
    { id: 'fib', name: 'Fibrinogen', abbrev: 'Fib', panel: 'Coagulation', category: 'coag', specimen: 'Citrate plasma', adultRange: '200–400 mg/dL', units: 'mg/dL', aliases: ['factor i'], high: 'Inflammation, pregnancy, acute phase.', low: 'DIC, thrombolysis, liver failure, massive transfusion.', nursing: 'A falling fibrinogen with rising PT/aPTT/D-dimer is a DIC pattern to escalate.', notes: 'Replacement is a team decision.' },

    { id: 'tropi', name: 'Troponin I', abbrev: 'TnI', panel: 'Cardiac', category: 'cardiac', specimen: 'Serum / plasma, serial draws', adultRange: '<0.04 ng/mL (assay-dependent)', units: 'ng/mL', aliases: ['troponin', 'acs', 'mi', 'nstemi'], high: 'MI, myocarditis, PE, demand ischemia, CKD, sepsis.', low: 'Helps argue against acute myocardial injury when serials stay negative.', nursing: 'Chest pain + ECG + serial troponins.', notes: 'High-sensitivity assays use different units and 99th-percentile cuts. Always use the printed cutoff.' },
    { id: 'ckmb', name: 'CK-MB', abbrev: 'CK-MB', panel: 'Cardiac', category: 'cardiac', specimen: 'Serum', adultRange: '<5 ng/mL or <5% of total CK', units: 'ng/mL', aliases: ['mb'], high: 'MI, myocarditis, muscular injury if not fractionated.', low: 'Not useful alone.', nursing: 'Troponin has largely replaced CK-MB. Still appears on some PH panels.', notes: 'Total CK rises with IM shots and rhabdo.' },
    { id: 'ck', name: 'Creatine Kinase', abbrev: 'CK', panel: 'Cardiac', category: 'cardiac', specimen: 'Serum', adultRange: 'M 38–174 · F 26–140 U/L', units: 'U/L', aliases: ['cpk', 'rhabdo'], high: 'Rhabdomyolysis, IM injection, exercise, MI, myositis.', low: 'Low muscle mass.', nursing: 'Dark urine + high CK → think rhabdo and fluids/renal watch.', notes: 'Not specific for the heart.' },
    { id: 'bnp', name: 'B-type Natriuretic Peptide', abbrev: 'BNP', panel: 'Cardiac', category: 'cardiac', specimen: 'EDTA plasma', adultRange: '<100 pg/mL', units: 'pg/mL', aliases: ['nt-probnp', 'heart failure'], high: 'Heart failure, CKD, PE, age, AF.', low: 'Makes acute HF less likely in the right setting.', nursing: 'Supports a congestion story; it does not replace the exam and CXR.', notes: 'NT-proBNP uses a different cutoff (age-banded).' },

    { id: 'chol', name: 'Total Cholesterol', abbrev: 'TC', panel: 'Lipids', category: 'lipids', specimen: 'Serum (often fasting)', adultRange: '<200 mg/dL desirable', units: 'mg/dL', aliases: ['cholesterol'], high: 'Diet, genetics, hypothyroidism, nephrosis, diabetes.', low: 'Malnutrition, hyperthyroidism, liver failure.', nursing: 'Risk marker, not an emergency lab.', notes: 'Fasting vs non-fasting depends on the panel ordered.' },
    { id: 'ldl', name: 'LDL Cholesterol', abbrev: 'LDL', panel: 'Lipids', category: 'lipids', specimen: 'Serum (calculated or direct)', adultRange: '<100 mg/dL optimal', units: 'mg/dL', aliases: ['bad cholesterol'], high: 'Atherosclerotic risk, familial hypercholesterolemia.', low: 'Usually favorable; very low can be illness.', nursing: 'Target depends on the patient’s risk category, not this single “optimal” line.', notes: 'Friedewald formula fails when TG are very high.' },
    { id: 'hdl', name: 'HDL Cholesterol', abbrev: 'HDL', panel: 'Lipids', category: 'lipids', specimen: 'Serum', adultRange: 'M >40 · F >50 mg/dL', units: 'mg/dL', aliases: ['good cholesterol'], high: 'Usually favorable (exercise, genetics, some meds).', low: 'Higher CV risk, smoking, diabetes, inactivity.', nursing: 'Lifestyle story, not a crash-cart number.', notes: 'Very high HDL is not always protective.' },
    { id: 'tg', name: 'Triglycerides', abbrev: 'TG', panel: 'Lipids', category: 'lipids', specimen: 'Serum, preferably fasting', adultRange: '<150 mg/dL', units: 'mg/dL', aliases: ['trigs', 'hypertriglyceridemia'], high: 'Diabetes, alcohol, diet, pancreatitis risk if very high.', low: 'Malnutrition, hyperthyroidism.', nursing: 'TG in the thousands → pancreatitis watch. Fasting status changes the number.', notes: '≥500 mg/dL is the usual “very high” teaching band.' },

    { id: 'tsh', name: 'Thyroid-Stimulating Hormone', abbrev: 'TSH', panel: 'Thyroid', category: 'endo', specimen: 'Serum', adultRange: '0.4–4.0 mIU/L', units: 'mIU/L', aliases: ['hypothyroid', 'hyperthyroid'], high: 'Primary hypothyroidism, recovery from illness.', low: 'Hyperthyroidism, excess levothyroxine, sick euthyroid.', nursing: 'Read TSH with FT4. Do not titrate thyroid meds off a single ward TSH in isolation.', notes: 'Pregnancy and age shift the band. Assay-dependent.' },
    { id: 'ft4', name: 'Free T4', abbrev: 'FT4', panel: 'Thyroid', category: 'endo', specimen: 'Serum', adultRange: '0.8–1.8 ng/dL', units: 'ng/dL', aliases: ['thyroxine'], high: 'Hyperthyroidism, excess replacement.', low: 'Hypothyroidism, sick euthyroid.', nursing: 'Pair with TSH. High TSH + low FT4 = primary hypo pattern.', notes: 'Total T4 is affected by binding proteins; free T4 is preferred.' },
    { id: 'ft3', name: 'Free T3', abbrev: 'FT3', panel: 'Thyroid', category: 'endo', specimen: 'Serum', adultRange: '2.3–4.2 pg/mL', units: 'pg/mL', aliases: ['triiodothyronine'], high: 'T3 toxicosis, hyperthyroidism.', low: 'Hypothyroidism, sick euthyroid (T3 drops first in illness).', nursing: 'Less useful than TSH/FT4 for most ward questions.', notes: 'Units vary by kit.' },

    { id: 'crp', name: 'C-Reactive Protein', abbrev: 'CRP', panel: 'Inflammation', category: 'chem', specimen: 'Serum', adultRange: '<5 mg/L (ordinary CRP)', units: 'mg/L', aliases: ['hs-crp'], high: 'Infection, inflammation, tissue injury.', low: 'Helps argue against significant acute inflammation.', nursing: 'Trends faster than ESR. hs-CRP uses a different cardiac-risk scale.', notes: 'Not specific for one infection.' },
    { id: 'pct', name: 'Procalcitonin', abbrev: 'PCT', panel: 'Inflammation', category: 'chem', specimen: 'Serum', adultRange: '<0.1 ng/mL typical if uninfected', units: 'ng/mL', aliases: ['pct sepsis'], high: 'Bacterial sepsis, some shock states.', low: 'Viral illness more likely (not proof).', nursing: 'A helper for antibiotic decisions, never a stand-alone stop/start button.', notes: 'Cutoffs are protocol-specific.' },

    { id: 'uasg', name: 'Urine Specific Gravity', abbrev: 'SG', panel: 'Urinalysis', category: 'ua', specimen: 'Fresh urine', adultRange: '1.005–1.030', units: '', aliases: ['urine sg', 'concentration'], high: 'Dehydration, SIADH, glycosuria, contrast.', low: 'Diabetes insipidus, overhydration, ATN.', nursing: 'Pair with intake/output and serum Na.', notes: 'Radiocontrast and glucose raise SG without true concentration.' },
    { id: 'uaph', name: 'Urine pH', abbrev: 'U-pH', panel: 'Urinalysis', category: 'ua', specimen: 'Fresh urine', adultRange: '4.5–8.0', units: '', aliases: [], high: 'UTI with urease organisms, vegetarian diet, RTA, standing sample.', low: 'Acidosis, high protein diet.', nursing: 'A very alkaline urine left sitting on the desk is often stale, not a diagnosis.', notes: 'Send promptly.' },
    { id: 'uaprot', name: 'Urine Protein (dipstick)', abbrev: 'U-Prot', panel: 'Urinalysis', category: 'ua', specimen: 'Fresh urine', adultRange: 'Negative / trace', units: '', aliases: ['proteinuria', 'albuminuria'], high: 'UTI, fever, orthostatic, glomerular disease, preeclampsia.', low: 'Expected.', nursing: 'Persistent protein needs a proper ACR/24h, not only a dipstick.', notes: 'Concentrated urine can read trace in a well person.' },
    { id: 'uaglu', name: 'Urine Glucose', abbrev: 'U-Glu', panel: 'Urinalysis', category: 'ua', specimen: 'Fresh urine', adultRange: 'Negative', units: '', aliases: ['glycosuria'], high: 'Hyperglycemia above renal threshold, pregnancy, SGLT2 inhibitors.', low: 'Expected.', nursing: 'On SGLT2 drugs, urine glucose can be positive with a decent serum glucose.', notes: 'Threshold is often ~180 mg/dL serum, variable.' },
    { id: 'uaket', name: 'Urine Ketones', abbrev: 'U-Ket', panel: 'Urinalysis', category: 'ua', specimen: 'Fresh urine', adultRange: 'Negative', units: '', aliases: ['ketonuria', 'dka'], high: 'DKA, starvation, keto diet, vomiting, alcohol ketoacidosis.', low: 'Expected.', nursing: 'Positive ketones + high glucose + sick patient → escalate for DKA workup.', notes: 'Dipstick misses beta-hydroxybutyrate; serum ketones are better in DKA.' },
    { id: 'uanit', name: 'Urine Nitrite', abbrev: 'Nit', panel: 'Urinalysis', category: 'ua', specimen: 'Fresh urine', adultRange: 'Negative', units: '', aliases: ['uti'], high: 'Enteric Gram-negatives converting nitrate.', low: 'Does not rule out UTI (enterococcus, early void).', nursing: 'Read with LE, WBC, and symptoms. Send culture when indicated.', notes: 'Needs time in the bladder to turn positive.' },
    { id: 'uale', name: 'Urine Leukocyte Esterase', abbrev: 'LE', panel: 'Urinalysis', category: 'ua', specimen: 'Fresh urine', adultRange: 'Negative', units: '', aliases: ['pyuria'], high: 'Pyuria, UTI, inflammation, contamination.', low: 'Does not fully rule out UTI.', nursing: 'A dirty catch looks like a UTI. Teach a clean catch.', notes: 'Pair with microscopy when you can.' },
    { id: 'uawbc', name: 'Urine WBC (micro)', abbrev: 'U-WBC', panel: 'Urinalysis', category: 'ua', specimen: 'Centrifuged urine', adultRange: '0–5 /HPF', units: '/HPF', aliases: ['pyuria'], high: 'UTI, inflammation, contamination.', low: 'Expected.', nursing: 'Pyuria without symptoms in a catheterized elder is not automatic antibiotics.', notes: 'HPF = high-power field.' },
    { id: 'uarbc', name: 'Urine RBC (micro)', abbrev: 'U-RBC', panel: 'Urinalysis', category: 'ua', specimen: 'Centrifuged urine', adultRange: '0–3 /HPF', units: '/HPF', aliases: ['hematuria'], high: 'UTI, stones, menses, trauma, glomerular disease, cancer workup.', low: 'Expected.', nursing: 'Ask about menses and cath trauma before you label it hematuria.', notes: 'Dysmorphic RBCs hint at a glomerular source.' },

    { id: 'fe', name: 'Serum Iron', abbrev: 'Fe', panel: 'Other', category: 'chem', specimen: 'Serum, morning preferred', adultRange: '50–170 µg/dL', units: 'µg/dL', aliases: ['iron studies'], high: 'Hemochromatosis, hemolysis, iron overdose, repeated transfusion.', low: 'Iron deficiency, anemia of inflammation.', nursing: 'Never read iron without ferritin and TIBC.', notes: 'Diurnal — morning is higher.' },
    { id: 'ferritin', name: 'Ferritin', abbrev: 'Ferr', panel: 'Other', category: 'chem', specimen: 'Serum', adultRange: 'M 30–400 · F 15–150 ng/mL', units: 'ng/mL', aliases: ['iron stores'], high: 'Acute phase, hemochromatosis, transfusion load.', low: 'Iron deficiency (most specific simple marker).', nursing: 'Ferritin rises with inflammation, so a “normal” ferritin may still hide iron deficiency.', notes: 'Low ferritin is the cleanest iron-deficiency clue.' },
    { id: 'bhcg', name: 'Beta-hCG (qualitative)', abbrev: 'hCG', panel: 'Other', category: 'endo', specimen: 'Urine or serum', adultRange: 'Negative if not pregnant', units: '', aliases: ['pregnancy test', 'beta hcg'], high: 'Pregnancy, some tumors, retained products.', low: 'Not pregnant, too-early pregnancy, dilute urine.', nursing: 'A negative urine hCG does not fully exclude very early pregnancy. Serum is more sensitive.', notes: 'Always check before teratogenic meds / imaging per protocol.' }
  ];

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getTrackUsageSafe() {
    return typeof window.trackUsageSafe === 'function' ? window.trackUsageSafe : null;
  }

  let activeChip = 'all';
  let searchTerm = '';

  function labSearchBlob(item) {
    return [
      item.name, item.abbrev, item.panel, item.category, item.adultRange,
      item.high, item.low, item.nursing, (item.aliases || []).join(' ')
    ].join(' ').toLowerCase();
  }

  function scoreLab(query, item) {
    const q = query.toLowerCase().trim();
    if (!q) return { match: true, score: 0 };
    const name = item.name.toLowerCase();
    const abbrev = String(item.abbrev || '').toLowerCase();
    const aliases = (item.aliases || []).join(' ').toLowerCase();
    const blob = labSearchBlob(item);
    let score = 0;
    if (abbrev === q || name === q) score += 80;
    if (abbrev.startsWith(q) || name.startsWith(q)) score += 40;
    if (name.includes(q)) score += 24;
    if (abbrev.includes(q)) score += 28;
    if (aliases.includes(q)) score += 18;
    if (item.panel.toLowerCase().includes(q)) score += 12;
    if (blob.includes(q)) score += 6;
    q.split(/\s+/).forEach((part) => {
      if (part.length > 1 && blob.includes(part)) score += 3;
    });
    return { match: score > 0, score };
  }

  function matchesChip(item) {
    if (activeChip === 'all') return true;
    if (activeChip === 'cbc') return item.category === 'cbc';
    return item.category === activeChip;
  }

  function filteredLabs() {
    const q = searchTerm.trim();
    let rows = labDatabase.map((item) => ({ item, ...scoreLab(q, item) })).filter((r) => r.match);
    if (q) rows.sort((a, b) => b.score - a.score);
    rows = rows.filter((r) => matchesChip(r.item));
    if (!q) {
      rows.sort((a, b) => {
        const pa = PANEL_ORDER.indexOf(a.item.panel);
        const pb = PANEL_ORDER.indexOf(b.item.panel);
        if (pa !== pb) return pa - pb;
        return labDatabase.indexOf(a.item) - labDatabase.indexOf(b.item);
      });
    }
    return rows.map((r) => r.item);
  }

  function chipCount(chipId) {
    const q = searchTerm.trim();
    return labDatabase.filter((item) => {
      if (q && !scoreLab(q, item).match) return false;
      return chipId === 'all' || item.category === chipId;
    }).length;
  }

  function renderChips() {
    const host = document.getElementById('lab-chips');
    if (!host || !window.NPRef) return;
    window.NPRef.buildSelect(host, {
      id: 'lab-filter',
      label: 'Panel',
      value: activeChip,
      options: CHIPS.map((c) => ({ id: c.id, label: c.id === 'all' ? 'All panels' : c.label, count: chipCount(c.id) })),
      onChange: (value) => {
        activeChip = value;
        renderLabList();
      }
    });
  }

  function howToTest(item) {
    const parts = [];
    if (item.specimen) parts.push('Specimen: ' + item.specimen);
    if (item.notes) parts.push(item.notes);
    return parts.join('. ');
  }

  function labBlock(kind, title, body) {
    if (!body) return '';
    const ic = kind === 'how' ? 'flask' : 'eye';
    return `<section class="rf-card rf-card--${kind}">
      <div class="rf-card-head"><span class="rf-card-ic">${window.NPRef.icon(ic)}</span><span class="rf-card-label">${escapeHtml(title)}</span></div>
      <div class="rf-card-body">${escapeHtml(body)}</div>
    </section>`;
  }

  function rangeCards(item) {
    const targets = Array.isArray(item.targets) ? item.targets : [];
    const hero = `<section class="rf-hero">
      <div class="rf-hero-label">${targets.length ? 'Usual range' : 'Normal range'}</div>
      <div class="rf-hero-value">${escapeHtml(item.adultRange)}</div>
      ${targets.length && item.rangeNote ? `<div class="rf-hero-note">${escapeHtml(item.rangeNote)}</div>` : ''}
    </section>`;
    const extra = targets.length
      ? `<div class="rf-targets">${targets.map((t) => `<section class="rf-target">
          <div class="rf-target-label">${window.NPRef.icon('target')}<span>${escapeHtml(t.label)}</span></div>
          <div class="rf-target-value">${escapeHtml(t.range)}</div>
          ${t.note ? `<div class="rf-target-note">${escapeHtml(t.note)}</div>` : ''}
        </section>`).join('')}</div>`
      : '';
    return hero + extra;
  }

  function targetListHint(item) {
    const targets = Array.isArray(item.targets) ? item.targets : [];
    if (!targets.length) return '';
    if (targets.length === 1) return targets[0].label + ' ' + targets[0].range;
    return 'On treatment ' + targets.map((t) => t.range).join(' · ');
  }

  const bodyEffect = {
    wbc: ['The body is mounting a defense or the marrow is overproducing white cells.', 'Fewer cells to fight infection. Fever can be the first sign, and ordinary bugs become dangerous.'],
    rbc: ['Blood is thicker and carries more oxygen capacity, often from low plasma volume.', 'Less oxygen-carrying capacity. Fatigue, pallor, and a fast heart rate are the usual picture.'],
    hgb: ['More hemoglobin in circulation, or the same cells packed into less plasma.', 'Tissues get less oxygen. The person tires, looks pale, and breathes harder on effort.'],
    hct: ['Red cells make up more of the blood volume, often because plasma is low.', 'Red cells make up less of the blood. Oxygen delivery drops, or the blood was diluted by fluid.'],
    plt: ['More platelets are available for clotting. Flow can be sluggish if the count is extreme.', 'Clots form poorly. Gums, nose, skin, and IV sites bleed or bruise more easily.'],
    mcv: ['Red cells are larger than usual, so each one holds more volume.', 'Red cells are smaller than usual. Oxygen delivery per cell is weaker.'],
    mch: ['Each red cell holds more hemoglobin, usually because the cell itself is large.', 'Each red cell holds less hemoglobin, so the blood looks pale under the microscope.'],
    mchc: ['Hemoglobin is packed tightly in the cell. A very high number is often a lab artifact.', 'Hemoglobin is diluted inside the cell. The cells look pale.'],
    rdw: ['Red cells are uneven in size. The marrow is mixing old and new populations.', 'Cells are uniform. By itself this rarely makes the person feel anything.'],
    neut: ['More neutrophils are ready for bacteria. Bands on the differential mean the marrow is rushing.', 'Bacterial defense is thin. Infection can spread with very few outward signs.'],
    lymph: ['The adaptive immune line is up, often from a virus.', 'Antibody and cellular immunity are thinner. Viral control and vaccine response suffer.'],
    mono: ['Cleanup cells are increased, often while the body is recovering from infection.', 'A low percent alone rarely changes how the person feels.'],
    eos: ['Allergy and parasite pathways are active. Itch, wheeze, or a rash may show up.', 'Steroids or stress suppressed this line. The person usually feels the steroid effect, not the low count.'],
    baso: ['A rare high count can track with allergy or a marrow disorder.', 'A zero reading is common and usually means nothing by itself.'],
    esr: ['Red cells settle faster because inflammation proteins are up. It is a slow, nonspecific signal.', 'Cells settle slowly. This does not rule out illness.'],
    na: ['Brain cells shrink as water is pulled out. Thirst, confusion, and seizures appear if it rises fast.', 'Brain cells swell. Headache, confusion, and seizures appear if it falls fast.'],
    k: ['Heart muscle becomes irritable. Peaked T waves and a slow, wide rhythm can follow.', 'Muscles and the heart get weak. Cramps, ileus, and flat T waves or extra beats show up.'],
    cl: ['Often travels with a saline load or a metabolic acidosis. The person feels the acid–base problem more than the chloride.', 'Often follows vomiting or volume loss. The story is alkalosis or low sodium, not chloride alone.'],
    hco3: ['Blood is relatively alkaline, or the kidneys are holding bicarbonate to buffer a high CO₂.', 'Blood is relatively acidic, or the kidneys dumped bicarbonate to buffer a low CO₂. Breathing often changes to compensate.'],
    ag: ['Unmeasured acids are in the blood: lactate, ketones, toxins, or retained waste.', 'The gap looks small, often because albumin (a normal unmeasured acid) is low. The person feels the albumin problem.'],
    ca: ['Nerves fire less easily. Constipation, thirst, stones, and slow reflexes are the classic picture. The heart can slow.', 'Nerves fire too easily. Tingling, cramps, tetany, and a prolonged QT can follow.'],
    ica: ['Same body picture as a true high calcium: sluggish nerves and gut, risk to the heart rhythm.', 'Same body picture as a true low calcium: tingling, cramps, tetany. Massive transfusion citrate can cause this quickly.'],
    mg: ['Reflexes go quiet, then breathing can weaken. In obstetrics this can be the intended effect of a magnesium drip.', 'Potassium and calcium stay hard to fix. Muscles cramp and the heart is more irritable.'],
    phos: ['Usually a kidney or cell-breakdown story. Itching and calcium dropping are the longer-term effects.', 'Muscles, including the diaphragm, run out of fuel. Weakness and shallow breathing are the danger.'],
    bun: ['Waste and protein breakdown products are building, or the blood is concentrated. Appetite falls and thinking can dull if it is very high.', 'Little protein is being broken down, or the liver is not making urea. The person feels the liver or nutrition problem, not the low number.'],
    crea: ['Filtration is down or muscle is breaking down. Nausea, swelling, and low urine output follow if the kidneys are failing.', 'Little muscle is producing creatinine. The number looks “healthy” even when the kidneys are not.'],
    egfr: ['The estimate is high. Early diabetes can hyperfilter; low muscle mass can fake a high number.', 'Less filtrate is formed. Drugs and contrast linger, and waste builds as the stage falls.'],
    uric: ['Urate can crystallize in joints and kidneys. A hot joint is gout until proven otherwise.', 'A low value rarely makes the person feel anything specific.'],
    'glu-fast': ['Cells are bathed in sugar they cannot use well. Thirst, frequent urine, and blurry vision follow if it stays high.', 'The brain is short of fuel. Sweat, tremor, confusion, and unconsciousness come on fast.'],
    'glu-random': ['Same fuel problem as a high fasting sugar if it stays up. A single post-meal bump is expected.', 'Same brain-fuel emergency as a low fasting sugar.'],
    hba1c: ['Red cells have been carrying extra sugar for about three months. Vessels, eyes, kidneys, and nerves pay for that over years.', 'The average looks low because red cells did not live long enough to collect sugar, not because control was perfect.'],
    ast: ['Liver or muscle cells leaked this enzyme. The person feels the hepatitis, the drink, or the muscle injury.', 'A low value does not protect the liver and rarely changes symptoms.'],
    alt: ['Liver cells leaked a more liver-specific enzyme. Nausea, jaundice, or a tender liver may be present.', 'A low value does not mean the liver is extra healthy.'],
    alp: ['Bile flow is blocked, or bone is turning over. Itch and pale stool suggest bile. Bone pain suggests bone.', 'Rare. It tracks with poor nutrition or low zinc more than an acute feeling.'],
    ggt: ['The liver is induced or cholestatic, often alongside alcohol or a blocked bile duct.', 'A low value is not a clinical problem by itself.'],
    tbili: ['Pigment is up in the blood. Sclera and skin turn yellow. Urine may darken and stool may pale if the bile duct is blocked.', 'A low value is not something the body feels.'],
    dbili: ['Conjugated pigment is spilling into blood and urine. Stools go pale when bile cannot reach the gut.', 'A low value is the expected finding.'],
    alb: ['The blood is concentrated. It does not mean nutrition suddenly improved.', 'Fluid leaks into tissues, so ankles and abdomen swell. Drugs that bind albumin hit harder, and total calcium looks lower than it is.'],
    tp: ['The blood is concentrated, or an extra protein (such as an antibody) is being made.', 'Oncotic pressure falls with the albumin. Edema and a weaker immune protein pool follow.'],
    amy: ['Pancreas or salivary gland is irritated. Severe epigastric pain radiating to the back is the pancreas story.', 'A low value does not rule out pancreatitis and is not felt on its own.'],
    lip: ['Pancreatic cells leaked lipase. The pain pattern is the same epigastric-to-back story.', 'A low value is not protective and is not felt on its own.'],
    nh3: ['The brain is sensitive to ammonia. Sleepiness, confusion, and a flapping tremor are the encephalopathy picture.', 'A low value is not a treatment goal the body feels.'],
    ldh: ['Many tissues can leak this. Hemolysis makes the person pale and jaundiced. A heart or tumor source feels like that organ.', 'A low value is quiet. It does not clear a tissue injury and the person does not feel “low LDH.”'],
    ph: ['Enzymes and the brain prefer a narrow band. Alkalosis causes tingling, cramps, and a light head.', 'The heart and brain slow down as acid rises. Breathing gets deep if the body is trying to blow off CO₂.'],
    paco2: ['CO₂ is retained. The person is drowsy, and the drive to breathe may be weak.', 'CO₂ is being blown off. Lightheadedness and tingling come from the resulting alkalosis.'],
    pao2: ['Extra oxygen is dissolved in blood. In a few patients who chronically retain CO₂, a sudden high oxygen can slow their drive to breathe.', 'Tissues run short of oxygen. Restlessness, a fast heart, and blue mucous membranes follow.'],
    'abg-hco3': ['The metabolic side is alkaline, or the kidneys have saved bicarbonate for a chronic lung problem.', 'The metabolic side is acidic. Breathing usually speeds up to compensate.'],
    sao2: ['Hemoglobin is nearly full of oxygen. The COPD order may want a lower target on purpose.', 'Hemoglobin is underfilled. The person is short of breath and may look dusky. A poor probe can fake this.'],
    be: ['Metabolic alkali is in excess.', 'Metabolic acid has used up buffer. This is the “base deficit” people quote in shock.'],
    lactate: ['Tissues are making energy without enough oxygen, or the liver cannot clear lactate. The person is often cold, confused, or hypotensive.', 'A low lactate is the ordinary resting state.'],
    pt: ['The extrinsic clotting path is slow. Bleeding from gums, nose, or puncture sites takes longer to stop.', 'A short time is not a useful finding and is not felt.'],
    inr: ['Clotting is delayed on the same scale labs share. Bleeding risk rises as the number climbs past the intended range.', 'Off warfarin, a low-normal INR is the usual state. On warfarin, a low INR means clots are forming more easily than the team wanted.'],
    aptt: ['The intrinsic path is slow. Heparin effect or a missing factor shows up as oozing from lines and wounds.', 'A short time can mean the blood is sticky, or the sample was imperfect. It is not felt as a symptom.'],
    ddimer: ['Clot has been formed and broken down somewhere. The test cannot say whether that somewhere is a dangerous clot or just surgery, pregnancy, or infection.', 'Little clot breakdown is detectable. In the right low-risk person that argues against a new VTE.'],
    fib: ['An acute-phase protein is up. The person feels the infection or inflammation, not the fibrinogen.', 'The final fibrin mesh is scarce. Bleeding is harder to stop, especially in DIC or after a massive transfusion.'],
    tropi: ['Heart muscle has been injured and leaked troponin. Chest pain, breathlessness, or a silent equivalent may be the story.', 'Serial negatives make an acute injury less likely. The person feels the chest pain workup, not a “low troponin.”'],
    ckmb: ['Some heart or muscle injury leaked the MB fraction. Troponin is the clearer heart signal.', 'A low value does not prove the heart is fine.'],
    ck: ['Skeletal muscle is breaking down. Pain, weakness, and tea-colored urine are the rhabdo picture. The kidneys can clog.', 'A low value is the usual resting state. It is not felt, and it does not prove the muscle is healthy.'],
    bnp: ['The ventricle is stretched. The person is often breathless, swollen, and orthopneic.', 'A low value makes acute heart failure a weaker explanation for the breathlessness.'],
    chol: ['More cholesterol is available for plaque over years. One high reading is not felt today.', 'Very low cholesterol usually means illness or poor intake, not a healthier heart that day.'],
    ldl: ['The particle that loads arteries is up. Harm is measured in years of plaque, not today’s symptoms.', 'Lower is usually the aim. Extremely low values can reflect malnutrition.'],
    hdl: ['More of the particle linked with carrying cholesterol away. It is not something you feel.', 'Less of that particle. Cardiovascular risk over years is higher. Smoking and inactivity are common partners.'],
    tg: ['Very high levels make the blood milky and the pancreas angry. Mid-range highs are a long-term risk, not a feeling.', 'Usually a nutrition or thyroid story. The low number itself is quiet.'],
    tsh: ['The pituitary is shouting at a thyroid that is underdoing it. The person may feel cold, slow, heavy, and constipated.', 'The pituitary has gone quiet because thyroid hormone is already high, or replacement is too strong. Heat, tremor, and a fast heart follow if the person is actually hyperthyroid.'],
    ft4: ['Metabolism is pushed up. Heat intolerance, weight loss, tremor, and tachycardia are the body picture.', 'Metabolism is slowed. Cold intolerance, weight gain, dry skin, and a slow heart are the body picture.'],
    ft3: ['The active thyroid hormone is up. The body picture matches hyperthyroidism.', 'The active hormone is down. In ordinary illness it falls before the person has a thyroid disease.'],
    crp: ['Inflammation is active right now. Fever, pain, or a wound is usually already obvious.', 'Little acute inflammation is detectable. It does not prove the person is well.'],
    pct: ['A bacterial infection is a stronger suspect. Fever and a sick circulation are the body picture.', 'A bacterial source is less likely. Viral illness can still make the person miserable.'],
    uasg: ['Urine is concentrated. Thirst and a dry mouth match true dehydration. Sugar or contrast can raise it without that.', 'Urine is dilute. Volumes are large. Sodium in the blood may swing with it.'],
    uaph: ['Urine is alkaline. A urease infection can form stones. A sample left sitting also drifts alkaline.', 'Urine is acidic. It matches a high-protein meal or an acidosis. The person feels the cause, not the pH.'],
    uaprot: ['Protein is leaking into urine. Foamy urine, swelling, or a preeclampsia picture may be present.', 'No protein on the dipstick is the expected finding.'],
    uaglu: ['Sugar is spilling because blood sugar is above the kidney’s threshold, or an SGLT2 drug is forcing the spill.', 'A negative dipstick is expected. It does not prove the blood sugar is normal.'],
    uaket: ['Fat is being burned for fuel. A sweet breath and deep breathing plus high sugar is the DKA emergency. Starvation ketones are milder.', 'No ketones on the strip is the expected finding.'],
    uanit: ['Bacteria that convert nitrate have been in the bladder long enough. Burning urine and frequency may already be there.', 'A negative nitrite does not clear the bladder. Some bacteria never make it.'],
    uale: ['White cells are in the urine. Burning, frequency, or a dirty catch are the usual stories.', 'A negative pad does not fully clear an infection.'],
    uawbc: ['White cells are seen under the microscope. The bladder or urethra is inflamed or contaminated.', 'Few white cells is the expected finding.'],
    uarbc: ['Red cells are in the urine. Pink urine, clots, or silent blood on the dipstick are the pictures. Stones hurt. Menses can fake it.', 'Few red cells is the expected finding.'],
    fe: ['Iron in the serum is high. The tissues that store it, especially liver and heart, are the long-term target.', 'Less iron is circulating for new red cells. Fatigue follows if hemoglobin falls.'],
    ferritin: ['Stores are high, or the body is inflamed and ferritin rose as an acute-phase protein.', 'Stores are empty. Hair, nails, energy, and eventually hemoglobin suffer.'],
    bhcg: ['A pregnancy, or rarely a tumor, is producing this hormone. A missed period is the usual first body clue.', 'No hormone is detected. A very early pregnancy can still be missed, especially in dilute urine.']
  };

  function causeBodyBlock(kind, title, cause, body) {
    if (!cause && !body) return '';
    const ic = kind === 'high' ? 'up' : 'down';
    const causeHtml = cause ? `<div class="rf-split-row"><span class="rf-k">Why</span><span>${escapeHtml(cause)}</span></div>` : '';
    const bodyHtml = body ? `<div class="rf-split-row"><span class="rf-k">In the body</span><span>${escapeHtml(body)}</span></div>` : '';
    return `<section class="rf-split-card rf-split-card--${kind}">
      <div class="rf-split-head"><span class="rf-split-ic">${window.NPRef.icon(ic)}</span><span>${escapeHtml(title)}</span></div>
      ${causeHtml}${bodyHtml}
    </section>`;
  }

  function showLabDetail(item, opts) {
    const trackUsageSafe = getTrackUsageSafe();
    if (trackUsageSafe) {
      trackUsageSafe('lab_ref', 'feature_open', { item_id: item.id || 'unknown' }, { minIntervalMs: 1000, rateKey: `lab_open_${item.id || 'unknown'}` });
    }

    const detailEl = document.getElementById('lab-detail');
    if (!detailEl) return;

    const hi = causeBodyBlock('high', 'Too high', item.high, (bodyEffect[item.id] || [])[0]);
    const lo = causeBodyBlock('low', 'Too low', item.low, (bodyEffect[item.id] || [])[1]);
    const metaPills = [item.specimen, item.units].filter(Boolean)
      .map((t) => `<span class="rf-pill">${escapeHtml(t)}</span>`).join('');
    detailEl.innerHTML = `
      <div class="rf-detail-head">
        <span class="rf-badge rf-badge--lg">${escapeHtml(item.abbrev)}</span>
        <div class="rf-detail-head-text">
          <div class="rf-kicker">${escapeHtml(item.panel)}</div>
          <h3 class="rf-title">${escapeHtml(item.name)}</h3>
        </div>
      </div>
      ${metaPills ? `<div class="rf-meta">${metaPills}</div>` : ''}
      ${rangeCards(item)}
      ${(hi || lo) ? `<div class="rf-split">${hi}${lo}</div>` : ''}
      ${labBlock('how', 'How to test', howToTest(item))}
      ${item.nursing ? labBlock('watch', 'Nursing watch', item.nursing) : ''}
      <button type="button" class="rf-btn" onclick="copyLabReference()">${window.NPRef.icon('copy')}<span>Copy quick reference</span></button>
      <div class="rf-foot">Teaching ranges. Confirm with the printed slip and your CI.</div>
    `;
    window.__nursepathSelectedLab = item;

    const hub = document.querySelector('.lab-hub');
    if (hub) hub.classList.add('is-detail');
    document.querySelectorAll('.lab-row').forEach((el) => {
      el.classList.toggle('is-active', Boolean(item.id) && el.dataset.labId === String(item.id));
    });

    if (!(opts && opts.skipHistory) && typeof window.pushNursePathState === 'function') {
      window.pushNursePathState({ view: 'labs-detail', tab: 'labs', labId: item.id || null });
    }

    const isMobile = window.innerWidth < 768;
    const listContainer = document.getElementById('lab-list-container');
    const detailContainer = document.getElementById('lab-detail-container');
    if (isMobile) {
      window.__npListScroll = window.scrollY;
      if (listContainer) listContainer.classList.add('hidden');
      if (detailContainer) detailContainer.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }

  function hideLabDetail(opts) {
    const listContainer = document.getElementById('lab-list-container');
    const detailContainer = document.getElementById('lab-detail-container');
    const detailEl = document.getElementById('lab-detail');
    if (listContainer) listContainer.classList.remove('hidden');
    if (detailContainer) detailContainer.classList.add('hidden');
    const savedScroll = window.__npListScroll;
    window.__npListScroll = null;
    if (detailEl) {
      detailEl.innerHTML = window.NPRef.placeholder('flask', 'Tap a test for normal, too high, too low, and how it is drawn.');
    }

    window.__nursepathSelectedLab = null;
    const hub = document.querySelector('.lab-hub');
    if (hub) hub.classList.remove('is-detail');
    document.querySelectorAll('.lab-row.is-active').forEach((el) => el.classList.remove('is-active'));

    const trackUsageSafe = getTrackUsageSafe();
    if (trackUsageSafe) {
      trackUsageSafe('lab_ref', 'feature_use', { action: 'back_to_list' }, { minIntervalMs: 1000, rateKey: 'lab_back_to_list' });
    }

    if (!(opts && opts.skipHistory)) {
      const cur = window.history.state;
      if (cur && cur.np === 1 && cur.view === 'labs-detail') {
        window.history.back();
      } else if (typeof window.pushNursePathState === 'function') {
        window.pushNursePathState({ view: 'labs', tab: 'labs' });
      }
    }
    if (window.innerWidth < 768 && typeof savedScroll === 'number') {
      const apply = () => window.scrollTo({ top: savedScroll, behavior: 'auto' });
      apply();
      requestAnimationFrame(apply);
    }
  }

  function switchLabStudyTab(tab) {
    const tldr = document.getElementById('lab-tldr-content');
    const study = document.getElementById('lab-study-content');
    const tldrBtn = document.getElementById('lab-tldr-tab');
    const studyBtn = document.getElementById('lab-study-tab');
    if (!tldr || !study) return;
    const isStudy = tab === 'study';
    tldr.style.display = isStudy ? 'none' : '';
    study.style.display = isStudy ? '' : 'none';
    if (tldrBtn) tldrBtn.classList.toggle('is-active', !isStudy);
    if (studyBtn) studyBtn.classList.toggle('is-active', isStudy);
  }

  async function copyLabReference() {
    const item = window.__nursepathSelectedLab;
    if (!item) return;
    const targetLines = (Array.isArray(item.targets) ? item.targets : [])
      .map((t) => `${t.label}: ${t.range}${t.note ? ' — ' + t.note : ''}`);
    const text = [
      `${item.name} (${item.abbrev})`,
      `Usual range: ${item.adultRange}${item.rangeNote ? ' (' + item.rangeNote + ')' : ''}`,
      ...targetLines,
      `High: ${item.high}`,
      `Low: ${item.low}`,
      `Nursing: ${item.nursing}`,
      'NursePath learning reference — confirm with CI and the lab slip.'
    ].join('\n');
    const trackUsageSafe = getTrackUsageSafe();
    try {
      await navigator.clipboard.writeText(text);
      if (trackUsageSafe) {
        trackUsageSafe('lab_ref', 'copy_reference', { item_id: item.id || 'unknown' }, { minIntervalMs: 1200, rateKey: `lab_copy_${item.id || 'unknown'}` });
      }
    } catch (e) {
      if (trackUsageSafe) {
        trackUsageSafe('lab_ref', 'error_shown', { reason: 'clipboard_failed' }, { minIntervalMs: 1500, rateKey: 'lab_copy_error' });
      }
    }
  }

  function renderLabList() {
    const host = document.getElementById('lab-list');
    if (!host) return;
    renderChips();
    const items = filteredLabs();
    const fragment = document.createDocumentFragment();
    const selectedId = window.__nursepathSelectedLab && window.__nursepathSelectedLab.id;
    const q = searchTerm.trim();
    window.NPRef.setCount(document.getElementById('lab-count'), items.length, labDatabase.length, 'tests', Boolean(q) || activeChip !== 'all');

    if (!items.length) {
      const empty = document.createElement('div');
      empty.className = 'rf-empty';
      empty.textContent = 'No matches. Try an abbreviation (K, Hgb, INR), a panel (ABG, CBC), or a clue (hyponatremia, DKA).';
      fragment.appendChild(empty);
      host.innerHTML = '';
      host.appendChild(fragment);
      return;
    }

    let lastPanel = '';
    items.forEach((item) => {
      if (!q && item.panel !== lastPanel) {
        lastPanel = item.panel;
        const label = document.createElement('div');
        label.className = 'rf-group';
        label.textContent = item.panel;
        fragment.appendChild(label);
      }
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'rf-row' + (selectedId && item.id === selectedId ? ' is-active' : '');
      row.dataset.labId = item.id || '';
      const hint = targetListHint(item);
      row.innerHTML = `
        <span class="rf-badge">${escapeHtml(item.abbrev)}</span>
        <span class="rf-row-body">
          <span class="rf-row-title">${escapeHtml(item.name)}</span>
          <span class="rf-row-sub">${escapeHtml(item.adultRange)}</span>
          ${hint ? `<span class="rf-row-hint">${escapeHtml(hint)}</span>` : ''}
        </span>
        <span class="rf-row-go">${window.NPRef.icon('chevron')}</span>`;
      row.onclick = () => showLabDetail(item);
      fragment.appendChild(row);
    });

    host.innerHTML = '';
    host.appendChild(fragment);
  }

  let searchTimer = null;

  function initLabRanges() {
    renderLabList();
    const input = document.getElementById('lab-search');
    if (window.NPRef) window.NPRef.bindSearch(input);
    if (input && !input.dataset.npBound) {
      input.dataset.npBound = '1';
      input.addEventListener('input', (e) => {
        if (searchTimer) clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
          searchTerm = e.target.value || '';
          renderLabList();
          searchTimer = null;
        }, 220);
      });
    }
  }

  function resetLabView() {
    activeChip = 'all';
    searchTerm = '';
    const input = document.getElementById('lab-search');
    if (input) { input.value = ''; const c = input.closest('.rf-search'); if (c) c.querySelector('.rf-search-clear').hidden = true; }
    hideLabDetail({ skipHistory: true });
    renderLabList();
  }

  window.labDatabase = labDatabase;
  window.renderLabList = renderLabList;
  window.showLabDetail = showLabDetail;
  window.hideLabDetail = hideLabDetail;
  window.copyLabReference = copyLabReference;
  window.switchLabStudyTab = switchLabStudyTab;
  window.initLabRanges = initLabRanges;
  window.resetLabView = resetLabView;
})();