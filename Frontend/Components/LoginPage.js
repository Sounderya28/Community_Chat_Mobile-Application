// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet,Image } from 'react-native';
// import axios from 'axios';
// const Login = ({navigation}) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleLogin = async () => {
//     try {
//       const response = await axios.post('http://192.168.0.100:3000/login', {
//         email,
//         password,
//       });
  
//       const token = response.data.token;
  
//       navigation.navigate('PostList');
//     } catch (error) {
//       setError('Invalid email or password');
//       console.error('Error logging in:', error.response.data);
//     }
//   };
  
  
//   const handleSignUp=()=>{
//     navigation.navigate('SignUp');
//   }
//   return (
//     <View style={styles.container}>
//       <Text style={styles.welcomeText}>Welcome back</Text>
//       <View style={styles.inputContainer}>
//         <Text>Email</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your email"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />
//         <View style={styles.inputContainer}>
//           <Text>Password</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter your password"
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry={!showPassword}
//           />
//           <TouchableOpacity onPress={togglePasswordVisibility} style={styles.togglePassword}>
//             <Text style={styles.togglePasswordText}>{showPassword ? 'Hide' : 'Show'}</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//       {error ? <Text style={styles.errorText}>{error}</Text> : null}
//       <TouchableOpacity style={styles.forgotPassword} onPress={handleSignUp}>
//         <Text style={styles.forgotPassword_text}>Already don't have an account, then <Text style={{color:'darkgreen',fontWeight:'bold'}}>Sign Up</Text></Text>
//       </TouchableOpacity>
      
//       <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
//         <Text style={styles.loginButtonText}>Login</Text>
//       </TouchableOpacity>
//       <View style={styles.bottomImageContainer}>
//         <Image
//           source={require('../assets/Home page image.png')} // Replace with your image path
//           style={styles.bottomImage}
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     backgroundColor:'#F2FCE4'
//   },
//   welcomeText: {
//     fontSize: 24,
//     marginBottom: 50,
//     marginTop: -150,
//   },
//   inputContainer: {
//     width: '100%',
//     marginBottom: 20,
//   },
//   input: {
//     height: 40,
//     borderBottomWidth: 1,
//     borderColor: 'gray',
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginBottom: 20,
    
//   },
//   passwordContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   togglePassword: {
//     position: 'absolute',
//     right: 10,
//   },
//   togglePasswordText: {
//     fontSize: 16,
//     color: 'blue',
//     marginTop:30
//   },
//   forgotPassword: {
//     marginBottom: 20, 
//   },
//   forgotPassword_text:{
//     textAlign:'right'
//   },
//   loginButton: {
//     backgroundColor: '#009B4C',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//   },
//   loginButtonText: {
//     color: 'white',
//     fontSize: 18,
//   },
//   bottomImageContainer: {
//     position: 'absolute',
//     left: 0,
//     bottom: 0,
//   },
//   bottomImage: {
//     width: 100,
//     height: 150,
//   },
 
// });

// export default Login;





import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.0.107:3000/login', {
        email,
        password,
      });

      const userId = response.data.user_id;
 // Assuming the response contains the user's ID

      navigation.navigate('PostList', { userId }); // Pass the userId to the PostListPage
    } catch (error) {
      setError('Invalid email or password');
      console.error('Error logging in:', error.response.data);
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome back</Text>
      <View style={styles.inputContainer}>
        <Text>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={styles.inputContainer}>
          <Text>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.togglePassword}>
            <Text style={styles.togglePasswordText}>{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity style={styles.forgotPassword} onPress={handleSignUp}>
        <Text style={styles.forgotPassword_text}>
          Already don't have an account, then{' '}
          <Text style={{ color: 'darkgreen', fontWeight: 'bold' }}>Sign Up</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.bottomImageContainer}>
        <Image source={require('../assets/Home page image.png')} style={styles.bottomImage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F2FCE4',
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 50,
    marginTop: -150,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  togglePassword: {
    position: 'absolute',
    right: 10,
  },
  togglePasswordText: {
    fontSize: 16,
    color: 'blue',
    marginTop: 30,
  },
  forgotPassword: {
    marginBottom: 20,
  },
  forgotPassword_text: {
    textAlign: 'right',
  },
  loginButton: {
    backgroundColor: '#009B4C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  loginButtonText: {
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

export default Login;
