import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

export const checkAlbumAlreadyAnalysed = async (albumName, artistName) => {
    try {
        const albumsCollectionRef = collection(db, "albumStats");
        
        const q = query(albumsCollectionRef, 
            where("albumName", "==", albumName), 
            where("artistName", "==", artistName));

        const querySnapshot = await getDocs(q);

        return !querySnapshot.empty; // Returns true if album exists, false otherwise
    } catch (err) {
        console.error("Error checking if album exists:", err);
        return false; 
    }
};