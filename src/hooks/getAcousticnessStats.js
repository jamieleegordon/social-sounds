import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

export const getAcousticnessStats = async (username) => {
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
        const acousticnessStats = [];

        for (const albumKey of albumNamesWithArtists) {
            const [albumName, artistName] = albumKey.split('-');
            const albumQuery = query(albumStatsCollectionRef, 
                where("albumName", "==", albumName),
                where("artistName", "==", artistName)
            );
            
            const albumSnapshot = await getDocs(albumQuery);

            // Step 4: Collect energies for each album
            albumSnapshot.forEach(doc => {
                const { acousticness } = doc.data();
                acousticnessStats.push({ albumName, acousticness });
            });
        }

        // Step 5: Return the energy stats for all reviewed albums
        if (acousticnessStats.length === 0) {
            console.log("No acousticness stats found for the reviewed albums.");
            return null;
        }

        return acousticnessStats;
    } catch (error) {
        console.error("Error getting energy stats:", error);
        return null;
    }
};


export const getAverageAcousticness = async (username) => {
    const acousticnessStats = await getAcousticnessStats(username);
    
    if (!acousticnessStats || acousticnessStats.length === 0) return 0; 

    const totalAcousticness = acousticnessStats.reduce((sum, stat) => sum + stat.acousticness, 0);
    return (totalAcousticness / acousticnessStats.length).toFixed(2);
};