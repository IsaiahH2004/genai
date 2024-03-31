import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';

const CheckList = ({ route }) => {
  const [storedName, setStoredName] = useState('');
  const { id } = route.params;
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const getItems = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_SERVER_URL}/item/${id}`
        );
        if (!response.ok) {
          console.log("Server failed:", response.status);
          return;
        }
        const data = await response.json();
        setSteps(data.response.steps); // Update state with steps array

        // console.log(id);
      } catch (error) {
        console.error("Fetch function failed:", error);
      } finally {
        setLoading(false);
      }
    };
    getItems();
  }, []);

  const renderItem = (step, index) => {
    console.log(step)
    return(
    <TouchableOpacity style={styles.item} key={index}>
      <Text style={styles.text}>{step.description}</Text>
    </TouchableOpacity>
    )
  };

  return (
    <SafeAreaView style={styles.containerM}>
    <View style={styles.container}>
    <View style={styles.header}>
            <Text style={styles.disposeText}>Dispose</Text>
            <View style={styles.profileContainer}>
              {/* Display the stored name or "Guest" if not available */}
              <Text style={styles.profileName}>{storedName}</Text>
              <Ionicons name="person-circle" size={40} color="black" />
            </View>
          </View>

      <ScrollView style={styles.list}>
        {loading ? (
          <ActivityIndicator color={"red"} size="large" />
        ) : (
          steps && steps.map((step, index) => renderItem(step, index))
        )}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#312244",
    padding: "10%",
  },
  containerM: {
    flex: 1,
  },
  text: {
    color: "#ffffff",
  },
  list: {
    marginTop: "10%",
  },
  item: {
    backgroundColor: "#262527",
    padding: 20,
    width: 300,
    margin: 5,
    borderColor: "#3f3e41",
    borderRadius: 8,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  disposeText: {
    fontSize: 24,
    fontWeight: "bold",
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
});

export default CheckList;
