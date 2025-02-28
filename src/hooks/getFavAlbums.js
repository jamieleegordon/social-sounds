import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

export const getFavAlbums = async (username) => {
    const favAlbumsCollectionRef = collection(db, "favouriteAlbums");

    try {
        const q = query(favAlbumsCollectionRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log(`No favourite albums found for ${username}`);
            return [];
        }

        const userDoc = querySnapshot.docs[0];  
        const favAlbums = userDoc.data().albums || []; 

        return favAlbums;

    } catch (err) {
        console.error("Error fetching favourite albums:", err);
        return [];
    }
};
