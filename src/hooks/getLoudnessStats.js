import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

export const getLoudnessStats = async (username) => {
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

        const loudnessStats = [];

        for (const albumKey of albumNamesWithArtists) {
            const [albumName, artistName] = albumKey.split('-');
            const albumQuery = query(albumStatsCollectionRef, 
                where("albumName", "==", albumName),
                where("artistName", "==", artistName)
            );
            
            const albumSnapshot = await getDocs(albumQuery);

            albumSnapshot.forEach(doc => {
                const { loudness } = doc.data();
                loudnessStats.push({ albumName, loudness });
            });
        }

        if (loudnessStats.length === 0) {
            console.log("No Key stats found for the reviewed albums.");
            return null;
        }

        return loudnessStats;
    } catch (error) {
        console.error("Error getting loudness stats:", error);
        return null;
    }
};

export const getAverageLoudness = async (username) => {
    const loudnessStats = await getLoudnessStats(username);
    
    if (!loudnessStats || loudnessStats.length === 0) return 0; 

    const totalLoudness = loudnessStats.reduce((sum, stat) => sum + stat.loudness, 0);
    return (totalLoudness / loudnessStats.length).toFixed(2);
}

