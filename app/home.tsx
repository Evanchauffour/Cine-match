import Buttons from "@/components/Button";
import JoinGroupModal from "@/components/JoinGroupModal";
import { router } from "expo-router";
import { useState } from "react";
import { View, StyleSheet, Text } from "react-native";

export default function Home() {

  const [joinGroupModalVisible, setJoinGroupModalVisible] = useState(false);

  return (
    <>
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
      <View style={{ marginHorizontal: 25 }}>
        <View style={{zIndex: -10}}>
            <Text style={styles.mainText}>
                Pour commencer avec <Text style={{ fontFamily: 'Poppins-bold' }}>CineMatch</Text> créer ou rejoignez un groupe
            </Text>
            <View style={styles.buttonContainer}>
                <Buttons
                    title="Créer un groupe"
                    onPress={() => router.push('/createGroup')}
                />
                <Buttons
                title="Rejoindre un groupe"
                onPress={() => setJoinGroupModalVisible(true)}
                />
            </View>
        </View>
    </View>
    </View>
      <JoinGroupModal
          isModalVisible={joinGroupModalVisible}
          onClose={() => setJoinGroupModalVisible(false)}
      />
    </>
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
    fontFamily: 'Poppins',
    color: 'black',
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 80,
    gap: 15,
  },
});
