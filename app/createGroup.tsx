import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Keyboard, Alert } from 'react-native';
import Button from '../components/Button';
import RadioGroup from 'react-native-radio-buttons-group';
import * as Clipboard from 'expo-clipboard';
import { createRoom, getGroupUsers, getRoomDetails, updateRoom } from '../utils/room';
import { auth } from '../firebaseConfig';
import { useLocalSearchParams } from 'expo-router';

interface RoomDetails {
    roomId?: string;
    code?: string;
    category?: string;
    createdBy?: string;
    isActive?: boolean;
    createdAt?: any;
}

interface User {
    uid: string;
    displayName: string;
}

const CreateGroup: React.FC = () => {
    const [selectedId, setSelectedId] = useState<string | undefined>('1');
    const [roomDetails, setRoomDetails] = useState<RoomDetails>({});
    const [groupUsers, setGroupUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const params = useLocalSearchParams();
    const { roomIdToJoin } = params;

    const radioButtons = useMemo(() => ([
        { id: '1', label: 'Films', value: 'Films' },
        { id: '2', label: 'Séries', value: 'Séries' }
    ]), []);

    useEffect(() => {
        const fetchRoomDetails = async () => {
            setLoading(true);
            try {
                if (roomIdToJoin) {         
                    const room = await getRoomDetails(roomIdToJoin);
                    setRoomDetails(room || {});
                } else {
                    if (!auth.currentUser) {
                        throw new Error('Utilisateur non authentifié');
                    }
                    console.log('createRoom');
                    
                    const room = await createRoom(auth.currentUser.uid, selectedId || '1');
                    setRoomDetails(room || {});
                }
            } catch (error) {
                Alert.alert('Erreur', 'Impossible de récupérer les détails de la room.');
            } finally {
                setLoading(false);
            }
        };

        fetchRoomDetails();
    }, []);

    useEffect(() => {
        if (!roomDetails.roomId) return;

        const unsubscribe = getGroupUsers(roomDetails.roomId, (users: User[]) => {
            setGroupUsers(users);
        });

        return () => unsubscribe();
    }, [roomDetails.roomId]);

    const copyToClipboard = () => {
        Clipboard.setStringAsync(roomDetails.code || '');
        Alert.alert('Code copié dans le presse-papiers!');
    };

    const handleStart = async () => {
        try {
            // Implémenter la logique pour démarrer le groupe
        } catch (error) {
            Alert.alert('Erreur', 'Il y a eu un problème lors du démarrage.');
        }
    };

    return (
        <Pressable
            onPress={() => {
                Keyboard.dismiss();
            }}
            style={styles.container}
        >
            <View style={{ marginTop: 40 }}>
                <View style={styles.section}>
                    <Text style={styles.headText}>Séries / Films</Text>
                    <RadioGroup
                        radioButtons={radioButtons}
                        onPress={(selectedId: string) => setSelectedId(selectedId)}
                        selectedId={selectedId}
                        layout='row'
                    />
                </View>
                <View style={styles.section}>
                    <Text style={styles.headText}>Code du groupe</Text>
                    <View style={styles.codeContainer}>
                        <Text style={styles.code}>{roomDetails.code || 'N/A'}</Text>
                    </View>
                    <Button
                        title="Copier le code"
                        onPress={copyToClipboard}
                        buttonStyle={styles.buttonCustomStyles}
                        textStyle={styles.textButtonCustomStyles}
                    />
                </View>
                <View style={styles.section}>
                    <Text style={styles.headText}>Utilisateurs du groupe</Text>
                    <View>
                        {loading ? (
                            <Text>Chargement...</Text>
                        ) : groupUsers.length > 0 ? (
                            groupUsers.map(user => (
                                <Text key={user.uid} style={styles.user}>{user.displayName}</Text>
                            ))
                        ) : (
                            <Text>Aucun utilisateur encore</Text>
                        )}
                    </View>
                </View>
            </View>
            <Button title="Commencer" onPress={handleStart} />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        paddingBottom: 40,
        justifyContent: 'space-between',
        position: 'relative',
    },
    section: {
        marginBottom: 20,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 3.84,
        elevation: 5,
        padding: 10,
        borderRadius: 10,
    },
    headText: {
        fontSize: 16,
        fontFamily: 'Poppins-bold',
        color: 'black',
        marginBottom: 10,
    },
    buttonCustomStyles: {
        width: '80%',
        marginHorizontal: 'auto',
    },
    textButtonCustomStyles: {
        width: '80%',
        marginHorizontal: 'auto',
        fontSize: 14,
        textAlign: 'center',
    },
    codeContainer: {
        color: 'black',
        fontSize: 16,
        fontFamily: 'Poppins',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 5,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 10,
    },
    code: {
        textAlign: 'center',
    },
    user: {
        color: 'black',
        fontSize: 14,
        fontFamily: 'Poppins',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 5,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 10,
    },
});

export default CreateGroup;
