import React, { useState } from 'react'
import '../styles/createEvent.css';
import '../styles/DateTimePicker.css';
import { useNavigate } from 'react-router-dom'
import DateTimePicker from 'react-datetime-picker';
import Loader from "react-loader-spinner";
import { useAuth0 } from '@auth0/auth0-react';

const CreateEvent = () => {

    const navigate = useNavigate()
    const { user } = useAuth0()

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
        fetch(process.env.REACT_APP_BACKEND_URL + "/createEvent", {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                location: eventLocation,
                dateTime: dateTime.toISOString(),
                image: image === '' ? 'https://med.stanford.edu/cancer/_jcr_content/main/tabs/tab_main_tabs_3/panel_builder/panel_1/image.img.full.high.png/icon-calendar.png' : image,
                items: items === '' ? [] : items.split(','),
                description,
                creatorName: user.nickname,
                creatorID: user.sub
            })
        })
            .then(res => { if (res.ok) return; else throw new Error(res.status) })
            .then(() => {
                setLoading(false)
                navigate('/event-planner_react')
            })
            .catch(e => { setLoading(false); console.log(e) })
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