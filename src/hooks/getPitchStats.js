import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

export const getPitchStats = async (username) => {
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

        const pitchStats = [];

        for (const albumKey of albumNamesWithArtists) {
            const [albumName, artistName] = albumKey.split('-');
            const albumQuery = query(albumStatsCollectionRef, 
                where("albumName", "==", albumName),
                where("artistName", "==", artistName)
            );
            
            const albumSnapshot = await getDocs(albumQuery);

            albumSnapshot.forEach(doc => {
                const { pitch } = doc.data();
                pitchStats.push({ albumName, pitch });
            });
        }

        if (pitchStats.length === 0) {
            console.log("No mode pitch found for the reviewed albums.");
            return null;
        }

        return pitchStats;
    } catch (error) {
        console.error("Error getting pitch stats:", error);
        return null;
    }
};

export const getAveragePitch = async (username) => {
    const pitchStats = await getPitchStats(username);
    
    if (!pitchStats || pitchStats.length === 0) return 0; 

    const totalPitch = pitchStats.reduce((sum, stat) => sum + stat.pitch, 0);
    return (totalPitch / pitchStats.length).toFixed(2);
}


