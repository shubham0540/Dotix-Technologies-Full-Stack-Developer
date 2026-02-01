const db = require("../db");
const axios = require("axios");

exports.executeJob = (jobId) => {
  db.query(
    "UPDATE jobs SET status='running' WHERE id=? AND status='pending'",
    [jobId]
  );

  setTimeout(() => {
    db.query(
      "UPDATE jobs SET status='completed', updatedAt=NOW() WHERE id=?",
      [jobId],
      () => {
        db.query("SELECT * FROM jobs WHERE id=?", [jobId], async (err, rows) => {
          if (!rows.length) return;

          const job = rows[0];

          const webhookPayload = {
            jobId: job.id,
            taskName: job.taskName,
            priority: job.priority,
            payload: JSON.parse(job.payload),
            completedAt: new Date()
          };

          try {
            const response = await axios.post(
              process.env.WEBHOOK_URL,
              webhookPayload
            );
            console.log("Webhook sent:", response.status);
          } catch (err) {
            console.error("Webhook failed:", err.message);
          }
        });
      }
    );
  }, 3000);
};
