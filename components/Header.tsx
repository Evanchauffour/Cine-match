import { Text, SafeAreaView, StyleSheet, View } from 'react-native'
import React from 'react'
import Buttons from './Button';

export default function Header() {
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.logo}>
            <Text style={styles.text1}>Movie</Text>
            <Text style={styles.text2}>Match</Text>
        </View>
        <Buttons title="Profile" onPress={() => console.log('Profile')} />
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