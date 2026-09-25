// NursePath abbreviations: ward teaching dictionary for nursing students.
// Hospital policy and the written-out order always win. Dangerous forms are flagged.

(function () {
  const CHIPS = [
    { id: 'all', label: 'A–Z' },
    { id: 'danger', label: 'Do not use' },
    { id: 'chart', label: 'Charting' },
    { id: 'orders', label: 'Orders' },
    { id: 'routes', label: 'Routes' },
    { id: 'labs', label: 'Labs' }
  ];

  const abbreviations = [
    { id: 'aaa', abbrev: 'AAA', meaning: 'Abdominal aortic aneurysm', where: 'History, imaging notes', group: 'chart' },
    { id: 'abd', abbrev: 'abd', meaning: 'Abdomen', where: 'Assessment notes', group: 'chart' },
    { id: 'abg', abbrev: 'ABG', meaning: 'Arterial blood gas', where: 'Lab orders and results', group: 'labs' },
    { id: 'ac', abbrev: 'ac', meaning: 'Before meals', where: 'Medication timing', group: 'orders', aliases: ['ante cibum'] },
    { id: 'ad', abbrev: 'AD', meaning: 'Right ear', where: 'Old ear orders', group: 'routes', danger: true, caution: 'Write “right ear.” AD is confused with OD (right eye).' },
    { id: 'adlib', abbrev: 'ad lib', meaning: 'As desired', where: 'Activity and diet orders', group: 'orders' },
    { id: 'adl', abbrev: 'ADL', meaning: 'Activities of daily living', where: 'Nursing notes', group: 'chart' },
    { id: 'af', abbrev: 'AF / AFib', meaning: 'Atrial fibrillation', where: 'Cardiac history and monitors', group: 'chart' },
    { id: 'aka', abbrev: 'AKA', meaning: 'Above-knee amputation', where: 'Surgical history', group: 'chart' },
    { id: 'ama', abbrev: 'AMA', meaning: 'Against medical advice', where: 'Discharge notes', group: 'chart' },
    { id: 'amb', abbrev: 'amb', meaning: 'Ambulate / ambulatory', where: 'Activity orders', group: 'orders' },
    { id: 'ap', abbrev: 'AP', meaning: 'Apical pulse, or anteroposterior', where: 'Vitals or x-ray labels', group: 'chart', caution: 'Read the sentence. AP can be a pulse or an x-ray view.' },
    { id: 'asa', abbrev: 'ASA', meaning: 'Aspirin (acetylsalicylic acid)', where: 'Medication lists', group: 'orders' },
    { id: 'as', abbrev: 'AS', meaning: 'Left ear', where: 'Old ear orders', group: 'routes', danger: true, caution: 'Write “left ear.” AS is confused with OS (left eye).' },
    { id: 'au', abbrev: 'AU', meaning: 'Both ears', where: 'Old ear orders', group: 'routes', danger: true, caution: 'Write “both ears.” AU is confused with OU (both eyes).' },
    { id: 'ax', abbrev: 'Ax', meaning: 'Axillary (usually temperature site)', where: 'Vital signs', group: 'chart' },

    { id: 'bid', abbrev: 'BID', meaning: 'Twice a day', where: 'Medication frequency', group: 'orders', aliases: ['b.i.d.', 'bis in die'] },
    { id: 'bka', abbrev: 'BKA', meaning: 'Below-knee amputation', where: 'Surgical history', group: 'chart' },
    { id: 'bm', abbrev: 'BM', meaning: 'Bowel movement', where: 'Elimination notes', group: 'chart' },
    { id: 'bmi', abbrev: 'BMI', meaning: 'Body mass index', where: 'Nutrition and assessment', group: 'chart' },
    { id: 'bp', abbrev: 'BP', meaning: 'Blood pressure', where: 'Vital signs', group: 'chart' },
    { id: 'bpm', abbrev: 'BPM', meaning: 'Beats per minute', where: 'Heart rate', group: 'chart' },
    { id: 'br', abbrev: 'BR', meaning: 'Bed rest', where: 'Activity orders', group: 'orders' },
    { id: 'brp', abbrev: 'BRP', meaning: 'Bathroom privileges', where: 'Activity orders', group: 'orders' },
    { id: 'bs', abbrev: 'BS', meaning: 'Blood sugar, bowel sounds, or breath sounds', where: 'Notes and bedside reports', group: 'chart', caution: 'Write the words. BS is one of the easiest abbreviations to misread.' },
    { id: 'bun', abbrev: 'BUN', meaning: 'Blood urea nitrogen', where: 'Chemistry panel', group: 'labs' },
    { id: 'bx', abbrev: 'Bx', meaning: 'Biopsy', where: 'Procedure notes', group: 'chart' },

    { id: 'c', abbrev: 'c̅', meaning: 'With', where: 'Older handwritten notes', group: 'chart', caution: 'A line over the c means with. A line over the s means without. Write the word if the line is unclear.' },
    { id: 'ca', abbrev: 'Ca', meaning: 'Calcium, or cancer', where: 'Labs or diagnosis lines', group: 'labs', caution: 'Ca²⁺ is the lab. “Ca” alone on a diagnosis line may mean cancer. Read the context.' },
    { id: 'cabg', abbrev: 'CABG', meaning: 'Coronary artery bypass graft', where: 'Cardiac history', group: 'chart', aliases: ['cabbage'] },
    { id: 'cad', abbrev: 'CAD', meaning: 'Coronary artery disease', where: 'History', group: 'chart' },
    { id: 'cap', abbrev: 'cap', meaning: 'Capsule', where: 'Medication orders', group: 'orders' },
    { id: 'cbc', abbrev: 'CBC', meaning: 'Complete blood count', where: 'Lab orders', group: 'labs' },
    { id: 'cbr', abbrev: 'CBR', meaning: 'Complete bed rest', where: 'Activity orders', group: 'orders' },
    { id: 'cc', abbrev: 'cc', meaning: 'Cubic centimeter (same volume as mL)', where: 'Old volume orders', group: 'orders', danger: true, caution: 'Write mL. cc is mistaken for u (units).' },
    { id: 'cc-chief', abbrev: 'CC', meaning: 'Chief complaint', where: 'Admission notes', group: 'chart', caution: 'Not the same as cc for cubic centimeter. Context decides.' },
    { id: 'chf', abbrev: 'CHF', meaning: 'Congestive heart failure', where: 'History', group: 'chart' },
    { id: 'ckd', abbrev: 'CKD', meaning: 'Chronic kidney disease', where: 'History and renal labs', group: 'chart' },
    { id: 'cns', abbrev: 'CNS', meaning: 'Central nervous system', where: 'Assessment', group: 'chart' },
    { id: 'co', abbrev: 'c/o', meaning: 'Complains of', where: 'Nursing notes', group: 'chart' },
    { id: 'copd', abbrev: 'COPD', meaning: 'Chronic obstructive pulmonary disease', where: 'History', group: 'chart' },
    { id: 'cpr', abbrev: 'CPR', meaning: 'Cardiopulmonary resuscitation', where: 'Emergency notes and code status', group: 'chart' },
    { id: 'cs', abbrev: 'C&S', meaning: 'Culture and sensitivity', where: 'Microbiology orders', group: 'labs' },
    { id: 'csf', abbrev: 'CSF', meaning: 'Cerebrospinal fluid', where: 'Procedure and lab notes', group: 'labs' },
    { id: 'ct', abbrev: 'CT', meaning: 'Computed tomography', where: 'Imaging orders', group: 'chart' },
    { id: 'cva', abbrev: 'CVA', meaning: 'Cerebrovascular accident, or costovertebral angle', where: 'Neuro history or kidney exam', group: 'chart', caution: 'Stroke history and “CVA tenderness” are different. Write which one you mean.' },
    { id: 'cxr', abbrev: 'CXR', meaning: 'Chest x-ray', where: 'Imaging', group: 'chart' },

    { id: 'dat', abbrev: 'DAT', meaning: 'Diet as tolerated', where: 'Diet orders', group: 'orders' },
    { id: 'dc', abbrev: 'D/C', meaning: 'Discharge, or discontinue', where: 'Old orders', group: 'orders', danger: true, caution: 'Write “discharge” or “discontinue.” The slash form has caused medicines to be stopped by mistake.' },
    { id: 'dm', abbrev: 'DM', meaning: 'Diabetes mellitus', where: 'History', group: 'chart' },
    { id: 'dnr', abbrev: 'DNR', meaning: 'Do not resuscitate', where: 'Code status', group: 'chart', caution: 'Follow the signed order and hospital language, not a note abbreviation alone.' },
    { id: 'dob', abbrev: 'DOB', meaning: 'Date of birth', where: 'Identifiers', group: 'chart' },
    { id: 'doe', abbrev: 'DOE', meaning: 'Dyspnea on exertion', where: 'Respiratory notes', group: 'chart' },
    { id: 'dvt', abbrev: 'DVT', meaning: 'Deep vein thrombosis', where: 'History and leg assessment', group: 'chart' },
    { id: 'dx', abbrev: 'Dx', meaning: 'Diagnosis', where: 'Notes and orders', group: 'chart' },

    { id: 'ecg', abbrev: 'ECG / EKG', meaning: 'Electrocardiogram', where: 'Cardiac tests', group: 'labs', aliases: ['ekg'] },
    { id: 'ed', abbrev: 'ED', meaning: 'Emergency department', where: 'Location notes', group: 'chart' },
    { id: 'eeg', abbrev: 'EEG', meaning: 'Electroencephalogram', where: 'Neuro tests', group: 'labs' },
    { id: 'esr', abbrev: 'ESR', meaning: 'Erythrocyte sedimentation rate', where: 'Labs', group: 'labs', aliases: ['sed rate'] },

    { id: 'fbs', abbrev: 'FBS', meaning: 'Fasting blood sugar', where: 'Glucose orders', group: 'labs' },
    { id: 'ffp', abbrev: 'FFP', meaning: 'Fresh frozen plasma', where: 'Transfusion orders', group: 'orders' },
    { id: 'fhr', abbrev: 'FHR', meaning: 'Fetal heart rate', where: 'Labor notes', group: 'chart' },
    { id: 'fx', abbrev: 'Fx', meaning: 'Fracture', where: 'Injury notes', group: 'chart' },

    { id: 'gcs', abbrev: 'GCS', meaning: 'Glasgow Coma Scale', where: 'Neuro assessment', group: 'chart' },
    { id: 'gi', abbrev: 'GI', meaning: 'Gastrointestinal', where: 'Assessment and meds', group: 'chart' },
    { id: 'gtt', abbrev: 'gtt', meaning: 'Drop', where: 'IV flow rates', group: 'orders', caution: 'Still taught for gtt/min. Write “drop” if the handwriting is unclear.' },
    { id: 'gu', abbrev: 'GU', meaning: 'Genitourinary', where: 'Assessment', group: 'chart' },

    { id: 'hh', abbrev: 'H&H', meaning: 'Hemoglobin and hematocrit', where: 'Lab shorthand', group: 'labs' },
    { id: 'ha', abbrev: 'HA', meaning: 'Headache', where: 'Symptom notes', group: 'chart' },
    { id: 'hgb', abbrev: 'Hgb / Hb', meaning: 'Hemoglobin', where: 'CBC', group: 'labs' },
    { id: 'hct', abbrev: 'Hct', meaning: 'Hematocrit', where: 'CBC', group: 'labs' },
    { id: 'hob', abbrev: 'HOB', meaning: 'Head of bed', where: 'Positioning orders', group: 'orders' },
    { id: 'hr', abbrev: 'HR', meaning: 'Heart rate', where: 'Vital signs', group: 'chart' },
    { id: 'hs', abbrev: 'HS', meaning: 'At bedtime, or half-strength', where: 'Old timing or dose lines', group: 'orders', danger: true, caution: 'Write “at bedtime” or “half-strength.” HS has been read both ways.' },
    { id: 'htn', abbrev: 'HTN', meaning: 'Hypertension', where: 'History', group: 'chart' },
    { id: 'hx', abbrev: 'Hx', meaning: 'History', where: 'Notes', group: 'chart' },

    { id: 'id', abbrev: 'ID', meaning: 'Intradermal, or identification', where: 'Injection route or patient ID', group: 'routes', caution: '“ID” on a med is the route. “ID band” is identity. Do not guess.' },
    { id: 'im', abbrev: 'IM', meaning: 'Intramuscular', where: 'Injection route', group: 'routes' },
    { id: 'io', abbrev: 'I&O', meaning: 'Intake and output', where: 'Fluid balance', group: 'chart' },
    { id: 'icu', abbrev: 'ICU', meaning: 'Intensive care unit', where: 'Location', group: 'chart' },
    { id: 'iu', abbrev: 'IU', meaning: 'International unit', where: 'Old dose lines', group: 'orders', danger: true, caution: 'Write “units.” IU is misread as IV or 10.' },
    { id: 'iv', abbrev: 'IV', meaning: 'Intravenous', where: 'Route and access', group: 'routes' },
    { id: 'ivp', abbrev: 'IVP', meaning: 'IV push, or IV pyelogram', where: 'Med routes or imaging', group: 'routes', danger: true, caution: 'Write “IV push” or the imaging name. A push and a pyelogram are not the same order.' },
    { id: 'ivpb', abbrev: 'IVPB', meaning: 'IV piggyback', where: 'Infusion orders', group: 'routes' },

    { id: 'k', abbrev: 'K⁺', meaning: 'Potassium', where: 'Electrolytes', group: 'labs', aliases: ['k'] },
    { id: 'kcl', abbrev: 'KCl', meaning: 'Potassium chloride', where: 'Medication orders', group: 'orders', caution: 'Never IV-push potassium. Follow the infusion order.' },
    { id: 'kub', abbrev: 'KUB', meaning: 'Kidneys, ureters, bladder (x-ray)', where: 'Imaging', group: 'chart' },
    { id: 'kvo', abbrev: 'KVO', meaning: 'Keep vein open', where: 'IV rate orders', group: 'orders', aliases: ['tko'] },

    { id: 'leading', abbrev: 'Leading zero', meaning: 'Write 0.5 mg, not .5 mg', where: 'Handwritten doses', group: 'orders', danger: true, caution: 'A bare decimal is easy to read as 5 mg. Put the zero in front.' },
    { id: 'lmp', abbrev: 'LMP', meaning: 'Last menstrual period', where: 'Obstetric history', group: 'chart' },
    { id: 'loc', abbrev: 'LOC', meaning: 'Level of consciousness, or laxative of choice', where: 'Neuro notes or old orders', group: 'chart', caution: 'Write the phrase. These two meanings do not belong in the same sentence.' },
    { id: 'lp', abbrev: 'LP', meaning: 'Lumbar puncture', where: 'Procedure notes', group: 'chart' },
    { id: 'lr', abbrev: 'LR', meaning: 'Lactated Ringer’s', where: 'IV fluids', group: 'orders' },
    { id: 'lt', abbrev: 'LT', meaning: 'Left', where: 'Site descriptions', group: 'chart' },

    { id: 'mar', abbrev: 'MAR', meaning: 'Medication administration record', where: 'Medication documentation', group: 'orders' },
    { id: 'mcg', abbrev: 'mcg', meaning: 'Microgram', where: 'Doses', group: 'orders', caution: 'Preferred spelling. Do not use the Greek µ symbol.' },
    { id: 'ug', abbrev: 'µg', meaning: 'Microgram, written with the Greek mu', where: 'Old dose lines', group: 'orders', danger: true, caution: 'Write mcg. µg is misread as mg, a thousand-fold error.' },
    { id: 'meq', abbrev: 'mEq', meaning: 'Milliequivalent', where: 'Electrolyte doses', group: 'orders' },
    { id: 'mi', abbrev: 'MI', meaning: 'Myocardial infarction', where: 'Cardiac history', group: 'chart' },
    { id: 'ml', abbrev: 'mL', meaning: 'Milliliter', where: 'Volumes', group: 'orders' },
    { id: 'mri', abbrev: 'MRI', meaning: 'Magnetic resonance imaging', where: 'Imaging', group: 'chart' },
    { id: 'mrsa', abbrev: 'MRSA', meaning: 'Methicillin-resistant Staphylococcus aureus', where: 'Infection notes', group: 'labs' },
    { id: 'ms', abbrev: 'MS', meaning: 'Morphine sulfate, magnesium sulfate, or multiple sclerosis', where: 'Old dose lines or history', group: 'orders', danger: true, caution: 'Write the full drug or the diagnosis. Never use MS for a medicine.' },
    { id: 'mso4', abbrev: 'MSO₄', meaning: 'Morphine sulfate', where: 'Old dose lines', group: 'orders', danger: true, caution: 'Write “morphine sulfate.” MSO₄ is confused with magnesium sulfate.' },
    { id: 'mgso4', abbrev: 'MgSO₄', meaning: 'Magnesium sulfate', where: 'Old dose lines', group: 'orders', danger: true, caution: 'Write “magnesium sulfate.” MgSO₄ is confused with morphine.' },

    { id: 'na', abbrev: 'Na⁺', meaning: 'Sodium', where: 'Electrolytes', group: 'labs', aliases: ['na'] },
    { id: 'nad', abbrev: 'NAD', meaning: 'No acute distress', where: 'General appearance', group: 'chart' },
    { id: 'ng', abbrev: 'NG / NGT', meaning: 'Nasogastric / nasogastric tube', where: 'Tubes and routes', group: 'routes' },
    { id: 'nka', abbrev: 'NKA', meaning: 'No known allergies', where: 'Allergy line', group: 'chart' },
    { id: 'nkda', abbrev: 'NKDA', meaning: 'No known drug allergies', where: 'Allergy line', group: 'chart' },
    { id: 'npo', abbrev: 'NPO', meaning: 'Nothing by mouth', where: 'Diet orders', group: 'orders' },
    { id: 'ns', abbrev: 'NS', meaning: 'Normal saline (0.9% sodium chloride)', where: 'IV fluids', group: 'orders' },
    { id: 'nv', abbrev: 'N/V', meaning: 'Nausea and vomiting', where: 'Symptom notes', group: 'chart' },

    { id: 'o2', abbrev: 'O₂', meaning: 'Oxygen', where: 'Respiratory orders', group: 'orders' },
    { id: 'ob', abbrev: 'OB', meaning: 'Obstetrics', where: 'Service and history', group: 'chart' },
    { id: 'od', abbrev: 'OD', meaning: 'Right eye, once daily, or overdose', where: 'Eye orders, frequency, or emergency notes', group: 'routes', danger: true, caution: 'Write “right eye,” “daily,” or “overdose.” OD is three different orders.' },
    { id: 'os', abbrev: 'OS', meaning: 'Left eye', where: 'Old eye orders', group: 'routes', danger: true, caution: 'Write “left eye.” OS is confused with AS (left ear) and with “os” for mouth.' },
    { id: 'ou', abbrev: 'OU', meaning: 'Both eyes', where: 'Old eye orders', group: 'routes', danger: true, caution: 'Write “both eyes.”' },
    { id: 'oob', abbrev: 'OOB', meaning: 'Out of bed', where: 'Activity', group: 'orders' },
    { id: 'or', abbrev: 'OR', meaning: 'Operating room', where: 'Location', group: 'chart' },
    { id: 'ot', abbrev: 'OT', meaning: 'Occupational therapy', where: 'Referrals', group: 'chart' },
    { id: 'otc', abbrev: 'OTC', meaning: 'Over the counter', where: 'Medication history', group: 'orders' },

    { id: 'pc', abbrev: 'pc', meaning: 'After meals', where: 'Medication timing', group: 'orders' },
    { id: 'pca', abbrev: 'PCA', meaning: 'Patient-controlled analgesia', where: 'Pain orders', group: 'orders' },
    { id: 'perrla', abbrev: 'PERRLA', meaning: 'Pupils equal, round, reactive to light and accommodation', where: 'Neuro exam', group: 'chart' },
    { id: 'pmh', abbrev: 'PMH', meaning: 'Past medical history', where: 'History', group: 'chart' },
    { id: 'po', abbrev: 'PO', meaning: 'By mouth', where: 'Medication route', group: 'routes' },
    { id: 'pr', abbrev: 'PR', meaning: 'Per rectum', where: 'Medication route', group: 'routes' },
    { id: 'prbc', abbrev: 'PRBC', meaning: 'Packed red blood cells', where: 'Transfusion', group: 'orders' },
    { id: 'prn', abbrev: 'PRN', meaning: 'As needed', where: 'Medication and care orders', group: 'orders', aliases: ['pro re nata'] },
    { id: 'pt', abbrev: 'PT', meaning: 'Prothrombin time, or physical therapy', where: 'Coagulation labs or referrals', group: 'labs', caution: 'A lab slip PT is the clotting time. A referral PT is the therapist. Write it out when both exist.' },
    { id: 'ptt', abbrev: 'PTT / aPTT', meaning: 'Partial thromboplastin time', where: 'Coagulation labs', group: 'labs' },
    { id: 'pvc', abbrev: 'PVC', meaning: 'Premature ventricular contraction', where: 'Monitor strips', group: 'chart' },

    { id: 'q', abbrev: 'q', meaning: 'Every', where: 'Frequency (q4h, q8h)', group: 'orders' },
    { id: 'qd', abbrev: 'QD', meaning: 'Daily', where: 'Old frequency lines', group: 'orders', danger: true, caution: 'Write “daily.” QD is misread as QID (four times a day).' },
    { id: 'qh', abbrev: 'qh', meaning: 'Every hour', where: 'Frequency', group: 'orders' },
    { id: 'q2h', abbrev: 'q2h', meaning: 'Every 2 hours', where: 'Frequency', group: 'orders' },
    { id: 'q4h', abbrev: 'q4h', meaning: 'Every 4 hours', where: 'Frequency', group: 'orders' },
    { id: 'qid', abbrev: 'QID', meaning: 'Four times a day', where: 'Medication frequency', group: 'orders' },
    { id: 'qod', abbrev: 'QOD', meaning: 'Every other day', where: 'Old frequency lines', group: 'orders', danger: true, caution: 'Write “every other day.” QOD is misread as QD or QID.' },

    { id: 'ra', abbrev: 'RA', meaning: 'Room air, rheumatoid arthritis, or right atrium', where: 'Oxygen notes, history, or cardiac lines', group: 'chart', caution: '“On RA” usually means room air. Do not assume if the note is about joints or the heart.' },
    { id: 'rbc', abbrev: 'RBC', meaning: 'Red blood cell', where: 'CBC', group: 'labs' },
    { id: 'rle', abbrev: 'RLE', meaning: 'Right lower extremity, or related learning experience', where: 'Limb notes, or Philippine nursing school schedules', group: 'chart', caution: 'On a chart, RLE is the leg. In school, RLE is duty. Never mix the two in a clinical note.' },
    { id: 'rll', abbrev: 'RLL', meaning: 'Right lower lobe', where: 'Lung assessment', group: 'chart' },
    { id: 'rlq', abbrev: 'RLQ', meaning: 'Right lower quadrant', where: 'Abdominal assessment', group: 'chart' },
    { id: 'rom', abbrev: 'ROM', meaning: 'Range of motion', where: 'Musculoskeletal notes', group: 'chart' },
    { id: 'rr', abbrev: 'RR', meaning: 'Respiratory rate', where: 'Vital signs', group: 'chart' },
    { id: 'rt', abbrev: 'RT', meaning: 'Right, or respiratory therapy', where: 'Site or referrals', group: 'chart', caution: '“RT arm” is the side. “RT to see” is the therapist.' },
    { id: 'ruq', abbrev: 'RUQ', meaning: 'Right upper quadrant', where: 'Abdominal assessment', group: 'chart' },
    { id: 'rx', abbrev: 'Rx', meaning: 'Prescription / treatment', where: 'Orders', group: 'orders' },

    { id: 's', abbrev: 's̅', meaning: 'Without', where: 'Older handwritten notes', group: 'chart', caution: 'A line over the s means without. Write the word if the line is easy to miss.' },
    { id: 'sbp', abbrev: 'SBP', meaning: 'Systolic blood pressure', where: 'Vital signs', group: 'chart' },
    { id: 'sq', abbrev: 'SQ / SC', meaning: 'Subcutaneous', where: 'Old injection routes', group: 'routes', danger: true, caution: 'Write “subcut” or “subcutaneous.” SQ is misread as “5 every,” and SC as SL.' },
    { id: 'sl', abbrev: 'SL', meaning: 'Sublingual', where: 'Medication route', group: 'routes' },
    { id: 'sob', abbrev: 'SOB', meaning: 'Shortness of breath', where: 'Respiratory notes', group: 'chart' },
    { id: 'sp', abbrev: 'S/P', meaning: 'Status post', where: 'History after a procedure', group: 'chart' },
    { id: 'spo2', abbrev: 'SpO₂', meaning: 'Oxygen saturation by pulse oximeter', where: 'Vital signs', group: 'chart' },
    { id: 'stat', abbrev: 'STAT', meaning: 'Immediately', where: 'Urgent orders', group: 'orders' },
    { id: 'subcut', abbrev: 'subcut', meaning: 'Subcutaneous', where: 'Preferred injection-route wording', group: 'routes' },
    { id: 'sx', abbrev: 'Sx', meaning: 'Symptoms, or surgery', where: 'Notes', group: 'chart', caution: 'Write “symptoms” or “surgery.”' },

    { id: 't', abbrev: 'T', meaning: 'Temperature', where: 'Vital signs', group: 'chart' },
    { id: 'tab', abbrev: 'tab', meaning: 'Tablet', where: 'Medication orders', group: 'orders' },
    { id: 'tb', abbrev: 'TB', meaning: 'Tuberculosis', where: 'History and isolation', group: 'chart' },
    { id: 'tbsp', abbrev: 'tbsp', meaning: 'Tablespoon (15 mL)', where: 'Household measures', group: 'orders', caution: 'Use mL on a medication order when you can.' },
    { id: 'tid', abbrev: 'TID', meaning: 'Three times a day', where: 'Medication frequency', group: 'orders' },
    { id: 'tiw', abbrev: 'TIW', meaning: 'Three times a week', where: 'Old frequency lines', group: 'orders', danger: true, caution: 'Write “3 times weekly.” TIW is misread as TID or twice weekly.' },
    { id: 'tpr', abbrev: 'TPR', meaning: 'Temperature, pulse, respiration', where: 'Vital-sign shorthand', group: 'chart' },
    { id: 'tpn', abbrev: 'TPN', meaning: 'Total parenteral nutrition', where: 'IV nutrition', group: 'orders' },
    { id: 'trailing', abbrev: 'Trailing zero', meaning: 'Write 5 mg, not 5.0 mg', where: 'Handwritten doses', group: 'orders', danger: true, caution: 'The decimal and zero can be read as 50 mg. Drop the trailing zero.' },
    { id: 'tsp', abbrev: 'tsp', meaning: 'Teaspoon (5 mL)', where: 'Household measures', group: 'orders', caution: 'Use mL on a medication order when you can.' },
    { id: 'tx', abbrev: 'Tx', meaning: 'Treatment, or traction', where: 'Plans and ortho notes', group: 'chart', caution: 'Write the word when both could fit.' },

    { id: 'u', abbrev: 'U', meaning: 'Unit', where: 'Old insulin and heparin lines', group: 'orders', danger: true, caution: 'Write “unit.” U is misread as 0 or 4, so 10 U can look like 100.' },
    { id: 'ua', abbrev: 'UA', meaning: 'Urinalysis', where: 'Lab orders', group: 'labs' },
    { id: 'uri', abbrev: 'URI', meaning: 'Upper respiratory infection', where: 'Assessment', group: 'chart' },
    { id: 'uti', abbrev: 'UTI', meaning: 'Urinary tract infection', where: 'Assessment', group: 'chart' },

    { id: 'vs', abbrev: 'VS', meaning: 'Vital signs', where: 'Flow sheets', group: 'chart' },
    { id: 'vte', abbrev: 'VTE', meaning: 'Venous thromboembolism', where: 'Clot history and prophylaxis', group: 'chart' },

    { id: 'wbc', abbrev: 'WBC', meaning: 'White blood cell', where: 'CBC', group: 'labs' },
    { id: 'wnl', abbrev: 'WNL', meaning: 'Within normal limits', where: 'Shorthand assessments', group: 'chart', caution: 'Name what you actually checked. “WNL” alone hides the exam.' },
    { id: 'wt', abbrev: 'wt', meaning: 'Weight', where: 'Measurements', group: 'chart' },

    { id: 'yo', abbrev: 'y/o', meaning: 'Year(s) old', where: 'Age', group: 'chart' }
  ];

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  let activeChip = 'all';
  let searchTerm = '';

  function blob(item) {
    return [item.abbrev, item.meaning, item.where, item.caution, (item.aliases || []).join(' ')].join(' ').toLowerCase();
  }

  function filtered() {
    const q = searchTerm.trim().toLowerCase();
    let rows = abbreviations.filter((item) => {
      if (activeChip === 'danger' && !item.danger) return false;
      if (activeChip !== 'all' && activeChip !== 'danger' && item.group !== activeChip) return false;
      if (!q) return true;
      return blob(item).includes(q);
    });
    rows.sort((a, b) => a.abbrev.localeCompare(b.abbrev, 'en', { sensitivity: 'base' }));
    return rows;
  }

  function letterOf(item) {
    const ch = String(item.abbrev || '').replace(/[^A-Za-z0-9]/g, '').charAt(0).toUpperCase();
    return /[A-Z]/.test(ch) ? ch : '#';
  }

  function renderChips() {
    const host = document.getElementById('ab-chips');
    if (!host) return;
    host.innerHTML = '';
    CHIPS.forEach((chip) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ab-chip' + (chip.id === activeChip ? ' is-active' : '');
      btn.textContent = chip.label;
      btn.setAttribute('aria-pressed', chip.id === activeChip ? 'true' : 'false');
      btn.onclick = () => {
        activeChip = chip.id;
        renderAbbrevList();
      };
      host.appendChild(btn);
    });
  }

  function block(kind, title, body) {
    if (!body) return '';
    return `<section class="ab-block ab-block-${kind}"><h4>${escapeHtml(title)}</h4><p>${escapeHtml(body)}</p></section>`;
  }

  function showAbbrevDetail(item, opts) {
    const detailEl = document.getElementById('ab-detail');
    if (!detailEl || !item) return;
    const track = typeof window.trackUsageSafe === 'function' ? window.trackUsageSafe : null;
    if (track) track('abbrev_ref', 'feature_open', { item_id: item.id }, { minIntervalMs: 1000, rateKey: `ab_open_${item.id}` });

    detailEl.innerHTML = `
      <p class="ab-kicker">${item.danger ? 'Do not use' : 'Abbreviation'}</p>
      <h3 class="ab-title">${escapeHtml(item.abbrev)}</h3>
      ${block('ok', 'Means', item.meaning)}
      ${block('where', 'Where you see it', item.where)}
      ${item.caution ? block(item.danger ? 'stop' : 'watch', item.danger ? 'Write it out' : 'Watch', item.caution) : ''}
      <p class="ab-note">Teaching list. Your hospital’s approved abbreviation list wins.</p>`;
    window.__nursepathSelectedAbbrev = item;
    document.querySelectorAll('.ab-row').forEach((el) => {
      el.classList.toggle('is-active', el.dataset.abId === item.id);
    });

    if (!(opts && opts.skipHistory) && typeof window.pushNursePathState === 'function') {
      window.pushNursePathState({ view: 'abbrev-detail', tab: 'abbrev', abbrevId: item.id });
    }

    const hub = document.querySelector('.ab-hub');
    const list = document.getElementById('ab-list-container');
    const detail = document.getElementById('ab-detail-container');
    if (window.innerWidth < 768) {
      if (hub) hub.classList.add('is-detail');
      if (list) list.classList.add('hidden');
      if (detail) {
        detail.classList.remove('hidden');
        detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  function hideAbbrevDetail(opts) {
    const list = document.getElementById('ab-list-container');
    const detail = document.getElementById('ab-detail-container');
    const detailEl = document.getElementById('ab-detail');
    const hub = document.querySelector('.ab-hub');
    if (hub) hub.classList.remove('is-detail');
    if (list) list.classList.remove('hidden');
    if (detail) detail.classList.add('hidden');
    if (detailEl) detailEl.innerHTML = '<p class="ab-placeholder">Tap a short form for the meaning, where it shows up, and when to write the words instead.</p>';
    window.__nursepathSelectedAbbrev = null;
    document.querySelectorAll('.ab-row.is-active').forEach((el) => el.classList.remove('is-active'));
    if (!(opts && opts.skipHistory)) {
      const cur = window.history.state;
      if (cur && cur.np === 1 && cur.view === 'abbrev-detail') {
        window.history.back();
        return;
      }
      if (typeof window.pushNursePathState === 'function') window.pushNursePathState({ view: 'abbrev', tab: 'abbrev' });
    }
  }

  function renderAbbrevList() {
    const host = document.getElementById('ab-list');
    if (!host) return;
    renderChips();
    const items = filtered();
    const fragment = document.createDocumentFragment();
    const selected = window.__nursepathSelectedAbbrev && window.__nursepathSelectedAbbrev.id;
    const q = searchTerm.trim();
    if (!items.length) {
      const empty = document.createElement('div');
      empty.className = 'ab-empty';
      empty.textContent = 'No matches. Try PRN, NPO, or a meaning like “twice a day.”';
      fragment.appendChild(empty);
    } else {
      let last = '';
      items.forEach((item) => {
        const letter = letterOf(item);
        if (!q && activeChip === 'all' && letter !== last) {
          last = letter;
          const label = document.createElement('div');
          label.className = 'ab-letter';
          label.textContent = letter;
          fragment.appendChild(label);
        }
        const row = document.createElement('button');
        row.type = 'button';
        row.className = 'ab-row' + (item.danger ? ' is-danger' : '') + (selected === item.id ? ' is-active' : '');
        row.dataset.abId = item.id;
        row.innerHTML = `<span class="ab-row-short">${escapeHtml(item.abbrev)}</span><span class="ab-row-mean">${escapeHtml(item.meaning)}</span>`;
        row.onclick = () => showAbbrevDetail(item);
        fragment.appendChild(row);
      });
    }
    host.innerHTML = '';
    host.appendChild(fragment);
  }

  let searchTimer = null;
  function initAbbreviations() {
    renderAbbrevList();
    const input = document.getElementById('ab-search');
    if (input && !input.dataset.npBound) {
      input.dataset.npBound = '1';
      input.addEventListener('input', (e) => {
        if (searchTimer) clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
          searchTerm = e.target.value || '';
          renderAbbrevList();
          searchTimer = null;
        }, 180);
      });
    }
  }

  function resetAbbrevView() {
    activeChip = 'all';
    searchTerm = '';
    const input = document.getElementById('ab-search');
    if (input) input.value = '';
    hideAbbrevDetail({ skipHistory: true });
    renderAbbrevList();
  }

  window.abbrevDatabase = abbreviations;
  window.renderAbbrevList = renderAbbrevList;
  window.showAbbrevDetail = showAbbrevDetail;
  window.hideAbbrevDetail = hideAbbrevDetail;
  window.initAbbreviations = initAbbreviations;
  window.resetAbbrevView = resetAbbrevView;
})();
