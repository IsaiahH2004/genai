import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from 'react-native-vector-icons/Ionicons';


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
    if (name !== "") { // Corrected condition to check name
      try {
        await AsyncStorage.setItem("Name", name);
        // navigation.goBack();
      } catch (error) {
        console.error("Failed to save the data to storage", error);
      }
    }
  };

  return (
    <View style={styles.container}>
        <Ionicons name="person-circle" size={60} color="#fff" />
        <TextInput
            style={styles.input}
            onChangeText={setName}
            value={name}
            placeholder="Enter Name..."
            placeholderTextColor={'white'}
        />
        <TouchableOpacity 
            style={styles.next}
            onPress={saveData}
        >
          <Text style={styles.saveText}>Next</Text>
        </TouchableOpacity>
    </View>
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
    bottom: 20, // Adjust bottom margin as needed
    backgroundColor: "#5f43b2", // Add your preferred styling
    paddingVertical: 10,
    paddingHorizontal: 20,
    right: 20,
    borderRadius: 5,
  },
  input:{
    marginTop: 20, 
    padding: 10,
    fontSize: 18,
    borderWidth: 1,
    color: 'white', 
    borderColor: 'white',
    borderRadius: 5
    
  },
});

export default WelcomeScreen;
