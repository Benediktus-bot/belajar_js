const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const app = express();
const PORT = process.env.PORT || 3000;
const HASHED_PASSWORD =
  process.env.DEMO_PASSWORD_HASH ||
  "$2b$10$QWzUuR6lB/XmKz9dFv0gO.tF9pS0P.L4A5R7V8Y2C1E3G4H5J6I0";
const DEMO_USER = {
  username: process.env.DEMO_USERNAME || "admin@gmail.com",
  passwordHash: HASHED_PASSWORD,
};

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username dan password wajib diisi." });
  }

  if (username !== DEMO_USER.username) {
    return res.status(401).json({ message: "Kredensial tidak valid" });
  }

  try {
    const isMatch = await bcrypt.compare(password, DEMO_USER.passwordHash);

    if (isMatch) {
      res.json({
        message: "Login berhasil",
        user: { username: DEMO_USER.username },
      });
    } else {
      res.status(401).json({ message: "Kredensial tidak valid" });
    }
  } catch (error) {
    console.error("Error saat membandingkan kata sandi:", error);
    res.status(500).json({ message: "Terjadi kesalahan server saat login." });
  }
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
