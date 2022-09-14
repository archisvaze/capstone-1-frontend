import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLogout, addStudent, clearStudents } from '../../slices/mySlice';
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
        dispatch(clearStudents())
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
        console.log(state)
        socket.on("student-connected", data => {
            console.log("Adding Student: " + data.name)
            dispatch(addStudent(data.name))
        })
    }, [])
    return (
        <div className='teachers-room'>
            <h1>TeachersRoom</h1>
            <div className="connected-students">
                <h3>Connected Students</h3>
                {state?.connectedStudents?.map(student => {
                    return (
                        <p>{student}</p>
                    )
                })}
            </div>
        </div>
    )
}
