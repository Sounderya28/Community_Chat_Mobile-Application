import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const AddPostPage = ({ navigation, route }) => {
  const { userId } = route.params; // Assuming userId is passed as a prop from the navigation

  const [content, setContent] = useState('');

  const handleAddPost = async () => {
    try {
      await axios.post('http://192.168.0.107:3000/posts', { user_id: userId, content });
      console.log('Post added successfully');
      navigation.goBack();// Navigate back to the PostListPage
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Post</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter post content"
        value={content}
        onChangeText={setContent}
        multiline={true}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddPost}>
        <Text style={styles.addButtonText}>Add Post</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2FCE4',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    textAlignVertical: 'top', // Align text to top in multiline input
  },
  addButton: {
    backgroundColor: '#009B4C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default AddPostPage;
