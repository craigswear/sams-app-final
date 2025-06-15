import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// Callable function to create a new user
export const createUser = functions.https.onCall(async (data, context) => {
  // 1. Authentication Check: Ensure the user calling the function is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated.",
    );
  }

  // Now that we know context.auth exists, we can safely use it
  const callingUid = context.auth.uid;
  const callingUserDoc = await db.collection("users").doc(callingUid).get();
  const callingUserData = callingUserDoc.data();

  // 2. Authorization Check: Ensure the calling user is an admin
  if (callingUserData?.role !== "admin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "You must be an admin to create new users.",
    );
  }

  // 3. Data Validation
  const { email, password, firstName, lastName, role } = data;
  if (!email || !password || !firstName || !lastName || !role) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing required user data fields.",
    );
  }

  // 4. Create the user in Firebase Authentication and Firestore
  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: `${firstName} ${lastName}`,
    });

    await db.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: email,
      firstName: firstName,
      lastName: lastName,
      role: role,
    });

    return {
      status: "success",
      message: `Successfully created user ${email} with UID ${userRecord.uid}`,
    };
  } catch (error: any) {
    console.error("Error creating new user:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});