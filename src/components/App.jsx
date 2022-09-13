import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Auth/Login';
import Header from './Header';
import Home from './Home';

export default function App() {
    return (

        <BrowserRouter>

            <Header />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </BrowserRouter>


    )
}
