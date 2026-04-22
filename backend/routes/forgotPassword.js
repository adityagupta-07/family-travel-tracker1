import express from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import authDb from "../utils/db_auth.js";
import sendOtpEmail from "../utils/sendEmail.js";

const router = express.Router();

// SEND OTP
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const result = await authDb.query(
      "SELECT id FROM auth_users WHERE email = $1",
      [email]
    );
    // Always return success even if email not found (security)
    if (result.rows.length === 0) {
        return res.status(404).json({ error: "No account found with this email" });
    }

    const userId = result.rows[0].id;
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTPs for this user
    await authDb.query("DELETE FROM password_resets WHERE user_id = $1", [userId]);

    await authDb.query(
      "INSERT INTO password_resets (user_id, otp_hash, expires_at) VALUES ($1, $2, $3)",
      [userId, otpHash, expiresAt]
    );

    await sendOtpEmail(email, otp);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// VERIFY OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const userResult = await authDb.query(
      "SELECT id FROM auth_users WHERE email = $1",
      [email]
    );
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const userId = userResult.rows[0].id;
    const resetResult = await authDb.query(
      "SELECT * FROM password_resets WHERE user_id = $1 AND used = FALSE ORDER BY created_at DESC LIMIT 1",
      [userId]
    );

    if (resetResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const reset = resetResult.rows[0];

    if (new Date() > new Date(reset.expires_at)) {
      return res.status(400).json({ error: "OTP expired" });
    }

    const match = await bcrypt.compare(otp, reset.otp_hash);
    if (!match) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const userResult = await authDb.query(
      "SELECT id FROM auth_users WHERE email = $1",
      [email]
    );
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const userId = userResult.rows[0].id;
    const resetResult = await authDb.query(
      "SELECT * FROM password_resets WHERE user_id = $1 AND used = FALSE ORDER BY created_at DESC LIMIT 1",
      [userId]
    );

    if (resetResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const reset = resetResult.rows[0];

    if (new Date() > new Date(reset.expires_at)) {
      return res.status(400).json({ error: "OTP expired" });
    }

    const match = await bcrypt.compare(otp, reset.otp_hash);
    if (!match) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await authDb.query(
      "UPDATE auth_users SET password_hash = $1 WHERE id = $2",
      [newHash, userId]
    );

    await authDb.query(
      "UPDATE password_resets SET used = TRUE WHERE id = $1",
      [reset.id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;