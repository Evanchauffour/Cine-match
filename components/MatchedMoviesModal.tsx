import { View, Text, Modal, Pressable, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getMatch } from '@/utils/game';
import Buttons from './Button';
interface MatchedMoviesModalProps {
    isModalVisible: boolean;
    onClose: () => void;
    roomId: any;
}

const MatchedMoviesModal: React.FC<MatchedMoviesModalProps> = ({ isModalVisible, onClose, movies }) => {
    const [loading, setLoading] = useState<boolean>(false);
    
    return (
        <Modal visible={isModalVisible} transparent={true} animationType="fade">
            <View
                style={styles.modalOverlay}
            >
                <View style={styles.modalContainer}>
                    <Pressable onPress={onClose} style={styles.closeButton}>
                        <Image source={require('../assets/images/closeIcon.png')} style={styles.closeIcon} />
                    </Pressable>
                    <ScrollView style={{flex: 1, marginTop: 50, marginBottom: 20}}>
                        {loading ? (
                            <Text>Loading...</Text>
                        ) : (
                            movies.map((movie) => (
                                <View key={movie.id} style={styles.movieItem}>
                                    <Image source={{ uri: movie.img }} style={{ width: 50, height: 70 }} />
                                    <Text style={styles.movieTitle}>{movie.title}</Text>
                                </View>
                            ))
                        )}
                    </ScrollView>
                    <Buttons title="Continuer" onPress={onClose} />
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
        width: '90%',
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
        right: 20,
        zIndex: 10,
    },
    closeIcon: {
        width: 30,
        height: 30,
    },
    movieItem: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        padding: 10,
        marginVertical: 5,
        marginHorizontal: 5,
        borderRadius: 5,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 3.84,
        elevation: 5,
    },
    movieTitle: {
        fontFamily: 'Poppins-bold',
        fontSize: 14,
        color: 'black',
        width: '80%',
    }
});

export default MatchedMoviesModal;
