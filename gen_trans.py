import urllib.request
import urllib.parse
import json
import time

strings_to_add = {
    # Dashboard
    "streak_msg": "Keep playing daily to grow your streak",
    "stat_level": "Level",
    "stat_xp": "XP",
    "stat_coins": "Coins",
    "welcome_back": "Welcome back,",
    "continue_quest": "Continue your career quest and level up your skills.",
    "quick_actions": "Quick Actions",
    "sf_title": "Skill Forge",
    "sf_desc": "Train & level up your skills",
    "ls_title": "Loot Shop",
    "ls_desc": "Spend coins on real rewards",
    "your_skills": "Your Skills",
    "tip_title": "Tip of the Day",
    "no_skills": "No skills selected yet",
    "day_streak_lbl": "Day Streak!",

    # Rewards
    "reward_main": "REWARD",
    "reward_sub": "Real-world loot shop — earn coins, get real rewards",
    "my_coins": "My Coins:",
    "reward_locked": "Locked",
    "coins_needed": "coins needed",
    "claimable": "CLAIMABLE",
    "claim_btn": "CLAIM",
    "level_up_btn": "LEVEL UP",
    "data_pack": "1GB Data Pack",
    "course_voucher": "Udemy Course Voucher",
    "coding_workshop": "Coding Workshop Access",
    "mentorship": "30-min Mentorship Session",
    "gift_card": "$10 Gift Card",
    "stat_kit": "Stationery Kit",
    "mystery_chest": "Mystery Chest",
    "random_drop": "Random drop on level-up",
    "sponsor_1": "Powered by: Jio - BSNL - Airtel",
    "sponsor_2": "Sponsored by: Vedantu - NIIT - Skill India",
    "sponsor_3": "Presented by Tech Guild",
    "sponsor_4": "Supported by Top Founders Network",
    "sponsor_5": "Sponsored by Infosys Foundation",
    "sponsor_6": "Sponsored by Tata CSR",
    "hooray_won": "HOORAY You won a reward",

    # Skill Forge
    "sf_subtitle": "Choose your career path",
    "step_path": "Path",
    "step_assess": "Assess",
    "step_results": "Results",
    "step_courses": "Courses",
    "step_quests": "Quests",
    "step1_title": "Step 1 — Choose your career path",
    "step1_desc": "Pick the career zone that excites you. This decides what skills you need.",
    "step2_title": "Step 2 — Skill Assessment",
    "step2_desc": "Rate your proficiency in each required skill. Be honest!",
    "xp_scan": "+50 XP for scanning",
    "analyze_btn": "Analyze My Skills",
    "step3_title": "Step 3 — Skill Gap Radar",
    "step3_desc": "Purple = your level. Red dashed = what's needed. Close the gap!",
    "radar_label": "SKILL RADAR",
    "your_skills_leg": "Your skills",
    "target_leg": "Target",
    "readiness": "Career readiness score",
    "hint_boss": "Complete all quests — reach 100% → unlock boss battle",
    "step4_title": "Step 4 — Recommended Courses",
    "step4_desc": "These free courses close your exact skill gaps. Click to visit the official website.",
    "enrol_xp": "Enrol = earn XP",
    "step5_title": "Step 5 — Skill Quests",
    "step5_desc": "Complete these quests to power up and close your skill gaps.",
    "sf_home": "Home",

    # Tips
    "tip_1": "Complete daily quests to earn bonus XP and coins!",
    "tip_2": "Maintaining a streak multiplies your XP gains!",
    "tip_3": "Visit the Skill Forge to discover career skill gaps.",
    "tip_4": "The Loot Shop has real rewards — earn coins to unlock them!",
    "tip_5": "Try switching languages to learn career terms in your native tongue.",
    "tip_6": "Consistency beats intensity — play a little every day.",
    "tip_7": "Enrol in free courses from the Skill Forge to boost your career readiness!",
    "tip_8": "Your skill radar shows exactly what you need for your career path.",
    "tip_9": "Every quest completed brings you closer to the boss battle!",
    "tip_10": "Check back daily — quests refresh every week!"
}

langs = ["hi", "bn", "te", "mr", "ta", "ur", "gu", "kn", "or", "ml", "pa", "as", "mai", "sat", "ks", "ne", "sd", "doi", "kok", "mni"]
# Fallbacks for gtranslate if some codes aren't directly matched
lang_map = {
    "mni": "mni-Mtei", # Manipuri
}

results = {}

def translate_batch(texts, target_lang):
    try:
        qs = "&".join(["q=" + urllib.parse.quote(t) for t in texts])
        tl = lang_map.get(target_lang, target_lang)
        url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl={tl}&dt=t&{qs}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req, timeout=10)
        data = json.loads(res.read().decode('utf-8'))
        # data[0] contains translated segments for each query
        # Since we use multiple q=, data[0] will be a list of lists, but wait! Google Translate single API handles multiple q= by returning them in order.
        # Format might be slightly tricky. Let's just do it one by one if batching is tricky. No, batching should work.
        # Actually `q=hello&q=world` doesn't always work cleanly with `translate_a/single`.
        return None
    except Exception as e:
        return None

# Single translation is safer
def translate_single(text, target_lang):
    try:
        tl = lang_map.get(target_lang, target_lang)
        url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl={tl}&dt=t&q=" + urllib.parse.quote(text)
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req, timeout=5)
        data = json.loads(res.read().decode('utf-8'))
        return "".join([d[0] for d in data[0] if d[0]])
    except Exception as e:
        return text # fallback to english

for key, text in strings_to_add.items():
    results[key] = {"en": text}

count = 0
for lang in langs:
    print(f"Translating for {lang}...")
    for key, text in strings_to_add.items():
        results[key][lang] = translate_single(text, lang)
        count += 1
        if count % 20 == 0:
            time.sleep(1) # throttle just a bit

with open("new_translations.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Done generating new_translations.json")
