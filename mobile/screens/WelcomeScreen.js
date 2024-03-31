import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback, // Import TouchableWithoutFeedback
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";

const WelcomeScreen = ({ navigation }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    const loadStoredData = async () => {
      const storedName = await AsyncStorage.getItem("Name");
      if (storedName) setName(storedName);
    };

    loadStoredData();
  }, []);

  const saveData = async () => {
    if (name !== "") {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: name }),
        });
        const jsonResponse = await response.json();
        if (response.status === 200) {
          console.log("User registered:", jsonResponse);
          const userId = jsonResponse.response;
          await AsyncStorage.setItem("Name", name);
          await AsyncStorage.setItem("UserID", userId);
          navigation.navigate("MainApp", { screen: "Home" });
        } else {
          console.error("Failed to register the user:", jsonResponse.error);
        }
      } catch (error) {
        console.error(
          "Failed to save the data to storage or register user",
          error
        );
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
      <Ionicons name="person-circle" size={60} color="#fff" />
      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
        placeholder="Enter Name..."
        placeholderTextColor={"white"}
      />
      <TouchableOpacity style={styles.next} onPress={saveData}>
        <Text style={styles.saveText}>Next</Text>
      </TouchableOpacity>
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
    backgroundColor: "#312244",
  },
  next: {
    position: "absolute",
    bottom: 20,
    backgroundColor: "#5f43b2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    right: 20,
    borderRadius: 5,
  },
  input: {
    marginTop: 20,
    padding: 10,
    fontSize: 18,
    borderWidth: 1,
    color: "white",
    borderColor: "white",
    borderRadius: 5,
  },
});

export default WelcomeScreen;
