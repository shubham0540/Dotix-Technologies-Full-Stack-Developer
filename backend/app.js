const express = require("express");
const cors = require("cors");

const jobRoutes = require("./routes/job.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/jobs", jobRoutes);
app.use("/run-job", jobRoutes);

module.exports = app;
