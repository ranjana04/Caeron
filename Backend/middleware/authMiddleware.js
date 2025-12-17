import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token, authorization denied" });

  // const token = authHeader.split(" ")[1]; // Expect Bearer <token>
  // if (!token)
  //   return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(authHeader, process.env.JWT_SECRET);
    req.user = decoded; // Save decoded token payload (user id) in request
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const validateSession = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    // console.log("Token is required");
    return false;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch (e) {
    return false;
  }
};

