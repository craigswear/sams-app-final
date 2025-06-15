require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, writeBatch, doc } = require('firebase/firestore');
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const accommodations = [
    { id: "extended-time", name: "Extended Time", description: "50% extra time on tests and assignments." },
    { id: "preferential-seating", name: "Preferential Seating", description: "Seating near the front of the class to minimize distractions." },
    { id: "read-aloud", name: "Read Aloud", description: "Test questions and reading passages can be read aloud to the student." },
    { id: "frequent-breaks", name: "Frequent Breaks", description: "Allows for short, frequent breaks during long tasks." },
    { id: "visual-aids", name: "Use of Visual Aids", description: "Utilize charts, graphs, and pictures to supplement instruction." },
];
const students = [
    { firstName: "John", lastName: "Doe", studentId: "111222", accommodations: [accommodations[0], accommodations[1]] },
    { firstName: "Jane", lastName: "Smith", studentId: "333444", accommodations: [accommodations[2]] },
    { firstName: "Peter", lastName: "Jones", studentId: "555666", accommodations: [accommodations[0], accommodations[3], accommodations[4]] },
    { firstName: "Mary", lastName: "Williams", studentId: "777888", accommodations: [accommodations[1]] },
    { firstName: "David", lastName: "Brown", studentId: "999000", accommodations: [] },
];
async function seedDatabase() {
    console.log("Starting database seed...");
    const batch = writeBatch(db);
    const accommodationsCollection = collection(db, 'accommodations');
    accommodations.forEach(acc => {
        const docRef = doc(accommodationsCollection, acc.id);
        batch.set(docRef, acc);
    });
    console.log("Prepared accommodations for batch write...");
    const studentsCollection = collection(db, 'students');
    students.forEach(student => {
        const docRef = doc(studentsCollection);
        batch.set(docRef, student);
    });
    console.log("Prepared students for batch write...");
    try {
        await batch.commit();
        console.log("✅ Success! Database has been seeded.");
    } catch (error) {
        console.error("❌ Error seeding database: ", error);
        process.exit(1);
    }
    process.exit(0);
}
seedDatabase();