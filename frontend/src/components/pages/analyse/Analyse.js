import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../analyse/Analyse.css'

function Analyse() {
  const [surveyData, setSurveyData] = useState([]);
  const [surveys, setSurveys] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const surveyResponseResponse = await axios.get('http://localhost:3001/survey-responses');
        setSurveyData(surveyResponseResponse.data);

        const surveyResponseSurveyResponse = await axios.get('http://localhost:3001/surveys');
        const surveyResponseSurveys = surveyResponseSurveyResponse.data.reduce((acc, survey) => {
          acc[survey.id] = survey.name;
          return acc;
        }, {});
        setSurveys(surveyResponseSurveys);
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
    fetchData();
  }, []);

  // survey_id'leri gruplara ayırma işlemi
  const groupedSurveyData = surveyData.reduce((groups, data) => {
    const surveyId = data.survey_id;
    if (!groups[surveyId]) {
      groups[surveyId] = [];
    }
    groups[surveyId].push(data);
    return groups;
  }, {});

  // Her tablodaki aynı soru ve cevaplar için toplam sayıları hesapla
  const calculateTotalCounts = (responses) => {
    const totalCounts = {};
    responses.forEach((response) => {
      const key = `${response.survey_question_id}_${response.response}`;
      totalCounts[key] = (totalCounts[key] || 0) + 1;
    });

    // Soru ID'lerini büyükten küçüğe sırala
    const sortedCounts = Object.entries(totalCounts).sort(([keyA], [keyB]) => {
      const questionIdA = keyA.split('_')[0];
      const questionIdB = keyB.split('_')[0];
      return questionIdB - questionIdA;
    });

    return sortedCounts;
  };

  // Harf dönüşüm fonksiyonu
  const convertToLetter = (num) => {
    return String.fromCharCode(65 + num);
  };

  return (
    <div className="container mt-4">
      {Object.keys(groupedSurveyData).map((surveyId) => (
        <div key={surveyId}>
          <h2>Survey Name: {surveys[surveyId]}</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Survey Question ID</th>
                <th>Response</th>
                <th>Total Count</th>
              </tr>
            </thead>
            <tbody>
              {calculateTotalCounts(groupedSurveyData[surveyId]).map(([key, count], index) => {
                const [questionId, response] = key.split('_');
                return (
                  <tr key={key}>
                    <td>{questionId}</td>
                    <td>{convertToLetter(parseInt(response))}</td>
                    <td>{count}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default Analyse;