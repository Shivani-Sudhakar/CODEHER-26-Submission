from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

print("BOT STARTED SUCCESSFULLY 🚀")

app = Flask(__name__)
CORS(app)

# 🔑 PASTE YOUR API KEY HERE
genai.configure(api_key="AIzaSyAuipEKY5eGOje7TdMVaXzCJ2odXGS33b8")

model = genai.GenerativeModel("gemini-2.5-flash")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    message = data.get("message")

    if not message:
        return jsonify({"reply": "No message received"})

    try:
        response = model.generate_content(message)
        return jsonify({"reply": response.text})
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"reply": "Error", "error": str(e)})

if __name__ == "__main__":
    app.run(debug=True, port=5001)