import React, { useEffect, useState, useRef} from 'react';
import { 
    ScrollView, 
    TextInput, 
    StyleSheet, 
    Text, 
    View, 
    SafeAreaView,
    TouchableOpacity,
    Image,
    Alert,
    Dimensions,
    Platform,
 } from "react-native";
import Api from '../../api';
import RepoUtil from '../../helper/RepoUtil';
const size = require('../../Res/size');
const color = require('../../Res/color');
const win = Dimensions.get('window');
import {launchImageLibrary} from 'react-native-image-picker';
//import RNFS from 'react-native-fs';

const UbahProfile = ({navigation}) => {

    const [uid, setUID] = useState('');
    const [nama, setNama] = useState('');
    const [tanggalLahir, setTanggalLahir] = useState('');
    const [usia, setUsia] = useState('');
    const [noHP, setNoHP] = useState('');
    const [email, setEmail] = useState('');
    const [alamat, setAlamat] = useState('');
    const [namaGroup, setNamaGroup] = useState('');
    const [imgProfile, setImgProfile] = useState('');
    const [imgKTP, setImgKTP] = useState('');
    
    var imageName = '', imageFile = '', imageNameKTP = '', imageFileKTP = '';

    const [uploadImgProfile, setUploadImgProfile] = useState('');
    const [uploadFolderProfile, setUploadFolderProfile] = useState('');
    const [uploadImgKTP, setUploadImgKTP] = useState('');
    const [uploadFolderKTP, setUploadFolderKTP] = useState('');
    
    useEffect(() =>{

        getDetailAkun();
    }, []);

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
            setTanggalLahir(respon.tgl_lahir_format);
            setNoHP(respon.no_hp);
            setEmail(respon.email);
            setAlamat(respon.alamat);
            setUsia(respon.umur);
            setUsia("");
            setImgKTP(respon.img_ktp);
            setNamaGroup(respon.nama_grup);

          }else{
            Alert.alert(metadata.message);
          }
        })
        .catch((error) => {
          
          
        });
        
    };

    const getImage = () => {

        const options = {quality: 0.8, maxWidth: 720, maxHeight: 720}
        launchImageLibrary(options, (response) => {
            console.log('image data', response);
            if(response.didCancel || response.error){

                alert('Silahkan pilih gambar terlebih dahulu');
            } else {

                imageName = response.fileName
                imageFile = response;    
                onContinueFile();

            }
        })
    }

    const getImageKTP = () => {

        const options = {quality: 0.8, maxWidth: 720, maxHeight: 720}
        launchImageLibrary(options, (response) => {
            console.log('image ktp', response);
            if(response.didCancel || response.error){

                alert('Silahkan pilih gambar terlebih dahulu');
            } else {

                imageNameKTP = response.fileName;
                imageFileKTP = response;
                onContinueFileKTP();
            }
        })
    }

    const onContinueFile = async () => {
        //const formData = createFormData(posterFile);
        const data = new FormData();
        data.append('files', {
            name: imageName,
            type:"image/jpeg",
            uri: Platform.OS === 'android' ? imageFile.uri : imageFile.uri.replace('file://', '') 
        });
        data.append('filename',imageName);
        data.append('name','files');

        console.log('data request', data);
        Api.post('/account/change_foto_profil', data, 
        {
            headers: {
                'Content-Type':'application/x-www-form-urlencoded'
            }
        })
        .then((response) => {
            const metadata = response.data.metadata;
            const respon = response.data.response;

            if(metadata.status == 200){
  
                setUploadImgProfile(respon.nama_profil);
                setUploadFolderProfile(respon.folder_profil);
    
            }else{
                Alert.alert(metadata.message);
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const onContinueFileKTP = async () => {
        //const formData = createFormData(posterFile);
        const data = new FormData();
        data.append('files', {
            name: imageNameKTP,
            type:"image/jpeg",
            uri: Platform.OS === 'android' ? imageFileKTP.uri : imageFileKTP.uri.replace('file://', '') 
        });
        data.append('filename',imageNameKTP);
        data.append('name','files');

        console.log('data request', data);
        Api.post('/account/upload_foto_ktp', data, 
        {
            headers: {
                'Content-Type':'application/x-www-form-urlencoded'
            }
        })
        .then((response) => {
            //console.log(response.data);
            const metadata = response.data.metadata;
            const respon = response.data.response;

            if(metadata.status == 200){
  
                setUploadImgKTP(respon.nama_ktp);
                setUploadFolderKTP(respon.folder_ktp);
    
            }else{
                Alert.alert(metadata.message);
            }
            
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const simpanDetailAkun = async () => {
        
        const param = {
            nama:nama,
            no_hp:noHP,
            alamat:alamat,
            tgl_lahir:tanggalLahir,
            umur:usia,
            email:email,
            folder_profil:uploadFolderProfile,
            nama_profil:uploadImgProfile,
            folder_ktp:uploadFolderKTP,
            nama_ktp:uploadImgKTP,
        };
    
        await Api.post('account/process_profile', param)
    
        .then(async (response) => {
          const metadata = response.data.metadata;
          const respon = response.data.response;
  
          if(metadata.status == 200){
  
            Alert.alert(metadata.message);

          }else{
            Alert.alert(metadata.message);
          }
        })
        .catch((error) => {
          
          
        });
        
    };
    
    return (

        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.ScrollView}>

                <View>

                    <Image 
                        source={require('../../../img/placeholder.png')}
                        style={{
                            alignSelf:'center',
                            marginTop:size.padding_big,
                            position:'absolute',
                            width:140,
                            height:140,
                            borderRadius:70,
                        }}
                    ></Image>

                    <Image 
                        source={ imageFile }
                        style={{
                            alignSelf:'center',
                            marginTop:size.padding_big,
                            width:140,
                            height:140,
                            borderRadius:70,
                        }}
                    ></Image>

                    <TouchableOpacity
                        onPress={getImage}
                    >
                        <Image
                            source={require('../../../img/ic_camera_black.png')}
                            style={{
                                width:40,
                                height:40,
                                position:'absolute',
                                left:(win.width / 2) + 10,
                                bottom:2,
                            }}
                        ></Image>
                    </TouchableOpacity>
                </View>
                
                <Text
                    style={styles.label}
                >Nama</Text>

                <TextInput
                    value={nama}
                    style={styles.textInput}
                    onChangeText={(value) => setNama(value)}
                >

                </TextInput>

                <Text
                    style={styles.label}
                >Tanggal Lahir</Text>

                <TextInput
                    value={tanggalLahir}
                    style={styles.textInput}
                    onChangeText={(value) => setNama(value)}
                />

                <Text
                    style={styles.label}
                >Usia</Text>

                <TextInput
                    value={usia}
                    style={styles.textInput}
                    onChangeText={(value) => setNama(value)}
                />

                <Text
                    style={styles.label}
                >No. HP</Text>

                <TextInput
                    value={noHP}
                    style={styles.textInput}
                    onChangeText={(value) => setNama(value)}
                />

                <Text
                    style={styles.label}
                >Email</Text>

                <TextInput
                    value={email}
                    style={styles.textInput}
                    onChangeText={(value) => setNama(value)}
                />

                <Text
                    style={styles.label}
                >Alamat</Text>

                <TextInput
                    value={alamat}
                    style={styles.textInput}
                    onChangeText={(value) => setNama(value)}
                />

                <Text
                    style={styles.label}
                >Nama Group</Text>

                <TextInput
                    value={namaGroup}
                    style={styles.textInput}
                    onChangeText={(value) => setNama(value)}
                />

                <Text
                    style={styles.label}
                >Foto KTP</Text>

                <View>
                    
                    <Image 
                        source={ require('../../../img/placeholder.png')}
                        style={{
                            alignSelf:'center',
                            marginTop:size.padding_big,
                            width: (win.width * 4 / 6),
                            height: (win.width * 2.5 / 6),
                            position:'absolute',
                        }}
                    ></Image>

                    <Image 
                        source={ imageFileKTP }
                        style={{
                            alignSelf:'center',
                            marginTop:size.padding_big,
                            width: (win.width * 4 / 6),
                            height: (win.width * 2.5 / 6),
                        }}
                    ></Image>

                    <TouchableOpacity
                        onPress={getImageKTP}
                    >
                        <Image
                            source={require('../../../img/ic_camera_black.png')}
                            style={{
                                width:40,
                                height:40,
                                position:'absolute',
                                right:(win.width / 7.7),
                                bottom:2,
                            }}
                        ></Image>
                    </TouchableOpacity>
                    
                </View>

                <View 
                          style={{ 
                            width: '50%',
                            marginTop:40,
                            height: size.button_height, 
                            backgroundColor: '#C9A95F',
                            borderRadius: size.default_border,
                            borderColor: 'gray', 
                            alignSelf:'center',
                            marginBottom: 5,
                            
                          }}
                      >

                    <TouchableOpacity
                                style={{ 
                                alignSelf:'stretch',
                                height: '100%',
                                justifyContent:'center',
                                }}
                                onPress={() => {
                                    simpanDetailAkun();
                                }} 
                            >
                                <Text 
                                style={{
                                color: 'white',
                                fontSize: 16,
                                alignSelf:'center',
                                }}>
                                    Simpan</Text>
                    </TouchableOpacity>
                </View>    

                {/* footer */}
                <View
                    style={{height:50}}
                ></View>
            </ScrollView>
          
        </SafeAreaView>
        
      );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      padding:size.default_padding,
      backgroundColor:'white',
    },
    ScrollView:{
        padding:size.padding_big,
    },
    lable:{
        width: '100%',
        color: 'black',
        marginBottom: 5,
        borderWidth:0,
        fontSize:16,
    },
    lable2:{
        color: 'black',
        marginBottom: 5,
        borderWidth:0,
        fontSize:14,
        textAlign:'center'
    },
    textOtp:{
        flex:1,
        borderBottomWidth: 1,
        marginLeft:size.padding_default,
        marginRight:size.default_padding,
        fontSize:40,
        textAlign:'center',
    },
    textInputPassword: {
        width: '100%',
        color: 'black',
        borderColor: 'grey',
        borderWidth: 1, 
        borderRadius: size.border_radius,
        flexDirection:'row',
        height: size.content_height,
    },
    touachableButton: {
        height: 40,
        width: 35
    },
    buttonImage: {
        resizeMode: 'contain',
        height: '100%',
        width: '100%',
    },
    label:{
        color:'black',
        marginTop:size.padding_big,
        fontSize:17,
    },
    valueLabel:{
        color:'black',
        marginTop:size.padding_default,
        fontSize:22,
    },
    textInput:{
        color:'black',
        fontSize:20,
        backgroundColor:color.grey,
        padding: size.default_padding,
        marginTop:size.default_padding,
    },
  });
  

export default UbahProfile;