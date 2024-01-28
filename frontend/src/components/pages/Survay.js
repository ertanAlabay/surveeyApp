import React, { useState, useEffect } from 'react'
import axios from 'axios';

function Survay() {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    const backendUrl = 'http://localhost:3001/questions';

    axios.get(backendUrl)
      .then((response) => {
        setQuestions(response.data);
      })
      .catch((error) => {
        console.error('Error fetching questions:', error);
        setError('Error fetching questions. Please try again.');
      });
  };
/*
<div className="container mt-4">
      <h2>Questions</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <ul>
        {questions.map((question, index) => (
          <li key={index}>
            <h3>{question.question}</h3>
            <ul>
              {question.options.map((option, optionIndex) => (
                <li key={optionIndex}>{option.text}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
    */
  return (
    <div className="container mt-4">
      <h2>Questions</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <ul>
        {questions.map((question, index) => (
          <li key={index}>
            <h3>{question.question}</h3>
            <ul>
              {Array.isArray(question.options) && question.options.map((option, optionIndex) => (
                <li key={optionIndex}>{option.text}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Survay