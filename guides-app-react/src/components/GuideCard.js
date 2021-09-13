import React from 'react'
import cardimg from '../assets/Landscape-Color.jpg'

class GuideCard extends React.Component {
    render() {
        return (
            <div className="cardMainDiv" onClick={(event) => {this.props.onClick(this.props.name, this.props.collection, this.props.instructions)}}>
                <img src={cardimg} alt={this.props.name} className="foodImg"/>
                <div className="cardSubDiv">
                    <p style={{lineHeight: '20%', fontWeight: 'bold'}}>{this.props.name}</p>
                    <hr style={{marginRight: '15%', marginLeft: '15%'}}/>
                    <p>{this.props.collection === 'generic' ? this.props.purpose : this.props.difficulty}</p>
                </div>
            </div>
        )
    }
}
export default GuideCard