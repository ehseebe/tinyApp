const bcrypt = require('bcrypt');
const saltRounds = 10;


//---HELPER FUNCTIONS---//

const findUserByEmail = (email, database) => {
  //we have an email, need to check if exists
  for (let userId in database) {
    if (database[userId].email === email) {
      return database[userId];
    }
  }
  return false;
};


const addNewUser = (email, password, database) => {
  //generate userId
  const userId = Object.keys(database).length + 1;
  //new user object
  const newUser = {
    id: userId,
    email,
    password: bcrypt.hashSync(password, saltRounds)
  };
  database[userId] = newUser;
  return userId;
};


const authenticateUser = (email, password, database) => {
  //check if user exists
  const user = findUserByEmail(email, database);
  //check that email and pass match
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
    // console.log("users:", users);
    // console.log('urlDatabase:', urlDatabase);
    // console.log("userID:", urlDatabase[urls]['userID']);
    // console.log("currentuser:", currentUser);
    if (database[urls]['userID'] === currentUser) {
      userURLs[urls] = database[urls].longURL;
    }
  }
  return userURLs;
};


module.exports = { findUserByEmail, addNewUser, authenticateUser, generateRandomString, findURLByUser };