import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Buttons from './Button'

export default function LoginHome() {
  return (
    <View style={{marginHorizontal: 25}}>
      <Text style={styles.mainText}>Rejoignez <Text style={{fontFamily: 'Poppins-bold'}}>MovieMatch</Text> pour des soirées cinéma entre amis.</Text>
      <View style={{ 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "space-between", 
        marginTop: 80,
        gap: 15
      }}>
        <Text style={{fontSize: 16, fontFamily: 'Poppins', color: 'black', textAlign: 'center'}}>Connectez-vous avec</Text>
        <Buttons title="Apple" onPress={() => {}} />
        <Buttons title="Google" onPress={() => {}} />
        <Buttons title="Facebook" onPress={() => {}} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    mainText: {
        fontSize: 24,
        fontFamily: "Poppins",
        color: "black",
        textAlign: "center",
    }
})