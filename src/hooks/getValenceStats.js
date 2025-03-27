import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

export const getValenceStats = async (username) => {
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

        const valenceStats = [];

        for (const albumKey of albumNamesWithArtists) {
            const [albumName, artistName] = albumKey.split('-');
            const albumQuery = query(albumStatsCollectionRef, 
                where("albumName", "==", albumName),
                where("artistName", "==", artistName)
            );
            
            const albumSnapshot = await getDocs(albumQuery);

            albumSnapshot.forEach(doc => {
                const { valence } = doc.data();
                valenceStats.push({ albumName, valence });
            });
        }

        if (valenceStats.length === 0) {
            console.log("No valence stats found for the reviewed albums.");
            return null;
        }

        return valenceStats;
    } catch (error) {
        console.error("Error getting valence stats:", error);
        return null;
    }
};

export const getAverageValence = async (username) => {
    const valenceStats = await getValenceStats(username);
    
    if (!valenceStats || valenceStats.length === 0) return 0; 

    const totalValence = valenceStats.reduce((sum, stat) => sum + stat.valence, 0);
    return (totalValence / valenceStats.length).toFixed(2);
}


