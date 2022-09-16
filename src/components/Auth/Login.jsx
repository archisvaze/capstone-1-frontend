import React from 'react'
import "../../styles/login.css"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLogin, setAlert } from '../../slices/mySlice';

export default function Login() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  function alert(text, flag) {
    dispatch(setAlert([text, true, flag]))
    setTimeout(() => {
      dispatch(setAlert([text, false, flag]))
    }, 2000)
  }

  const login = (values) => {
    dispatch(setAlert(["Loging In...", true, "alert"]))

    const reqOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    }

    fetch("http://localhost:8000/auth/login", reqOptions)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error, "error")
        } else {
          dispatch(setAlert(["Logged In!", true, "alert"]))
          setTimeout(() => {
            dispatch(setAlert(["Logged In!", false, "alert"]))
          }, 2000)
          dispatch(setLogin(data))
          navigate('/home')
        }
      })

  }


  return (
    <div className='login-page'>

      <Formik
        initialValues={{ email: "", password: "" }}
        validate={(values) => {
          const errors = {};
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
          return errors;
        }}

        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);
          login(values);

          values.email = "";
          values.password = "";
        }}
      >
        {({ isSubmitting }) => (
          <Form>

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

            <button
              style={{ backgroundColor: "mediumseagreen", fontSize: "16px" }}
              id="submit-btn"
              type='submit'
              disabled={isSubmitting}
            >
              Login
            </button>

          </Form>
        )}
      </Formik>

    </div>
  )
}
