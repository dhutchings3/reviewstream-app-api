const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: "hhutch",
      first_name: "Haley",
      password: "Password1!"
    },
    {
      id: 2,
      user_name: "chutch",
      first_name: "Colleen",
      password: "Password1!"
    },
    {
      id: 3,
      user_name: "jhutch",
      first_name: "John",
      password: "Password1!"
    }
  ];
}

function makeReviewsArray() {
  return [
    {
      user_id: 1,
      show_name: "Girls",
      season: 4,
      streaming_service: "HBO Now",
      review: "Test review here.",
      rating: 3
    }
  ];
}

function seedUsers(users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 12)
  }));
  return preppedUsers;
}

function seedTables(db, reviews) {
  return db.into("reviewstream_reviews").insert([reviews]);
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: "HS256"
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeUsersArray,
  seedUsers,
  makeReviewsArray,
  seedTables,
  makeAuthHeader
};
