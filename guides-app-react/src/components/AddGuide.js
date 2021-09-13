import React from 'react'
import add from '../assets/add.png'
import hint from '../assets/hint.png'
import Loader from "react-loader-spinner";

function InstructionDiv(props) {
    return (
        <div style={{ width: '100vw', margin: '20px' }}>
            <input type="text" name="instruction" id={props.id} placeholder={props.placeholder + (props.id === 1 ? " *" : "")} value={props.value} onChange={props.onChange} />
            {
                props.hint || props.hint === "" ? <input type="text" name="hint" id={props.id} placeholder="Hint" value={props.hint} onChange={props.onChange} style={{ marginLeft: '3vw' }} />
                    : <img src={hint} alt="Add hint" className="hint" style={{ marginLeft: '3vw' }} onClick={(event) => { props.addHint(props.id) }} />
            }
        </div>
    )
}
class AddGuide extends React.Component {
    constructor(props) {
        super(props)
        this.guideTypes = ['generic', 'recipes'];
        this.state = {
            name: "",
            difficulty: 'Easy',
            purpose: "",
            instructions: [
                {
                    id: 1,
                    text: ""
                }
            ],
            error: false,
            loading: false,
            selected: 'generic',
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleArrayChange = this.handleArrayChange.bind(this);
        this.addHint = this.addHint.bind(this);
        this.addInstruction = this.addInstruction.bind(this);
        this.changeSelected = this.changeSelected.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleArrayChange(event) {
        let newInsts = [];
        if (event.target.name === "instruction") {
            newInsts = this.state.instructions.map((instruction) => {
                if (("" + instruction.id) === event.target.id) {
                    return (
                        {
                            id: instruction.id,
                            text: event.target.value,
                            hint: instruction.hint,
                        }
                    )
                } else {
                    return instruction;
                }
            })
        } else if (event.target.name === "hint") {
            newInsts = this.state.instructions.map((instruction) => {
                if (("" + instruction.id) === event.target.id) {
                    return (
                        {
                            id: instruction.id,
                            text: instruction.text,
                            hint: event.target.value
                        }
                    )
                } else {
                    return instruction;
                }
            })
        }
        this.setState({
            instructions: newInsts
        })
    }

    addHint(id) {
        let newInsts = this.state.instructions.map((instruction) => {
            if (instruction.id === id) {
                return (
                    {
                        id: id,
                        text: instruction.text,
                        hint: ""
                    }
                )
            } else {
                return instruction;
            }
        })
        this.setState({
            instructions: newInsts
        })
    }

    changeSelected(event) {
        if (this.state.selected !== event.target.value) {
            this.setState({
                selected: event.target.value
            })
        }
    }

    addInstruction() {
        this.setState(prevState => {
            let newInsts = prevState.instructions;
            newInsts.push({
                id: prevState.instructions.length + 1,
                text: ""
            })
            return {
                instructions: newInsts
            };
        })
    }

    async postGuide() {
        let jsonData;
        if (this.state.selected === 'recipes') {
            jsonData = {
                collection: 'recipes',
                name: this.state.name,
                difficulty: this.state.difficulty,
                instructions: this.state.instructions.filter((instruction) => {
                    return instruction.text !== ""
                }).map((instruction) => {
                    return {
                        text: instruction.text,
                        hint: instruction.hint ? instruction.hint : "null"
                    }
                })
            };
        } else if (this.state.selected === 'generic') {
            jsonData = {
                collection: 'generic',
                name: this.state.name,
                purpose: this.state.purpose,
                instructions: this.state.instructions.filter((instruction) => {
                    return instruction.text !== ""
                }).map((instruction) => {
                    return {
                        text: instruction.text,
                        hint: instruction.hint ? instruction.hint : "null"
                    }
                })
            };
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(jsonData)
        }
        return await fetch('https://guides-app-node-server.herokuapp.com/addGuide', options)
            .then(res => res.json())
            .then(data => data);
    }

    render() {
        var guideSelectors = this.guideTypes.map(type => {
            return (
                <input type="button" value={type} onClick={this.changeSelected} className={this.state.selected.indexOf(type) > -1 ? "guideTypeButtonSelected" : "guideTypeButton"} />
            )
        })

        const instructionFields = this.state.instructions.map((instruction) => {
            return (
                <InstructionDiv key={instruction.id} id={instruction.id} placeholder={"Instruction " + (instruction.id)} value={instruction.text} hint={instruction.hint} onChange={this.handleArrayChange} addHint={this.addHint} />
            )
        })

        const recipeDiv = <form onSubmit={async (event) => {
            event.preventDefault();
            if (this.state.name === "" || this.state.instructions[0].text === "") {
                this.setState({
                    error: true,
                })
            } else {
                this.setState({ loading: true, error: false })
                const result = await this.postGuide();
                this.setState({ loading: false })
                if (result.res) this.props.history.goBack();
            }
        }}>
            <div style={{ width: '100vw', margin: '20px' }}>
                <input type="text" name="name" placeholder="Name *" value={this.state.name} onChange={this.handleChange} />
            </div>
            <select name="difficulty" value={this.state.difficulty} onChange={this.handleChange} className="select">
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
            </select>
            <hr style={{ width: '60vw', marginTop: '3vh' }} />
            <h3 align="center" style={{ fontFamily: 'Verdana' }}>Instructions</h3>
            {instructionFields}
            <img src={add} alt="Add Instruction" className="add" style={{ marginTop: '1vh', maxWidth: '5vw' }} onClick={this.addInstruction} />
            <br />
            <input type="submit" value="Submit" style={{ borderRadius: '10px', cursor: 'pointer' }} />

        </form>

        const genericDiv =
            <form onSubmit={async (event) => {
                event.preventDefault();
                if (this.state.name === "" || this.state.instructions[0].text === "" || this.state.purpose === "") {
                    this.setState({
                        error: true,
                    })
                } else {
                    this.setState({ loading: true, error: false })
                    const result = await this.postGuide();
                    this.setState({ loading: false })
                    if (result.res) this.props.history.goBack();
                }
            }}>
                <div style={{ width: '100vw', margin: '20px' }}>
                    <input type="text" name="name" placeholder="Name *" value={this.state.name} onChange={this.handleChange} />
                </div>
                <div style={{ width: '100vw', margin: '20px' }}>
                    <input type="text" name="purpose" placeholder="Purpose *" value={this.state.purpose} onChange={this.handleChange} />
                </div>
                <hr style={{ width: '60vw', marginTop: '3vh' }} />
                <h3 align="center" style={{ fontFamily: 'Verdana' }}>Instructions</h3>
                {instructionFields}
                <img src={add} alt="Add Instruction" className="add" style={{ marginTop: '1vh', maxWidth: '5vw' }} onClick={this.addInstruction} />
                <br />
                <input type="submit" value="Submit" style={{ borderRadius: '10px', cursor: 'pointer' }} />
            </form>;

        return (
            <div align="center" >
                <div style={{ marginTop: '17vh', width: '100vw' }}>
                    {guideSelectors}
                </div>
                <div className="addGuideDiv">
                    {this.state.selected === 'generic' ? genericDiv : recipeDiv}
                    <div style={{ marginTop: '2vh', display: this.state.loading ? 'block' : 'none' }}>
                        <Loader type="ThreeDots" color="#009999" height='5vh' width='5vw' />
                    </div>
                    <p style={{ color: 'red', display: this.state.error ? 'block' : 'none' }}>Please fill all required fields.</p>
                </div>

            </div>
        )
    }
}
export default AddGuide