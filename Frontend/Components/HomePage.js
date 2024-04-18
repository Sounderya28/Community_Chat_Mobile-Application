import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const HomePage = ({ navigation }) => {
  const handleGetStarted = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/Home page logo.png')} 
        style={styles.image}
      />
      <Text style={styles.text}>Farming is the Profession of Hope</Text>
      <TouchableOpacity onPress={handleGetStarted} style={styles.button}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
      <View style={styles.bottomImageContainer}>
        <Image
          source={require('../assets/Home page image.png')} 
          style={styles.bottomImage}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#F2FCE4'
  },
  image: {
    width: 200, 
    height: 200, 
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#009B4C',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  bottomImageContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  bottomImage: {
    width: 100,
    height: 150,
  },
});

export default HomePage;
