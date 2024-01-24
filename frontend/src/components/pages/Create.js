import React, { useState, useEffect } from 'react'

function Create(question) {

  /*const [task , setTask] = useState([]);
  const [newTask , setNewTask] = useState("");
  
  fun*/

  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [optionCount, setOptionCount] = useState(2);
  const [options, setOptions] = useState(Array(optionCount).fill(''));
  const [showQuestions, setShowQuestions] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  
  const addQuestion = () => {
    
    // Yeni soru eklenirken en az bir cevap kontrolü
    if (!newQuestion || options.every((option) => !option.trim()) || options.length < 2) {
      alert("Soru ve en az iki cevap ekleyin.");
      return;
    }
    const newQ = {
      question: newQuestion,
      options: options.map((text) => ({ text, checked: false }))
    };
    setQuestions([...questions, newQ]);

    // Reset state values for the next question
    setNewQuestion('');
    setOptionCount(2);
    setOptions(Array(2).fill(''));
    setShowQuestions(true);

    setQuestionCount(questionCount + 1);
    
  };

  const handleOptionChange = (index, text) => {
    const updatedOptions = [...options];
    updatedOptions[index] = text;
    setOptions(updatedOptions);
  };

  const handleCheckboxChange = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].checked = !updatedQuestions[questionIndex].options[optionIndex].checked;
    setQuestions(updatedQuestions);
  };

  useEffect(() => {
    // Her yeni soru eklediğimizde 2. kısmı güncelle
    setShowQuestions(true);
  }, [questions]);

  return (
    <div className="container mt-4 ">
      <div className='row alert alert-success border border-dark'>
        <div className="container col-5">
          <div>

            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
            <label> :  Soru</label>

            <input
              type="number"
              value={optionCount}
              onChange={(e) => setOptionCount(Math.max(2, parseInt(e.target.value)))}
            />
            <label> :  Cevap Sayısı</label>
            {[...Array(Number(optionCount))].map((_, index) => (
              <div key={index}>

                <input
                  type="text"
                  value={options[index]}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
                <label> :  {index + 1}. Şık</label>
              </div>
            ))}
            <button onClick={addQuestion}>Add Question</button>
          </div>
        </div>


        <div className="container alert alert-success col-7 mb-0 border border-dark">
          {showQuestions && (
            <div>
              <p>Total Questions: {questionCount}</p>
              {questions.map((q, questionIndex) => (
                <div key={questionIndex}>
                  <p>{questionIndex + 1}- {q.question}</p>
                  <ul>
                    {q.options.map((option, optionIndex) => (
                      <li key={optionIndex}>
                        <input
                          type="checkbox"
                          checked={option.checked}
                          onChange={() => handleCheckboxChange(questionIndex, optionIndex)}
                        />
                        {option.text}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Create