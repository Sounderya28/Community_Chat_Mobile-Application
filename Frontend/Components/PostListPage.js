import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PostListPage = ({ navigation, route }) => {
  const { userId } = route.params;
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const retrieveLikedPosts = async () => {
      try {
        const storedLikes = await AsyncStorage.getItem(`likedPosts-${userId}`);
        setLikedPosts(storedLikes ? JSON.parse(storedLikes) : []);
      } catch (error) {
        console.error("Error retrieving liked posts:", error);
      }
    };

    retrieveLikedPosts();
  }, [userId]); // Re-fetch liked posts when userId changes

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://192.168.0.107:3000/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchPosts();
    }, [])
  );

  const handleAddPost = () => {
    navigation.navigate("AddPost", { userId: userId });
  };

  const handleMenuPress = (postId) => {
    Alert.alert(
      "Options",
      "Choose an option",
      [
        {
          text: "Update",
          onPress: () => {
            navigation.navigate("UpdatePost", { postId: postId });
          },
        },
        {
          text: "Delete",
          onPress: () => {
            axios
              .delete(`http://192.168.0.107:3000/posts/${postId}`)
              .then((response) => {
                Alert.alert("Success", response.data.message);
                fetchPosts();
              })
              .catch((error) => {
                Alert.alert(
                  "Error",
                  "Failed to delete post. Please try again."
                );
                console.error("Error deleting post:", error);
              });
          },
          style: "destructive",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  const handleLikePost = async (postId) => {
    try {
      const isLiked = likedPosts.includes(postId);

      if (!isLiked) {
        setLikedPosts([...likedPosts, postId]); // Update local state first
        await axios.post(`http://192.168.0.107:3000/posts/${postId}/like`, {
          user_id: userId,
        });
        fetchPosts(); // Update UI with the latest data
        await AsyncStorage.setItem(
          `likedPosts-${userId}`,
          JSON.stringify([...likedPosts, postId])
        ); // Store for persistence
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleCommentPost = (postId) => {
    const post = posts.find((post) => post.id === postId);
    const username = post.username;
    navigation.navigate("CommentPost", {
      postId: postId,
      userId: userId,
      username: username,
    });
  };
  const renderPostItem = ({ item }) => (
    <View style={styles.postItem}>
      <View style={styles.postHeader}>
        <Text style={styles.postTitle}>{item.username}</Text>
        <Text style={styles.postDate}>
          @ {new Date(item.created_at).toDateString()}
        </Text>
        {item.user_id === userId && (
          <TouchableOpacity onPress={() => handleMenuPress(item.id)}>
            <Ionicons name="ellipsis-vertical" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>
      <Text>{item.content}</Text>
      <View style={styles.postActions}>
        <TouchableOpacity
          onPress={() => handleLikePost(item.id)}
          style={{ flexDirection: "row" }}
        >
          <Ionicons
            name={likedPosts.includes(item.id) ? "heart" : "heart-outline"}
            size={24}
            color={likedPosts.includes(item.id) ? "red" : "black"}
          />
          <Text style={{ marginRight: "2%" }}>{item.likes_count}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleCommentPost(item.id)}
          style={{ flexDirection: "row" }}
        >
          <Ionicons name="chatbox-outline" size={24} color="green" />
          <Text>{item.comments_count}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My posts</Text>
      <FlatList
        data={posts.filter((post) => post.user_id === userId)}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Text style={styles.header}>Other posts</Text>
      <FlatList
        data={posts.filter((post) => post.user_id !== userId)}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity style={styles.fab} onPress={handleAddPost}>
        <Ionicons name="add-circle" size={50} color="#009B4C" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F2FCE4",
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  postItem: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    backgroundColor: "white",
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  postDate: {
    color: "#666",
    marginTop: 5,
    fontWeight: "bold",
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
});

export default PostListPage;
