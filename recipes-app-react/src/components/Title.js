import React from 'react'

function Title(props) {
    return (
        <p
            className="title"
            style={{ cursor: 'pointer' }}
            onClick={(event) => {
                if (props.history.location.pathname !== "/")
                    props.history.goBack();
            }}>
            Recipes App
        </p>
    )
}

export default Title