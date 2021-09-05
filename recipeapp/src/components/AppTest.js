import React from 'react'
import RecipeList from './RecipeList'

class AppTest extends React.Component {
    constructor() {
      super()
      this.viewRecipe = this.viewRecipe.bind(this)
      this.addRecipe = this.addRecipe.bind(this)
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
      return (
        <RecipeList viewRecipe={this.viewRecipe} addRecipe={this.addRecipe} />
      );
  
    }
  }

  export default AppTest