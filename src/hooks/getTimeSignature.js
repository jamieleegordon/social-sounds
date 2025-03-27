import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

export const getTimeSignatureStats = async (username) => {
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

        const timeSignatureStats = [];

        for (const albumKey of albumNamesWithArtists) {
            const [albumName, artistName] = albumKey.split('-');
            const albumQuery = query(albumStatsCollectionRef, 
                where("albumName", "==", albumName),
                where("artistName", "==", artistName)
            );
            
            const albumSnapshot = await getDocs(albumQuery);

            albumSnapshot.forEach(doc => {
                const { timeSignature } = doc.data();
                timeSignatureStats.push({ albumName, timeSignature });
            });
        }

        if (timeSignatureStats.length === 0) {
            console.log("No timeSignature found for the reviewed albums.");
            return null;
        }

        return timeSignatureStats;
    } catch (error) {
        console.error("Error getting timeSignature stats:", error);
        return null;
    }
};

export const getAverageTimeSignature = async (username) => {
    const timeSignatureStats = await getTimeSignatureStats(username);
    
    if (!timeSignatureStats || timeSignatureStats.length === 0) return 0; 

    const totalTimeSignature = timeSignatureStats.reduce((sum, stat) => sum + stat.timeSignature, 0);
    return (totalTimeSignature / timeSignatureStats.length).toFixed(2);
}


