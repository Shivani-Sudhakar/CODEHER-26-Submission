document.addEventListener("DOMContentLoaded", () => {
    // ============================================================
    //  STATE
    // ============================================================
    let currentUser = null;   // populated from /api/me
    let currentLang = 'en';
    const selectedSkills = new Set();

    // DOM refs
    const userHeader = document.getElementById("userHeader");
    const bottomNav = document.getElementById("bottomNav");
    const onboardingView = document.getElementById("onboardingView");
    const dashboardView = document.getElementById("dashboardView");
    const rewardsView = document.getElementById("rewardsView");
    const skillsView = document.getElementById("skillsView");
    const chatbotView = document.getElementById("chatbotView");
    const exploreView = document.getElementById("exploreView");
    const skillsGrid = document.getElementById("skillsGrid");
    const playerNameInput = document.getElementById("playerName");
    const continueBtn = document.getElementById("continueBtn");
    const customLanguageSelect = document.getElementById("customLanguageSelect");
    const selectedLanguageText = document.getElementById("selectedLanguageText");
    const languageOptions = document.getElementById("languageOptions");
    const logoutBtn = document.getElementById("logoutBtn");

    const allViews = [onboardingView, dashboardView, rewardsView, skillsView, chatbotView, exploreView];

    // Languages
    const languages = [
        { code: "en", name: "English", color: "#c8a2ff" },
        { code: "hi", name: "हिन्दी", color: "#ff9a9e" },
        { code: "bn", name: "বাংলা", color: "#fecfef" },
        { code: "te", name: "తెలుగు", color: "#a18cd1" },
        { code: "mr", name: "मराठी", color: "#fbc2eb" },
        { code: "ta", name: "தமிழ்", color: "#8fd3f4" },
        { code: "ur", name: "اردو", color: "#84fab0" },
        { code: "gu", name: "ગુજરાતી", color: "#fccb90" },
        { code: "kn", name: "ಕನ್ನಡ", color: "#d4fc79" },
        { code: "or", name: "ଓଡ଼ିଆ", color: "#e0c3fc" },
        { code: "ml", name: "മലയാളം", color: "#8ec5fc" },
        { code: "pa", name: "ਪੰਜਾਬੀ", color: "#cfd9df" },
        { code: "as", name: "অসমীয়া", color: "#fdcbf1" },
        { code: "mai", name: "मैथिली", color: "#e2ebf0" },
        { code: "sat", name: "ᱥᱟᱱᱛᱟᱲᱤ", color: "#a1c4fd" },
        { code: "ks", name: "كأشُر", color: "#ffecd2" },
        { code: "ne", name: "नेपाली", color: "#cfd9df" },
        { code: "sd", name: "سنڌي", color: "#fbc2eb" },
        { code: "doi", name: "डोगरी", color: "#a18cd1" },
        { code: "kok", name: "कोंकणी", color: "#ff9a9e" },
        { code: "mni", name: "ꯃꯤꯇꯩꯂꯣꯟ", color: "#c8a2ff" }
    ];

    // Daily tips
    const tips = [
        "tip_1", "tip_2", "tip_3", "tip_4", "tip_5",
        "tip_6", "tip_7", "tip_8", "tip_9", "tip_10"
    ];

    // ============================================================
    //  INIT — Fetch user data and decide which view to show
    // ============================================================
    async function init() {
        try {
            const res = await fetch('/api/me');
            if (!res.ok) {
                window.location.href = '/login';
                return;
            }
            currentUser = await res.json();
            window.currentUser = currentUser;
            currentLang = currentUser.language || 'en';

            applyTranslations(currentLang);

            if (currentUser.onboarded) {
                showDashboard();
            } else {
                showOnboarding();
            }
        } catch (err) {
            console.error('Failed to load user:', err);
            window.location.href = '/login';
        }
    }

    // ============================================================
    //  VIEW SWITCHING
    // ============================================================
    function hideAllViews() {
        allViews.forEach(v => { if (v) v.style.display = 'none'; });
    }

    function showOnboarding() {
        hideAllViews();
        userHeader.style.display = 'none';
        bottomNav.style.display = 'none';
        onboardingView.style.display = 'block';
        renderLanguages();
        renderSkills(currentLang);
    }

    function showDashboard() {
        hideAllViews();
        userHeader.style.display = 'flex';
        bottomNav.style.display = 'flex';
        dashboardView.style.display = 'block';
        populateHeader();
        populateDashboard();
        setActiveNav('home');
    }

    function showRewards() {
        hideAllViews();
        rewardsView.style.display = 'block';
        updateRewardsCoins();
        updateRewardCards();
        setActiveNav('rewards');
    }

    function showSkillForge() {
        hideAllViews();
        skillsView.style.display = 'block';
        if (window.initSkillForge) window.initSkillForge();
        if (currentUser) {
            document.getElementById('sfCoinCount').textContent = currentUser.coins;
        }
        setActiveNav('skills');
    }

    function showChatbot() {
        hideAllViews();
        chatbotView.style.display = 'flex';
        userHeader.style.display = 'flex';
        bottomNav.style.display = 'flex';
        setActiveNav('chatbot');
        initChatbot();
    }

    function showExplore() {
        hideAllViews();
        exploreView.style.display = 'block';
        userHeader.style.display = 'flex';
        bottomNav.style.display = 'flex';
        setActiveNav('explore');
        if (typeof initExplore === 'function') {
            initExplore();
        }
    }

    function setActiveNav(viewName) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.view === viewName) {
                item.classList.add('active');
            }
        });
    }

    // ============================================================
    //  HEADER
    // ============================================================
    function populateHeader() {
        if (!currentUser) return;
        const name = currentUser.player_name || currentUser.username;
        document.getElementById('headerPlayerName').textContent = name;
        document.getElementById('headerLevel').textContent = 'Lv. ' + currentUser.level;
        document.getElementById('headerCoins').textContent = currentUser.coins;

        // Set avatar based on hero
        const heroEmojis = { arjun: '🔮', priya: '⚔️', meena: '💚', raju: '💰' };
        const avatar = heroEmojis[currentUser.hero] || '🎮';
        document.getElementById('userAvatar').textContent = avatar;
    }

    // ============================================================
    //  DASHBOARD
    // ============================================================
    function populateDashboard() {
        if (!currentUser) return;

        // Streak
        const streak = currentUser.streak || 0;
        document.getElementById('streakCount').textContent = streak;
        const streakBadge = document.getElementById('streakBadge');
        if (streak >= 7) {
            streakBadge.style.background = 'linear-gradient(135deg, #ff6b6b, #ffa94d)';
            streakBadge.title = 'Week warrior!';
        } else if (streak >= 3) {
            streakBadge.style.background = 'linear-gradient(135deg, #ffa94d, #ffd859)';
            streakBadge.title = 'On a roll!';
        }

        // Stats
        document.getElementById('dashLevel').textContent = currentUser.level;
        document.getElementById('dashXp').textContent = currentUser.xp;
        document.getElementById('dashCoins').textContent = currentUser.coins;

        // XP progress bar — each level needs level * 500 XP
        const xpNeeded = currentUser.level * 500;
        const xpPct = Math.min(100, (currentUser.xp / xpNeeded) * 100);
        document.getElementById('dashXpFill').style.width = xpPct + '%';

        // Welcome
        document.getElementById('dashPlayerName').textContent = currentUser.player_name || currentUser.username;
        document.getElementById('welcomeAvatar').textContent =
            ({ arjun: '🔮', priya: '⚔️', meena: '💚', raju: '💰' })[currentUser.hero] || '🎮';

        // Skills summary
        const pillsContainer = document.getElementById('skillsPills');
        pillsContainer.innerHTML = '';
        const userSkills = currentUser.skills || [];
        if (userSkills.length > 0 && window.skillsData) {
            userSkills.forEach(skillId => {
                const skillData = window.skillsData.find(s => s.id === skillId);
                if (skillData) {
                    const pill = document.createElement('span');
                    pill.className = 'skill-pill';
                    const translationData = window.translations[skillData.id];
                    let transText = skillData.en;
                    if (currentLang !== 'en') {
                        const t = skillData[currentLang] || skillData.en;
                        transText = `<span class="bilingual-translated">${t}</span> <span class="bilingual-english">${skillData.en}</span>`;
                    }
                    pill.innerHTML = skillData.icon + ' ' + transText;
                    pillsContainer.appendChild(pill);
                }
            });
        } else {
            const noSkillsText = window.translations['no_skills'] ? window.translations['no_skills'][currentLang] || 'No skills selected yet' : 'No skills selected yet';
            const defaultText = window.translations['no_skills'] ? window.translations['no_skills']['en'] : 'No skills selected yet';
            let content = 'No skills selected yet';
            if (currentLang !== 'en') {
                content = `<span class="bilingual-translated">${noSkillsText}</span> <span class="bilingual-english">${defaultText}</span>`;
            }
            pillsContainer.innerHTML = `<span class="skill-pill muted">${content}</span>`;
        }

        // Daily tip
        const tipIndex = new Date().getDate() % tips.length;
        const tipKey = tips[tipIndex];
        const tipContainer = document.getElementById('dailyTip');
        if (tipContainer && window.translations[tipKey]) {
            const translationData = window.translations[tipKey];
            const defaultEn = translationData['en'];
            const translated = translationData[currentLang] || defaultEn;
            if (currentLang === 'en') {
                tipContainer.innerHTML = defaultEn;
            } else {
                tipContainer.innerHTML = `
                    <div class="bilingual-wrapper">
                        <span class="bilingual-translated">${translated}</span>
                        <span class="bilingual-english">${defaultEn}</span>
                    </div>
                `;
            }
        }
    }

    // ============================================================
    //  REWARDS
    // ============================================================
    function updateRewardsCoins() {
        if (!currentUser) return;
        document.getElementById('coinCount').textContent = currentUser.coins;
    }

    function updateRewardCards() {
        if (!currentUser) return;
        const claimed = currentUser.claimed_rewards || [];
        const coins = currentUser.coins;

        document.querySelectorAll('.reward-card[data-reward-id]').forEach(card => {
            if (card.classList.contains('special')) return;

            const rewardId = card.dataset.rewardId;
            const costRaw = parseInt(card.dataset.cost, 10);
            const costNum = Number.isFinite(costRaw) ? costRaw : 0;
            const actionDiv = card.querySelector('.reward-action');
            const priceEl = card.querySelector('.reward-info .price');

            if (claimed.includes(rewardId)) {
                card.classList.remove('locked', 'claimable');
                card.classList.add('claimed-card');
                if (actionDiv) {
                    actionDiv.innerHTML = '<span class="claimed-tag"><i class="fa-solid fa-check-circle"></i> Claimed</span>';
                }
                return;
            }

            const canAfford = costNum <= 0 || coins >= costNum;

            if (canAfford) {
                card.classList.remove('locked', 'claimed-card');
                card.classList.add('claimable');
                card.classList.remove('tooltip-container');
                if (priceEl) {
                    priceEl.className = 'price claim-price';
                    priceEl.innerHTML = `${costNum} <span data-key="stat_coins">coins</span> - <span data-key="claimable">CLAIMABLE</span>`;
                }
                if (actionDiv) {
                    actionDiv.className = 'reward-action claim-btn-wrapper';
                    actionDiv.innerHTML = '<button class="claim-btn" data-reward-id="' + rewardId + '" data-cost="' + costNum + '"><span data-key="claim_btn">CLAIM</span> <i class="fa-solid fa-check"></i></button>';
                }
            } else {
                card.classList.remove('claimable', 'claimed-card');
                card.classList.add('locked', 'tooltip-container');
                if (priceEl) {
                    priceEl.className = 'price';
                    priceEl.innerHTML = `${costNum} <span data-key="stat_coins">coins</span>`;
                }
                if (actionDiv) {
                    actionDiv.className = 'reward-action';
                    actionDiv.innerHTML = '<i class="fa-solid fa-lock" style="color: #ffd859;"></i> <span data-key="reward_locked">Locked</span>';
                }
                let tooltipDiv = card.querySelector('.locked-tooltip');
                if (!tooltipDiv) {
                    tooltipDiv = document.createElement('div');
                    tooltipDiv.className = 'locked-tooltip';
                    card.appendChild(tooltipDiv);
                }
                const moreNeeded = Math.max(0, costNum - coins);
                tooltipDiv.innerHTML = `${moreNeeded} <span data-key="coins_needed">coins needed</span>`;
            }
        });

        if (currentLang !== 'en') {
            applyTranslations(currentLang);
        }

        document.querySelectorAll('.claim-btn').forEach(btn => {
            btn.removeEventListener('click', handleClaim);
            btn.addEventListener('click', handleClaim);
        });
    }

    // Global function so Skill Forge can refresh rewards when coins change
    window.refreshRewardsView = function (newCoins) {
        if (currentUser && newCoins !== undefined) {
            currentUser.coins = newCoins;
            window.currentUser = currentUser;
        }
        updateRewardsCoins();
        updateRewardCards();
        populateHeader();

        // Update dashboard and skill forge coins too
        const dashCoins = document.getElementById('dashCoins');
        if (dashCoins && currentUser) dashCoins.textContent = currentUser.coins;
        const sfCoinCount = document.getElementById('sfCoinCount');
        if (sfCoinCount && currentUser) sfCoinCount.textContent = currentUser.coins;
        if (typeof window.syncExploreCoins === 'function') window.syncExploreCoins();
    };

    async function handleClaim(e) {
        const btn = e.currentTarget;
        const rewardId = btn.dataset.rewardId;
        const cost = parseInt(btn.dataset.cost, 10) || 0;

        btn.disabled = true;
        btn.textContent = '...';

        try {
            const res = await fetch('/api/claim-reward', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reward_id: rewardId, cost: cost })
            });
            const data = await res.json();

            if (data.success) {
                currentUser.coins = data.coins;
                window.currentUser = currentUser;
                if (!currentUser.claimed_rewards) currentUser.claimed_rewards = [];
                currentUser.claimed_rewards.push(rewardId);

                refreshRewardsView(currentUser.coins);
                showConfettiBanner();
            } else {
                showToast(data.error || 'Failed to claim', 'error');
                btn.disabled = false;
                btn.innerHTML = 'CLAIM <i class="fa-solid fa-check"></i>';
            }
        } catch (err) {
            showToast('Network error', 'error');
            btn.disabled = false;
            btn.innerHTML = 'CLAIM <i class="fa-solid fa-check"></i>';
        }
    }

    // Level Up button in rewards
    const levelUpBtn = document.getElementById("levelUpBtn");
    if (levelUpBtn) {
        levelUpBtn.addEventListener("click", async () => {
            if (!currentUser) return;
            currentUser.coins += 50;
            currentUser.xp += 100;
            window.currentUser = currentUser;

            // Check level up
            const xpNeeded = currentUser.level * 500;
            if (currentUser.xp >= xpNeeded) {
                currentUser.level += 1;
                currentUser.xp = currentUser.xp - xpNeeded;
                showToast('⚔️ LEVEL UP! You are now Level ' + currentUser.level + '!', 'success');
            }

            updateRewardsCoins();
            populateHeader();
            if (typeof window.syncExploreCoins === 'function') window.syncExploreCoins();

            levelUpBtn.innerHTML = "LEVEL UP <i class='fa-solid fa-arrow-up'></i>";
            setTimeout(() => { levelUpBtn.innerHTML = "LEVEL UP"; }, 1000);

            // Save to backend
            try {
                await fetch('/api/save-gamestate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        coins: currentUser.coins,
                        xp: currentUser.xp,
                        level: currentUser.level
                    })
                });
            } catch (err) {
                console.error('Failed to save game state:', err);
            }
        });
    }

    // ============================================================
    //  ONBOARDING — Skills Grid & Language Picker
    // ============================================================
    function renderSkills(lang) {
        if (!skillsGrid || !window.skillsData) return;
        skillsGrid.innerHTML = '';
        window.skillsData.forEach(skill => {
            const btn = document.createElement("div");
            btn.className = "skill-btn";
            if (selectedSkills.has(skill.id)) btn.classList.add("selected");
            btn.dataset.id = skill.id;

            let translatedText = skill[lang] || skill['en'];

            const icon = document.createElement("div");
            icon.className = "skill-icon";
            icon.textContent = skill.icon;
            btn.appendChild(icon);

            const textWrapper = document.createElement("div");
            textWrapper.className = "bilingual-wrapper";
            if (lang === 'en') {
                textWrapper.textContent = skill['en'];
            } else {
                const transSpan = document.createElement("span");
                transSpan.className = "bilingual-translated";
                transSpan.textContent = translatedText;
                const enSpan = document.createElement("span");
                enSpan.className = "bilingual-english";
                enSpan.textContent = skill['en'];
                textWrapper.appendChild(transSpan);
                textWrapper.appendChild(enSpan);
            }
            btn.appendChild(textWrapper);

            btn.addEventListener('click', () => {
                if (selectedSkills.has(skill.id)) {
                    selectedSkills.delete(skill.id);
                    btn.classList.remove("selected");
                } else {
                    selectedSkills.add(skill.id);
                    btn.classList.add("selected");
                }
                updateContinueBtn();
            });

            skillsGrid.appendChild(btn);
        });
    }

    function updateContinueBtn() {
        const nameOk = playerNameInput && playerNameInput.value.trim().length > 0;
        const skillsOk = selectedSkills.size > 0;
        if (continueBtn) continueBtn.disabled = !(nameOk && skillsOk);
    }

    if (playerNameInput) {
        playerNameInput.addEventListener("input", updateContinueBtn);
    }

    // Continue button — save onboarding
    if (continueBtn) {
        continueBtn.addEventListener("click", async () => {
            const playerName = playerNameInput.value.trim();
            const skills = Array.from(selectedSkills);

            if (!playerName || skills.length === 0) return;

            continueBtn.disabled = true;
            continueBtn.textContent = 'Saving...';

            try {
                const res = await fetch('/api/onboard', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        player_name: playerName,
                        skills: skills,
                        language: currentLang
                    })
                });
                const data = await res.json();

                if (data.success) {
                    // Update local state
                    currentUser.player_name = playerName;
                    currentUser.skills = skills;
                    currentUser.language = currentLang;
                    currentUser.onboarded = true;
                    window.currentUser = currentUser;

                    showToast('Welcome, ' + playerName + '! +50 XP earned! 🎮', 'success');
                    setTimeout(() => showDashboard(), 800);
                } else {
                    showToast(data.error || 'Failed to save', 'error');
                    continueBtn.disabled = false;
                    continueBtn.textContent = 'Continue Journey';
                }
            } catch (err) {
                showToast('Network error', 'error');
                continueBtn.disabled = false;
                continueBtn.textContent = 'Continue Journey';
            }
        });
    }

    // ============================================================
    //  TRANSLATIONS
    // ============================================================
    function applyTranslations(lang) {
        document.querySelectorAll("[data-key]").forEach(element => {
            const key = element.getAttribute("data-key");
            const translationData = window.translations[key];
            if (translationData) {
                const defaultEn = translationData['en'];
                const translated = translationData[lang] || defaultEn;
                if (lang === 'en') {
                    element.innerHTML = defaultEn;
                } else {
                    element.innerHTML = `
                        <div class="bilingual-wrapper">
                            <span class="bilingual-translated">${translated}</span>
                            <span class="bilingual-english">${defaultEn}</span>
                        </div>
                    `;
                }
            }
        });

        document.querySelectorAll("[data-placeholder-key]").forEach(element => {
            const key = element.getAttribute("data-placeholder-key");
            const translationData = window.translations[key];
            if (translationData) {
                const defaultEn = translationData['en'];
                const translated = translationData[lang] || defaultEn;
                element.placeholder = lang === 'en' ? defaultEn : translated;
            }
        });
    }

    // ============================================================
    //  LANGUAGE DROPDOWN
    // ============================================================
    function renderLanguages() {
        if (!languageOptions) return;
        languageOptions.innerHTML = '';

        const currentLangObj = languages.find(l => l.code === currentLang);
        if (currentLangObj && selectedLanguageText) {
            selectedLanguageText.textContent = currentLangObj.name;
            const trigger = customLanguageSelect.querySelector('.custom-select-trigger');
            if (trigger) trigger.style.borderLeftColor = currentLangObj.color;
        }

        languages.forEach(lang => {
            const option = document.createElement("div");
            option.className = "custom-option";
            if (lang.code === currentLang) option.classList.add("selected");
            option.textContent = lang.name;
            option.style.setProperty("--accent-color", lang.color);

            option.addEventListener("click", (e) => {
                e.stopPropagation();
                currentLang = lang.code;
                customLanguageSelect.classList.remove("open");
                renderLanguages();
                renderSkills(currentLang);
                applyTranslations(currentLang);
            });
            languageOptions.appendChild(option);
        });
    }

    if (customLanguageSelect) {
        customLanguageSelect.addEventListener("click", () => {
            customLanguageSelect.classList.toggle("open");
        });
    }

    document.addEventListener("click", (e) => {
        if (customLanguageSelect && !customLanguageSelect.contains(e.target)) {
            customLanguageSelect.classList.remove("open");
        }
    });

    // ============================================================
    //  NAVIGATION
    // ============================================================
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.dataset.view;
            if (!view) return;

            if (view === 'home') {
                showDashboard();
            } else if (view === 'skills') {
                hideAllViews();
                userHeader.style.display = 'flex';
                bottomNav.style.display = 'flex';
                showSkillForge();
            } else if (view === 'rewards') {
                hideAllViews();
                userHeader.style.display = 'flex';
                bottomNav.style.display = 'flex';
                showRewards();
            } else if (view === 'chatbot') {
                hideAllViews();
                userHeader.style.display = 'flex';
                bottomNav.style.display = 'flex';
                showChatbot();
            } else if (view === 'explore') {
                showExplore();
            }
        });
    });

    // Quick action cards on dashboard
    const goToSkills = document.getElementById('goToSkills');
    if (goToSkills) {
        goToSkills.addEventListener('click', () => {
            hideAllViews();
            userHeader.style.display = 'flex';
            bottomNav.style.display = 'flex';
            showSkillForge();
        });
    }

    const goToRewards = document.getElementById('goToRewards');
    if (goToRewards) {
        goToRewards.addEventListener('click', () => {
            hideAllViews();
            userHeader.style.display = 'flex';
            bottomNav.style.display = 'flex';
            showRewards();
        });
    }

    // Skill Forge back button → go to dashboard
    const sfBackBtn = document.getElementById('sfBackBtn');
    if (sfBackBtn) {
        sfBackBtn.addEventListener('click', () => {
            showDashboard();
        });
    }

    // ============================================================
    //  LOGOUT
    // ============================================================
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await fetch('/api/logout', { method: 'POST' });
            } catch (e) { /* ignore */ }
            window.location.href = '/login';
        });
    }

    // ============================================================
    //  TOAST NOTIFICATIONS
    // ============================================================
    function showToast(message, type) {
        type = type || 'info';
        // Remove existing toast
        const existing = document.querySelector('.toast-notification');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast-notification toast-' + type;
        toast.innerHTML = '<span>' + message + '</span>';
        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('toast-show');
        });

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('toast-show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // Make showToast available globally for other scripts
    window.showToast = showToast;

    // ============================================================
    //  CONFETTI BANNER
    // ============================================================
    function showConfettiBanner() {
        const banner = document.getElementById("claimSuccessBanner");
        if (!banner) return;

        banner.style.display = "flex";

        const canvas = document.getElementById("confettiCanvas");
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const pieces = [];
        const colors = ['#fce18a', '#ff726d', '#b48def', '#f4306d', '#4CAF50', '#aadeab', '#8be09b'];

        for (let i = 0; i < 150; i++) {
            pieces.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                w: Math.random() * 10 + 5,
                h: Math.random() * 20 + 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                vy: Math.random() * 6 + 2,
                vx: Math.random() * 4 - 2,
                rot: Math.random() * 360,
                rotSpeed: Math.random() * 5 - 2.5
            });
        }

        let animating = true;

        function render() {
            if (!animating) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let active = false;

            pieces.forEach(p => {
                p.y += p.vy;
                p.x += p.vx;
                p.rot += p.rotSpeed;
                if (p.y < canvas.height) active = true;

                ctx.save();
                ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
                ctx.rotate(p.rot * Math.PI / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            });

            if (active) {
                requestAnimationFrame(render);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }

        render();

        // Hide after 3.5 seconds
        setTimeout(() => {
            banner.style.display = "none";
            animating = false;
        }, 3500);
    }

    // ============================================================
    //  CHATBOT
    // ============================================================
    let chatbotStarted = false;

    function appendMessage(sender, text) {
        const chatContainer = document.getElementById("chatContainer");
        if (!chatContainer) return;
        const msgDiv = document.createElement("div");
        msgDiv.style.maxWidth = "80%";
        msgDiv.style.padding = "10px 15px";
        msgDiv.style.borderRadius = "12px";
        msgDiv.style.lineHeight = "1.4";
        msgDiv.style.wordBreak = "break-word";
        msgDiv.style.marginTop = "10px";

        if (sender === "User") {
            msgDiv.style.alignSelf = "flex-end";
            msgDiv.style.background = "#6fb2ff";
            msgDiv.style.color = "#000";
            // Prevent XSS from user text
            const safeText = document.createElement("div");
            safeText.textContent = text;
            msgDiv.innerHTML = `<strong>You:</strong><br>${safeText.innerHTML}`;
        } else {
            msgDiv.style.alignSelf = "flex-start";
            msgDiv.style.background = "rgba(255,255,255,0.1)";
            msgDiv.style.color = "#fff";

            // Format markdown text to HTML structurally using marked.js
            let parsedText = text;
            if (window.marked && typeof window.marked.parse === 'function') {
                parsedText = window.marked.parse(text);
            } else {
                parsedText = text.replace(/\n/g, '<br>');
            }

            msgDiv.innerHTML = `<strong>Bot:</strong><div class="markdown-wrapper" style="margin-top: 10px;">${parsedText}</div>`;
        }

        chatContainer.appendChild(msgDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    async function sendChatMessage(msg, opts = {}) {
        const chatInput = document.getElementById("chatInput");
        const chatSendBtn = document.getElementById("chatSendBtn");

        if (chatInput) chatInput.disabled = true;
        if (chatSendBtn) chatSendBtn.disabled = true;

        // Add loading indicator
        const loadingId = "loading-" + Date.now();
        const chatContainer = document.getElementById("chatContainer");
        const loadingDiv = document.createElement("div");
        loadingDiv.id = loadingId;
        loadingDiv.style.alignSelf = "flex-start";
        loadingDiv.style.padding = "10px 15px";
        loadingDiv.style.color = "#ccc";
        loadingDiv.textContent = "Bot is typing...";
        chatContainer.appendChild(loadingDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        try {
            const playerName = currentUser ? (currentUser.player_name || currentUser.username) : "Student";
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg, name: playerName })
            });

            let data = null;
            try {
                data = await response.json();
            } catch (e) { }

            // Remove loading indicator
            const loader = document.getElementById(loadingId);
            if (loader) loader.remove();

            if (response.ok) {
                if (data && data.reply) {
                    appendMessage("Bot", data.reply);
                } else {
                    appendMessage("Bot", "Error: I didn't get a proper reply.");
                }
            } else {
                if (data && data.reply) {
                    appendMessage("Bot", data.reply);
                } else {
                    appendMessage("Bot", "Sorry, I encountered an error. Please try again.");
                }
            }
        } catch (error) {
            console.error("Chat error:", error);
            const loader = document.getElementById(loadingId);
            if (loader) loader.remove();
            appendMessage("Bot", "Network error. Please check your connection.");
        } finally {
            if (chatInput) { chatInput.disabled = false; chatInput.focus(); }
            if (chatSendBtn) chatSendBtn.disabled = false;
        }
    }

    function initChatbot() {
        if (!chatbotStarted) {
            chatbotStarted = true;
            const playerName = currentUser ? (currentUser.player_name || currentUser.username) : "Student";
            fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: "start", name: playerName })
            }).then(res => res.text()).then(text => {
                try {
                    const data = JSON.parse(text);
                    if (data.reply) {
                        appendMessage("Bot", data.reply);
                    }
                } catch (e) {
                    appendMessage("Bot", "Error parsing start message JSON.");
                }
            }).catch(e => {
                appendMessage("Bot", "Error connecting to backend: " + e.message);
            });
        }
    }

    const chatSendBtn = document.getElementById("chatSendBtn");
    const chatInput = document.getElementById("chatInput");
    if (chatSendBtn && chatInput) {
        chatSendBtn.addEventListener("click", () => {
            const val = chatInput.value.trim();
            if (val) {
                appendMessage("User", val);
                chatInput.value = "";
                sendChatMessage(val);
            }
        });
        chatInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                chatSendBtn.click();
            }
        });
    }

    // ============================================================
    //  SPEECH RECOGNITION
    // ============================================================
    const chatMicBtn = document.getElementById("chatMicBtn");
    let recognition;
    let isRecording = false;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = function () {
            isRecording = true;
            if (chatMicBtn) {
                chatMicBtn.style.background = "#ff6b6b";
                chatMicBtn.style.color = "#fff";
                chatMicBtn.style.boxShadow = "0 0 15px #ff6b6b";
                chatMicBtn.innerHTML = '<i class="fa-solid fa-microphone-slash" style="font-size: 18px;"></i>';
            }
        };

        function speechLocaleForApp(lang) {
            const map = {
                en: "en-US", hi: "hi-IN", bn: "bn-IN", te: "te-IN", ta: "ta-IN", mr: "mr-IN",
                gu: "gu-IN", kn: "kn-IN", ml: "ml-IN", pa: "pa-IN", ur: "ur-PK", or: "or-IN",
                as: "as-IN", ne: "ne-NP", kok: "kok-IN", mni: "mni-IN", sd: "sd-IN", doi: "doi-IN"
            };
            return map[lang] || "en-US";
        }

        recognition.onresult = function (event) {
            const transcript = (event.results[0][0].transcript || "").trim();
            if (!transcript) {
                resetMicBtn();
                return;
            }
            if (chatInput) chatInput.value = "";
            appendMessage("User", transcript);
            sendChatMessage(transcript, { speechLang: recognition.lang });
        };

        recognition.onerror = function (event) {
            console.error("Speech recognition error", event.error);
            if (event.error !== "no-speech") {
                if (window.showToast) {
                    showToast("Microphone error: " + event.error, "error");
                }
            }
            resetMicBtn();
        };

        recognition.onend = function () {
            resetMicBtn();
        };

        function resetMicBtn() {
            isRecording = false;
            if (chatMicBtn) {
                chatMicBtn.style.background = "#2a2244";
                chatMicBtn.style.color = "#ffd859";
                chatMicBtn.style.boxShadow = "none";
                chatMicBtn.innerHTML = '<i class="fa-solid fa-microphone" style="font-size: 18px;"></i>';
            }
        }

        if (chatMicBtn) {
            chatMicBtn.addEventListener("click", () => {
                if (isRecording) {
                    recognition.stop();
                } else {
                    recognition.lang = speechLocaleForApp(currentLang || "en");
                    try {
                        recognition.start();
                    } catch (e) {
                        console.error('Speech recognition already started');
                    }
                }
            });
        }
    } else {
        if (chatMicBtn) {
            chatMicBtn.style.display = 'none';
        }
    }

    // ============================================================
    //  ARCADE FLOATING PARTICLES
    // ============================================================
    function initArcadeParticles() {
        const canvas = document.getElementById('arcadeParticles');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W, H;
        const particles = [];
        const COLORS = ['rgba(200,162,255,', 'rgba(170,222,171,', 'rgba(255,216,89,', 'rgba(255,169,77,', 'rgba(139,224,155,'];
        const COUNT = 30;

        function resize() {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        for (let i = 0; i < COUNT; i++) {
            particles.push({
                x: Math.random() * W,
                y: Math.random() * H,
                r: Math.random() * 2.5 + 0.5,
                dx: (Math.random() - 0.5) * 0.3,
                dy: (Math.random() - 0.5) * 0.3,
                alpha: Math.random() * 0.4 + 0.1,
                dAlpha: (Math.random() - 0.5) * 0.005,
                color: COLORS[Math.floor(Math.random() * COLORS.length)]
            });
        }

        function draw() {
            ctx.clearRect(0, 0, W, H);
            particles.forEach(p => {
                p.x += p.dx;
                p.y += p.dy;
                p.alpha += p.dAlpha;
                if (p.alpha <= 0.05 || p.alpha >= 0.5) p.dAlpha *= -1;
                if (p.x < 0) p.x = W;
                if (p.x > W) p.x = 0;
                if (p.y < 0) p.y = H;
                if (p.y > H) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color + p.alpha + ')';
                ctx.fill();
            });
            requestAnimationFrame(draw);
        }
        draw();
    }

    // ============================================================
    //  BOOT
    // ============================================================
    init();
    initArcadeParticles();
});
