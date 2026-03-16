import { StyleSheet, Text, View,ScrollView,Dimensions, TouchableOpacity,Image} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import mqtt from 'mqtt';
import { auth } from '../firebase';

const ZoneSensor = () => {

    const[page,setpage] = useState("1")
    const[zone_1_range,set_zone_1_Range] = useState(10)
    const[zone_2_range,set_zone_2_Range] = useState(10)
    const[zone_3_range,set_zone_3_Range] = useState(10)
    const[zone_4_range,set_zone_4_Range] = useState(10)

    const[zone1,setZone1] = useState();
    const[zone2,setZone2] = useState();
    const[zone3,setZone3] = useState();
    const[zone4,setZone4] = useState();

    const[Zone1_t,setZone1_temp]= useState()
    const[Zone2_t,setZone2_temp]= useState()
    const[Zone3_t,setZone3_temp]= useState()
    const[Zone4_t,setZone4_temp]= useState()

    const[UID,SetUID] = useState()


    useEffect(()=>{
      const getUID = ()=>{
        let uid = auth.currentUser.uid

        if(uid.length > 0 ){
          SetUID(uid)
        }
      }
      getUID()
    },[])
    
    const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt')


    const setTemp_1 = async()=>{
      await AsyncStorage.setItem("temp1",String(zone_1_range))
      setZone1(zone_1_range)
      client.publish(`iot/${UID}/to_device`,`{
        "sensor":"temp",
        "zone":"1",
        "temp":${zone_1_range},
      }`)
    }

    const setTemp_2 = async()=>{
      await AsyncStorage.setItem("temp2",String(zone_2_range))
      setZone2(zone_2_range)
      client.publish(`iot/${UID}/to_device`,`{
        "sensor":"temp",
        "zone":"2",
        "temp":${zone_2_range},
      }`)
    }

    const setTemp_3 = async()=>{
      await AsyncStorage.setItem("temp3",String(zone_3_range))
      setZone3(zone_3_range)
      client.publish(`iot/${UID}/to_device`,`{
        "sensor":"temp",
        "zone":"3",
        "temp":${zone_3_range},
      }`)
    }

    const setTemp_4 = async()=>{
      await AsyncStorage.setItem("temp4",String(zone_4_range))
      setZone4(zone_4_range)
      client.publish(`iot/${UID}/to_device`,`{
        "sensor":"temp",
        "zone":"4",
        "temp":${zone_4_range},
      }`)
    }

    useEffect(()=>{
      const getData = async()=>{
        let Zone1temp = await AsyncStorage.getItem("temp1")
        let Zone2temp = await AsyncStorage.getItem("temp2")
        let Zone3temp = await AsyncStorage.getItem("temp3")
        let Zone4temp = await AsyncStorage.getItem("temp4")
        
        setZone1(Zone1temp)
        setZone2(Zone2temp)
        setZone3(Zone3temp)
        setZone4(Zone4temp)
      }
      getData()
    },[])

    useEffect(()=>{

      client.on('connect',()=>{
        client.subscribe([
        `iot/${UID}/Zone1_temp`,
        `iot/${UID}/Zone2_temp`,
        `iot/${UID}/Zone3_temp`,
        `iot/${UID}/Zone4_temp`,       
        ])
      })

      client.on('message',(topic,message)=>{

        let msg = message.toString()
          if(topic === `iot/${UID}/Zone1_temp`){
            setZone1_temp(parseFloat(msg))
          }
          else if(topic === `iot/${UID}/Zone2_temp`){
            setZone2_temp(parseFloat(msg))
          }
          else if(topic === `iot/${UID}/Zone3_temp`){
            setZone3_temp(parseFloat(msg))
          }
          else if(topic === `iot/${UID}/Zone4_temp`){
            setZone4_temp(parseFloat(msg))
          }
      })
      return () => {
        client.end(true); // disconnect old client when effect re-runs
      };
    },[UID])
  return (
    <SafeAreaView style={styles.main_container}>
      <View style={styles.nav}>
        <Text style={styles.header_text}>VeraNode</Text>
      </View>

    <View style={styles.Sensors}>
      <TouchableOpacity style={[styles.buttons,page === "1" ? styles.btnActive : styles.btnIncactive]}
        onPress={()=>{
            setpage("1")
        }}
      >
        <MaterialCommunityIcons name='numeric-1-circle' size={40} style={[styles.icons,page === "1" ? styles.iconActive : styles.iconInActive]}/>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.buttons,page === "2" ? styles.btnActive : styles.btnIncactive]}
        onPress={()=>{
            setpage("2")
        }}
      >
        <MaterialCommunityIcons name='numeric-2-circle' size={40} style={[styles.icons,page === "2" ? styles.iconActive : styles.iconInActive]}/>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.buttons,page === "3" ? styles.btnActive : styles.btnIncactive]}
        onPress={()=>{
            setpage("3")
        }}
      >
        <MaterialCommunityIcons name='numeric-3-circle' size={40} style={[styles.icons,page === "3" ? styles.iconActive : styles.iconInActive]}/>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.buttons,page === "4" ? styles.btnActive : styles.btnIncactive]}
        onPress={()=>{
            setpage("4")
        }}
      >
        <MaterialCommunityIcons name='numeric-4-circle' size={40} style={[styles.icons,page === "4" ? styles.iconActive : styles.iconInActive]}/>
      </TouchableOpacity>

    </View>
        
    {page === "1"&&(
        <Text style={styles.nav_1}>Zone 1</Text>
    )}

    {page === "1" &&(
        <View style={styles.circle}>
        <AnimatedCircularProgress
          size={255}
          width={6}
          fill={Zone1_t || 0}
          tintColor="#0061A4"
          backgroundColor="#E1E2EC"
          rotation={1}
        >
          {() => 
          <Text style={[styles.temp_txt]}>{Zone1_t}<Text style={{fontSize:30}}> ℃</Text></Text>}
        </AnimatedCircularProgress>

        <Text style={styles.rangetxt}>
          <MaterialCommunityIcons name='thermometer' color="#8f8d92" size={20}/>
          {zone_1_range}<Text style={{fontSize:20}}> ℃</Text>
        </Text>
        <Slider
           style={{marginLeft:ScreenWidth*0.02,marginTop:ScreenHeight*0.04}}
           minimumValue={0}
           maximumValue={60}
           step={1}
           value={zone_1_range}
           onValueChange={(value) => set_zone_1_Range(value)}
           minimumTrackTintColor="#0061A4"
           maximumTrackTintColor="#3d5875"
        />
        <TouchableOpacity style={styles.SetBtn}
        onPress={setTemp_1}
        >
            <MaterialCommunityIcons name='tune-variant' size={20} color="#0061A4" style={{marginLeft:10}}/>
            <Text style={styles.SetbtnTxt}>Activate</Text>
        </TouchableOpacity>
        </View>
    )}
    {page === "1" && zone1 &&( // zone1 mean zone1 == true
      <View style={styles.action_card}>
        <MaterialCommunityIcons style={styles.snackbar_icon} name='light-switch' size={20} color="#0061A4"/>
        <Text style={styles.show_txt}>Zone 1 will trigger at <Text style={{fontWeight:'bold'}}>{zone1}</Text> °C</Text>
      </View>
    )}


    {page === "2"&&(
        <Text style={styles.nav_1}>Zone 2</Text>
    )}
    {page === "2" &&(
        <View style={styles.circle}>
        <AnimatedCircularProgress
          size={255}
          width={6}
          fill={Zone2_t || 0}
          tintColor="#0061A4"
          backgroundColor="#E1E2EC"
          rotation={1}
        >
          {() => 
          <Text style={[styles.temp_txt]}>{Zone2_t}<Text style={{fontSize:30}}> ℃</Text></Text>}
        </AnimatedCircularProgress>

        <Text style={styles.rangetxt}>
          <MaterialCommunityIcons name='thermometer' color="#8f8d92" size={20} style={styles.tempicon}/>
          {zone_2_range}<Text style={{fontSize:20}}> ℃</Text>
        </Text>

        <Slider
           style={{marginLeft:ScreenWidth*0.02,marginTop:ScreenHeight*0.04}}
           minimumValue={0}
           maximumValue={60}
           step={1}
           value={zone_2_range}
           onValueChange={(value) => set_zone_2_Range(value)}
           minimumTrackTintColor="#0061A4"
           maximumTrackTintColor="#3d5875"
        />
        <TouchableOpacity style={styles.SetBtn}
        onPress={setTemp_2}
        >
            <MaterialCommunityIcons name='tune-variant' size={20} color="#0061A4" style={{marginLeft:10}}/>
            <Text style={styles.SetbtnTxt}>Activate</Text>
        </TouchableOpacity>
        </View>
    )}
    {page === "2" && zone2 &&(
      <View style={styles.action_card}>
        <MaterialCommunityIcons style={styles.snackbar_icon} name='light-switch' size={20} color="#0061A4"/>
        <Text style={styles.show_txt}>Zone 2 will trigger at <Text style={{fontWeight:'bold'}}>{zone2}</Text> °C</Text>
      </View>
    )}


    {page === "3"&&(
        <Text style={styles.nav_1}>Zone 3</Text>
    )}
    {page === "3" &&(
        <View style={styles.circle}>
        <AnimatedCircularProgress
          size={255}
          width={6}
          fill={Zone3_t || 0}
          tintColor="#0061A4"
          backgroundColor="#E1E2EC"
          rotation={1}
        >
          {() => 
          <Text style={[styles.temp_txt]}>{Zone3_t}<Text style={{fontSize:30}}>℃</Text></Text>}
        </AnimatedCircularProgress>

        <Text style={styles.rangetxt}>
          <MaterialCommunityIcons name='thermometer' color="#8f8d92" size={20} style={styles.tempicon}/>
          {zone_3_range}<Text style={{fontSize:20}}> ℃</Text>
        </Text>

        <Slider
           style={{marginLeft:ScreenWidth*0.02,marginTop:ScreenHeight*0.04}}
           minimumValue={0}
           maximumValue={60}
           step={1}
           value={zone_3_range}
           onValueChange={(value) => set_zone_3_Range(value)}
           minimumTrackTintColor="#0061A4"
           maximumTrackTintColor="#3d5875"
        />
        <TouchableOpacity style={styles.SetBtn}
        onPress={setTemp_3}
        >
            <MaterialCommunityIcons name='tune-variant' size={20} color="#0061A4" style={{marginLeft:10}}/>
            <Text style={styles.SetbtnTxt}>Activate</Text>
        </TouchableOpacity>
        </View>
    )}
    {page === "3" && zone3 &&(
      <View style={styles.action_card}>
        <MaterialCommunityIcons style={styles.snackbar_icon} name='light-switch' size={20} color="#0061A4"/>
        <Text style={styles.show_txt}>Zone 3 will trigger at <Text style={{fontWeight:'bold'}}>{zone3}</Text> °C</Text>
      </View>
    )}


    {page === "4"&&(
        <Text style={styles.nav_1}>Zone 4</Text>
    )}
    {page === "4" &&(
        <View style={styles.circle}>
        <AnimatedCircularProgress
          size={255}
          width={6}
          fill={Zone4_t}
          tintColor="#0061A4"
          backgroundColor="#E1E2EC"
          rotation={1}
        >
          {() => 
          <Text style={[styles.temp_txt]}>{Zone4_t}<Text style={{fontSize:30}}>℃</Text></Text>}
        </AnimatedCircularProgress>

        <Text style={styles.rangetxt}>
          <MaterialCommunityIcons name='thermometer' color="#8f8d92" size={20} style={styles.tempicon}/>
          {zone_4_range}<Text style={{fontSize:20}}> ℃</Text>
        </Text>

        <Slider
           style={{marginLeft:ScreenWidth*0.02,marginTop:ScreenHeight*0.04}}
           minimumValue={0}
           maximumValue={60}
           step={1}
           value={zone_4_range}
           onValueChange={(value) => set_zone_4_Range(value)}
           minimumTrackTintColor="#0061A4"
           maximumTrackTintColor="#3d5875"
        />
        <TouchableOpacity style={styles.SetBtn}
        onPress={setTemp_4}
        >
            <MaterialCommunityIcons name='tune-variant' size={20} color="#0061A4" style={{marginLeft:10}}/>
            <Text style={styles.SetbtnTxt}>Activate</Text>
        </TouchableOpacity>
        </View>
    )}
    {page === "4" && zone4 &&( // zone1 mean zone1 == true
      <View style={styles.action_card}>
        <MaterialCommunityIcons style={styles.snackbar_icon} name='light-switch' size={20} color="#0061A4"/>
        <Text style={styles.show_txt}>Zone 4 will trigger at <Text style={{fontWeight:'bold'}}>{zone4}</Text> °C</Text>
      </View>
    )}

    

    </SafeAreaView>
  )
}

