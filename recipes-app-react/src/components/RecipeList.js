import React from 'react'
import RecipeCard from './RecipeCard'
import add from '../assets/add.png'
import Loader from "react-loader-spinner";


class RecipeList extends React.Component {
    constructor() {
        super()
        this.state = {
            loading: true,
            recipes: [],
        }
        this.viewRecipe = this.viewRecipe.bind(this)
        this.addRecipe = this.addRecipe.bind(this)
    }

    componentDidMount() {
        fetch("http://recipes-app-node-server.herokuapp.com/fetchRecipes")
            .then(res => res.json())
            .then((result) => {
                this.setState({
                    loading: false,
                    recipes: result,
                })
            })
    }

    viewRecipe(instructions) {
        this.props.history.push({
            pathname: "/recipe",
            state: {
                instructions: instructions,
            }
        })
    }

    addRecipe() {
        this.props.history.push("/addRecipe")
    }

    render() {
        var recipeData = this.state.recipes.map((data) => {
            return (
                <RecipeCard
                    name={data.name}
                    difficulty={data.difficulty}
                    instructions={data.instructions}
                    onClick={this.viewRecipe}
                />
            )
        })
        recipeData.push(
            <img src={add} alt="Add Recipe" className="add" onClick={this.addRecipe} />
        )
        return (
            this.state.loading ?
                <div style={{ marginTop: '17vh', height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Loader type="ThreeDots" color="#000000" height='15vh' width='15vw' />
                </div>
                :
                <div align="center" className="listDiv">
                    {recipeData}
                </div>
        )
    }
}

export default RecipeList