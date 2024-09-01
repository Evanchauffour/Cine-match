import Buttons from "@/components/Button";
import { View, StyleSheet, Text } from "react-native";
import { router } from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        gap: 20,
      }}
    >
      <View style={styles.slogan}>
        <View style={styles.sloganTop}>
          <Text style={styles.homeHeadWord}>Swipez !</Text>
          <Text style={styles.homeHeadWord}>Choisissez !</Text>
        </View>
        <Text style={styles.homeHeadWord}>Regardez !</Text>
      </View>
      <View style={{marginHorizontal: 25}}>
        <Text style={styles.mainText}>Rejoignez <Text style={{fontFamily: 'Poppins-bold'}}>MovieMatch</Text> pour des soirées cinéma entre amis.</Text>
        <View style={{ 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "space-between", 
          marginTop: 80,
          gap: 15
        }}>
          <Buttons title="Se connecter" onPress={() => router.push('/login')} />
          <Buttons title="S'inscrire" onPress={() => router.push('/register')}  />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slogan: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  sloganTop: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10
  },
  homeHeadWord: {
    fontSize: 24,
    fontFamily: "Poppins-bold",
    color: "white",
    backgroundColor: "#831FE8",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    overflow: "hidden",
  },
  mainText: {
    fontSize: 24,
    fontFamily: "Poppins",
    color: "black",
    textAlign: "center",
}
});
