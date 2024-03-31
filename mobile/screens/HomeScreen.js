import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image , SafeAreaView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CrownImage from '../assets/realistic-vector-icon-golden-king-queen-crown-isolated-white-background_134830-2012.jpg.avif';

const HomeScreen = ({ navigation }) => {
  const [storedName, setStoredName] = useState('');
  const topTenUsers = new Array(10).fill({ name: 'Isaiah', score: 100 }).map((user, index) => ({
    ...user,
    score: user.score - (index * 10),
    place: index + 1
  }));

  const topThreeUsers = [
    { name: 'Isaiah', score: 200 },
    { name: 'Isaiah', score: 150 },
    { name: 'Isaiah', score: 100 },
  ];

  useEffect(() => {
    // Function to load the stored name
    const loadStoredName = async () => {
      const name = await AsyncStorage.getItem("Name");
      if (name) {
        setStoredName(name); // Update the state with the stored name
      }
    };

    loadStoredName();
  }, []);


  const getBackgroundColor = (place) => {
    if (place === 1) return '#ffca28';
    if (place === 2) return '#f4f4f4';
    if (place === 3) return '#ff8228';
    return '#312244';
  };

  const getTextColor = (place) => {
    if (place === 1) return 'black';
    if (place === 2) return 'black';
    if (place === 3) return 'black';
    return 'white';
  };

  const clearName = async () => {
    try {
      // Optional: Fetch the current name if you need to use it before clearing
      await AsyncStorage.removeItem("Name");


      // Set the stored name to null
      
    } catch (error) {
      console.error("Failed to clear the name from storage", error);
    }
  };

  return (
    <SafeAreaView  style={styles.container}>
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
      <View style={styles.header}>
      <Text style={styles.disposeText}>Dispose</Text>
        <View style={styles.profileContainer}>
        <Text style={styles.profileName}>{storedName}</Text>
          <Ionicons name="person-circle" size={40} color="white" />
        </View>
      </View>

      <View style={styles.podiumContainer}>
      {/* Podium Positions */}
      <View style={styles.podiumPosition}>
        <View style={[styles.iconContainer, styles.silver]}>
          <Ionicons name="person-circle" size={100} color="#C0C0C0" />
        </View>
        <Text style={styles.podiumName}>{topThreeUsers[1].name}</Text>
        <Text style={styles.podiumName}>{topThreeUsers[1].score} pts</Text>
      </View>
      
      <View style={styles.podiumPosition}>
        <View style={[styles.iconContainer, styles.gold]}>
          <Ionicons name="person-circle" size={150} color="#FFD700" />
        </View>
        <Text style={styles.podiumName}>{topThreeUsers[0].name}</Text>
        <Text style={styles.podiumName}>{topThreeUsers[0].score} pts</Text>
      </View>

      <View style={styles.podiumPosition}>
        <View style={[styles.iconContainer, styles.bronze]}>
          <Ionicons name="person-circle" size={100} color="#CD7F32" />
        </View>
        <Text style={styles.podiumName}>{topThreeUsers[2].name}</Text>
        <Text style={styles.podiumName}>{topThreeUsers[2].score} pts</Text>
      </View>
    </View>

    <View style={styles.listStyle}>
  {topTenUsers.map((user, index) => (
    <View key={user.place} style={[styles.userItem, {backgroundColor: getBackgroundColor(user.place)}]}>
      <Text style={[styles.place, {color: getTextColor(user.place) }]}>{user.place}</Text>
      <View style={styles.nameAndScore}>
        <Text style={[styles.userName, {color: getTextColor(user.place) }]}>{user.name}</Text>
        <Text style={[styles.userScore, {color: getTextColor(user.place) }]}>{user.score} pts</Text>
      </View>
    </View>
  ))}
</View>
      
      
      
      </ScrollView>
      <TouchableOpacity
        style={styles.cameraButton}
        onPress={async () => {
          await clearName(); // Clear the name when the camera button is pressed
          navigation.navigate('Camera'); // Then navigate to the Camera screen
        }}
      >
        <Ionicons name="camera" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
};


  const styles = StyleSheet.create({
    listStyle: {
      marginTop: 70,
      marginBottom: 70,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: "#312244",
    },
    podiumName: {
      color: "white",
      fontWeight: "bold",
    },
    cameraButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      backgroundColor: '#1fd655',
      borderRadius: 50,
      padding: 15,
    },
    podiumPosition: {
      alignItems: 'center',
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      margin: 10,
    },
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    disposeText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: "#9147ff",
    },
    profileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      
    },
    profileName: {
      fontSize: 18,
      color: "white",
      paddingRight: 8,
    },
    podiumContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
      marginTop: 100,
      marginBottom: 20,
    },
    step: {
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 10,
    },
    gold: {
      borderColor: '#FFD700',
      //borderWidth: 2,
      borderRadius: 37.5,
    },
    silver: {
      borderColor: '#C0C0C0',
      //borderWidth: 2,
      borderRadius: 25,
    },
    bronze: {
      borderColor: '#CD7F32',
      //borderWidth: 2,
      borderRadius: 25,
    },
    stepText: {
      fontWeight: 'bold',
    },
    scrollView: {
      width: '100%',
    },
    userItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 20,
      paddingHorizontal: 10,
      marginVertical: 5,
      marginHorizontal: 20,
      borderRadius: 50,
      backgroundColor: '#FFFFFF',
    },
    place: {
      fontSize: 16,
      width: 30,
      textAlign: 'center',
      marginRight: 10,
      color: "white",
      fontWeight: 'bold',
    },
    nameAndScore: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flex: 1,
      marginLeft: 10,
    },
    userName: {
      fontSize: 16,
      color: "white",
      fontWeight: 'bold',

    },
    userScore: {
      fontSize: 16,
      fontWeight: 'bold',
      color: "white",
      paddingRight: 10,
    },
    placeItemFirst: {
      borderTopWidth: 4,
      borderLeftWidth: 4,
      borderRightWidth: 4,
    },
    placeItemLast: {
      borderBottomWidth: 4,
      borderLeftWidth: 4,
      borderRightWidth: 4,
    },
});

export default HomeScreen;
