import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../create/Create.css'

function Create() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [optionCount, setOptionCount] = useState(2);
  const [options, setOptions] = useState(Array(optionCount).fill(''));
  const [showQuestions, setShowQuestions] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState('');

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const response = await axios.get('http://localhost:3001/surveys');
      setSurveys(response.data);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const addQuestion = () => {
    if (!newQuestion || options.every((option) => !option.trim()) || options.length < 2) {
      alert("Please fill in the question and at least two options.");
      return;
    }
    const newQ = {
      question: newQuestion,
      options: options.map((text) => ({ text, checked: false }))
    };
    setQuestions([...questions, newQ]);
    setNewQuestion('');
    setOptionCount(2);
    setOptions(Array(2).fill(''));
    setShowQuestions(true);
    setQuestionCount(questionCount + 1);
  };

  const handleOptionChange = (index, text) => {
    const updatedOptions = [...options];
    updatedOptions[index] = text;
    setOptions(updatedOptions);
  };

  const handleCheckboxChange = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].checked = !updatedQuestions[questionIndex].options[optionIndex].checked;
    setQuestions(updatedQuestions);
  };

  const publishQuestions = () => {
    const backendUrl = 'http://localhost:3001/create';
    axios.post(backendUrl, { questions, surveyId: selectedSurvey })
      .then((response) => {
        alert(response.data.message);
      })
      .catch((error) => {
        console.error(error);
        alert('Error publishing questions. Please try again.');
      });
  };

  return (
    <div className="container mt-4 ">
      <div className='row alert alert-success border border-dark'>
        <div className="container col-5">
          <div>
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
            <label> :  Question</label>
            <input
              type="number"
              value={optionCount}
              onChange={(e) => setOptionCount(Math.max(2, parseInt(e.target.value)))}
            />
            <label> :  Number of Options</label>
            {[...Array(Number(optionCount))].map((_, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={options[index]}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
                <label> :  Option {index + 1}</label>
              </div>
            ))}
            <button onClick={addQuestion}>Add Question</button>
            <label>Choose Survey:</label>
            <select value={selectedSurvey} onChange={(e) => setSelectedSurvey(e.target.value)}>
              <option value="">Select a Survey</option>
              {surveys.map((survey) => (
                <option key={survey.id} value={survey.id}>{survey.name}</option>
              ))}
            </select>
            <button onClick={publishQuestions}>Publish</button>
          </div>
        </div>
        <div className="container alert alert-success col-7 mb-0 border border-dark">
          {showQuestions && (
            <div>
              <p>Total Questions: {questionCount}</p>
              {questions.map((q, questionIndex) => (
                <div key={questionIndex}>
                  <p>{questionIndex + 1}- {q.question}</p>
                  <ul>
                    {q.options.map((option, optionIndex) => (
                      <li key={optionIndex}>
                        <input
                          type="checkbox"
                          checked={option.checked}
                          onChange={() => handleCheckboxChange(questionIndex, optionIndex)}
                        />
                        {option.text}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Create;