import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Keyboard, Alert } from 'react-native';
import Button from '../components/Button';
import { RadioButton } from 'react-native-radio-buttons-group';
import * as Clipboard from 'expo-clipboard';
import { createRoom, getGroupUsers, updateRoomDb } from '../utils/room';
import { auth } from '../firebaseConfig';
import { router, useLocalSearchParams } from 'expo-router';
import useRoomDetails from '../utils/useRoomDetails';

interface User {
    uid: string;
    displayName: string;
}

const CreateGroup: React.FC = () => {
    const [selectedId, setSelectedId] = useState<string | undefined>('1');
    const [groupUsers, setGroupUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const params = useLocalSearchParams();
    const { roomIdToJoin } = params;
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [roomId, setRoomId] = useState<string | undefined>(roomIdToJoin);
    
    const { roomDetails, loading: roomLoading, error: roomError } = useRoomDetails(roomId || '');

    useEffect(() => {
        const fetchRoomDetails = async () => {
            setLoading(true);
            try {
                if (roomIdToJoin) {
                    setRoomId(roomIdToJoin);
                } else {
                    if (!auth.currentUser) {
                        throw new Error('Utilisateur non authentifié');
                    }
                    setCurrentUser(auth.currentUser);
                    
                    const room = await createRoom(auth.currentUser.uid, selectedId || '1');
                    console.log('room', room);
                    
                    setRoomId(room);
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
        if (!roomId) return;

        const unsubscribe = getGroupUsers(roomId, (users: User[]) => {
            setGroupUsers(users);
        });

        return () => unsubscribe();
    }, [roomId]);

    useEffect(() => {
        if(roomDetails?.isActive) {
            router.push({
                pathname: '/game',
                params: {
                  roomId: roomId
                }
              });
        }
    }, [roomDetails?.isActive]);

    const updateRoom = async (roomId: string, selectedId: string, isActive: boolean) => {
        try {
            const updates = {
                category: selectedId,
                isActive: isActive,
            };
    
            await updateRoomDb(roomId, updates);
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de mettre à jour la room.');
        }
    };
    

    const copyToClipboard = () => {
        Clipboard.setStringAsync(roomDetails?.code || '');
        Alert.alert('Code copié dans le presse-papiers!');
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
                    <RadioButton
                        onPress={() => {
                            if (roomId) {
                                updateRoom(roomId, '1', false);
                            }
                        }}
                        id='1'
                        selected={roomDetails?.category === '1'}
                        label='Films'
                        value='1'
                        disabled={currentUser?.uid !== roomDetails?.createdBy}
                    />
                    <RadioButton
                        onPress={() => {
                            if (roomId) {
                                updateRoom(roomId, '2', false);
                            }
                        }}
                        id='2'
                        selected={roomDetails?.category === '2'}
                        label='Séries'
                        value='2'
                        disabled={currentUser?.uid !== roomDetails?.createdBy}
                    />
                </View>
                <View style={styles.section}>
                    <Text style={styles.headText}>Code du groupe</Text>
                    <View style={styles.codeContainer}>
                        <Text style={styles.code}>{roomDetails?.code || 'N/A'}</Text>
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
                        {roomLoading ? (
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
            <Button 
                title="Commencer" 
                onPress={() => {
                    if (roomId) {
                        updateRoom(roomId, roomDetails?.category, true);
                    }
                }}             
                disabled={currentUser?.uid !== roomDetails?.createdBy || groupUsers.length < 2}
            />
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
