import { View, StyleSheet, TextInput, Pressable, Keyboard, Alert } from 'react-native'
import React, { useState } from 'react'
import Buttons from '@/components/Button'
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function editProfile() {

  const params = useLocalSearchParams();
  const { username, email } = params;
  const [newUserName, setNewUserName] = useState(username);
  const [newEmail, setNewEmail] = useState(email);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const updateUser = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!newUserName || !newEmail || (!password && newPassword) || (password && !newPassword)) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/user/update-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ newUserName, newEmail, newPassword, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Succès', 'Modification réussie !');
        router.push('/profile');
      } else {
        Alert.alert('Erreur', data.message || 'Une erreur est survenue lors de la modification');
      }
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      Alert.alert('Erreur', 'Impossible de se connecter au serveur. Veuillez réessayer plus tard.');
    }
  };

  return (
    <Pressable 
        style={styles.container}
        onPress={() => {
            Keyboard.dismiss();
        }}
    >
        <View style={styles.personalInfos}>
        <TextInput
            style={styles.input}
            placeholder="Nom d'utilisateur"
            value={newUserName.toString() || ''}
            onChangeText={setNewUserName}
        />
        <TextInput
            style={styles.input}
            placeholder="Email"
            value={newEmail.toString() || ''}
            onChangeText={setNewEmail}
        />
        <TextInput
            style={styles.input}
            placeholder="Ancien mot de passe"
            value={password}
            onChangeText={setPassword}
        />
        <TextInput
            style={styles.input}
            placeholder="Nouveau mot de passe"
            value={newPassword}
            onChangeText={setNewPassword}
        />
        <Buttons title="Valider les modifications" onPress={updateUser} />
        </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginHorizontal: 25,
      gap: 20,
    },
    personalInfos: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginHorizontal: 25,
      gap: 20,
      width: '100%',
      marginVertical: 50,
    },
    item: {
      color: 'black',
      fontSize: 16,
      fontFamily: 'Poppins',
      paddingHorizontal: 20,
      paddingVertical: 8,
      alignItems: 'center',
      backgroundColor: 'white',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 3.84,
      elevation: 5,
      width: '100%',
      borderRadius: 20,
    },
    loadingText: {
      fontSize: 18,
      color: 'gray',
    },
    errorText: {
      fontSize: 18,
      color: 'red',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        padding: 10,
        backgroundColor: 'white',
    },
  });