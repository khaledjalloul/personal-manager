import React from 'react'
import GuideCard from './GuideCard'
import add from '../assets/add.png'
import Loader from "react-loader-spinner";
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import { createTheme, ThemeProvider } from '@mui/material/styles';

// const theme = createTheme({
//     palette: {
//         primary: {
//             main: '#009999',
//         },
//     },
// });

class GuidesList extends React.Component {
    constructor() {
        super()
        this.guideTypes = ['all', 'generic', 'recipes'];
        this.state = {
            loading: true,
            guides: [],
            selected: ['all'],
        }

        this.viewGuide = this.viewGuide.bind(this)
        this.addGuide = this.addGuide.bind(this)
        this.changeSelected = this.changeSelected.bind(this)
    }

    componentDidMount() {
        fetch("https://guides-app-node-server.herokuapp.com/fetchGuides")
            //fetch('http://localhost:3737/fetchGuides')
            .then(res => res.json())
            .then((result) => {
                this.setState({
                    loading: false,
                    guides: result,
                })
            })
    }

    changeSelected(event) {
        if (this.state.selected.indexOf(event.target.value) > -1 && event.target.value !== 'all') {
            var temp = this.state.selected.slice().filter(item => {
                return item !== event.target.value
            })
            this.setState({
                selected: temp.length ? temp : ['all']
            })
        } else {
            if (event.target.value === 'all') {
                this.setState({
                    selected: ['all']
                })
            } else {
                this.setState({
                    selected: [...this.state.selected.filter(item => {
                        return item !== 'all'
                    }), event.target.value]
                })
            }
        }
    }

    viewGuide(name, collection, instructions) {
        this.props.history.push({
            pathname: "/guideDetails",
            state: {
                name: name,
                collection: collection,
                instructions: instructions,
            }
        })
    }

    addGuide() {
        this.props.history.push("/addGuide")
    }

    render() {
        var guideSelectors = this.guideTypes.map(type => {
            return (
                <input type="button" value={type} onClick={this.changeSelected} className={this.state.selected.indexOf(type) > -1 ? "guideTypeButtonSelected" : "guideTypeButton"} />
            )
        })
        var guidesData = [];
        this.state.guides.forEach(guide => {
            if (this.state.selected.indexOf('all') > -1 || this.state.selected.indexOf(guide.collection) > -1) {
                guidesData = [...guidesData, ...guide.data.map((data) => {
                    return (
                        <GuideCard
                            collection={guide.collection}
                            name={data.name}
                            image={data.image}
                            duration={data.duration}
                            purpose={data.purpose}
                            instructions={data.instructions}
                            onClick={this.viewGuide}
                        />
                    )
                })];
            }
        })
        guidesData.push(
            // <ThemeProvider theme={theme}>
            //     <AddCircleOutlineIcon color="primary" sx={{width: '3%'}}className="add" />
            // </ThemeProvider>
            <img src={add} alt="Add Guide" className="add" style={{ marginRight: '30px', marginLeft: '30px' }} onClick={this.addGuide} />
        )
        return (
            this.state.loading ?
                <div style={{ marginTop: '17vh', height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Loader type="ThreeDots" color="#009999" height='15vh' width='15vw' />
                </div>
                :
                <div align="center" >
                    <div style={{ marginTop: '17vh', width: '100vw' }}>
                        {guideSelectors}
                    </div>
                    <div className="listDiv">
                        {guidesData}
                    </div>
                </div>
        )
    }
}

export default GuidesList