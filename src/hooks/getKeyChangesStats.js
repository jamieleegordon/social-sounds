import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

export const getKeyChangesStats = async (username) => {
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
        const keyChangesStats = [];

        for (const albumKey of albumNamesWithArtists) {
            const [albumName, artistName] = albumKey.split('-');
            const albumQuery = query(albumStatsCollectionRef, 
                where("albumName", "==", albumName),
                where("artistName", "==", artistName)
            );
            
            const albumSnapshot = await getDocs(albumQuery);

            // Step 4: Collect energies for each album
            albumSnapshot.forEach(doc => {
                const { keyChanges } = doc.data();
                keyChangesStats.push({ albumName, keyChanges });
            });
        }

        if (keyChangesStats.length === 0) {
            console.log("No key changes stats found for the reviewed albums.");
            return null;
        }

        return keyChangesStats;
    } catch (error) {
        console.error("Error getting energy stats:", error);
        return null;
    }
};

export const getAverageKeyChanges = async (username) => {
    const keyChangesStats = await getKeyChangesStats(username);
    
    if (!keyChangesStats || keyChangesStats.length === 0) return 0; 

    const totaldKeyChanges = keyChangesStats.reduce((sum, stat) => sum + stat.keyChanges, 0);
    return (totaldKeyChanges / keyChangesStats.length).toFixed(2);
};