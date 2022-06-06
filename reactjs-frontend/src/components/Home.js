import React, { useEffect, useState } from 'react'
import '../styles/home.css';
import Loader from "react-loader-spinner";
import { useNavigate } from "react-router-dom"
import { MdLocationOn, MdDateRange, MdAccessTime } from "react-icons/md";

const EventCard = (props) => {

    const navigate = useNavigate()
    const dateTime = new Date(props.data.dateTime)

    return (
        <div className="cardDiv" onClick={() => { navigate('/event-planner_react/eventDetails', { state: { _id: props.data._id } }) }}>
            <img src={props.data.image} className="cardImage" alt={props.data.title} />
            <div className="cardInfoDiv">
                <p style={{ fontWeight: 'bold', alignSelf: 'center' }}>{props.data.title}</p>
                <div style={{ width: '70%', borderTop: 'solid 2px black', alignSelf: 'center', marginTop: '10px', marginBottom: '10px' }} />
                <div className='cardInfoSubDiv'>
                    <p><MdLocationOn style={{ marginRight: '4px' }} /> {props.data.eventLocation}</p>
                    <p><MdDateRange style={{ marginRight: '4px' }} /> {dateTime.toLocaleDateString()}</p>
                    <p><MdAccessTime style={{ marginRight: '4px' }} /> {dateTime.toLocaleTimeString()}</p>
                </div>
            </div>
        </div>
    )
}

const Home = ({ setToken, APIURL }) => {

    setToken(JSON.parse(localStorage.getItem('token')))
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [events, setEvents] = useState([])
    const [searchID, setSearchID] = useState()
    const [searchLoading, setSearchLoading] = useState(false)

    useEffect(() => {
        fetch(APIURL + '/getEvents/' + JSON.parse(localStorage.getItem('token')).username)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setEvents(data.events)
                    setLoading(false)
                }
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    var eventCards = events.map(event =>
        <EventCard
            key={event._id}
            data={{
                _id: event._id,
                title: event.title,
                eventLocation: event.eventLocation,
                dateTime: event.dateTime,
                description: event.description,
                attendees: event.attendees,
                items: event.items,
                image: event.image,
                creator: event.creator
            }}
        />)

    const searchForEvent = async e => {
        e.preventDefault()
        setSearchLoading(true)
        fetch(APIURL + '/getEvent/' + searchID)
            .then(res => res.json())
            .then(data => {
                setSearchLoading(false)
                if (data.success) navigate('/event-planner_react/eventDetails', { state: { _id: data.event._id } })
            })
    }

    return (
        loading ?
            <div style={{ width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader type="TailSpin" color="#004b7d" height='10vh' width='15vw' />
            </div>
            :
            eventCards.length === 0 ?
                <div>
                    <div className='searchEventDiv' style={{ width: '100vw', height: '100%' }}>
                        <p style={{ fontFamily: 'Helvetica' }}>
                            You're not attending any events. Join one by pasting its ID below.
                        </p>
                        <form onSubmit={searchForEvent} className='searchEventSubDiv' style={{ marginTop: '20px' }}>
                            <input type='text' placeholder='Event ID' onChange={e => setSearchID(e.target.value)} required />
                            {searchLoading ?
                                <Loader type="TailSpin" color="#004b7d" height='20px' />
                                :
                                <input type='submit' value='Search' />
                            }
                        </form>
                    </div>
                </div>
                :
                <div id="homeMainDiv">
                    <div id='homeCardListDiv'>
                        {eventCards}
                    </div>
                    <div className='searchEventDiv'>
                        <p style={{ fontFamily: 'Helvetica', color: 'grey', fontSize: '14px' }}>
                            Join an existing event by pasting its ID below.
                        </p>
                        <form onSubmit={searchForEvent} className='searchEventSubDiv'>
                            <input type='text' placeholder='Event ID' onChange={e => setSearchID(e.target.value)} required />
                            {searchLoading ?
                                <Loader type="TailSpin" color="#004b7d" height='20px' />
                                :
                                <input type='submit' value='Search' />
                            }
                        </form>
                    </div>
                </div>

    )
}

export default Home