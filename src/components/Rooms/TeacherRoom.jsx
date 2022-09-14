import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLogout, addStudent } from '../../slices/mySlice';
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
    console.log(state.connectedStudents)
    //socket connections
    useEffect(() => {
        socket.on("join-request", data => {
            console.log("join request recieved")
            if (state.connectedStudents.includes(data.name)) {
                console.log("name already includes : denied")
                socket.emit("join-denied", data)
            }
            else {
                console.log(state.connectedStudents)
                console.log("name not found : granted")
                socket.emit("join-granted", data)
            }
        })
        socket.on("student-connected", data => {
            console.log("Adding Student: " + data.name)
            dispatch(addStudent(data.name))
            return;
        })

    }, [])
    return (
        <div className='teachers-room'>
            <h1>TeachersRoom</h1>
            <div className="connected-students">
                <h3>Connected Students</h3>
                {state?.connectedStudents?.map(student => {
                    return (
                        <p key={student}>{student}</p>
                    )
                })}
            </div>
        </div>
    )
}
