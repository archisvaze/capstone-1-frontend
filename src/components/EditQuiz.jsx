import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { setCurrQuiz } from '../slices/mySlice';
import { useSelector, useDispatch } from 'react-redux'
import { setAlert } from '../slices/mySlice';
import { useNavigate } from 'react-router-dom';
import "../styles/editquiz.css"
import { setTab } from '../slices/mySlice';
import FileBase64 from 'react-file-base64';
import placeholder from "../images/placeholder.svg"
import trash from "../icons/trash.svg"
import up from "../icons/up.svg"
import down from "../icons/down.svg"


export default function EditQuiz() {
    const state = useSelector((state) => state.myState);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let { id } = useParams();

    //fetch quiz details
    useEffect(() => {
        dispatch(setTab(""))
        fetch(`https://mcq-ace.onrender.com/quiz/${id}`, { method: "get", headers: { "Authorization": `Bearer ${state.teacher.token}` } })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    navigate("/");
                }
                else {
                    dispatch(setCurrQuiz(data))
                    // console.log(data)
                }
            })
        // eslint-disable-next-line
    }, [state.alert])


    //declare variables
    const [newQuestion, setNewQuestion] = useState("")
    const [choice1, setChoice1] = useState("")
    const [choice2, setChoice2] = useState("")
    const [choice3, setChoice3] = useState("")
    const [choice4, setChoice4] = useState("")
    const [solution, setSolution] = useState(null)
    const [image, setImage] = useState(placeholder)

    //this function shows alert box
    function alert(text, flag) {
        dispatch(setAlert([text, true, flag]))
        setTimeout(() => {
            dispatch(setAlert([text, false, flag]))
        }, 2000)
    }

    const addQuestion = async () => {
        if (newQuestion.length === 0) {
            alert("A Quiz must have a question!", "error")
            return;
        }
        if (choice1.length === 0 || choice2.length === 0) {
            alert("Choice #1 and Choice #2 cannot be empty!", "error")
            return;
        }
        if (solution === null) {
            alert("Question needs an answer!", "error")
            return;
        }
        let choices = [];
        choices.push(choice1);
        choices.push(choice2);

        if (choice3.length > 0) choices.push(choice3);
        if (choice4.length > 0) choices.push(choice4);
        let body = { question: newQuestion, choices: choices, solution: solution, image: image === placeholder ? null : image }

        const reqOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${state.teacher.token}`
            },
            body: JSON.stringify(body)
        }

        let res = await fetch(`https://mcq-ace.onrender.com/quiz/${state.currQuiz._id}/newquestion`, reqOptions)
        if (res.status !== 200) {
            alert("Image is too large, image must be less than 1MB", "error")
            return;
        }
        let data = await res.json()
        if (data.message) {
            alert("Question added to Quiz", "alert")
            setNewQuestion("")
            setChoice1("")
            setChoice2("")
            setChoice3("")
            setChoice4("")
            setSolution(null)
            setImage(placeholder)
        }
        else {
            alert(data.error, "error")
        }

    }

    const removeQuestion = async (questionID) => {
        dispatch(setAlert(["Removing Question...", true, "alert"]))
        const reqOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${state.teacher.token}`
            },
            body: JSON.stringify({ questionID: questionID })
        }
        fetch(`https://mcq-ace.onrender.com/quiz/${state.currQuiz._id}/removequestion`, reqOptions)
            .then(res => res.json())
            .then(data => {
                if (data.message) {
                    alert("Question removed from Quiz", "alert")
                }
            })
    }

    const moveUP = async (questionID) => {
        fetch(`https://mcq-ace.onrender.com/quiz/${state.currQuiz._id}/move-question-up/${questionID}`, { method: "get", headers: { "Authorization": `Bearer ${state.teacher.token}` } })
            .then(res => res.json())
            .then(data => {
                if (data.error) { }
                else {
                    alert("Question moved UP!", "alert")
                }
            })
    }
    const moveDOWN = async (questionID) => {
        fetch(`https://mcq-ace.onrender.com/quiz/${state.currQuiz._id}/move-question-down/${questionID}`, { method: "get", headers: { "Authorization": `Bearer ${state.teacher.token}` } })
            .then(res => res.json())
            .then(data => {
                if (data.error) { }
                else {
                    alert("Question moved DOWN!", "alert")
                }
            })
    }

    return (
        <div className='edit-quiz-page'>
            <button onClick={() => {
                dispatch(setTab("My Quizes"))
                navigate("/home")
            }} className="teacher-back-btn">&#129052; Back</button>
            <div className="questions-container">
                {state.currQuiz.questions.map((question, index) => {
                    return (
                        <div key={question._id} className="question">
                            <p>Q: {question.question}</p>
                            {/* <div className="choices">
                                {question.choices.map(choice => {
                                    return (
                                        <p style={{ border: question.solution === choice ? "2px solid yellowgreen" : "2px solid transparent" }} key={choice} className="question-choice">{choice}</p>
                                    )
                                })}
                            </div> */}
                            <button className='remove-question-btn' onClick={() => { removeQuestion(question._id) }}> <img src={trash} alt="" /></button>

                            <div className="move-question-container">

                                <button disabled={state.alert[1] === true ? true : index === state.currQuiz.questions.length - 1 ? true : false} onClick={() => { moveDOWN(question._id) }} className="move-down"> <img src={down} alt="" /></button>

                                <button disabled={state.alert[1] === true ? true : index === 0 ? true : false} onClick={() => { moveUP(question._id) }} className="move-up"> <img src={up} alt="" /></button>

                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="new-question-container">

                <h3>{state.currQuiz.name}</h3>
                <img style={{ width: "200px", height: "200px", objectFit: "cover", marginTop: "10px", border: "1px solid grey", borderRadius: "5px" }} src={image} alt="" />
                <FileBase64
                    multiple={false}
                    onDone={({ base64 }) => setImage(base64)} />

                <input onChange={(e) => { setNewQuestion(e.target.value) }} className="new-question-input" type="text" placeholder='What is the Question?' value={newQuestion} />

                <div className="choice">
                    <input style={{ border: solution === choice1 ? "2px solid yellowgreen" : "2px solid transparent" }} onChange={(e) => { setChoice1(e.target.value) }} type="text" placeholder='Choice1' value={choice1} />
                    <button onClick={() => {
                        if (choice1.length > 0) setSolution(choice1)
                    }} className="solution">??????</button>
                </div>


                <div className="choice">
                    <input style={{ border: solution === choice2 ? "2px solid yellowgreen" : "2px solid transparent" }} onChange={(e) => { setChoice2(e.target.value) }} type="text" placeholder='Choice2' value={choice2} />
                    <button onClick={() => {
                        if (choice2.length > 0) setSolution(choice2)
                    }} className="solution">??????</button>
                </div>

                <div className="choice">
                    <input style={{ border: solution === choice3 ? "2px solid yellowgreen" : "2px solid transparent" }} onChange={(e) => { setChoice3(e.target.value) }} type="text" placeholder='Choice3' value={choice3} />
                    <button onClick={() => {
                        if (choice3.length > 0) setSolution(choice3)
                    }} className="solution">??????</button>
                </div>

                <div className="choice">
                    <input style={{ border: solution === choice4 ? "2px solid yellowgreen" : "2px solid transparent" }} onChange={(e) => { setChoice4(e.target.value) }} type="text" placeholder='Choice4' value={choice4} />
                    <button onClick={() => {
                        if (choice4.length > 0) setSolution(choice4)
                    }} className="solution">??????</button>
                </div>
                <button
                    style={{ margin: "20px", width: "50%", height: "50px", background: "#f1b238", fontSize: "16px", textShadow: "1px 1px 3px black" }}
                    onClick={() => { addQuestion() }}>Add Question</button>
            </div>
        </div>

    )
}
