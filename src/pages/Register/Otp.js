import React, { useEffect, useState, useRef} from 'react';
import { 
    ScrollView, 
    TextInput, 
    StyleSheet, 
    Text, 
    View, 
    SafeAreaView,
    TouchableOpacity,
    BackHandler,
    Alert,
 } from "react-native";
import Api from '../../api';
import RepoUtil from '../../helper/RepoUtil';
const size = require('../../Res/size');

const Otp = ({route, navigation}) => {

    const [digit1, setDigit1] = useState('');
    const [digit2, setDigit2] = useState('');
    const [digit3, setDigit3] = useState('');
    const [digit4, setDigit4] = useState('');
    const [isProcess, setProcess] = useState(false);
    
    var timer = 0;
    const [timerString, setTimerString] = useState('');
    const [isTimerStop, setTimerStop] = useState(true);

    const ref_input1 = useRef();
    const ref_input2 = useRef();
    const ref_input3 = useRef();
    const ref_input4 = useRef();

    const { no_hp, password } = route.params;

    const countDown = ()=>{

        setInterval(function() {

            if(timer > 0){

                timer = timer - 1;
                secondPass();
            }
        }, 1000);
    };

    function secondPass() {

        var minutes = Math.floor(timer / 60);  // To Determine The Minutes 

        var remSeconds = timer % 60; 

        var hasil = (minutes < 10 ? '0' + minutes : minutes)+':' + (remSeconds < 10 ? '0' + remSeconds : remSeconds);
        console.log(hasil);
        if(minutes == 0 && remSeconds == 0 ){
            setTimerStop(true);
            setTimerString("Kirim ulang");
        }else{
            setTimerStop(false);
            setTimerString(hasil);
        }
        
    }

    function resetTimer (){
        timer = 0;
    }

    function startTimer(lama){

        timer = lama;
    }

    useEffect(() =>{

        // Handlimng back action
        const backAction = () => {
            Alert.alert("Konfirmasi","Apakah anda yakin ingin kembali?", [
              {
                text: "Cancel",
                onPress: () => null,
                style: "cancel"
              },
              { text: "YES", onPress: () => {
                    navigation.replace('Login');
              }}
            ]);
            return true;
          };
       
          const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
          );

          // Fungsi utama
          startTimer(300);
          countDown();

          return () => backHandler.remove();
    }, []);

    const otpAction = async () => {
    
        var otp = digit1+''+digit2+''+digit3+''+digit4;
        setProcess(true);
  
        const param = {
              type             :'register',
              otp              :otp,
              nohp             :no_hp,
        };
    
        await Api.post('auth/otp_validation', param)
    
        .then(async (response) => {
          const metadata = response.data.metadata;
          const respon = response.data.response;
          setProcess(false);
  
          if(metadata.status == 200){
  
            signInEmail();
          }else{
            Alert.alert(metadata.message);
          }
        })
        .catch((error) => {
          
          setProcess(false);
        });
        
    };

    const resendOtpAction = async () => {
    
        setProcess(true);
  
        const param = {
              nohp             :no_hp,
        };
    
        await Api.post('auth/kirim_ulang_otp', param)
    
        .then(async (response) => {
          const metadata = response.data.metadata;
          const respon = response.data.response;
          setProcess(false);
  
          if(metadata.status == 200){
  
            startTimer(300);
          }else{
            Alert.alert(metadata.message);
          }
        })
        .catch((error) => {
          
          setProcess(false);
        });
        
    };

    const signInEmail = async() => {

        setProcess(true);
        const param = {
          no_hp   : no_hp,
          password: password
        };
    
        await Api.post('auth/login', param)
    
          .then(async (response) => {
            const metadata = response.data.metadata;
            const respon = response.data.response;
  
            if(metadata.status == 200){
  
              const dataSession = {
                id_jemaat           :respon.id_jemaat,
                token               :respon.token,
                nama                :respon.nama,
                flag_profil_lengkap :respon.flag_profil_lengkap
              }
  
              // menyimpan session
              RepoUtil.StoreAsObject('@session', dataSession);
              navigation.replace('Home');
            }else{
              Alert.alert(metadata.message);
            }
          })
          .catch((error) => {
            
            setProcess(false);
          });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.ScrollView}>
                <Text 
                    style={styles.lable}
                        >Masukkan OTP</Text>

                <View
                    style={{
                        flex:1,
                        marginTop:'35%',
                        flexDirection:'row',
                    }}
                >
                    <TextInput
                        style={styles.textOtp}
                        keyboardType='number-pad'
                        value={digit1}
                        placeholder='0'
                        maxLength={1}
                        onKeyPress={(event) => {

                        if(event.nativeEvent.key != 'Backspace'){
                            ref_input2.current.focus();
                        }
                        }}
                        ref={ref_input1}
                        onChangeText={(value) => setDigit1(value)}
                    />

                    <TextInput
                        style={styles.textOtp}
                        keyboardType='number-pad'
                        value={digit2}
                        ref={ref_input2}
                        placeholder='0'
                        onKeyPress={(event) => {

                            if(event.nativeEvent.key === 'Backspace'){
                                ref_input1.current.focus();
                            }else{
                                ref_input3.current.focus();
                            }
                        }}
                        maxLength={1}
                        onChangeText={(value) => setDigit2(value)}
                    />

                    <TextInput
                        style={styles.textOtp}
                        keyboardType='number-pad'
                        value={digit3}
                        ref={ref_input3}
                        placeholder='0'
                        onKeyPress={(event) => {

                            if(event.nativeEvent.key === 'Backspace'){
                                ref_input2.current.focus();
                            }else{
                                ref_input4.current.focus();
                            }
                        }}
                        maxLength={1}
                        onChangeText={(value) => setDigit3(value)}
                    />

                    <TextInput
                        style={styles.textOtp}
                        keyboardType='number-pad'
                        value={digit4}
                        ref={ref_input4}
                        placeholder='0'
                        onKeyPress={(event) => {

                            if(event.nativeEvent.key === 'Backspace'){
                                ref_input3.current.focus();
                            }
                        }}
                        maxLength={1}
                        onChangeText={(value) => setDigit4(value)}
                    />
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
                                    otpAction();
                                }} 
                            >
                                <Text 
                                style={{
                                color: 'white',
                                fontSize: 16,
                                alignSelf:'center',
                                }}>
                                    SELESAI</Text>
                    </TouchableOpacity>
                </View>

                <View
                    style={{
                        flex:1,
                        flexDirection:'row',
                        justifyContent:'center',
                        marginTop:size.padding_big,
                    }}
                >
                    <Text 
                    style={styles.lable2}
                        >Belum dapat OTP? </Text>

                    <TouchableOpacity
                        onPress={()=>{
                            if(isTimerStop){
                                resendOtpAction();
                            }
                        }}
                    >
                        <Text 
                        style={styles.lable2, {color:'red'}}
                            >{timerString}</Text>
                    </TouchableOpacity>
                    
                </View>
                    
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
        
    },
    lable:{
        width: '100%',
        color: 'black',
        marginBottom: 5,
        borderWidth:0,
        fontSize:16,
        textAlign:'center'
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
  });
  

export default Otp;