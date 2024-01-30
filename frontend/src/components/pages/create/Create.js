/**
 * Ertan Osman ALABAY - 30.01.2024
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Create.css'

/**
 * Burada ankete soru ekleme işlemleri yapılıyor.
 * Kullanıcı istediği kadar soruyu istediği şık sayısı ile ankete ekleme işlemi yapıyor.
 */


function Create() {
  
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [optionCount, setOptionCount] = useState(2);
  const [options, setOptions] = useState(Array(optionCount).fill(''));
  const [showQuestions, setShowQuestions] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState('');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {

      //anket değerlerini option formunda göstermek için depğerleri alıyoruz.
      const response = await axios.get('http://localhost:3001/surveys');
      setSurveys(response.data);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  // Yeni soru ekler
  // Soru oluşturuken boş cevap girmemeleri için bir kontrol yaptım. boş soru olunca hata veriyor.
  // Ayrıca en az 2 şık olma zorunluluğu koydum.
  const addQuestion = () => {
    if (!newQuestion || options.every((option) => !option.trim()) || options.length < 2) {
      alert("Lütfen tüm şıkları doldurunuz.");
      return;
    }

    // Oluşturulan soruyu html de gösterebilmek için oluşturdum.
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

  //kullanıcının soru seçeneklerini ve seçeneklerin işaretlerini 
  //(işaretlenmiş veya işaretlenmemiş) güncellemesine sağlar.
  //bu kısım kullanışşsız olabilir
  const handleOptionChange = (index, text) => {
    const updatedOptions = [...options];
    updatedOptions[index] = text;
    setOptions(updatedOptions);
  };

  //kullanıcının seçeneklerin işaretlerini 
  //(işaretlenmiş veya işaretlenmemiş) güncellemesine sağlar.
  //bu kısım da kullanışşsız olabilir
  const handleCheckboxChange = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].checked = !updatedQuestions[questionIndex].options[optionIndex].checked;
    setQuestions(updatedQuestions);
  };

  // "/create" APIsini çağırır. Eklenen soruları seçilen anketin içerisine databaseye kaydeder.
  const publishQuestions = () => {
    const backendUrl = 'http://localhost:3001/create';
    axios.post(backendUrl, { questions, surveyId: selectedSurvey })
      .then((response) => {
        alert(response.data.message);
      })
      .catch((error) => {
        console.error(error);
        alert('Hata. Lütfen ilgili yerlerin hepsini doldurunuz.');
      });
  };

  return (
    <div className="container mt-4 ">
      <div className='row alert alert-success border border-dark'>
        <div className="container col-5">
          <div>
            <h5>Soru Girin</h5>
            <input
              type="text"
              className='form-control'
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
            <h5>Cevap Sayısı Seçin</h5>
            <input
              type="number"
              className='form-control'
              value={optionCount}
              onChange={(e) => setOptionCount(Math.max(2, parseInt(e.target.value)))}
            />
            {[...Array(Number(optionCount))].map((_, index) => (
              <div key={index}>
              {/* Harfleri göstermek için burada alfabe dizisini kullandım */}
                <h6>Şık {alphabet[index]}</h6> 
                <input
                  type="text"
                  className='form-control'
                  value={options[index]}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
              </div>
            ))}
            <button className="btn btn-primary mb-1" onClick={addQuestion}>Soru Ekle</button>

            <div className="input-group">
              <select className="custom-select"
                id="inputGroupSelect04"
                aria-label="Example select with button addon"
                value={selectedSurvey} onChange={(e) => setSelectedSurvey(e.target.value)}>
                <option selected>Anket Seç...</option>
                {surveys.map((survey) => (
                  <option key={survey.id} value={survey.id}>{survey.name}</option>
                ))}
              </select>
              <div className="input-group-append">
                <button className="btn btn-primary" type="button" onClick={publishQuestions}>Paylaş</button>
              </div>
            </div>
          </div>
        </div>
        <div className="container alert alert-success col-7 mb-0 border border-dark">
          {showQuestions && (
            <div>
              <p>Total Questions: {questionCount}</p>
              {questions.map((q, questionIndex) => (
                <div>
                <div key={questionIndex}>
                  <p>{questionIndex + 1}- {q.question}</p>
                  <ul>
                    {q.options.map((option, optionIndex) => (
                     <div key={optionIndex}>
                        <input
                          type="checkbox"
                          checked={option.checked}
                          onChange={() => handleCheckboxChange(questionIndex, optionIndex)}
                        />
                        {/* Harfleri göstermek için burada alfabe dizisini kullandım */}
                        {alphabet[optionIndex]}- {option.text} 
                      </div>
                    ))}
                  </ul>
                </div>
                <p>---------------------------------------</p>
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