import React, { useState } from 'react';
import { View, Text, Pressable, Keyboard, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import Buttons from '@/components/Button';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleSignup = async () => {

    if (!email || !password) {
      Alert.alert('Veuillez remplir tous les champs');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: username,
      });
      Alert.alert('Succès', 'Inscription réussie !');
      router.push('/home');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('L\'email est déjà utilisé.');
      } else {
        console.error('Signup error:', error.message);
      }
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
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <Buttons title="S'inscrire" onPress={handleSignup} buttonStyle={styles.loginButton} />
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
