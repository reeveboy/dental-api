const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const db_url = "mongodb://localhost:27017/clinic";

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(db_url);
const db = mongoose.connection;

db.on("error", (error) => {
  console.log(error);
});

db.once("connected", () => {
  console.log("Database Connected");
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  db.collection("users")
    .findOne({ username, password })
    .then((user) => {
      if (user) {
        res.status(200);
        res.send(user);
      } else {
        res.status(401);
        res.send("Invalid Credentials");
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get("/api/doctors", (req, res) => {
  db.collection("doctors")
    .find({})
    .toArray((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
});

app.post("/api/doctors", (req, res) => {
  const {
    fname,
    lname,
    email,
    contact_number,
    qualifications,
    area_of_specialization,
  } = req.body;
  db.collection("doctors").insertOne(
    {
      fname,
      lname,
      email,
      contact_number,
      qualifications,
      area_of_specialization,
    },
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/api/patients", (req, res) => {
  db.collection("patients")
    .find({})
    .toArray((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
});

app.post("/api/patients", (req, res) => {
  const { fname, lname, blood_group, email, contact_number, address } =
    req.body;
  db.collection("patients").insertOne(
    {
      fname,
      lname,
      blood_group,
      email,
      contact_number,
      address,
    },
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/api/appointment/:id", (req, res) => {
  const { id } = req.params;
  db.collection("appointments")
    .find({ _id: mongoose.Types.ObjectId(id) })
    .toArray((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
});

app.post("/api/appointments/book", (req, res) => {
  const {
    patient_id,
    doctor_id,
    date,
    time,
    reason,
    status,
    prescription,
    fees_charged,
  } = req.body;
  db.collection("appointments").insertOne(
    {
      patient_id: mongoose.Types.ObjectId(patient_id),
      doctor_id: mongoose.Types.ObjectId(doctor_id),
      date,
      time,
      reason,
      status,
      prescription,
      fees_charged,
    },
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/api/appointments/:date", (req, res) => {
  const { date } = req.params;
  db.collection("appointments")
    .aggregate([
      {
        $match: { date },
      },
      {
        $lookup: {
          from: "patients",
          localField: "patient_id",
          foreignField: "_id",
          as: "patient_details",
        },
      },
    ])
    .toArray((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
});

app.listen(4000, () => {
  console.log(`Server Started at ${4000}`);
});
