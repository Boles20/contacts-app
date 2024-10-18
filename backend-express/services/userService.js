const bcrypt = require("bcryptjs");

const users = [
  { username: "user1", password: bcrypt.hashSync("user1", 10) },
  { username: "user2", password: bcrypt.hashSync("user2", 10) },
];

exports.validateUser = async (username, password) => {
  const user = users.find((u) => u.username === username);
  if (user && bcrypt.compareSync(password, user.password)) {
    return { username: user.username };
  }
  return null;
};
