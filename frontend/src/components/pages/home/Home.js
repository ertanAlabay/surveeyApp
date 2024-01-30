/**
 * Ertan Osman ALABAY - 30.01.2024
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../home/Home.css'

/**
 * Uygulamanın anasayfasıdır. 
 * Burada anketleri ve kısa bir Nasıl kullanırım? metni bulunmaktadır.
 */

function Home() {
  const [surveys, setSurveys] = useState([]);
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const [surveyId, setSurveyId] = useState(null);
  const [responses, setResponses] = useState({});

  /**
   * axios kullanarak sunucudan anketleri çeker ve surveys durumunu günceller. 
   * bu işlemi sürekli yapar(async).
   */
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

  //Sayfadaki anketlerde bulunan "Ankete Git" butonunu çalıştırı.
  // Butona basılınca içerisinde sorular bulunan bir modal formu çıkar.
  const handleSurveyClick = async (surveyId) => {
    try {
      const response = await axios.get(`http://localhost:3001/questions?surveyId=${surveyId}`);
      setSurveyQuestions(response.data);
      setSurveyId(surveyId);
    } catch (error) {
      console.error('An error occurred while fetching survey questions:', error);
    }
  };

  //kullanıcının anketi çözerken verdiği cevapları saklar.
  const handleResponseChange = (questionId, value) => {
    setResponses({ ...responses, [questionId]: value });
  };

  //Kaydet butonunu çalıştırı. Tüm şıklar işaretlenmişse uyarı mesajı verir.
  const saveSurveyResponses = async () => {
    if (!surveyId || Object.keys(responses).length === 0) {
      console.error('Survey ID and responses are required.');
      alert('Lütfen tüm soruları eksiksiz işaretleyiniz.');
      return;
    }

    const allQuestionsAnswered = surveyQuestions.every((question) => responses[question.id]);
    if (!allQuestionsAnswered) {
      alert('Tüm soruları cevaplayın.');
      return;
    }

    try {
      // /survey-responses APIsine post işlemi gerçekleştiri. Verileri db e kaydetmesi için Apıye yollar.
      const response = await axios.post('http://localhost:3001/survey-responses', {
        surveyId: surveyId,
        responses: responses,
      });
      console.log(response.data.message);
      alert('Anket cevapları başarıyla kaydedilmiştir');
    } catch (error) {
      console.error('An error occurred while saving survey responses:', error);
    }
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className='mt-3 mb-4 d-inline' >
            <h3 className='mb-4'>Uygulama Nasıl Kullanılmalı?</h3>
            <p>Anasayfada herhangi bir anket bulunmuyorsa şu adımları takip edin:</p>
            <li>"Anket Oluştur" sayfasından yeni bir anket oluşturun.</li>
            <li>"Soru Oluştur" sayfasından istenilen şıkka kadar soruları oluşturup "Ekle" butonu ile listeleyin. İstenilen soru sayısına ulaşınca daha önce oluşturduğumuz anketi seçip "Paylaş" butonuna tıklayın. Anket anasayfada gözükecektir.</li>
            <li>Anasayfadan dilediğiniz anketi seçip cevaplayabilirsiniz. </li>
            <li>Cevapladıktan sonra "Kaydet" butonuna tıklıyarak cevalarınızı kaydedebilirsiniz.</li>
            <li>"Analiz" sayfasında anketlerin o ana kadar çözen kişiler tarafından seçilmiş tüm sonuçlarını görebilirsiniz.</li>
          </div>

          {surveys.map((survey) => (
            <div className="col-sm-6">
              <div className="card mt-2" key={survey.id}>
                <div className="card-header text-center text-black-100 fw-bold">
                  {survey.name}
                </div>
                <div className="card-body">
                  <h5 className="card-title">Survey No: {survey.id}</h5>
                  <p className="card-text">{survey.explanation}</p>
                  <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => handleSurveyClick(survey.id)}>Ankete Git</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="container mt-4">
          <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header"></div>
                <div className="modal-body">
                  {surveyQuestions.length === 0 ? (
                    <p>
                      Bu ankette soru bulunmamaktadır. &nbsp;
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
                    </p>
                  ) : (
                    <div>
                      {surveyQuestions.map((question, index) => (
                        <div key={index}>
                          <h5>{index + 1}- {question.question}</h5>
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
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
                        <button type="button" className="btn btn-primary" onClick={saveSurveyResponses} data-bs-dismiss="modal">Kaydet</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;