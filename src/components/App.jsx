import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Auth/Login';
import EditQuiz from './EditQuiz';
import Header from './Header';
import Home from './Home';
import StudentRoom from "./Rooms/StudentRoom"
import TeacherRoom from "./Rooms/TeacherRoom"
import StudentHome from './StudentHome';
import socket from "../socketConfig";
import { useDispatch } from 'react-redux';
import { setClientID } from '../slices/mySlice';
import Signup from './Auth/Signup';

export default function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        socket.on("react-connection", (data) => {
            dispatch(setClientID(data))
        })
        // eslint-disable-next-line
    }, [])


    return (
        <BrowserRouter>

            <Header />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/home" element={<Home />} />
                <Route path="/:id" element={<EditQuiz />} />
                <Route path="/room/:quizID" element={<StudentRoom />} />
                <Route path="/teachers_room/:quizID" element={<TeacherRoom />} />
                <Route path="/" element={<StudentHome />} />
            </Routes>

        </BrowserRouter>
    )
}
