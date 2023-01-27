import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import he from "he";
import shuffle from "lodash/shuffle";

function App() {
  return (
    <>
      <header>
        <h1 className="Header">Trivia Categories!</h1>
      </header>
      <main>
        <div className="App">
          <ul className="boxes">
            <Category />
          </ul>
        </div>
      </main>
    </>
  );
}

function Category({ id, name }) {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axios
      .get("https://opentdb.com/api_category.php")
      .then((res) =>
        setCategories(
          res.data.trivia_categories.map((obj) => [obj.id, obj.name])
        )
      );
  }, []);

  const [selectedCat, setSelectedCat] = useState("");
  if (selectedCat) {
    return <CatQuestion selectedCat={selectedCat} />;
  }

  return (
    <div>
      <ul>
        {categories.map(([catId, catName]) => (
          <li
            className="category"
            onClick={() => setSelectedCat(catId)}
            key={catId}
          >
            {catName}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CatQuestion({ selectedCat }) {
  const [question, setQuestion] = useState([]);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  useEffect(() => {
    axios
      .get(`https://opentdb.com/api.php?amount=1&category=${selectedCat}`)
      .then((res) => {
        setQuestion(
          res.data.results.map((obj) => ({
            question: he.decode(obj.question),
            correctAnswer: obj.correct_answer,
            answerChoices: shuffle([
              obj.correct_answer,
              ...obj.incorrect_answers,
            ]),
          }))
        );
      });
  }, [selectedCat]);

  if (answer) {
    if (answer === question.correctAnswer) {
      setScore(score + 1);
    }
    return <CatQuestion selectedCat={selectedCat} setScore={setScore} />;
  }

  return (
    <div className="question">
      {question.map((quest) => (
        <div key={selectedCat}>
          <h1>{quest.question}</h1>
          <ul className="answers" key={quest}>
            {quest.answerChoices.map((a) => (
              <li
                className="answer-choices"
                onClick={() => setAnswer(he.decode(a))}
                key={a}
              >
                {he.decode(a)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;
