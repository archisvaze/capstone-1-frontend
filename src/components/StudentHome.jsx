import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import socket from '../socketConfig';
import { setStudent, setAlert } from '../slices/mySlice';
import "../styles/room.css"


export default function StudentHome() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector(state => state.myState);

  function alert(text, flag) {
    dispatch(setAlert([text, true, flag]))
    setTimeout(() => {
      dispatch(setAlert([text, false, flag]))
    }, 2000)
  }

  const [name, setName] = useState("");
  const [quizID, setQuizID] = useState("");

  function joinRoom() {
    if (name !== "" && quizID !== "") {
      socket.emit("join-room", {
        name: name,
        quizID: quizID,
        clientID: state.clientID
      })
    }
  }

  useEffect(() => {
    socket.on("join-request-granted", data => {
      console.log("join-request-granted")
      setName("");
      setQuizID("")
      dispatch(setStudent(data.name))
      navigate(`/room/${data.quizID}`)
    })

    socket.on("join-request-denied", data => {
      console.log("join-request-denied")
      alert("Student with same name already in Room", "error")
    })

    socket.on("room-busy", data => {
      console.log("Quiz in Progess on Ended")
      alert("The Quiz is already in progess or has ended", "error")
    })

  }, [])


  return (
    <div className='student-home'>

      <input onChange={(e) => setName(e.target.value)} type="text" placeholder='Enter Your Name' value={name} />
      <input onChange={(e) => setQuizID(e.target.value)} type="text" placeholder='Enter Room ID' value={quizID} />
      <button 
      style={{backgroundColor: "#2dc4c0"}}
      onClick={() => {
        {
          joinRoom();
        }
      }}>Enter</button>

      <p>Are you a Teacher?</p>
      <button onClick={() => {
        navigate("/login")
      }}>Login</button>

    </div>
  )
}
