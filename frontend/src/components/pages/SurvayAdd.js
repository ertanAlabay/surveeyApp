import React, { useState } from 'react';
import axios from 'axios'; // Axios kütüphanesini kullanarak backend ile iletişim sağlayacağız


function SurvayAdd() {
  const [name, setName] = useState('');
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!name || !explanation) {
      setError('Please fill in all fields.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3001/addSurvey', {
        name,
        explanation
      });
      console.log(response.data);
      // Formu temizle
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
      <h2>Add Survey</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label htmlFor="surveyName">Survey Name:</label>
          <input
            type="text"
            className="form-control"
            id="surveyName"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="surveyDescription">Survey Description:</label>
          <textarea
          className="form-control"
            id="surveyDescription"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Survey</button>
      </form>
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
    </div>
  );
}

export default SurvayAdd