const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
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

app.listen(port, async () => {
    mongoClient = new MongoClient();
    await mongoClient.start()
    console.log("Event Planner ExpressJS API running on port " + port + ".");
})

app.post('/register', async (req, res) => {
    res.json(await mongoClient.register(req.body.registerUsername, req.body.registerPassword).catch(e => console.error(e)))
})

app.post("/login", async (req, res) => {
    res.json(await mongoClient.login(req.body.loginUsername, req.body.loginPassword).catch(e => console.error(e)))
})

app.get("/getEvents/:username", async (req, res) => {
    res.json(await mongoClient.getEvents(req.params.username).catch(e => console.error(e)))
})

app.get("/getEvent/:id", async (req, res) => {
    res.json(await mongoClient.getEvent(req.params.id).catch(e => console.error(e)))
})

app.patch("/attendEvent/:id", async (req, res) => {
    res.json(await mongoClient.attendEvent(req.params.id, req.body.name).catch(e => console.error(e)))
})

app.patch("/unAttendEvent/:id", async (req, res) => {
    res.json(await mongoClient.unAttendEvent(req.params.id, req.body.name).catch(e => console.error(e)))
})

app.patch("/checkItem/:id", async (req, res) => {
    res.json(await mongoClient.checkItem(req.params.id, req.body.item, req.body.available).catch(e => console.error(e)))
})

app.post("/createEvent", async (req, res) => {
    res.json(await mongoClient.createEvent(req.body.title, req.body.location, req.body.dateTime, req.body.image, req.body.items, req.body.description, req.body.creator).catch(e => { console.error(e) }))
})

app.delete("/deleteEvent/:id", async (req, res) => {
    res.json(await mongoClient.deleteEvent(req.params.id).catch(e => { console.error(e) }))
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
                const newUser = new this.User({
                    username: username,
                    salt: salt,
                    hash: hash,
                    events: []
                })
                return await newUser.save().then(savedDoc => {
                    if (savedDoc === newUser) {
                        console.log("Registered user: " + username)
                        return { success: true }
                    } else return { success: false, message: 'Failed to register.' }
                })
            } else {
                console.log("Failed to register " + username + ". Username already exists.")
                return { success: false, message: 'Username already exists.' }
            }
        } catch (e) { console.log(e) }
    }

    async login(username, password) {
        try {
            const userDoc = await this.User.findOne({ username: username })
            if (!userDoc) return { success: false, message: 'Invalid username.' }
            const { salt, hash } = userDoc
            const valid = hash === crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
            if (valid) return { success: true, token: crypto.randomBytes(16).toString('hex') }
            else return { success: false, message: 'Invalid password.' }

        } catch (e) { console.log(e) }
    }
    async getEvents(username) {
        try {
            const doc = await this.User.findOne({ username: username })
            if (!doc) return {success: false}
            const userEvents = await Promise.all(doc.events.map(async event =>
                await this.Event.findOne({ _id: event })
            ))
            return { success: true, events: userEvents }
        } catch (e) { console.log(e); }
    }

    async getEvent(id) {
        try {
            const doc = await this.Event.findById(mongoose.Types.ObjectId(id))
            if (doc) return { success: true, event: doc }
            else return { success: false, message: 'Event not found.' }
        } catch (e) {
            if (e instanceof TypeError) return { success: false, message: 'Invalid event ID.' }
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
                            return { success: true, attendees: doc.attendees }
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
                            return { success: true, attendees: doc.attendees }
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
                    return { success: true, items: doc.items }
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
                        if (savedDoc === doc) {
                            console.log("Created event: " + title)
                            return { success: true }
                        }
                    })
                } catch (e) { console.log(e) }
            })
        } catch (e) { console.log(e); return { success: false } }
    }

    async deleteEvent(id) {
        try {
            await this.Event.deleteOne({ _id: id })
            var users = await this.User.find({})
            await Promise.all(users.map(async user => { user.events = user.events.filter(event => event !== id.toString()); await user.save(); return user }))
            return { success: true }
        } catch (e) { console.error(e); }
    }
}