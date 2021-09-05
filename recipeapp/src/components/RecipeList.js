import React from 'react'
import RecipeCard from './RecipeCard'
import add from '../assets/add.png'

class RecipeList extends React.Component {
    constructor() {
        super()
        this.state = {
            recipes: [],
        }
        this.viewRecipe = this.viewRecipe.bind(this)
        this.addRecipe = this.addRecipe.bind(this)
    }

    componentDidMount() {
        fetch("http://localhost:3737/fetchRecipes")
            .then(res => res.json())
            .then((result) => {
                this.setState({
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
            <div align="center" className="listDiv">
                {recipeData}
            </div>
        )
    }
}

export default RecipeList