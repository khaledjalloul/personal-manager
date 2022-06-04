import React, { useEffect, useState } from 'react'
import Loader from "react-loader-spinner";
import { useNavigate } from "react-router-dom"
import { MdLocationOn, MdDateRange, MdAccessTime } from "react-icons/md";

const EventCard = (props) => {
    const navigate = useNavigate()
    const dateTime = new Date(props.data.dateTime)
    return (
        <div className="cardDiv" onClick={() => { navigate('/eventDetails', { state: { data: props.data } }) }}>
            <img src={props.data.image} className="cardImage" alt={props.data.title} />
            <div className="cardInfoDiv">
                <p style={{ fontWeight: 'bold', alignSelf: 'center' }}>{props.data.title}</p>
                <div style={{width: '70%', borderTop: 'solid 2px black', alignSelf: 'center', marginTop: '10px', marginBottom: '10px'}} />
                <div className='cardInfoSubDiv'>
                    <p><MdLocationOn style={{marginRight: '4px'}}/> {props.data.eventLocation}</p>
                    <p><MdDateRange style={{marginRight: '4px'}}/> {dateTime.toLocaleDateString()}</p>
                    <p><MdAccessTime style={{marginRight: '4px'}}/> {dateTime.toLocaleTimeString()}</p>
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
                setEvents(result)
                setLoading(false)
            })
    }, [])

    var eventCards = events.map(event =>
        <EventCard
            data={{
                id: event._id,
                title: event.title,
                eventLocation: event.location,
                dateTime: event.dateTime,
                description: event.description,
                attendees: event.attendees,
                items: event.items,
                image: event.image,
                creator: event.creator
            }}
        />)

    return (
        loading ?
            <div style={{ width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader type="TailSpin" color="#004b7d" height='10vh' width='15vw' />
            </div>
            :
            <div id="homeMainDiv">
                {eventCards}
            </div>
    )

}

export default Home