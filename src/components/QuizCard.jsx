import React from 'react'
import "../styles/myquizes.css"

export default function QuizCard(props) {
    let obj = props.obj;
    return (
        <div className='quiz-card'>
            <h3 className="quiz-title">{obj.name}</h3>
            <p>Number of Questions: {obj.questions.length}</p>
        </div>
    )
}
