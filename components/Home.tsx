import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Buttons from './Button'

export default function Home() {
  return (
    <View style={{marginHorizontal: 25}}>
      <Text style={styles.mainText}>Pour commencer avec <Text style={{fontFamily: 'Poppins-bold'}}>MovieMatch</Text> créer ou rejoignez un groupe</Text>
      <View style={{ 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "space-between", 
        marginTop: 80,
        gap: 15
      }}>
        <Buttons title="Créer un groupe" onPress={() => {}} />
        <Buttons title="Rejoindre un groupe" onPress={() => {}} />
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