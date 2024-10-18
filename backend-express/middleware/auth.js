const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.sendStatus(403);
  }

  jwt.verify(
    token,
    "b0ad4e99df7d2504127cac66984c1dbecdf577858667d44d65037c0487e86734",
    (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.username = user.username;
      next();
    }
  );
};

module.exports = authenticateJWT;
