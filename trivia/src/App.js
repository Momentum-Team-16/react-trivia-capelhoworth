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
        <CatQuestion selectedCat={selectedCat} changeScore={updateScore} />
        <div>
          <p></p>
          <p>Score = {score}</p>
          {/* <Score currentScore={score} /> */}
        </div>
      </>
    );
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

function CatQuestion({ selectedCat, changeScore }) {
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
      <Question question={question} index={index} setIndex={setIndex} />
    )
  );
}

function Question({ question, index, setIndex }) {
  function handleClick() {
    setIndex(index + 1);
  }
  const [answer, setAnswer] = useState("");
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

// function submitButton {
//   console.log(question[0].correctAnswer);
//   if (answer === question[0].correctAnswer) {
//     changeScore(1);
//     return <CatQuestion selectedCat={selectedCat} changeScore={changeScore} />;
//   }
// }

// const Score = ({ currentScore }) => {
//   return <div> Score = {currentScore}</div>;
// };

export default App;
