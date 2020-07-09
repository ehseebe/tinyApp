const { assert } = require('chai');

const { findUserByEmail, findURLByUser } = require('../helpers');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const testURLS = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "fw02i8" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "fw02i8" },
  j4ysh3: { longURL: "https://www.cbc.ca", userID: "1h3ydn" }
};

//FIND USER BY EMAIL
describe('findUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = findUserByEmail("user@example.com", testUsers);
    const expectedOutput = {
      id: "userRandomID",
      email: "user@example.com",
      password: "purple-monkey-dinosaur"
    };
    assert.isObject(user, 'user is an object');
  });

  it('should return null with an invalid email', function() {
    const user = findUserByEmail("ur@example.com", testUsers);
    const expectedOutput = null;
    assert(user === expectedOutput, 'user is defined');
  });
});

//FIND URL BY USER
describe('findURLByUser', function() {
  it('should return a valid user as an object', function() {
    const userURL = findURLByUser("fw02i8", testURLS);
    const expectedOutput = {
      b6UTxQ: { longURL: "https://www.tsn.ca", userID: "fw02i8" },
      i3BoGr: { longURL: "https://www.google.ca", userID: "fw02i8" }
    };
    assert.isObject(userURL, 'userURL is an object');
  });

  it('should return an empty object if user has no saved URLs', function() {
    const userURL = findURLByUser("jehdn5", testURLS);
    const expectedOutput = {};
    assert.isObject(userURL, 'userURL is an object');
  });
});
