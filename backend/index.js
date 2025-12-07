import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Read Admin SDK JSON from .env
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true,
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;


// ------------------ ROUTES ------------------

// GET pending users (all except admins)
app.get("/pendingUsers", async (req, res) => {
  try {
    const snap = await db
      .collection("users")
      .where("verified", "==", false)
      .get();

    const users = snap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(u => u.role !== "admin");

    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// VERIFY / REJECT user
app.post("/verifyUser", async (req, res) => {
  try {
    const { uid, verified } = req.body;

    if (!uid) return res.status(400).json({ error: "UID required" });

    await db.collection("users").doc(uid).update({ verified });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// (Optional) Make someone admin
app.post("/setAdmin", async (req, res) => {
  try {
    const { uid } = req.body;

    if (!uid) return res.status(400).json({ error: "UID required" });

    await db.collection("users").doc(uid).update({ role: "admin" });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to set admin" });
  }
});

// ----------------- START SERVER -----------------
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
