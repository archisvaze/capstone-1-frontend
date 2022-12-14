import React from 'react';
import "../styles/header.css"
import { useSelector, useDispatch } from 'react-redux';
import { setTab, setLogout, setAlert } from '../slices/mySlice';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const state = useSelector((state) => state.myState)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function alert(text, flag) {
        dispatch(setAlert([text, true, flag]))
        setTimeout(() => {
            dispatch(setAlert([text, false, flag]))
        }, 2000)
    }
    return (
        <header>
            <div
                style={{ justifyContent: state.isLoggedIn === true ? "space-between" : "center" }}
                className="header-container">
                <div style={{ top: state.alert[1] === true ? "90px" : "-20vh", backgroundColor: state.alert[2] === "error" ? "crimson" : "mediumseagreen" }} className="alert">{state.alert[0]}</div>
                <h1 onClick={() => {
                    window.open("https://mcqace.netlify.app/", "_self")
                }} style={{ textAlign: "center", cursor: "pointer" }} className="header-logo">MCQ-Ace</h1>
                <nav style={{ display: state.isLoggedIn === true ? "flex" : "none" }}>
                    <button
                        style={{ color: "black", fontWeight: "bold", fontSize: "12px", transform: state.tab === "My Quizes" ? "translateY(4px)" : "translateY(0)", boxShadow: state.tab === "My Quizes" ? "0 5px #ffffff33" : "0 9px #ffffff4d" }}
                        onClick={() => {
                            dispatch(setTab("My Quizes"))
                            navigate("/home")
                        }}>My Quizes</button>

                    <button
                        style={{ color: "black", fontWeight: "bold", fontSize: "12px", transform: state.tab === "My Reports" ? "translateY(4px)" : "translateY(0)", boxShadow: state.tab === "My Reports" ? "0 5px #ffffff33" : "0 9px #ffffff4d" }}
                        onClick={() => {
                            dispatch(setTab("My Reports"))
                            navigate("/home")
                        }}>My Reports</button>
                </nav>
                <button
                    onClick={() => {
                        alert("Logging Out...", "error")
                        setTimeout(() => {
                            dispatch(setLogout())
                            navigate("/login")
                        }, 1000)
                    }}
                    style={{ display: state.isLoggedIn === true ? "flex" : "none", fontSize: "12px", background: "crimson" }} className="logout-btn">Logout</button>
            </div>
        </header >
    )
}
