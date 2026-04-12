import urllib.request
import urllib.parse
import json
import time

strings_list = [
    ("tech_engineer", "Tech Engineer"),
    ("medical_doc", "Medical Doctor"),
    ("lawyer", "Lawyer"),
    ("business_ldr", "Business Leader"),
    ("tech_desc", "Software Engineering, Data Science, AI & Cybersecurity"),
    ("med_desc", "Medicine, Nursing, Dentistry, Pharmacy & Research"),
    ("law_desc", "Corporate Law, Criminal Law, Civil Rights & Policy"),
    ("bus_desc", "Entrepreneurship, Finance, Marketing & Management"),
    ("tech_zone", "Tech Citadel"),
    ("med_zone", "Healer's Sanctum"),
    ("law_zone", "Justice Fortress"),
    ("bus_zone", "Gold Bazaar"),
    ("hero_tech", "Code Mage"),
    ("hero_med", "Healer Ranger"),
    ("hero_law", "Justice Knight"),
    ("hero_bus", "Gold Merchant"),
    
    # Skills
    ("sk_prog", "Programming"),
    ("sk_math", "Mathematics"),
    ("sk_logic", "Logic & Algorithms"),
    ("sk_logic_res", "Logical Reasoning"),
    ("sk_physics", "Physics"),
    ("sk_english", "English"),
    ("sk_cs", "Computer Science"),
    ("sk_prob", "Problem Solving"),
    ("sk_comms", "Communication"),
    ("sk_bio", "Biology"),
    ("sk_chem", "Chemistry"),
    ("sk_anat", "Anatomy"),
    ("sk_empathy", "Empathy & Bedside Manner"),
    ("sk_res", "Research Skills"),
    ("sk_crit", "Critical Thinking"),
    ("sk_eng_writ", "English & Writing"),
    ("sk_leg_res", "Legal Research"),
    ("sk_pub_speak", "Public Speaking"),
    ("sk_hist", "History & Civics"),
    ("sk_gk", "General Knowledge"),
    ("sk_fin", "Financial Literacy"),
    ("sk_market", "Marketing"),
    ("sk_lead", "Leadership"),
    ("sk_create", "Creativity"),
    ("sk_neg", "Negotiation"),
    ("sk_digi", "Digital Literacy"),

    # Boss
    ("boss_jee", "JEE Boss"),
    ("boss_neet", "NEET Boss"),
    ("boss_clat", "CLAT Boss"),
    ("boss_cat", "CAT Boss"),
    ("badge_code", "Code Master badge"),
    ("badge_heal", "Healer Master badge"),
    ("badge_just", "Justice Master badge"),
    ("badge_bus", "Business Master badge"),
    ("chest_legend", "Legendary chest"),

    # UI Assess
    ("lvl_none", "No experience"),
    ("lvl_some", "Some knowledge"),
    ("lvl_conf", "Confident"),
    ("tap_rate", "Tap to rate"),
    ("rated_word", "rated"),
    ("strong_lc", "strong"),
    ("learning_lc", "learning"),
    ("gaps_lc", "gaps"),
    
    # Radar
    ("gap_strong", "Strong"),
    ("gap_good", "Good"),
    ("gap_needs", "Needs Work"),
    ("gap_crit", "Critical"),
    ("lbl_you", "You"),
    ("lbl_need", "Need"),

    # Courses
    ("crit_gap", "CRITICAL GAP"),
    ("improve", "IMPROVE"),
    ("free_course", "FREE"),
    ("off_course", "Official course"),
    ("visit_course", "Visit Course ↗"),

    # Quests
    ("all_mastered", "All skills mastered! You are ready for the boss battle!"),
    ("q_conquer", "Conquer"),
    ("q_start_zero", "Start from zero and build a solid foundation in"),
    ("q_powerup", "Power-Up"),
    ("q_levelup_int", "Level up your intermediate skills in"),
    ("q_complete_pra", "Complete a course and practice exercises."),
    ("q_badge", "badge"),
    ("btn_fight", "Fight"),
    ("btn_start", "Start"),
    ("btn_done", "Done"),
    ("keep_train", "Keep training! You can retry anytime."),
    ("lvl_up_now", "LEVEL UP! Now Level"),
    ("earned_excl", "earned!"),

    # Boss Banner
    ("boss_unlocked", "Boss Battle UNLOCKED! Face the"),
    ("boss_master_all", "You've mastered all skills. Defeat the"),
    ("boss_unlock_next", "boss to unlock the next career zone!"),
    ("boss_complete_all", "Complete all quests → unlock the"),
    ("boss_battle_word", "Battle"),
    ("boss_finish_all", "Finish all skill quests to face the"),
    ("boss_earn_rew", "boss and earn these rewards:")
]

langs = ["hi", "bn", "te", "mr", "ta", "ur", "gu", "kn", "or", "ml", "pa", "as", "mai", "sat", "ks", "ne", "sd", "doi", "kok", "mni"]
lang_map = {"mni": "mni-Mtei"}

results = {k: {"en": v} for k, v in strings_list}
texts = [v for k, v in strings_list]

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
        if len(segments) != len(texts):
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
            time.sleep(0.1)
    else:
        for i, (k, v) in enumerate(strings_list):
            results[k][lang] = trans[i]
    time.sleep(0.5)

with open("static/new_trans_sf.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=4)
print("Done!")
