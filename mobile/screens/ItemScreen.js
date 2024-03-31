import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const ItemScreen = ({ route, navigation }) => {
  const [storedName, setStoredName] = useState("");
  const [items, setItems] = useState([]);
  const [storedId, setStoredId] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 200);
  }, []);

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
    const loadStoredId = async () => {
      const id = await AsyncStorage.getItem("UserID");
      if (id) {
        setStoredId(id);
      }
    };
    loadStoredId();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
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

  useFocusEffect(
    React.useCallback(() => {
      fetchItems();
    }, [storedId])
  );

  return (
    <SafeAreaView style={styles.containerM}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.disposeText}>Dispose It Right</Text>
          <View style={styles.profileContainer}>
            <Text style={styles.profileName}>{storedName}</Text>
            <Ionicons name="person-circle" size={40} color="black" />
          </View>
        </View>

        <ScrollView
          style={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {loading ? (
            <ActivityIndicator color={"red"} size="large" />
          ) : (
            items
              .slice()
              .reverse()
              .map((item, index) => (
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
                      {item.isComplete === false ? (
                        <View style={styles.incomplete}>
                          <Ionicons name="close" size={28} color={"red"} />
                        </View>
                      ) : (
                        <View style={styles.complete}>
                          <Ionicons
                            name="checkmark-circle"
                            size={28}
                            color={"#00EB32"}
                          />
                        </View>
                      )}
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
    backgroundColor: "white",
  },
  text: {
    color: "#ffffff",
    fontSize: 20,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    marginTop: "20%",
  },
  item: {
    backgroundColor: "#a29fe0",
    padding: 20,
    width: "80%",
    margin: 5,
    borderColor: "#3f3e41",
    borderRadius: 8,
    justifyContent: "center",
    alignContent: "center",
    alignSelf: "center",
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
  itemContainer: {
    flexDirection: "row",
    padding: 10,
  },
  textContainter: {
    flex: 0.8,
  },
  incomplete: {
    flex: 0.2,
    borderRadius: 10,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  complete: {
    flex: 0.2,
    borderRadius: 10,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  profileName: {
    fontSize: 18,
    color: "black",
    paddingRight: 8,
  },
});

export default ItemScreen;
