import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MdLocationOn, MdDateRange, MdAccessTime } from "react-icons/md";

const EventDetails = () => {
    const location = useLocation()
    const username = JSON.parse(localStorage.getItem('token')).username

    const { id, title, eventLocation, dateTime, description, image, creator } = location.state.data

    const [attendees, setAttendees] = useState(location.state.data.attendees)
    const [items, setItems] = useState(location.state.data.items)

    const dateTimeFormat = new Date(dateTime)

    const attendEvent = async () => {
        await fetch('http://localhost:3737/attendEvent', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, name: username })
        }).then(res => res.json())
            .then(data => setAttendees(data))
    }

    const checkItem = async (event) => {
        var newItems = items.map(item => {
            if (item.name === event.target.value) {
                item.available = event.target.checked;
                return item
            } else return item
        })
        setItems(newItems)
        await fetch('http://localhost:3737/checkItem', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, item: event.target.value, available: event.target.checked })
        })
    }

    const attendeesList = attendees.map(attendee => {
        if (attendee === creator) attendee = attendee + " (Host)"
        if (attendee === username) attendee = attendee + " (You)"

        return <div className='detailsAttendee'>{attendee}</div>
    }
    )
    const itemsList = items.map(item =>
        <label className='detailsItem'>{item.name}<input type='checkbox' value={item.name} checked={item.available} onChange={checkItem} /></label>
    )

    return (
        <div id='detailsMainDiv'>
            <img src={image} id="detailsImage" alt={title} />
            <div id='detailsHeader'>
                <p id='detailsTitle'>{title}</p>
                <div id='detailsInfo'>
                    <p>{eventLocation}<MdLocationOn style={{ marginLeft: '10px' }} /></p>
                    <p>{dateTimeFormat.toLocaleDateString()}<MdDateRange style={{ marginLeft: '10px' }} /></p>
                    <p>{dateTimeFormat.toLocaleTimeString()}<MdAccessTime style={{ marginLeft: '10px' }} /></p>
                </div>
            </div>
            <div style={{ width: '90%', border: 'solid 1px black' }} />
            <div style={{ height: '80%', width: '100%', display: 'flex', alignItems: 'center' }}>
                <div id='detailsContent'>
                    <div id='detailsAttendees'>
                        <p style={{ fontFamily: 'Helvetica', fontSize: '20px', paddingBottom: '20px' }}>Attendees ({attendees.length})</p>
                        <div id='detailsSubAttendees'>
                            {attendeesList}
                        </div>
                        {attendees.indexOf(username) === -1 ?
                            <input type='button' id='attendButton' value='Attend Event' style={{ marginTop: 'auto' }} onClick={attendEvent} />
                            :
                            <input type='button' id='attending' value='Attending' style={{ marginTop: 'auto' }} disabled />
                        }

                    </div>
                    <div style={{ height: '40%', width: '0px', borderLeft: 'solid 2px black', alignSelf: 'center' }} />
                    <div id='detailsDescription'>
                        <p style={{ fontFamily: 'Helvetica', fontSize: '20px', paddingBottom: '20px' }}>Description</p>
                        <p style={{ fontFamily: 'Helvetica', width: '95%', flex: '1 1 auto', overflowY: 'auto' }}>{description}</p>
                    </div>
                    <div style={{ height: '40%', width: '0px', borderLeft: 'solid 2px black', alignSelf: 'center' }} />
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