const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const trainingRoutes = require("./routes/trainingRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not set.");
  process.exit(1);
}

const app = express();

const origins = (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",").map((s) => s.trim());
app.use(cors({ origin: origins }));
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("HRM Backend Running..."));

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/trainings", trainingRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Only accept traffic once MongoDB is connected
connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((err) => {
    console.error("Failed to start:", err.message);
    process.exit(1);
  });
