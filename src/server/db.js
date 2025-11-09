import express from "express";
import mysql from "mysql2/promise";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
app.use(express.static("../style"));
app.use("/public", express.static("../../public"));


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));

// Storage settings for student images
const storage1 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../public/images/students"));
  },
  filename: (req, file, cb) => {
    const enr = req.body.enrollment_no;
    cb(null, `${enr}.jpg`);
  }
});

// Storage settings for student images
const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../public/images/staff"));
  },
  filename: (req, file, cb) => {
    const stid = req.body.staff_id;
    cb(null, `${stid}.jpg`);
  }
});


//  Use .single() for correct file parsing
const upload1 = multer({ storage: storage1 }); // student
const upload2 = multer({ storage: storage2 }); // staff

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Your Password comes here",
  database: "testdb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
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

// route to fetch all issue history
app.get("/issue_history", async (req, res) => {
  try {
    // not completed yet
        const [rows] = await pool.query("SELECT * FROM issue_register");
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

// route to search in issue register_staff


// route to search student by column
app.get("/student/search", async (req, res) => {
    try {
        const { column, value } = req.query;

        const allowedColumns = ["enrollment_no", "name", "phno", "email","branch","grad_year"];
        if (!allowedColumns.includes(column.toLowerCase())) {
            return res.status(400).json({ error: "Invalid column" });
        }

        const [rows] = await pool.query(
            `SELECT * FROM student WHERE ${column} LIKE ?`,
            [`%${value}%`]
        );

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// route to search staff by column
app.get("/staff/search", async (req, res) => {
    try {
        const { column, value } = req.query;

        const allowedColumns = ["staff_id", "name", "phno", "email","role"];
        if (!allowedColumns.includes(column.toLowerCase())) {
            return res.status(400).json({ error: "Invalid column" });
        }

        const [rows] = await pool.query(
            `SELECT * FROM staff WHERE ${column} LIKE ?`,
            [`%${value}%`]
        );

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// route to search in issue history table
app.get("/issue_history/search", async (req, res) => {
  try {
    const { column, value } = req.query;

    const allowedColumns = [
        "enrollment_no",
        "student_name",
        "staff_id",
        "staff_name",
        "isbn",
        "book_title",
        "issue_date",
        "return_date",
        "return_status"
      ];

        if (!allowedColumns.includes(column.toLowerCase())) {
            return res.status(400).json({ error: "Invalid column" });
        }

    const [rows] = await pool.query(
      "CALL search_issue_history(?, ?)",
      [column, value]
    );

    res.json(rows[0]);
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

// login route for staff
app.get("/login/staff", async (req, res) => {
  try {
    const { username, password } = req.query;

    // checking that username is an integer only
    if (!/^\d+$/.test(username)) {
      return res.status(400).json({ error: "Username must be a number" });
    }

    const [rows] = await pool.query("CALL staffLogin(?, ?)", [username, password]);

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

// route to fetch all student data by enrollment
app.get("/info/student", async (req, res) => {

  const { student_enroll } = req.query;

  try {
        const [rows] = await pool.query(`SELECT * FROM student WHERE enrollment_no = ${student_enroll}`);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// route to fetch all student's data
app.get("/info/students", async (req, res) => {

  try {
        const [rows] = await pool.query(`SELECT * FROM student`);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// route to fetch all staff data by staff_id
app.get("/info/staff", async (req, res) => {

  const { staff_id } = req.query;

  try {
        const [rows] = await pool.query(`SELECT * FROM staff WHERE staff_id = ${staff_id}`);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// route to fetch all staff's data
app.get("/info/staffs", async (req, res) => {

  try {
        const [rows] = await pool.query(`SELECT * FROM staff`);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// route to fetch all student issue history data
app.get("/info/student/issue_history", async (req, res) => {

  const { student_enroll } = req.query;

  try {
        const [rows] = await pool.query("CALL display_History(?)", [student_enroll]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// route to fetch all issue history
app.get("/info/issue_history", async (req, res) => {

  try {
        const [rows] = await pool.query("CALL get_issue_history()");
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// route to add student to the table
app.post("/add/student", upload1.single("image"), async (req, res) => {
  try {
    const {
      enrollment_no,
      name,
      phno,
      email,
      branch,
      grad_year,
      passwd,
      staff_id
    } = req.body;

    if (!/^\d+$/.test(enrollment_no))
      return res.status(400).json({ error: "Enrollment number must be numeric" });

    if (!/^[0-9]{10}$/.test(phno))
      return res.status(400).json({ error: "Phone number must be 10 digits" });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ error: "Invalid email format" });

    if (!/^\d+$/.test(staff_id))
      return res.status(400).json({ error: "Staff ID must be numeric" });

    const imagePath = `/public/images/students/${enrollment_no}.jpg`;

    const [rows] = await pool.query(
      "SELECT register_student(?, ?, ?, ?, ?, ?, ?, ?, ?) AS result",
      [
        enrollment_no,
        name,
        phno,
        email,
        branch,
        grad_year,
        imagePath,
        passwd,
        staff_id
      ]
    );

    const result = rows[0].result;

    // if registration failed -> delete uploaded image
    if (result !== 1) {
      const filePath = `public/images/students/${enrollment_no}.jpg`;
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    if (result === 1)
      return res.json({ message: "Student registered successfully" });

    if (result === 2)
      return res.status(400).json({ message: "Enrollment already exists" });

    if (result === 3)
      return res.status(400).json({ message: "Invalid staff ID" });

    res.status(400).json({ message: "Unknown error" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// route to add staff to the table
app.post("/add/staff", upload2.single("image"), async (req, res) => {
  try {
    const {
      staff_id,
      name,
      phno,
      email,
      role,
      passwd,
    } = req.body;

    if (!/^\d+$/.test(staff_id))
      return res.status(400).json({ error: "Staff ID must be numeric" });

    if (!/^[0-9]{10}$/.test(phno))
      return res.status(400).json({ error: "Phone number must be 10 digits" });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ error: "Invalid email format" });

    const imagePath = `/public/images/staff/${staff_id}.jpg`;

    const [rows] = await pool.query(
      "SELECT register_staff(?, ?, ?, ?, ?, ?, ?) AS result",
      [
        staff_id,
        name,
        phno,
        email,
        role,
        imagePath,
        passwd
      ]
    );

    const result = rows[0].result;

    // if registration failed -> delete uploaded image
    if (result !== 1) {
      const filePath = `public/images/staff/${staff_id}.jpg`;
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    if (result === 1)
      return res.json({ message: "Staff registered successfully" });

    if (result === 2)
      return res.status(400).json({ message: "Staff already exists" });

    res.status(400).json({ message: "Unknown error" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// route to add book to the table
app.post("/add/book", async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      category,
      shelf_no,
      quantity
    } = req.body;

    if (!/^\d{13}$/.test(isbn))
      return res.status(400).json({ error: "ISBN must be exactly 13 digits" });

    if (!/^\d+$/.test(shelf_no))
      return res.status(400).json({ error: "Shelf number must be numeric" });

    if (!/^\d+$/.test(quantity))
      return res.status(400).json({ error: "Quantity must be numeric" });

    const [rows] = await pool.query(
      "SELECT add_book(?, ?, ?, ?, ?, ?) AS result",
      [
        title,
        author,
        isbn,
        category,
        shelf_no,
        quantity
      ]
    );

    const result = rows[0].result;

    if (result === 1)
      return res.json({ message: "New book added successfully" });

    if (result === 2)
      return res.json({ message: "Book exists — quantity updated successfully" });

    return res.status(400).json({ message: "Unknown error" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// route to delete student by enrollment_no
app.delete("/delete/student", async (req, res) => {
  try {
    const { enrollment_no } = req.body;

    if (!/^\d+$/.test(enrollment_no))
      return res.status(400).json({ error: "Invalid enrollment number" });

    const [rows] = await pool.query(
      "SELECT delete_student(?) AS result",
      [enrollment_no]
    );

    const result = rows[0].result;

    if (result === 1) {
      const imgPath = path.join(__dirname, "../../public/images/students", `${enrollment_no}.jpg`);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

      return res.json({ message: "Student deleted successfully" });
    }

    if (result === 2)
      return res.status(404).json({ message: "Student not found" });

    res.status(400).json({ message: "Unknown error" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// route to delete staff by staff_id
app.delete("/delete/staff", async (req, res) => {
  try {
    const { staff_id } = req.body;

    if (!/^\d+$/.test(staff_id))
      return res.status(400).json({ error: "Invalid staff ID" });

    const [rows] = await pool.query(
      "SELECT delete_staff(?) AS result",
      [staff_id]
    );

    const result = rows[0].result;

    if (result === 1) {
      const imgPath = path.join(__dirname, "../../public/images/staff", `${staff_id}.jpg`);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

      return res.json({ message: "Staff deleted successfully" });
    }

    if (result === 2)
      return res.status(404).json({ message: "Staff not found" });

    if (result === 3)
      return res.status(400).json({
        message: "Cannot delete this staff because they are linked to issue history"
      });

    res.status(400).json({ message: "Unknown error" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});


// route to delete book by isbn
app.delete("/delete/book", async (req, res) => {
  try {
    const { isbn } = req.body;

    if (!/^\d{13}$/.test(isbn))
      return res.status(400).json({ error: "ISBN must be 13 digits" });

    const [rows] = await pool.query(
      "SELECT delete_book(?) AS result",
      [isbn]
    );

    const result = rows[0].result;

    if (result === 1)
      return res.json({ message: "Book deleted successfully" });

    if (result === 2)
      return res.status(404).json({ message: "Book not found" });

    if (result === 3)
       return res.status(400).json({ message: "Cannot delete book because it is currently issued" });

    if (result === 4)
      return res.status(400).json({ message: "Cannot delete because this book exists in issue history" });


    res.status(400).json({ message: "Unknown error" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// route to issue book to student by staff
app.post("/issue", async (req, res) => {
  try {
    const { student_enroll, isbn, staff_id } = req.body;

    if (!/^\d+$/.test(student_enroll))
      return res.status(400).json({ error: "Student enrollment must be a number" });

    if (!/^\d+$/.test(staff_id))
      return res.status(400).json({ error: "Staff ID must be a number" });

    if (!/^\d{13}$/.test(isbn))
      return res.status(400).json({ error: "ISBN must be 13 digits" });

    const [rows] = await pool.query("CALL issue_book(?, ?, ?)", [
      student_enroll,
      staff_id,
      isbn
    ]);

    const result = rows[0][0];

    if (result.success === 1) {
      res.json({ message: "Book issued successfully" });
    } else if(result.success === 2) {
      res.status(400).json({ message: "Issue failed : Book with ISBN not found" });
    } else if(result.success === 3) {
      res.status(400).json({ message: "Issue failed : Invalid Staff ID" });
    } else if(result.success === 0) {
      res.status(400).json({ message: "Issue failed : Student with Enrollment not found" });
    } else {
      res.status(400).json({ message: "Issue failed : Unexpected error" });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// route to return book from student by staff
app.post("/return", async (req, res) => {
  try {
    const { student_enroll, isbn, staff_id } = req.body;

    if (!/^\d+$/.test(student_enroll))
      return res.status(400).json({ error: "Student enrollment must be a number" });

    if (!/^\d+$/.test(staff_id))
      return res.status(400).json({ error: "Staff ID must be a number" });

    if (!/^\d{13}$/.test(isbn))
      return res.status(400).json({ error: "ISBN must be 13 digits" });

    const [rows] = await pool.query("CALL return_book(?, ?, ?)", [
      student_enroll,
      staff_id,
      isbn
    ]);

    const result = rows[0][0];

    if (result.success === 1) {
      res.json({ message: "Book returned successfully" });
    } else if(result.success === 2) {
      res.status(400).json({ message: "Return failed : Book with ISBN not found" });
    } else if(result.success === 3) {
      res.status(400).json({ message: "Return failed : Invalid Staff ID" });
    } else if(result.success === 0) {
      res.status(400).json({ message: "Return failed : Student with Enrollment not found" });
    } else if(result.success === 4) {
      res.status(400).json({ message: "Return failed : Respective Issue history not found" });
    } else {
      res.status(400).json({ message: "Return failed : Unexpected error" });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});


app.listen(3001, () => console.log("Server running on http://localhost:3001"));
