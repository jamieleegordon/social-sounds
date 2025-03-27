import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

export const getSpeechinessStats = async (username) => {
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

        const speechinessStats = [];

        for (const albumKey of albumNamesWithArtists) {
            const [albumName, artistName] = albumKey.split('-');
            const albumQuery = query(albumStatsCollectionRef, 
                where("albumName", "==", albumName),
                where("artistName", "==", artistName)
            );
            
            const albumSnapshot = await getDocs(albumQuery);

            albumSnapshot.forEach(doc => {
                const { speechiness } = doc.data();
                speechinessStats.push({ albumName, speechiness });
            })
        }

        if (speechinessStats.length === 0) {
            console.log("No mode speechiness found for the reviewed albums.");
            return null;
        }

        return speechinessStats;
    } catch (error) {
        console.error("Error getting speechiness stats:", error);
        return null;
    }
};

export const getAverageSpeechiness = async (username) => {
    const speechinessStats = await getSpeechinessStats(username);
    
    if (!speechinessStats || speechinessStats.length === 0) return 0; 

    const totalSpeechiness = speechinessStats.reduce((sum, stat) => sum + stat.speechiness, 0);
    return (totalSpeechiness / speechinessStats.length).toFixed(2);
}


