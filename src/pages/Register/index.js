import React, { useState, useEffect } from 'react';
import { Image ,ImageBackground, TextInput, StyleSheet, Text, View, ScrollView, Alert } from "react-native";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { get } from 'react-native/Libraries/Utilities/PixelRatio';
import { StackActions } from "react-navigation";
import RepoUtil from '../../helper/RepoUtil';
import Api from '../../api';

const size = require('../../Res/size');

const Register = ({navigation}) => {

    const [username, setUsername] = useState('');
    const [namaLengkap, setNamaLengkap] = useState('');
    const [nomorHp, setNomorHp] = useState('');
    const [alamat, setAlamat] = useState('');
    const [password, setPassword] = useState('');
    const [isSecure, setSecure] = useState(true);
    const [repassword, setRePassword] = useState('');
    const [isReSecure, setReSecure] = useState(true);
    const [session, setSession] = useState(null);
    const [isProcess, setProcess] = useState(false);

    const loadSession = async () => {
      
      const dataRepo = await RepoUtil.GetAsObject('@session');
      setSession(dataRepo);
      
      if(dataRepo != null){
          // Jika sudah login
          setNamaLengkap(session.nama);
      }
    };

    function makeid(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }

    const daftarAction = async () => {
      
      var today = new Date();
      var timestamp = today.getDate()+''+today.getMonth()+''+today.getFullYear()+''+today.getHours()+''+today.getMinutes()+''+today.getSeconds()+''+today.getMilliseconds();
      var uid = makeid(28 - timestamp.length) + '' + timestamp;
      
      setProcess(true);

      const param = {
            uid               :uid,
            nama              :namaLengkap,
            umur              :"200",
            no_hp             :nomorHp,
            alamat            :alamat,
            password          :password,
            retype_password   :repassword,
      };
  
      await Api.post('auth/register', param)
  
      .then(async (response) => {
        const metadata = response.data.metadata;
        const respon = response.data.response;
        setProcess(false);

        if(metadata.status == 200){

          getDataOTP();
        }else{
          Alert.alert(metadata.message);
        }
      })
      .catch((error) => {
        
        setProcess(false);
      });
      
    };

    const getDataOTP = async () => {
      
      setProcess(true);

      await Api.get('setting/get_status_otp')
  
      .then(async (response) => {
        const metadata = response.data.metadata;
        const respon = response.data.response;
        setProcess(false);

        if(metadata.status == 200){
          
          var status_otp = respon.status_otp;
          if(status_otp == 1){

            navigation.navigate('Otp', {no_hp:nomorHp, password:password});
          }else{

            Alert.alert(
              'Pesan',
              'Pendaftaran telah berhasil',
              [
                { text: 'OK', onPress: () => {
                  navigation.goBack();
                }}
              ],
              { cancelable: false }
            );
          }
         
        }else{
          Alert.alert(metadata.message);
        }
      })
      .catch((error) => {
        
        setProcess(false);
      });
      
    };

    useEffect(() => {
    
      loadSession();
    }, []);

    return (
        <ScrollView style={styles.scrollView}>
              <View style={styles.container}>

                    <View style={{alignItems:'center', marginTop: 40,}}>
                            <Text 
                                style={styles.lable}
                            >Nama Lengkap</Text>

                            <TextInput
                              style={styles.textInput}
                              value={namaLengkap}
                              onChangeText={(value) => setNamaLengkap(value)}
                            />
                    </View>

                    <View style={{ alignItems:'center', marginTop: 20,}}>
                            <Text 
                                style={styles.lable}
                            >No. HP</Text>

                            <TextInput
                              style={styles.textInput}
                              value={nomorHp}
                              keyboardType='phone-pad'
                              onChangeText={(value) => setNomorHp(value)}
                            />
                    </View>

                    <View style={{ alignItems:'center', marginTop: 20,}}>
                            <Text 
                                style={styles.lable}
                            >Alamat</Text>

                            <TextInput
                              multiline={true}
                              style={styles.textArea}
                              value={alamat}
                              onChangeText={(value) => setAlamat(value)}
                            />
                    </View>

                    <View style={{alignItems:'center', marginTop: 20,}}>

                        <Text 
                                style={styles.lable}
                            >Password</Text>
                      
                            
                        <View style={styles.textInputPassword}>
                             
                              <TextInput
                                underlineColorAndroid="transparent"
                                value={password}
                                secureTextEntry={isSecure}
                                onChangeText={(value) => setPassword(value)}
                                style={{ 
                                  flex: 0.97,
                                  paddingRight: size.default_padding,
                                  paddingLeft: size.default_padding,
                                  color: 'black',
                                }}
                              />
                              
                              <TouchableOpacity
                                activeOpacity={0.8}
                                style={styles.touachableButton}
                                onPress={() => setSecure(!isSecure)}>
                                <Image
                                  source={
                                    isSecure
                                      ? require('../../../img/matabuka.png')
                                      : require('../../../img/matatutup.png')
                                  }
                                  style={styles.buttonImage}
                                />
                              </TouchableOpacity>
                      </View>
                    </View>

                    <View style={{alignItems:'center', marginTop: 20,}}>

                        <Text 
                                style={styles.lable}
                            >Ketik Ulang Password</Text>
                      
                            
                        <View style={styles.textInputPassword}>
                             
                            <TextInput
                               underlineColorAndroid="transparent"
                               value={repassword}
                               secureTextEntry={isReSecure}
                               onChangeText={(value) => setRePassword(value)}
                               style={{ 
                                 flex: 0.97,
                                 paddingRight: size.default_padding,
                                 paddingLeft: size.default_padding,
                                 color: 'black',
                               }}
                             />
                             
                             <TouchableOpacity
                               activeOpacity={0.8}
                               style={styles.touachableButton}
                               onPress={() => setReSecure(!isReSecure)}>
                               <Image
                                 source={
                                   isReSecure
                                     ? require('../../../img/matabuka.png')
                                     : require('../../../img/matatutup.png')
                                 }
                                 style={styles.buttonImage}
                               />
                             </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{
                            flex:0.65,  
                            alignItems:'center'}}>

                      <View 
                          style={{ 
                            width: '50%',
                            height: size.button_height, 
                            backgroundColor: '#C9A95F',
                            borderRadius: size.default_border,
                            borderColor: 'gray', 
                            marginTop: 20,
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
                              daftarAction();
                            }} 
                          >
                            <Text 
                            style={{
                              color: 'white',
                              fontSize: 16,
                              alignSelf:'center',
                              }}>
                                SIMPAN</Text>
                          </TouchableOpacity>
                    </View>
                    </View>
              </View>
        </ScrollView> 
      );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor:'white',
  },
  container: {
    flex: 1,
    flexDirection: "column"
  },
  lable:{
    width: size.width_content,
    color: 'black',
    marginBottom: 5,
  },
  textInput: {
    width: size.width_content,
    padding: size.medium_padding,
    color: 'black',
    borderColor: 'grey',
    borderWidth: 1, 
    borderRadius: size.border_radius,
  },
  textInputPassword: {
    width: size.width_content,
    
    color: 'black',
    borderColor: 'grey',
    borderWidth: 1, 
    borderRadius: size.border_radius,
    flexDirection:'row',
    height: size.content_height,
  },
  textInput2: {
    flex: 1,
    padding: size.medium_padding,
    color: 'black',
  },
  textArea: {
    width: size.width_content,
    height: 90,
    justifyContent: "flex-start",
    padding: size.medium_padding,
    color: 'black',
    borderColor: 'grey',
    borderWidth: 1, 
    borderRadius: size.border_radius,
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
});

export default Register;