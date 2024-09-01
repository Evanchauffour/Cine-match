import { View, Text, Pressable, Keyboard, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import Buttons from '@/components/Button';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Succès', 'Connexion réussie !');
        await AsyncStorage.setItem('token', data.token);
        router.push('/home');
      } else {
        Alert.alert('Erreur', data.message || 'Une erreur est survenue lors de la connexion');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      Alert.alert('Erreur', 'Impossible de se connecter au serveur. Veuillez réessayer plus tard.');
    }
  };

  return (
    <Pressable
        onPress={() => {
            Keyboard.dismiss();
        }}
        style={styles.loginContainer}
    >
      <View style={styles.form}>
        <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
        />
        <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
        />
        <TouchableOpacity>
            <Text>Mot de passe oublié ?</Text>
        </TouchableOpacity>
        <Buttons title="Se connecter" onPress={handleLogin} buttonStyle={styles.loginButton}/>
        <View style={styles.notHaveAccountContainer}>
          <Text style={styles.notHaveAccountText}>
            Vous n'avez pas de compte ? 
          </Text>
          <TouchableOpacity style={styles.notHaveAccountButton} onPress={() => router.push('/register')}>
            <Text style={styles.signupText}>Inscrivez-vous</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    form: {
        width: '80%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    loginButton: {
        marginTop: 50,
    },
    notHaveAccountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        justifyContent: 'center',
      },
      notHaveAccountText: {
        textAlign: 'center',
      },
      signupText: {
        color: '#831FE8',
        textDecorationLine: 'underline',
      },
      notHaveAccountButton: {
        marginLeft: 5,
      },
});