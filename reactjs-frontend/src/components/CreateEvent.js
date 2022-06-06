import React, { useState } from 'react'
import '../styles/createEvent.css';
import '../styles/DateTimePicker.css';
import { useNavigate } from 'react-router-dom'
import DateTimePicker from 'react-datetime-picker';
import Loader from "react-loader-spinner";

const CreateEvent = ({ setToken, APIURL }) => {

    setToken(JSON.parse(localStorage.getItem('token')))
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [eventLocation, setEventLocation] = useState('')
    const [dateTime, setDateTime] = useState(new Date())
    const [image, setImage] = useState('')
    const [items, setItems] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)

    const createEvent = async e => {
        e.preventDefault()
        setLoading(true)
        var newItems = items
        if (newItems === '') {
            newItems = []
        } else {
            newItems = items.split(',')
            newItems = newItems.map(item => item.trim())
        }
        var newImage = image
        if (newImage === '') newImage = 'https://med.stanford.edu/cancer/_jcr_content/main/tabs/tab_main_tabs_3/panel_builder/panel_1/image.img.full.high.png/icon-calendar.png'
        fetch(APIURL + "/createEvent", {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title, location: eventLocation,
                dateTime: dateTime.toISOString(),
                image: newImage, items: newItems,
                description,
                creator: JSON.parse(localStorage.getItem('token')).username
            })
        }).then(res => res.json())
            .then(data => {
                if (data.success) {
                    setLoading(false)
                    navigate('/event-planner_react')
                }
            })
    }

    return (
        <form id='createMainDiv' onSubmit={createEvent}>
            <label>Event Title
                <input type='text' placeholder='Event Title' onChange={e => setTitle(e.target.value)} required />
            </label>
            <label>Location
                <input type='text' placeholder={'Describe the event\'s location'}
                    onChange={e => setEventLocation(e.target.value)} required />
            </label>
            <label>Date and Time
                <DateTimePicker id='dateTime' onChange={setDateTime} value={dateTime} />
            </label>
            <label>Image Link
                <input type='text' style={{ width: '70vw' }} placeholder='Paste image URL here.'
                    onChange={e => setImage(e.target.value)} />
            </label>
            <label>Items to Bring Along
                <input type='text' style={{ width: '70vw' }} placeholder='Separate items by a comma.'
                    onChange={e => setItems(e.target.value)} />
            </label>
            <label>Description
                <textarea style={{ width: '70vw', height: '400px', textAlign: 'left', resize: 'none', padding: '10px' }}
                    placeholder='Describe the plans for the event.' onChange={e => setDescription(e.target.value)} />
            </label>

            {loading ?
                <Loader type="TailSpin" color="#004b7d" height='40px' style={{ marginTop: '30px' }} />
                :
                <button id='createEventButton' type='submit'>Create Event!</button>
            }
        </form>
    )
}

export default CreateEvent