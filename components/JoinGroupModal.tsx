import { View, Text, Modal, Pressable, Image, StyleSheet, TextInput, Keyboard } from 'react-native';
import React, { useEffect, useRef } from 'react';
import Buttons from './Button';

interface JoinGroupModalProps {
    isModalVisible: boolean;
    onClose: () => void;
}

const JoinGroupModal: React.FC<JoinGroupModalProps> = ({ isModalVisible, onClose }) => {
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (isModalVisible) {
            inputRef.current?.focus();
        }
    }, [isModalVisible]);

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
                    <Text style={styles.modalTitle}>Entrez le code du groupe</Text>
                    <TextInput
                        style={styles.input}
                        ref={inputRef}
                        autoCapitalize='characters'
                        textAlign='center'
                    />
                    <Buttons title="Rejoindre" onPress={() => {}} />
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
    modalTitle: {
        fontSize: 20,
        fontFamily: 'Poppins',
        color: 'black',
        textAlign: 'center',
        marginTop: 30,
    },
    input: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        padding: 10,
        marginVertical: 20,
    },
});

export default JoinGroupModal;
