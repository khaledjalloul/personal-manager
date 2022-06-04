import React from 'react';
import { useLocation } from 'react-router-dom';

const EventDetails = (props) => {
    const { state } = useLocation()
    const {title, location, time, attendees, items, image} = state.data
    return(
        <div>
            <p>{title}</p>
        </div>
    )
}

export default EventDetails