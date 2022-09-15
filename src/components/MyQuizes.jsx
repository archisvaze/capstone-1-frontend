import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setNewQuizDialog } from '../slices/mySlice';
import QuizCard from './QuizCard';
import "../styles/myquizes.css"

export default function MyQuizes(props) {
    const state = useSelector((state) => state.myState);
    const dispatch = useDispatch();
    return (
        <div className='my-quizes-page'>

            <h1>My Quizes</h1>

            <div className="quizes-container">
                {state.myQuizes.map(obj => {
                    return (
                        <QuizCard key={obj._id} obj={obj} />
                    )
                })}

            </div>

            <button 
            style={{background: "#2dc4c0", fontSize: "16px"}}
            onClick={() => {
                dispatch(setNewQuizDialog(true))
            }} className="create-quiz-btn">New Quiz</button>
        </div>
    )
}
