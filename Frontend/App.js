import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './Components/HomePage';
import LoginPage from './Components/LoginPage'; 
import SignUpPage from "./Components/SignUpPage"
import PostListpage from './Components/PostListPage';
import UpdatePostPage from "./Components/UpdatePostPage";
import AddPostPage from "./Components/AddPostPage";
import CommentPost from './Components/CommentPost';
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomePage}/>
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="SignUp" component={SignUpPage}/>
        <Stack.Screen name="PostList" component={PostListpage} initialParams={{ userId: null }}  />
        <Stack.Screen name="AddPost" component={AddPostPage} initialParams={{ userId: null }}/>
        <Stack.Screen name="UpdatePost" component={UpdatePostPage} initialParams={{ userId: null }}/>
        <Stack.Screen name="CommentPost" component={CommentPost} initialParams={{ postId: null, userId: null }}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
