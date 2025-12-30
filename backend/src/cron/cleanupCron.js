import cron from "node-cron";
import fs from "fs";
import path from "path";

const uploadsDir = path.join(process.cwd(), "uploads");

// Runs every night at 12:00 AM
cron.schedule("0 0 * * *", () => {
  console.log("Running daily cleanup cronjob...");

  fs.readdir(uploadsDir, (err, files) => {
    if (err) return console.error("Error reading uploads folder:", err);

    files.forEach(file => {
      const filePath = path.join(uploadsDir, file);

      // Delete any file older than 7 days
      fs.stat(filePath, (err, stats) => {
        if (err) return;

        const now = Date.now();
        const fileAge = now - stats.mtimeMs;

        if (fileAge > 7 * 24 * 60 * 60 * 1000) {
          fs.unlink(filePath, () => {
            console.log("Deleted old file:", file);
          });
        }
      });
    });
  });
});
