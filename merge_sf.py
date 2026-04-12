import json

with open("static/new_trans_sf.json", "r", encoding="utf-8") as f:
    new_data = json.load(f)

js_str = ""
for k, v in new_data.items():
    js_str += f'    "{k}": {json.dumps(v, ensure_ascii=False)},\n'

with open("static/translations.js", "r", encoding="utf-8") as f:
    content = f.read()

start_idx = content.find("const translations = {") + len("const translations = {\n")
new_content = content[:start_idx] + js_str + content[start_idx:]

with open("static/translations.js", "w", encoding="utf-8") as f:
    f.write(new_content)
