import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import he from "he";
import shuffle from "lodash/shuffle";

function App() {
  return (
    <>
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
  const [score, setScore] = useState(0);
  const updateScore = (amount) => {
    setScore(score + amount);
  };
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
    return (
      <>
        <CatQuestion
          selectedCat={selectedCat}
          changeScore={updateScore}
          setSelectedCat={setSelectedCat}
        />
        <div>
          <p></p>
          <h2>Score = {score}</h2>
        </div>
      </>
    );
  }

  return (
    <div>
      <header>
        <h1 className="Header">Trivia Categories!</h1>
      </header>
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

function CatQuestion({ selectedCat, changeScore, setSelectedCat }) {
  const [question, setQuestion] = useState([]);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    axios
      .get(`https://opentdb.com/api.php?amount=10&category=${selectedCat}`)
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

  return (
    question.length > 0 && (
      <Question
        question={question}
        index={index}
        setIndex={setIndex}
        setSelectedCat={setSelectedCat}
        changeScore={changeScore}
      />
    )
  );
}

function Question({ question, index, setIndex, setSelectedCat, changeScore }) {
  const [answer, setAnswer] = useState("");
  function handleClick() {
    if (he.decode(answer) === question[index].correctAnswer) {
      changeScore(1);
      console.log("Success!");
    }
    setIndex(index + 1);
  }
  if (question && index > question.length - 1) {
    return (
      <FinalPage setSelectedCat={setSelectedCat} changeScore={changeScore} />
    );
  }
  return (
    <div className="question">
      <div key={index}>
        <h1>{question[index].question}</h1>
        <ul className="answers" key={question}>
          {question[index].answerChoices.map((a) => (
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
      <p>
        <button onClick={() => handleClick()}>Submit</button>
      </p>
    </div>
  );
}

function FinalPage({ index, question, setSelectedCat }) {
  return (
    <div>
      <h1>Quiz Complete!</h1>
      <button onClick={() => setSelectedCat(null)}>Restart Game</button>
    </div>
  );
}

export default App;
