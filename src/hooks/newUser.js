import { addDoc, collection } from "firebase/firestore"
import { db } from "../config/firebase"
import { defaultFavAlbums } from "./addFavouriteAlbums"

export const addNewUser = async (email, username) => {
    const usersCollectionRef = collection(db, "users")

    try {
        await addDoc(usersCollectionRef, {
            email,
            username,
            friends: []
        })

        await defaultFavAlbums(username); 
    } catch (err) {
        console.error(err)
    }
}
