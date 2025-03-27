import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

export const getDanceabilityStats = async (username) => {
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
        const danceabilityStats = [];

        for (const albumKey of albumNamesWithArtists) {
            const [albumName, artistName] = albumKey.split('-');
            const albumQuery = query(albumStatsCollectionRef, 
                where("albumName", "==", albumName),
                where("artistName", "==", artistName)
            );
            
            const albumSnapshot = await getDocs(albumQuery);

            // Step 4: Collect energies for each album
            albumSnapshot.forEach(doc => {
                const { danceability } = doc.data();
                danceabilityStats.push({ albumName, danceability });
            });
        }

        // Step 5: Return the energy stats for all reviewed albums
        if (danceabilityStats.length === 0) {
            console.log("No danceability stats found for the reviewed albums.");
            return null;
        }

        return danceabilityStats;
    } catch (error) {
        console.error("Error getting energy stats:", error);
        return null;
    }
};

export const getAverageDanceability = async (username) => {
    const danceabilityStats = await getDanceabilityStats(username);
    
    if (!danceabilityStats || danceabilityStats.length === 0) return 0; 

    const totaldDanceability = danceabilityStats.reduce((sum, stat) => sum + stat.danceability, 0);
    return (totaldDanceability / danceabilityStats.length).toFixed(2);
};