import { StyleSheet, Text, View,ScrollView,Dimensions, TouchableOpacity,Image, StatusBar} from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth } from '../firebase'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { Provider , Menu , IconButton } from 'react-native-paper';
import mqtt from 'mqtt';

const HomeScreen = () => {

  const[page,setpage] = useState(true)
  const[State,SetState] = useState(false)

  const[visibal,SetVisibal] = useState(false)

  const[UID,SetUID] = useState()



  const[Zone1_t,setZone1_temp]= useState()
  const[Zone2_t,setZone2_temp]= useState()
  const[Zone3_t,setZone3_temp]= useState()
  const[Zone4_t,setZone4_temp]= useState()
  
  const[Zone1_h,setZone1_humid]= useState()
  const[Zone2_h,setZone2_humid]= useState()
  const[Zone3_h,setZone3_humid]= useState()
  const[Zone4_h,setZone4_humid]= useState()

  const open = ()=>{
    SetVisibal(true)
  }
  const close = ()=>{
    SetVisibal(false)
  }

  const Navigation = useNavigation()

  const Logout = ()=>{
    signOut(auth)
    Navigation.replace("LoginScreen")
  }

  const ZoneSensor = ()=>{
    Navigation.navigate("ZoneSensor")
  }

  const AddDeivce = ()=>{
    Navigation.navigate("Config")
  }

  useEffect(()=>{
    const getUID = () =>{
      let uid = auth.currentUser.uid
      if(uid.length > 0){
        SetUID(uid)
      }
    }
    getUID()
  },[])



  useEffect(()=>{

      const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt')

      client.on('connect',()=>{
        client.subscribe([

          `iot/${UID}/from_device`,

          `iot/${UID}/Zone1_temp`,
          `iot/${UID}/Zone2_temp`,
          `iot/${UID}/Zone3_temp`,
          `iot/${UID}/Zone4_temp`,

          `iot/${UID}/Zone1_humid`,
          `iot/${UID}/Zone2_humid`,
          `iot/${UID}/Zone3_humid`,
          `iot/${UID}/Zone4_humid`
        ])
      })
    client.on('message',(topic,message)=>{

        let msg = message.toString()

        if(topic === `iot/${UID}/Zone1_temp`){
          setZone1_temp(msg)
        }
        else if(topic === `iot/${UID}/Zone2_temp`){
          setZone2_temp(msg)
        }
        else if(topic === `iot/${UID}/Zone3_temp`){
          setZone3_temp(msg)
        }
        else if(topic === `iot/${UID}/Zone4_temp`){
          setZone4_temp(msg)
        }

        // humidity

        else if(topic === `iot/${UID}/Zone1_humid`){
          setZone1_humid(msg)
        }
        else if(topic === `iot/${UID}/Zone2_humid`){
          setZone2_humid(msg)
        }
        else if(topic === `iot/${UID}/Zone3_humid`){
          setZone3_humid(msg)
        }
        else if(topic === `iot/${UID}/Zone4_humid`){
          setZone4_humid(msg)
        }

        else if(topic === `iot/${UID}/from_device`){
          if(msg == "online"){
            SetState(true)
            console.log(msg)
          }
          else if(msg == "offline"){
            SetState(false)
          }
        }


      })

  },[UID])
  return (
    <Provider>
    <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={true} />
    <SafeAreaView style={styles.main_container}>
      <ScrollView >

      <View style={styles.nav}>
        <Text style={styles.header_text}>VeraNode</Text>

          <Menu style={styles.kebab}
          visible={visibal}
          onDismiss={close}
          anchor={
            <IconButton icon="dots-vertical" iconColor='#1A1C1E' size={28} onPress={open}/>
          }
          >

          <Menu.Item 
          onPress={()=>{
          }} 
          title="Info"
          leadingIcon="information-outline"
          />
          

          <Menu.Item onPress={()=>{
            Logout()
          }} 
          title="Logout"
          leadingIcon="logout"
          />
          </Menu>
          

      </View>

    {State == true && (
      <View style={styles.Sensors}>
      <TouchableOpacity style={[styles.tempBtn,{backgroundColor:page? '#0061A4':'#E7E0EC'}]}
      onPress={()=>{
        setpage(true)
      }}
      >
        <Text style={[styles.temp_view_txt,{color:page?'#FFFFFF':'#44474E'}]}>Temp</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.humidBtn,{backgroundColor:page? '#E7E0EC':'#0061A4'}]}
      onPress={()=>{
        setpage(false)
      }}
      >
        <Text style={[styles.humidity_view_txt,{color:page?'#44474E':'#FFFFFF'}]}>humidity</Text>
      </TouchableOpacity>
    </View>
    )}

 

    {/* temp */}
    {page == true && State == true &&(
    <View style={styles.uppder_containers}>
      <TouchableOpacity style={styles.zone_1_container}>
        <View style={styles.Labels}>
         <Text style={styles.zone_text}>zone 1</Text>
         <MaterialCommunityIcons name='thermometer' size={24} color="#006494" style={styles.icons}/>
        </View>

        <Text style={styles.text}>
          {Zone1_t} <Text style={styles.celeius}>℃</Text>
        </Text>

        {/* <MaterialCommunityIcons name='chevron-right' size={30} style={styles.icons_arrows} color="#9a9aa1" /> */}

      </TouchableOpacity>

      <TouchableOpacity style={styles.zone_2_container}>
        <View style={styles.Labels}>
         <Text style={styles.zone_text}>zone 2</Text>
         <MaterialCommunityIcons name='thermometer' size={24} color="#006494" style={styles.icons}/>
        </View>
        <Text style={styles.text}>
          {Zone2_t} <Text style={styles.celeius}>℃</Text>
        </Text>

        {/* <MaterialCommunityIcons name='chevron-right' size={30} style={styles.icons_arrows} color="#9a9aa1" /> */}

      </TouchableOpacity>
      

     </View>
    )}
    {page == true && State == true &&(
    <View style={styles.uppder_containers2}>
      <TouchableOpacity style={styles.zone_1_container}>
        <View style={styles.Labels}>
         <Text style={styles.zone_text}>zone 3</Text>
         <MaterialCommunityIcons name='thermometer' size={24} color="#006494" style={styles.icons}/>
        </View>
        <Text style={styles.text}>
          {Zone3_t}<Text style={styles.celeius}>℃</Text>
        </Text>

        {/* <MaterialCommunityIcons name='chevron-right' size={30} style={styles.icons_arrows} color="#9a9aa1" /> */}

      </TouchableOpacity>

      <TouchableOpacity style={styles.zone_2_container}>
        <View style={styles.Labels}>
         <Text style={styles.zone_text}>zone 4</Text>
         <MaterialCommunityIcons name='thermometer' size={24} color="#006494" style={styles.icons}/>
        </View>
        <Text style={styles.text}>
          {Zone4_t} <Text style={styles.celeius}>℃</Text>
        </Text>

        {/* <MaterialCommunityIcons name='chevron-right' size={30} style={styles.icons_arrows} color="#9a9aa1" /> */}

      </TouchableOpacity>

    </View>
    )}

      {/* humidity */}

    {page == false && State == true &&(
    <View style={styles.uppder_containers}>
      <TouchableOpacity style={styles.zone_1_container}>
        <View style={styles.Labels}>
         <Text style={styles.zone_text}>zone 1</Text>
         <MaterialCommunityIcons name='water-percent' size={24} color="#006494" style={styles.icons}/>
        </View>
        <Text style={styles.text}>
          {Zone1_h}<Text style={styles.precentage}> %</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.zone_2_container}>
        <View style={styles.Labels}>
         <Text style={styles.zone_text}>zone 2</Text>
         <MaterialCommunityIcons name='water-percent' size={24} color="#006494" style={styles.icons}/>
        </View>
        <Text style={styles.text}>
          {Zone2_h}<Text style={styles.precentage}> %</Text>
        </Text>
      </TouchableOpacity>

     </View>
    )}

    {page == false && State == true &&(
    <View style={styles.uppder_containers2}>
      <TouchableOpacity style={styles.zone_1_container}>
        <View style={styles.Labels}>
         <Text style={styles.zone_text}>zone 3</Text>
         <MaterialCommunityIcons name='water-percent' size={24} color="#006494" style={styles.icons}/>
        </View>
        <Text style={styles.text}>
          {Zone3_h}<Text style={styles.precentage}> %</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.zone_2_container}>
        <View style={styles.Labels}>
         <Text style={styles.zone_text}>zone 4</Text>
         <MaterialCommunityIcons name='water-percent' size={24} color="#006494" style={styles.icons}/>
        </View>
        <Text style={styles.text}>
          {Zone4_h}<Text style={styles.precentage}> %</Text>
        </Text>
      </TouchableOpacity>

     </View>
    )}

    {page == true && State == true &&(
      <TouchableOpacity style={styles.Zone_automation}
       onPress={ZoneSensor}
      >
        <MaterialCommunityIcons name='thermometer-plus' size={33} color='#0061A4' style={styles.tempIcon}/>
      </TouchableOpacity>
    )}

    {/* Offline page */}

    {State == false &&(
      <View style={styles.offline_contrainer}>
        <Image
        source={require('../assets/disconnected.png')}
        style={styles.img}
        />

        <Text style={styles.disDevcietxt}>No Device found</Text>
        <Text style={styles.disDevcietxt1}>Please make sure your device is powered on</Text>
        <Text style={styles.disDevcietxt2}>and connected to the internet.</Text>

        <TouchableOpacity
         style={styles.addbtn}
         onPress={AddDeivce}
        >
          <Text style={styles.addtxt}>Add Device</Text>
        </TouchableOpacity>
      </View>
    )}

    </ScrollView>
    </SafeAreaView>
    </Provider>
  )
}

