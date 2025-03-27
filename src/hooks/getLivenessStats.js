import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

export const getLivenessStats = async (username) => {
    const reviewsCollectionRef = collection(db, "reviews");
    const albumStatsCollectionRef = collection(db, "albumStats");

    try {
        const q = query(reviewsCollectionRef, where("username", "==", username));
        const reviewSnapshots = await getDocs(q);
        
        if (reviewSnapshots.empty) {
            console.log("No reviews found for this user.");
            return null;
        }

        const albumNamesWithArtists = new Set();
        reviewSnapshots.docs.forEach(doc => {
            const { albumName, artistName } = doc.data();
            const albumKey = `${albumName}-${artistName}`; 
            albumNamesWithArtists.add(albumKey);
        });

        const livenessStats = [];

        for (const albumKey of albumNamesWithArtists) {
            const [albumName, artistName] = albumKey.split('-');
            const albumQuery = query(albumStatsCollectionRef, 
                where("albumName", "==", albumName),
                where("artistName", "==", artistName)
            );
            
            const albumSnapshot = await getDocs(albumQuery);

            albumSnapshot.forEach(doc => {
                const { liveness } = doc.data();
                livenessStats.push({ albumName, liveness });
            });
        }

        if (livenessStats.length === 0) {
            console.log("No Key stats found for the reviewed albums.");
            return null;
        }

        return livenessStats;
    } catch (error) {
        console.error("Error getting energy stats:", error);
        return null;
    }
};

export const getAverageLiveness = async (username) => {
    const livenessStats = await getLivenessStats(username);
    
    if (!livenessStats || livenessStats.length === 0) return 0; 

    const totalLiveness = livenessStats.reduce((sum, stat) => sum + stat.liveness, 0);
    return (totalLiveness / livenessStats.length).toFixed(2);
}

