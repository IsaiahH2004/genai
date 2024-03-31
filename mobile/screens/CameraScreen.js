import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, SafeAreaView } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";


const CameraScreen = ({ navigation }) => {
  const [storedName, setStoredName] = useState('');
  const [storedId, setStoredId] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);

  const screenWidth = Dimensions.get('window').width;
const cameraSizeWidth = screenWidth * 0.9;
const cameraSizeHeight = screenWidth * 1.2;
const cameraSize = screenWidth * 0.9;
const cameraViewSize = screenWidth * 0.9;

useEffect(() => {
  // Function to load the stored name
  const loadStoredNameAndId = async () => {
    const name = await AsyncStorage.getItem("Name");
    const id = await AsyncStorage.getItem("UserID");
      console.log(id)
    if (name) {
      setStoredName(name); // Update the state with the stored name
    }
    if (id) {
      setStoredId(id); // Update the state with the stored name
    }
  };

  loadStoredNameAndId();

}, []);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  

  const takePicture = async () => {
    console.log("here1");
    if (cameraRef.current) {
      console.log("here2");
      try {
        const options = { quality: 0.5, base64: true };
        console.log("here3");
        const data = await cameraRef.current.takePictureAsync(options);
        console.log("here4");
        const resizedImage = await ImageManipulator.manipulateAsync(
          data.uri,
          [],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );
        console.log(resizedImage);
        fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/steps/get`, {

          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: resizedImage,
            userId: storedId,
          }),
        });
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
        <Text style={styles.profileName}>Isaiah</Text>
          <Ionicons name="person-circle" size={40} color="white" />
        </View>
      </View>
      <View style={[styles.cameraContainer, { width: cameraSizeWidth, height: cameraSizeHeight }]}>
      <Camera
        ref={cameraRef}
        style={[styles.cameraContainer, { width: cameraSizeWidth, height: cameraSizeHeight }]}
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
        <TouchableOpacity
          style={styles.circleButton}
          onPress={takePicture}
        >
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#312244",
  },
  cameraContainer: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },

  camera: {
    alignSelf: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
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
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    width: '90%',
    marginTop: 20,
  },
  circleButton: {
    backgroundColor: '#1fd655',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  button:{
    backgroundColor: "white",
  },
  buttonText: {
    fontSize: 14,
    color: 'black',
  },
});

export default CameraScreen;
