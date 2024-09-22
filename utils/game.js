import { db } from '../firebaseConfig';
import { collection, query, where, updateDoc, doc, getDocs, onSnapshot } from 'firebase/firestore';

export async function addLikedMovie(userId, roomId, movie) {
    try {
        const usersRoomRef = collection(db, 'users_room');
        
        const q = query(usersRoomRef, where('userId', '==', userId), where('roomId', '==', roomId));
        
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error('Document correspondant non trouvé pour les paramètres spécifiés');
        }

        const docSnap = querySnapshot.docs[0];
        const docRef = doc(db, 'users_room', docSnap.id);

        const userRoomData = docSnap.data();
        const matchedMovies = userRoomData.matchedMovies || [];

        matchedMovies.push(movie);

        await updateDoc(docRef, { matchedMovies });

        console.log('Film ajouté avec succès:', movie);
        
    } catch (error) {
        console.error('Erreur lors de l\'ajout du film:', error);
    }
}

export function getMatch(roomId, callback) {
    const usersRoomRef = collection(db, 'users_room');
    const q = query(usersRoomRef, where('roomId', '==', roomId));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        if (querySnapshot.empty) {
            callback([]);
            return;
        }

        const usersRoom = querySnapshot.docs.map(doc => doc.data());
        
        const matchedMovies = usersRoom
            .map(userRoom => userRoom.matchedMovies)
            .filter(movies => movies);

        const commonMovies = matchedMovies.reduce((acc, val) => {
            const accIds = acc.map(movie => movie.id);
            return val.filter(movie => accIds.includes(movie.id));
        });

        callback(commonMovies);
    });

    return unsubscribe;
}

export function getUserLikes (userId, roomId, callback) {
    const usersRoomRef = collection(db, 'users_room');
    const q = query(usersRoomRef, where('userId', '==', userId), where('roomId', '==', roomId));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        if (querySnapshot.empty) {
            callback([]);
            return;
        }

        const userRoom = querySnapshot.docs[0].data();
        callback(userRoom.matchedMovies || []);
    });

    return unsubscribe;
}

export async function checkMatch(roomId, likedMovieId, userId) {
    try {
        const usersRoomRef = collection(db, 'users_room');
        
        const q = query(
            usersRoomRef, 
            where('roomId', '==', roomId),
            where('userId', '!=', userId)
        );
        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            console.log('Aucun autre utilisateur trouvé dans cette room.');
            return false;
        }
        
        const usersRoom = querySnapshot.docs.map(doc => doc.data());

        for (const userRoom of usersRoom) {
            const matchedMovies = userRoom.matchedMovies || [];
            console.log('matchedMovies: ' + JSON.stringify(matchedMovies));
            
            const movieMatched = matchedMovies.some(movie => movie.id === likedMovieId);
            
            if (movieMatched) {
                console.log(`Le film avec l'ID ${likedMovieId} est déjà liké par un autre utilisateur.`);
                return true;
            }
        }

        console.log('Pas de correspondance trouvée pour ce film.');
        return false;
    } catch (error) {
        console.error('Erreur lors de la vérification des correspondances de film:', error);
        return false;
    }
}
