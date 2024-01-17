const mysql = require('mysql2');


const dbConnection = mysql.createConnection({
    host: 'db', // or your database host  // change to db when trying to connect docker
    user: 'root',      
    password: 'password',     
    database: 'DevHubdb'       
});

// Connect to MySQL
dbConnection.connect(err => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to the database.');
});

module.exports = dbConnection;
