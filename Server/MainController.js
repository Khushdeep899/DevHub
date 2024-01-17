const db = require('./DBConfiguration');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10; 
const jwtSecret = 'your_jwt_secret'; 



exports.getAllChannels = (req, res) => {
    const query = `
        SELECT Channels.*, Users.username 
        FROM Channels 
        INNER JOIN Users ON Channels.user_id = Users.user_id;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching channels:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(200).json(results);
    });
};


exports.getChannelById = (req, res) => {
    const query = 'SELECT * FROM Channels WHERE channel_id = ?';
    db.query(query, [req.params.id], (err, result) => {
        if (err) throw err;
        res.status(200).json(result);
    });
};

exports.createChannel = (req, res) => {
    const { channel_name, description, user_id } = req.body;
    const query = 'INSERT INTO Channels (channel_name, description, user_id) VALUES (?, ?, ?)';

    db.query(query, [channel_name, description, user_id], (err, result) => {
        if (err) {
            console.error('Error creating channel:', err);
            return res.status(500).json({ message: 'Failed to create channel. Please ensure the user exists and is valid.' });
        }
        res.status(201).json({ message: 'Channel created successfully', channelId: result.insertId });
    });
};



exports.updateChannel = (req, res) => {
    const { channel_name, description } = req.body;
    const query = 'UPDATE Channels SET channel_name = ?, description = ? WHERE channel_id = ?';
    db.query(query, [channel_name, description, req.params.id], (err, result) => {
        if (err) throw err;
        res.status(200).json({ message: 'Channel updated' });
    });
};

exports.deleteChannel = (req, res) => {
    const channelId = req.params.id;

    db.beginTransaction(err => {
        if (err) throw err;

        const deleteRepliesQuery = 'DELETE FROM Replies WHERE message_id IN (SELECT message_id FROM Messages WHERE channel_id = ?)';
        db.query(deleteRepliesQuery, [channelId], (err, result) => {
            if (err) {
                return db.rollback(() => {
                    throw err;
                });
            }
            const deleteMessagesQuery = 'DELETE FROM Messages WHERE channel_id = ?';
            db.query(deleteMessagesQuery, [channelId], (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        throw err;
                    });
                }
                const deleteChannelQuery = 'DELETE FROM Channels WHERE channel_id = ?';
                db.query(deleteChannelQuery, [channelId], (err, result) => {
                    if (err) {
                        return db.rollback(() => {
                            throw err;
                        });
                    }
                    db.commit(err => {
                        if (err) {
                            return db.rollback(() => {
                                throw err;
                            });
                        }
                        res.status(200).json({ message: 'Channel and associated data deleted' });
                    });
                });
            });
        });
    });
};exports.deleteChannel = (req, res) => {
    const channelId = req.params.id;
    db.beginTransaction(err => {
        if (err) throw err;

        const deleteLikesDislikesRepliesQuery = 'DELETE FROM ReplyLikesDislikes WHERE reply_id IN (SELECT reply_id FROM Replies WHERE message_id IN (SELECT message_id FROM Messages WHERE channel_id = ?))';
        db.query(deleteLikesDislikesRepliesQuery, [channelId], (err, result) => {
            if (err) {
                return db.rollback(() => {
                    throw err;
                });
            }

            const deleteLikesDislikesMessagesQuery = 'DELETE FROM MessageLikesDislikes WHERE message_id IN (SELECT message_id FROM Messages WHERE channel_id = ?)';
            db.query(deleteLikesDislikesMessagesQuery, [channelId], (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        throw err;
                    });
                }

                const deleteRepliesQuery = 'DELETE FROM Replies WHERE message_id IN (SELECT message_id FROM Messages WHERE channel_id = ?)';
                db.query(deleteRepliesQuery, [channelId], (err, result) => {
                    if (err) {
                        return db.rollback(() => {
                            throw err;
                        });
                    }

                    const deleteMessagesQuery = 'DELETE FROM Messages WHERE channel_id = ?';
                    db.query(deleteMessagesQuery, [channelId], (err, result) => {
                        if (err) {
                            return db.rollback(() => {
                                throw err;
                            });
                        }


                        const deleteChannelQuery = 'DELETE FROM Channels WHERE channel_id = ?';
                        db.query(deleteChannelQuery, [channelId], (err, result) => {
                            if (err) {
                                return db.rollback(() => {
                                    throw err;
                                });
                            }

                            db.commit(err => {
                                if (err) {
                                    return db.rollback(() => {
                                        throw err;
                                    });
                                }
                                res.status(200).json({ message: 'Channel and all associated data deleted' });
                            });
                        });
                    });
                });
            });
        });
    });
};



exports.getMessagesInChannel = (req, res) => {
  const channelId = req.params.channelId;
  const query = `
    SELECT M.*, U.username
    FROM Messages M
    INNER JOIN Users U ON M.user_id = U.user_id
    WHERE M.channel_id = ?
  `;

  db.query(query, [channelId], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({ message: 'Error retrieving messages', error: err });
      return;
    }
    res.status(200).json(results);
  });
};



exports.getMessageById = (req, res) => {
    const messageId = req.params.messageId;
    const query = 'SELECT * FROM Messages WHERE message_id = ?';

    db.query(query, [messageId], (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Error retrieving message', error: err });
        } else if (results.length === 0) {
            res.status(404).json({ message: 'Message not found' });
        } else {
            res.status(200).json(results[0]);
        }
    });
};

exports.postMessage = (req, res) => {
  
    const { channelId, userId, content } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    const query = 'INSERT INTO Messages (channel_id, user_id, content, screenshot_url) VALUES (?, ?, ?, ?)';
    db.query(query, [channelId, userId, content, imageUrl], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Error posting message', error: err });
        } else {
            res.status(201).json({ message: 'Message posted successfully', messageId: result.insertId });
        }
    });
};

exports.updateMessage = (req, res) => {
    const messageId = req.params.messageId;
    const { content, screenshot_url } = req.body;
    const query = 'UPDATE Messages SET content = ?, screenshot_url = ? WHERE message_id = ?';

    db.query(query, [content, screenshot_url, messageId], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Error updating message', error: err });
        } else {
            res.status(200).json({ message: 'Message updated successfully' });
        }
    });
};

exports.deleteMessage = (req, res) => {
    const messageId = req.params.messageId;
    const query = 'DELETE FROM Messages WHERE message_id = ?';

    db.query(query, [messageId], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Error deleting message', error: err });
        } else {
            res.status(200).json({ message: 'Message deleted successfully' });
        }
    });
};




exports.rateMessage = (req, res) => {
    const messageId = req.params.messageId;
    const { userId, isLike } = req.body;

    const checkQuery = 'SELECT * FROM MessageLikesDislikes WHERE user_id = ? AND message_id = ?';
    db.query(checkQuery, [userId, messageId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (results.length > 0) {
            // Update the existing record
            const updateQuery = 'UPDATE MessageLikesDislikes SET is_like = ? WHERE user_id = ? AND message_id = ?';
            db.query(updateQuery, [isLike, userId, messageId], (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error updating rating', error: err });
                }
                res.status(200).json({ message: 'Rating updated successfully' });
            });
        } else {
            // Insert new rating record
            const insertQuery = 'INSERT INTO MessageLikesDislikes (user_id, message_id, is_like) VALUES (?, ?, ?)';
            db.query(insertQuery, [userId, messageId, isLike], (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error submitting rating', error: err });
                }
                res.status(201).json({ message: 'Rating submitted successfully' });
            });
        }
    });
};

exports.rateReply = (req, res) => {
    const replyId = req.params.replyId;
    const { userId, isLike, message_id } = req.body;

    console.log(`Received Parameters: replyId: ${replyId}, userId: ${userId}, isLike: ${isLike}, messageId: ${message_id}`);

    // Query to insert or update the like/dislike status
    const upsertQuery = `
        INSERT INTO ReplyLikesDislikes (user_id, reply_id, is_like, message_id) 
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
        is_like = VALUES(is_like);
    `;

    db.query(upsertQuery, [userId, replyId, isLike, message_id], (err, result) => {
        if (err) {
            console.error("Error in rateReply:", err);
            return res.status(500).json({ message: 'Error handling rating', error: err });
        }
        console.log(`Rating handled successfully for replyId: ${replyId} by userId: ${userId}`);
        res.status(200).json({ message: 'Rating handled successfully' });
    });
};


exports.getMessageRating = (req, res) => {
    const messageId = req.params.messageId;

    const query = `
        SELECT 
            (SELECT COUNT(*) FROM MessageLikesDislikes WHERE message_id = ? AND is_like = 1) AS likes,
            (SELECT COUNT(*) FROM MessageLikesDislikes WHERE message_id = ? AND is_like = 0) AS dislikes
        FROM Messages
        WHERE message_id = ?;
    `;

    db.query(query, [messageId, messageId, messageId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Error retrieving message rating', error: err });
        }

        if (results.length > 0) {
            res.status(200).json({ likes: results[0].likes, dislikes: results[0].dislikes });
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    });
};

exports.getReplyRating = (req, res) => {
    const replyId = req.params.replyId;
    const messageId = req.query.messageId;
    console.log(replyId,messageId);

    const query = `
        SELECT 
            (SELECT COUNT(*) FROM ReplyLikesDislikes WHERE reply_id = ? AND message_id = ? AND is_like = 1) AS likes,
            (SELECT COUNT(*) FROM ReplyLikesDislikes WHERE reply_id = ? AND message_id = ? AND is_like = 0) AS dislikes
        FROM Replies
        WHERE reply_id = ? AND message_id = ?;
    `;

    db.query(query, [replyId, messageId, replyId, messageId, replyId, messageId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Error retrieving reply rating', error: err });
        }

        if (results.length > 0) {
            res.status(200).json({ likes: results[0].likes, dislikes: results[0].dislikes });
        } else {
            res.status(404).json({ message: 'Reply not found or no ratings available' });
        }
    });
};

exports.messagesByHighestLikes = (req, res) => {
    const query = 'SELECT * FROM Messages ORDER BY likes_count DESC';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error retrieving messages', error: err });
        res.status(200).json(results);
    });
};

// New controller function for lowest likes
exports.messagesByLowestLikes = (req, res) => {
    const query = 'SELECT * FROM Messages ORDER BY likes_count ASC';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error retrieving messages', error: err });
        res.status(200).json(results);
    });
};




exports.getRepliesByMessage = (req, res) => {
    const messageId = req.params.messageId;
    const query = `
        SELECT R.*, U.username
        FROM Replies R
        INNER JOIN Users U ON R.user_id = U.user_id
        WHERE R.message_id = ?
    `;

    db.query(query, [messageId], (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Error retrieving replies', error: err });
        } else {
            res.status(200).json(results);
        }
    });
};

exports.postReply = (req, res) => {
    const messageId = req.params.messageId;
    const { userId, content } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    const query = 'INSERT INTO Replies (message_id, user_id, content, image_url) VALUES (?, ?, ?, ?)';
    db.query(query, [messageId, userId, content, imageUrl], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Error posting reply', error: err });
        } else {
            res.status(201).json({ message: 'Reply posted successfully', replyId: result.insertId });
        }
    });
};

exports.updateReply = (req, res) => {
    const replyId = req.params.replyId;
    const { content } = req.body;
    const query = 'UPDATE Replies SET content = ? WHERE reply_id = ?';

    db.query(query, [content, replyId], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Error updating reply', error: err });
        } else {
            res.status(200).json({ message: 'Reply updated successfully' });
        }
    });
};

exports.deleteReply = (req, res) => {
    const replyId = req.params.replyId;
    const query = 'DELETE FROM Replies WHERE reply_id = ?';

    db.query(query, [replyId], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Error deleting reply', error: err });
        } else {
            res.status(200).json({ message: 'Reply deleted successfully' });
        }
    });
};




exports.searchContent = (req, res) => {
    const searchString = req.query.q;
    const query = `
        SELECT Messages.*, Users.username 
        FROM Messages 
        JOIN Users ON Messages.user_id = Users.user_id 
        WHERE Messages.content LIKE ?`;

    db.query(query, [`%${searchString}%`], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error searching content', error: err });
        res.status(200).json(results);
    });
};



exports.searchContentByUser = (req, res) => {
    const username = req.params.username; 
    const query = `
        SELECT Messages.*, Users.username 
        FROM Messages 
        JOIN Users ON Messages.user_id = Users.user_id 
        WHERE Users.username = ?`;

    db.query(query, [username], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error searching user content', error: err });
        res.status(200).json(results);
    });
};




exports.userWithMostOrLeastPosts = (req, res) => {
    const type = req.query.type; 
    const order = type === 'most' ? 'DESC' : 'ASC';
    const query = `
        SELECT user_id, COUNT(*) as post_count FROM Messages 
        GROUP BY user_id 
        ORDER BY post_count ${order} 
        LIMIT 1
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error finding user with most/least posts', error: err });
        res.status(200).json(results[0]);
    });
};


