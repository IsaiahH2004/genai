import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <Text style={styles.disposeText}>Dispose</Text>
        <View style={styles.profileContainer}>
        <Text style={styles.profileName}>Isaiah</Text>
          <Ionicons name="person-circle" size={40} color="#000" />
          
        </View>
        
      </View>

      <View style={styles.podium}>
        <View style={styles.step}><Text style={styles.stepText}>Isaiah</Text></View>
        <View style={[styles.step, styles.rightMostStep]}><Text style={styles.stepText}>Isaiah</Text></View>
        <View style={[styles.step, styles.middleStep]}><Text style={styles.stepText}>Isaiah</Text></View>
      </View>



      <TouchableOpacity
        style={styles.cameraButton}
        onPress={() => navigation.navigate('Camera')}
      >
        <Ionicons name="camera" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1fd655',
    borderRadius: 50,
    padding: 15,
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
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 18,
    marginRight: 8,
  },
  podium: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    height: 200,
    marginTop: 50,
  },
  step: {
    width: 60,
    height: 100, // Silver
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C0C0C0', // Silver
  },
  middleStep: {
    width: 60,
    height: 80,
    backgroundColor: '#CD7F32',
  },
  rightMostStep: {
    width: 60,
    height: 120,
    backgroundColor: '#FFD700',
  },
  stepText: {
    fontWeight: 'bold',
  }
});

export default HomeScreen;
