import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

export const getFriends = async(username) => {
    const friendsCollectionRef = collection(db, "users");

    try {
        const q = query(friendsCollectionRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log(`No friends found for ${username}`);
            return [];
        }

        const userDoc = querySnapshot.docs[0];  
        const friends = userDoc.data().friends || []; 

        return friends;

    } catch (err) {
        console.error("Error fetching favourite friends:", err);
        return [];
    }
}


