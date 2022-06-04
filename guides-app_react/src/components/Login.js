import React, { useState } from 'react'

const Login = ({ setToken }) => {

    const [username, setUserName] = useState()
    const [password, setPassword] = useState()

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
            body: JSON.stringify({username, password})
        }).then(data => console.log(data))
    }

    const handleLogin = async e => {
        e.preventDefault();
        const token = await login({
            username, password
        })
        if (token.token)
            setToken({token: token.token, username: username});
        else console.log("Invalid username or password")
    }

    return (
        <div style={{ width: '100vw' }}>
            <form onSubmit={handleRegister}>
                <input type='text' onChange={e => setUserName(e.target.value)} />
                <input type='password' onChange={e => setPassword(e.target.value)} />
                <button type='submit'>Register</button>
            </form>
            <form onSubmit={handleLogin}>
                <input type='text' onChange={e => setUserName(e.target.value)} />
                <input type='password' onChange={e => setPassword(e.target.value)} />
                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}

export default Login