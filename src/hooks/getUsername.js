import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../config/firebase"

export const getUsername = async (email) => {
    const usersCollectionRef = collection(db, "users");
    
    const q = query(usersCollectionRef, where("email", "==", email));
    
    try {
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].data().username;
        } else {
            return null; 
        }
    } catch (err) {
        console.error("Error fetching username:", err);
        return null;
    }
};