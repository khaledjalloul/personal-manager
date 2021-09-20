import React from 'react';
import { withRouter } from 'react-router-dom';
import deleteIcon from '../assets/delete.png';
import hint from '../assets/hint.png';

class Guide extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            password: "",
            name: this.props.location.state.name,
            collection: this.props.location.state.collection,
            instructions: this.props.location.state.instructions,
            hintPopupDisplayed: false,
            deletePopupDisplayed: false,
            hint: ""
        }
        this.displayHint = this.displayHint.bind(this)
        this.displayDelete = this.displayDelete.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    displayHint(hint) {
        this.setState({
            hintPopupDisplayed: !this.state.hintPopupDisplayed,
            hint: hint
        })
    }

    displayDelete() {
        this.setState({
            deletePopupDisplayed: !this.state.deletePopupDisplayed
        })
    }

    handleChange(event) {
        this.setState({
            password: event.target.value
        })
    }

    async postDelete() {
        const jsonData = {
            collection: this.state.collection,
            name: this.state.name,
            password: this.state.password
        };
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonData)
        }
        return await fetch("https://guides-app-node-server.herokuapp.com/deleteGuide", options)
        //return await fetch('http://localhost:3737/deleteGuide', options)
            .then(res => res.json())
            .then(data => data)
    }

    render() {
        var guideData = this.state.instructions.map((data) => {
            const toReturn = [];
            if (data.hint === "null") {
                toReturn.push(<p style={{ margin: '0 auto', width: '80%' }} >{data.text}</p>)
            } else {
                toReturn.push(<img src={hint} className="hint" alt="hint" onClick={(event) => { this.displayHint(data.hint) }} />)
                toReturn.push(<p style={{ margin: '0 auto', width: '60%' }}>{data.text}</p>
                )
            }
            toReturn.push(
                <div style={{width: '100%'}}>
                    <hr style={{
                        marginRight: "30vw",
                        marginLeft: "30vw"
                    }} />

                </div>
            );
            return (
                <div class="guideStep" >
                    {toReturn}
                </div>)
        })
        return (
            <div className="guideMainDiv">
                <div>
                    {guideData}
                    <img src={deleteIcon} alt="delete" className="delete" onClick={this.displayDelete} />
                </div>
                <div className="popupContainer" style={{ display: this.state.hintPopupDisplayed ? 'flex' : 'none' }} onClick={(event) => { this.setState({ hintPopupDisplayed: !this.state.hintPopupDisplayed }) }}>
                    <p className="popup">{this.state.hint}</p>
                </div>
                <div className="popupContainer" style={{ display: this.state.deletePopupDisplayed ? 'flex' : 'none' }} >
                    <form onSubmit={async (event) => {
                        event.preventDefault();
                        if (this.state.password !== "") {
                            const result = await this.postDelete();
                            if (result.res) this.props.history.goBack();
                        }
                    }}>
                        <div className="popup" style={{ display: 'flex', flexWrap: 'wrap', height: '45vh', width: '60vw' }}>
                            <p style={{ width: '100%', marginBottom: '0px' }}>Type password to confirm delete.</p>
                            <input type="password" value={this.state.password} style={{ border: 'solid' }} onChange={this.handleChange} />
                            <input type="submit" value="Delete" style={{ width: '40%', marginRight: '2%', borderRadius: '20px', backgroundColor: 'rgba(255,0,0,0.7)', cursor: 'pointer' }} />
                            <input type="button" value="Cancel" style={{ width: '40%', borderRadius: '20px', backgroundColor: 'rgba(100,100,100,0.3)', cursor: 'pointer' }} onClick={(event) => { this.setState({ deletePopupDisplayed: !this.state.deletePopupDisplayed }) }} />
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default withRouter(Guide)