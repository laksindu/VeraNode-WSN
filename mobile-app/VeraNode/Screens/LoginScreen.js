import { StyleSheet, Text, View ,Button,TouchableOpacity,TextInput,KeyboardAvoidingView,ScrollView,Dimensions} from 'react-native'
import React ,{useState,useEffect}from 'react'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = () => {
    const Navigation = useNavigation()
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const[page,setpage] = useState(false);

    const Signup = ()=>{
        Navigation.replace('SignupScreen')
    }

    const handleLogin = () => {
        if (!email || !password) {
            alert('Please enter email and password');
            return;
        }
        
        setLoading(true);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('Login successful:', userCredential.user.email);
                setLoading(false);
                // Navigate to home screen after successful login
                Navigation.replace('HomeScreen');
            })
            .catch((error) => {
                setLoading(false);
                setpage(true)

            });
    }
    

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.main_container}>

        <View style={styles.text_container}>
            <Text style={styles.header}><Text style={{color:'#0061A4'}}>Log</Text>in</Text>
            <Text style={styles.header_2}>Enter your email and password to access</Text>
            <Text style={styles.header_3}>your account and your device</Text>
        </View>


        <View style={styles.Input_container}>
          <TextInput 
            placeholder='Email address'
            placeholderTextColor={'gray'}
            style={styles.email_Input}
            value={email}
            onChangeText={setEmail}
            editable={!loading}
          />
          <TextInput 
            placeholder='Password' 
            placeholderTextColor={'gray'}
            style={styles.pass_Input}
            value={password}
            onChangeText={setPassword}
            //secureTextEntry
            editable={!loading}
          />
        </View>

        {page == true && (
            <Text style={styles.error_txt}>Check your Email/Password</Text>
        )}

        <TouchableOpacity 
          style={styles.loginBtn}
          onPress={handleLogin}
          disabled={loading}
        >
            <Text style={styles.loginBtnTxt}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>

        <View style={styles.signUptxt_container}>
        <Text style={styles.signUptxt}>Don't have an account?</Text>

        <TouchableOpacity
        onPress={Signup}
        >
            <Text style={styles.signUptxtbtn}>Sign Up</Text>
        </TouchableOpacity>


        </View>

    </View>
    


    </SafeAreaView>
  )
}

const ScreenWidth = Dimensions.get('window').width;
const ScreenHight = Dimensions.get('window').height;

const styles = StyleSheet.create({

   container:{
        flex:1,
        backgroundColor:'#ECEFF1'
    },
    text_container:{
        alignSelf:'center',
        marginTop:ScreenHight*0.13
    },
    header:{
        fontSize:45,
        fontWeight:'bold',
        alignSelf:'center',
    },
    header_2:{
        fontSize:16,
        color:'#706f6f',
        marginTop:15,
        alignSelf:'center'
    },
    header_3:{
        fontSize:16,
        color:'#706f6f',
        alignSelf:'center'
    },
    Input_container:{
        alignSelf:'center',
        marginTop:ScreenHight*0.1
    },
    email_Input:{
        width:ScreenWidth*0.9,
        borderRadius:25,
        height:55,
        borderWidth:1,
        paddingLeft:15,
        borderColor:'#ECEFF1',
        paddingLeft:25,
        elevation: 1,
        backgroundColor:'white'
    },
    pass_Input:{
        width:ScreenWidth*0.9,
        borderRadius:25,
        marginTop:15,
        height:55,
        borderWidth:1,
        borderColor:'#ECEFF1',
        paddingLeft:25,
        elevation: 1,
        backgroundColor:'white'
    },
    loginBtn:{
        alignSelf:'center',
        backgroundColor:'#0061A4',
        padding:15,
        borderRadius:25,
        marginTop:20,
        width:ScreenWidth*0.9,
        alignItems:'center',
        borderColor:'#ECEFF1',
        elevation: 2,
    },
    loginBtnTxt:{
        color:'white',
        fontSize:17,
        //fontWeight:'bold'
    },
    signUptxt_container:{
        flexDirection:'row',
        alignSelf:'center',
        marginTop:25
    },
    signUptxt:{
        fontSize:16,
        color:'#464444',
    },
    signUptxtbtn:{
        fontSize:16,
        color:'#0061A4',
        marginLeft:5,
        fontWeight:'bold'
    },
    error_txt:{
        alignSelf:'center',
        marginTop:15,
        color:'red',
        fontSize:16
    }

})

export default LoginScreen

