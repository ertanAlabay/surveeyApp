/**
 * Ertan Osman ALABAY - 30.01.2024
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../analyse/Analyse.css'

/**
 * Kullanıcıların çözdüğü anket cevapları ayrı ayrı tablolarda gösterir.
 * Tablolarda: Tablo ismi, Soru İdsi(sorunun ismini yazdıramadım), 
 *  cevabı ve soruya verilen toplam cevap sayısını gösterir.
 */

function Analyse() {

  const [surveyData, setSurveyData] = useState([]);
  const [surveys, setSurveys] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {

        //survey_responses tablosundaki değerleri alır.
        const surveyResponseResponse = await axios.get('http://localhost:3001/survey-responses');
        setSurveyData(surveyResponseResponse.data);

        //surveys tablosundaki değerleri alır.
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

  // survey_id'lere göre soruları gruplara ayırma işlemi yapar.
  const groupedSurveyData = surveyData.reduce((groups, data) => {
    const surveyId = data.survey_id;
    if (!groups[surveyId]) {
      groups[surveyId] = [];
    }
    groups[surveyId].push(data);
    return groups;
  }, {});

  // Her tablodaki aynı soru ve cevaplar için toplam sayıları hesaplar.
  const calculateTotalCounts = (responses) => {
    const totalCounts = {};
    responses.forEach((response) => {
      const key = `${response.survey_question_id}_${response.response}`;
      totalCounts[key] = (totalCounts[key] || 0) + 1;
    });

    // questionId'lerini tabloda sıralı şekilde gösteriyyor.
    const sortedCounts = Object.entries(totalCounts).sort(([keyA], [keyB]) => {
      const questionIdA = keyA.split('_')[0];
      const questionIdB = keyB.split('_')[0];
      return questionIdB - questionIdA;
    });

    return sortedCounts;
  };

  // questionId'leri db'den index sayısı olarak alıyorum. 
  //Burada da bu sayıları harflere dönüştürüyorum.
  const convertToLetter = (num) => {
    return String.fromCharCode(65 + num);
  };

  return (
    <div className="container mt-4">
      {Object.keys(groupedSurveyData).map((surveyId) => (
        <div key={surveyId}>
          <table class="table caption-top mb-4">
            <caption><h3>Anket Adı: {surveys[surveyId]}</h3></caption>
            <thead>
              <tr>
                <th>Soru Numarası</th>
                <th>Cevaplar</th>
                <th>Toplam Cevap Sayısı</th>
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