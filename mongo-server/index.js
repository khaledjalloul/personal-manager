const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cors = require("cors");

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}

const app = express();
app.use(cors(corsOptions))
app.use(bodyParser.json());
const port = process.env.PORT || 3737;

let mongoDB;

app.listen(port, () => {
    mongoDB = new Mongo();
    console.log("API running.");
})

app.get("/fetchGuides", async (req, res) => {
    res.json(await mongoDB.fetchGuides());
})

app.post("/addGuide", async (req, res) => {
    const result = await mongoDB.addGuide(req.body);
    res.json({ res: result })
})

app.post("/addRecipe", async (req, res) => {
    const result = await mongoDB.addRecipe(req.body);
    res.json({ res: result })
})

app.get("/wipe", async (req, res) => {
    await mongoDB.wipe();
    res.send("Done.")
})

class Mongo {
    constructor() {
        this.main();
    }

    async main() {
        await mongoose.connect('mongodb+srv://khaledjalloul:Kj542533@cluster0.qpcmz.mongodb.net/guidesDB?retryWrites=true&w=majority');
        this.models = [];

        this.RecipeSchema = new mongoose.Schema({
            name: String,
            difficulty: String,
            instructions: [{ hint: String, text: String }]
        }, { collection: 'recipes' });
        this.Recipe = mongoose.model('Recipe', this.RecipeSchema);
        this.models.push(this.Recipe)

        this.genericSchema = new mongoose.Schema({
            name: String,
            purpose: String,
            instructions: [String]
        }, { collection: 'generic' });
        this.Generic = mongoose.model('Generic', this.genericSchema);
        this.models.push(this.Generic)
    }

    async fetchGuides() {
        return await Promise.all(this.models.map(async (model) => {
            return { "collection": model.collection.collectionName, "data": await model.find({}) }
        }))
    }

    async addRecipe(recipeJSON) {
        try {
            const Recipe = new this.Recipe(recipeJSON);
            await Recipe.save();
            return (1);
        } catch (e) {
            console.log(e);
            return (0);
        }
    }

    async addGeneric(data){
        return data;
    }

    async wipe() {
        this.Recipe.deleteMany({}, function (err, res) { })
    }
}
