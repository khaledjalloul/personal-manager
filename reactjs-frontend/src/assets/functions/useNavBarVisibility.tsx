import { useState, useEffect } from "react"

export default function useNavBarVisibility() {

    const [navBarElementsVisible, setNavBarElementsVisible] = useState(true)
    const [screenWidth, setScreenWidth] = useState(window.innerWidth)

    const updateDimensions = () => setScreenWidth(window.innerWidth)

    useEffect(() => {
        if (screenWidth < 600 && navBarElementsVisible) setNavBarElementsVisible(false)
        else if (screenWidth > 599 && !navBarElementsVisible) setNavBarElementsVisible(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [screenWidth])

    useEffect(() => {
        window.addEventListener('resize', updateDimensions)
        return (() => {
            window.removeEventListener('resize', updateDimensions)
        })
    }, [])

    return navBarElementsVisible
}