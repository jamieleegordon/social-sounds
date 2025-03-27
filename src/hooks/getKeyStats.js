import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

export const getKeyStats = async (username) => {
    const reviewsCollectionRef = collection(db, "reviews");
    const albumStatsCollectionRef = collection(db, "albumStats");

    try {
        // Step 1: Get reviews made by the user
        const q = query(reviewsCollectionRef, where("username", "==", username));
        const reviewSnapshots = await getDocs(q);
        
        if (reviewSnapshots.empty) {
            console.log("No reviews found for this user.");
            return null;
        }

        // Step 2: Extract unique albumName and artistName combinations
        const albumNamesWithArtists = new Set();
        reviewSnapshots.docs.forEach(doc => {
            const { albumName, artistName } = doc.data();
            const albumKey = `${albumName}-${artistName}`; // Unique identifier for album + artist
            albumNamesWithArtists.add(albumKey);
        });

        // Step 3: Prepare the queries for fetching corresponding album stats
        const keyStats = [];

        for (const albumKey of albumNamesWithArtists) {
            const [albumName, artistName] = albumKey.split('-');
            const albumQuery = query(albumStatsCollectionRef, 
                where("albumName", "==", albumName),
                where("artistName", "==", artistName)
            );
            
            const albumSnapshot = await getDocs(albumQuery);

            // Step 4: Collect energies for each album
            albumSnapshot.forEach(doc => {
                const { key } = doc.data();
                keyStats.push({ albumName, key });
            });
        }

        if (keyStats.length === 0) {
            console.log("No Key stats found for the reviewed albums.");
            return null;
        }

        return keyStats;
    } catch (error) {
        console.error("Error getting energy stats:", error);
        return null;
    }
};

export const getAverageKey = async (username) => {
    const keyStats = await getKeyStats(username);
    
    if (!keyStats || keyStats.length === 0) return 0; 

    const totalKey = keyStats.reduce((sum, stat) => sum + stat.key, 0);
    return (totalKey / keyStats.length).toFixed(2);
};