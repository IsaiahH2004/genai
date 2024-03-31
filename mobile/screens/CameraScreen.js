import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { Camera } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const CameraScreen = ({ navigation }) => {
  const [storedId, setStoredId] = useState("");
  const [storedName, setStoredName] = useState("");
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);

  const screenWidth = Dimensions.get("window").width;
  const cameraSizeWidth = screenWidth * 0.9;
  const cameraSizeHeight = screenWidth * 1.2;

  useEffect(() => {
    const loadStoredNameAndId = async () => {
      const id = await AsyncStorage.getItem("UserID");
      const name = await AsyncStorage.getItem("UserName");
      if (id) {
        setStoredId(id);
      }
      if (name) {
        setStoredName(name);
      }
    };
    loadStoredNameAndId();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const options = { quality: 0.5, base64: true };
        const data = await cameraRef.current.takePictureAsync(options);
        const resizedImage = await ImageManipulator.manipulateAsync(
          data.uri,
          [],
          {
            compress: 1,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true,
          }
        );
        fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/steps/get`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: resizedImage,
            userId: storedId,
          }),
        });
        navigation.goBack(); 
      } catch (error) {
        console.log("Error", "Failed to take picture: " + error.message);
      }
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.disposeText}>Dispose</Text>
          <View style={styles.profileContainer}>
            <Text style={styles.profileName}>{storedName}</Text>
            <Ionicons name="person-circle" size={40} color="black" />
          </View>
        </View>
        <View
          style={[
            styles.cameraContainer,
            { width: cameraSizeWidth, height: cameraSizeHeight },
          ]}
        >
          <Camera
            ref={cameraRef}
            style={[
              styles.cameraContainer,
              { width: cameraSizeWidth, height: cameraSizeHeight },
            ]}
            type={Camera.Constants.Type.back}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.circleButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.circleButton} onPress={takePicture}>
            <Ionicons name="camera" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  cameraContainer: {
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    borderRadius: 20,
  },
  camera: {
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    width: "90%",
    marginTop: 20,
  },
  circleButton: {
    backgroundColor: "#a29fe0",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "white",
  },
});

export default CameraScreen;
