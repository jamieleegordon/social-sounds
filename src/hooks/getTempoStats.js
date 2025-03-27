import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

export const getTempoStats = async (username) => {
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

        const tempoStats = [];

        for (const albumKey of albumNamesWithArtists) {
            const [albumName, artistName] = albumKey.split('-');
            const albumQuery = query(albumStatsCollectionRef, 
                where("albumName", "==", albumName),
                where("artistName", "==", artistName)
            );
            
            const albumSnapshot = await getDocs(albumQuery);

            albumSnapshot.forEach(doc => {
                const { tempo } = doc.data();
                tempoStats.push({ albumName, tempo });
            });
        }

        if (tempoStats.length === 0) {
            console.log("No tempo found for the reviewed albums.");
            return null;
        }

        return tempoStats;
    } catch (error) {
        console.error("Error getting tempo stats:", error);
        return null;
    }
};

export const getAverageTempo = async (username) => {
    const tempoStats = await getTempoStats(username);
    
    if (!tempoStats || tempoStats.length === 0) return 0; 

    const totalTempo = tempoStats.reduce((sum, stat) => sum + stat.tempo, 0);
    return (totalTempo / tempoStats.length).toFixed(2);
}


