import React, { useEffect } from 'react'
import "../styles/myquizes.css"
import { useDispatch, useSelector } from 'react-redux'
import { setCurrQuizRoom, setAlert } from '../slices/mySlice';
import { Link } from 'react-router-dom';
import socket from "../socketConfig";
import { useNavigate } from 'react-router-dom';

export default function QuizCard(props) {
    const dispatch = useDispatch();
    const state = useSelector((state) => state.myState);
    const navigate = useNavigate();
    let obj = props.obj;

    const deleteQuiz = async () => {
        dispatch(setAlert(["Deleting Quiz...", true, "alert"]))
        fetch(`http://localhost:8000/quiz/delete/${obj._id}`)
            .then(res => res.json())
            .then(data => {
                if (data.message) {
                    dispatch(setAlert(["Quiz Deleted!", true, "alert"]))
                    setTimeout(() => {
                        dispatch(setAlert(["Quiz Deleted", false, "alert"]))
                    }, 2000)
                }
            })
    }

    //socket Connection
    function createRoom() {
        dispatch(setCurrQuizRoom({ students: [], report: [] }))
        console.log("destroying previous room")
        socket.emit("destroy-room", { quiz: obj, clientID: state.clientID });
        socket.emit("create-room", { quiz: obj, clientID: state.clientID })
    }

    useEffect(() => {
        socket.once("room-created", data => {
            console.log("Room Created " + data.quiz._id);
            navigate(`/teachers_room/${data.quiz._id}`)
        })
    }, [])


    return (
        <div className='quiz-card'>

            <div className="quiz-info">
                <h3 className="quiz-title">{obj.name}</h3>
                <p>Number of Questions: {obj.questions.length}</p>
            </div>

            <button style={{background: "mediumseagreen"}} onClick={() => {
                {
                    createRoom();
                }
            }} disabled={obj.questions.length === 0 ? true : false} className="start quiz-btn">Start</button>

            <div className="quiz-actions">
                <Link to={`/${obj._id}`}>
                    <button className="edit quiz-btn">Edit</button>
                </Link>

                <button onClick={() => {
                    deleteQuiz();
                }} className="delete quiz-btn">Delete</button>
            </div>
        </div>
    )
}
