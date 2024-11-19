import React, { useState } from "react";
import './CSS/LoginSignup.css'

const LoginSignup = () => {

    const [state,setState] = useState("Login")
    const [formData,setFormData] = useState({
        username : "",
        password : "",
        email : ""
    
    })

    const handleInputChange = (e) => {
        const {name,value} = e.target;
        setFormData({
            ...formData,
            [name]:value
        })
    }

    const login = async () => {
        console.log("Login function executed",formData)
        console.log("SignUp function executed",formData)
        let responseData;
        await fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: {
                Accept: 'application/form-data',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }).then(response => response.json()).then(data => {
                responseData = data;
                // console.log(responseData.data.Token)
            });
        if (responseData.success) {
            localStorage.setItem('auth_token', responseData.data.Token);
            console.log(localStorage.auth_token);
            window.location.replace('/');
        }else{
            alert(responseData.errors);
        }
    }

    const signUp = async () => {
        console.log("SignUp function executed",formData)
        let responseData;
        await fetch('http://localhost:4000/signup', {
            method: 'POST',
            headers: {
                Accept: 'application/form-data',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }).then(response => response.json()).then(data => {
                responseData = data;
            });
        if (responseData.success) {
            localStorage.setItem('auth_token', responseData.token);
            window.location.replace('/');
        }else{
            alert(responseData.errors);
        }
    }

    return (
        <div className="loginsignup">
            <div className="loginsignup-container">
                <h1>{state}</h1>
                <div className="loginsignup-fields">
                    {state ==="Sign Up"? <input name="username" value={formData.username} onChange={handleInputChange} type="text" placeholder="Your Name" />:<></>}
                    <input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="Email Address"/>
                    <input name="password" value={formData.password} onChange={handleInputChange} type="password" placeholder="Password"/>
                </div>
                <button onClick={() => {
                    state === "Login"? login():signUp()}}>
                        Continue</button>
                {state ==="Sign Up"?   <p className="loginsignup-login">Already have an account? <span onClick={() => {
                    setState("Login")}}> Login here</span></p>:
                  <p className="loginsignup-login">Create an account? <span onClick={() =>{ setState("Sign Up")}}> Click here</span></p>}

                <div className="loginsignup-agree">
                    <input type="checkbox" name="" id="" />
                    <p>By continuing, I agree to the terms of use & privacy policy.</p>
                </div>
            </div>

        </div>
    )
}

export default LoginSignup