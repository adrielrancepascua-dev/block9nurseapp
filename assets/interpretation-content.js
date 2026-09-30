/* Result copy for Vital Signs and BMI. Each entry has a source. Unknown sources stay "TODO: cite". */
(function () {
    const entries = {
        'disclaimer': {
            text: 'Reference findings for study. Confirm anything that affects care with your Clinical Instructor.',
            type: 'clinical', source: 'TODO: cite'
        },
        'notEntered': { text: 'not entered', type: 'ui', source: 'TODO: cite' },
        'checkEntry': { text: 'Check entry', type: 'ui', source: 'TODO: cite' },
        'incomplete': { text: 'Incomplete ({n} of {m} entered)', type: 'ui', source: 'TODO: cite' },
        'partial.noConcerns': { text: 'No concerns in the vitals entered.', type: 'clinical', source: 'TODO: cite' },
        'pediatric.reference': { text: 'Pediatric reference not included; use your unit\'s age-based chart', type: 'clinical', source: 'TODO: cite' },
        'how.severityPoint': { text: '{name} added a severity point and changed the priority from {from} to {to}.', type: 'clinical', source: 'TODO: cite' },
        'flag.sentence': { text: '{field} {value} is {direction} {bound}. Check for a typo or unit mix-up.', type: 'clinical', source: 'TODO: cite' },
        'flag.dbpOrderSentence': { text: 'Diastolic {dia} mmHg is not below systolic {sys} mmHg. Check for a typo or unit mix-up.', type: 'clinical', source: 'TODO: cite' },
        'how.noted': { text: 'noted, thresholds not changed', type: 'clinical', source: 'TODO: cite' },
        'how.childBands': {
            text: 'Heart rate band is 70–120 bpm and respiratory rate band is 18–30/min.',
            type: 'clinical', source: 'TODO: cite'
        },
        'escalate': { text: 'Escalate per facility protocol.', type: 'clinical', source: 'TODO: cite' },
        'recheckSet': { text: 'Recheck the full vital sign set.', type: 'clinical', source: 'TODO: cite' },
        'spo2Reminder': { text: 'Check SpO2 and mental status if not assessed.', type: 'clinical', source: 'TODO: cite' },
        'asthmaTachypnea': { text: 'Asthma with tachypnea: reassess breathing and oxygenation.', type: 'clinical', source: 'TODO: cite' },
        'preeclampsiaScreen': {
            text: 'Pregnancy with an elevated BP pattern: discuss preeclampsia screening with your instructor.',
            type: 'clinical', source: 'TODO: cite'
        },
        'priority.0.icon': { text: '🟢', type: 'ui', source: 'TODO: cite' },
        'priority.0.text': { text: 'Normal / Green', type: 'clinical', source: 'TODO: cite' },
        'priority.1.icon': { text: '🟡', type: 'ui', source: 'TODO: cite' },
        'priority.1.text': { text: 'Mild Concern / Yellow', type: 'clinical', source: 'TODO: cite' },
        'priority.2.icon': { text: '🟠', type: 'ui', source: 'TODO: cite' },
        'priority.2.text': { text: 'Moderate Concern / Orange', type: 'clinical', source: 'TODO: cite' },
        'priority.3.icon': { text: '🔴', type: 'ui', source: 'TODO: cite' },
        'priority.3.text': { text: 'High Priority / Red', type: 'clinical', source: 'TODO: cite' },
        'priority.4.icon': { text: '🚨', type: 'ui', source: 'TODO: cite' },
        'priority.4.text': { text: 'Emergency / Critical', type: 'clinical', source: 'TODO: cite' },
        'meaning.0': {
            text: 'Normal / Green: every entered vital is inside this tool\'s routine band.',
            type: 'clinical', source: 'TODO: cite'
        },
        'meaning.1': {
            text: 'Mild Concern / Yellow: at least one entered vital is outside this tool\'s routine band.',
            type: 'clinical', source: 'TODO: cite'
        },
        'meaning.severityOnly': {
            text: 'Mild Concern / Yellow: the entered vitals are inside this tool\'s routine band. A selected factor added a severity point.',
            type: 'clinical', source: 'TODO: cite'
        },
        'meaning.2': {
            text: 'Moderate Concern / Orange: the entered vitals meet this tool\'s moderate pattern.',
            type: 'clinical', source: 'TODO: cite'
        },
        'meaning.3': {
            text: 'High Priority / Red: the entered vitals meet this tool\'s high-priority pattern.',
            type: 'clinical', source: 'TODO: cite'
        },
        'meaning.4': {
            text: 'Emergency / Critical: this tool\'s priority rule placed the entered vitals in the emergency band.',
            type: 'clinical', source: 'TODO: cite'
        },
        'action.bpCrisis': {
            text: 'Recheck BP manually within 5 minutes and escalate to the clinical instructor immediately.',
            type: 'clinical', source: 'TODO: cite'
        },
        'action.bpStage2': {
            text: 'Monitor blood pressure every 15 minutes and observe for headache, chest pain, or neurologic changes.',
            type: 'clinical', source: 'TODO: cite'
        },
        'action.bpStage1': {
            text: 'Repeat the BP after a brief rest and compare it against earlier readings.',
            type: 'clinical', source: 'TODO: cite'
        },
        'action.bpLow': {
            text: 'Assess perfusion indicators such as mental status, skin signs, and capillary refill, then reassess vitals promptly.',
            type: 'clinical', source: 'TODO: cite'
        },
        'action.feverHigh': {
            text: 'Increase monitoring frequency and evaluate for fever-associated tachycardia or tachypnea.',
            type: 'clinical', source: 'TODO: cite'
        },
        'action.hypothermia': {
            text: 'Prioritize warming measures and recheck temperature.',
            type: 'clinical', source: 'TODO: cite'
        },
        'action.hrMarked': {
            text: 'Assess for pain, fever, anxiety, or dehydration.',
            type: 'clinical', source: 'TODO: cite'
        },
        'action.hrBrady': {
            text: 'Reassess perfusion and symptoms, verify reading quality, and repeat the heart rate.',
            type: 'clinical', source: 'TODO: cite'
        },
        'action.rrSevere': {
            text: 'Reassess airway and breathing immediately, and check oxygenation if available.',
            type: 'clinical', source: 'TODO: cite'
        },
        'action.rrLow': {
            text: 'Observe the depth and effort of breathing, then repeat the respiratory assessment.',
            type: 'clinical', source: 'TODO: cite'
        },
        'flag.tempHigh': { text: 'above 43°C', type: 'clinical', source: 'TODO: cite' },
        'flag.tempLow': { text: 'below 30°C', type: 'clinical', source: 'TODO: cite' },
        'flag.rrHigh': { text: 'above 60/min', type: 'clinical', source: 'TODO: cite' },
        'flag.rrLow': { text: 'below 4/min', type: 'clinical', source: 'TODO: cite' },
        'flag.hrHigh': { text: 'above 300 bpm', type: 'clinical', source: 'TODO: cite' },
        'flag.hrLow': { text: 'below 20 bpm', type: 'clinical', source: 'TODO: cite' },
        'flag.sbpHigh': { text: 'systolic above 300 mmHg', type: 'clinical', source: 'TODO: cite' },
        'flag.sbpLow': { text: 'systolic below 40 mmHg', type: 'clinical', source: 'TODO: cite' },
        'flag.dbpHigh': { text: 'diastolic above 200 mmHg', type: 'clinical', source: 'TODO: cite' },
        'flag.dbpLow': { text: 'diastolic below 20 mmHg', type: 'clinical', source: 'TODO: cite' },
        'flag.dbpOrder': { text: 'diastolic is not below systolic', type: 'clinical', source: 'TODO: cite' },
        'flag.ppWide': { text: 'pulse pressure above 80 mmHg', type: 'clinical', source: 'TODO: cite' },
        'flag.ppNarrow': { text: 'pulse pressure below 15 mmHg', type: 'clinical', source: 'TODO: cite' },
        'flag.heightRange': { text: 'outside 30–250 cm', type: 'clinical', source: 'TODO: cite' },
        'flag.weightRange': { text: 'outside 1–350 kg', type: 'clinical', source: 'TODO: cite' },
        'flag.heightZero': { text: 'height is not above 0 cm', type: 'clinical', source: 'TODO: cite' },
        'flag.weightZero': { text: 'weight is not above 0 kg', type: 'clinical', source: 'TODO: cite' },
        'bmi.meaningScale': {
            text: 'WHO adult categories: Underweight <18.5, Normal Weight 18.5–24.9, Overweight 25–29.9, Obese ≥30.',
            type: 'clinical', source: 'WHO adult BMI classification'
        },
        'bmi.notCalculated': { text: 'BMI not calculated.', type: 'ui', source: 'TODO: cite' },
        'bmi.priorityIncomplete': { text: 'Incomplete', type: 'ui', source: 'TODO: cite' },
        'bmi.adultReference': { text: 'adult reference', type: 'ui', source: 'WHO adult BMI classification' },
        'ref.adult': { text: 'adult reference', type: 'ui', source: 'TODO: cite' },
        'ref.under12': { text: 'under 12 reference', type: 'ui', source: 'TODO: cite' },
        'copy.priority': { text: 'Priority', type: 'ui', source: 'TODO: cite' },
        'copy.lead': { text: 'Lead finding', type: 'ui', source: 'TODO: cite' },
        'copy.inputs': { text: 'Inputs', type: 'ui', source: 'TODO: cite' },
        'copy.reference': { text: 'Reference', type: 'ui', source: 'TODO: cite' },
        'copy.check': { text: 'Check entry', type: 'ui', source: 'TODO: cite' },
        'sec.lead': { text: 'Lead finding', type: 'ui', source: 'TODO: cite' },
        'sec.interpretation': { text: 'Clinical interpretation', type: 'ui', source: 'TODO: cite' },
        'sec.considerations': { text: 'Nursing considerations', type: 'ui', source: 'TODO: cite' },
        'sec.context': { text: 'Patient context', type: 'ui', source: 'TODO: cite' },
        'sec.meaning': { text: 'Meaning', type: 'ui', source: 'TODO: cite' },
        'sec.how': { text: 'How derived', type: 'ui', source: 'TODO: cite' },
        'sec.disclaimer': { text: 'Disclaimer', type: 'ui', source: 'TODO: cite' },
        'sec.priority': { text: 'Priority', type: 'ui', source: 'TODO: cite' },
        'sec.leadCheck': { text: 'Lead finding (check entry first)', type: 'ui', source: 'TODO: cite' },
        'sec.entryChecks': { text: 'Entry checks ({n})', type: 'ui', source: 'TODO: cite' },
        'pattern.bpCrisis': { text: 'Hypertensive crisis pattern ({pair} mmHg)', type: 'clinical', source: 'TODO: cite' },
        'pattern.bpStage2': { text: 'Stage 2 hypertension pattern ({pair} mmHg)', type: 'clinical', source: 'TODO: cite' },
        'pattern.bpStage1': { text: 'Stage 1 hypertension pattern ({pair} mmHg)', type: 'clinical', source: 'TODO: cite' },
        'pattern.bpElevated': { text: 'Elevated blood pressure pattern ({pair} mmHg)', type: 'clinical', source: 'TODO: cite' },
        'pattern.bpLow': { text: 'Hypotension pattern ({pair} mmHg)', type: 'clinical', source: 'TODO: cite' },
        'pattern.bpInRange': { text: 'Blood pressure within reference range ({pair} mmHg)', type: 'clinical', source: 'TODO: cite' },
        'pattern.bpSysOnly': { text: 'Systolic {sys} mmHg. Diastolic {missing}.', type: 'clinical', source: 'TODO: cite' },
        'pattern.bpDiaOnly': { text: 'Diastolic {dia} mmHg. Systolic {missing}.', type: 'clinical', source: 'TODO: cite' },
        'pattern.bpMissing': { text: 'Blood pressure: {missing}', type: 'ui', source: 'TODO: cite' },
        'pattern.tempHigh': { text: 'High fever pattern ({temp}°C)', type: 'clinical', source: 'TODO: cite' },
        'pattern.tempFever': { text: 'Fever pattern ({temp}°C)', type: 'clinical', source: 'TODO: cite' },
        'pattern.tempLowGrade': { text: 'Low-grade fever pattern ({temp}°C)', type: 'clinical', source: 'TODO: cite' },
        'pattern.tempHypo': { text: 'Hypothermia pattern ({temp}°C)', type: 'clinical', source: 'TODO: cite' },
        'pattern.tempInRange': { text: 'Temperature within reference range ({temp}°C)', type: 'clinical', source: 'TODO: cite' },
        'pattern.tempMissing': { text: 'Temperature: {missing}', type: 'ui', source: 'TODO: cite' },
        'pattern.hrMarked': { text: 'Marked tachycardia pattern (HR {hr} bpm)', type: 'clinical', source: 'TODO: cite' },
        'pattern.hrTachy': { text: 'Tachycardia pattern (HR {hr} bpm)', type: 'clinical', source: 'TODO: cite' },
        'pattern.hrBrady': { text: 'Bradycardia pattern (HR {hr} bpm)', type: 'clinical', source: 'TODO: cite' },
        'pattern.hrInRange': { text: 'Heart rate within expected range for age (HR {hr} bpm)', type: 'clinical', source: 'TODO: cite' },
        'pattern.hrMissing': { text: 'Heart rate: {missing}', type: 'ui', source: 'TODO: cite' },
        'pattern.rrSevere': { text: 'Severe tachypnea pattern (RR {rr}/min)', type: 'clinical', source: 'TODO: cite' },
        'pattern.rrTachy': { text: 'Tachypnea pattern (RR {rr}/min)', type: 'clinical', source: 'TODO: cite' },
        'pattern.rrBrady': { text: 'Bradypnea pattern (RR {rr}/min)', type: 'clinical', source: 'TODO: cite' },
        'pattern.rrInRange': { text: 'Respiratory rate within expected range for age (RR {rr}/min)', type: 'clinical', source: 'TODO: cite' },
        'pattern.rrMissing': { text: 'Respiratory rate: {missing}', type: 'ui', source: 'TODO: cite' },
        'pattern.spo2Missing': { text: 'SpO2: {missing}', type: 'ui', source: 'TODO: cite' },
        'pattern.tachyFever': { text: 'Tachycardia with fever pattern.', type: 'clinical', source: 'TODO: cite' },
        'pattern.bpEcho': { text: 'Blood pressure {pair} mmHg', type: 'clinical', source: 'TODO: cite' },
        'pattern.hrEcho': { text: 'Heart rate {hr} bpm', type: 'clinical', source: 'TODO: cite' },
        'pattern.rrEcho': { text: 'Respiratory rate {rr}/min', type: 'clinical', source: 'TODO: cite' },
        'pattern.rrFever': { text: 'Tachypnea with fever pattern.', type: 'clinical', source: 'TODO: cite' },
        'context.age': { text: 'Age {age} years.', type: 'ui', source: 'TODO: cite' },
        'context.sex': { text: 'Sex: {sex}.', type: 'ui', source: 'TODO: cite' },
        'context.pregnant': { text: 'Currently pregnant.', type: 'ui', source: 'TODO: cite' },
        'context.pregnancies': { text: 'Previous pregnancies: {n}.', type: 'ui', source: 'TODO: cite' },
        'context.condition': { text: 'Known condition: {name}.', type: 'ui', source: 'TODO: cite' },
        'bmi.lead': { text: 'BMI {bmi}, {category}', type: 'clinical', source: 'WHO adult BMI classification' },
        'bmi.heightMissing': { text: 'Height {missing}.', type: 'ui', source: 'TODO: cite' },
        'bmi.weightMissing': { text: 'Weight {missing}.', type: 'ui', source: 'TODO: cite' },
        'bmi.bothMissing': { text: 'Height {missing}. Weight {missing}.', type: 'ui', source: 'TODO: cite' }
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
        if (!flag) return '';
        const label = text('checkEntry') || 'Check entry';
        return '<span class="np-check"><svg class="np-check-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3.2 1.8 21h20.4L12 3.2zm0 6.3a1 1 0 0 1 1 1v4.2a1 1 0 1 1-2 0v-4.2a1 1 0 0 1 1-1zm0 8.2a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3z"/></svg><span class="np-check-label">' + esc(label) + '</span></span>';
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
            const sentences = [];
            flags.forEach(function (flag) {
                (flag.sentences || [flag.reason]).forEach(function (sentence) {
                    if (sentence) sentences.push(sentence);
                });
            });
            if (sentences.length) lines.push(text('copy.check') + ': ' + sentences.join(' '));
        }
        return lines.join('\n');
    }

    function renderInterpretation(result) {
        const host = !result ? null : (typeof result.container === 'string' ? document.getElementById(result.container) : result.container);
        if (!host) return { copyText: '' };
        const priority = result.priority || {};
        const copyText = result.copyText || buildCopy(result);
        const interpretation = (result.interpretation || []).map(rowHtml).join('');
        const leadTitle = result.leadFlag ? (text('sec.leadCheck') || 'Lead finding (check entry first)') : text('sec.lead');
        const flagSentences = [];
        (result.flags || []).forEach(function (flag) {
            (flag.sentences || []).forEach(function (sentence) {
                if (sentence) flagSentences.push(sentence);
            });
        });
        const entryChecks = flagSentences.length
            ? section(fill('sec.entryChecks', { n: flagSentences.length }), listHtml(flagSentences))
            : '';
        const priorityClass = priority.neutral ? 'np-interp-priority is-neutral' : 'np-interp-priority';
        const html = '<div class="np-interp">' +
            (priority.text ? '<div class="' + priorityClass + '"><p class="np-interp-k">' + esc(text('sec.priority')) + '</p><p class="np-interp-priority-line"><span class="np-interp-icon" aria-hidden="true">' + esc(priority.icon || '') + '</span> <span class="np-interp-priority-text">' + esc(priority.text) + '</span></p>' +
                (result.incomplete ? '<p class="np-interp-incomplete">' + esc(result.incomplete) + '</p>' : '') +
            '</div>' : '') +
            entryChecks +
            section(leadTitle, result.lead ? '<p class="np-interp-lead"><span class="np-interp-value">' + esc(result.lead) + '</span></p>' : '') +
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
