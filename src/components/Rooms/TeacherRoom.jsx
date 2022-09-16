import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLogout, setCurrQuizRoom, setTab, addtoHaveAnswered, clearHaveAnswered, setAlert } from '../../slices/mySlice';
import socket from "../../socketConfig";
import "../../styles/room.css"
import play from "../../icons/play.svg"
import Timer from '../Timer';

export default function TeacherRoom() {
    const state = useSelector((state) => state.myState);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let { quizID } = useParams();

    function alert(text, flag) {
        dispatch(setAlert([text, true, flag]))
        setTimeout(() => {
            dispatch(setAlert([text, false, flag]))
        }, 2000)
    }

    //varaibles
    const [quiz, setQuiz] = useState({ questions: [], choices: [] })
    const [index, setIndex] = useState(0);
    const [quizStatus, setQuizStatus] = useState("not-started")
    const [report, setReport] = useState([])
    const [time, setTime] = useState(0)

    useEffect(() => {
        dispatch(setTab(""))
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
        if (state.currQuizRoom.students.length > 0) {
            dispatch(clearHaveAnswered())
            setTime(100);
            setQuizStatus("started")
            console.log("starting quiz...")
            socket.emit("start-quiz", { quizID: quiz._id });
            setIndex(0)
        }
        else {
            alert("No Students have joined yet", "error")
        }
    }

    function nextQuestion() {
        setTime(100);
        dispatch(clearHaveAnswered())
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
        dispatch(clearHaveAnswered())
        setTime(0)
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
            // console.log(`${data.answer.student} answered: ${data.answer.answer}`)
            if (!state.haveAnswered.includes(data.answer.student)) {
                dispatch(addtoHaveAnswered(data.answer.student))
            }
            // console.log("answer added to report")
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
            // console.log(studentsReport);

            let entries = Object.entries(studentsReport);
            entries.sort((a, b) => - a[1] + b[1])
            // console.log(entries)
            setReport(entries);
        }
    }, [state.currQuizRoom])
    return (
        <div className='teachers-room'>
            <h1>TeachersRoom</h1>

            <button
                style={{ display: quizStatus === "not-started" ? "flex" : "none", background: "mediumseagreen", marginBottom: "30px" }}
                onClick={() => {
                    {
                        startQuiz();
                    }
                }} className="start-btn" >Start Quiz<img src={play} alt="" /></button>


            <button style={{ display: quizStatus === "started" ? "flex" : "none", marginBottom: "30px", color: "red", fontWeight: "bold" }}
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
                        <p style={{ border: state.haveAnswered.includes(student) ? "4px solid yellowgreen" : "4px solid transparent" }} className='connected-student' key={student}>{student}</p>
                    )
                })}
            </div>


            <div style={{ display: quizStatus === "started" ? "flex" : "none" }} className="teacher-quiz">
                <h2>Q: {quiz?.questions[index]?.question}</h2>
                <button
                    disabled={time > 0 ? true : false}
                    style={{ gap: "10px", background: time > 0 ? "#59656b" : "mediumseagreen", margin: "20px 0", fontWeight: "bold" }}
                    onClick={() => {
                        {
                            nextQuestion();
                        }
                    }}>Next Question<img src={play} alt="" /></button>

            </div>

            <div style={{ display: quizStatus === "ended" ? "flex" : "none" }} className="teacher-report">
                <h2>Final Scores</h2>
                <button
                    style={{ margin: "20px 0", color: "black", fontWeight: "bold", }}
                >Save Report</button>
                <div className="student-score-container">
                    {report.map((arr) => {
                        return (
                            <div key={arr[0]} className="student-score">
                                <p>{arr[0]}</p>
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
