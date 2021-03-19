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
} from 'react-native';

// default import
const size = require('../../Res/size');
const color = require('../../Res/color');
const win = Dimensions.get('window');
const {width, height} = win;
import RepoUtil from '../../helper/RepoUtil';
import Api from '../../api';

const DetailTiket = ({route, navigation}) => {

    const [nama, setNama] = useState('');
    const [namaIbadah, setNamaIbadah] = useState('');
    const [tanggal, setTanggal] = useState('');
    const [jam, setJam] = useState('');
    const [kategori, setKategori] = useState('');
    const [kursi, setKursi] = useState('');
    const [url, setURL] = useState('');
    const [cancel, setCancel] = useState('');

    const {nobukti, paramNama, paramNamaIbadah, paramTanggal, paramJam, paramKategori, paramKursi, paramURL, flag} = route.params;

    useEffect(() => {

        if(nobukti != null){

            if(flag == 'ibadah'){

                getDetailTiket();    
            }else{

                getDetailTiketEvent();
            }
            
        }else{

            setNama(paramNama);
            setNamaIbadah(paramNamaIbadah);
            setTanggal(paramTanggal);
            setJam(paramJam);
            setKategori(paramKategori);
            setKursi(paramKursi);
            setURL(paramURL);
        }

        
        
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
    }, []);

    const getDetailTiket = async () => {

        const param = {
          
            nobukti: nobukti,
        };
    
        await Api.post('/ticket/detail_ticket', param)
          .then( async (response) => {

            const metadata = response.data.metadata;
            const respon = response.data.response;
    
            if(metadata.status == 200){
           
                setNama(respon.nama);
                setNamaIbadah(respon.nama_ibadah);
                setTanggal(respon.tanggal);
                setJam(respon.jam);
                setKategori(respon.tempat);
                setKursi(respon.kursi);
                setURL(respon.qr_code);
                setCancel(respon.flag_tombol_cancel);
    
            }else{   
                
            }
            
          })
          .catch((error) => {
            console.log(error);
        });
    };

    const getDetailTiketEvent = async () => {

        const param = {
          
            nobukti: nobukti,
        };
    
        await Api.post('/ticket/detail_ticket_event', param)
          .then( async (response) => {

            const metadata = response.data.metadata;
            const respon = response.data.response;
    
            if(metadata.status == 200){
           
                setNama(respon.nama);
                setNamaIbadah(respon.nama_event);
                setTanggal(respon.tanggal);
                setJam(respon.jam);
                setKategori(respon.tempat);
                setKursi('-');
                setURL(respon.qr_code);
                setCancel(respon.flag_tombol_cancel);
    
            }else{   
                
            }
            
          })
          .catch((error) => {
            console.log(error);
        });
    };

    const saveCancelBooking = async () => {

        const param = {
          
            nobukti: nobukti,
        };
    
        await Api.post('/ticket/cancel_ticket', param)
          .then( async (response) => {

            const metadata = response.data.metadata;
            const respon = response.data.response;
    
            if(metadata.status == 200){
           
                Alert.alert("Info", metadata.message, [
                    { text: "Ok", onPress: () => {
                        
                        navigation.replace('Home', {
                            screen: 'Tiket',
                          });
                    }}
                  ]);
    
            }else{ 
                
                Alert.alert("Info", metadata.message, [
                    { text: "Ok", onPress: () => {
                      
                    }}
                  ]);
                
            }
            
          })
          .catch((error) => {
            console.log(error);

            Alert.alert("Info", error, [
                { text: "Ok", onPress: () => {
                    
                }}
            ]);
        });
    };

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
                        }}>Detail Tiket Kursi</Text>
            </View>  

            <ScrollView
                style={{
                    flex:1,
                }}
            >

                <View
                    style={{
                        color:'white',
                        backgroundColor:'#86213A',
                        marginTop: size.padding_big,
                        borderTopRightRadius: size.default_border,
                        borderTopLeftRadius: size.default_border,
                        textAlign:'center',
                    }}
                >

                    <Text
                        style={{
                            color:'white',
                            padding:size.padding_default,
                            textAlign:'center',
                        }}
                    >
                        IBADAH
                    </Text>
                </View>

                <View
                    
                    style={{
                        backgroundColor:'white',
                        padding:size.default_padding,
                        borderBottomLeftRadius: size.radius_default,
                        borderBottomRightRadius: size.radius_default,
                    }}
                >

                    <View
                            style={{
                            flexDirection:'row',
                            marginLeft:size.default_padding,
                            marginRight:size.default_padding,
                            marginTop:size.default_padding,
                            }}
                        >
                            <Text
                            style={{flex : 0.3, }}
                            >Nama</Text>
                            <Text style={{flex : 0.7, fontSize:size.font_title,}}>{": "+ nama}</Text>
                    </View>

                    <View
                            style={{
                            flexDirection:'row',
                            marginLeft:size.default_padding,
                            marginRight:size.default_padding,
                            marginTop:size.default_padding,
                            }}
                        >
                            <Text
                            style={{flex : 0.3, }}
                            >Nama Ibadah</Text>
                            <Text style={{flex : 0.7, fontSize:size.font_title,}}>{": "+ namaIbadah}</Text>
                    </View>

                    <View
                            style={{
                            flexDirection:'row',
                            marginLeft:size.default_padding,
                            marginRight:size.default_padding,
                            marginTop:size.default_padding,
                            }}
                        >
                            <Text
                            style={{flex : 0.3, }}
                            >Tanggal</Text>
                            <Text style={{flex : 0.7, fontSize:size.font_title,}}>{": "+ tanggal}</Text>
                    </View>

                    <View
                            style={{
                            flexDirection:'row',
                            marginLeft:size.default_padding,
                            marginRight:size.default_padding,
                            marginTop:size.default_padding,
                            }}
                        >
                            <Text
                            style={{flex : 0.3, }}
                            >Jam</Text>
                            <Text style={{flex : 0.7, fontSize:size.font_title,}}>{": "+ jam}</Text>
                    </View>

                    <View
                            style={{
                            flexDirection:'row',
                            marginLeft:size.default_padding,
                            marginRight:size.default_padding,
                            marginTop:size.default_padding,
                            }}
                        >
                            <Text
                            style={{flex : 0.3, }}
                            >Kategori</Text>
                            <Text style={{flex : 0.7, fontSize:size.font_title,}}>{": "+ kategori}</Text>
                    </View>

                    <View
                            style={{
                            flexDirection:'row',
                            marginLeft:size.default_padding,
                            marginRight:size.default_padding,
                            marginTop:size.default_padding,
                            marginBottom:size.default_padding,
                            }}
                        >
                            <Text
                            style={{flex : 0.3, }}
                            >Kursi</Text>
                            <Text style={{flex : 0.7, fontSize:size.font_title,}}>{": "+ kursi}</Text>
                    </View>
                </View>    

                <Image
                    source ={{uri: url}}
                    style={{
                        marginTop:40,
                        width:win.width - win.width / 3,
                        height:win.width - win.width / 3,
                        alignSelf:'center'
                    }}
                />      

                <View
                    style={{flexDirection:'row', justifyContent:'center', marginBottom:size.padding_big}}
                >

                    { cancel == '1' && 

                        <TouchableOpacity
                            style={{ 
                            width: '40%',
                            marginTop:40,
                            justifyContent:'center',
                            backgroundColor: '#AFAFB0',
                            borderRadius: size.default_border,
                            borderColor: 'gray', 
                            marginRight:'10%',
                            alignSelf:'center',
                            marginBottom: 5,
                            padding:size.padding_default,
                            }}
                            onPress={() => {

                                Alert.alert("Konfirmasi", "Apakah anda yakin ingin membatalkan pendaftaran?", [
                                    { text: "Ok", onPress: () => {
                                        
                                        saveCancelBooking();
                                    }},
                                    { text: "Batal", onPress: () => {
                                        
                                    }}
                                  ]);
                            }} 
                            >

                            <Text 
                                style={{
                                color: 'white',
                                fontSize: 16,
                                alignSelf:'center',
                                }}>
                                    Batal</Text>
                            </TouchableOpacity>
                    }

                    <TouchableOpacity
                            style={{ 
                            width: '40%',
                            marginTop:40,
                            
                            justifyContent:'center',
                            backgroundColor: '#C9A95F',
                            borderRadius: size.default_border,
                            borderColor: 'gray', 
                            alignSelf:'center',
                            marginBottom: 5,
                            padding:size.padding_default,
                            }}
                            onPress={() => {
                                
                                navigation.navigate('Home', {
                                    screen: 'Tiket',
                                    });
                            }} 
                        >
                            <Text 
                            style={{
                            color: 'white',
                            fontSize: 16,
                            alignSelf:'center',
                            }}>
                                Selesai</Text>
                    </TouchableOpacity>
                
                </View>
            </ScrollView>
          </ImageBackground>
        </SafeAreaView>
    )
}

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
    textInput: {
        marginTop:size.small_padding,
        width: '100%',
        color: 'black',
        borderColor: 'grey',
        borderWidth: 1, 
        backgroundColor:'white',
        borderRadius: size.border_radius,
        flexDirection:'row',
        height: size.content_height,
    },
  });

export default DetailTiket
