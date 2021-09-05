const mongoose = require('mongoose');
const express = require('express');
var bodyParser = require('body-parser')
const port = process.env.PORT || 3737;

const app = express();
const cors = require("cors");
const corsOptions = {
    origin: '*',
    credentials: true,            
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(bodyParser.json());


let DBObject;

app.get("/fetchRecipes", async (req, res) => {
    res.json(await DBObject.fetchRecipes());
})

app.post("/addRecipe", async (req, res) => {
    const result = await DBObject.addRecipe(req.body);
    res.json({ res: result })
})

app.listen(port, async () => {
    DBObject = new DBClass();
    await DBObject.main();
    console.log("API running");
})

app.get("/wipe", async (req, res) => {
    await DBObject.wipe();
    res.send("Done.")
})

class DBClass {
    constructor() {
        this.recipeSchema;
        this.Recipe;
    }

    async main() {
        await mongoose.connect('mongodb+srv://khaledjalloul:Kj542533@cluster0.qpcmz.mongodb.net/recipesDB?retryWrites=true&w=majority');

        this.recipeSchema = new mongoose.Schema({
            name: String,
            difficulty: String,
            instructions: [{ hint: String, text: String }]
        }, { collection: 'recipes' });

        this.Recipe = mongoose.model('Recipe', this.recipeSchema);

    }

    async fetchRecipes() {
        return await this.Recipe.find();;
    }

    async addRecipe(recipeJSON) {
        try {
            const recipe = new this.Recipe(recipeJSON);
            await recipe.save();
            return (1);
        } catch (e) {
            console.log(e);
            return (0);
        }
    }

    async wipe() {
        this.Recipe.deleteMany({}, function (err, res) { })
    }
}
