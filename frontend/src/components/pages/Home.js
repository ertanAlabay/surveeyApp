import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [surveys, setSurveys] = useState([]);
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const [responses, setResponses] = useState({});

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
      // Reset responses when a new survey is clicked
      setResponses({});
    } catch (error) {
      console.error('An error occurred while fetching survey questions:', error);
    }
  };

  const handleResponseChange = (questionId, value) => {
    setResponses({ ...responses, [questionId]: value });
  };

  const handleSaveResponse = async () => {
    try {
      // Send responses to the server to save them in the database
      const response = await axios.post('http://localhost:3001/survey-responses', { responses });
      console.log(response.data); // Log the response from the server
      // Optionally, you can show a success message or redirect the user after saving responses
    } catch (error) {
      console.error('An error occurred while saving survey responses:', error);
      // Optionally, you can show an error message to the user
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-sm-6">
          {surveys.map((survey) => (
            <div className="card" key={survey.id}>
              <div className="card-body">
                <h5 className="card-title">Survey No: {survey.id}</h5>
                <p className="card-text">Survey Name: {survey.name}</p>
                <p className="card-text">{survey.explanation}</p>
                <button className="btn btn-primary" onClick={() => handleSurveyClick(survey.id)}>Anket {survey.id}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <h2>Survey Questions</h2>
        {surveyQuestions.length === 0 ? (
          <p>Bu ankette soru bulunmamaktadır.</p>
        ) : (
          <div>
            {surveyQuestions.map((question) => (
              <div key={question.id}>
                <h3>{question.question}</h3>
                {question.options.map((option) => (
                  <div key={option.id}>
                    <label>
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.text}
                        onChange={() => handleResponseChange(question.id, option.text)}
                        checked={responses[question.id] === option.text}
                      />
                      {option.text}
                    </label>
                  </div>
                ))}
              </div>
            ))}
            <button className="btn btn-primary mt-3" onClick={handleSaveResponse}>Kaydet</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;