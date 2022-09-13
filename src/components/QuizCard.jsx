import React from 'react'
import "../styles/myquizes.css"
import { useDispatch } from 'react-redux'
import { setAlert } from '../slices/mySlice';
export default function QuizCard(props) {
    const dispatch = useDispatch();
    let obj = props.obj;


    const deleteQuiz = async () => {
        fetch(`http://localhost:8000/quiz/delete/${obj._id}`)
            .then(res => res.json())
            .then(data => {
                if (data.message) {
                    dispatch(setAlert(["Quiz Deleted", true, "alert"]))
                    setTimeout(() => {
                        dispatch(setAlert(["Quiz Deleted", false, "alert"]))
                    }, 2000)
                }
            })
    }


    return (
        <div className='quiz-card'>

            <div className="quiz-info">
                <h3 className="quiz-title">{obj.name}</h3>
                <p>Number of Questions: {obj.questions.length}</p>
            </div>

            <button className="start quiz-btn">Start</button>

            <div className="quiz-actions">

                <button className="edit quiz-btn">Add/Remove Questions</button>

                <button onClick={() => {
                    deleteQuiz();
                }} className="delete quiz-btn">Delete</button>
            </div>
        </div>
    )
}
