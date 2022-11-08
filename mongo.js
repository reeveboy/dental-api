// Register a new user
db.users.insertOne({
  email: "ree002@chowgules.ac.in",
  username: "reeve",
  password: "qwerty",
});

// Login Query
db.users.findOne({ username: "reeve", password: "qwerty" });

// Get all users
db.users.find();

// Insert a new doctor
db.doctors.insertOne({
  fname: "Wenona",
  lname: "Pires",
  contact_number: "+91 8765698361",
  email: "wenona.pires@gmail.com",
  qualifications: "MBBS",
  area_of_specilization: "Teeth",
});

// Insert a new Patient
db.patients.insertOne({
  fname: "Moses",
  lname: "Crasto",
  blood_group: "O+",
  email: "moses.crasto@gmail.com",
  contact_number: "+91 7683658279",
  address: "Assolna",
});

// Add Medical History to Patient
db.patients.updateOne(
  { _id: ObjectId("6363df7056bf62af97a75881") },
  {
    $set: {
      medical_history: {
        complications: ["Diabetes", "Hypertension"],
        allergies: ["lactose intollerant"],
        current_medication: [],
      },
    },
  }
);

// Create a new appointment
db.appointments.insertOne({
  doctor_id: ObjectId("6363ddd856bf62af97a75880"),
  patient_id: ObjectId("6363df7056bf62af97a75881"),
  date: "05-11-2022",
  time: "10:00",
  status: "pending",
  reason: "Checkup",
  prescription: [],
  tooth: [],
  fees_charged: null,
});

// Get all appointments of doctors
db.doctors.aggregate([
  {
    $lookup: {
      from: "appointments",
      localField: "_id",
      foreignField: "doctor_id",
      as: "appointmets",
    },
  },
]);

// Get todays appointments
db.appointments.find({ date: "05-11-2022" });

// Search for a patient
db.patients.find({ fname: /Re.*/ });
