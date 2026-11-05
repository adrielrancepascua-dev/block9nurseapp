"""NCM 112 Semis PRE/POST test — exam-style Hard (oxygenation / vascular / allergy)."""


def build_ncm112_semis_items(mk_exam):
    src = "NCM 112 Semis PRE/POST — exam-style hard (unofficial OCR)"
    items = []

    # —— PRE TEST ——
    items.append(
        mk_exam(
            "ncm112-semis-pre-01",
            "A client with Raynaud's disease is prescribed nifedipine. The nurse explains that the medication is intended to produce which effect?",
            [
                "Constrict vascular smooth muscle and increase blood pressure",
                "Relax vascular smooth muscle and promote vasodilation",
                "Increase sympathetic stimulation and maintain vascular tone",
                "Increase platelet aggregation and prevent excessive bleeding",
                "Stimulate venous constriction and increase venous return",
            ],
            [
                "CCBs do not constrict vessels; that worsens vasospasm.",
                "Nifedipine blocks calcium entry in vascular smooth muscle, reducing vasospasm.",
                "Sympathetic stimulation increases vasoconstriction — opposite of goal.",
                "Raynaud's is not treated by increasing clotting.",
                "Venous constriction does not address digital artery spasm.",
            ],
            topic="oxygenation",
            typ="application",
            source=src,
            correct_index=1,
        )
    )

    items.append(
        mk_exam(
            "ncm112-semis-pre-02",
            "The nurse is evaluating the effectiveness of nifedipine in a client with Raynaud's disease. Which finding provides the best evidence that the medication is producing the desired effect?",
            [
                "The client's blood pressure increases slightly after administration",
                "The client reports fewer episodes of cold, pale fingers",
                "The client develops a stronger sympathetic response to cold exposure",
                "The client reports increased numbness during episodes",
                "The client's fingers remain cyanotic for a longer period during attacks",
            ],
            [
                "Mild BP change is not the primary Raynaud's outcome measure.",
                "Fewer vasospastic color/temperature episodes show reduced spasm.",
                "Stronger sympathetic response would worsen vasoconstriction.",
                "More numbness suggests worsening ischemia, not improvement.",
                "Longer cyanosis means prolonged poor perfusion — treatment failure.",
            ],
            topic="oxygenation",
            typ="evaluation",
            source=src,
            correct_index=1,
        )
    )

    items.append(
        mk_exam(
            "ncm112-semis-pre-03",
            "A client with Raynaud's disease is prescribed a calcium channel blocker. The client asks why this medication is being used. Which response by the nurse is most appropriate?",
            [
                "It increases sympathetic stimulation so that the vessels remain constricted.",
                "It relaxes vascular smooth muscle, which helps reduce vasospasm.",
                "It increases venous pooling so that more blood remains in the extremities.",
                "It prevents the tunica intima from producing clotting factors.",
                "It increases blood pressure so that blood can reach the affected fingers.",
            ],
            [
                "Sympathetic stimulation worsens Raynaud's vasospasm.",
                "CCBs reduce arterial smooth muscle tone and vasospasm.",
                "Venous pooling does not fix digital artery spasm.",
                "Raynaud's therapy is not aimed at blocking intimal clotting factors.",
                "Raising BP is not the primary mechanism for Raynaud's relief.",
            ],
            topic="oxygenation",
            typ="therapeutic_communication",
            source=src,
            correct_index=1,
        )
    )

    items.append(
        mk_exam(
            "ncm112-semis-pre-04",
            "A client with severe Raynaud's disease continues to have frequent attacks despite conservative management and prescribed medication. The health care provider discusses sympathectomy. Which explanation should the nurse provide?",
            [
                "The procedure removes or interrupts sympathetic nerve activity to reduce vasoconstriction.",
                "The procedure removes the tunica intima to prevent clot formation.",
                "The procedure strengthens smooth muscle so arteries constrict more effectively.",
                "The procedure increases parasympathetic stimulation to produce systemic vasoconstriction.",
                "The procedure permanently increases blood pressure to improve arterial perfusion.",
            ],
            [
                "Sympathectomy targets excessive sympathetic-mediated vasoconstriction.",
                "It is not an intimal stripping procedure.",
                "Strengthening constriction would worsen Raynaud's.",
                "Parasympathetic systemic vasoconstriction is not the goal.",
                "BP elevation is not the described surgical mechanism.",
            ],
            topic="oxygenation",
            typ="application",
            source=src,
            correct_index=0,
        )
    )

    items.append(
        mk_exam(
            "ncm112-semis-pre-05",
            "The nurse receives reports on four clients with arterial occlusive disease. Which client should the nurse assess first?",
            [
                "A client with Raynaud's disease who reports mild numbness during a brief episode of pallor",
                "A client who reports that cold exposure causes temporary cyanosis of the fingers",
                "A client with Raynaud's disease who reports recurring episodes relieved by warming measures",
                "A client whose affected finger remains pale, cold, and numb despite warming measures",
                "A client who reports that stress occasionally triggers temporary finger discoloration",
            ],
            [
                "Brief reversible pallor with mild symptoms is lower acuity.",
                "Temporary cyanosis from cold that resolves is typical Raynaud's pattern.",
                "Episodes relieved by warming suggest reversible vasospasm.",
                "Persistent ischemia despite warming suggests threatened perfusion — assess first.",
                "Stress-triggered brief discoloration is usually self-limited.",
            ],
            topic="oxygenation",
            typ="prioritization",
            source=src,
            correct_index=3,
        )
    )

    items.append(
        mk_exam(
            "ncm112-semis-pre-06",
            "Nurse Angela is caring for a 54-year-old male client diagnosed with Buerger's disease. The client reports cramping pain in both calves when walking several blocks; pain resolves after rest. Which finding is most characteristic of this condition?",
            [
                "Intermittent claudication caused by decreased arterial blood flow",
                "Dependent edema caused by impaired venous return",
                "Continuous ischemic pain caused by venous obstruction",
                "Calf pain caused by increased arterial blood flow during exercise",
                "Joint pain caused by inflammatory changes in the lower extremities",
            ],
            [
                "Exercise-induced calf pain relieved by rest is classic intermittent claudication.",
                "Dependent edema points to venous insufficiency, not Buerger's claudication.",
                "Continuous venous pain is not the hallmark walking-rest pattern.",
                "Increased flow during exercise would not cause ischemic cramping.",
                "Inflammatory joint pain is a different presentation.",
            ],
            topic="oxygenation",
            typ="application",
            source=src,
            correct_index=0,
        )
    )

    items.append(
        mk_exam(
            "ncm112-semis-pre-07",
            "Nurse Miguel is reviewing the history of a client newly diagnosed with Buerger's disease. The client asks why smoking cessation is emphasized. Which explanation is most appropriate?",
            [
                "Nicotine increases venous return and causes excessive blood pooling.",
                "Smoking damages the vessel lining and promotes inflammation and clot formation.",
                "Smoking causes the veins to dilate and prevents oxygen from entering the lungs.",
                "Nicotine increases blood flow to the extremities and eventually causes edema.",
                "Smoking primarily affects venous valves and prevents blood return to the heart.",
            ],
            [
                "Nicotine's main harm in Buerger's is not venous pooling.",
                "Tobacco accelerates endothelial injury and thrombosis in small arteries.",
                "Smoking does not prevent pulmonary oxygenation in this simplistic way.",
                "Nicotine vasoconstriction reduces distal flow — opposite of this option.",
                "Buerger's is an arterial inflammatory/thrombotic disease, not primary valve failure.",
            ],
            topic="oxygenation",
            typ="therapeutic_communication",
            source=src,
            correct_index=1,
        )
    )

    items.append(
        mk_exam(
            "ncm112-semis-pre-08",
            "Nurse Camille is preparing a teaching plan for a client with Buerger's disease who continues to smoke despite counseling. Which client statement indicates the greatest need for additional teaching?",
            [
                "I should stop smoking completely to help prevent further vascular damage.",
                "I should avoid nicotine-containing products unless my provider approves.",
                "I can switch from cigarettes to nicotine gum because nicotine does not affect my blood vessels.",
                "I should ask for assistance if I am having difficulty stopping smoking.",
                "Continuing to smoke can worsen circulation problems in my extremities.",
            ],
            [
                "Complete cessation is correct teaching.",
                "Avoiding unapproved nicotine products is appropriate.",
                "Any nicotine source can perpetuate vasculopathy — needs correction.",
                "Seeking help with cessation is appropriate.",
                "Linking smoking to worse extremity circulation is correct.",
            ],
            topic="oxygenation",
            typ="evaluation",
            source=src,
            correct_index=2,
        )
    )

    items.append(
        mk_exam(
            "ncm112-semis-pre-09",
            "Nurse Joshua is caring for a client with Buerger's disease who reports leg pain after walking that goes away after sitting for a few minutes. Which response is most appropriate?",
            [
                "This suggests your veins are unable to return blood to your heart.",
                "This is consistent with intermittent claudication caused by reduced arterial blood flow.",
                "This indicates your muscles are receiving too much oxygen during activity.",
                "This is an expected response to increased venous pressure during walking.",
                "This suggests the blood vessels are dilating excessively during exercise.",
            ],
            [
                "Venous return problems do not match exercise-induced arterial claudication.",
                "Walk-induced pain relieved by rest fits arterial insufficiency/claudication.",
                "Ischemic pain reflects inadequate oxygen delivery, not excess.",
                "Venous pressure pattern differs from classic claudication.",
                "Excessive dilation would not produce ischemic cramping.",
            ],
            topic="oxygenation",
            typ="therapeutic_communication",
            source=src,
            correct_index=1,
        )
    )

    items.append(
        mk_exam(
            "ncm112-semis-pre-10",
            "Nurse Patricia is assessing a client with Buerger's disease who has bilateral lower-extremity discomfort, decreased oxygenated blood flow, and intermittent claudication. Which additional finding would the nurse expect?",
            [
                "Warm, edematous lower extremities with bounding pulses",
                "Bilateral lower-extremity involvement with diminished peripheral pulses",
                "Unilateral edema with a strong, easily palpable pedal pulse",
                "Warm, reddened extremities with increased peripheral circulation",
                "Pitting edema with jugular venous distention only",
            ],
            [
                "Bounding pulses and warmth suggest hyperemia, not arterial insufficiency.",
                "Bilateral diminished pulses match thromboangiitis obliterans presentation.",
                "Strong unilateral pulse with edema suggests venous or mixed picture.",
                "Increased circulation would not accompany claudication from arterial disease.",
                "JVD-centric picture is not the classic Buerger's extremity finding.",
            ],
            topic="oxygenation",
            typ="application",
            source=src,
            correct_index=1,
        )
    )

    # —— POST TEST ——
    items.append(
        mk_exam(
            "ncm112-semis-post-01",
            "The client is prescribed clemastine prophylactically for allergies. Which statement indicates the client needs more teaching concerning this medication?",
            [
                "I will suck on hard candy if I have a dry mouth.",
                "I will notify my HCP if I take an over-the-counter medication.",
                "I will experience some blurred vision when taking clemastine and will not report it.",
                "I need to maintain adequate fluid intake when taking this medication.",
            ],
            [
                "Hard candy can relieve antihistamine dry mouth.",
                "Reporting OTC use avoids interactions.",
                "Vision changes should be reported — not dismissed as expected.",
                "Hydration supports comfort with anticholinergic effects.",
            ],
            topic="oxygenation",
            typ="evaluation",
            source=src,
            correct_index=2,
        )
    )

    items.append(
        mk_exam(
            "ncm112-semis-post-02",
            "The clinic nurse is discussing OTC oxymetazoline nasal spray with a client experiencing nasal congestion. Which information should the nurse discuss with the client? Select all that apply.",
            [
                "Do not use the oxymetazoline nasal spray any longer than 3 to 5 days.",
                "Spray the medication into the open nostril while inhaling deeply.",
                "Clear the nose immediately after using the nasal spray.",
                "Immediately swallow the postnasal medication residue.",
                "Take additional nasal sprays if congestion is not relieved.",
            ],
            [
                "Rebound congestion develops with prolonged topical decongestant use.",
                "Inhaling during spray improves distribution into nasal passages.",
                "Blow/clear the nose before use; clearing right after washes drug away.",
                "Swallowing residue is not instructed and increases systemic absorption.",
                "Extra sprays beyond label directions worsen rebound and side effects.",
            ],
            topic="oxygenation",
            typ="nclex_sata",
            source=src,
            choice_format="sata",
            correct_indices=[0, 1],
        )
    )

    items.append(
        mk_exam(
            "ncm112-semis-post-03",
            "A male client taking a nasal glucocorticoid spray calls the clinic and reports the medication is not helping. Which question should the nurse ask first?",
            [
                "Are you sure you are taking the spray correctly?",
                "Did you shake the bottle before taking the spray?",
                "What time of the day are you taking the medication?",
                "How long have you been using the spray?",
            ],
            [
                "Technique matters but duration is the first gate for steroid onset.",
                "Shaking may apply to some sprays but not the key first question here.",
                "Timing can matter later; steroids need days to weeks of consistent use.",
                "Intranasal steroids require several days of regular use before full effect.",
            ],
            topic="oxygenation",
            typ="prioritization",
            source=src,
            correct_index=3,
        )
    )

    items.append(
        mk_exam(
            "ncm112-semis-post-04",
            "Which interventions should the nurse implement for the elderly client receiving antihistamine therapy? Select all that apply.",
            [
                "Auscultate the client's breath sounds.",
                "Assess the client's level of consciousness.",
                "Evaluate the client's intake and output.",
                "Encourage the client to ambulate without assistance.",
                "Provide an acid-ash diet for the client.",
            ],
            [
                "Sedation and anticholinergic effects can depress respirations.",
                "Sedation and confusion increase fall and safety risk in older adults.",
                "Anticholinergic effects can reduce voiding and cause retention.",
                "Unassisted ambulation may be unsafe when sedated — not a priority intervention.",
                "Acid-ash diet is not indicated for antihistamine therapy.",
            ],
            topic="oxygenation",
            typ="nclex_sata",
            source=src,
            choice_format="sata",
            correct_indices=[0, 1, 2],
        )
    )

    items.append(
        mk_exam(
            "ncm112-semis-post-05",
            "The HCP has prescribed topical hydrocortisone for a client with allergic dermatitis. Which instruction should the nurse discuss with the client?",
            [
                "Wash the inflamed area with soap and water before each application.",
                "Apply an occlusive adherent dressing after applying the medication.",
                "Rub the cream vigorously into the irritated and inflamed area.",
                "Wash the hands before applying the topical steroid.",
            ],
            [
                "Harsh washing irritates inflamed skin unless specifically ordered.",
                "Occlusive dressings increase absorption and are not routine without orders.",
                "A thin gentle layer is taught — vigorous rubbing irritates skin.",
                "Hand hygiene before application reduces contamination of the site.",
            ],
            topic="oxygenation",
            typ="application",
            source=src,
            correct_index=3,
        )
    )

    items.append(
        mk_exam(
            "ncm112-semis-post-06",
            "The nurse is administering an IV antibiotic. Twenty minutes into the infusion, the client reports shortness of breath, itching, and difficulty swallowing. Which intervention should the nurse implement first?",
            [
                "Prepare to administer subcutaneous epinephrine.",
                "Discontinue the client's IV antibiotic.",
                "Assess the client's apical pulse and blood pressure.",
                "Administer 10 L of oxygen via nasal cannula.",
            ],
            [
                "Epinephrine may follow but stopping the allergen comes first.",
                "Stop the infusion immediately when anaphylaxis is suspected.",
                "Vitals are important after stopping the infusion.",
                "Oxygen supports care but stopping the drug is the first action.",
            ],
            topic="oxygenation",
            typ="prioritization",
            source=src,
            correct_index=1,
        )
    )

    items.append(
        mk_exam(
            "ncm112-semis-post-07",
            "The nurse is caring for a client with Raynaud's disease who reports fingers become pale and numb when entering an air-conditioned room. Which action should the nurse recommend first?",
            [
                "Massage the fingers vigorously until the color returns.",
                "Place the hands in warm water and avoid further cold exposure.",
                "Apply an ice pack to decrease the inflammatory response.",
                "Keep the hands elevated above the level of the heart.",
            ],
            [
                "Vigorous massage can injure ischemic tissue.",
                "Gentle rewarming and avoiding cold triggers end the vasospastic episode.",
                "Ice worsens vasoconstriction in Raynaud's.",
                "Elevation alone does not reverse digital artery spasm.",
            ],
            topic="oxygenation",
            typ="prioritization",
            source=src,
            correct_index=1,
        )
    )

    items.append(
        mk_exam(
            "ncm112-semis-post-08",
            "A client with Raynaud's disease is experiencing an acute episode with pale, cool, numb fingers. Which nursing intervention is most appropriate?",
            [
                "Encourage the client to exercise the affected fingers forcefully.",
                "Apply a cold compress to reduce vascular swelling.",
                "Provide warmth and attempt to reduce the client's anxiety.",
                "Place the affected extremity in a dependent position for several hours.",
            ],
            [
                "Forceful exercise during ischemia can harm tissue.",
                "Cold triggers and prolongs vasospasm.",
                "Gradual warming and calming measures reduce sympathetic vasoconstriction.",
                "Dependent positioning does not treat digital ischemia.",
            ],
            topic="oxygenation",
            typ="application",
            source=src,
            correct_index=2,
        )
    )

    items.append(
        mk_exam(
            "ncm112-semis-post-09",
            "The nurse is providing discharge teaching to a client with Raynaud's disease. Which client statement indicates a need for further teaching?",
            [
                "I will wear gloves when I am outside during cold weather.",
                "I will avoid holding cold drinks with my bare hands.",
                "I can continue smoking as long as I keep my hands warm.",
                "I will try to manage stress because it can trigger an episode.",
            ],
            [
                "Cold protection is correct prevention.",
                "Avoiding cold objects to hands is appropriate.",
                "Smoking worsens vasospasm regardless of external warming.",
                "Stress management reduces triggers.",
            ],
            topic="oxygenation",
            typ="evaluation",
            source=src,
            correct_index=2,
        )
    )

    items.append(
        mk_exam(
            "ncm112-semis-post-10",
            "The nurse is assessing a client with Raynaud's disease during an acute episode. Which finding requires the most immediate follow-up?",
            [
                "Fingers become pale after exposure to cold.",
                "The client reports numbness of the fingertips.",
                "The fingers change from pale to bluish in color.",
                "A persistent ulcer is present on the fingertip.",
            ],
            [
                "Reversible pallor is expected during vasospasm.",
                "Numbness can accompany reversible episodes.",
                "Cyanosis during an attack can still be part of the triphasic color change.",
                "Ulceration signals tissue injury and risk of infection/necrosis — urgent follow-up.",
            ],
            topic="oxygenation",
            typ="prioritization",
            source=src,
            correct_index=3,
        )
    )

    return items
