import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import "../../styles/room.css"
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import socket from '../../socketConfig';
import { setCurrQuizRoom } from '../../slices/mySlice';
import Timer from '../Timer';



export default function Room() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector(state => state.myState);
  let { quizID } = useParams();

  const [quiz, setQuiz] = useState({ questions: [], choices: [] })
  const [index, setIndex] = useState(0)
  const [answered, setAnswered] = useState(["", false])
  const [quizStatus, setQuizStatus] = useState("not-started");
  const [report, setReport] = useState([])
  const [myScore, setMyScore] = useState(0)
  const [time, setTime] = useState(0)



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

  //quiz related socket data
  useEffect(() => {
    socket.on("quiz-started", data => {
      console.log("quiz is starting")
      setQuizStatus("started")
      setIndex(0)
      setTime(100);
    })
    socket.on('question-nexted', data => {
      setAnswered(["", false])
      console.log("next question coming up")
      setIndex(data.index)
      setTime(100);
    })
    socket.on("report", room => {
      setTime(0);
      setQuizStatus("ended")
      dispatch(setCurrQuizRoom(room));

    })
  }, [])

  function answer(answer) {
    setAnswered([answer, true])
    let answerObj = {
      student: state.student,
      question: quiz?.questions[index]?.question,
      answer: answer
    }
    socket.emit("student-answer", { quizID: quiz._id, answer: answerObj })
  }

  //calculate scores
  useEffect(() => {
    let studentsReport = {};
    if (state.currQuizRoom.report) {
      for (let student_report of state.currQuizRoom?.report) {
        studentsReport[student_report.student] = 0;
        for (let answer of student_report.answers) {
          if (answer.point === 1) {
            studentsReport[student_report.student] += 1;
          }
        }
      }
      console.log(studentsReport);

      let entries = Object.entries(studentsReport);
      entries.sort((a, b) => - a[1] + b[1])
      console.log(entries)
      setReport(entries);
      for (let arr of entries) {
        if (arr[0] === state.student) {
          setMyScore(arr[1]);
          break;
        }
      }


    }
  }, [state.currQuizRoom])

  return (
    <div className='student-room'>
      <h1>{state.student}'s Room</h1>
      <h3 style={{ display: quizStatus === "not-started" ? "flex" : "none" }}>Waiting for Quiz to Start...</h3>

      <div style={{ display: quizStatus === "started" ? "flex" : "none" }} className="student-quiz">
        <h2>Q: {quiz?.questions[index]?.question}</h2>

        <div className="student-quiz-actions">
          <button disabled={time <= 0 ? true : (answered[1] === true ? true : false)}
            style={{ border: (answered[0] === quiz.questions[index]?.choices[0] && quiz.questions[index]?.choices[0] === quiz.questions[index]?.solution && time <= 0) ? "4px solid yellowgreen" : (answered[0] === quiz.questions[index]?.choices[0] && time <= 0) ? "4px solid crimson" : (answered[0] === quiz.questions[index]?.choices[0]) ? "4px solid white" : "4px solid transparent" }}
            onClick={() => {
              answer(quiz.questions[index]?.choices[0])
            }}
          >{quiz.questions[index]?.choices[0]}</button>

          <button disabled={time <= 0 ? true : (answered[1] === true ? true : false)}
            style={{ border: (answered[0] === quiz.questions[index]?.choices[1] && quiz.questions[index]?.choices[1] === quiz.questions[index]?.solution && time <= 0) ? "4px solid yellowgreen" : (answered[0] === quiz.questions[index]?.choices[1] && time <= 0) ? "4px solid crimson" : (answered[0] === quiz.questions[index]?.choices[1]) ? "4px solid white" : "4px solid transparent" }}
            onClick={() => {
              answer(quiz.questions[index]?.choices[1])
            }}
          >{quiz.questions[index]?.choices[1]}</button>

          <button disabled={time <= 0 ? true : (answered[1] === true ? true : false)}
            style={{ border: (answered[0] === quiz.questions[index]?.choices[2] && quiz.questions[index]?.choices[2] === quiz.questions[index]?.solution && time <= 0) ? "4px solid yellowgreen" : (answered[0] === quiz.questions[index]?.choices[2] && time <= 0) ? "4px solid crimson" : (answered[0] === quiz.questions[index]?.choices[2]) ? "4px solid white" : "4px solid transparent", display: quiz.questions[index]?.choices[2] === undefined ? "none" : "flex" }}
            onClick={() => {
              answer(quiz.questions[index]?.choices[2])
            }}
          >{quiz.questions[index]?.choices[2]}</button>

          <button disabled={time <= 0 ? true : (answered[1] === true ? true : false)}
            style={{ border: (answered[0] === quiz.questions[index]?.choices[3] && quiz.questions[index]?.choices[3] === quiz.questions[index]?.solution && time <= 0) ? "4px solid yellowgreen" : (answered[0] === quiz.questions[index]?.choices[3] && time <= 0) ? "4px solid crimson" : (answered[0] === quiz.questions[index]?.choices[3]) ? "4px solid white" : "4px solid transparent", display: quiz.questions[index]?.choices[3] === undefined ? "none" : "flex" }}
            onClick={() => {
              answer(quiz.questions[index]?.choices[3])
            }}
          >{quiz.questions[index]?.choices[3]}</button>
        </div>



      </div>


      <div style={{ display: quizStatus === "ended" ? "flex" : "none" }} className="student-report">

        <h3>Podium</h3>

        <p className='your-score'>You scored {myScore}/{quiz.questions.length}</p>

        <div className="student-score-bars">

          {report.slice(0, 3).map((arr, index) => {
            return (
              <div key={arr[0]}
                style={{ order: index === 0 ? "2" : index === 1 ? "1" : "3" }}
                className="bar-container">
                <p>{arr[0]}</p>
                <div
                  style={{ height: `${arr[1] * 200 / quiz.questions.length}px`, background: index === 0 ? "#FFD700" : index === 1 ? "#C0C0C0" : "#CD7F32" }}
                  className="bar"></div>
                <p>{arr[1]}/{quiz.questions.length}</p>
              </div>
            )
          })}
        </div>

      </div>


      <Timer time={time} setTime={setTime} quizStatus={quizStatus} ></Timer>
    </div>

  )
}
