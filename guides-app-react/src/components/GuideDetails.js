import React from 'react'
import { withRouter } from 'react-router-dom'
import hint from '../assets/hint.png'
class Guide extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            instructions: this.props.location.state.instructions,
            popupDisplayed: false,
            hint: ""
        }
        this.displayHint = this.displayHint.bind(this)
    }

    displayHint(hint){
        this.setState({
            popupDisplayed: !this.state.popupDisplayed,
            hint: hint
        })
    }
    render() {
        var guideData = this.state.instructions.map((data) => {
            const toReturn = [];
            if (data.hint === "null") {
                toReturn.push(<p style={{margin: '0 auto'}} >{data.text}</p>)
            } else {
                toReturn.push(<img src={hint} className="hint" alt="hint" onClick={(event) => {this.displayHint(data.hint)}}/>)
                toReturn.push(<p style={{margin: '0 auto', width: '70%'}}>{data.text}</p>
                )
            }
            toReturn.push(
                <hr style={{
                    marginRight: "30vw",
                    marginLeft: "30vw"
                }} />
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
                </div>
                <div className="popupContainer" style={{display: this.state.popupDisplayed? 'flex' : 'none'}} onClick={(event) => {this.setState({popupDisplayed: !this.state.popupDisplayed})}}>
                    <p className="popup">{this.state.hint}</p>
                </div>
            </div>
        )
    }
}

export default withRouter(Guide)