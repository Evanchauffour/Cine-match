import { View, Text, Modal, Pressable, Image, StyleSheet, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getMatch } from '@/utils/game';
import Buttons from './Button';

interface MatchedMoviesModalProps {
    isModalVisible: boolean;
    onClose: () => void;
    roomId: any;
}

const MatchedMoviesModal: React.FC<MatchedMoviesModalProps> = ({ isModalVisible, onClose, roomId }) => {
    const [matchedMovies, setMatchedMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        console.log('roomId', roomId);
        
        const getMatchedMovies = async () => {
            setLoading(true);
            try {                    
                const movies = await getMatch(roomId);
                console.log('movies', movies);
                
                setMatchedMovies(movies);
            } catch (error) {
                Alert.alert('Erreur', 'Impossible de récupérer les films matchés');
            } finally {
                setLoading(false);
            }
        };

        getMatchedMovies();
    }, [isModalVisible]);

    return (
        <Modal visible={isModalVisible} transparent={true}>
            <View
                style={styles.modalOverlay}
            >
                <View style={styles.modalContainer}>
                    <Pressable onPress={onClose} style={styles.closeButton}>
                        <Image source={require('../assets/images/closeIcon.png')} style={styles.closeIcon} />
                    </Pressable>
                    <Buttons title="Fermer" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalContainer: {
        width: '80%',
        height: '80%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        justifyContent: 'space-between',
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 10,
    },
    closeIcon: {
        width: 30,
        height: 30,
    },
});

export default MatchedMoviesModal;
