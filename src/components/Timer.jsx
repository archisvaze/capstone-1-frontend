import React, { useEffect } from 'react'

export default function Timer(props) {
    let time = props.time;
    let setTime = props.setTime;
    let percent = time + "vw";
    let color = ""
    let quizStatus = props.quizStatus;

    useEffect(() => {
        // console.log(time)
        if (time > 0) {
            const timer = setTimeout(() => {
                time -= 1;
                setTime(time);
                percent = time + "vw"
            }, 50.0)

            return () => {
                clearTimeout(timer)
            }
        }
    }, [time])


    if (time <= 20) color = "red";
    if (time >= 21 && time <= 50) color = "yellow";
    if (time >= 51) color = "yellowgreen"


    return (
        <div style={{display: quizStatus === "started" ? "flex": "none"}} className='timer'>
            <div className="timer-bar" style={{ width: percent, background: color }}></div>

        </div>
    )
}
