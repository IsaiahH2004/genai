import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ItemScreen = ({ navigation }) => {
  const [storedName, setStoredName] = useState('');
  const [items, setItems] = useState([]);
  const [storedId, setStoredId] = useState("6608e1f7caf750c9b6c6d4be");
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
    // Function to load the stored name
    const loadStoredId = async () => {
      const id = await AsyncStorage.getItem("UserID");

      if (id) {
        setStoredId(id); // Update the state with the stored name
      }
    };

    loadStoredId();
  }, []);

  useEffect(() => {
    const getItems = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_SERVER_URL}/items/${storedId}`
        );
        if (!response.ok) {
          console.log("Server failed:", response.status);
          return;
        }
        const data = await response.json();
        setItems(data.response);
      } catch (error) {
        console.error("Fetch function failed:", error);
      } finally {
        setLoading(false);
      }
    };
    getItems();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
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
          items.reverse().map((item, index) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  navigation.navigate("CheckList", { id: item._id });
                }}
              >
                <View style={styles.itemContainer}>
                  <View style={styles.textContainter}>
                    <Text style={styles.text}>{item.name}</Text>
                  </View>
                  {/* {item.isCom<View style={styles.progress}></View>} */}
                </View>
              </TouchableOpacity>
            </View>
          ))
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
    backgroundColor: "#fff",
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
    backgroundColor: "#a29fe0",
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
    paddingHorizontal: 20,
  },
  disposeText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemContainer:{
    flexDirection: 'row',
    padding: 20,
  },
  textContainter:{
    flex: .7,
  },
  incomplete:{
    backgroundColor: 'red',
    flex: 0.4,
    borderRadius: 10,
  },
  complete:{
    backgroundColor: 'green',
    flex: 0.4,
    borderRadius: 10,
  },
  profileName: {
    fontSize: 18,
    color: "black",
    paddingRight: 8,
  },
});

export default ItemScreen;
