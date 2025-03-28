import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

export const checkFiveReviews = async (username) => {
    const reviewsRef = collection(db, "reviews");
    const reviewsQuery = query(reviewsRef, where("username", "==", username));

    try {
        const querySnapshot = await getDocs(reviewsQuery);
        return querySnapshot.size >= 5;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return false;
    }
};
