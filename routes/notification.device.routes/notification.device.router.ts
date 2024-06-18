const express = require("express");
const mongoose = require("mongoose");
const User = require("../../Model/user.models/user.model");
const DeviceToken = require("../../Model/notificationsDeviceModel/deviceToken.model");
const apn = require("apn");

const sendPushNotification = require("../../Model/notificationsDeviceModel/sendPushNotification");

const router = express.Router();

// Register device token
router.post("/register-device-token", async (req: any, res: any) => {
  const { userId, deviceToken } = req.body;

  try {
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Check if the device token already exists
    let token = await DeviceToken.findOne({ userId, deviceToken });
    if (!token) {
      token = new DeviceToken({ userId, deviceToken });
      await token.save();
    } else {
      token.updatedAt = Date.now();
      await token.save();
    }

    res.status(200).send("Token registered successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error registering token");
  }
});
// Send push notification
router.post("/send-notification", async (req: any, res: any) => {
  const { userId, message } = req.body;

  try {
    let result = await sendPushNotification(userId, message);

    res.status(200).send("Notification sent successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending notification");
  }
});

module.exports = router;
