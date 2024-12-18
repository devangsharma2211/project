const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend")));
app.set("views", path.join(__dirname, "../frontend/views"));
app.set("view engine", "ejs");

// MySQL Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Devang@22",
  database: "btech_students",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database.");
});

// Route: Login Page
app.get("/", (req, res) => {
  res.render("index");
});

// Route: Handle Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM teachers WHERE email = ? AND password = ?";
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("Query Error:", err);
      return res.send("Error during login.");
    }

    if (results.length > 0) {
      const teacher = results[0];
      const tableName = `${teacher.year}y_${teacher.branch}_sec${teacher.section}`;

      const childrenQuery = `SELECT * FROM ${tableName}`;
      db.query(childrenQuery, (err, childrenData) => {
        if (err) {
          console.error("Error fetching student data:", err);
          return res.send("Error fetching student data.");
        }

        console.log("Teacher Data:", teacher);
        console.log("Children Data:", childrenData);

        res.render("dashboard", {
          teacher,
          childrenData, // Pass data to the EJS view
        });
      });
    } else {
      res.send("Invalid email or password.");
    }
  });
});


// Start Server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
