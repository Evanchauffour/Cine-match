import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Buttons from './Button';
import JoinGroupModal from './JoinGroupModal';
import CreateGroupModal from './CreateGroupModal';

export default function Home() {
  const [joinGroupModalVisible, setJoinGroupModalVisible] = useState(false);
  const [createGroupModalVisible, setCreateGroupModalVisible] = useState(false);

  return (
    <>
    <View style={{ marginHorizontal: 25 }}>
        <View style={{zIndex: -10}}>
            <Text style={styles.mainText}>
                Pour commencer avec <Text style={{ fontFamily: 'Poppins-bold' }}>CineMatch</Text> créer ou rejoignez un groupe
            </Text>
            <View style={styles.buttonContainer}>
                <Buttons 
                    title="Créer un groupe"
                    onPress={() => setCreateGroupModalVisible(true)}
                />
                <Buttons
                title="Rejoindre un groupe"
                onPress={() => setJoinGroupModalVisible(true)}
                />
            </View>
        </View>
    </View>
    <CreateGroupModal
        isModalVisible={createGroupModalVisible}
        onClose={() => setCreateGroupModalVisible(false)}
    />
    <JoinGroupModal
        isModalVisible={joinGroupModalVisible}
        onClose={() => setJoinGroupModalVisible(false)}
    />
    </>
  );
}

const styles = StyleSheet.create({
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

