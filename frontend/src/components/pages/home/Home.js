import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../home/Home.css'

function Home() {
  const [surveys, setSurveys] = useState([]);
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const [surveyId, setSurveyId] = useState(null);
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
      setSurveyId(surveyId);
    } catch (error) {
      console.error('An error occurred while fetching survey questions:', error);
    }
  };

  const handleResponseChange = (questionId, value) => {
    setResponses({ ...responses, [questionId]: value });
  };

  const saveSurveyResponses = async () => {
    if (!surveyId || Object.keys(responses).length === 0) {
      console.error('Survey ID and responses are required.');
      alert('Survey ID and responses are required.');
      return;
    }

    // Boş soru bırakılıp bırakılmadığını kontrol et
    const allQuestionsAnswered = surveyQuestions.every((question) => responses[question.id]);
    if (!allQuestionsAnswered) {
      alert('Tüm soruları cevaplayın.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/survey-responses', {
        surveyId: surveyId,
        responses: responses,
      });
      console.log(response.data.message);
      alert('Survey responses saved successfully');
    } catch (error) {
      console.error('An error occurred while saving survey responses:', error);
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
            {surveyQuestions.map((question, index) => (
              <div key={index}>
                <h5>Question {index + 1}- {question.question}</h5>
                <ul>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex}>
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={optionIndex}
                        onChange={(e) => handleResponseChange(question.id, e.target.value)}
                      />
                      <label>{option.text}</label>
                    </div>
                  ))}
                </ul>
              </div>
            ))}
            <button className="btn btn-primary" onClick={saveSurveyResponses}>Kaydet</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;