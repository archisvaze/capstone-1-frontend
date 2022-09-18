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
                // eslint-disable-next-line
                time -= 1;
                setTime(time);
                // eslint-disable-next-line
                percent = time + "vw"
            }, 50.0)

            return () => {
                clearTimeout(timer)
            }
        }
        // eslint-disable-next-line
    }, [time])


    if (time <= 20) color = "crimson";
    if (time >= 21 && time <= 50) color = "#f1b238";
    if (time >= 51) color = "mediumseagreen"

    return (
        <div style={{ display: quizStatus === "started" ? "flex" : "none" }} className='timer'>
            <div className="timer-bar" style={{ width: percent, background: color }}></div>

        </div>
    )
}
