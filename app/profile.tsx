import { SafeAreaView, StyleSheet, Text, View, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Buttons from '@/components/Button';
import { router } from 'expo-router';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log('currentUser:', currentUser);
      
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    signOut(auth).then(() => {
      router.push('/auth');
    }).catch((error) => {
      console.error('Signout error:', error.message);
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.personalInfos}>
        <Text style={styles.item}>{user?.displayName}</Text>
        <Text style={styles.item}>{user?.email}</Text>
        {/* <Buttons 
        title="Modifier le profil"          
        onPress={() => router.push({
            pathname: '/editProfile',
            params: {
              username: user?.displayName,
              email: user?.email
            }
          })} /> */}
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
