import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import "../../styles/room.css"
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import socket from '../../socketConfig';



export default function Room() {
  const navigate = useNavigate();
  const state = useSelector(state => state.myState);
  let { quizID } = useParams();

  const [quiz, setQuiz] = useState({ questions: [], choices: [] })
  const [start, setStart] = useState(false)
  const [index, setIndex] = useState(0)


  useEffect(() => {
    if (state.student === null) {
      navigate("/room")
    }
    else {
      getQuizData();
    }

  }, [])

  const getQuizData = async () => {
    fetch(`http://localhost:8000/quiz/${quizID}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) { }
        else {
          console.log(data)
          setQuiz(data)
        }
      })
  }

  //quiz realted socket data
  useEffect(() => {
    socket.on("quiz-started", data => {
      console.log("quiz is starting")
      setStart(true);
      setIndex(0)
    })
    socket.on('question-nexted', data => {
      console.log("next question coming up")
      setIndex(data.index)
    })
  }, [])


  return (
    <div className='student-room'>
      <h1>StudentRoom</h1>
      <h3 style={{ display: start === false ? "flex" : "none" }}>Waiting for Quiz to Start</h3>

      <div style={{ display: start === true ? "flex" : "none" }} className="student-quiz">
        <h2>{quiz?.questions[index]?.question}</h2>
        <button>{quiz.questions[index]?.choices[0]}</button>
        <button>{quiz.questions[index]?.choices[1]}</button>
        <button>{quiz.questions[index]?.choices[2]}</button>
        <button>{quiz.questions[index]?.choices[3]}</button>
      </div>
    </div>

  )
}
