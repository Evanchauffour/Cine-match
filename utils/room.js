import { auth, db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp, onSnapshot, query, where, updateDoc, doc, getDocs, getDoc } from 'firebase/firestore';
import { getUserDetails } from './user';

export function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function createRoom(userId, category) {
    if (!userId) throw new Error('User ID is required.');

    const roomCode = generateRoomCode();
    
    const roomRef = await addDoc(collection(db, 'rooms'), {
        code: roomCode,
        createdBy: userId,
        category: category,
        isActive: false,
        createdAt: serverTimestamp()
    });

    await addDoc(collection(db, 'users_room'), {
        roomId: roomRef.id,
        userId: userId,
        matchedMovies: [],
        matchCount: 0,
        isReady: false
    });

    console.log(roomRef.id);
    

    return getRoomDetails(roomRef.id);
}

export async function joinRoom(code) {
    try {
        const q = query(collection(db, 'rooms'), where('code', '==', code));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            if (!auth.currentUser) throw new Error('User is not authenticated.');

            const userId = auth.currentUser.uid;
            const roomDoc = querySnapshot.docs[0];
            const roomId = roomDoc.id;

            await addDoc(collection(db, 'users_room'), {
                roomId: roomId,
                userId: userId,
                matchedMovies: [],
                matchCount: 0,
                isReady: false
            });

            return roomId;
        } else {
            console.log('No room found with this code.');
            return null;
        }
    } catch (error) {
        console.error('Error joining the room:', error);
        return null;
    }
}

export async function getRoomDetails(roomId) {
    try {
        const roomRef = doc(db, 'rooms', roomId);
        const roomSnapshot = await getDoc(roomRef);

        if (roomSnapshot.exists()) {
            const roomData = roomSnapshot.data();
            return { ...roomData, roomId: roomSnapshot.id };
        } else {
            console.log('No room found with this ID.');
            return null;
        }
    } catch (error) {
        console.error('Error retrieving room details:', error);
        return null;
    }
}

export async function updateRoom(roomId, category) {
    try {
        const roomRef = doc(db, 'rooms', roomId);
        await updateDoc(roomRef, { category });
    } catch (error) {
        console.error('Error updating room:', error);
    }
}

export function getGroupUsers(roomId, callback) {
    const q = query(collection(db, 'users_room'), where('roomId', '==', roomId));
    
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const users = [];
        const userPromises = querySnapshot.docs.map(async (doc) => {
            const userData = doc.data();
            const userDetails = await getUserDetails(userData.userId);
            users.push(userDetails);
        });

        await Promise.all(userPromises);
        callback(users);
    });

    return unsubscribe;
}
