import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { setLogout, setMyQuizes, setNewQuizDialog, setAlert } from '../slices/mySlice';
import MyQuizes from './MyQuizes';
import MyReports from './MyReports';



export default function Home() {
  const state = useSelector((state) => state.myState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quizName, setquizName] = useState("");

  useEffect(() => {
    if (state.isLoggedIn === false) {
      dispatch(setLogout());
      navigate("/login")
    }
    getAllQuizes();

    // eslint-disable-next-line
  }, [state.alert])

  const getAllQuizes = async () => {
    fetch(`http://localhost:8000/quiz/teacher/${state.teacher._id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) { }
        else {
          if (data?.length > 0) data.reverse();
          console.log(data)
          dispatch(setMyQuizes(data))
        }
      })
  }


  const createNewQuiz = async () => {
    const reqOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: quizName, teacher: state.teacher._id })
    }

    fetch(`http://localhost:8000/quiz`, reqOptions)
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          dispatch(setNewQuizDialog(false));
          dispatch(setAlert(["New Quiz Created", true, "alert"]))
          setTimeout(() => {
            dispatch(setAlert(["New Quiz Created", false, "alert"]))
          }, 2000)
        }
      })

  }

  return (
    <div className='home-page'>

      {state.tab === "My Quizes" ? <MyQuizes /> : <MyReports />}



      <div style={{ display: state.newQuizDialog === true ? "flex" : "none" }} className="new-quiz-dialog">

        <input onChange={(e) => {
          setquizName(e.target.value)
        }} type="text" placeholder='Enter A Title for your Quiz' value={quizName} />

        <button onClick={() => { createNewQuiz() }}>Create Quiz</button>

        <button onClick={() => dispatch(setNewQuizDialog(false))}>Cancel</button>


      </div>
      <div style={{ display: state.newQuizDialog === true ? "flex" : "none" }} className="new-quiz-filter"></div>

    </div>
  )
}
