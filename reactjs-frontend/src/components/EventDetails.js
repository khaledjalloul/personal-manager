import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdLocationOn, MdDateRange, MdAccessTime, MdShare, MdOutlineDelete } from "react-icons/md";

const EventDetails = (props) => {
    const location = useLocation()
    const navigate = useNavigate()
    const username = JSON.parse(localStorage.getItem('token')).username

    const { _id, title, eventLocation, dateTime, description, image, creator } = location.state.data

    const [attendees, setAttendees] = useState(location.state.data.attendees)
    const [items, setItems] = useState(location.state.data.items)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [attendingButton, setAttendingButton] = useState(true)

    const dateTimeFormat = new Date(dateTime)

    const attendEvent = async () => {
        await fetch(props.APIURL + '/attendEvent', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: _id, name: username })
        }).then(res => res.json())
            .then(data => setAttendees(data))
    }

    const unAttendEvent = async () => {
        if (attendees.length === 1) setConfirmDelete(true)
        else{
            await fetch(props.APIURL + '/unAttendEvent', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: _id, name: username })
            }).then(res => res.json())
                .then(data => setAttendees(data))
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
        await fetch(props.APIURL + '/checkItem', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: _id, item: event.target.value, available: event.target.checked })
        })
    }

    const deleteEvent = async () => {
        await fetch(props.APIURL + '/deleteEvent', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: _id })
        }).then(res => res.json())
            .then(data => {
                if (data.status === 'success') navigate('/event-planner_react')
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
        <label className='detailsItem' key={item.name}>{item.name}<input type='checkbox' value={item.name} checked={item.available} onChange={checkItem} disabled={attendees.indexOf(username) === -1} /></label>
    )

    return (
        <div id='detailsMainDiv'>
            <img src={image} id="detailsImage" alt={title} />
            <div id='detailsHeader'>
                <div id='detailsTitle'>
                    <p style={{ fontSize: '40px' }}>{title}</p>
                    <p style={{ fontSize: '14px' }}>ID: {_id}</p>
                    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
                        <MdShare className='infoIcon' color='green' size={23} onClick={() => navigator.clipboard.writeText(_id)} />
                        <MdOutlineDelete className='infoIcon' id='deleteButton' color='red' size={23} style={{ marginLeft: '10px', display: username === creator ? 'block' : 'none' }} onClick={e => { setConfirmDelete(!confirmDelete) }} />
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
                        {attendees.indexOf(username) === -1 ?
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
        </div>
    )
}

export default EventDetails