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

        //if quiz is out of quiestions
        if (index >= quiz.questions.length - 1) {
            console.log("quiz over")
            setQuizStatus("ended");
            socket.emit("quiz-over", { quizID: quiz._id })


        } else {
            console.log("next question")
            socket.emit("next-question", { quizID: quiz._id, index: index + 1 })
            let nextIndex = index + 1;
            setIndex(nextIndex);
        }

    }

    function endQuiz() {
        setQuizStatus("ended");
        socket.emit("quiz-over", { quizID: quiz._id })
    }

    //socket connections
    useEffect(() => {
        socket.on("student-connected", room => {
            // console.log("New Student was added");
            dispatch(setCurrQuizRoom(room))
            return;
        })

        //quiz logic
        socket.on("student-answered", data => {
            console.log(`${data.answer.student} answered: ${data.answer.answer}`)
            console.log("answer added to report")
        })

        socket.on("report", room => {
            console.log(room)
            dispatch(setCurrQuizRoom(room))
            return;
        })

    }, [])
    return (
        <div className='teachers-room'>
            <h1>TeachersRoom</h1>

            <button style={{ display: quizStatus === "not-started" ? "flex" : "none" }}
                onClick={() => {
                    {
                        startQuiz();
                    }
                }} className="start-quiz-btn">Start Quiz</button>


            <button style={{ display: quizStatus === "not-started" ? "none" : "flex" }}
                onClick={() => {
                    {

                    }
                }}
            >End Quiz</button>

            <div className="connected-students">
                <h3>Connected Students</h3>
                {state.currQuizRoom.students.map(student => {
                    return (
                        <p key={student}>{student}</p>
                    )
                })}
            </div>


            <div style={{ display: quizStatus === "started" ? "flex" : "none" }} className="teacher-quiz">
                <h2>{quiz?.questions[index]?.question}</h2>
                <button onClick={() => {
                    {
                        nextQuestion();
                    }
                }}>Next</button>

            </div>

            <div style={{ display: quizStatus === "ended" ? "flex" : "none" }} className="report">
                <h3>Report</h3>
                {state.currQuizRoom?.report.map(student_report => {
                    return(
                        <div key={student_report.student} className="student-report">
                            <p>Student: {student_report.student}</p>
                            {student_report.answers.map(obj => {
                                return (
                                    <div key={obj.question} className="student-answers">
                                        <p>q: {obj.question}</p>
                                        <p>a: {obj.answer}</p>
                                    </div>
                                )
                            })}

                        </div>
                    )
                })}
            </div>


        </div>
    )
}
