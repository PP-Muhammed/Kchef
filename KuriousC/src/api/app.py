import json
import os
from flask import Flask, jsonify, request, send_file, send_from_directory
from flask_cors import CORS
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # You can tighten the origins if needed.

# Set the environment variable securely for your API key
os.environ["GOOGLE_API_KEY"] = "AIzaSyDc--m4URrTLyG1oC1cX9wJi191HWnXOy4"

@app.route('/')
def home():
    return send_file('web/index.html')

@app.route("/api/generate", methods=["POST"])
def generate_api():
    if request.method == "POST":
        try:
            req_body = request.get_json()
            content = req_body.get("contents")
            model = ChatGoogleGenerativeAI(model=req_body.get("model"))
            message = HumanMessage(content=content)
            response = model.stream([message])

            def stream():
                for chunk in response:
                    yield 'data: %s\n\n' % json.dumps({"text": chunk.content})

            return stream(), {'Content-Type': 'text/event-stream'}

        except Exception as e:
            return jsonify({"error": str(e)}), 500  # Return status code 500 for errors

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('web', path)

if __name__ == '__main__':
    app.run(debug=True)