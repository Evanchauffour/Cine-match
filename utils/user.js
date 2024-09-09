import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';  // Assure-toi que db est bien configuré

export async function getUserDetails(userId) {
    try {
        const q = query(collection(db, 'users'), where('uid', '==', userId));

        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            return {
                uid: userData.uid,
                displayName: userData.username || 'Nom non disponible',
                email: userData.email || 'Email non disponible',
            };
        } else {
            console.error('Aucun utilisateur trouvé avec cet UID.');
            return {
                uid: userId,
                displayName: 'Nom non disponible',
                email: 'Email non disponible',
            };
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des informations utilisateur :', error);
        return {
            uid: userId,
            displayName: 'Nom non disponible',
            email: 'Email non disponible',
        };
    }
}
