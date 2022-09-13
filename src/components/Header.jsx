import React from 'react';
import "../styles/header.css"
import { useSelector, useDispatch } from 'react-redux';
import { setTab } from '../slices/mySlice';

export default function Header() {
    const state = useSelector((state) => state.myState)
    const dispatch = useDispatch();
    console.log(state)
    return (
        <header>
            <div className="header-container">
                <div className="header-logo">QUIZAPP</div>
                <nav style={{ display: state.isLoggedIn === true ? "flex" : "none" }}>
                    <button onClick={() => dispatch(setTab("My Quizes"))}>My Quizes</button>

                    <button onClick={() => dispatch(setTab("My Reports"))}>My Reports</button>
                </nav>
                <button
                    style={{ display: state.isLoggedIn === true ? "flex" : "none" }} className="logout-btn">Logout</button>
            </div>
        </header >
    )
}
