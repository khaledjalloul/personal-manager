const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
var multer = require('multer')
var multerFTP = require('multer-ftp')
const crypto = require('crypto');
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

app.post('/register', async (req, res) => {
    res.json(await mongoClient.register(req.body.registerUsername, req.body.registerPassword).catch(e => { console.error(e) }))
})

app.use("/login", async (req, res) => {
    const result = await mongoClient.login(req.body.loginUsername, req.body.loginPassword).catch(e => { console.error(e) })
    if (result) {
        res.json({ token: crypto.randomBytes(16).toString('hex') })
    } else {
        res.json({})
    }
})

app.post("/getEvents", async (req, res) => {
    res.json(await mongoClient.getEvents(req.body.username).catch(e => { console.error(e) }))
})

app.post("/getEventByID", async (req, res) => {
    res.json(await mongoClient.getEventbyID(req.body.id).catch(e => { console.error(e) }))
})

app.post("/attendEvent", async (req, res) => {
    res.json(await mongoClient.attendEvent(req.body.id, req.body.name).catch(e => { console.error(e) }))
})

app.post("/unAttendEvent", async (req, res) => {
    res.json(await mongoClient.unAttendEvent(req.body.id, req.body.name).catch(e => { console.error(e) }))
})

app.post("/checkItem", async (req, res) => {
    res.json(await mongoClient.checkItem(req.body.id, req.body.item, req.body.available).catch(e => { console.error(e) }))
})

app.post("/createEvent", async (req, res) => {
    res.json(await mongoClient.createEvent(req.body.title, req.body.location, req.body.dateTime, req.body.image, req.body.items, req.body.description, req.body.creator).catch(e => { console.error(e) }))
})

app.post("/deleteEvent", async (req, res) => {
    res.json(await mongoClient.deleteEvent(req.body.id).catch(e => { console.error(e) }))
})

class MongoClient {

    async start() {
        await mongoose.connect('mongodb+srv://khaledjalloul:Kj542533@cluster0.qpcmz.mongodb.net/eventPlanner?retryWrites=true&w=majority');

        this.EventSchema = new mongoose.Schema({
            title: String,
            eventLocation: String,
            dateTime: Date,
            image: String,
            attendees: [String],
            creator: String,
            description: String,
            items: [{ name: String, available: Boolean }]
        }, { collection: 'events' });
        this.Event = mongoose.model('Event', this.EventSchema);

        this.UserSchema = new mongoose.Schema({
            username: String,
            hash: String,
            salt: String,
            events: [String]
        }, { collection: 'users' });
        this.User = mongoose.model('User', this.UserSchema);
    }

    async register(username, password) {
        try {
            const doc = await this.User.findOne({ username: username })
            if (!doc) {
                const salt = crypto.randomBytes(16).toString('hex');
                const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
                this.User.create({
                    username: username,
                    salt: salt,
                    hash: hash,
                    events: []
                }, (e, i) => {
                    if (e) console.error(e);
                    else console.log("Registered user: " + username)
                })
            } else console.log("User " + username + " already exists.")
        } catch (e) { console.log(e) }
    }

    async login(username, password) {
        try {
            const { salt, hash } = await this.User.findOne({ username: username })
            if (!salt) return false

            const hashAttempt = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')

            return hash === hashAttempt

        } catch (e) { console.log(e) }
    }
    async getEvents(username) {
        try {
            const { events } = await this.User.findOne({ username: username })
            const userEvents = await Promise.all(events.map(async event =>
                await this.Event.findOne({ _id: event })
            ))
            return userEvents
        } catch (e) { console.log(e); }
    }

    async getEventbyID(id) {
        try {
            const doc = await this.Event.findById(mongoose.Types.ObjectId(id))
            if (doc) return { status: 'success', result: doc }
            else return { status: 'fail' }
        } catch (e) {
            if (e instanceof TypeError) return { status: 'fail' }
            else console.log(e)
        }
    }

    async attendEvent(id, username) {
        try {
            const userDoc = await this.User.findOne({ username: username })
            userDoc.events.push(id)
            return await userDoc.save().then(async savedDoc => {
                if (savedDoc === userDoc) {
                    const doc = await this.Event.findById(id)
                    doc.attendees.push(username)
                    return await doc.save().then(savedDoc => {
                        if (savedDoc === doc) {
                            console.log("Updated users of document " + id)
                            return doc.attendees
                        }
                    })
                }
            })
        } catch (e) { console.log(e) }
    }
    
    async unAttendEvent(id, username) {
        try {
            const userDoc = await this.User.findOne({ username: username })
            userDoc.events = userDoc.events.filter(event => event !== id.toString())
            return await userDoc.save().then(async savedDoc => {
                if (savedDoc === userDoc) {
                    const doc = await this.Event.findById(id)
                    doc.attendees = doc.attendees.filter(attendee => attendee !== username)
                    return await doc.save().then(savedDoc => {
                        if (savedDoc === doc) {
                            console.log("Updated users of document " + id)
                            return doc.attendees
                        }
                    })
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

    async createEvent(title, location, dateTime, image, items, description, creator) {
        
        try {
            var newEvent = new this.Event({
                title: title,
                eventLocation: location,
                dateTime: dateTime,
                image: image,
                items: items.map(item => { return { name: item.charAt(0).toUpperCase() + item.slice(1), available: false } }),
                description: description,
                creator: creator,
                attendees: [creator]
            })
            return await newEvent.save().then(async savedDoc => {
                try {
                    const doc = await this.User.findOne({ username: creator })
                    doc.events.push(savedDoc._id.toString())
                    return await doc.save().then(savedDoc => {
                        if (savedDoc === doc) { console.log("Created event: " + title); return { status: 'success' } }
                    })
                } catch (e) { console.log(e) }
            })
        } catch (e) { console.log(e); return {status: 'fail'} }
    }

    async deleteEvent(id){
        try {
            await this.Event.deleteOne({_id: id})
            var users = await this.User.find({})
            console.log(users)
            await Promise.all(users.map(async user => { user.events = user.events.filter(event => event !== id.toString()); await user.save(); return user}))
            return {status: 'success'}
        } catch(e) { console.error(e); }
    }
}