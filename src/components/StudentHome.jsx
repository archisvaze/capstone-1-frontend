import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import socket from '../socketConfig';
import { setStudent, setAlert, setLogout, setQuizData } from '../slices/mySlice';
import "../styles/studenthome.css"


export default function StudentHome() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector(state => state.myState);

  //function to show alerts
  function alert(text, flag) {
    dispatch(setAlert([text, true, flag]))
    setTimeout(() => {
      dispatch(setAlert([text, false, flag]))
    }, 2000)
  }

  useEffect(() => {
    dispatch(setLogout());
    // eslint-disable-next-line
  }, [])


  //valriables
  const [name, setName] = useState("");
  const [nanoID, setNanoID] = useState("");

  function joinRoom() {
    if (name !== "" && nanoID !== "") {
      dispatch(setAlert(["Connecting...", true, "error"]))
      socket.emit("join-room", {
        name: name,
        nanoID: nanoID,
        clientID: state.clientID,
      })
    }
  }

  //socket connections
  useEffect(() => {
    socket.on("join-request-granted", data => {
      console.log("join-request-granted")
      setName("");
      setNanoID("")
      dispatch(setStudent(data.name))
      dispatch(setQuizData(data.quizData))
      navigate(`/room/${data.quizID}`)
      alert("Quiz Room Joined!", "alert")
    })

    socket.on("join-request-denied", data => {
      console.log("join-request-denied")
      alert("Student with same name is already in Room", "error")
    })

    socket.on("room-busy", data => {
      console.log("Quiz in Progess on Ended")
      alert("The Quiz is already in progess or has ended", "error")
    })
    // eslint-disable-next-line
  }, [])


  return (
    <div className='student-home'>

      <div className="main">
        <input onChange={(e) => setName(e.target.value)} type="text" placeholder='Enter Your Name' value={name} />
        <input onChange={(e) => setNanoID(e.target.value)} type="text" placeholder='Enter Room ID' value={nanoID} />
        <button
          style={{ backgroundColor: "#2dc4c0", fontSize: "16px" }}
          onClick={() => {

            joinRoom();

          }}>Enter</button>
      </div>

      <div className="teacher-container">
        <p>Are you a Teacher?</p>
        <button
          style={{ backgroundColor: "tomato", fontSize: "16px" }}
          onClick={() => {
            navigate("/login")
          }}>Login</button>
      </div>
    </div>
  )
}
