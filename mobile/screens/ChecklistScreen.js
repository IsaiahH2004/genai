import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CheckList = ({ route }) => {
  const [storedName, setStoredName] = useState("");
  const { id } = route.params;
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemName, setItemName] = useState("");

  useEffect(() => {
    const loadStoredName = async () => {
      const name = await AsyncStorage.getItem("Name");
      if (name) {
        setStoredName(name);
      }
    };

    loadStoredName();
  }, []);

  useEffect(() => {
    const getItems = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_SERVER_URL}/item/${id}`
        );
        if (!response.ok) {
          console.log("Server failed:", response.status);
          return;
        }
        const data = await response.json();
        const stepsWithChecked = data.response.steps.map((step) => ({
          ...step,
          checked: step.isComplete,
        }));
        setSteps(stepsWithChecked);
        setItemName(data.response.name);
      } catch (error) {
        console.error("Fetch function failed:", error);
      } finally {
        setLoading(false);
      }
    };
    getItems();
  }, [id]);

  const toggleCheck = async (index) => {
    const updatedSteps = steps.map((step, i) =>
      i === index ? { ...step, checked: !step.checked } : step
    );
    setSteps(updatedSteps);
    const toggleUrl = `${process.env.EXPO_PUBLIC_SERVER_URL}/item/${id}/toggle/${index}`;
    try {
      const toggleResponse = await fetch(toggleUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!toggleResponse.ok) {
        throw new Error("Failed to toggle step");
      }

      const allStepsComplete = updatedSteps.every((step) => step.checked);
      if (allStepsComplete) {
        const completeUrl = `${process.env.EXPO_PUBLIC_SERVER_URL}/complete/${id}`;
        const completeResponse = await fetch(completeUrl, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId: id }),
        });

        if (!completeResponse.ok) {
          throw new Error("Failed to mark item as complete");
        }

        console.log("Item marked as complete!");
      }
    } catch (error) {
      console.error("Error during step toggle or item completion:", error);
    }
  };

  const renderItem = (step, index) => (
    <View style={styles.item} key={index}>
      <TouchableOpacity
        onPress={() => toggleCheck(index)}
        style={styles.checkboxContainer}
      >
        {step.checked ? (
          <Ionicons name="checkmark-circle" size={32} color="#00EB32" />
        ) : (
          <Ionicons name="ellipse-outline" size={32} color="black" />
        )}
      </TouchableOpacity>
      <Text style={styles.text}>{step.description}</Text>
    </View>
  );
  return (
    <SafeAreaView style={styles.containerM}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.disposeText}>Dispose</Text>
          <View style={styles.profileContainer}>
            <Text style={styles.profileName}>{storedName || "Guest"}</Text>
            <Ionicons name="person-circle" size={40} color="black" />
          </View>
        </View>

        <View style={styles.itemNameContainer}>
          <Text style={styles.itemName}>How to dispose of: {itemName}</Text>
        </View>

        <ScrollView style={styles.list}>
          {loading ? (
            <ActivityIndicator color={"red"} size="large" />
          ) : (
            steps.map((step, index) => renderItem(step, index))
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
    backgroundColor: "white",
    padding: "10%",
  },
  containerM: {
    flex: 1,
    backgroundColor: "white",
  },
  text: {
    color: "#ffffff",
    paddingRight: 50,
    alignContent: "center",
  },
  list: {
    marginTop: "10%",
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
    fontWeight: "bold",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#a29fe0",
    padding: 20,
    margin: 5,
    borderColor: "#3f3e41",
    borderRadius: 8,
    flex: 1,
  },
  checkboxContainer: {
    marginRight: 10,
  },
  checkbox: {
    height: 20,
    width: 20,
    backgroundColor: "#f0f0f0",
    borderColor: "#000",
    borderWidth: 1,
    marginRight: 8,
  },
  itemNameContainer: {
    marginTop: 40,
    marginBottom: 10,
    alignItems: "center",
  },
  itemName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
  },
});

export default CheckList;
