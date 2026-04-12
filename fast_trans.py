import urllib.request
import urllib.parse
import json
import time

strings_list = [
    # Dashboard
    ("streak_msg", "Keep playing daily to grow your streak"),
    ("stat_level", "Level"),
    ("stat_xp", "XP"),
    ("stat_coins", "Coins"),
    ("welcome_back", "Welcome back,"),
    ("continue_quest", "Continue your career quest and level up your skills."),
    ("quick_actions", "Quick Actions"),
    ("sf_title", "Skill Forge"),
    ("sf_desc", "Train & level up your skills"),
    ("ls_title", "Loot Shop"),
    ("ls_desc", "Spend coins on real rewards"),
    ("your_skills", "Your Skills"),
    ("tip_title", "Tip of the Day"),
    ("no_skills", "No skills selected yet"),
    ("day_streak_lbl", "Day Streak!"),

    # Rewards
    ("reward_main", "REWARD"),
    ("reward_sub", "Real-world loot shop — earn coins, get real rewards"),
    ("my_coins", "My Coins:"),
    ("reward_locked", "Locked"),
    ("coins_needed", "coins needed"),
    ("claimable", "CLAIMABLE"),
    ("claim_btn", "CLAIM"),
    ("level_up_btn", "LEVEL UP"),
    ("data_pack", "1GB Data Pack"),
    ("course_voucher", "Udemy Course Voucher"),
    ("coding_workshop", "Coding Workshop Access"),
    ("mentorship", "30-min Mentorship Session"),
    ("gift_card", "$10 Gift Card"),
    ("stat_kit", "Stationery Kit"),
    ("mystery_chest", "Mystery Chest"),
    ("random_drop", "Random drop on level-up"),
    ("sponsor_1", "Powered by: Jio - BSNL - Airtel"),
    ("sponsor_2", "Sponsored by: Vedantu - NIIT - Skill India"),
    ("sponsor_3", "Presented by Tech Guild"),
    ("sponsor_4", "Supported by Top Founders Network"),
    ("sponsor_5", "Sponsored by Infosys Foundation"),
    ("sponsor_6", "Sponsored by Tata CSR"),
    ("hooray_won", "HOORAY You won a reward"),

    # Skill Forge
    ("sf_subtitle", "Choose your career path"),
    ("step_path", "Path"),
    ("step_assess", "Assess"),
    ("step_results", "Results"),
    ("step_courses", "Courses"),
    ("step_quests", "Quests"),
    ("step1_title", "Step 1 — Choose your career path"),
    ("step1_desc", "Pick the career zone that excites you. This decides what skills you need."),
    ("step2_title", "Step 2 — Skill Assessment"),
    ("step2_desc", "Rate your proficiency in each required skill. Be honest!"),
    ("xp_scan", "+50 XP for scanning"),
    ("analyze_btn", "Analyze My Skills"),
    ("step3_title", "Step 3 — Skill Gap Radar"),
    ("step3_desc", "Purple = your level. Red dashed = what's needed. Close the gap!"),
    ("radar_label", "SKILL RADAR"),
    ("your_skills_leg", "Your skills"),
    ("target_leg", "Target"),
    ("readiness", "Career readiness score"),
    ("hint_boss", "Complete all quests — reach 100% → unlock boss battle"),
    ("step4_title", "Step 4 — Recommended Courses"),
    ("step4_desc", "These free courses close your exact skill gaps. Click to visit the official website."),
    ("enrol_xp", "Enrol = earn XP"),
    ("step5_title", "Step 5 — Skill Quests"),
    ("step5_desc", "Complete these quests to power up and close your skill gaps."),
    ("sf_home", "Home"),
    
    # Tips
    ("tip_1", "Complete daily quests to earn bonus XP and coins!"),
    ("tip_2", "Maintaining a streak multiplies your XP gains!"),
    ("tip_3", "Visit the Skill Forge to discover career skill gaps."),
    ("tip_4", "The Loot Shop has real rewards — earn coins to unlock them!"),
    ("tip_5", "Try switching languages to learn career terms in your native tongue."),
    ("tip_6", "Consistency beats intensity — play a little every day."),
    ("tip_7", "Enrol in free courses from the Skill Forge to boost your career readiness!"),
    ("tip_8", "Your skill radar shows exactly what you need for your career path."),
    ("tip_9", "Every quest completed brings you closer to the boss battle!"),
    ("tip_10", "Check back daily — quests refresh every week!")
]

langs = ["hi", "bn", "te", "mr", "ta", "ur", "gu", "kn", "or", "ml", "pa", "as", "mai", "sat", "ks", "ne", "sd", "doi", "kok", "mni"]
lang_map = {"mni": "mni-Mtei"}

results = {k: {"en": v} for k, v in strings_list}
texts = [v for k, v in strings_list]

def bulk_translate(texts, target_lang):
    try:
        tl = lang_map.get(target_lang, target_lang)
        qs = "&".join(["q=" + urllib.parse.quote(t) for t in texts])
        url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl={tl}&dt=t&{qs}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req, timeout=15)
        raw_data = json.loads(res.read().decode('utf-8'))
        
        # Google Translate returns a list of fragments. We need to split them by the exact number of queries
        # Actually Google groups them generally in raw_data[0][i][0] but it can be fragmented.
        # However, passing multiple 'q' returns them segmented by the original q.
        # We can iterate through the original lines. Actually, wait. 'translate_a/single' with multiple 'q' is unreliable.
        # Let's join by a delimiter instead!
        pass
    except Exception:
        pass
    return None

def bulk_translate_delimiter(texts, target_lang):
    delim = " ||| "
    big_text = delim.join(texts)
    try:
        tl = lang_map.get(target_lang, target_lang)
        url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=" + tl + "&dt=t&q=" + urllib.parse.quote(big_text)
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req, timeout=15)
        raw_data = json.loads(res.read().decode('utf-8'))
        
        translated_full = "".join([d[0] for d in raw_data[0] if d[0]])
        segments = [s.strip() for s in translated_full.split("|||")]
        
        # fallback if count mismatch
        if len(segments) != len(texts):
            # Attempt parsing with space variations
            segments = [s.strip() for s in translated_full.split("||")]
            if len(segments) != len(texts):
                return []
        return segments
    except Exception as e:
        return []

for lang in langs:
    print(f"Translating {lang}...")
    trans = bulk_translate_delimiter(texts, lang)
    if not trans or len(trans) != len(texts):
        # fallback to single translation, but parallelize via simple sequential
        print(f"Fallback for {lang}")
        for i, (k, v) in enumerate(strings_list):
            try:
                tl = lang_map.get(lang, lang)
                url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl={tl}&dt=t&q=" + urllib.parse.quote(v)
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                res = urllib.request.urlopen(req, timeout=3)
                data = json.loads(res.read().decode('utf-8'))
                results[k][lang] = "".join([d[0] for d in data[0] if d[0]])
            except:
                results[k][lang] = v
    else:
        for i, (k, v) in enumerate(strings_list):
            results[k][lang] = trans[i]
    time.sleep(0.5)

import re
# Read current translations.js
with open("static/translations.js", "r", encoding="utf-8") as f:
    js_content = f.read()

# Generate new JSON
new_json = json.dumps(results, ensure_ascii=False, indent=4)

# Replace the existing `const translations = { ... };` with updated one
# First, insert new_json keys into the existing translations object.
# Alternatively, just inject them dynamically in JS.
# Let's save to a side file, and then we'll update JS.
with open("static/new_trans.json", "w", encoding="utf-8") as f:
    f.write(new_json)

print("Done!")
