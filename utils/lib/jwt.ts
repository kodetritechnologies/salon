// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET as string;

// if (!JWT_SECRET) {
//   throw new Error("JWT_SECRET is not defined");
// }

// export function generateToken(payload: object) {
//   return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
// }

// export function verifyToken(token: string) {
//   return jwt.verify(token, JWT_SECRET);
// }
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export function generateToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
