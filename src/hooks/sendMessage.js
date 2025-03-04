import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";

export const sendMessage = async (username, friendUsername, message) => {
    const messagesCollectionRef = collection(db, "messages")

    try {
        console.log("Sending ", message, "to ", friendUsername)
        await addDoc(messagesCollectionRef, {
            message,
            sender: username,
            recipient: friendUsername,
            participants: [username, friendUsername],
            createdAt: serverTimestamp()
        })

        console.log(message, "sent to ", friendUsername)
    } catch (err) {
        console.error(err)
    }
}
