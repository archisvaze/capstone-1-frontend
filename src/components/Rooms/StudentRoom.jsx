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
  const [answered, setAnswered] = useState(["", false])


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
      setAnswered(["", false])
      console.log("next question coming up")
      setIndex(data.index)
    })
  }, [])

  function answer(answer) {
    setAnswered([answer, true])
    let answerObj = {
      student: state.student,
      question: quiz?.questions[index]?.question,
      answer: answer
    }
    socket.emit({ quizID: quiz._id, answer: answerObj })
  }

  return (
    <div className='student-room'>
      <h1>StudentRoom</h1>
      <h3 style={{ display: start === false ? "flex" : "none" }}>Waiting for Quiz to Start</h3>

      <div style={{ display: start === true ? "flex" : "none" }} className="student-quiz">
        <h2>{quiz?.questions[index]?.question}</h2>

        <button disabled={answered[1]}
          style={{ border: answered[0] === quiz.questions[index]?.choices[0] ? "2px solid yellowgreen" : "2px solid transparent" }}
          onClick={() => {
            answer(quiz.questions[index]?.choices[0])
          }}
        >{quiz.questions[index]?.choices[0]}</button>

        <button disabled={answered[1]}
          style={{ border: answered[0] === quiz.questions[index]?.choices[1] ? "2px solid yellowgreen" : "2px solid transparent" }}
          onClick={() => {
            answer(quiz.questions[index]?.choices[1])
          }}
        >{quiz.questions[index]?.choices[1]}</button>

        <button disabled={answered[1]}
          style={{ border: answered[0] === quiz.questions[index]?.choices[2] ? "2px solid yellowgreen" : "2px solid transparent" }}
          onClick={() => {
            answer(quiz.questions[index]?.choices[2])
          }}
        >{quiz.questions[index]?.choices[2]}</button>

        <button disabled={answered[1]}
          style={{ border: answered[0] === quiz.questions[index]?.choices[3] ? "2px solid yellowgreen" : "2px solid transparent" }}
          onClick={() => {
            answer(quiz.questions[index]?.choices[3])
          }}
        >{quiz.questions[index]?.choices[3]}</button>

      </div>
    </div>

  )
}
