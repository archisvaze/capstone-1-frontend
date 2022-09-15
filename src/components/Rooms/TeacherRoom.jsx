import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLogout, setCurrQuizRoom } from '../../slices/mySlice';
import socket from "../../socketConfig";
import "../../styles/room.css"

export default function TeacherRoom() {
    const state = useSelector((state) => state.myState);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let { quizID } = useParams();


    //varaibles
    const [quiz, setQuiz] = useState({ questions: [], choices: [] })
    const [start, setStart] = useState(false)
    const [index, setIndex] = useState(0);
    const [report, setReport] = useState([])
    const [quizStatus, setQuizStatus] = useState("not-started")

    useEffect(() => {
        getQuizData();
    }, [])

    const getQuizData = async () => {
        fetch(`http://localhost:8000/quiz/${quizID}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    navigate("/")
                }
                if (state.teacher._id == undefined || state.teacher._id !== data.teacher._id || state.isLoggedIn === false) {
                    //unauthorized access
                    dispatch(setLogout());
                    navigate("/login")
                    return;
                }
                else {
                    setQuiz(data);
                }

            })
    }


    function startQuiz() {
        setQuizStatus("started")
        console.log("starting quiz...")
        socket.emit("start-quiz", { quizID: quiz._id });
        setStart(true)
        setIndex(0)
    }

    function nextQuestion() {
        console.log("next question")
        socket.emit("next-question", { quizID: quiz._id, index: index + 1 })
        let nextIndex = index + 1;
        setIndex(nextIndex);
    }

    function endQuiz(){
        setQuizStatus("ended");
        
    }

    //socket connections
    useEffect(() => {
        socket.on("student-connected", room => {
            console.log("New Student was added");
            console.log(room)
            dispatch(setCurrQuizRoom(room))
            return;
        })

        //quiz logic
        socket.on("student-answered", data => {
            let updatedReport = JSON.parse(JSON.stringify(report))
            if (updatedReport[data.answer.student]) {
                updatedReport[data.answer.student].push({ question: data.answer.question, answer: data.answer.answer })
            }
            else {
                updatedReport[data.answer.student] = [{ question: data.answer.question, answer: data.answer.answer }]
            }
            setReport(updatedReport)
            console.log(`${data.answer.student} answered: ${data.answer.answer}`)
            console.log("answer added to report")
        })

    }, [])
    return (
        <div className='teachers-room'>
            <h1>TeachersRoom</h1>

            <button onClick={() => {
                {
                    startQuiz();
                }
            }} className="start-quiz-btn">Start Quiz</button>

            <div className="connected-students">
                <h3>Connected Students</h3>
                {state.currQuizRoom.students.map(student => {
                    console.log(state.currQuizRoom)
                    return (
                        <p key={student}>{student}</p>
                    )
                })}
            </div>


            <div style={{ display: start === true ? "flex" : "none" }} className="teacher-quiz">
                <h2>{quiz?.questions[index]?.question}</h2>
                <button onClick={() => {
                    {
                        nextQuestion();
                    }
                }}>Next</button>

                <button 
                onClick={() => {{

                }}}
                >End Quiz</button>
            </div>
        </div>
    )
}
