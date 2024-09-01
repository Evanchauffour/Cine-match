import { Text, SafeAreaView, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Buttons from './Button';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Header() {
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
      }
    };

    checkAuth();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.logo}>
            <Text style={styles.text1}>Cine</Text>
            <Text style={styles.text2}>Match</Text>
        </View>
        {isAuthenticated && <Buttons title="Profil" onPress={() => router.push('/profile')} />}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: 25,
      height: 120,
    },
    logo: {
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
    },
    text1: {
        fontSize: 24,
        fontFamily: 'Poppins-bold',
        color: '#831FE8',
    },
    text2: {
        fontSize: 24,
        fontFamily: 'Poppins-extraLight',
        color: 'black',
    }
  });