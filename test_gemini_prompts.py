import google.generativeai as genai
import traceback

try:
    genai.configure(api_key='AIzaSyD8OV4RHngUVqe79mcdiZYEzNHPLkZqbCo')
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    with open('test_out.txt', 'w', encoding='utf-8') as f:
        try:
            f.write("Test 1 (hi)...\n")
            response = model.generate_content("hi")
            f.write("Success: " + response.text[:50] + "\n")
        except Exception as e:
            f.write("[Error on hi]: " + str(e) + "\n")
            
        try:
            f.write("Test 2 (what is your purpose)...\n")
            response = model.generate_content("what is your purpose")
            f.write("Success: " + response.text[:50] + "\n")
        except Exception as e:
            f.write("[Error on purpose]: " + str(e) + "\n")

        try:
            f.write("Test 3 (i am interested in maths)...\n")
            response = model.generate_content("i am interested in maths")
            f.write("Success: " + response.text[:50] + "\n")
        except Exception as e:
            f.write("[Error on maths]: " + str(e) + "\n")
except Exception as e:
    with open('test_out.txt', 'w', encoding='utf-8') as f:
        f.write("Global error:\n")
        f.write(traceback.format_exc())
