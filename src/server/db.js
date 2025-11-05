import express from "express";
import mysql from "mysql2/promise";

const app = express();
app.use(express.json());
app.use(express.static("../style"));

app.use("/public", express.static("../../public"));


// 1. Create MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Aarnya123",
  database: "testdb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 2. Test route
app.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT NOW() AS time;");
  res.json({ status: "Server running", time: rows[0].time });
});

// 3. Example API route (insert)
app.post("/books", async (req, res) => {
  const { name, age } = req.body;
  const [result] = await pool.query(
    "INSERT INTO users (name, age) VALUES (\"Aarnya_Jain\" , 12)",
    [name, age]
  );
  res.json({ id: result.insertId, name, age });
});

// route to fetch all book data
app.get("/books", async (req, res) => {
  try {
        const [rows] = await pool.query("SELECT * FROM books");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// route to search book by column
app.get("/books/search", async (req, res) => {
    try {
        const { column, value } = req.query;

        const allowedColumns = ["title", "author", "isbn", "category"];
        if (!allowedColumns.includes(column.toLowerCase())) {
            return res.status(400).json({ error: "Invalid column" });
        }

        const [rows] = await pool.query(
            `SELECT * FROM books WHERE ${column} LIKE ?`,
            [`%${value}%`]
        );

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// login route for student
app.get("/login/student", async (req, res) => {
  try {
    const { username, password } = req.query;

    // checking that username is an integer only
    if (!/^\d+$/.test(username)) {
      return res.status(400).json({ error: "Username must be a number" });
    }

    const [rows] = await pool.query("CALL StudentLogin(?, ?)", [username, password]);

    const result = rows[0][0];
    if (result.success === 1) {
      return res.json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// issue book to student by staff
app.get("/issue", async (req, res) => {
  try {
    const { student_enroll, isbn , staff_id } = req.query;

    // checking that student enroll is an integer only
    if (!/^\d+$/.test(student_enroll)) {
      return res.status(400).json({ error: "Student enrollment must be a number" });
    }

    if (!/^\d+$/.test(staff_id)) {
      return res.status(400).json({ error: "Staff ID must be a number" });
    }

    const [rows] = await pool.query("CALL issue_book(?, ?, ?)",[student_enroll, staff_id, isbn]);

    const result = rows[0][0];

    if (result.success === 1) {
      return res.json({ message: "Book issued successfully" });
    } else {
      return res.status(400).json({ message: "Issue failed" });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});


app.listen(3001, () => console.log("Server running on http://localhost:3001"));