import React from 'react'
import "../../styles/login.css"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAlert } from '../../slices/mySlice';

export default function Signup() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    function alert(text, flag) {
        dispatch(setAlert([text, true, flag]))
        setTimeout(() => {
            dispatch(setAlert([text, false, flag]))
        }, 2000)
    }

    const signup = (values) => {
        dispatch(setAlert(["Signing Up...", true, "alert"]))

        const reqOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: values.name,
                email: values.email,
                password: values.password
            })
        }

        fetch("https://mcq-ace.herokuapp.com/auth/signup", reqOptions)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert(data.error, "error")
                } else {
                    dispatch(setAlert(["Sign up successful! Please Login now", true, "alert"]))
                    setTimeout(() => {
                        dispatch(setAlert(["Sign up successful! Please Login now", false, "alert"]))
                    }, 2000)
                    navigate('/login')
                }
            })

    }


    return (
        <div className='login-page'>

            <Formik
                initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
                validate={(values) => {
                    const errors = {};
                    if (!values.name) {
                        errors.name = "Required";
                    }
                    if (!values.email) {
                        errors.email = "Required";
                    }
                    else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                    ) {
                        errors.email = "Invalid Email Address"
                    }
                    if (!values.password) {
                        errors.password = "Required"
                    }
                    if (values.password !== values.confirmPassword) {
                        errors.confirmPassword = "Passwords must match"
                    }
                    return errors;
                }}

                onSubmit={(values, { setSubmitting }) => {
                    setSubmitting(false);
                    signup(values);
                    values.name = ""
                    values.email = "";
                    values.password = "";
                    values.confirmPassword = "";
                }}
            >
                {({ isSubmitting }) => (
                    <Form>

                        <Field
                            placeholder="Enter name"
                            name="name" />
                        <ErrorMessage
                            style={{ color: "orangered" }}
                            name="name"
                            component="div" />

                        <Field
                            placeholder="Enter email"
                            name="email" />
                        <ErrorMessage
                            style={{ color: "orangered" }}
                            name="email"
                            component="div" />


                        <Field
                            placeholder="Enter password"
                            name="password"
                            type="password" />
                        <ErrorMessage
                            style={{ color: "orangered" }}
                            name="password"
                            component="div" />

                        <Field
                            placeholder="Confirm password"
                            name="confirmPassword"
                            type="password" />
                        <ErrorMessage
                            style={{ color: "orangered" }}
                            name="confirmPassword"
                            component="div" />


                        <button
                            style={{ backgroundColor: "orange", fontSize: "16px" }}
                            id="submit-btn"
                            type='submit'
                            disabled={isSubmitting}
                        >
                            Signup
                        </button>

                        <p>Already have an account? <span onClick={() => {
                            navigate("/login")
                        }} style={{ color: "mediumseagreen" }}>Login</span> instead</p>

                    </Form>
                )}
            </Formik>

        </div>
    )
}
