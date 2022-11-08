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

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "select * from user where username = ? and password = ?;",
    [username, password],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }

      if (result.length != 0) {
        res.status(200).send("Logged in");
      } else {
        res.status(403).send({ message: "Wrong username/password" });
      }
    }
  );
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
    (err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Success");
      }
    }
  );
});

app.get("/api/appointments/:date", (req, res) => {
  const q = `
    select appointment.id, patient.first_name as patient_fname, patient.last_name as patient_lname, time, reason, status, patient.contact_number, doctor.first_name as doctor_fname, doctor.last_name as doctor_lname 
    from appointment 
    inner join patient 
    on patient.id = patient_id
    inner join doctor 
    on doctor.id = doctor_id
    where date = ?;
  `;
  db.query(q, [req.params.date], (err, rows) => {
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

app.get("/api/appointments", (req, res) => {
  const q = "select * from appointment";
  db.query(q, (err, rows) => {
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

app.post("/api/appointments", (req, res) => {
  const q =
    "insert into appointment (patient_id, doctor_id, reason, date, time) values (?, ?, ?, ?, ?)";
  const { patient_id, doctor_id, reason, date, time } = req.body;
  db.query(q, [patient_id, doctor_id, reason, date, time], (err, rows) => {
    if (err) {
      res.send(err);
    } else {
      res.send("Success");
    }
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
