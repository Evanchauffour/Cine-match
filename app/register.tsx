import React, { useState } from 'react';
import { View, Text, Pressable, Keyboard, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import Buttons from '@/components/Button';
import { router } from 'expo-router';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Succès', 'Inscription réussie !');
        router.push('/login');
      } else {
        Alert.alert('Erreur', data.message || 'Une erreur est survenue lors de l\'inscription');
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
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
          placeholder="Nom d'utilisateur"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <Buttons title="S'inscrire" onPress={handleRegister} buttonStyle={styles.loginButton} />
        <View style={styles.notHaveAccountContainer}>
          <Text style={styles.notHaveAccountText}>
            Vous avez déjà un compte ? 
          </Text>
          <TouchableOpacity style={styles.notHaveAccountButton} onPress={() => router.push('/login')}>
            <Text style={styles.signupText}>Connectez-vous</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  form: {
    flex: 1,
    width: '80%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
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
