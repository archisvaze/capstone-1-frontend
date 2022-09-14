import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import socket from '../socketConfig';
import { setStudent } from '../slices/mySlice';


export default function StudentHome() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector(state => state.myState);

  const [name, setName] = useState("");
  const [quizID, setQuizID] = useState("");

  const joinRoom = () => {
    if (name !== "" && quizID !== "") {
      socket.emit("join-room", { name, quizID })
      setName("");
      setQuizID("")
    }
  }

  useEffect(() => {
    socket.once("room-joined", data => {
      dispatch(setStudent(data.name))
      navigate(`/room/${data.quizID}`)
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
