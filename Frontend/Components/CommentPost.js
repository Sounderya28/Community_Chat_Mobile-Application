import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const CommentPage = ({ route }) => {
  const { postId, userId, username } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://192.168.0.105:3000/posts/${postId}/comments`);
      console.log("Fetched comments:", response.data); // Log the fetched comments
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error.response.data);
    }
  };

  const handleAddComment = async () => {
    try {
      await axios.post(`http://192.168.0.105:3000/posts/${postId}/comments`, {
        user_id: userId, 
        content: newComment
      });
      setNewComment(""); 
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  
  

  const renderCommentItem = ({ item }) => (
    <View style={styles.commentItem}>
     <Text style={styles.commentUser}>{item.username}  </Text>
    
    <Text style={styles.commentContent}>{item.content}</Text>  
    {/* <Text style={styles.commentUser}>{item.created_at}  </Text>     */}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        renderItem={renderCommentItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <View style={styles.addCommentContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity style={styles.addCommentButton} onPress={handleAddComment}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  commentItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
  },
  commentContent: {
    fontSize: 16,
  },
  commentUser: {
    fontSize: 14,
    color: "green",
    fontWeight:"600",
    fontSize: 19,
    marginBottom:10
  },
  addCommentContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#CCCCCC",
    padding: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    padding: 10,
  },
  addCommentButton: {
    backgroundColor: "#009B4C",
    borderRadius: 5,
    marginLeft: 10,
    padding: 10,
  },
});

export default CommentPage;
