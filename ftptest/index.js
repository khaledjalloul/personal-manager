var ftp = require('ftp')
var express = require('express')
var multer = require('multer')
var multerFTP = require('multer-ftp')
var cors = require('cors')
var path = require('path')

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}

const app = express();
app.use(cors(corsOptions))

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

app.get('/', (req, res) => {
    res.send("Root")
})

app.get('/upload', (req, res) => {
    if (req.query.file) {
        var client = new ftp();
        client.on('ready', () => {
            client.put(req.query.file, 'htdocs/images/' + req.query.file, (err) => {
                if (err) throw err;
                client.end();
                res.send("Done. ")
            })
        })
        client.connect({ host: 'ftp.byethost31.com', user: 'b31_29727146', password: 'Kj542533' });
    } else res.send("Waiting for file.")
})

app.post('/uploadImage', upload.single("image"), (req, res) => {
    console.log(req.file);
    res.send(req.file);
})

app.listen(3737, () => {
    console.log('API running')
})

