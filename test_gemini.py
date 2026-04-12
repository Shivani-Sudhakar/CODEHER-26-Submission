import google.generativeai as genai
import traceback

try:
    genai.configure(api_key='AIzaSyD8OV4RHngUVqe79mcdiZYEzNHPLkZqbCo')
    models = genai.list_models()
    with open('api_result.txt', 'w', encoding='utf-8') as f:
        f.write("AVAILABLE MODELS:\n")
        for m in models:
            f.write(f"{m.name}\n")
except Exception as e:
    with open('api_result.txt', 'w', encoding='utf-8') as f:
        f.write("ERROR CAUGHT:\n")
        f.write(traceback.format_exc())
