import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Auth/Login';
import EditQuiz from './EditQuiz';
import Header from './Header';
import Home from './Home';

export default function App() {
    return (

        <BrowserRouter>

            <Header />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route path="/:id" element={<EditQuiz />} />
            </Routes>
        </BrowserRouter>


    )
}
