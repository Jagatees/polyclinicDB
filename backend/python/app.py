from flask import Flask, jsonify
app = Flask(__name__)

@app.route('/api/test')
def home():
    return jsonify({"message": "Hello, Flask!"})  # Return JSON instead of plain text




if __name__ == '__main__':
    app.run(debug=True)
