import pool from "../config/db.js";
import jwt from "jsonwebtoken";

export const login = async (username, password) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE username = $1 AND password = crypt($2, password)`,
    [username, password]
  );

  if (result.rows.length === 0) return null;

  const user = result.rows[0];
  const token = jwt.sign(
    { id: user.user_id, role: user.role },
    process.env.JWT_SECRET || "mysecret",
    { expiresIn: "2h" }
  );

  return { user, token };
};
