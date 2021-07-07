require('dotenv').config()

var express = require("express");
var loginroutes = require('./routes/loginroutes');
var bodyParser = require('body-parser');
let cors = require('cors')
// body parser added
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Allow cross origin requests
app.use(cors())

var router = express.Router();

// test route
router.get('/', function(req, res) {
    res.json({ message: 'welcome to our upload module apis' });
});

//route to handle user registration
router.post('/register',loginroutes.register);
router.post('/login',loginroutes.login);
router.post('/register_faculty',loginroutes.registerfaculty);
router.post('/login_faculty',loginroutes.loginfaculty);
router.post('/create_track',loginroutes.insertMood);
router.post('/get_Student',loginroutes.getStudent);
router.post('/create_key',loginroutes.insertKeys);
router.post('/get_key',loginroutes.getKeyFaculty);
router.post('/insert_notifcation',loginroutes.insertNotification);
router.post('/get_notification',loginroutes.getNotification);
router.post('/get_facultyId',loginroutes.getFaucltyId);
app.use('/api', router);
app.listen(4000);
