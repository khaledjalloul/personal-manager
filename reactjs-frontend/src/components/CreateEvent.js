import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DateTimePicker from 'react-datetime-picker';
import '../styles/DateTimePicker.css'

const CreateEvent = (props) => {

    const navigate = useNavigate()

    const [title, setTitle] = useState()
    const [eventLocation, setEventLocation] = useState()
    const [dateTime, setDateTime] = useState(new Date())
    const [image, setImage] = useState()
    const [items, setItems] = useState()
    const [description, setDescription] = useState()

    const createEvent = async () => {
        var itemsList = items.split(',')
        itemsList = itemsList.map(item => item.trim())

        await fetch(props.APIURL + "/createEvent", {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, location: eventLocation, dateTime: dateTime.toISOString(), image, items: itemsList, description, creator: JSON.parse(localStorage.getItem('token')).username })
        }).then(res => res.json())
            .then(data => { if (data.status === 'success') navigate('/event-planner_react') })
    }

    return (
        <div id='createMainDiv'>
            <label>Event Title<input type='text' placeholder='Event Title' onChange={e => setTitle(e.target.value)} /></label>
            <label>Location<input type='text' placeholder={'Describe the event\'s location'} onChange={e => setEventLocation(e.target.value)} /></label>
            <label>Date and Time<DateTimePicker id='dateTime' onChange={setDateTime} value={dateTime} /></label>
            <label>Image Link<input type='text' style={{ width: '70vw' }} placeholder='Paste image URL here.' onChange={e => setImage(e.target.value)} /></label>
            <label>Items to Bring Along<input type='text' style={{ width: '70vw' }} placeholder='Separate items by a comma.' onChange={e => setItems(e.target.value)} /></label>
            <label>Description<textarea style={{ width: '70vw', height: '400px', textAlign: 'left', resize: 'none', padding: '10px' }} placeholder='Describe the plans for the event.' onChange={e => setDescription(e.target.value)} /></label>

            <input id='createEventButton' type='button' value='Create Event!' onClick={createEvent} />
        </div>
    )
}
export default CreateEvent