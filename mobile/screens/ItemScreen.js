import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ItemScreen = ({ navigation }) => {

  // Sample data for the list
  const data = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    { id: 4, name: 'Item 4' },
    { id: 5, name: 'Item 5' },
  ];

  // Function to handle item press
  const handleItemPress = () => {
    // Navigate to the CheckList screen
    navigation.navigate('CheckList'); // Assuming 'CheckList' is the name of your destination screen
  };

  // Render function for each item in the list
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={handleItemPress}>
      <Text style={styles.text}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.disposeText}>Trash Items</Text>
        <View style={styles.profileContainer}>
          <Ionicons name="person-circle" size={40} color="#000" />
        </View>
      </View>

      <FlatList
      style={styles.list}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      {/* <Text style={{color:"white"}}>Item Screen </Text> */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#312244',
    padding: '10%',
  },
  text: {
    color: "#ffffff",
  },
  list: {
    marginTop: "10%",
  },
  item: {
    backgroundColor: '#262527',
    padding: 20,
    width: 300,
    margin: 5,
    borderColor: '#3f3e41',
    borderRadius: 8,
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
});

export default ItemScreen;
