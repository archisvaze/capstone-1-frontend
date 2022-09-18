import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { setLogout, setMyQuizes, setNewQuizDialog, setAlert, setTab } from '../slices/mySlice';
import MyQuizes from './MyQuizes';
import MyReports from './MyReports';
import question_img from "../images/question.svg"

export default function Home() {
  const state = useSelector((state) => state.myState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quizName, setquizName] = useState("");

  function alert(text, flag) {
    dispatch(setAlert([text, true, flag]))
    setTimeout(() => {
      dispatch(setAlert([text, false, flag]))
    }, 2000)
  }

  useEffect(() => {
    if (state.isLoggedIn === false) {
      dispatch(setLogout());
      navigate("/login")
    }
    else {
      setTab("My Quizes")
      getAllQuizes();
    }

    // eslint-disable-next-line
  }, [state.alert])

  const getAllQuizes = async () => {

    const reqParams = {
      method: "get",
      headers: { "Authorization": `Bearer ${state.teacher.token}` }
    }

    fetch(`http://localhost:8000/quiz/teacher/${state.teacher._id}`, reqParams)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.log(data.error)
          // alert(data.error, "error")
        }
        else {
          if (data?.length > 0) data.reverse();
          // console.log(data)
          dispatch(setMyQuizes(data))
        }
      })
  }


  const createNewQuiz = async () => {
    const reqOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${state.teacher.token}`
      },
      body: JSON.stringify({ name: quizName, teacher: state.teacher._id })
    }

    fetch(`http://localhost:8000/quiz`, reqOptions)
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          dispatch(setNewQuizDialog(false));
          setquizName("")
          dispatch(setAlert(["New Quiz Created", true, "alert"]))
          setTimeout(() => {
            dispatch(setAlert(["New Quiz Created", false, "alert"]))
          }, 2000)
        }
        else {
          console.log(data)
        }
      })

  }

  return (
    <div className='home-page'>


      {state.tab === "My Quizes" ? <MyQuizes /> : <MyReports />}


      {/* DIALOG BOX TO CREATE NEW QUIZ */}

      <div style={{ display: state.newQuizDialog === true ? "flex" : "none" }} className="new-quiz-dialog">

        <h3 style={{ textAlign: "center" }}>Create A New Quiz</h3>

        <img style={{width: "150px"}} src={question_img} alt="" />

        <input onChange={(e) => {
          e.stopPropagation();
          setquizName(e.target.value)
        }} type="text" placeholder='Enter A Title for your Quiz' value={quizName} />

        <div className="new-quiz-actions">
          <button style={{ background: "mediumseagreen", height: "40px" }} onClick={(e) => {
            createNewQuiz();
            e.stopPropagation();
          }}>Create Quiz</button>

          <button style={{ background: "darkslategray" }}
            onClick={(e) => {
              dispatch(setNewQuizDialog(false));
              e.stopPropagation();
            }}> Cancel </button>
        </div>
      </div>

      {/* background filter with blur effect */}
      <div onClick={() => {
        dispatch(setNewQuizDialog(false));
        setquizName("")
      }} style={{ display: state.newQuizDialog === true ? "flex" : "none" }} className="new-quiz-filter"></div>

    </div>
  )
}
