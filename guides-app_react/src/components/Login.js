import React, { useState } from 'react'

const Login = ({ setToken }) => {

    const [loginUsername, setLoginUsername] = useState()
    const [loginPassword, setLoginPassword] = useState()
    const [registerUsername, setRegisterUsername] = useState()
    const [registerPassword, setRegisterPassword] = useState()

    const login = async (creds) => {
        return fetch("http://localhost:3737/login", {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(creds)
        }).then(data => data.json())
    }

    const handleRegister = async e => {
        e.preventDefault();
        await fetch("http://localhost:3737/register", {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({registerUsername, registerPassword})
        }).then(data => console.log(data))
    }

    const handleLogin = async e => {
        e.preventDefault();
        const token = await login({
            loginUsername, loginPassword
        })
        if (token.token)
            setToken({token: token.token, username: loginUsername});
        else console.log("Invalid username or password")
    }

    return (
        <div id='loginMainDiv'>
            <form onSubmit={handleLogin} className='loginForm'>
                <p className='loginTitle'>Sign In</p>
                <input className='loginTextField' type='text' placeholder='Username' onChange={e => setLoginUsername(e.target.value)} />
                <input className='loginTextField' type='password' placeholder='Password' onChange={e => setLoginPassword(e.target.value)} />
                <button className='loginButton' type='submit'>Sign In</button>
            </form>
            <div id='loginDivider'>
                <div style={{height: '30vh', borderLeft: 'solid 1px black'}}/>
                <p style={{height: '7vh', display: 'flex', alignItems: 'center', fontFamily: 'Helvetica'}}>or</p>
                <div style={{height: '30vh', borderLeft: 'solid 1px black'}}/>
            </div>
            <form onSubmit={handleRegister} className='loginForm'>
                <p className='loginTitle'>Register</p>
                <input className='loginTextField' type='text' placeholder='Username' onChange={e => setRegisterUsername(e.target.value)} />
                <input className='loginTextField' type='password' placeholder='Password' onChange={e => setRegisterPassword(e.target.value)} />
                <input className='loginTextField' type='password' placeholder='Repeat Password' onChange={e => setRegisterPassword(e.target.value)} />
                <button className='loginButton' type='submit'>Register</button>
            </form>
        </div>
    )
}

export default Login