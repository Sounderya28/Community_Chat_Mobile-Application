import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const UpdatePostPage = ({ navigation, route }) => {
  const { postId, userId } = route.params; // Assuming postId and userId are passed as props from the navigation

  const [content, setContent] = useState('');

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`http://192.168.0.107:3000/posts/${postId}`);
      setContent(response.data.content); // Set the content of the fetched post in the state
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  const handleUpdatePost = async () => {
    try {
      await axios.put(`http://192.168.0.107:3000/posts/${postId}`, { content });
      console.log('Post updated successfully');
      navigation.goBack(); // Navigate back to the previous screen (PostListPage)
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Update Post</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter post content"
        value={content}
        onChangeText={setContent}
        multiline={true}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleUpdatePost}>
        <Text style={styles.addButtonText}>Update Post</Text>
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

export default UpdatePostPage;
