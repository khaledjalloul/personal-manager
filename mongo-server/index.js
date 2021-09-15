const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cors = require("cors");
var multer = require('multer')
var multerFTP = require('multer-ftp')
var path = require('path')

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}

const app = express();
app.use(cors(corsOptions))
const port = process.env.PORT || 3737;

let mongoDB;
var upload = multer({
    storage: new multerFTP({
        basepath: '/htdocs/images',
        destination: function (req, file, options, callback) {
            callback(null, path.join(options.basepath, file.originalname))
         },
        ftp: {
            host: 'ftp.byethost31.com',
            user: 'b31_29727146',
            password: 'Kj542533'
        }
    })
})

app.listen(port, () => {
    mongoDB = new Mongo();
    console.log("API running.");
})

app.get("/", async (req, res) => {
    res.send("Guides app API.");
})

app.get("/fetchGuides", async (req, res) => {
    res.json(await mongoDB.fetchGuides());
})

app.post("/addGuide", bodyParser.json(), async (req, res) => {
    const result = await mongoDB.addGuide(req.body);
    res.json({ "res": result })
})

app.post("/deleteGuide", bodyParser.json(), async (req, res) => {
    const result = await mongoDB.deleteGuide(req.body);
    res.json({ "res": result })
})

app.post('/uploadImage', upload.single("image"), (req, res) => {
    res.send(req.file);
})

app.get("/wipe", async (req, res) => {
    if (req.query.pass === "Kj542533") {
        await mongoDB.wipe();
        res.send("Done.")
    } else {
        res.send("Enter pass.")
    }
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
            image: String,
            duration: String,
            instructions: [{ hint: String, text: String }]
        }, { collection: 'recipes' });
        this.Recipe = mongoose.model('Recipe', this.RecipeSchema);
        this.models.push(this.Recipe)

        this.genericSchema = new mongoose.Schema({
            name: String,
            image: String,
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
            return (1);
        } catch (e) {
            console.log(e);
            return (0);
        }
    }

    async deleteGuide(data) {
        try {
            if (data.password !== "Kj542533") return (0);
            if (data.collection === 'recipes') {
                this.Recipe.deleteOne({ name: data.name }, (err, res) => { })
            } else if (data.collection === 'generic') {
                this.Generic.deleteOne({ name: data.name }, (err, res) => { })
            }
            return (1);
        } catch (e) {
            console.log(e);
            return (0);
        }
    }

    async wipe() {
        this.Generic.deleteMany({}, (err, res) => { })
        this.Recipe.deleteMany({}, (err, res) => { })
    }
}