import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

export const getFavGenre = async (username) => {
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

        // Step 2: Extract albumName and artistName from the reviews
        const albumQueries = reviewSnapshots.docs.map(doc => {
            const { albumName, artistName } = doc.data();
            return query(albumStatsCollectionRef, 
                where("albumName", "==", albumName), 
                where("artistName", "==", artistName)
            );
        });

        // Step 3: Fetch album stats and collect genres
        const genreCount = {};

        for (const albumQuery of albumQueries) {
            const albumSnapshot = await getDocs(albumQuery);
            albumSnapshot.forEach(doc => {
                const { genre } = doc.data();
                genreCount[genre] = (genreCount[genre] || 0) + 1;
            });
        }

        // Step 4: Determine the most common genre
        if (Object.keys(genreCount).length === 0) {
            console.log("No genres found for the reviewed albums.");
            return null;
        }

        const favoriteGenre = Object.entries(genreCount).reduce((a, b) => (b[1] > a[1] ? b : a))[0];

        return favoriteGenre;
    } catch (error) {
        console.error("Error getting favorite genre:", error);
        return null;
    }
};
