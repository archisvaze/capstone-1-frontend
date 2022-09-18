import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setNewQuizDialog } from '../slices/mySlice';
import QuizCard from './QuizCard';
import "../styles/myquizes.css";
import plus from "../icons/plus.svg"

export default function MyQuizes(props) {
    const state = useSelector((state) => state.myState);
    const dispatch = useDispatch();
    return (
        <div className='my-quizes-page'>

            <h2>My Quizes</h2>

            <div className="quizes-container">
                {state.myQuizes.map(obj => {
                    return (
                        <QuizCard key={obj._id} obj={obj} />
                    )
                })}

            </div>

            <button
                style={{ background: "#f1b238", fontSize: "16px", marginTop: "20px", fontWeight: "bold", letterSpacing: "2px", gap: "15px", maxWidth: "300px", textShadow: "0px 0px 3px black" }}
                onClick={() => {
                    dispatch(setNewQuizDialog(true))
                }} className="create-quiz-btn"> <img style={{ width: "18px", boxShadow: "0 0 2px black" }} src={plus} alt="" />Create New Quiz</button>
        </div>
    )
}
