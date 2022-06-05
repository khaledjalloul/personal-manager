import { useState } from "react"

export default function useToken() {

    const getToken = () => {
        const tokenString = localStorage.getItem('token')
        const token = JSON.parse(tokenString)
        return token?.token
    }

    const [token, setToken] = useState(getToken())

    const saveToken = (token) => {
        localStorage.setItem('token', JSON.stringify(token))
        setToken(token?.token)
    }

    return {
        setToken: saveToken,
        token
    }
}

