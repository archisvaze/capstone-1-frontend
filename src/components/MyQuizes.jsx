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
                style={{ background: "mediumseagreen", fontSize: "16px", marginTop: "20px", textShadow: "1px 1px 1px black", fontWeight: "bold", letterSpacing: "2px", gap: "10px" }}
                onClick={() => {
                    dispatch(setNewQuizDialog(true))
                }} className="create-quiz-btn"> <img style={{ width: "18px", boxShadow: "2px 2px 2px  grey" }} src={plus} alt="" /> New Quiz</button>
        </div>
    )
}
