import Home from "@/components/Home";
import LoginHome from "@/components/LoginHome";
import { View, StyleSheet, Text } from "react-native";

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
      {/* <Home /> */}
      <LoginHome />
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
    paddingHorizontal: 10,
    paddingVertical: 5,
  }
});
