import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

// Import from the v2 SDK
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";

// This check prevents the app from crashing on startup
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// =================================================================
// CREATE USER FUNCTION (Updated to v2 syntax)
// =================================================================
export const createUser = onCall(async (request) => {
  // 1. Authentication Check: Use 'request.auth' in v2
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "The function must be called while authenticated.",
    );
  }

  // 2. Authorization Check
  const callingUid = request.auth.uid;
  const callingUserDoc = await db.collection("users").doc(callingUid).get();
  if (callingUserDoc.data()?.role !== "admin") {
    throw new HttpsError(
      "permission-denied",
      "You must be an admin to create new users.",
    );
  }

  // 3. Data Validation: Get data from 'request.data' in v2
  const { email, password, firstName, lastName, role } = request.data;
  if (!email || !password || !firstName || !lastName || !role) {
    throw new HttpsError(
      "invalid-argument",
      "Missing required user data fields.",
    );
  }

  // 4. Create the user
  try {
    const userRecord = await admin.auth().createUser({ email, password, displayName: `${firstName} ${lastName}` });
    await db.collection("users").doc(userRecord.uid).set({ uid: userRecord.uid, email, firstName, lastName, role });
    return { status: "success", message: `Successfully created user ${email} with UID ${userRecord.uid}` };
  } catch (error: any) {
    console.error("Error creating new user:", error);
    throw new HttpsError("internal", error.message);
  }
});

// =================================================================
// DAILY REPORT FUNCTION (Updated to v2 syntax)
// =================================================================
export const dailyInfoRequestReport = onSchedule({
    schedule: "every 24 hours",
    region: "us-central1",
}, async (event) => {
    
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "cswear1993@icloud.com", // Your Google Account username
            pass: "dhcbnordbpmaucck",      // Your Google App Password
        },
    });

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    const querySnapshot = await admin.firestore().collection("infoRequests").where("submittedAt", ">=", oneDayAgo).get();

    if (querySnapshot.empty) {
        console.log("No new info requests to send.");
        return;
    }
    let emailBody = "<h1>Daily Information Request Report</h1>";
    emailBody += `<p>Found ${querySnapshot.size} new request(s):</p><ul>`;
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        emailBody += `<li><strong>Name:</strong> ${data.name}<br/><strong>Email:</strong> ${data.email}<br/><strong>Message:</strong> ${data.message || "N/A"}</li><hr/>`;
    });
    emailBody += "</ul>";
    const mailOptions = {
        from: `SAMS Application <cswear1993@icloud.com>`,
        to: "cswear1993@icloud.com",
        subject: "SAMS - Daily Information Request Report",
        html: emailBody,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log("Daily report email sent successfully.");
    } catch (error) {
        console.error("Error sending email:", error);
    }
    return;
});