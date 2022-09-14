import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';

export default function Room() {

  let { quizID } = useParams();

  useEffect(() => {
    getQuizData();

  }, [])

  const getQuizData = async () => {
    fetch(`http://localhost:8000/quiz/${quizID}`)
      .then(res => res.json())
      .then(data => {
        console.log(data)
      })
  }
  return (
    <div>
      <h1>StudentRoom</h1>
    </div>

  )
}
