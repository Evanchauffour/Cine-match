import AsyncStorage from '@react-native-async-storage/async-storage';

const isTokenAvailable = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      return false;
    }

    const response = await fetch('http://localhost:4000/api/auth/verify-token', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return !!(response.ok);
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    return false;
  }
};

export default isTokenAvailable;
