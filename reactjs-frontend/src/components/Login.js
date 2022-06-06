import React, { useState } from 'react'
import '../styles/login.css';
import Loader from "react-loader-spinner";

const Login = ({ setToken, APIURL }) => {

    const [loginUsername, setLoginUsername] = useState()
    const [loginPassword, setLoginPassword] = useState()
    const [loginStatus, setLoginStatus] = useState(0) //status = ['default', 'loading', 'failed']

    const [registerUsername, setRegisterUsername] = useState()
    const [registerPassword, setRegisterPassword] = useState()
    const [repeatedPassword, setRepeatedPassword] = useState()
    const [registerStatus, setRegisterStatus] = useState(0)//status = ['default', 'loading', 'success', 'invalidUsername', 'invalidPassword', 'passwordMismatch, 'failed']

    const handleLogin = async e => {
        e.preventDefault();
        setLoginStatus(1)
        fetch(APIURL + '/login', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ loginUsername, loginPassword })
        }).then(res => res.json())
            .then(data => {
                if (data.success) { setLoginStatus(0); setToken({ token: data.token, username: loginUsername }) }
                else setLoginStatus(2)
            })
    }

    const handleRegister = async e => {
        e.preventDefault();
        setRegisterStatus(1)
        if (registerUsername.indexOf(' ') !== -1 || registerUsername.length < 6) setRegisterStatus(3)
        if (registerPassword.indexOf(' ') !== -1 || registerPassword.length < 6) setRegisterStatus(4)
        else if (registerPassword !== repeatedPassword) setRegisterStatus(5)
        else {
            fetch(APIURL + '/register', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ registerUsername, registerPassword })
            }).then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setRegisterStatus(2)
                        setRegisterUsername('')
                        setRegisterPassword('')
                        setRepeatedPassword('')
                    }
                    else setRegisterStatus(4)
                })
        }
    }

    return (
        <div id='loginMainDiv'>
            <form onSubmit={handleLogin} className='loginForm'>
                <p className='loginTitle'>Sign In</p>
                <input className='loginTextField' type='text' placeholder='Username' onChange={e => setLoginUsername(e.target.value)} required />
                <input className='loginTextField' type='password' placeholder='Password' onChange={e => setLoginPassword(e.target.value)} required />
                {loginStatus === 1 ?
                    <Loader type="TailSpin" color="#004b7d" height='50px' style={{ marginTop: 'auto' }} />
                    :
                    <button className='loginButton' type='submit'>Sign In</button>
                }
                <p style={{ fontFamily: 'Helvetica', color: 'red', position: 'absolute', bottom: '-40px' }}>{loginStatus === 2 ? 'Invalid username or password.' : ''}</p>

            </form>
            <div id='loginDivider'>
                <div style={{ height: '30vh', borderLeft: 'solid 1px black' }} />
                <p style={{ height: '7vh', display: 'flex', alignItems: 'center', fontFamily: 'Helvetica' }}>or</p>
                <div style={{ height: '30vh', borderLeft: 'solid 1px black' }} />
            </div>
            <form onSubmit={handleRegister} className='loginForm'>
                <p className='loginTitle'>Register</p>
                <input className='loginTextField' type='text' value={registerUsername} placeholder='Username' onChange={e => setRegisterUsername(e.target.value)} required />
                <input className='loginTextField' type='password' value={registerPassword} placeholder='Password' onChange={e => setRegisterPassword(e.target.value)} required />
                <input className='loginTextField' type='password' value={repeatedPassword} placeholder='Repeat Password' onChange={e => setRepeatedPassword(e.target.value)} required />
                {registerStatus === 1 ?
                    <Loader type="TailSpin" color="#004b7d" height='50px' style={{ marginTop: 'auto' }} />
                    :
                    <button className='loginButton' type='submit'>Register</button>
                }
                <p style={{ fontFamily: 'Helvetica', color: registerStatus === 2 ? 'black' : 'red', position: 'absolute', bottom: '-40px' }}>
                    {registerStatus === 2 ? 'Registered successfully.' :
                        registerStatus === 3 ? 'Username must be at least 6 characters with no spaces.' :
                            registerStatus === 4 ? 'Password must be at least 6 characters with no spaces.' :
                                registerStatus === 5 ? 'Passwords do not match.' :
                                    registerStatus === 6 ? 'Unknown error occured.' : ''}
                </p>
            </form>
        </div>
    )
}

export default Login