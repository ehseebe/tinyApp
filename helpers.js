const bcrypt = require('bcrypt');
const saltRounds = 10;


//---HELPER FUNCTIONS---//

const findUserByEmail = (email, database) => {
  for (let userId in database) {
    if (database[userId].email === email) {
      return database[userId];
    }
  }
  return null;
};


const addNewUser = (email, password, database) => {
  const userId = Object.keys(database).length + 1;
  const newUser = {
    id: userId,
    email,
    password: bcrypt.hashSync(password, saltRounds)
  };
  database[userId] = newUser;
  return userId;
};


const authenticateUser = (email, password, database) => {
  const user = findUserByEmail(email, database);

  if (user && bcrypt.compareSync(password, user.password)) {
    return user.id;
  } else {
    return false;
  }
};


const generateRandomString = function() {
  return Math.random().toString(36).substring(2,8);
};


const findURLByUser = (userId, database) => {
  const currentUser = userId;
  let userURLs = {};
  for (let urls in database) {
    if (database[urls]['userID'] === currentUser) {
      userURLs[urls] = database[urls].longURL;
    }
  }
  return userURLs;
};


module.exports = { findUserByEmail, addNewUser, authenticateUser, generateRandomString, findURLByUser };