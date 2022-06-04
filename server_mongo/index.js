const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
var multer = require('multer')
var multerFTP = require('multer-ftp')

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}

const app = express();
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3737;

let mongoClient;
// var upload = multer({
//     storage: new multerFTP({
//         basepath: '/public_html/images',
//         destination: function (req, file, options, callback) {
//             callback(null, path.join(options.basepath, file.originalname))
//          },
//         ftp: {
//             host: 'files.000webhost.com',
//             user: 'guides-app-img',
//             password: 'Kj542533'
//         }
//     })
// })

app.listen(port, async () => {
    mongoClient = new MongoClient();
    await mongoClient.start()
    console.log("Event Planner NodeJS API running.");
})

app.get("/", async (req, res) => {
    res.send("Event Planner NodeJS API.");
})

app.get("/getEvents", async (req, res) => {
    res.json(await mongoClient.getEvents().catch(e => { console.error(e) }));
})

app.post("/attendEvent", async (req, res) => {
    res.json(await mongoClient.attendEvent(req.body.id, "New User").catch(e => { console.error(e) }));
})

app.post("/checkItem", async (req, res) => {
    res.json(await mongoClient.checkItem(req.body.id, req.body.item, req.body.available).catch(e => { console.error(e) }));
})

// app.post("/addGuide", bodyParser.json(), async (req, res) => {
//     const result = await mongoClient.addGuide(req.body);
//     res.json({ "res": result })
// })

// app.post("/deleteGuide", bodyParser.json(), async (req, res) => {
//     const result = await mongoClient.deleteGuide(req.body);
//     res.json({ "res": result })
// })

// app.post("/uploadImage", upload.single("image"), (req, res) => {
//     res.send(req.file);
// })

app.get("/wipe", async (req, res) => {
    if (req.query.pass === "Kj542533") {
        await mongoClient.wipe();
        res.send("Done.")
    } else {
        res.send("Enter pass.")
    }
})

class MongoClient {

    async start() {
        await mongoose.connect('mongodb+srv://khaledjalloul:Kj542533@cluster0.qpcmz.mongodb.net/eventPlanner?retryWrites=true&w=majority');

        this.EventSchema = new mongoose.Schema({
            title: String,
            location: String,
            time: Date,
            attendees: [String],
            items: [{ name: String, available: Boolean }]
        }, { collection: 'events' });
        this.Event = mongoose.model('Event', this.EventSchema);
    }

    async getEvents() {
        try {
            return await this.Event.find({})
        } catch (e) {
            console.log(e);
        }
    }

    async attendEvent(id, user) {
        try {
            const doc = await this.Event.findOne({ _id: id })
            doc.attendees.push(user)
            return await doc.save().then(savedDoc => {
                if (savedDoc === doc) {
                    console.log("Updated users of document " + id)
                    return doc.attendees
                }
            })
        } catch (e) { console.log(e) }
    }
    
    async checkItem(id, reqItem, available) {
        try {
            const doc = await this.Event.findOne({ _id: id })
            doc.items.map(item => {
                if (item.name === reqItem) {
                    item.available = available;
                    return item
                } else return item
            })
            return await doc.save().then(savedDoc => {
                if (savedDoc === doc) {
                    console.log("Updated items of document " + id)
                    return doc.items
                }
            })
        } catch (e) { console.log(e) }
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