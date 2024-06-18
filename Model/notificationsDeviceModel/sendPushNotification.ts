import { IUserNotificationToken } from "./userNotificationToken";

const apn = require("apn");
const path = require("path");
const DeviceToken = require("./deviceToken.model");

// Construct the full path to the APNs key file using __dirname
const apnKeyPath = path.resolve(__dirname, "./AuthKey.p8");

const options = {
  token: {
    key: apnKeyPath, // Path to the .p8 file
    keyId: "YOUR_KEY_ID", // The Key ID from the Apple Developer Member Center
    teamId: "YOUR_TEAM_ID", // The Team ID from the Apple Developer Member Center
  },
  production: false, // Set to true if using production environment
};

let apnProvider: any; // = new apn.Provider(options);

console.log("\n\n\nAPN Options", options);

console.log("\nAfter Getting the credentials p8");
console.log(
  "Change This :",
  "let apnProvider: any;",
  " To const anpProvider = new apn.Provider(options);"
);

async function sendPushNotification(userId: any, message: string) {
  const tokens = await DeviceToken.find({ userId });
  if (!tokens.length) {
    console.log("No device tokens found for user");
    return;
  }

  const deviceTokens = tokens.map(
    (token: IUserNotificationToken) => token.deviceToken
  );
  const notification = new apn.Notification();

  notification.alert = message;
  notification.sound = "default";
  notification.topic = "your.app.bundle.id"; // Your app's bundle ID

  console.log(notification);

  const result = await apnProvider.send(notification, deviceTokens);
  console.log("Sent:", result.sent.length);
  console.log("Failed:", result.failed.length);
  console.log(result.failed);

  return result;
}

module.exports = sendPushNotification;

// Example usage
// sendPushNotification("user123", "Hello, this is a test notification!");
