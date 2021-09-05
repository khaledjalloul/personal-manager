import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Title from './components/Title'
import RecipeList from './components/RecipeList'
import Recipe from './components/Recipe';
import AddRecipe from './components/AddRecipe';
import { BrowserRouter, Switch, Route, useHistory } from "react-router-dom"

function Main() {
  const history = useHistory();
  return (
    <div>
      <Title history={history}/>
      <Switch>
        <Route exact path="/">
          <App history={history} />
        </Route>
        <Route path="/recipe" component={Recipe}>
          <Recipe />
        </Route>
        <Route path="/addRecipe" component={AddRecipe}>
          <AddRecipe history={history}/>
        </Route>
      </Switch>
    </div>
  );
}

class App extends React.Component {
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

ReactDOM.render(<BrowserRouter><Main /></BrowserRouter>,
  document.getElementById('root'));