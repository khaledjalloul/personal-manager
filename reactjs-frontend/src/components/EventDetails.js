import React, { useEffect, useState } from 'react';
import '../styles/eventDetails.css';
import '../styles/notifications.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdLocationOn, MdDateRange, MdAccessTime, MdShare, MdOutlineDelete } from "react-icons/md";
import Loader from "react-loader-spinner";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { useAuth0 } from '@auth0/auth0-react';

const EventDetails = () => {

    const { user } = useAuth0()
    const userID = user.sub
    const username = user.nickname

    const navigate = useNavigate()
    const location = useLocation()

    const [loading, setLoading] = useState(true)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [attendingButton, setAttendingButton] = useState(true)
    const [attendingLoading, setAttendingLoading] = useState(false)
    const [attendees, setAttendees] = useState([])
    const [items, setItems] = useState([])
    const [{ title, eventLocation, dateTime, description, image, creatorID }, setStaticElements] = useState(
        { title: '', eventLocation: '', dateTime: '', description: '', image: '', creatorID: '' }
    )

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
    const _id = location.state._id
    const dateTimeFormat = new Date(dateTime)

    useEffect(() => {
        fetch(BACKEND_URL + '/getEvent/' + _id)
            .then(res => { if (res.ok) return res.json(); else throw new Error(res.status) })
            .then(data => {
                setStaticElements({
                    title: data.event.title,
                    eventLocation: data.event.eventLocation,
                    dateTime: data.event.dateTime,
                    description: data.event.description,
                    image: data.event.image,
                    creatorID: data.event.creatorID
                })
                setAttendees(data.event.attendees)
                setItems(data.event.items)
                setLoading(false)
            })
            .catch(e => { setLoading(false); console.log(e) })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const attendEvent = async () => {
        setAttendingLoading(true)
        fetch(BACKEND_URL + '/attendEvent/' + _id, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, userID: userID })
        })
            .then(res => { if (res.ok) return res.json(); else throw new Error(res.status) })
            .then(data => { setAttendees(data.attendees); setAttendingLoading(false) })
            .catch(e => { setAttendingLoading(false); console.log(e) })
    }

    const unAttendEvent = async () => {
        if (attendees.length === 1) setConfirmDelete(true)
        else {
            setAttendingLoading(true)
            fetch(BACKEND_URL + '/unAttendEvent/' + _id, {
                method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userID: userID })
            })
                .then(res => { if (res.ok) return res.json(); else throw new Error(res.status) })
                .then(data => { setAttendees(data.attendees); setAttendingLoading(false) })
                .catch(e => { setAttendingLoading(false); console.log(e) })
        }
    }

    const checkItem = async (event) => {
        var newItems = items.map(item => {
            if (item.name === event.target.value) {
                item.available = event.target.checked;
                return item
            } else return item
        })
        setItems(newItems)
        fetch(BACKEND_URL + '/checkItem/' + _id, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item: event.target.value, available: event.target.checked })
        })
    }

    const deleteEvent = async () => {
        fetch(BACKEND_URL + '/deleteEvent/' + _id, { method: 'DELETE' })
            .then(res => { if (res.ok) return; else throw new Error(res.status) })
            .then(() => navigate('/event-planner_react'))
            .catch(e => console.log(e))
    }

    const attendeesList = attendees.map(attendee => {
        var displayAttendee = attendee.username
        if (attendee.id === creatorID) displayAttendee = displayAttendee + " (Host)"
        if (attendee.id === userID) displayAttendee = displayAttendee + " (You)"

        return <div className='detailsAttendee' key={attendee.id}>{displayAttendee}</div>
    })

    const itemsList = items.map(item =>
        <label className='detailsItem' key={item.name}>{item.name}
            <input type='checkbox' value={item.name} checked={item.available} onChange={checkItem} disabled={!attendees.some(attendee => attendee.id === userID)} />
        </label>
    )

    return (
        loading ?
            <div style={{ width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader type="TailSpin" color="#004b7d" height='10vh' width='15vw' />
            </div>
            :
            <div id='detailsMainDiv'>
                <img src={image} id="detailsImage" alt={title} />
                <div id='detailsHeader'>
                    <div id='detailsTitle'>
                        <p style={{ fontSize: 'clamp(25px, 3vw, 40px)' }}>{title}</p>
                        <p style={{ fontSize: 'clamp(12px, 1.5vw, 14px)' }}>ID: {_id}</p>
                        <div style={{ marginTop: '5px', display: 'flex', alignItems: 'center' }}>
                            <MdShare className='infoIcon' color='green' size={20}
                                onClick={() => { navigator.clipboard.writeText(_id); NotificationManager.info('Copied to clipboard.', '', 1000) }}
                            />
                            <MdOutlineDelete className='infoIcon' id='deleteButton' color='red' size={20}
                                style={{ marginLeft: '10px', display: userID === creatorID ? 'block' : 'none' }} onClick={e => { setConfirmDelete(!confirmDelete) }}
                            />
                            <input id={confirmDelete ? 'confirmDeleteButton' : 'confirmDeleteButtonHidden'} type='button' value='Confirm Delete' onClick={deleteEvent} />
                        </div>
                    </div>
                    <div id='detailsInfo'>
                        <p>{eventLocation}<MdLocationOn style={{ marginLeft: '10px' }} /></p>
                        <p>{dateTimeFormat.toLocaleDateString()}<MdDateRange style={{ marginLeft: '10px' }} /></p>
                        <p>{dateTimeFormat.toLocaleTimeString()}<MdAccessTime style={{ marginLeft: '10px' }} /></p>
                    </div>
                </div>
                <div id='detailsContent'>
                    <div id='detailsAttendees'>
                        <p style={{ fontFamily: 'Helvetica', fontSize: '20px', paddingBottom: '20px' }}>Attendees ({attendees.length})</p>
                        <div id='detailsSubAttendees'>
                            {attendeesList}
                        </div>
                        {attendingLoading ?
                            <Loader type="TailSpin" color="#004b7d" height='30px' style={{}} />
                            :
                            !attendees.some(attendee => attendee.id === userID) ?
                                <input type='button' id='attendButton' value='Attend Event' style={{ marginTop: 'auto' }} onClick={attendEvent} />
                                :
                                <input type='button' id='attendButton'
                                    value={attendingButton ? 'Attending' : 'Leave Event'}
                                    style={{ marginTop: 'auto', backgroundColor: attendingButton ? 'rgba(0, 200, 75, 0.8)' : 'rgb(255, 50, 50)' }}
                                    onMouseEnter={() => setAttendingButton(false)} onMouseLeave={() => setAttendingButton(true)} onClick={unAttendEvent} />
                        }

                    </div>
                    <div id='detailsDescription'>
                        <p style={{ fontFamily: 'Helvetica', fontSize: '20px', paddingBottom: '20px' }}>Description</p>
                        <p style={{ fontFamily: 'Helvetica', width: '95%', flex: '1 1 auto', overflowY: 'auto' }}>{description}</p>
                    </div>
                    <div id='detailsItems'>
                        <p style={{ fontFamily: 'Helvetica', fontSize: '20px', paddingBottom: '20px' }}>Bring Along</p>
                        <div id='detailsSubItems'>
                            {itemsList}
                        </div>
                    </div>
                </div>
                <NotificationContainer />
            </div>
    )
}

export default EventDetails