import { StyleSheet, Text, View ,Button,TouchableOpacity,TextInput,KeyboardAvoidingView,ScrollView,Dimensions} from 'react-native'
import React ,{useState,useEffect}from 'react'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignupScreen = () => {

    const Navigation = useNavigation()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const[page,setpage] = useState(false);
    const[error,setError] = useState()

    const Loginnav = ()=>{
        Navigation.replace("LoginScreen")
    }

    const handleSignup = () => {
        if (!email || !password) {
            alert('Please enter email and password');
            return;
        }
        
        setLoading(true);
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential)=>{
            console.log('Account created:', userCredential.user.email);
            setLoading(false);
            Navigation.replace("LoginScreen");
        })
        .catch((error)=>{
            setLoading(false);
            setpage(true)
            const error_code = error.code.replace('auth/','')
            setError(error_code)
        });
    }

  return (
    <SafeAreaView style={styles.main_container}>
    <View style={styles.text_container}>
      <Text style={styles.text_1}>Create <Text style={{color:'#0061A4'}}>Account</Text></Text>
      <Text style={styles.text_2}>Create a new account to get started</Text>
    </View>

    <View style={styles.input_container}>
        <TextInput 
          placeholder='Email address'
          placeholderTextColor={'gray'}
          style={styles.email_input}
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />
        <TextInput 
          placeholder='password'
          placeholderTextColor={'gray'}
          style={styles.pass_input}
          value={password}
          onChangeText={setPassword}
          //secureTextEntry
          editable={!loading}
        />
    </View>
    {page == true && (
        <Text style={styles.error_txt}>{error}</Text>
    )}

    <TouchableOpacity 
      style={styles.Signupbtn}
      onPress={handleSignup}
      disabled={loading}
    >
        <Text style={styles.signuptxt}>{loading ? 'Creating Account...' : 'Create Account'}</Text>
    </TouchableOpacity>

    <View style={styles.logintext_container}>
        <Text style={styles.logintxt}>Already have an account?</Text>

        <TouchableOpacity style={styles.loginbtn}
        onPress={Loginnav}
        >
            <Text style={styles.loginbtn_txt}>Sign in</Text>
        </TouchableOpacity>
        
    </View>

    </SafeAreaView>
  )
}

const ScreenWidth = Dimensions.get('window').width
const ScreenHeight = Dimensions.get('window').height

const styles = StyleSheet.create({

    main_container:{
        flex:1,
        backgroundColor:'#ECEFF1'
    },
    text_container:{
        alignSelf:'center',
        marginTop:ScreenHeight*0.13
    },
    text_1:{
        alignSelf:'center',
        fontSize:40,
        fontWeight:'bold'
    },
    text_2:{
        fontSize:16,
        color:'#706f6f',
        alignSelf:'center',
        marginTop:15      
    },
    input_container:{
        alignSelf:'center',
        marginTop:ScreenHeight*0.1
    },
    email_input:{
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
    pass_input:{
        width:ScreenWidth*0.9,
        borderRadius:25,
        height:55,
        borderWidth:1,
        paddingLeft:15,
        borderColor:'#ECEFF1',
        paddingLeft:25,
        elevation: 1,
        backgroundColor:'white',
        marginTop:15
    },
    Signupbtn:{
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
    signuptxt:{
        fontSize:16,
        color:'white'
    },
    logintext_container:{
        alignSelf:'center',
        flexDirection:'row',
        alignContent:'space-between',
        marginTop:15
    },
    logintxt:{
        color:'#464444',
        fontSize:16
    },
    loginbtn_txt:{
        marginLeft:5,
        fontSize:16,
        fontWeight:'bold',
        color:'#0061A4'
    },
    error_txt:{
        alignSelf:'center',
        marginTop:15,
        color:'red',
        fontSize:16
    }
})
export default SignupScreen