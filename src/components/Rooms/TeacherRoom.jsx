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
    const [quiz, setQuiz] = useState({})
    const [start, setStart] = useState(false)

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
    //socket connections
    useEffect(() => {
        socket.on("student-connected", room => {
            console.log("New Student was added");
            console.log(room)
            dispatch(setCurrQuizRoom(room))
            return;
        })
    }, [])
    return (
        <div className='teachers-room'>
            <h1>TeachersRoom</h1>
            <button className="start-quiz-btn">Start Quiz</button>
            <div className="connected-students">
                <h3>Connected Students</h3>
                {state.currQuizRoom.students.map(student => {
                    console.log(state.currQuizRoom)
                    return (
                        <p key={student}>{student}</p>
                    )
                })}
            </div>
        </div>
    )
}
