const express = require("express");
const cors = require("cors");
const { json } = require("body-parser");
const mysql = require("mysql2");

var db = mysql.createConnection({
  host: "localhost",
  port: 3006,
  user: "root",
  password: "cookies",
  database: "dental_clinic",
});

const app = express();
const port = 5000;

app.use(cors());
app.use(json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/doctors", (req, res) => {
  const q = "select * from doctor";
  db.query(q, (err, rows) => {
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

app.get("/api/doctors/:id", (req, res) => {
  const q = "select * from doctor where id = ?";
  db.query(q, [req.params.id], (err, rows) => {
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

app.post("/api/doctors", (req, res) => {
  const q =
    "insert into doctor (first_name, last_name, contact_number, email, qualifications, area_of_specialization) values (?, ?, ?, ?, ?, ?)";

  const {
    first_name,
    last_name,
    contact_number,
    email,
    qualifications,
    area_of_specialization,
  } = req.body;

  db.query(
    q,
    [
      first_name,
      last_name,
      contact_number,
      email,
      qualifications,
      area_of_specialization,
    ],
    (err, rows) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Success");
      }
    }
  );
});

app.delete("/api/doctors/:id", (req, res) => {
  const q = "update doctor set is_deleted = 1 where id = ?";
  db.query(q, [req.params.id], (err, rows) => {
    if (err) {
      res.send(err);
    } else {
      res.send("Success");
    }
  });
});

app.get("/api/patients", (req, res) => {
  const q = "select * from patient";
  db.query(q, (err, rows) => {
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

app.get("/api/patients/:id", (req, res) => {
  const q = "select * from patient where id = ?";
  db.query(q, [req.params.id], (err, rows) => {
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

app.post("/api/patients", (req, res) => {
  const q =
    "insert into patient (first_name, last_name, address, blood_group, contact_number, email) values (?, ?, ?, ?, ?, ?)";

  const { first_name, last_name, address, blood_group, contact_number, email } =
    req.body;

  db.query(
    q,
    [first_name, last_name, address, blood_group, contact_number, email],
    (err, rows) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Success");
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
