import React, { useEffect, useState } from 'react';
import '../styles/eventDetails.css';
import '../styles/notifications.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdLocationOn, MdDateRange, MdAccessTime, MdShare, MdOutlineDelete } from "react-icons/md";
import Loader from "react-loader-spinner";
import { NotificationContainer, NotificationManager } from 'react-notifications';

const EventDetails = (props) => {
    const location = useLocation()
    const navigate = useNavigate()
    const username = JSON.parse(localStorage.getItem('token')).username

    const _id = location.state._id

    const [confirmDelete, setConfirmDelete] = useState(false)
    const [attendingButton, setAttendingButton] = useState(true)
    const [attendingLoading, setAttendingLoading] = useState(false)
    const [attendees, setAttendees] = useState([])
    const [items, setItems] = useState([])
    const [{ title, eventLocation, dateTime, description, image, creator }, setStaticElements] = useState(
        { title: '', eventLocation: '', dateTime: '', description: '', image: '', creator: '' }
    )
    const dateTimeFormat = new Date(dateTime)

    useEffect(() => {
        fetch(props.APIURL + '/getEvent/' + _id)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setStaticElements({
                        title: data.event.title,
                        eventLocation: data.event.eventLocation,
                        dateTime: data.event.dateTime,
                        description: data.event.description,
                        image: data.event.image,
                        creator: data.event.creator
                    })
                    setAttendees(data.event.attendees)
                    setItems(data.event.items)
                }
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const attendEvent = async () => {
        setAttendingLoading(true)
        fetch(props.APIURL + '/attendEvent/' + _id, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: username })
        }).then(res => res.json())
            .then(data => {
                if (data.success) { setAttendees(data.attendees); setAttendingLoading(false); }
            })
    }

    const unAttendEvent = async () => {
        if (attendees.length === 1) setConfirmDelete(true)
        else {
            setAttendingLoading(true)
            fetch(props.APIURL + '/unAttendEvent/' + _id, {
                method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: username })
            }).then(res => res.json())
                .then(data => {
                    if (data.success) { setAttendees(data.attendees); setAttendingLoading(false) }
                })
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
        fetch(props.APIURL + '/checkItem/' + _id, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item: event.target.value, available: event.target.checked })
        })
    }

    const deleteEvent = async () => {
        fetch(props.APIURL + '/deleteEvent/' + _id, { method: 'DELETE' })
            .then(res => res.json())
            .then(data => {
                if (data.success) navigate('/event-planner_react')
            })
    }

    const attendeesList = attendees.map(attendee => {
        var displayAttendee = attendee
        if (attendee === creator) displayAttendee = displayAttendee + " (Host)"
        if (attendee === username) displayAttendee = displayAttendee + " (You)"

        return <div className='detailsAttendee' key={attendee}>{displayAttendee}</div>
    }
    )
    const itemsList = items.map(item =>
        <label className='detailsItem' key={item.name}>{item.name}
            <input type='checkbox' value={item.name} checked={item.available} onChange={checkItem} disabled={attendees.indexOf(username) === -1} />
        </label>
    )

    return (
        <div id='detailsMainDiv'>
            <img src={image} id="detailsImage" alt={title} />
            <div id='detailsHeader'>
                <div id='detailsTitle'>
                    <p style={{ fontSize: '40px' }}>{title}</p>
                    <p style={{ fontSize: '14px' }}>ID: {_id}</p>
                    <div style={{ marginTop: '5px', display: 'flex', alignItems: 'center' }}>
                        <MdShare className='infoIcon' color='green' size={23}
                            onClick={() => { navigator.clipboard.writeText(_id); NotificationManager.info('Copied to clipboard.', '', 1000) }}
                        />
                        <MdOutlineDelete className='infoIcon' id='deleteButton' color='red' size={23}
                            style={{ marginLeft: '10px', display: username === creator ? 'block' : 'none' }} onClick={e => { setConfirmDelete(!confirmDelete) }}
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
            <div style={{ height: '80%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div id='detailsContent'>
                    <div id='detailsAttendees'>
                        <p style={{ fontFamily: 'Helvetica', fontSize: '20px', paddingBottom: '20px' }}>Attendees ({attendees.length})</p>
                        <div id='detailsSubAttendees'>
                            {attendeesList}
                        </div>
                        {attendingLoading ?
                            <Loader type="TailSpin" color="#004b7d" height='30px' style={{}} />
                            :
                            attendees.indexOf(username) === -1 ?
                                <input type='button' id='attendButton' value='Attend Event' style={{ marginTop: 'auto' }} onClick={attendEvent} />
                                :
                                <input type='button' id={attendingButton ? 'attending' : 'unAttendButton'}
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
            </div>
            <NotificationContainer />
        </div>
    )
}

export default EventDetails