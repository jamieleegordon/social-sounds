import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

export const checkUserExists = async (email) => {
    if (!email) {
        console.error("Invalid email input:", email);
        return false; 
    }

    try {
        const usersCollectionRef = collection(db, "users");
        const q = query(usersCollectionRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        return !querySnapshot.empty; // Returns true if user exists, false otherwise
    } catch (err) {
        console.error("Error checking if user exists:", err);
        return false; 
    }
};