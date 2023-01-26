import { useState, useEffect } from "react";
// import { DateGreeting } from "./components/DateGreeting";
import axios from "axios";
import "./App.css";

function App() {
  // const [selectedCat, setSelectedCat] = useState("");
  // if (selectedCat) {
  //   // catId={selectedCat.id}
  //   return <CatQuestion />;
  // }

  return (
    <>
      <header>
        <h1 className="Header">Trivia Categories!</h1>
      </header>
      <main>
        <div className="App">
          <Category />
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
    // console.log(selectedCat);
    return <CatQuestion selectedCat={selectedCat} />;
  }

  return (
    <div className="category">
      <ul>
        {categories.map(([catId, catName]) => (
          <li onClick={() => setSelectedCat(catId)} key={catId}>
            {catName}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CatQuestion({ selectedCat }) {
  const [question, setQuestion] = useState([]);
  const incorrect_answers = question.incorrect_answers;
  const correct_answer = question.correct_answer;
  const newAnswersList = [(incorrect_answers, correct_answer)];
  useEffect(() => {
    axios
      .get(`https://opentdb.com/api.php?amount=1&category=${selectedCat}`)
      .then((res) => {
        setQuestion(res.data.results);
      });
  }, [selectedCat]);

  return (
    <div className="question">
      {question.map((quest) => (
        <div key={selectedCat}>
          <h1>
            {quest.question
              .replace("&quot;", '"')
              .replace("&quot;", '"')
              .replace("&#039;", "'")}
          </h1>
          <ul>
            <li>{console.log(newAnswersList)}</li>
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;
