import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

export const checkUsernameTaken = async (username) => {
    try {
        const usersCollectionRef = collection(db, "users");
        const q = query(usersCollectionRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        return !querySnapshot.empty; // Returns true if user exists, false otherwise
    } catch (err) {
        console.error("Error checking if user exists:", err);
        return false; 
    }
};