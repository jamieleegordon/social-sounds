import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

export const getInstrumentalnessStats = async (username) => {
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

        const instrumentalnessStats = [];

        for (const albumKey of albumNamesWithArtists) {
            const [albumName, artistName] = albumKey.split('-');
            const albumQuery = query(albumStatsCollectionRef, 
                where("albumName", "==", albumName),
                where("artistName", "==", artistName)
            );
            
            const albumSnapshot = await getDocs(albumQuery);

            albumSnapshot.forEach(doc => {
                const { instrumentalness } = doc.data();
                instrumentalnessStats.push({ albumName, instrumentalness });
            });
        }

        if (instrumentalnessStats.length === 0) {
            console.log("No instrumentalness stats found for the reviewed albums.");
            return null;
        }

        return instrumentalnessStats;
    } catch (error) {
        console.error("Error getting energy stats:", error);
        return null;
    }
};
