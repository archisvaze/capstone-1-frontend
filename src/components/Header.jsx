import React from 'react';
import "../styles/header.css"
import { useSelector, useDispatch } from 'react-redux';
import { setTab, setLogout } from '../slices/mySlice';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const state = useSelector((state) => state.myState)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    return (
        <header>
            <div className="header-container">
                <div style={{ top: state.alert[1] === true ? "90px" : "-10vh", backgroundColor: state.alert[2] === "error" ? "red" : "blue" }} className="alert">{state.alert[0]}</div>
                <div className="header-logo">QUIZAPP</div>
                <nav style={{ display: state.isLoggedIn === true ? "flex" : "none" }}>
                    <button onClick={() => {
                        dispatch(setTab("My Quizes"))
                        navigate("/")
                    }}>My Quizes</button>

                    <button onClick={() => {
                        dispatch(setTab("My Reports"))
                        navigate("/")
                    }}>My Reports</button>
                </nav>
                <button
                    onClick={() => {
                        dispatch(setLogout())
                        navigate("/login")
                    }}
                    style={{ display: state.isLoggedIn === true ? "flex" : "none" }} className="logout-btn">Logout</button>
            </div>
        </header >
    )
}
