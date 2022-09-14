import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import socket from '../socketConfig';
import { setStudent, setAlert } from '../slices/mySlice';


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

  const joinRoom = () => {
    if (name !== "" && quizID !== "") {
      socket.emit("join-room", { name, quizID })
    }
  }

  useEffect(() => {
    socket.on("access-granted", data => {
      console.log("access-granted")
      setName("");
      setQuizID("")
      dispatch(setStudent(data.name))
      navigate(`/room/${data.quizID}`)
    })

    socket.on("access-denied", data => {
      console.log("access-denied")
      alert("Student with same name already in Room", "error")
    })

  }, [])


  return (
    <div className='student-home'>

      <input onChange={(e) => setName(e.target.value)} type="text" placeholder='Enter Your Name' value={name} />
      <input onChange={(e) => setQuizID(e.target.value)} type="text" placeholder='Enter Room ID' value={quizID} />
      <button onClick={() => {
        {
          joinRoom();
        }
      }}>Enter</button>

    </div>
  )
}
