import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

export const getFavArtist = async (username) => {
    const reviewsCollectionRef = collection(db, "reviews");

    try {
        // Step 1: Get reviews made by the user
        const q = query(reviewsCollectionRef, where("username", "==", username));
        const reviewSnapshots = await getDocs(q);
        
        if (reviewSnapshots.empty) {
            console.log("No reviews found for this user.");
            return null;
        }

        // Step 2: Count artist appearances
        const artistCount = {};

        reviewSnapshots.forEach((doc) => {
            const { artistName } = doc.data();
            artistCount[artistName] = (artistCount[artistName] || 0) + 1;
        });

        // Step 3: Determine the most listened-to artist
        if (Object.keys(artistCount).length === 0) {
            console.log("No artists found in the reviews.");
            return null;
        }

        const mostListenedArtist = Object.entries(artistCount).reduce((a, b) => (b[1] > a[1] ? b : a))[0];

        return mostListenedArtist;
    } catch (error) {
        console.error("Error getting favorite artist:", error);
        return null;
    }
};
