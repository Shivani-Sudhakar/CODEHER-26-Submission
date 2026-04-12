import os

games = [
    ('symptom_sort.html', 'Symptom Sort', 'Diagnose patient symptoms to save lives!'),
    ('body_systems_battle.html', 'Body Systems Battle', 'Defend the immune system against viral waves!'),
    ('panchayat_puzzle.html', 'Panchayat Puzzle', 'Solve local disputes and build community wealth.'),
    ('courtroom_drama.html', 'Courtroom Drama', 'Present facts, object to lies, win the case!'),
    ('debate_duel.html', 'Debate Duel', 'Use logical fallacies against your opponent!'),
    ('soil_wars.html', 'Soil Wars', 'Maintain pH levels against acid rain!'),
    ('drone_farming.html', 'Drone Farming', 'Hack your drones to maximize crop yield!'),
    ('stock_market.html', 'Stock Market', 'Buy low, sell high, watch out for crashes!'),
    ('startup_pitch.html', 'Startup Pitch', 'Convince the VC bosses with your metrics!'),
    ('budget_rpg.html', 'Budget RPG', 'Defeat the Debt monster using compound interest!')
]

template = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} — Career Quest</title>
<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700;800&family=Fira+Code:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root {{
  --bg: #060410;
  --bg2: #0c0818;
  --panel: #120d20;
  --border: #2d2245;
  --txt: #e8e2f0;
  --dim: #7a6d94;
  --purple: #c8a2ff;
  --green: #5cff8a;
  --gold: #ffd859;
  --font: 'Chakra Petch', sans-serif;
}}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{ font-family: var(--font); background: var(--bg); color: var(--txt); min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; }}
.bg-grid {{ position: absolute; inset: 0; pointer-events: none; z-index: 0; background-image: linear-gradient(rgba(200,162,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,162,255,.03) 1px, transparent 1px); background-size: 35px 35px; }}
.card {{ background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 40px; text-align: center; max-width: 400px; width: 90%; z-index: 10; position: relative; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }}
.icon {{ font-size: 64px; margin-bottom: 20px; animation: float 3s ease-in-out infinite; }}
@keyframes float {{ 0%, 100% {{ transform: translateY(0); }} 50% {{ transform: translateY(-10px); }} }}
h1 {{ font-size: 28px; margin-bottom: 10px; color: var(--purple); text-transform: uppercase; letter-spacing: 2px; }}
p {{ font-size: 14px; color: var(--dim); margin-bottom: 30px; line-height: 1.5; }}
.btn-group {{ display: flex; flex-direction: column; gap: 10px; }}
.btn {{ background: linear-gradient(135deg, var(--green), #3adf6f); color: #0a1a0f; border: none; padding: 14px 20px; border-radius: 12px; font-family: var(--font); font-size: 16px; font-weight: 700; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; transition: all 0.3s; }}
.btn:hover {{ transform: translateY(-2px); box-shadow: 0 6px 20px rgba(92,255,138,.2); }}
.btn.claim {{ background: transparent; border: 1px solid var(--gold); color: var(--gold); }}
.btn.claim:hover {{ background: rgba(255,216,89,.1); box-shadow: 0 6px 20px rgba(255,216,89,.2); }}
.stats {{ display: none; gap: 15px; justify-content: center; margin-top: 20px; font-weight: 700; }}
.stats.show {{ display: flex; }}
.stat.xp {{ color: var(--green); }}
.stat.coins {{ color: var(--gold); }}
</style>
</head>
<body>
<div class="bg-grid"></div>
<div class="card">
  <div class="icon">🎮</div>
  <h1>{title}</h1>
  <p>{desc}</p>
  
  <div class="btn-group" id="playGroup">
    <button class="btn" onclick="playSim()">Play Simulator</button>
  </div>
  
  <div class="stats" id="stats">
    <div class="stat xp">+250 XP</div>
    <div class="stat coins">+150 Coins</div>
  </div>
  
  <div class="btn-group" id="endGroup" style="display:none; margin-top:20px;">
    <button class="btn claim" onclick="endGame()">Claim Rewards & Exit</button>
  </div>
</div>

<script>
function playSim() {{
  document.getElementById('playGroup').style.display = 'none';
  document.querySelector('h1').textContent = 'VICTORY!';
  document.querySelector('p').textContent = 'You successfully completed the module.';
  document.getElementById('stats').classList.add('show');
  document.getElementById('endGroup').style.display = 'flex';
  
  if(window.parent && window.parent.currentUser) {{
    fetch('/api/save-gamestate', {{
      method: 'POST',
      headers: {{'Content-Type': 'application/json'}},
      body: JSON.stringify({{ xp: 250, coins: 150 }})
    }}).catch(e => console.log(e));
  }}
}}

function endGame() {{
  if(window.parent && window.parent.closeGame) {{
    window.parent.closeGame(true);
  }} else {{
    window.location.href = '/home';
  }}
}}
</script>
</body>
</html>"""

for file_name, title, desc in games:
    path = os.path.join(r'C:\Users\ADMIN\Downloads\CODEHER-26-master\CODEHER-26-master\static\games', file_name)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(template.format(title=title, desc=desc))
    print(f"Created {file_name}")
