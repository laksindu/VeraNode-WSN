import { StyleSheet, Text, View,ScrollView,Dimensions, TouchableOpacity,Image,TextInput,alert, Alert} from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth } from '../firebase'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Config = () => {

    const[page,SetPage] = useState(false)
    const[ssid,SetSSID] = useState('')
    const[pass,SetPass] = useState('')

    const[waiting,setWaiting] = useState(false)

    const[deivceState,SetDeviceState] = useState('')

    const[UID,SetUID] = useState()

    const Navigation = useNavigation()

    const BackHome = ()=>{
        Navigation.replace("HomeScreen")
    }

    useEffect(()=>{
        const getUID = ()=>{

            let uid = auth.currentUser.uid    

            if(uid.length > 0){
                SetUID(uid)
            }
        }

    getUID()

    },[])


    const SendData = ()=>{
        fetch('http://192.168.4.1/wifi',{
            method:'POST',
            headers:{
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:`SSID=${ssid}&Password=${pass}&ID=${UID}`
        })
        .then(response => response.text())
        .then(data=>{
            if(data === "ok"){
                setWaiting(true)
            }
        })
    }

  return (
    <SafeAreaView style={styles.main_container}>

    {page && (
        <TouchableOpacity style={styles.back_Icon}
        onPress={()=>{
            SetPage(false)
        }}
        >
            <MaterialCommunityIcons name='arrow-left' size={30}/>
        </TouchableOpacity>
    )}

    {!page && (
        <TouchableOpacity style={styles.back_Icon}
        onPress={BackHome}
        >
            <MaterialCommunityIcons name='arrow-left' size={30}/>
        </TouchableOpacity>
    )}


     <View style={styles.nav}>
        <View style={[styles.fristPage,{backgroundColor:page ?'#D1E4FF':'#0061A4'}]}></View>

        <View style={{width:5,alignSelf:'center'}}></View>

        <View style={[styles.SecondPage,{backgroundColor:page ?'#0061A4':'#D1E4FF'}]}></View>
      </View>

      {!page &&(
        <Image
        source={require('../assets/pairDevice.png')}
        style={styles.Image}
        />
      )}

      {!page && (
        <View style={styles.headers}>
            <Text style={styles.header_1}>Pairing device</Text>
            <Text style={styles.header_2}>Go to Wi-Fi settings</Text>
            <Text style={styles.header_3}>and connect<Text style={{fontWeight:'bold'}}> VeraNode </Text>Access point</Text>
        </View>
      )}

      {!page &&(
        <TouchableOpacity style={styles.nextbtn}
        onPress={()=>{
            SetPage(true)
        }}
        >
            <Text style={styles.nxtbtn_txt}>Continue</Text>
        </TouchableOpacity>
      )}

      {page && !waiting &&(
        <Image style={styles.Image_2}
        source={require('../assets/Wifi.png')}
        />
      )}
      {page && !waiting &&(
        <View style={styles.input_container}>
            <TextInput style={styles.ssid}
            placeholder='Wi-Fi name'
            placeholderTextColor={'gray'}
            value={ssid}
            onChangeText={SetSSID}

            />
            <TextInput style={styles.pass}
            placeholder='Password'
            placeholderTextColor={'gray'}
            value={pass}
            onChangeText={SetPass}

            />
            <Text style={styles.header_4}>Enter your Wi-Fi details to get</Text>
            <Text style={styles.header_5}><Text style={{fontWeight:'bold'}}>VeraNode </Text>online</Text>

            <TouchableOpacity style={styles.connectBtn}
            onPress={SendData}
            >
                <Text style={styles.connect_txt}>Complete the pairing</Text>
            </TouchableOpacity>
        </View>
      )}

      {page && waiting && (
        <View style={styles.completed_container}>
            <MaterialCommunityIcons name='check-circle' size={130} color='#0061A4' style={{alignSelf:'center'}}/>
            <Text style={styles.completed_txt}>Everything is ready!</Text>
            <Text style={styles.completed_txt_2}>Your device is connected.</Text>

            <TouchableOpacity style={styles.completed_btn}
            onPress={BackHome}
            >
                <Text style={styles.btntxt}>Done</Text>
            </TouchableOpacity>
        </View>
      )}



    </SafeAreaView>
  )
}

const ScreenHeight = Dimensions.get('window').height
const ScreenWidth = Dimensions.get('window').width

const styles = StyleSheet.create({

    main_container:{
        flex:1,
        backgroundColor:'#FDFBFF'
    },
    Image:{
        width:ScreenWidth*0.9,
        height:ScreenHeight*0.4,
        resizeMode:'contain',
        alignSelf:'center'
    },
    nav:{
        alignSelf:'center',
        marginTop:ScreenHeight*0.008,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    fristPage:{
        backgroundColor:'#0061A4',
        width:50,
        height:5,
        borderRadius:20,
    },
    SecondPage:{
        backgroundColor:'#D1E4FF',
        width:50,
        height:6,
        borderRadius:20       
    },
    header_1:{
        alignSelf:'center',
        marginTop:20,
        fontSize:25,
        fontWeight:'bold'
    },
    header_2:{
        alignSelf:'center',
        fontSize:16,
        color:'#6c6b6e',
        marginTop:ScreenHeight*0.04
    },
    header_3:{
        alignSelf:'center',
        fontSize:16,
        color:'#6c6b6e',
        marginTop:2
    },
    nextbtn:{
        backgroundColor:'#D1E4FF',
        width:120,
        padding:15,
        alignSelf:'center',
        alignItems:'center',
        marginTop:ScreenWidth*0.2,
        borderRadius:25
    },
    nxtbtn_txt:{
        color:'#0061A4',
        fontSize:15,
        fontWeight:'bold'
    },
    ssid:{
        width:ScreenWidth*0.8,
        borderRadius:6,
        borderWidth:1,
        paddingLeft:15,
        borderColor:'#0061A4',
        height:50,
    },
    input_container:{
        alignSelf:'center'
    },
    pass:{
        width:ScreenWidth*0.8,
        borderRadius:6,
        borderWidth:1,
        paddingLeft:15,
        borderColor:'#0061A4',
        height:50,
        marginTop:10
    },
    Image_2:{
        width:ScreenWidth*0.75,
        height:ScreenHeight*0.3,
        resizeMode:'contain',
        marginTop:ScreenHeight*0.05,
        alignSelf:'center'        
    },
    connectBtn:{
        backgroundColor:'#D1E4FF',
        padding:15,
        alignItems:'center',
        width:200,
        alignSelf:'center',
        marginTop:ScreenHeight*0.1,
        borderRadius:25
    },
    connect_txt:{
        color:'#0061A4',
        fontWeight:'bold',
        fontSize:15
    },
    back_Icon:{
        marginLeft:ScreenWidth*0.06,
        marginTop:ScreenHeight*0.01
    },
    header_4:{
        alignSelf:'center',
        fontSize:16,
        color:'#6c6b6e',
        marginTop:ScreenHeight*0.05   
    },
    header_5:{
        alignSelf:'center',
        fontSize:16,
        color:'#6c6b6e',
        marginTop:2
    },
    completed_container:{
        alignSelf:'center',
        marginTop:ScreenHeight*0.2
    },
    completed_txt:{
        alignSelf:'center',
        marginTop:ScreenHeight*0.04,
        fontSize:25,
        fontWeight:'bold',
        color:'#1A1C1E'
    },
    completed_txt_2:{
        marginTop:15,
        alignSelf:'center',
        fontSize:16,
        color:'#6c6b6e'
    },
    completed_btn:{
        alignSelf:'center',
        marginTop:ScreenHeight*0.04,
        backgroundColor:'#D1E4FF',
        padding:15,
        alignItems:'center',
        width:100,
        borderRadius:25
    },
    btntxt:{
        color:'#0061A4',
        fontWeight:'bold',
        fontSize:15
    }
})

export default Config


