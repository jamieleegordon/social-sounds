import { collection, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../config/firebase";

export const useAlbumReviews = (albumName, artistName) => {
    const reviewsRef = collection(db, "reviews");

    const reviewsQuery = query(
        reviewsRef,
        where("albumName", "==", albumName),
        where("artistName", "==", artistName)
    );

    const [allReviews] = useCollectionData(reviewsQuery, { idField: "id" });

    return { reviews: allReviews || [] };
};
