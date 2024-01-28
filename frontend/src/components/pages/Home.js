import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [surveys, setSurveys] = useState([]);

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

  return (
    <div className="container mt-4">
      {surveys.map((survey) => (
        <div className="card">
        <div className="card-body">
            <div className="card-body" key={survey.id}>
              <div className="card-body">
                <h5 className="card-title" >Survey No: {survey.id}</h5>
                <p className="card-text">Survey Name: {survey.name}</p>
                <p className="card-text">{survey.explanation}</p>
                <a href="/survay" className="btn btn-primary">Go Survey</a>
              </div>
            </div>
        </div>
      </div>
      ))}
    </div>
  );
}

export default Home;