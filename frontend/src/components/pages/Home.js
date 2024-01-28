import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [surveys, setSurveys] = useState([]);
  const [surveyQuestions, setSurveyQuestions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:3001/surveys');
        setSurveys(response.data);
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
    fetchData();
  }, []);

  const handleSurveyClick = async (surveyId) => {
    try {
      const response = await axios.get(`http://localhost:3001/questions?surveyId=${surveyId}`);
      setSurveyQuestions(response.data);
    } catch (error) {
      console.error('An error occurred while fetching survey questions:', error);
    }
  };

  return (
    <div className="container mt-4">
      {surveys.map((survey) => (
        <div className="card" key={survey.id}>
          <div className="card-body">
            <h5 className="card-title">Survey No: {survey.id}</h5>
            <p className="card-text">Survey Name: {survey.name}</p>
            <p className="card-text">{survey.explanation}</p>
            <button className="btn btn-primary" onClick={() => handleSurveyClick(survey.id)}>Go Survey</button>
          </div>
        </div>
      ))}
      <div className="mt-4">
        <h2>Survey Questions</h2>
        {surveyQuestions.map((question, index) => (
          <div key={index}>
            <h3>Question {index + 1}</h3>
            <p>{question.question}</p>
            <ul>
              {question.options.map((option, optionIndex) => (
                <li key={optionIndex}>{option.text}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;