const ScreenHeight = Dimensions.get("window").height
const ScreenWidth = Dimensions.get('window').width

const styles = StyleSheet.create({

  main_container:{
    flex:1,
    backgroundColor:'#FDFBFF'
  },
  nav:{
    marginTop:ScreenHeight*0.015,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'

  },
  header_text:{
    color:'#1A1C1E',
    fontSize:26,
    marginLeft:ScreenWidth*0.05,
    fontWeight:'500'
  },
  zone_1_container:{
    backgroundColor:'#F0F0F7',
    height:ScreenHeight*0.2,
    width:ScreenWidth*0.46,
    elevation:1,
    alignSelf:'center',
    borderWidth:1,
    borderRadius:20,
    borderColor:'#ECEFF1',
    marginLeft:ScreenWidth*0.03
  },
  zone_2_container:{
    backgroundColor:'#F0F0F7',
    height:ScreenHeight*0.2,
    width:ScreenWidth*0.46,
    elevation:1,
    alignSelf:'center',
    borderWidth:1,
    borderRadius:20,
    borderColor:'#ECEFF1',
    marginRight:ScreenWidth*0.03
  },
  uppder_containers:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:ScreenHeight*0.06
  },
  uppder_containers2:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:ScreenHeight*0.01
  },
  Sensors:{
    marginTop:ScreenHeight*0.05,
    alignSelf:'center',
    backgroundColor:'#E0E2EC',
    width:ScreenWidth*0.6,
    height:ScreenHeight*0.069,
    borderRadius:30,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  tempBtn:{
    width:ScreenWidth*0.3,
    borderRadius:30,
    padding:18,
  },
  temp_view_txt:{
   fontSize:15,
   alignSelf:'center',
   fontWeight:'bold'
  },
  humidity_view_txt:{
    fontSize:15,
    alignSelf:'center',
    fontWeight:'bold',
  },
  humidBtn:{
    borderRadius:30,
    padding:18,
    width:ScreenWidth*0.3
  },
  zone_text:{
    color:'#49454F',
    fontSize:16,
    marginLeft:16,
    fontWeight:'bold'
  },
  Labels:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:10
  },
  icons:{
    marginRight:16
  },
  text:{
    color:'#0061A4',
    fontSize:35,
    alignSelf:'center',
    marginTop:20
  },
  celeius:{
    fontSize:20
  },
  precentage:{
    fontSize:20
  },
  icons_arrows:{
    marginLeft:135,
    marginTop:19
  },

  //for offline page
  img:{
    width:ScreenWidth*0.9,
    height:ScreenHeight*0.4,
    resizeMode:'contain',
    marginTop:ScreenHeight*0.05
  },
  offline_contrainer:{
    alignSelf:'center'
  },
  disDevcietxt:{
    color:'#0061A4',
    fontSize:23,
    fontWeight:'bold',
    alignSelf:'center',
    marginTop:ScreenHeight*0.01
  },
    disDevcietxt1:{
        color:'#49454F',
        fontSize:16,
        alignSelf:'center',
        marginTop:ScreenHeight*0.03
    },
    disDevcietxt2:{
       color:'#49454F',
       fontSize:16,
       marginTop:5,
       alignSelf:'center' 
    },
    addbtn:{
        width:130,
        height:40,
        backgroundColor:'#0061A4',
        borderRadius:20,
        marginTop:ScreenHeight*0.05,
        alignSelf:'center',
        alignItems:'center'
    },
    addtxt:{
        marginTop:7,
        color:'white',
        fontWeight:'bold',
        fontSize:15
    },
    //

    Zone_automation:{
      width:66,
      backgroundColor:'#D1E4FF',
      marginTop:30,
      borderRadius:20,
      padding:15,
      marginTop:ScreenHeight*0.15,
      marginLeft:ScreenWidth*0.75,
    },
})

export default HomeScreen

//Offline Page and connect new deivce ui -ok
//mqtt - ok
//device configuration -ok