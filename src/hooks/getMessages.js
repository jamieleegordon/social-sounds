import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

export const useMessages = (username, friendUsername) => {
    const messagesRef = collection(db, 'messages');

    const messagesQuery = query(messagesRef, orderBy('createdAt', 'desc'));

    const [allMessages] = useCollectionData(messagesQuery, { idField: 'id' });

    // Filter messages based on participants (both users should be in participants array)
    const filteredMessages = allMessages?.filter((message) => {
        return message.participants.includes(username) && message.participants.includes(friendUsername);
    }) || [];

    return { messages: filteredMessages };
};
