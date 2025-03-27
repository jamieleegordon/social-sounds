import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

export const getModeStats = async (username) => {
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

        const modeStats = [];

        for (const albumKey of albumNamesWithArtists) {
            const [albumName, artistName] = albumKey.split('-');
            const albumQuery = query(albumStatsCollectionRef, 
                where("albumName", "==", albumName),
                where("artistName", "==", artistName)
            );
            
            const albumSnapshot = await getDocs(albumQuery);

            albumSnapshot.forEach(doc => {
                const { mode } = doc.data();
                modeStats.push({ albumName, mode });
            });
        }

        if (modeStats.length === 0) {
            console.log("No mode stats found for the reviewed albums.");
            return null;
        }

        return modeStats;
    } catch (error) {
        console.error("Error getting mode stats:", error);
        return null;
    }
};

export const getAverageMode = async (username) => {
    const modeStats = await getModeStats(username);
    
    if (!modeStats || modeStats.length === 0) return 0; 

    const totalMode = modeStats.reduce((sum, stat) => sum + stat.mode, 0);
    return (totalMode / modeStats.length).toFixed(2);
};

