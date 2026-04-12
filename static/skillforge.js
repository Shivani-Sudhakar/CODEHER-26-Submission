// ============================================================
//  SKILL FORGE — Career Path → Skill Assessment → Results
// ============================================================

(function () {
    'use strict';

    function t(key, defaultText, noHtml = false) {
        if (!window.translations || !window.translations[key]) return defaultText;
        let currentLang = 'en';
        if (window.currentUser) {
            currentLang = window.currentUser.language || 'en';
        } else {
            // attempt reading global
             currentLang = window.currentLang || 'en';
        }
        if (currentLang === 'en') return defaultText;
        const translated = window.translations[key][currentLang] || defaultText;
        if (noHtml) return translated;
        return `<span class="bilingual-wrapper" style="display:inline-flex; flex-direction:column; vertical-align:middle; line-height:1.2; text-align:left;">
            <span class="bilingual-translated">${translated}</span>
            <span class="bilingual-english">${defaultText}</span>
        </span>`;
    }

    // ============================================================
    //  CAREER PATH DATA
    // ============================================================
    const CAREER_PATHS = {
        tech: {
            nameKey: 'tech_engineer', name: 'Tech Engineer',
            icon: '💻', zoneKey: 'tech_zone', zone: 'Tech Citadel',
            zoneIcon: '🏰', hero: { emoji: '🔮', name: 'Arjun', titleKey: 'hero_tech', title: 'Code Mage' },
            color: '#4fa8d1', descKey: 'tech_desc', description: 'Software Engineering, Data Science, AI & Cybersecurity',
            skills: [
                { id: 'programming', nameKey: 'sk_prog', name: 'Programming', icon: '💻', target: 85 },
                { id: 'mathematics', nameKey: 'sk_math', name: 'Mathematics', icon: '🧮', target: 75 },
                { id: 'logic', nameKey: 'sk_logic', name: 'Logic & Algorithms', icon: '🧩', target: 80 },
                { id: 'physics', nameKey: 'sk_physics', name: 'Physics', icon: '⚛️', target: 60 },
                { id: 'english', nameKey: 'sk_english', name: 'English', icon: '🅰️', target: 55 },
                { id: 'cs_fundamentals', nameKey: 'sk_cs', name: 'Computer Science', icon: '🖥️', target: 80 },
                { id: 'problem_solving', nameKey: 'sk_prob', name: 'Problem Solving', icon: '🧠', target: 85 },
                { id: 'communication', nameKey: 'sk_comms', name: 'Communication', icon: '🗣️', target: 50 },
            ],
            courses: [
                { name: 'CS50: Intro to Computer Science', provider: 'Harvard / edX', logo: '🎓', logoBg: '#a31f34', url: 'https://cs50.harvard.edu/', skill: 'programming', xp: 200, type: 'free' },
                { name: 'Python for Everybody', provider: 'Coursera / U of Michigan', logo: '🐍', logoBg: '#0056d2', url: 'https://www.coursera.org/specializations/python', skill: 'programming', xp: 180, type: 'free' },
                { name: 'freeCodeCamp Full Curriculum', provider: 'freeCodeCamp', logo: '🔥', logoBg: '#0a0a23', url: 'https://www.freecodecamp.org/', skill: 'programming', xp: 250, type: 'free' },
                { name: 'Mathematics for CS', provider: 'Khan Academy', logo: '📐', logoBg: '#14bf96', url: 'https://www.khanacademy.org/math', skill: 'mathematics', xp: 150, type: 'free' },
                { name: 'Data Structures & Algorithms', provider: 'GeeksforGeeks', logo: '🌿', logoBg: '#2f8d46', url: 'https://www.geeksforgeeks.org/data-structures/', skill: 'logic', xp: 220, type: 'free' },
                { name: 'LeetCode Practice', provider: 'LeetCode', logo: '⚡', logoBg: '#ffa116', url: 'https://leetcode.com/', skill: 'logic', xp: 200, type: 'free' },
                { name: 'Physics Fundamentals', provider: 'Khan Academy', logo: '⚛️', logoBg: '#14bf96', url: 'https://www.khanacademy.org/science/physics', skill: 'physics', xp: 130, type: 'free' },
                { name: 'Technical Writing', provider: 'Google Developers', logo: '📝', logoBg: '#4285f4', url: 'https://developers.google.com/tech-writing', skill: 'english', xp: 100, type: 'free' },
                { name: 'Operating Systems (Neso)', provider: 'Neso Academy / YouTube', logo: '🖥️', logoBg: '#ff0000', url: 'https://www.youtube.com/c/nesoacademy', skill: 'cs_fundamentals', xp: 160, type: 'free' },
                { name: 'HackerRank Challenges', provider: 'HackerRank', logo: '🏆', logoBg: '#1ba94c', url: 'https://www.hackerrank.com/', skill: 'problem_solving', xp: 190, type: 'free' },
            ],
            caseStudy: {
                emoji: '👨‍💼', name: 'Sundar Pichai', title: 'CEO of Google & Alphabet',
                school: 'Studied at <b>Jawahar Vidyalaya</b> and <b>Padma Seshadri Bala Bhavan</b> in Chennai. Was academically brilliant and captained the school cricket team.',
                college: 'Graduated in <b>Metallurgical Engineering from IIT Kharagpur</b> with a silver medal. Later earned MS from Stanford and MBA from Wharton.',
                studied: 'At IIT, he mastered <b>engineering fundamentals, materials science, and problem-solving</b>. At Stanford, he studied <b>semiconductor physics</b>. At Wharton, he learned <b>business strategy & leadership</b>.',
                career: 'Joined Google in 2004, led <b>Chrome, Android, and Google Drive</b>. Became CEO in 2015. Built Chrome from 0 to 70% market share — the power of <b>engineering + product thinking</b>.',
                quote: 'A lot of times, it is not about how smart you are but about the team you surround yourself with.'
            },
            boss: { nameKey: 'boss_jee', name: 'JEE Boss', exam: 'JEE/GATE', rewards: [{type: 'xp', val: '+1200 XP'}, {type: 'coins', val: '+650 coins'}, {type: 'badge', key: 'badge_code', val: 'Code Master badge'}, {type: 'chest', key: 'chest_legend', val: 'Legendary chest'}] }
        },

        medical: {
            nameKey: 'medical_doc', name: 'Medical Doctor',
            icon: '🏥', zoneKey: 'med_zone', zone: 'Healer\'s Sanctum',
            zoneIcon: '⚕️', hero: { emoji: '💚', name: 'Meena', titleKey: 'hero_med', title: 'Healer Ranger' },
            color: '#4CAF50', descKey: 'med_desc', description: 'Medicine, Nursing, Dentistry, Pharmacy & Research',
            skills: [
                { id: 'biology', nameKey: 'sk_bio', name: 'Biology', icon: '🧬', target: 90 },
                { id: 'chemistry', nameKey: 'sk_chem', name: 'Chemistry', icon: '⚗️', target: 85 },
                { id: 'physics', nameKey: 'sk_physics', name: 'Physics', icon: '⚛️', target: 70 },
                { id: 'anatomy', nameKey: 'sk_anat', name: 'Anatomy', icon: '🫀', target: 85 },
                { id: 'english', nameKey: 'sk_english', name: 'English', icon: '🅰️', target: 60 },
                { id: 'empathy', nameKey: 'sk_empathy', name: 'Empathy & Bedside Manner', icon: '💛', target: 75 },
                { id: 'research', nameKey: 'sk_res', name: 'Research Skills', icon: '🔬', target: 70 },
                { id: 'critical_thinking', nameKey: 'sk_crit', name: 'Critical Thinking', icon: '🧠', target: 80 },
            ],
            courses: [
                { name: 'Biology Fundamentals', provider: 'Khan Academy', logo: '🧬', logoBg: '#14bf96', url: 'https://www.khanacademy.org/science/biology', skill: 'biology', xp: 200, type: 'free' },
                { name: 'NEET Biology Prep', provider: 'Vedantu', logo: '📚', logoBg: '#ff6f20', url: 'https://www.vedantu.com/neet', skill: 'biology', xp: 220, type: 'paid' },
                { name: 'Chemistry Essentials', provider: 'Khan Academy', logo: '⚗️', logoBg: '#14bf96', url: 'https://www.khanacademy.org/science/chemistry', skill: 'chemistry', xp: 180, type: 'free' },
                { name: 'NEET Chemistry', provider: 'Aakash Institute', logo: '🔬', logoBg: '#1a237e', url: 'https://www.aakash.ac.in/', skill: 'chemistry', xp: 200, type: 'paid' },
                { name: 'Physics for Medicine', provider: 'Khan Academy', logo: '⚛️', logoBg: '#14bf96', url: 'https://www.khanacademy.org/science/physics', skill: 'physics', xp: 150, type: 'free' },
                { name: 'Human Anatomy Atlas', provider: 'Visible Body', logo: '🫀', logoBg: '#c62828', url: 'https://www.visiblebody.com/', skill: 'anatomy', xp: 170, type: 'paid' },
                { name: 'Medical English', provider: 'Coursera / UCI', logo: '🅰️', logoBg: '#0056d2', url: 'https://www.coursera.org/learn/medical-english', skill: 'english', xp: 100, type: 'free' },
                { name: 'Intro to Research Methods', provider: 'edX / MIT', logo: '🔬', logoBg: '#a31f34', url: 'https://www.edx.org/', skill: 'research', xp: 160, type: 'free' },
            ],
            caseStudy: {
                emoji: '👨‍⚕️', name: 'Dr. Devi Shetty', title: 'Founder, Narayana Health — India\'s Heart Surgery Pioneer',
                school: 'Grew up in <b>Mangalore</b>, attended local schools. Was deeply moved by a neighbor\'s death due to lack of affordable healthcare.',
                college: 'Studied MBBS at <b>Kasturba Medical College, Mangalore</b>. Specialized in cardiac surgery at <b>Guy\'s Hospital, London</b>.',
                studied: 'At KMC, he mastered <b>anatomy, physiology, and clinical medicine</b>. In London, he trained under top cardiac surgeons learning <b>open-heart surgery techniques</b> and <b>pediatric cardiac care</b>.',
                career: 'Performed <b>Mother Teresa\'s cardiac surgery</b>. Founded <b>Narayana Health</b> making heart surgeries affordable at $1,500 (vs $20,000 globally). Built 23 hospitals across India, performing 30+ surgeries daily.',
                quote: 'Healthcare is a right, not a privilege. The technology exists — we just need the will to make it affordable.'
            },
            boss: { nameKey: 'boss_neet', name: 'NEET Boss', exam: 'NEET', rewards: [{type: 'xp', val: '+1500 XP'}, {type: 'coins', val: '+800 coins'}, {type: 'badge', key: 'badge_heal', val: 'Healer Master badge'}, {type: 'chest', key: 'chest_legend', val: 'Legendary chest'}] }
        },

        law: {
            nameKey: 'lawyer', name: 'Lawyer',
            icon: '⚖️', zoneKey: 'law_zone', zone: 'Justice Fortress',
            zoneIcon: '🏛️', hero: { emoji: '⚔️', name: 'Priya', titleKey: 'hero_law', title: 'Justice Knight' },
            color: '#ffa94d', descKey: 'law_desc', description: 'Corporate Law, Criminal Law, Civil Rights & Policy',
            skills: [
                { id: 'critical_thinking', nameKey: 'sk_crit', name: 'Critical Thinking', icon: '🧠', target: 85 },
                { id: 'english', nameKey: 'sk_eng_writ', name: 'English & Writing', icon: '✍️', target: 90 },
                { id: 'communication', nameKey: 'sk_comms', name: 'Communication', icon: '🗣️', target: 85 },
                { id: 'research', nameKey: 'sk_leg_res', name: 'Legal Research', icon: '🔍', target: 80 },
                { id: 'public_speaking', nameKey: 'sk_pub_speak', name: 'Public Speaking', icon: '🎤', target: 80 },
                { id: 'logic', nameKey: 'sk_logic_res', name: 'Logical Reasoning', icon: '🧩', target: 85 },
                { id: 'history', nameKey: 'sk_hist', name: 'History & Civics', icon: '📜', target: 70 },
                { id: 'gk', nameKey: 'sk_gk', name: 'General Knowledge', icon: '🌍', target: 75 },
            ],
            courses: [
                { name: 'Critical Thinking Specialization', provider: 'Coursera / Duke', logo: '🧠', logoBg: '#0056d2', url: 'https://www.coursera.org/learn/critical-thinking-skills', skill: 'critical_thinking', xp: 180, type: 'free' },
                { name: 'Academic English Writing', provider: 'Coursera / UCI', logo: '✍️', logoBg: '#0056d2', url: 'https://www.coursera.org/learn/academic-writing', skill: 'english', xp: 150, type: 'free' },
                { name: 'Learn English', provider: 'British Council', logo: '🇬🇧', logoBg: '#2e3192', url: 'https://learnenglish.britishcouncil.org/', skill: 'english', xp: 130, type: 'free' },
                { name: 'CLAT / Law Entrance Prep', provider: 'Unacademy', logo: '📕', logoBg: '#08bd80', url: 'https://unacademy.com/', skill: 'research', xp: 250, type: 'paid' },
                { name: 'Public Speaking Mastery', provider: 'Toastmasters', logo: '🎤', logoBg: '#004165', url: 'https://www.toastmasters.org/', skill: 'public_speaking', xp: 170, type: 'free' },
                { name: 'Introduction to Logic', provider: 'Coursera / Stanford', logo: '🧩', logoBg: '#0056d2', url: 'https://www.coursera.org/learn/logic-introduction', skill: 'logic', xp: 200, type: 'free' },
                { name: 'Indian Constitution & Polity', provider: 'SWAYAM / NPTEL', logo: '📜', logoBg: '#ff6f00', url: 'https://swayam.gov.in/', skill: 'history', xp: 160, type: 'free' },
                { name: 'General Knowledge Quiz', provider: 'GK Today', logo: '🌍', logoBg: '#1565c0', url: 'https://www.gktoday.in/', skill: 'gk', xp: 100, type: 'free' },
            ],
            caseStudy: {
                emoji: '⚖️', name: 'Fali Sam Nariman', title: 'Supreme Court Senior Advocate & Constitutional Law Legend',
                school: 'Born in <b>Rangoon (now Yangon), Myanmar</b>. Family fled to India during WWII. Completed schooling in <b>Kolkata</b> under difficult circumstances.',
                college: 'Studied Law at <b>Government Law College (GLC), Mumbai</b> — India\'s oldest law school. Topped his class and was called to the Bar.',
                studied: 'At GLC, he mastered <b>Constitutional Law, Legal Reasoning, and Jurisprudence</b>. Spent hours in the <b>Bombay High Court library</b> reading landmark judgments. Participated in <b>moot courts and legal debates</b>.',
                career: 'Became one of India\'s most respected <b>Senior Advocates</b> at the Supreme Court. Fought landmark cases on <b>fundamental rights, press freedom, and constitutional amendments</b>. Awarded <b>Padma Vibhushan</b>.',
                quote: 'The Constitution is not a mere lawyers\' document. It is a vehicle of life, and its spirit is always the spirit of the age.'
            },
            boss: { nameKey: 'boss_clat', name: 'CLAT Boss', exam: 'CLAT', rewards: [{type: 'xp', val: '+1400 XP'}, {type: 'coins', val: '+700 coins'}, {type: 'badge', key: 'badge_just', val: 'Justice Master badge'}, {type: 'chest', key: 'chest_legend', val: 'Legendary chest'}] }
        },

        business: {
            nameKey: 'business_ldr', name: 'Business Leader',
            icon: '📈', zoneKey: 'bus_zone', zone: 'Gold Bazaar',
            zoneIcon: '💎', hero: { emoji: '💰', name: 'Raju', titleKey: 'hero_bus', title: 'Gold Merchant' },
            color: '#ffd859', descKey: 'bus_desc', description: 'Entrepreneurship, Finance, Marketing & Management',
            skills: [
                { id: 'financial_literacy', nameKey: 'sk_fin', name: 'Financial Literacy', icon: '💹', target: 85 },
                { id: 'marketing', nameKey: 'sk_market', name: 'Marketing', icon: '📣', target: 80 },
                { id: 'communication', nameKey: 'sk_comms', name: 'Communication', icon: '🗣️', target: 80 },
                { id: 'leadership', nameKey: 'sk_lead', name: 'Leadership', icon: '👑', target: 75 },
                { id: 'creativity', nameKey: 'sk_create', name: 'Creativity', icon: '💡', target: 70 },
                { id: 'mathematics', nameKey: 'sk_math', name: 'Mathematics', icon: '🧮', target: 65 },
                { id: 'negotiation', nameKey: 'sk_neg', name: 'Negotiation', icon: '🤝', target: 75 },
                { id: 'digital_literacy', nameKey: 'sk_digi', name: 'Digital Literacy', icon: '💻', target: 70 },
            ],
            courses: [
                { name: 'Finance & Capital Markets', provider: 'Khan Academy', logo: '💹', logoBg: '#14bf96', url: 'https://www.khanacademy.org/economics-finance-domain', skill: 'financial_literacy', xp: 180, type: 'free' },
                { name: 'Zerodha Varsity', provider: 'Zerodha', logo: '📊', logoBg: '#387ed1', url: 'https://zerodha.com/varsity/', skill: 'financial_literacy', xp: 200, type: 'free' },
                { name: 'Google Digital Marketing', provider: 'Google Digital Garage', logo: '📣', logoBg: '#4285f4', url: 'https://learndigital.withgoogle.com/digitalgarage', skill: 'marketing', xp: 220, type: 'free' },
                { name: 'HubSpot Marketing Course', provider: 'HubSpot Academy', logo: '🟠', logoBg: '#ff7a59', url: 'https://academy.hubspot.com/', skill: 'marketing', xp: 180, type: 'free' },
                { name: 'Communication Skills', provider: 'Coursera / U of Pennsylvania', logo: '🗣️', logoBg: '#0056d2', url: 'https://www.coursera.org/learn/wharton-communication', skill: 'communication', xp: 150, type: 'free' },
                { name: 'Leadership Principles', provider: 'edX / Harvard', logo: '👑', logoBg: '#a31f34', url: 'https://www.edx.org/learn/leadership', skill: 'leadership', xp: 170, type: 'paid' },
                { name: 'Business Mathematics', provider: 'Khan Academy', logo: '🧮', logoBg: '#14bf96', url: 'https://www.khanacademy.org/math', skill: 'mathematics', xp: 130, type: 'free' },
                { name: 'Negotiation Masterclass', provider: 'Coursera / Yale', logo: '🤝', logoBg: '#0056d2', url: 'https://www.coursera.org/learn/negotiation', skill: 'negotiation', xp: 190, type: 'paid' },
                { name: 'Google IT Support', provider: 'Coursera / Google', logo: '💻', logoBg: '#4285f4', url: 'https://www.coursera.org/professional-certificates/google-it-support', skill: 'digital_literacy', xp: 160, type: 'paid' },
            ],
            caseStudy: {
                emoji: '👩‍💼', name: 'Indra Nooyi', title: 'Former CEO of PepsiCo',
                school: 'Attended <b>Holy Angels Anglo-Indian Higher Secondary School</b> in Chennai. Was an excellent student and played cricket and guitar in school bands.',
                college: 'Graduated in <b>Physics, Chemistry & Mathematics from Madras Christian College</b>. Then MBA from <b>IIM Calcutta</b>. Later, Master\'s from <b>Yale School of Management</b>.',
                studied: 'At IIM Calcutta, she mastered <b>strategic management, marketing, and finance</b>. At Yale, she focused on <b>public-private enterprise strategy</b>. She was known for her <b>case study presentations and leadership in group projects</b>.',
                career: 'Joined PepsiCo in 1994, became <b>CEO in 2006</b>. Transformed PepsiCo with "Performance with Purpose" — shifting toward <b>healthier products and sustainability</b>. Grew revenue from $35B to $63B. Named Forbes\'s <b>most powerful woman in business</b> 5 times.',
                quote: 'Just because you are CEO, don\'t think you have landed. You must continually increase your learning.'
            },
            boss: { nameKey: 'boss_cat', name: 'CAT Boss', exam: 'CAT/MBA', rewards: [{type: 'xp', val: '+1300 XP'}, {type: 'coins', val: '+750 coins'}, {type: 'badge', key: 'badge_bus', val: 'Business Master badge'}, {type: 'chest', key: 'chest_legend', val: 'Legendary chest'}] }
        }
    };

    // ============================================================
    //  STATE
    // ============================================================
    let selectedPath = null;    // 'tech', 'medical', 'law', 'business'
    let pathData = null;
    let userSkillScores = {};   // { skillId: 'none' | 'some' | 'confident' }
    let currentStep = 1;
    let userData = null;

    // Score mapping for assessment levels
    const SCORE_MAP = { none: 10, some: 45, confident: 80 };

    // ============================================================
    //  INIT (called from script.js)
    // ============================================================
    window.initSkillForge = function () {
        // Get user data from the global if available
        try {
            const _fetch = fetch('/api/me');
            _fetch.then(r => r.json()).then(data => {
                userData = window.currentUser || data;
                window.currentUser = userData;
                updateCoinDisplay();
                renderHeroCard();
            }).catch(() => { });
        } catch (e) { }

        renderPathGrid();
        updateStepper(1);
    };

    // ============================================================
    //  COIN DISPLAY
    // ============================================================
    function updateCoinDisplay() {
        const el = document.getElementById('sfCoinCount');
        if (el && userData) el.textContent = userData.coins || 0;
    }

    // ============================================================
    //  STEP 1 — PATH SELECTION
    // ============================================================
    function renderPathGrid() {
        const grid = document.getElementById('sfPathGrid');
        if (!grid) return;
        grid.innerHTML = '';

        Object.entries(CAREER_PATHS).forEach(([key, path]) => {
            const card = document.createElement('div');
            card.className = 'sf-path-card';
            card.dataset.path = key;
            card.style.setProperty('--path-color', path.color);
            card.innerHTML = `
                <div class="sf-path-icon">${path.icon}</div>
                <div class="sf-path-info">
                    <h4>${t(path.nameKey, path.name)}</h4>
                    <p style="font-size:0.9em; margin-top:2px;">${t(path.descKey, path.description)}</p>
                </div>
                <div class="sf-path-zone">${path.zoneIcon} <span style="font-size:0.85em;">${t(path.zoneKey, path.zone)}</span></div>
            `;
            card.addEventListener('click', () => selectPath(key));
            grid.appendChild(card);
        });
    }

    function selectPath(pathKey) {
        selectedPath = pathKey;
        pathData = CAREER_PATHS[pathKey];
        userSkillScores = {};

        // Update subtitle
        const subtitle = document.getElementById('sfZoneSubtitle');
        if (subtitle) subtitle.innerHTML = t(pathData.zoneKey, pathData.zone) + ' — ' + t(pathData.nameKey, pathData.name);

        // Highlight selected card
        document.querySelectorAll('.sf-path-card').forEach(c => {
            c.classList.toggle('selected', c.dataset.path === pathKey);
        });

        // Show hero card
        renderHeroCard();

        // Show case study
        renderCaseStudy();

        // Move to step 2
        currentStep = 2;
        updateStepper(2);
        showStep2();
    }

    // ============================================================
    //  CASE STUDY CARD
    // ============================================================
    function renderCaseStudy() {
        const container = document.getElementById('sfCaseStudy');
        if (!container || !pathData || !pathData.caseStudy) {
            if (container) container.innerHTML = '';
            return;
        }
        const cs = pathData.caseStudy;
        container.innerHTML = `
            <div class="sf-case-study">
                <div class="sf-cs-card">
                    <div class="sf-cs-header">
                        <div class="sf-cs-avatar">${cs.emoji}</div>
                        <div>
                            <div class="sf-cs-name">${cs.name}</div>
                            <div class="sf-cs-title">${cs.title}</div>
                        </div>
                    </div>
                    <div class="sf-cs-label">✨ SUCCESS STORY</div>
                    <div class="sf-cs-timeline">
                        <div class="sf-cs-step">
                            <div class="sf-cs-step-label">📚 School</div>
                            <div class="sf-cs-step-text">${cs.school}</div>
                        </div>
                        <div class="sf-cs-step">
                            <div class="sf-cs-step-label">🎓 College</div>
                            <div class="sf-cs-step-text">${cs.college}</div>
                        </div>
                        <div class="sf-cs-step">
                            <div class="sf-cs-step-label">📖 What They Studied</div>
                            <div class="sf-cs-step-text">${cs.studied}</div>
                        </div>
                        <div class="sf-cs-step">
                            <div class="sf-cs-step-label">🚀 Career Impact</div>
                            <div class="sf-cs-step-text">${cs.career}</div>
                        </div>
                    </div>
                    <div class="sf-cs-quote">${cs.quote}</div>
                </div>
            </div>
        `;
    }

    // ============================================================
    //  HERO CARD
    // ============================================================
    function renderHeroCard() {
        const card = document.getElementById('sfHeroCard');
        if (!card) return;

        if (!pathData) { card.style.display = 'none'; return; }
        card.style.display = 'flex';

        const hero = pathData.hero;
        const level = userData ? userData.level : 1;
        const xp = userData ? userData.xp : 0;
        const maxXp = level * 500;
        const xpPct = Math.min(100, (xp / maxXp) * 100);
        const streak = userData ? userData.streak : 0;
        const playerName = userData ? userData.player_name : 'Hero';

        document.getElementById('sfAvatarInner').textContent = hero.emoji;
        document.getElementById('sfHeroName').innerHTML =
            `${playerName} — <span style="color:${pathData.color}">${t(hero.titleKey, hero.title, true)}</span>`;
        document.getElementById('sfHeroMeta').innerHTML =
            `Level ${level} · ${streak > 0 ? streak + '-day streak 🔥' : 'No streak yet'}`;
        document.getElementById('sfXpFill').style.width = xpPct + '%';
        document.getElementById('sfXpText').textContent = `${xp} / ${maxXp} XP`;
        document.getElementById('sfZoneIcon').textContent = pathData.zoneIcon;
        document.getElementById('sfZoneName').innerHTML = t(pathData.zoneKey, pathData.zone);
    }

    // ============================================================
    //  STEP 2 — SKILL ASSESSMENT
    // ============================================================
    function showStep2() {
        const sec = document.getElementById('sfStep2');
        if (sec) sec.style.display = 'block';
        document.getElementById('sfAssessDesc').textContent =
            `Rate your proficiency in each skill needed for ${pathData.name}. Be honest!`;
        renderSkillTiles();
        document.getElementById('sfAnalyzeBtn').style.display = 'none';
        // Scroll to step 2
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function renderSkillTiles() {
        const container = document.getElementById('sfSkillTiles');
        if (!container) return;
        container.innerHTML = '';

        pathData.skills.forEach(skill => {
            const tile = document.createElement('div');
            tile.className = 'sf-tile sf-assess-tile';
            tile.dataset.skill = skill.id;
            tile.innerHTML = `
                <span class="sf-tile-icon">${skill.icon}</span>
                <span class="sf-tile-name">${t(skill.nameKey, skill.name)}</span>
                <div class="sf-assess-btns">
                    <button class="sf-assess-btn-opt" data-level="none" title="${t('lvl_none', 'No experience', true)}">❌</button>
                    <button class="sf-assess-btn-opt" data-level="some" title="${t('lvl_some', 'Some knowledge', true)}">🟡</button>
                    <button class="sf-assess-btn-opt" data-level="confident" title="${t('lvl_conf', 'Confident', true)}">✅</button>
                </div>
                <span class="sf-tile-status">${t('tap_rate', 'Tap to rate')}</span>
            `;

            tile.querySelectorAll('.sf-assess-btn-opt').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const level = btn.dataset.level;
                    userSkillScores[skill.id] = level;

                    // Update tile UI
                    tile.querySelectorAll('.sf-assess-btn-opt').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    const status = tile.querySelector('.sf-tile-status');
                    if (level === 'none') {
                        tile.className = 'sf-tile sf-assess-tile critical';
                        status.innerHTML = t('lvl_none', 'No experience');
                    } else if (level === 'some') {
                        tile.className = 'sf-tile sf-assess-tile missing';
                        status.innerHTML = t('lvl_some', 'Some knowledge');
                    } else {
                        tile.className = 'sf-tile sf-assess-tile owned';
                        status.innerHTML = t('lvl_conf', 'Confident');
                    }

                    checkAllAssessed();
                });
            });

            container.appendChild(tile);
        });
    }

    function checkAllAssessed() {
        const total = pathData.skills.length;
        const assessed = Object.keys(userSkillScores).length;
        const scanText = document.getElementById('sfScanText');
        const scanSummary = document.getElementById('sfScanSummary');
        const analyzeBtn = document.getElementById('sfAnalyzeBtn');

        if (assessed > 0 && scanSummary) {
            scanSummary.style.display = 'flex';
            const confident = Object.values(userSkillScores).filter(v => v === 'confident').length;
            const some = Object.values(userSkillScores).filter(v => v === 'some').length;
            const none = Object.values(userSkillScores).filter(v => v === 'none').length;
            scanText.innerHTML = `${assessed}/${total} ${t('rated_word', 'rated', true)} · ${confident} ${t('strong_lc', 'strong', true)} · ${some} ${t('learning_lc', 'learning', true)} · ${none} ${t('gaps_lc', 'gaps', true)}`;
        }

        if (assessed === total && analyzeBtn) {
            analyzeBtn.style.display = 'block';
            analyzeBtn.onclick = () => {
                currentStep = 3;
                updateStepper(3);
                showResults();
            };
        }
    }

    // ============================================================
    //  STEP 3 — RESULTS (Radar + Readiness)
    // ============================================================
    function showResults() {
        const sec = document.getElementById('sfStep3');
        if (sec) sec.style.display = 'block';

        drawRadarChart();
        renderGapBreakdown();
        renderReadiness();

        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Auto-advance to step 4 & 5
        setTimeout(() => {
            currentStep = 4;
            updateStepper(4);
            showCourses();
        }, 600);
    }

    function drawRadarChart() {
        const canvas = document.getElementById('sfRadarCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = canvas.width, H = canvas.height;
        const cx = W / 2, cy = H / 2;
        const R = Math.min(cx, cy) - 30;
        ctx.clearRect(0, 0, W, H);

        const skills = pathData.skills;
        const n = skills.length;
        const angleStep = (2 * Math.PI) / n;
        const startAngle = -Math.PI / 2;

        // Draw grid
        for (let ring = 1; ring <= 4; ring++) {
            const r = (R * ring) / 4;
            ctx.beginPath();
            for (let i = 0; i <= n; i++) {
                const a = startAngle + i * angleStep;
                const x = cx + r * Math.cos(a);
                const y = cy + r * Math.sin(a);
                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.strokeStyle = 'rgba(63,47,83,0.5)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Draw axes + labels
        skills.forEach((skill, i) => {
            const a = startAngle + i * angleStep;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a));
            ctx.strokeStyle = 'rgba(63,47,83,0.4)';
            ctx.stroke();

            // Labels
            const labelR = R + 18;
            const lx = cx + labelR * Math.cos(a);
            const ly = cy + labelR * Math.sin(a);
            ctx.font = '9px Inter, sans-serif';
            ctx.fillStyle = '#a399b2';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const translatedName = t(skill.nameKey, skill.name, true);
            const shortName = translatedName.length > 10 ? translatedName.substring(0, 9) + '…' : translatedName;
            ctx.fillText(shortName, lx, ly);
        });

        // Target polygon (red dashed)
        ctx.beginPath();
        skills.forEach((skill, i) => {
            const a = startAngle + i * angleStep;
            const r = (skill.target / 100) * R;
            const x = cx + r * Math.cos(a);
            const y = cy + r * Math.sin(a);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = '#ff4444';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);

        // User polygon (purple filled)
        ctx.beginPath();
        skills.forEach((skill, i) => {
            const score = SCORE_MAP[userSkillScores[skill.id] || 'none'];
            const a = startAngle + i * angleStep;
            const r = (score / 100) * R;
            const x = cx + r * Math.cos(a);
            const y = cy + r * Math.sin(a);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fillStyle = 'rgba(200,162,255,0.25)';
        ctx.fill();
        ctx.strokeStyle = '#c8a2ff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Dots
        skills.forEach((skill, i) => {
            const score = SCORE_MAP[userSkillScores[skill.id] || 'none'];
            const a = startAngle + i * angleStep;
            const r = (score / 100) * R;
            const x = cx + r * Math.cos(a);
            const y = cy + r * Math.sin(a);
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#c8a2ff';
            ctx.fill();
        });
    }

    function renderGapBreakdown() {
        const container = document.getElementById('sfGapBreakdown');
        if (!container) return;
        container.innerHTML = '';

        pathData.skills.forEach(skill => {
            const userScore = SCORE_MAP[userSkillScores[skill.id] || 'none'];
            const target = skill.target;
            const pct = Math.round((userScore / target) * 100);
            let badge, badgeClass, barClass, badgeKey;

            if (pct >= 90) { badge = 'Strong'; badgeClass = 'strong'; barClass = 'green'; badgeKey = 'gap_strong'; }
            else if (pct >= 60) { badge = 'Good'; badgeClass = 'good'; barClass = 'green'; badgeKey = 'gap_good'; }
            else if (pct >= 35) { badge = 'Needs Work'; badgeClass = 'needs-work'; barClass = 'orange'; badgeKey = 'gap_needs'; }
            else { badge = 'Critical'; badgeClass = 'critical'; barClass = 'red'; badgeKey = 'gap_crit'; }

            const item = document.createElement('div');
            item.className = 'sf-gap-item';
            item.innerHTML = `
                <div class="sf-gap-item-header">
                    <strong>${skill.icon} ${t(skill.nameKey, skill.name)}</strong>
                    <span class="sf-gap-badge ${badgeClass}">${t(badgeKey, badge, true)}</span>
                </div>
                <div class="sf-gap-bars">
                    <div class="sf-gap-bar-row">
                        <span class="sf-gap-bar-label">${t('lbl_you', 'You', true)}</span>
                        <div class="sf-gap-bar-track"><div class="sf-gap-bar-fill ${barClass}" style="width:${userScore}%"></div></div>
                        <span class="sf-gap-pct">${userScore}%</span>
                    </div>
                    <div class="sf-gap-bar-row">
                        <span class="sf-gap-bar-label">${t('lbl_need', 'Need', true)}</span>
                        <div class="sf-gap-bar-track"><div class="sf-gap-bar-fill green" style="width:${target}%"></div></div>
                        <span class="sf-gap-pct">${target}%</span>
                    </div>
                </div>
            `;
            container.appendChild(item);
        });
    }

    function renderReadiness() {
        const barsContainer = document.getElementById('sfReadinessBars');
        const pctEl = document.getElementById('sfReadinessPct');
        if (!barsContainer) return;
        barsContainer.innerHTML = '';

        let totalScore = 0;
        let totalTarget = 0;

        pathData.skills.forEach(skill => {
            const userScore = SCORE_MAP[userSkillScores[skill.id] || 'none'];
            const target = skill.target;
            const pct = Math.round(Math.min(100, (userScore / target) * 100));
            totalScore += userScore;
            totalTarget += target;

            const barItem = document.createElement('div');
            barItem.className = 'sf-readiness-bar-item';
            barItem.innerHTML = `
                <label>${t(skill.nameKey, skill.name, true).substring(0, 6)}</label>
                <div class="sf-readiness-stack">
                    <div class="sf-readiness-have" style="height:${pct}%"></div>
                    <div class="sf-readiness-gap"></div>
                </div>
            `;
            barsContainer.appendChild(barItem);
        });

        const overallPct = Math.round((totalScore / totalTarget) * 100);
        if (pctEl) pctEl.textContent = overallPct + '%';
    }

    // ============================================================
    //  STEP 4 — RECOMMENDED COURSES
    // ============================================================
    let courseFilter = 'all'; // 'all', 'free', 'paid'

    function showCourses() {
        const sec = document.getElementById('sfStep4');
        if (sec) sec.style.display = 'block';

        const grid = document.getElementById('sfCourseGrid');
        if (!grid) return;
        grid.innerHTML = '';

        // Find weak skills
        const weakSkills = pathData.skills.filter(s => {
            const level = userSkillScores[s.id] || 'none';
            return level !== 'confident';
        });

        const weakIds = weakSkills.map(s => s.id);

        // Show courses for weak skills only
        let relevantCourses = pathData.courses.filter(c => weakIds.includes(c.skill));

        if (relevantCourses.length === 0) {
            grid.innerHTML = '<p style="color:#aadeab; text-align:center; padding:20px;">🎉 You\'re already proficient in all skills! No courses needed.</p>';
            setTimeout(() => { currentStep = 5; updateStepper(5); showQuests(); }, 400);
            return;
        }

        // --- Filter Tabs ---
        const freeCount = relevantCourses.filter(c => c.type === 'free').length;
        const paidCount = relevantCourses.filter(c => c.type === 'paid').length;

        const filtersDiv = document.createElement('div');
        filtersDiv.className = 'sf-course-filters';
        filtersDiv.innerHTML = `
            <button class="sf-filter-tab ${courseFilter === 'all' ? 'active' : ''}" data-filter="all">🎯 All (${relevantCourses.length})</button>
            <button class="sf-filter-tab ${courseFilter === 'free' ? 'active' : ''}" data-filter="free">🆓 Free (${freeCount})</button>
            <button class="sf-filter-tab ${courseFilter === 'paid' ? 'active' : ''}" data-filter="paid">💳 Paid (${paidCount})</button>
        `;
        filtersDiv.querySelectorAll('.sf-filter-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                courseFilter = btn.dataset.filter;
                showCourses(); // re-render
            });
        });
        grid.appendChild(filtersDiv);

        // Apply filter
        if (courseFilter !== 'all') {
            relevantCourses = relevantCourses.filter(c => c.type === courseFilter);
        }

        if (relevantCourses.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.style.cssText = 'color:#a399b2; text-align:center; padding:20px; grid-column: 1/-1;';
            emptyMsg.textContent = `No ${courseFilter} courses for your current skill gaps.`;
            grid.appendChild(emptyMsg);
        } else {
            // Render all courses directly without grouping
            relevantCourses.forEach((course, index) => {
                const skill = pathData.skills.find(s => s.id === course.skill);
                const userLevel = userSkillScores[course.skill] || 'none';
                let priority, priorityClass;
                if (userLevel === 'none') { priority = 'CRITICAL GAP'; priorityClass = 'critical-gap'; }
                else { priority = 'IMPROVE'; priorityClass = 'high-priority'; }

                const isFree = course.type === 'free';
                const priceBadge = isFree
                    ? '<span class="sf-price-badge free">🆓 FREE</span>'
                    : '<span class="sf-price-badge paid">💳 PAID</span>';

                const card = document.createElement('div');
                card.className = `sf-course-card ${priorityClass}`;
                card.innerHTML = `
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <div class="sf-course-priority">${priority}</div>
                        ${priceBadge}
                    </div>
                    <div class="sf-course-provider">
                        <div class="sf-provider-logo" style="background:${course.logoBg}">${course.logo}</div>
                        <span style="font-size:11px; color:var(--text-muted)">${course.provider}</span>
                    </div>
                    <div class="sf-course-name">${course.name}</div>
                    <div class="sf-course-tags">
                        <span class="sf-course-tag gap">${skill ? skill.name : ''}</span>
                        <span class="sf-course-tag xp">+${course.xp} XP</span>
                    </div>
                    <div class="sf-course-price">${isFree ? 'FREE' : 'PAID'} <small>${isFree ? 'Official course' : 'Premium content'}</small></div>
                    <a href="${course.url}" target="_blank" rel="noopener noreferrer" class="sf-enroll-btn" onclick="event.stopPropagation()">
                        Visit Course ↗
                    </a>
                `;
                grid.appendChild(card);
            });
        }

        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });

        setTimeout(() => {
            currentStep = 5;
            updateStepper(5);
            showQuests();
        }, 600);
    }

    // ============================================================
    //  STEP 5 — QUESTS
    // ============================================================
    function showQuests() {
        const sec = document.getElementById('sfStep5');
        if (sec) sec.style.display = 'block';

        const questList = document.getElementById('sfQuestList');
        if (!questList) return;
        questList.innerHTML = '';

        // Generate quests from weak skills
        const weakSkills = pathData.skills.filter(s => {
            const level = userSkillScores[s.id] || 'none';
            return level !== 'confident';
        });

        if (weakSkills.length === 0) {
            questList.innerHTML = '<p style="color:#aadeab; text-align:center; padding:20px;">🎉 All skills mastered! You are ready for the boss battle!</p>';
            showBossBanner(true);
            return;
        }

        const questTemplates = {
            none: [
                { prefix: 'Conquer', desc: 'Start from zero and build a solid foundation in', xp: 200, coins: 50, difficulty: 'critical' },
            ],
            some: [
                { prefix: 'Power-Up', desc: 'Level up your intermediate skills in', xp: 120, coins: 30, difficulty: 'active' },
            ]
        };

        weakSkills.forEach((skill, i) => {
            const level = userSkillScores[skill.id] || 'none';
            const template = questTemplates[level][0];
            const questName = `${template.prefix} ${skill.name}`;

            const card = document.createElement('div');
            card.className = `sf-quest-card ${template.difficulty}`;
            card.innerHTML = `
                <div class="sf-quest-num">${i + 1}</div>
                <div class="sf-quest-body">
                    <h4>${skill.icon} ${questName}</h4>
                    <p>${template.desc} ${skill.name}. Complete a course and practice exercises.</p>
                    <div class="sf-quest-tags">
                        <span class="sf-quest-tag xp">+${template.xp} XP</span>
                        <span class="sf-quest-tag coins">+${template.coins} coins</span>
                        <span class="sf-quest-tag badge">${skill.name} badge</span>
                    </div>
                </div>
                <div class="sf-quest-action">
                    <button class="sf-quest-btn ${template.difficulty === 'critical' ? 'play' : 'start'}" data-skill="${skill.id}" data-xp="${template.xp}" data-coins="${template.coins}">
                        ${template.difficulty === 'critical' ? '⚔️ Fight' : '▶ Start'}
                    </button>
                </div>
            `;

            // Quest button click — launch game!
            card.querySelector('.sf-quest-btn').addEventListener('click', (e) => {
                const btn = e.currentTarget;
                if (btn.classList.contains('done')) return;

                const heroEmoji = pathData.hero.emoji;
                const heroName = userData ? userData.player_name : 'Hero';

                window.launchQuestGame(
                    skill.id, skill.name,
                    heroEmoji, heroName,
                    template.xp, template.coins,
                    (victory, finalXp, finalCoins) => {
                        if (victory) {
                            completeQuest(btn, skill, finalXp, finalCoins);
                        } else {
                            if (window.showToast) window.showToast('Keep training! You can retry anytime.', 'info');
                        }
                    }
                );
            });

            questList.appendChild(card);
        });

        showBossBanner(false);
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function completeQuest(btn, skill, xpEarned, coinsEarned) {
        if (btn.classList.contains('done')) return;

        // Animate
        btn.classList.add('done');
        btn.textContent = '✅ Done';

        const card = btn.closest('.sf-quest-card');
        card.classList.remove('critical', 'active');
        card.classList.add('completed');

        // Award XP and coins (single source of truth: window.currentUser)
        const u = window.currentUser || userData;
        if (u) {
            userData = u;
            window.currentUser = u;
            u.xp = (u.xp || 0) + xpEarned;
            u.coins = (u.coins || 0) + coinsEarned;

            // Check level up
            const maxXp = u.level * 500;
            if (u.xp >= maxXp) {
                u.level += 1;
                u.xp -= maxXp;
                if (window.showToast) window.showToast('⚔️ LEVEL UP! Now Level ' + u.level + '!', 'success');
            }

            updateCoinDisplay();
            renderHeroCard();

            // Update global header coins + level
            const headerCoins = document.getElementById('headerCoins');
            if (headerCoins) headerCoins.textContent = u.coins;
            const headerLevel = document.getElementById('headerLevel');
            if (headerLevel) headerLevel.textContent = 'Lv. ' + u.level;

            // Refresh rewards page if visible
            if (window.refreshRewardsView) window.refreshRewardsView(u.coins);

            // Save to backend
            fetch('/api/save-gamestate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ coins: u.coins, xp: u.xp, level: u.level })
            }).catch(() => { });
        }

        if (window.showToast) window.showToast(`+${xpEarned} XP, +${coinsEarned} coins earned! 🎉`, 'success');

        // Check if all quests done
        setTimeout(() => {
            const remaining = document.querySelectorAll('.sf-quest-btn:not(.done)');
            if (remaining.length === 0) {
                showBossBanner(true);
            }
        }, 500);
    }

    // ============================================================
    //  BOSS BANNER
    // ============================================================
    function showBossBanner(unlocked) {
        const banner = document.getElementById('sfBossBanner');
        const content = document.getElementById('sfBossContent');
        if (!banner || !content || !pathData) return;

        banner.style.display = 'flex';

        const boss = pathData.boss;
        if (unlocked) {
            content.innerHTML = `
                <h4>🎉 Boss Battle UNLOCKED! Face the ${boss.name}!</h4>
                <p>You've mastered all skills. Defeat the ${boss.exam} boss to unlock the next career zone!</p>
                <div class="sf-boss-rewards">
                    ${boss.rewards.map(r => `<span class="sf-boss-tag ${r.type}">${r.val}</span>`).join('')}
                </div>
            `;
        } else {
            content.innerHTML = `
                <h4>Complete all quests → unlock the ${boss.name} Battle</h4>
                <p>Finish all skill quests to face the ${boss.exam} boss and earn these rewards:</p>
                <div class="sf-boss-rewards">
                    ${boss.rewards.map(r => `<span class="sf-boss-tag ${r.type}">${r.val}</span>`).join('')}
                </div>
            `;
        }
    }

    // ============================================================
    //  STEPPER
    // ============================================================
    function updateStepper(activeStep) {
        currentStep = activeStep;
        const stepper = document.getElementById('sfStepper');
        if (!stepper) return;

        stepper.querySelectorAll('.sf-step').forEach(step => {
            const stepNum = parseInt(step.dataset.step);
            step.classList.remove('active', 'completed');
            if (stepNum < activeStep) step.classList.add('completed');
            else if (stepNum === activeStep) step.classList.add('active');
        });

        stepper.querySelectorAll('.sf-step-line').forEach((line, i) => {
            line.classList.remove('active', 'completed');
            if (i + 1 < activeStep) line.classList.add('completed');
            else if (i + 1 === activeStep) line.classList.add('active');
        });
    }

})();
