/* Result copy for Vital Signs and BMI. Each entry has a source. Unknown sources stay "TODO: cite". */
(function () {
    const entries = {
        'disclaimer': {
            text: 'Reference findings for study. Confirm anything that affects care with your Clinical Instructor.',
            source: 'TODO: cite'
        },
        'notEntered': { text: 'not entered', source: 'TODO: cite' },
        'checkEntry': { text: 'Check entry', source: 'TODO: cite' },
        'incomplete': { text: 'Incomplete, based on {n} of {m} vitals', source: 'TODO: cite' },
        'how.noted': { text: 'noted, thresholds not changed', source: 'TODO: cite' },
        'how.childBands': {
            text: 'Heart rate band is 70–120 bpm and respiratory rate band is 18–30/min.',
            source: 'TODO: cite'
        },
        'escalate': { text: 'Escalate per facility protocol.', source: 'TODO: cite' },
        'recheckSet': { text: 'Recheck the full vital sign set.', source: 'TODO: cite' },
        'spo2Reminder': { text: 'Check SpO2 and mental status if not assessed.', source: 'TODO: cite' },
        'asthmaTachypnea': { text: 'Asthma with tachypnea: reassess breathing and oxygenation.', source: 'TODO: cite' },
        'preeclampsiaScreen': {
            text: 'Pregnancy with an elevated BP pattern: discuss preeclampsia screening with your instructor.',
            source: 'TODO: cite'
        },
        'priority.0.icon': { text: '🟢', source: 'TODO: cite' },
        'priority.0.text': { text: 'Normal / Green', source: 'TODO: cite' },
        'priority.1.icon': { text: '🟡', source: 'TODO: cite' },
        'priority.1.text': { text: 'Mild Concern / Yellow', source: 'TODO: cite' },
        'priority.2.icon': { text: '🟠', source: 'TODO: cite' },
        'priority.2.text': { text: 'Moderate Concern / Orange', source: 'TODO: cite' },
        'priority.3.icon': { text: '🔴', source: 'TODO: cite' },
        'priority.3.text': { text: 'High Priority / Red', source: 'TODO: cite' },
        'priority.4.icon': { text: '🚨', source: 'TODO: cite' },
        'priority.4.text': { text: 'Emergency / Critical', source: 'TODO: cite' },
        'meaning.0': {
            text: 'Normal / Green: every entered vital is inside this tool\'s routine band.',
            source: 'TODO: cite'
        },
        'meaning.1': {
            text: 'Mild Concern / Yellow: at least one entered vital is outside this tool\'s routine band.',
            source: 'TODO: cite'
        },
        'meaning.2': {
            text: 'Moderate Concern / Orange: the entered vitals meet this tool\'s moderate pattern.',
            source: 'TODO: cite'
        },
        'meaning.3': {
            text: 'High Priority / Red: the entered vitals meet this tool\'s high-priority pattern.',
            source: 'TODO: cite'
        },
        'meaning.4': {
            text: 'Emergency / Critical: this tool\'s priority rule placed the entered vitals in the emergency band.',
            source: 'TODO: cite'
        },
        'action.bpCrisis': {
            text: 'Recheck BP manually within 5 minutes and escalate to the clinical instructor immediately.',
            source: 'TODO: cite'
        },
        'action.bpStage2': {
            text: 'Monitor blood pressure every 15 minutes and observe for headache, chest pain, or neurologic changes.',
            source: 'TODO: cite'
        },
        'action.bpStage1': {
            text: 'Repeat the BP after a brief rest and compare it against earlier readings.',
            source: 'TODO: cite'
        },
        'action.bpLow': {
            text: 'Assess perfusion indicators such as mental status, skin signs, and capillary refill, then reassess vitals promptly.',
            source: 'TODO: cite'
        },
        'action.feverHigh': {
            text: 'Increase monitoring frequency and evaluate for fever-associated tachycardia or tachypnea.',
            source: 'TODO: cite'
        },
        'action.hypothermia': {
            text: 'Prioritize warming measures and recheck temperature.',
            source: 'TODO: cite'
        },
        'action.hrMarked': {
            text: 'Assess for pain, fever, anxiety, or dehydration.',
            source: 'TODO: cite'
        },
        'action.hrBrady': {
            text: 'Reassess perfusion and symptoms, verify reading quality, and repeat the heart rate.',
            source: 'TODO: cite'
        },
        'action.rrSevere': {
            text: 'Reassess airway and breathing immediately, and check oxygenation if available.',
            source: 'TODO: cite'
        },
        'action.rrLow': {
            text: 'Observe the depth and effort of breathing, then repeat the respiratory assessment.',
            source: 'TODO: cite'
        },
        'flag.tempHigh': { text: 'above 43°C', source: 'TODO: cite' },
        'flag.tempLow': { text: 'below 30°C', source: 'TODO: cite' },
        'flag.rrHigh': { text: 'above 60/min', source: 'TODO: cite' },
        'flag.rrLow': { text: 'below 4/min', source: 'TODO: cite' },
        'flag.hrHigh': { text: 'above 300 bpm', source: 'TODO: cite' },
        'flag.hrLow': { text: 'below 20 bpm', source: 'TODO: cite' },
        'flag.sbpHigh': { text: 'systolic above 300 mmHg', source: 'TODO: cite' },
        'flag.sbpLow': { text: 'systolic below 40 mmHg', source: 'TODO: cite' },
        'flag.dbpHigh': { text: 'diastolic above 200 mmHg', source: 'TODO: cite' },
        'flag.dbpLow': { text: 'diastolic below 20 mmHg', source: 'TODO: cite' },
        'flag.dbpOrder': { text: 'diastolic is not below systolic', source: 'TODO: cite' },
        'flag.ppWide': { text: 'pulse pressure above 80 mmHg', source: 'TODO: cite' },
        'flag.ppNarrow': { text: 'pulse pressure below 15 mmHg', source: 'TODO: cite' },
        'flag.heightRange': { text: 'outside 30–250 cm', source: 'TODO: cite' },
        'flag.weightRange': { text: 'outside 1–350 kg', source: 'TODO: cite' },
        'flag.heightZero': { text: 'height is not above 0 cm', source: 'TODO: cite' },
        'flag.weightZero': { text: 'weight is not above 0 kg', source: 'TODO: cite' },
        'bmi.meaningScale': {
            text: 'WHO adult categories: Underweight <18.5, Normal Weight 18.5–24.9, Overweight 25–29.9, Obese ≥30.',
            source: 'WHO adult BMI classification'
        },
        'bmi.notCalculated': { text: 'BMI not calculated.', source: 'TODO: cite' },
        'bmi.priorityIncomplete': { text: 'Incomplete', source: 'TODO: cite' },
        'bmi.adultReference': { text: 'adult reference', source: 'WHO adult BMI classification' },
        'ref.adult': { text: 'adult reference', source: 'TODO: cite' },
        'ref.under12': { text: 'under 12 reference', source: 'TODO: cite' },
        'copy.priority': { text: 'Priority', source: 'TODO: cite' },
        'copy.lead': { text: 'Lead finding', source: 'TODO: cite' },
        'copy.inputs': { text: 'Inputs', source: 'TODO: cite' },
        'copy.reference': { text: 'Reference', source: 'TODO: cite' },
        'copy.check': { text: 'Check entry', source: 'TODO: cite' },
        'sec.lead': { text: 'Lead finding', source: 'TODO: cite' },
        'sec.interpretation': { text: 'Clinical interpretation', source: 'TODO: cite' },
        'sec.considerations': { text: 'Nursing considerations', source: 'TODO: cite' },
        'sec.context': { text: 'Patient context', source: 'TODO: cite' },
        'sec.meaning': { text: 'Meaning', source: 'TODO: cite' },
        'sec.how': { text: 'How derived', source: 'TODO: cite' },
        'sec.disclaimer': { text: 'Disclaimer', source: 'TODO: cite' },
        'sec.priority': { text: 'Priority', source: 'TODO: cite' },
        'pattern.bpCrisis': { text: 'Hypertensive crisis pattern ({pair} mmHg)', source: 'TODO: cite' },
        'pattern.bpStage2': { text: 'Stage 2 hypertension pattern ({pair} mmHg)', source: 'TODO: cite' },
        'pattern.bpStage1': { text: 'Stage 1 hypertension pattern ({pair} mmHg)', source: 'TODO: cite' },
        'pattern.bpElevated': { text: 'Elevated blood pressure pattern ({pair} mmHg)', source: 'TODO: cite' },
        'pattern.bpLow': { text: 'Hypotension pattern ({pair} mmHg)', source: 'TODO: cite' },
        'pattern.bpInRange': { text: 'Blood pressure within reference range ({pair} mmHg)', source: 'TODO: cite' },
        'pattern.bpSysOnly': { text: 'Systolic {sys} mmHg. Diastolic {missing}.', source: 'TODO: cite' },
        'pattern.bpDiaOnly': { text: 'Diastolic {dia} mmHg. Systolic {missing}.', source: 'TODO: cite' },
        'pattern.bpMissing': { text: 'Blood pressure: {missing}', source: 'TODO: cite' },
        'pattern.tempHigh': { text: 'High fever pattern ({temp}°C)', source: 'TODO: cite' },
        'pattern.tempFever': { text: 'Fever pattern ({temp}°C)', source: 'TODO: cite' },
        'pattern.tempLowGrade': { text: 'Low-grade fever pattern ({temp}°C)', source: 'TODO: cite' },
        'pattern.tempHypo': { text: 'Hypothermia pattern ({temp}°C)', source: 'TODO: cite' },
        'pattern.tempInRange': { text: 'Temperature within reference range ({temp}°C)', source: 'TODO: cite' },
        'pattern.tempMissing': { text: 'Temperature: {missing}', source: 'TODO: cite' },
        'pattern.hrMarked': { text: 'Marked tachycardia pattern (HR {hr} bpm)', source: 'TODO: cite' },
        'pattern.hrTachy': { text: 'Tachycardia pattern (HR {hr} bpm)', source: 'TODO: cite' },
        'pattern.hrBrady': { text: 'Bradycardia pattern (HR {hr} bpm)', source: 'TODO: cite' },
        'pattern.hrInRange': { text: 'Heart rate within expected range for age (HR {hr} bpm)', source: 'TODO: cite' },
        'pattern.hrMissing': { text: 'Heart rate: {missing}', source: 'TODO: cite' },
        'pattern.rrSevere': { text: 'Severe tachypnea pattern (RR {rr}/min)', source: 'TODO: cite' },
        'pattern.rrTachy': { text: 'Tachypnea pattern (RR {rr}/min)', source: 'TODO: cite' },
        'pattern.rrBrady': { text: 'Bradypnea pattern (RR {rr}/min)', source: 'TODO: cite' },
        'pattern.rrInRange': { text: 'Respiratory rate within expected range for age (RR {rr}/min)', source: 'TODO: cite' },
        'pattern.rrMissing': { text: 'Respiratory rate: {missing}', source: 'TODO: cite' },
        'pattern.spo2Missing': { text: 'SpO2: {missing}', source: 'TODO: cite' },
        'pattern.tachyFever': { text: 'Tachycardia with fever pattern (possible systemic stress response)', source: 'TODO: cite' },
        'pattern.rrFever': { text: 'Tachypnea with fever pattern.', source: 'TODO: cite' },
        'context.age': { text: 'Age {age} years.', source: 'TODO: cite' },
        'context.sex': { text: 'Sex: {sex}.', source: 'TODO: cite' },
        'context.pregnant': { text: 'Currently pregnant.', source: 'TODO: cite' },
        'context.pregnancies': { text: 'Previous pregnancies: {n}.', source: 'TODO: cite' },
        'context.condition': { text: 'Known condition: {name}.', source: 'TODO: cite' },
        'bmi.lead': { text: 'BMI {bmi}, {category}', source: 'WHO adult BMI classification' },
        'bmi.heightMissing': { text: 'Height {missing}.', source: 'TODO: cite' },
        'bmi.weightMissing': { text: 'Weight {missing}.', source: 'TODO: cite' },
        'bmi.bothMissing': { text: 'Height {missing}. Weight {missing}.', source: 'TODO: cite' }
    };

    function text(id) {
        const row = entries[id];
        return row && row.text ? row.text : '';
    }

    function fill(id, map) {
        return text(id).replace(/\{(\w+)\}/g, function (_, key) {
            if (!map || map[key] == null) return '';
            return String(map[key]);
        });
    }

    function esc(value) {
        return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
            return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
        });
    }

    function checkMarkup(flag) {
        if (!flag || !flag.reason) return '';
        const label = text('checkEntry') || 'Check entry';
        return '<span class="np-check"><svg class="np-check-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3.2 1.8 21h20.4L12 3.2zm0 6.3a1 1 0 0 1 1 1v4.2a1 1 0 1 1-2 0v-4.2a1 1 0 0 1 1-1zm0 8.2a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3z"/></svg><span class="np-check-label">' + esc(label) + '</span><span class="np-check-reason">' + esc(flag.reason) + '</span></span>';
    }

    function listHtml(items) {
        if (!items || !items.length) return '';
        return '<ul class="np-bullets">' + items.map(function (item) {
            return '<li>' + esc(item) + '</li>';
        }).join('') + '</ul>';
    }

    function rowHtml(row) {
        const flag = row && row.flag ? checkMarkup(row.flag) : '';
        return '<li><span class="np-interp-value">' + esc(row.text) + '</span>' + (flag ? ' ' + flag : '') + '</li>';
    }

    function section(title, inner) {
        if (!inner) return '';
        return '<section class="np-interp-sec"><h3 class="np-interp-h">' + esc(title) + '</h3>' + inner + '</section>';
    }

    function buildCopy(result) {
        const lines = [];
        const priority = result.priority && result.priority.text ? result.priority.text : '';
        if (priority) lines.push(text('copy.priority') + ': ' + priority);
        if (result.incomplete) lines.push(result.incomplete);
        if (result.lead) lines.push(text('copy.lead') + ': ' + result.lead);
        if (result.inputs && result.inputs.length) lines.push(text('copy.inputs') + ': ' + result.inputs.join('; '));
        if (result.referenceLabel) lines.push(text('copy.reference') + ': ' + result.referenceLabel);
        const flags = result.flags || [];
        if (flags.length) {
            lines.push(text('copy.check') + ': ' + flags.map(function (flag) {
                return flag.label + ' — ' + flag.reason;
            }).join('; '));
        }
        return lines.join('\n');
    }

    function renderInterpretation(result) {
        const host = !result ? null : (typeof result.container === 'string' ? document.getElementById(result.container) : result.container);
        if (!host) return { copyText: '' };
        const priority = result.priority || {};
        const copyText = result.copyText || buildCopy(result);
        const interpretation = (result.interpretation || []).map(rowHtml).join('');
        const leadFlag = result.leadFlag ? ' ' + checkMarkup(result.leadFlag) : '';
        const html = '<div class="np-interp">' +
            (priority.text ? '<div class="np-interp-priority"><p class="np-interp-k">' + esc(text('sec.priority')) + '</p><p class="np-interp-priority-line"><span class="np-interp-icon" aria-hidden="true">' + esc(priority.icon || '') + '</span> <span class="np-interp-priority-text">' + esc(priority.text) + '</span></p>' +
                (result.incomplete ? '<p class="np-interp-incomplete">' + esc(result.incomplete) + '</p>' : '') +
            '</div>' : '') +
            section(text('sec.lead'), result.lead ? '<p class="np-interp-lead"><span class="np-interp-value">' + esc(result.lead) + '</span>' + leadFlag + '</p>' : '') +
            section(text('sec.interpretation'), interpretation ? '<ul class="np-bullets">' + interpretation + '</ul>' : '') +
            section(text('sec.considerations'), listHtml(result.considerations)) +
            section(text('sec.context'), listHtml(result.context)) +
            section(text('sec.meaning'), result.meaning ? '<p>' + esc(result.meaning) + '</p>' : '') +
            section(text('sec.how'), result.howDerived ? '<p>' + esc(result.howDerived) + '</p>' : '') +
            (result.disclaimer ? '<p class="np-disclaimer">' + esc(result.disclaimer) + '</p>' : '') +
            '<button type="button" class="np-copy-btn">Copy result</button>' +
            '</div>';
        host.innerHTML = html;
        host.classList.add('np-interp-host');
        host.style.fontStyle = 'normal';
        host.style.textAlign = 'left';
        const btn = host.querySelector('.np-copy-btn');
        if (btn) {
            btn.setAttribute('data-copy-text', copyText);
            btn.addEventListener('click', function () {
                const finish = function (label) {
                    btn.textContent = label;
                    setTimeout(function () { btn.textContent = 'Copy result'; }, 1200);
                };
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(copyText).then(function () { finish('Copied'); }).catch(function () { finish('Copy failed'); });
                } else {
                    finish('Copy failed');
                }
            });
        }
        return { copyText: copyText };
    }

    window.NursePathInterpretation = {
        entries: entries,
        text: text,
        fill: fill
    };
    window.renderInterpretation = renderInterpretation;
})();
