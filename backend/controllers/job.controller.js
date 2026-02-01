const db = require("../db");
const { executeJob } = require("../services/jobRunner.service");

exports.createJob = (req, res) => {
  const { taskName, payload, priority } = req.body;

  if (!taskName || !priority) {
    return res.status(400).json({ message: "taskName and priority required" });
  }

  const sql = `
    INSERT INTO jobs (taskName, payload, priority, status)
    VALUES (?, ?, ?, 'pending')
  `;

  db.query(sql, [taskName, JSON.stringify(payload || {}), priority], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Job created", jobId: result.insertId });
  });
};

exports.getJobs = (req, res) => {
  const { status, priority } = req.query;

  let sql = "SELECT * FROM jobs WHERE 1=1";
  const params = [];

  if (status) {
    sql += " AND status=?";
    params.push(status);
  }

  if (priority) {
    sql += " AND priority=?";
    params.push(priority);
  }

  db.query(sql, params, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

exports.getJobById = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM jobs WHERE id=?", [id], (err, rows) => {
    if (err) return res.status(500).json(err);
    if (!rows.length) return res.status(404).json({ message: "Job not found" });
    res.json(rows[0]);
  });
};

exports.runJob = (req, res) => {
  const { id } = req.params;

  executeJob(id);
  res.json({ message: "Job started" });
};
