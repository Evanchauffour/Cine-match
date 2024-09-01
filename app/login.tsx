import { View, Text, Pressable, Keyboard, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import Buttons from '@/components/Button';
import { router } from 'expo-router';

export default function login() {
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
        />
        <TextInput
            style={styles.input}
            placeholder="Mot de passe"
        />
        <TouchableOpacity>
            <Text>Mot de passe oublié ?</Text>
        </TouchableOpacity>
        <Buttons title="Se connecter" onPress={() => {}} buttonStyle={styles.loginButton}/>
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