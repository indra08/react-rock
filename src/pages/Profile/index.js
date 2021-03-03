import React, { useState, useEffect } from 'react';
import { 
    ImageBackground,
    Image,
    StyleSheet,
    Text,
    SafeAreaView,
    View,
    TouchableOpacity,
    Modal,
    Dimensions,
    ActivityIndicator,
    Platform,
    Alert,
    ScrollView,
    TextInput,
    BackHandler,
    } 
    from "react-native";

const size = require('../../Res/size');
const color = require('../../Res/color');
const win = Dimensions.get('window');
const {width, height} = win;
import RepoUtil from '../../helper/RepoUtil';
import Api from '../../api';

const Profile = ({navigation}) => {

    const [isSetting, setSetting] = useState(false);
    const [modalLogoutVisible, setModalLogoutVisible] = useState(false);
    const [uid, setUID] = useState('');
    const [nama, setNama] = useState('');
    const [tanggalLahir, setTanggalLahir] = useState('2020-01-01');
    const [usia, setUsia] = useState('');
    const [noHP, setNoHP] = useState('');
    const [email, setEmail] = useState('');
    const [alamat, setAlamat] = useState('');
    const [namaGroup, setNamaGroup] = useState('');
    const [imgProfile, setImgProfile] = useState('');
    const [imgKTP, setImgKTP] = useState('');
    
    useEffect(() =>{

        getDetailAkun();

        // Handling Back press
        const backAction = () => {
            
            navigation.replace('Home');
            return true;
          };
      
          const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
          );
      
          return () => backHandler.remove();
    },[]);

    const getDetailAkun = async () => {
    
        const param = {
        };
    
        await Api.post('account/profile', param)
    
        .then(async (response) => {
          const metadata = response.data.metadata;
          const respon = response.data.response;
  
          if(metadata.status == 200){
  
            setUID(respon.user_id);
            setNama(respon.nama);
            setTanggalLahir(respon.tgl_lahir);
            setNoHP(respon.no_hp);
            setEmail(respon.email);
            setAlamat(respon.alamat);
            setUsia(respon.umur);
            //setUsia("");
            setImgKTP(respon.img_ktp);
            setNamaGroup(respon.nama_grup);
            setImgProfile(respon.img_profile);
            setImgKTP(respon.img_ktp);

          }else{
            Alert.alert(metadata.message);
          }
        })
        .catch((error) => {
          
          
        });
        
    };

    const modalLogout = (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalLogoutVisible}
            >
            <View style={styles.modal}>
                <View>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                        <Text style={styles.title}>Logout</Text>
                        
                        </View>
                        <View style={styles.modalBody}>
                        <Text style={styles.bodyText}>Apakah anda yakin ingin logout ?</Text>
                        </View>
                        <View style={styles.modalFooter}>
                        <View style={styles.divider}></View>
                        <View style={{flexDirection:"row-reverse",margin:10}}>
                            <TouchableOpacity style={{...styles.actions,backgroundColor:"#db2828"}} 
                            onPress={() => {
                                setModalLogoutVisible(!modalLogoutVisible);
                            }}>
                            <Text style={styles.actionText}>Tidak</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{...styles.actions,backgroundColor:"#21ba45"}}
                            onPress={() => {
                                setSetting(false);
                                setModalLogoutVisible(!modalLogoutVisible);
                                RepoUtil.RemoveValue('@session');
                                navigation.navigate("Login")
                            }}>
                            <Text style={styles.actionText}>Ya</Text>
                            </TouchableOpacity>
                        </View>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )

    return (
        <SafeAreaView style={styles.container}>
          <ImageBackground source={require('../../../img/bgprofile.png')} style={styles.image}>
            <View
                style={{
                    flexDirection:"row",
                    marginBottom:size.padding_default
                }}>
                    <TouchableOpacity
                        onPress={() => {
                          navigation.replace('Home');
                        }}>
                          <Image source={require('../../../img/ic_back_white.png')} 
                            style={{
                              width:size.icon_size,
                              height:size.icon_size,
                            }}/>
                    </TouchableOpacity>

                    <Text
                    style={{
                        flex:1,
                        fontSize:18,
                        color:'white',
                        marginLeft:size.padding_default,
                        marginRight:size.padding_default,
                    }}>Profile</Text>

                    <TouchableOpacity
                        onPress={() => {
                          
                            setSetting(!isSetting);
                        }}>
                          <Image source={require('../../../img/ic_setting_white.png')} 
                            style={{
                              width:size.icon_size,
                              height:size.icon_size,
                            }}/>
                    </TouchableOpacity>
            </View>  

            <ScrollView
                style={{
                    flex:1,
                }}
            >
                <Image 
                    source={ imgProfile != "" ?  {uri : imgProfile}: require('../../../img/placeholder.png')}
                    style={{
                        alignSelf:'center',
                        marginTop:size.padding_big,
                        width:140,
                        height:140,
                        borderRadius:70,
                    }}
                ></Image>

                <Text
                    style={styles.label}
                >Nama</Text>

                <Text
                    style={styles.valueLabel}
                >{nama}</Text>

                <Text
                    style={styles.label}
                >Tanggal Lahir</Text>

                <Text
                    style={styles.valueLabel}
                >{tanggalLahir}</Text>

                <Text
                    style={styles.label}
                >Usia</Text>

                <Text
                    style={styles.valueLabel}
                >{usia}</Text>

                <Text
                    style={styles.label}
                >No. HP</Text>

                <Text
                    style={styles.valueLabel}
                >{noHP}</Text>

                <Text
                    style={styles.label}
                >Email</Text>

                <Text
                    style={styles.valueLabel}
                >{email}</Text>

                <Text
                    style={styles.label}
                >Alamat</Text>

                <Text
                    style={styles.valueLabel}
                >{alamat}</Text>

                <Text
                    style={styles.label}
                >Nama Group</Text>

                <Text
                    style={styles.valueLabel}
                >{namaGroup}</Text>

                <Text
                    style={styles.label}
                >Foto KTP</Text>

                <Image 
                    source={ imgKTP != "" ? {uri: imgKTP} : require('../../../img/placeholder.png')}
                    style={{
                        alignSelf:'center',
                        marginTop:size.padding_big,
                        width: (win.width * 4 / 6),
                        height: (win.width * 2.5 / 6),
                    }}
                ></Image>

                <View
                    style={{
                        height:80,
                    }}
                ></View>

            </ScrollView>

            {/* Modal setting */}
            <Modal animationType="fade" transparent={true} visible={isSetting}>
                <View
                style={{
                    height: height,
                    marginTop:Platform.OS === 'android' ? 0 : 50,
                }}>

                    <TouchableOpacity
                        style={{
                            backgroundColor: 'rgba(0,0,0, 0.5)',
                            width:'100%',
                            height:'100%'
                        }}
                        onPress={()=>{
                            setSetting(!isSetting);
                        }}
                    ></TouchableOpacity>

                    <View
                        style={{
                            flexDirection:'column',
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            width: 160,
                            backgroundColor: 'white',
                            borderRadius:2,
                            padding:size.default_padding
                        }}
                    >
                        <TouchableOpacity
                            onPress={()=>{
                                
                                setSetting(false);
                                navigation.navigate('UbahProfile');
                            }}
                        >
                            <Text
                                style={{
                                    color: 'black',
                                    fontSize:17
                                }}
                            >
                                Ubah Profile
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                marginTop:12
                            }}

                            onPress={()=>{
                                
                                setSetting(false);
                                navigation.navigate('ChangePassword');
                            }}
                        >
                            <Text
                                style={{
                                    color: 'black',
                                    fontSize:17
                                }}
                            >
                                Ubah Password
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                marginTop:12,
                                marginBottom:6,
                            }}
                            onPress={()=>{
                                //setModalLogoutVisible(true);
                                Alert.alert("Konfirmasi","Apakah anda yakin ingin logout?", [
                                    {
                                      text: "Tidak",
                                      onPress: () => null,
                                      style: "cancel"
                                    },
                                    { text: "Ya", onPress: () => {
                                        
                                        setSetting(false);
                                        RepoUtil.RemoveValue('@session');
                                        navigation.navigate("Login")
                                    }}
                                  ]);
                            }}
                        >
                            <Text
                                style={{
                                    color: 'red',
                                    fontSize:17
                                }}
                            >
                                Logout
                            </Text>
                        </TouchableOpacity>

                    </View>
                
                </View>
            </Modal>

            {modalLogout}
          </ImageBackground>
        </SafeAreaView>
      );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
    },
    image: {
      flex: 1,
      resizeMode: "cover",
      padding: 18,
      flexDirection:'column',
      justifyContent:'flex-start',
    },
    modal:{
        backgroundColor:'rgba(0,0,0, 0.6)',
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainer:{
        backgroundColor:"#f9fafb",
        width:"80%",
        borderRadius:5
    },
    modalHeader:{
        
    },
    title:{
        fontWeight:"bold",
        fontSize:18,
        paddingLeft:15,
        paddingRight:15,
        paddingTop:8,
        color:"#000"
    },
    divider:{
        width:"100%",
        height:1,
        backgroundColor:"lightgray"
    },
    modalBody:{
        backgroundColor:"#f9fafb",
        paddingLeft:15,
        paddingRight:15,
        paddingTop:8,
        paddingBottom:8,
        paddingHorizontal:10
    },
    modalFooter:{
    },
    actions:{
        borderRadius:5,
        marginHorizontal:10,
        paddingLeft:15,
        paddingRight:15,
        paddingTop:6,
        paddingBottom:6,
    },
    actionText:{
        color:"#fff"
    },
    label:{
        color:'white',
        marginTop:size.padding_big,
        fontSize:17,
    },
    valueLabel:{
        color:'white',
        marginTop:size.padding_default,
        fontSize:22,
    },
  });
  

export default Profile;