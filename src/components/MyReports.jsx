import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLogout, setAlert } from '../slices/mySlice';
import "../styles/myreports.css"

export default function MyReports() {
    const state = useSelector((state) => state.myState);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //variables
    const [reports, setreports] = useState([])

    // function to show alerts
    function alert(text, flag) {
        dispatch(setAlert([text, true, flag]))
        setTimeout(() => {
            dispatch(setAlert([text, false, flag]))
        }, 2000)
    }

    useEffect(() => {
        getAllReports();
        // eslint-disable-next-line
    }, [state.alert])

    const getAllReports = async () => {
        // console.log(state)
        fetch(`https://mcq-ace.herokuapp.com/report/${state.teacher._id}`, { method: "get", headers: { "Authorization": `Bearer ${state.teacher.token}` } })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert(data.error, "error")
                }
                // eslint-disable-next-line
                if (state.teacher._id == undefined || state.isLoggedIn === false) {

                    //if unauthorized access
                    dispatch(setLogout());
                    navigate("/login")
                    return;
                }
                else {
                    console.log(data)
                    setreports(data);
                }

            })
    }

    const deleteReport = async (reportID) => {
        dispatch(setAlert(["Deleting Report...", true, "alert"]))
        fetch(`https://mcq-ace.herokuapp.com/report/delete/${reportID}`, { method: "get", headers: { "Authorization": `Bearer ${state.teacher.token}` } })
            .then(res => res.json())
            .then(data => {
                if (data.message) {
                    alert("Report was Deleted!", "alert")
                }
            })
    }


    return (
        <div className='my-reports-page'>

            <h2>My Reports</h2>

            <div className="rp-reports-container">
                {reports?.map(obj => {
                    return (
                        <div key={obj?._id} className="rp-report-container">

                            <button onClick={() => {
                                deleteReport(obj?._id)
                            }} className="rp-delete-btn">X</button>


                            {/* Report Card */}
                            <p className="rp-quiz-name">Quiz Name: <span>{obj?.quiz?.name}</span></p>
                            <p className="rp-date">Date: <span>{obj?.createdAt?.split("T")[0]}</span></p>
                            <p className="rp-scoreboard">Score Board</p>
                            <div className="rp-report">
                                {obj?.report?.map(rp => {
                                    return (
                                        <div key={rp[0]}>
                                            <p>{rp[0]}</p>
                                            <p>{rp[1]}/{obj.question_count}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
