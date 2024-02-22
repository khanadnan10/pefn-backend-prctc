import jwt from "jsonwebtoken";

const authMiddleWare = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader === null || authHeader === undefined) {
    return res.status(401).json({
      error: "Unauthorized.",
    });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.status(401).json({ error: "token expired." });
    req.user = user;
  });

  next();
};

export default authMiddleWare;
