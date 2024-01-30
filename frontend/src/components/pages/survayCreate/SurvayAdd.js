/**
 * Ertan Osman ALABAY - 30.01.2024
 */

import React, { useState } from 'react';
import axios from 'axios';
import '../survayCreate/SurvayAdd.css'

/**
 * Anket Adı ve anket konusunu kullanıcıdan alarak /addSurvey APIsine verileri gönderir.
 * Burada anketin içerisinde soru bulunmamaktadır. Soruları Soru Oluştur sayfasında eklemekteyiz.
 * 
 */

function SurvayAdd() {
  const [name, setName] = useState('');
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Input formlarının içeriğinin boş olup olmamasına dikkat eder.
  // Boşsa hata verir. Doğru yapılmışsa try bolğu çalışır.
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!name || !explanation) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3001/addSurvey', {
        name,
        explanation
      });
      console.log(response.data);
      // Formu temizler
      setName('');
      setExplanation('');
      setSuccessMessage(response.data.message);

    } catch (error) {
      console.error('An error occurred:', error);
      setError('');
    }
  };

  return (
    <div className="container">
      <h2 className='d-flex justify-content-center mt-4'>Anket Ekle</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder='Anket Adı'
            id="surveyName"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <textarea
            className="form-control"
            placeholder='Anket Konusu'
            id="surveyDescription"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
          />
        </div>
        <div className='d-flex justify-content-center'>
          <button type="submit" className="btn btn-primary">Kaydet</button>
        </div>
      </form>
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
    </div>
  );
}

export default SurvayAdd