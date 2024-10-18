const jwt = require("jsonwebtoken");
const userService = require("../services/userService");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await userService.validateUser(username, password);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { username: user.username },
    "b0ad4e99df7d2504127cac66984c1dbecdf577858667d44d65037c0487e86734",
    {
      expiresIn: "7h",
    }
  );
  res.json({ token });
};
