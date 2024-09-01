import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';
import isTokenAvailable from '../utils/token';
import { router } from 'expo-router';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const tokenIsValid = await isTokenAvailable();
      if (tokenIsValid) {
        router.push('/home');
      } else {
        router.push('/auth');
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#831FE8" />
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
