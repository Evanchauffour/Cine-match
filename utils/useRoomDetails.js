import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

function useRoomDetails(roomId) {
    const [roomDetails, setRoomDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('start getting room details');
        
        console.log('roomId: ' + roomId);
        
        
        if (!roomId) return;

        // Référence du document Firestore pour la room
        const roomRef = doc(db, 'rooms', roomId);

        // Écoute des mises à jour en temps réel
        const unsubscribe = onSnapshot(roomRef, (docSnapshot) => {
            setLoading(false);
            if (docSnapshot.exists()) {
                setRoomDetails({ ...docSnapshot.data(), roomId: docSnapshot.id });
            } else {
                setRoomDetails(null);
            }
        }, (error) => {
            setLoading(false);
            setError(error);
        });

        // Nettoyer l'abonnement lorsque le composant est démonté ou lorsque roomId change
        return () => unsubscribe();
    }, [roomId]);
    
    return { roomDetails, loading, error };
}

export default useRoomDetails;
