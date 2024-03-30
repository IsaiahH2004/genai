import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';

const ItemScreen = () => {

    // Sample data for the list
  const data = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    { id: 4, name: 'Item 4' },
    { id: 5, name: 'Item 5' },
  ];

  // Render function for each item in the list
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item}>
      <Text style={styles.text}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
        <FlatList
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
    backgroundColor: '#19191a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10%',
  },
  text:{
    color: "#ffffff",
  },
  item: {
    backgroundColor: '#262527',
    padding: 20,
    width: 200,
    margin: 5,
    borderColor: '#3f3e41',
    borderRadius: 8,
  },
});

export default  ItemScreen;