exports.userWithHighestOrLowestRanking = (req, res) => {
    const type = req.query.type; 
  
    const order = type === 'highest' ? 'DESC' : 'ASC';
    const query = `
        SELECT u.user_id, (IFNULL(SUM(m.likes_count), 0) + IFNULL(SUM(r.likes_count), 0)) as total_likes
        FROM Users u
        LEFT JOIN Messages m ON u.user_id = m.user_id
        LEFT JOIN Replies r ON u.user_id = r.user_id
        GROUP BY u.user_id
        ORDER BY total_likes ${order}
        LIMIT 1
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error finding user with highest/lowest ranking', error: err });
        res.status(200).json(results[0]);
    });
};
exports.messagesByHighestLikes = (req, res) => {
    const query = `
        SELECT Messages.*, Users.username, 
               COUNT(MessageLikesDislikes.is_like) AS like_count
        FROM Messages 
        JOIN Users ON Messages.user_id = Users.user_id
        LEFT JOIN MessageLikesDislikes ON Messages.message_id = MessageLikesDislikes.message_id
        WHERE MessageLikesDislikes.is_like = TRUE
        GROUP BY Messages.message_id
        ORDER BY like_count DESC`;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error retrieving messages', error: err });
        res.status(200).json(results);
    });
};





exports.messagesByLowestLikes = (req, res) => {
    const query = `
        SELECT Messages.*, Users.username, 
               COALESCE(SUM(CASE WHEN MessageLikesDislikes.is_like = 1 THEN 1 ELSE 0 END), 0) AS like_count,
               COALESCE(SUM(CASE WHEN MessageLikesDislikes.is_like = 0 THEN 1 ELSE 0 END), 0) AS dislike_count
        FROM Messages 
        JOIN Users ON Messages.user_id = Users.user_id
        LEFT JOIN MessageLikesDislikes ON Messages.message_id = MessageLikesDislikes.message_id
        GROUP BY Messages.message_id, Users.username
        ORDER BY dislike_count DESC, like_count ASC`;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving messages', error: err });
        }
        res.status(200).json(results);
    });
};




exports.registerUser = async (req, res) => {
    console.log(req.body);
    try {
        const { username, email, password } = req.body;

       
        const checkQuery = 'SELECT * FROM Users WHERE email = ?';
        db.query(checkQuery, [email], async (checkErr, checkResult) => {
            if (checkErr) {
                console.error('Error checking for duplicate email:', checkErr);
                res.status(500).json({ message: 'Server error', error: checkErr });
            } else if (checkResult.length > 0) {
               
                res.status(409).json({ message: 'Email already in use' });
            } else {
              
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                const insertQuery = 'INSERT INTO Users (username, email, password, display_name) VALUES (?, ?, ?, ?)';
                db.query(insertQuery, [username, email, hashedPassword, ''], (err, result) => {
                    if (err) {
                        console.error('Error registering new user:', err);
                        res.status(500).json({ message: 'Error registering new user', error: err });
                    } else {
                        res.status(201).json({ message: 'User registered successfully' });
                    }
                });
            }
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};


exports.loginUser = (req, res) => {
    console.log('Received login request with body:', req.body);
    const { username, password } = req.body;
    const query = 'SELECT * FROM Users WHERE username = ?';

    db.query(query, [username], (err, users) => {
        if (err) {
            console.error('Error logging in:', err);
            res.status(500).json({ message: 'Error logging in', error: err });
            return;
        }
        if (users.length === 0) {
            res.status(400).json({ message: 'User not found' });
            return;
        }

        const user = users[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                res.status(500).json({ message: 'Error comparing passwords', error: err });
            } else if (!isMatch) {
                res.status(401).json({ message: 'Invalid credentials' });
            } else {
                const token = jwt.sign({ userId: user.user_id }, jwtSecret, { expiresIn: '1h' });
                res.status(200).json({
                    message: 'Login successful',
                    token,
                    userId: user.user_id, 
                    userName: user.username 
                  });
            }
        });
    });
};

exports.getAllUsers = (req, res) => {
    const query = 'SELECT user_id, username, email,display_name FROM Users';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Error retrieving users', error: err });
        } else {
            res.status(200).json(results);
        }
    });
};

exports.getUserById = (req, res) => {
    const query = 'SELECT user_id, username,email ,display_name FROM Users WHERE user_id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Error retrieving user', error: err });
        } else if (results.length === 0) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.status(200).json(results[0]);
        }
    });
};

exports.updateUser = (req, res) => {
    const { username, display_name } = req.body;
    const userId = req.params.id;

    const query = 'UPDATE Users SET username = ?, display_name = ? WHERE user_id = ?';
    db.query(query, [username, display_name, userId], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Error updating user', error: err });
        } else {
            res.status(200).json({ message: 'User updated successfully' });
        }
    });
};

exports.deleteUser = (req, res) => {
    const userId = req.params.id;
    const query = 'DELETE FROM Users WHERE user_id = ?';

    db.query(query, [userId], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Error deleting user', error: err });
        } else {
            res.status(200).json({ message: 'User deleted successfully' });
        }
    });
};
