import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './Components/HomePage';
import LoginPage from './Components/LoginPage'; 
import SignUpPage from "./Components/SignUpPage";
import PostListPage from './Components/PostListPage';
import UpdatePostPage from "./Components/UpdatePostPage";
import AddPostPage from "./Components/AddPostPage";
import CommentPost from './Components/CommentPost';
import Constants from 'expo-constants';

const Stack = createStackNavigator();

const App = () => {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }}/>
          <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }}/>
          <Stack.Screen name="SignUp" component={SignUpPage} options={{ headerShown: false }}/>
          <Stack.Screen name="PostList" component={PostListPage} initialParams={{ userId: null }} options={{ headerShown: false }}/>
          <Stack.Screen name="AddPost" component={AddPostPage} initialParams={{ userId: null }} options={{ headerShown: false }}/>
          <Stack.Screen name="UpdatePost" component={UpdatePostPage} initialParams={{ userId: null }} options={{ headerShown: false }}/>
          <Stack.Screen name="CommentPost" component={CommentPost} initialParams={{ postId: null, userId: null }} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: Constants.statusBarHeight,
  },
});

export default App;



