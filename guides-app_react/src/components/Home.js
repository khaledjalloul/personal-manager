import React, { useEffect, useState } from 'react'
import Loader from "react-loader-spinner";
import { useNavigate } from "react-router-dom"

const GuideCard = (props) => {
    return (
        <div className="cardMainDiv" onClick={(event) => { props.onClick(props.name, props.collection, props.instructions) }}>
            <img src={props.image} className="cardImg" alt={props.name} />
            <div className="cardSubDiv">
                <p style={{ lineHeight: '20%', fontWeight: 'bold' }}>{props.name}</p>
                <hr style={{ marginRight: '15%', marginLeft: '15%' }} />
                <p>{props.collection === 'generic' ? props.purpose : props.duration}</p>
            </div>
        </div>
    )
}

const Home = () => {
    const [loading, setLoading] = useState(true)
    const [guides, setGuides] = useState([])
    const [selected, setSelected] = useState(['all'])

    const navigate = useNavigate()

    useEffect(() => {
        // fetch("https://guides-app-node-server.herokuapp.com/fetchGuides")
        fetch('http://localhost:3737/fetchGuides')
            .then(res => res.json())
            .then((result) => {
                setGuides(result)
                setLoading(false)
            })
    }, [])

    const viewGuide = (name, collection, instructions) => {
        navigate("/guideDetails", {
            name: name,
            collection: collection,
            instructions: instructions,
        })
    }

    var guidesData = [];
    guides.forEach(guide => {
        if (selected.indexOf('all') > -1 || selected.indexOf(guide.collection) > -1) {
            guidesData = [...guidesData, ...guide.data.map((data) => {
                return (
                    <GuideCard
                        collection={guide.collection}
                        name={data.name}
                        image={data.image}
                        duration={data.duration}
                        purpose={data.purpose}
                        instructions={data.instructions}
                        onClick={viewGuide}
                    />
                )
            })];
        }
    })
    return (
        loading ?
            <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader type="ThreeDots" color="#004b7d" height='15vh' width='15vw' />
            </div>
            :
            <div align="center" className="listDiv">
                {guidesData}
            </div>
    )

}

export default Home