import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Modal, Pressable, Image, StyleSheet, TextInput, Keyboard } from 'react-native';
import Button from './Button';
import RadioGroup from 'react-native-radio-buttons-group';
import * as Clipboard from 'expo-clipboard';

interface CreateGroupModalProps {
    isModalVisible: boolean;
    onClose: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isModalVisible, onClose }) => {
    const inputRef = useRef<TextInput>(null);
    const [selectedId, setSelectedId] = useState<string | undefined>('1');
    const radioButtons = useMemo(() => ([
        {
            id: '1',
            label: 'Films',
            value: 'Films'
        },
        {
            id: '2',
            label: 'Séries',
            value: 'Séries'
        }
    ]), []);

    useEffect(() => {
        if (isModalVisible) {
            inputRef.current?.focus();
        }
    }, [isModalVisible]);

    const copyToClipboard = () => {
        Clipboard.setStringAsync('XAFT2RDAFM');
        alert('Code copié dans le presse-papiers!');
    };

    return (
        <Modal visible={isModalVisible} transparent={true}>
            <Pressable
                onPress={() => {
                    Keyboard.dismiss();
                }}
                style={styles.modalOverlay}
            >
                <View style={styles.modalContainer}>
                    <Pressable onPress={onClose} style={styles.closeButton}>
                        <Image source={require('../assets/images/closeIcon.png')} style={styles.closeIcon} />
                    </Pressable>
                    <View style={{marginTop: 40}}>
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
                                <Text style={styles.code}>XAFT2RDAFM</Text>
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
                            <View style={styles.userContainer}>
                                <Text>Evan Chauffour (vous)</Text>
                            </View>
                        </View>
                    </View>
                    <Button title="Commencer" onPress={() => {}} />
                </View>
            </Pressable>
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
    },
    closeIcon: {
        width: 30,
        height: 30,
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
    userContainer: {
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
});

export default CreateGroupModal;
