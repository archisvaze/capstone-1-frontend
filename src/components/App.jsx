import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Auth/Login';
import EditQuiz from './EditQuiz';
import Header from './Header';
import Home from './Home';
import StudentRoom from "./Rooms/StudentRoom"
import TeacherRoom from "./Rooms/TeacherRoom"

export default function App() {
    return (

        <BrowserRouter>

            <Header />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route path="/:id" element={<EditQuiz />} />
                <Route path="/room/:quizID" element={<StudentRoom />} />
                <Route path="/teachers_room/:quizID" element={<TeacherRoom />} />
            </Routes>
        </BrowserRouter>


    )
}
