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
                style={{ background: "mediumseagreen", fontSize: "16px", marginTop: "20px", fontWeight: "bold", letterSpacing: "2px", gap: "15px" }}
                onClick={() => {
                    dispatch(setNewQuizDialog(true))
                }} className="create-quiz-btn"> <img style={{ width: "18px" }} src={plus} alt="" /> New Quiz</button>
        </div>
    )
}
