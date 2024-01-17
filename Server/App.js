const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const userEndpoints = require('./UserEndpoints');
const channelEndpoints= require('./ChannelEndpoints');
const messageEndpoints = require('./MessageEndpoints');
const replyEndpoints = require('./ReplyEndpoints');
const ratingEndpoints = require('./RatingEndpoints');
const searchEndpoints = require('./SearchEndpoints');


const app = express();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.use('/api/users', userEndpoints);
app.use('/api/channels', channelEndpoints);
app.use('/api/messages', messageEndpoints(upload));
app.use('/api/replies', replyEndpoints(upload));
app.use('/api/rating', ratingEndpoints);
app.use('/api/search',searchEndpoints);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = { upload }; 
