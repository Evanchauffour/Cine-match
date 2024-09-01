import { SafeAreaView, StyleSheet, Text, View, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Buttons from '@/components/Button';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
  const [userInfo, setUserInfo] = useState<{ username: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.push('/auth');
        return;
      }

      const response = await fetch('http://localhost:4000/api/user/get-user-infos', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
      } else {
        Alert.alert('Erreur', 'Impossible de récupérer les informations de l\'utilisateur.');
        router.push('/auth');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des informations de l\'utilisateur:', error);
      Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      router.push('/auth');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      Alert.alert('Erreur', 'Impossible de se déconnecter. Veuillez réessayer plus tard.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </SafeAreaView>
    );
  }

  if (!userInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Impossible de charger les informations de l'utilisateur.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.personalInfos}>
        <Text style={styles.item}>{userInfo.username}</Text>
        <Text style={styles.item}>{userInfo.email}</Text>
        <Buttons 
        title="Modifier le profil"          
        onPress={() => router.push({
            pathname: '/editProfile',
            params: {
              username: userInfo.username,
              email: userInfo.email
            }
          })} />
      </View>
      <Buttons title="Se déconnecter" onPress={handleLogout} />
    </SafeAreaView>
  );
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
});