const ScreenWidth = Dimensions.get('window').width
const ScreenHeight = Dimensions.get('window').height

const styles = StyleSheet.create({

  main_container:{
    flex:1,
    backgroundColor:'#FDFBFF'
  },
  nav:{
    marginTop:ScreenHeight*0.03,
    flexDirection:'row',
    justifyContent:'space-between'

  },
  header_text:{
    color:'#1A1C1E',
    fontSize:26,
    marginLeft:ScreenWidth*0.05,
    fontWeight:'500'
  },
  Sensors:{
    marginTop:ScreenHeight*0.05,
    alignSelf:'center',
    backgroundColor:'#E0E2EC',
    width:ScreenWidth*0.75,
    borderRadius:30,
    flexDirection:'row',
    justifyContent:'space-between',
  },
  buttons:{
    width:70,
    borderRadius:30,
    padding:5,
  },
  icons:{
    alignSelf:'center'
  },
  btnActive:{
    backgroundColor:'#0061A4'
  },
  btnIncactive:{
    backgroundColor:'#E0E2EC'
  },
  iconActive:{
    color:'#E0E2EC'
  },
  iconInActive:{
    color:'#8f8d92'
  },
  circle:{
    alignSelf:'center',
    marginTop:ScreenHeight*0.04,
  },
  temp_txt:{
    fontSize:50,
    alignSelf:'center',
    //fontWeight:'bold',
    color:'#1A1C1E'
  },
  SetBtn:{
    alignSelf:'center',
    backgroundColor:'#D1E4FF',
    width:145,
    padding:10,
    alignItems:'center',
    borderRadius:30,
    marginTop:ScreenHeight*0.003,
    marginTop:20,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  SetbtnTxt:{
    color:'#0061A4',
    fontWeight:'bold',
    fontSize:17,
    marginRight:17
  },
  rangetxt:{
    fontSize:24,
    alignSelf:'center',
    marginTop:ScreenHeight*0.045,
    color:'#0061A4',
  },
  nav_1:{
    alignSelf:'center',
    fontSize:22,
    fontWeight:'bold',
    marginTop:ScreenHeight*0.04,
  },
  action_card:{
    backgroundColor:'#F0F4F9',
    width:ScreenWidth*0.7,
    alignSelf:'center',
    marginTop:ScreenHeight*0.045,
    padding:10,
    borderRadius:20,
    flexDirection:'row',
    justifyContent:'space-between',
    borderWidth:1,
    borderColor:'#F0F4F9',
  },
  show_txt:{
    color:'#0061A4',
    marginRight:25
  },
  snackbar_icon:{
    marginLeft:10
  }
  
})

export default ZoneSensor