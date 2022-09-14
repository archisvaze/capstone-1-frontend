import React, { useState } from 'react'
import "../styles/myquizes.css"
import { useDispatch, useSelector } from 'react-redux'
import { setAlert } from '../slices/mySlice';
import { setEditQuizDialog } from '../slices/mySlice';
export default function QuizCard(props) {
    const dispatch = useDispatch();
    const state = useSelector((state) => state.myState);
    let obj = props.obj;

    const [newQuestion, setNewQuestion] = useState("")
    const [choice1, setChoice1] = useState("")
    const [choice2, setChoice2] = useState("")
    const [choice3, setChoice3] = useState("")
    const [choice4, setChoice4] = useState("")
    const [solution, setSolution] = useState("")


    function alert(text, flag) {
        dispatch(setAlert([text, true, flag]))
        setTimeout(() => {
            dispatch(setAlert([text, false, flag]))
        }, 2000)
    }

    const deleteQuiz = async () => {
        dispatch(setAlert(["Deleting Quiz...", true, "alert"]))
        fetch(`http://localhost:8000/quiz/delete/${obj._id}`)
            .then(res => res.json())
            .then(data => {
                if (data.message) {
                    dispatch(setAlert(["Quiz Deleted!", true, "alert"]))
                    setTimeout(() => {
                        dispatch(setAlert(["Quiz Deleted", false, "alert"]))
                    }, 2000)
                }
            })
    }

    const addQuestion = async () => {
        if (newQuestion.length === 0 || choice1.length === 0 || choice2.length === 0) {
            alert("A Question must have atleast 2 choices!", "error")
            return;
        }
        let choices = [];
        choices.push(choice1);
        choices.push(choice2);
        if (choice3.length > 0) choices.push(choice3);
        if (choice4.length > 0) choices.push(choice4);
        let body = { question: newQuestion, choices: choices, solution: solution }

        const reqOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }
        fetch(`http://localhost:8000/quiz/${obj._id}/newquestion`, reqOptions)
            .then(res => res.json())
            .then(data => {
                if (data.message) {
                    alert("Question added to Quiz", "alert")
                }
            })


    }
    const removeQuestion = async (questionID) => {
        dispatch(setAlert(["Removing Question...", true, "alert"]))
        const reqOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ questionID: questionID })
        }
        fetch(`http://localhost:8000/quiz/${obj._id}/removequestion`, reqOptions)
            .then(res => res.json())
            .then(data => {
                if (data.message) {
                    alert("Question removed from Quiz", "alert")
                    dispatch(setEditQuizDialog(false));
                    setNewQuestion("")
                    setChoice1("")
                    setChoice2("")
                    setChoice3("")
                    setChoice4("")
                    setSolution("")
                }
            })
    }

    return (
        <div className='quiz-card'>

            <div className="quiz-info">
                <h3 className="quiz-title">{obj.name}</h3>
                <p>Number of Questions: {obj.questions.length}</p>
            </div>

            <button disabled={obj.questions.length === 0 ? true : false} className="start quiz-btn">Start</button>

            <div className="quiz-actions">

                <button onClick={() => { dispatch(setEditQuizDialog(true)) }} className="edit quiz-btn">Add/Remove Questions</button>

                <button onClick={() => {
                    deleteQuiz();
                }} className="delete quiz-btn">Delete</button>
            </div>






            <div style={{ display: state.editQuizDialog === true ? "flex" : "none" }} className="edit-quiz-dialog">
                {obj.questions.map(question => {
                    return (
                        <div key={question._id} className="question">
                            <p>Question: {question.question}</p>
                            <div className="choices">
                                {question.choices.map(choice => {
                                    return (
                                        <p key={choice} className="choice">{choice}</p>
                                    )
                                })}
                            </div>
                            <button onClick={() => { removeQuestion(question._id) }}>Remove Question</button>
                        </div>
                    )
                })}

                <input onChange={(e) => { setNewQuestion(e.target.value) }} type="text" placeholder='Question' value={newQuestion} />

                <input style={{ border: solution === choice1 ? "2px solid green" : "2px solid transparent" }} onChange={(e) => { setChoice1(e.target.value) }} type="text" placeholder='Choice1' value={choice1} />
                <button onClick={() => {
                    if (choice1.length > 0) setSolution(choice1)
                }} className="solution">✔️</button>

                <input style={{ border: solution === choice2 ? "2px solid green" : "2px solid transparent" }} onChange={(e) => { setChoice2(e.target.value) }} type="text" placeholder='Choice2' value={choice2} />
                <button onClick={() => {
                    if (choice2.length > 0) setSolution(choice2)
                }} className="solution">✔️</button>

                <input style={{ border: solution === choice3 ? "2px solid green" : "2px solid transparent" }} onChange={(e) => { setChoice3(e.target.value) }} type="text" placeholder='Choice3' value={choice3} />
                <button onClick={() => {
                    if (choice3.length > 0) setSolution(choice3)
                }} className="solution">✔️</button>

                <input style={{ border: solution === choice4 ? "2px solid green" : "2px solid transparent" }} onChange={(e) => { setChoice4(e.target.value) }} type="text" placeholder='Choice4' value={choice4} />
                <button onClick={() => {
                    if (choice4.length > 0) setSolution(choice4)
                }} className="solution">✔️</button>

                <button onClick={() => { addQuestion() }}>Add new Question</button>
            </div>



            <div onClick={() => {
                dispatch(setEditQuizDialog(false));
                setNewQuestion("")
                setChoice1("")
                setChoice2("")
                setChoice3("")
                setChoice4("")
                setSolution("")
            }} style={{ display: state.editQuizDialog === true ? "flex" : "none" }} className="new-quiz-filter"></div>
        </div>
    )
}
