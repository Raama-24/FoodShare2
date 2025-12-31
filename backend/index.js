import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_JSON
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());

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
  } catch {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.post("/verifyUser", async (req, res) => {
  try {
    const { uid, verified } = req.body;
    await db.collection("users").doc(uid).update({ verified });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Update failed" });
  }
});

app.post("/setAdmin", async (req, res) => {
  try {
    const { uid } = req.body;
    await db.collection("users").doc(uid).update({ role: "admin" });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Admin failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Backend running"));
