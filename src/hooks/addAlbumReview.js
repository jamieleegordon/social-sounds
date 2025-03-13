import { addDoc, collection, Timestamp } from "firebase/firestore"
import { db } from "../config/firebase"

export const addAlbumReview = async (rating, review, favSong, 
    username, artistName, albumName) => {

    const reviewsCollectionRef = collection(db, "reviews")

    try {
        await addDoc(reviewsCollectionRef, {
            albumName,
            artistName,
            favSong,
            rating,
            review,
            username,
            createdAt: Timestamp.fromDate(new Date()) 
        })

    } catch (err) {
        console.error(err)
    }
}

