const mysql = require('mysql');


const connection = mysql.createConnection({
    host: 'db',  // change to db when using docker and to local host when not using docker
    user: 'root',          
    password: 'password',           
});

// Connect to MySQL
connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
    createDatabase();
});


const createDatabase = () => {
    const dbName = 'DevHubdb'; // Name of the database
    connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, (err) => {
        if (err) throw err;
        console.log(`Database ${dbName} created or already exists.`);
        connection.changeUser({database : dbName}, (err) => {
            if (err) throw err;
            createTables();
        });
    });
};

// creating tables
const createTables = () => {
 
    const createUsersTable = `
    CREATE TABLE IF NOT EXISTS Users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL, 
        display_name VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );


    `;

    // creatinf Channels table
    const createChannelsTable = `
    CREATE TABLE IF NOT EXISTS Channels (
        channel_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        channel_name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(user_id)
    );
    
    `;

    // creating messages table
    const createMessagesTable = `
        CREATE TABLE IF NOT EXISTS Messages (
            message_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            channel_id INT NOT NULL,
            content TEXT NOT NULL,
            screenshot_url VARCHAR(255),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES Users(user_id),
            FOREIGN KEY (channel_id) REFERENCES Channels(channel_id)
        );
    `;

// creating replies table
    const createRepliesTable = `
    CREATE TABLE IF NOT EXISTS Replies (
        reply_id INT AUTO_INCREMENT PRIMARY KEY,
        message_id INT NOT NULL,
        user_id INT NOT NULL,
        content TEXT,
        image_url VARCHAR(255), 
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (message_id) REFERENCES Messages(message_id),
        FOREIGN KEY (user_id) REFERENCES Users(user_id)
    );
`;

// creating likes and dislikes table
    const createLikesDislikesTable = `
    CREATE TABLE IF NOT EXISTS LikesDislikes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        message_id INT DEFAULT NULL,
        reply_id INT DEFAULT NULL,
        is_like BOOLEAN NOT NULL,
        FOREIGN KEY (user_id) REFERENCES Users(user_id),
        FOREIGN KEY (message_id) REFERENCES Messages(message_id),
        FOREIGN KEY (reply_id) REFERENCES Replies(reply_id),
        UNIQUE KEY unique_user_message (user_id, message_id),
        UNIQUE KEY unique_user_reply (user_id, reply_id,message_id)
    );
    `;

    const MessageLikesDislikes=`
    CREATE TABLE IF NOT EXISTS MessageLikesDislikes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        message_id INT NOT NULL,
        is_like BOOLEAN NOT NULL,
        FOREIGN KEY (user_id) REFERENCES Users(user_id),
        FOREIGN KEY (message_id) REFERENCES Messages(message_id),
        UNIQUE KEY unique_user_message (user_id, message_id)
    );`;
    
    const ReplyLikesDislikes=`
    CREATE TABLE IF NOT EXISTS ReplyLikesDislikes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        reply_id INT NOT NULL,
        message_id INT NOT NULL,
        is_like BOOLEAN NOT NULL,
        FOREIGN KEY (user_id) REFERENCES Users(user_id),
        FOREIGN KEY (reply_id) REFERENCES Replies(reply_id),
        FOREIGN KEY (message_id) REFERENCES Messages(message_id),
        UNIQUE KEY unique_user_reply (user_id, reply_id)
        );`;
    


    connection.query(createUsersTable, (err) => {
        if (err) throw err;
        console.log("Users table created or already exists.");

        connection.query(createChannelsTable, (err) => {
            if (err) throw err;
            console.log("Channels table created or already exists.");

            connection.query(createMessagesTable, (err) => {
                if (err) throw err;
                console.log("Messages table created or already exists.");

                connection.query(createRepliesTable, (err) => {
                    if (err) throw err;
                    console.log("Replies table created or already exists.");

                    connection.query(createLikesDislikesTable, (err) => {
                        if (err) throw err;
                        console.log("LikesDislikes table created or already exists.");

                        connection.query(MessageLikesDislikes, (err) => {
                            if (err) throw err;
                            console.log("MessageLikesDislikes table created or already exists.");

                            connection.query(ReplyLikesDislikes, (err) => {
                                if (err) throw err;
                                console.log("ReplyLikesDislikes table created or already exists.");
                            });
                        });
                    });
                });
            });
        });
    });
};

module.exports = connection;
