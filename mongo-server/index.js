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

app.post("/removeGuide", async (req, res) => {
    const result = await mongoDB.removeGuide(req.body);
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
            instructions: [{ hint: String, text: String }]
        }, { collection: 'generic' });
        this.Generic = mongoose.model('Generic', this.genericSchema);
        this.models.push(this.Generic)
    }

    async fetchGuides() {
        return await Promise.all(this.models.map(async (model) => {
            return { "collection": model.collection.collectionName, "data": await model.find({}) }
        }))
    }

    async addGuide(data) {
        console.log(data);
        try {
            const col = data.collection;
            delete data["collection"];
            if (col === 'recipes') {
                const recipe = new this.Recipe(data);
                await recipe.save();
            } else if (col === 'generic') {
                const generic = new this.Generic(data);
                await generic.save();
            }
            console.log(data);
            return (1);
        } catch (e) {
            console.log(e);
            return (0);
        }
    }

    async removeGuide(collection, name) {
        try {
            if (collection === 'recipe') {
                this.Recipe.deleteOne({name: name}, (err, res) => { })
            } else if (collection === 'generic') {
                this.Generic.deleteOne({name: name}, (err, res) => { })
            }
            return (1);
        } catch (e) {
            console.log(e);
            return (0);
        }
    }

    async wipe() {
        this.Recipe.deleteMany({}, (err, res) => { })
    }
}
