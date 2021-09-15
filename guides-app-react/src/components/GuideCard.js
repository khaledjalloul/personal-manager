import React from 'react'

class GuideCard extends React.Component {
    render() {
        return (
            <div className="cardMainDiv" onClick={(event) => { this.props.onClick(this.props.name, this.props.collection, this.props.instructions) }}>
                <img src={this.props.image} alt={this.props.name}/>
                <div className="cardSubDiv">
                    <p style={{ lineHeight: '20%', fontWeight: 'bold' }}>{this.props.name}</p>
                    <hr style={{ marginRight: '15%', marginLeft: '15%' }} />
                    <p>{this.props.collection === 'generic' ? this.props.purpose : this.props.duration}</p>
                </div>
            </div>
        )
    }
}
export default GuideCard