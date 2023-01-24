import { useState, useEffect } from "react";
// import { DateGreeting } from "./components/DateGreeting";
import axios from "axios";
import "./App.css";

function App() {
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
  const [selectedCat, setSelectedCat] = useState(null);

  useEffect(() => {
    axios
      .get("https://opentdb.com/api_category.php")
      .then((res) =>
        setCategories(
          res.data.trivia_categories.map((obj) => [obj.id, obj.name])
        )
      );
  }, []);

  const handleClick = () => setSelectedCat(true);

  return (
    <div className="category">
      <ul>
        {categories.map(([catId, catName]) => (
          <li key={catId}>{catName}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
