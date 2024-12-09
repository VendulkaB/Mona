from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# Definice křížovky
CROSSWORD_DATA = {
    "words": {
        1: {"clue": "Vědecký obor zabývající se vesmírem", "answer": "ASTRONOMIE", "row": 1, "col": 4, "direction": "across"},
        2: {"clue": "Starověký egyptský písař", "answer": "FARAON", "row": 3, "col": 4, "direction": "across"},
        3: {"clue": "Primitivní jednobuněčný organismus", "answer": "AMÉBA", "row": 5, "col": 6, "direction": "across"},
        4: {"clue": "Středověký učenec", "answer": "FILOZOF", "row": 7, "col": 4, "direction": "across"},
        5: {"clue": "Mořský živočich s chapadly", "answer": "CHOBOTNICE", "row": 1, "col": 4, "direction": "down"},
        6: {"clue": "Optický přístroj pro pozorování hvězd", "answer": "TELESKOP", "row": 1, "col": 8, "direction": "down"},
        7: {"clue": "Druh pravěkého člověka", "answer": "NEANDRTÁLEC", "row": 2, "col": 6, "direction": "down"}
    },
    "size": 15
}

@app.route('/')
def home():
    return render_template('index.html', crossword=CROSSWORD_DATA)

@app.route('/check', methods=['POST'])
def check_solution():
    user_solution = request.json
    correct = True
    for word_id, word_info in CROSSWORD_DATA["words"].items():
        word_id = str(word_id)
        if word_id not in user_solution or user_solution[word_id] != word_info["answer"]:
            correct = False
            break
    return jsonify({"correct": correct})

if __name__ == '__main__':
    app.run(debug=True)
