import React from 'react'
import RecipeCard from './RecipeCard'
import add from '../assets/add.png'
class RecipeList extends React.Component {
    constructor(){
        super()
        this.state = {
            recipes: [],
        }
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

    render() {
        var recipeData = this.state.recipes.map((data) => {
            return (
                <RecipeCard
                    name={data.name}
                    difficulty={data.difficulty}
                    instructions={data.instructions}
                    onClick={this.props.viewRecipe}
                />
            )
        })
        recipeData.push(
            <img src={add} alt="Add Recipe" className="add" onClick={this.props.addRecipe}/>
        )
        return (
            <div align="center" className="listDiv">
                {recipeData}
            </div>
        )
    }
}

export default RecipeList