import React, { useEffect, useState } from 'react'
import Loader from "react-loader-spinner";
import { useNavigate } from "react-router-dom"
import { MdLocationOn, MdDateRange, MdAccessTime } from "react-icons/md";

const EventCard = (props) => {
    const navigate = useNavigate()
    const date = new Date(props.data.time)
    return (
        <div className="cardMainDiv" onClick={() => { navigate('/eventDetails', { state: { data: props.data } }) }}>
            <img src={props.data.image} className="cardImg" alt={props.data.title} />
            <div className="cardSubDiv">
                <p style={{ fontWeight: 'bold' }}>{props.data.title}</p>
                <hr style={{ marginRight: '15%', marginLeft: '15%' }} />
                <div className='cardSubSubDiv'>
                    <p><MdLocationOn style={{marginRight: '4px'}}/> {props.data.location}</p>
                    <p><MdDateRange style={{marginRight: '4px'}}/> {date.toLocaleDateString()}</p>
                    <p><MdAccessTime style={{marginRight: '4px'}}/> {date.toLocaleTimeString()}</p>
                </div>
            </div>
        </div>
    )
}

const Home = () => {
    const [loading, setLoading] = useState(true)
    const [events, setEvents] = useState([])

    useEffect(() => {
        // fetch("https://guides-app-node-server.herokuapp.com/fetchGuides")
        fetch('http://localhost:3737/getEvents')
            .then(res => res.json())
            .then((result) => {
                setEvents(result[0])
                setLoading(false)
                console.log(result[0])
            })
    }, [])

    var eventCards = events.map(event =>
        <EventCard
            data={{
                title: event.title,
                location: event.location,
                time: event.time,
                attendees: event.attendees,
                items: event.items,
                image: event.image
            }}
        />)

    return (
        loading ?
            <div style={{ height: 'calc(100vh - 110px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader type="TailSpin" color="#004b7d" height='10vh' width='15vw' />
            </div>
            :
            <div align="center" className="listDiv">
                {eventCards}
            </div>
    )

}

export default Home