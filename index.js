import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors"; 
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json()); 
const port = 3000;

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();

app.use(cors()); 
app.use(bodyParser.urlencoded({ extended: true }));

let currentUserId = null;

async function getVisitedCountryCodes(userId) {
  const result = await db.query(
    "SELECT country_code FROM visited_countries WHERE user_id = $1;",
    [userId]
  );
  console.log("result.rows:", result.rows);
  let visitedArray = result.rows.map((country) => country.country_code);
  console.log("Visited country codes for user", userId, ":", visitedArray);
  return visitedArray;
}

app.get("/api/data", async (req, res) => {
  try {
    const userResult = await db.query("SELECT * FROM users");
    const users = userResult.rows;

    let currentUser = null;
    let countries = []; 

    if (users.length > 0) { 
      currentUser = users.find((user) => user.id == currentUserId) || users[0]; 
      countries = await getVisitedCountryCodes(currentUser.id);  
    }

    res.json({ 
      countries: countries, 
      users: users,
      currentUser: currentUser, 
    }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});


app.post("/add", async (req, res) => {
  const input = req.body.country;
  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );
    const countryCode = result.rows[0].country_code;
    // console.log("Country code returned is HERE -->: ", countryCode)

    await db.query(
      "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
      [countryCode, currentUserId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ error: "Country not found or already added" });
  }
});

app.post("/user", (req, res) => { 
  currentUserId = req.body.user;
  res.json({ success: true });
});

app.post("/api/new", async (req, res) => {
  const { name, color } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO users (name, color) VALUES($1, $2) RETURNING *;",
      [name, color]
    );
    currentUserId = result.rows[0].id;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Could not create user" });
  }
});

app.post("/api/delete", async (req, res) => {
  const { name } = req.body;
  try {
    const userResult = await db.query("SELECT id FROM users WHERE name = $1", [name]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const userId = userResult.rows[0].id;

    await db.query("DELETE FROM visited_countries WHERE user_id = $1", [userId]);

    await db.query("DELETE FROM users WHERE id = $1", [userId]);

    res.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});


app.listen(port, () => {
  console.log(`Backend Server running on http://localhost:${port}`);
});