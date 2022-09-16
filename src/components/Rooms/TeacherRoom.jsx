import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLogout, setCurrQuizRoom } from '../../slices/mySlice';
import socket from "../../socketConfig";
import "../../styles/room.css"
import play from "../../icons/play.svg"

export default function TeacherRoom() {
    const state = useSelector((state) => state.myState);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let { quizID } = useParams();


    //varaibles
    const [quiz, setQuiz] = useState({ questions: [], choices: [] })
    const [index, setIndex] = useState(0);
    const [quizStatus, setQuizStatus] = useState("not-started")
    const [report, setReport] = useState({})

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
            dispatch(setCurrQuizRoom(room))
            return;
        })

    }, [])


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
            setReport(studentsReport);

        }
    }, [state.currQuizRoom])
    return (
        <div className='teachers-room'>
            <h1>TeachersRoom</h1>

            <button style={{ display: quizStatus === "not-started" ? "flex" : "none", background: "mediumseagreen", marginBottom: "30px" }}
                onClick={() => {
                    {
                        startQuiz();
                    }
                }} className="start-btn" >Start Quiz<img src={play} alt="" /></button>


            <button style={{ display: quizStatus === "started" ? "flex" : "none" }}
                onClick={() => {
                    {
                        endQuiz();
                    }
                }}
            >End Quiz</button>

            
            <h3>Connected Students</h3>
            <div className="connected-students">

                {state.currQuizRoom.students.map(student => {
                    return (
                        <p className='connected-student' key={student}>{student}</p>
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
                    return (
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
