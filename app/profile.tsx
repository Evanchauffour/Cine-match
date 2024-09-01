import { SafeAreaView, StyleSheet } from 'react-native'
import React from 'react'
import Buttons from '@/components/Button'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function profile() {


    const handleLogout = async () => {
        try {
          await AsyncStorage.removeItem('token');
          router.push('/auth');
        } catch (error) {
          console.error('Erreur lors de la déconnexion:', error);
        }
      };
  
  return (
    <SafeAreaView style={styles.container}>
      <Buttons title="Se déconnecter" onPress={handleLogout} />
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