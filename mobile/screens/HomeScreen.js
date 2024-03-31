import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = ({ navigation }) => {
  const [storedName, setStoredName] = useState("");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useFocusEffect(useCallback(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_SERVER_URL}/leaderboard/10`
        );
        const jsonResponse = await response.json();
        if (response.ok) {
          setLeaderboardData(jsonResponse.response);
        } else {
          console.error(
            "Failed to fetch leaderboard data:",
            jsonResponse.error
          );
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard data", error);
      }
    };

    const fetchCurrentUserData = async () => {
      const userId = await AsyncStorage.getItem("UserID");
      if (userId) {
        try {
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_SERVER_URL}/info/${userId}`
          );
          const jsonResponse = await response.json();
          if (response.ok) {
            setCurrentUser(jsonResponse.response);
          } else {
            console.error(
              "Failed to fetch current user data:",
              jsonResponse.error
            );
          }
        } catch (error) {
          console.error("Failed to fetch current user data", error);
        }
      }
    };

    fetchLeaderboardData();
    fetchCurrentUserData();
  }, []));

  useEffect(() => {
    const loadStoredName = async () => {
      const name = await AsyncStorage.getItem("Name");
      if (name) {
        setStoredName(name);
      }
    };

    loadStoredName();
  }, []);

  const getBackgroundColor = (place) => {
    if (place === 1) return "#ffca28";
    if (place === 2) return "#C0C0C0";
    if (place === 3) return "#ff8228";
    return "#565656";
  };

  const getTextColor = (place) => {
    if (place === 1) return "black";
    if (place === 2) return "black";
    if (place === 3) return "black";
    return "white";
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.disposeText}>Dispose</Text>
            <View style={styles.profileContainer}>
              <Text style={styles.profileName}>{storedName}</Text>
              <Ionicons name="person-circle" size={40} color="black" />
            </View>
          </View>

          <View style={styles.podiumContainer}>
            {leaderboardData[1] && (
              <View style={styles.podiumPosition}>
                <View style={[styles.iconContainer, styles.silver]}>
                  <Ionicons name="person-circle" size={100} color="#C0C0C0" />
                </View>
                <Text style={styles.podiumName}>{leaderboardData[1].name}</Text>
                <Text style={styles.podiumName}>
                  {leaderboardData[1].highScore} pts
                </Text>
              </View>
            )}

            {leaderboardData[0] && (
              <View style={styles.podiumPosition}>
                <View style={[styles.iconContainer, styles.gold]}>
                  <Ionicons name="person-circle" size={150} color="#FFD700" />
                </View>
                <Text style={styles.podiumName}>{leaderboardData[0].name}</Text>
                <Text style={styles.podiumName}>
                  {leaderboardData[0].highScore} pts
                </Text>
              </View>
            )}

            {leaderboardData[2] && (
              <View style={styles.podiumPosition}>
                <View style={[styles.iconContainer, styles.bronze]}>
                  <Ionicons name="person-circle" size={100} color="#CD7F32" />
                </View>
                <Text style={styles.podiumName}>{leaderboardData[2].name}</Text>
                <Text style={styles.podiumName}>
                  {leaderboardData[2].highScore} pts
                </Text>
              </View>
            )}
          </View>

          <View style={styles.listStyle}>
            {leaderboardData.map((user, index) => (
              <View
                key={index}
                style={[
                  styles.userItem,
                  { backgroundColor: getBackgroundColor(index + 1) },
                ]}
              >
                <Text
                  style={[styles.place, { color: getTextColor(index + 1) }]}
                >
                  {index + 1}
                </Text>
                <Text
                  style={[styles.userName, { color: getTextColor(index + 1) }]}
                >
                  {user.name}
                </Text>
                <Text
                  style={[styles.userScore, { color: getTextColor(index + 1) }]}
                >
                  {user.highScore} pts
                </Text>
              </View>
            ))}
            {currentUser && (
              <View
                style={[
                  styles.currUserItem,
                  {
                    backgroundColor: getBackgroundColor(currentUser.placement),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.place,
                    { color: getTextColor(currentUser.placement) },
                  ]}
                >
                  {currentUser.placement}
                </Text>
                <Text
                  style={[
                    styles.userName,
                    { color: getTextColor(currentUser.placement) },
                  ]}
                >
                  {currentUser.name}
                </Text>
                <Text
                  style={[
                    styles.userScore,
                    { color: getTextColor(currentUser.placement) },
                  ]}
                >
                  {currentUser.highScore} pts
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.cameraButton}
          onPress={() => navigation.navigate("Camera")}
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
    alignItems: "center",
    backgroundColor: "#fff",
  },
  podiumName: {
    color: "black",
    fontWeight: "bold",
  },
  cameraButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#a29fe0",
    borderRadius: 50,
    padding: 15,
  },
  podiumPosition: {
    alignItems: "center",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  disposeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileName: {
    fontSize: 18,
    color: "black",
    paddingRight: 8,
  },
  podiumContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    marginTop: 100,
    marginBottom: 20,
  },
  step: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  gold: {
    borderColor: "#FFD700",
    //borderWidth: 2,
    borderRadius: 37.5,
  },
  silver: {
    borderColor: "#C0C0C0",
    //borderWidth: 2,
    borderRadius: 25,
  },
  bronze: {
    borderColor: "#CD7F32",
    //borderWidth: 2,
    borderRadius: 25,
  },
  scrollView: {
    width: "100%",
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginVertical: 5,
    marginHorizontal: 20,
    borderRadius: 50,
    backgroundColor: "#a29fe0",
  },
  currUserItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 30,
    marginHorizontal: 20,
    borderRadius: 50,
    backgroundColor: "#FFFFFF",
  },
  place: {
    fontSize: 16,
    width: 30,
    textAlign: "center",
    marginRight: 10,
    color: "white",
    fontWeight: "bold",
  },
  userName: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  userScore: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    paddingRight: 10,
  },
});

export default HomeScreen;
