import { addDoc, collection } from "firebase/firestore"
import { db } from "../config/firebase"

export const addNewUser = async (email, username) => {
    const usersCollectionRef = collection(db, "users")

    try {
        await addDoc(usersCollectionRef, {
            email,
            username,
            friends: []
        })
    } catch (err) {
        console.error(err)
    }
}
