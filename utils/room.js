import { auth, db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp, onSnapshot, query, where, updateDoc, doc, getDocs, getDoc, deleteDoc } from 'firebase/firestore';
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

    return roomRef.id;
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


export async function updateRoomDb(roomId, updates) {
    console.log(updates);
    
    try {
        const roomRef = doc(db, 'rooms', roomId);

        await updateDoc(roomRef, updates);
        console.log('Room updated successfully.');
        
    } catch (error) {
        console.error('Error updating room:', error);
        throw new Error('Impossible de mettre à jour la room.');
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

export async function leaveGroup(roomId, userId) {
    try {
        const q = query(collection(db, 'users_room'), where('roomId', '==', roomId), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
    } catch (error) {
        console.error("Error leaving group: ", error);
    }
}

