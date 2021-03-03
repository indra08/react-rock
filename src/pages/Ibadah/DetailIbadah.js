import React, { useState, useEffect } from 'react';
import { 
  TextInput,
  StyleSheet,
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  Dimensions,
  ScrollView,
  FlatList,
  ImageBackground,
  Modal,
} from "react-native";

// import custom
import Api from '../../api';
const size = require('../../Res/size');
const color = require('../../Res/color');
const win = Dimensions.get('window');

const DetailIbadah = ({route, navigation}) => {
    
    const [namaIbadah, setNamaIbadah] = useState('');
    const [tanggal, setTanggal] = useState('');
    const [jam, setJam] = useState('');
    const [kategori, setKategori] = useState('');
    const [kursi, setKursi] = useState('');
    const [tempat, setTempat] = useState('');
    const [flagHadir, setFlagHadir] = useState('');
    const [flagConfirm, setFlagConfirm] = useState('');
    const [pesanKursi, setPesanKursi] = useState(false);
    const [pesanKursiNama, setPesanKursiNama] = useState('');
    
    const {id} = route.params;

    useEffect(() => {
        
        getDetailIbadah();
    }, []);

    const getDetailIbadah = async () => {

        const param = {
          id: id,
        };
    
        await Api.post('/jadwal/detail_jadwal', param)
          .then( async (response) => {
            const metadata = response.data.metadata;
            const respon = response.data.response;
    
            if(metadata.status == 200){
                
                setNamaIbadah(respon.nama_ibadah);
                setTanggal(respon.tanggal);
                setJam(respon.jam);
                setTempat(respon.tempat);
    
            }else{
                
            }
          })
          .catch((error) => {
            console.log(error);
          });
      };
  
    const modalPesanKursi = (
            
        <Modal animationType="fade" transparent={true} visible={pesanKursi}>
            <TouchableOpacity
                style={{
                    backgroundColor:'rgba(52, 52, 52, 0.8)',
                    flex:1,
                    flexDirection:'column-reverse',
                }}
                onPress={()=>{
                    setPesanKursi(false);
                }}
            >
                <View style={styles.contentPesanKursi} >

                    <ScrollView>

                        <Text
                            style={{
                                color:'white',
                                fontSize:18,
                            }}
                        >
                            Nama
                        </Text>

                        <View style={styles.textInput}>
                            <TextInput
                                underlineColorAndroid="transparent"
                                value={pesanKursiNama}
                                onChangeText={(value) => setPesanKursiNama(value)}
                                style={{ 
                                    
                                    paddingRight: size.default_padding,
                                    paddingLeft: size.default_padding,
                                    color: 'black',
                                }}
                            />
                        </View>

                    </ScrollView>
                    
                </View>
            </TouchableOpacity>
        </Modal>
    );

    return (

        <SafeAreaView style={styles.safeArea}>

            <ImageBackground source={require('../../../img/bgprofile.png')} style={styles.imageBackground}>
                <View style={styles.container}>

                    <View
                        style={{
                            flexDirection:'column',
                            marginTop:size.padding_big,
                        }}
                    >                

                        <View
                            style={{
                                backgroundColor:'white',
                                padding:size.default_padding,
                                borderRadius: size.radius_default,
                                marginTop:size.padding_big,
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
                                style={{flex : 0.4, }}
                                >Nama Ibadah</Text>
                                <Text style={{flex : 0.6, fontSize:size.font_title,}}>{": "+ namaIbadah}</Text>
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
                                style={{flex : 0.4, }}
                                >Tanggal</Text>
                                <Text style={{flex : 0.6, fontSize:size.font_title,}}>{": "+ tanggal}</Text>
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
                                style={{flex : 0.4, }}
                                >Jam</Text>
                                <Text style={{flex : 0.6, fontSize:size.font_title,}}>{": "+ jam}</Text>
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
                                style={{flex : 0.4, }}
                                >Kategori</Text>
                                <Text style={{flex : 0.6, fontSize:size.font_title,}}>{": "+ kategori}</Text>
                            </View>

                            <View
                                style={{
                                flexDirection:'row',
                                marginLeft:size.default_padding,
                                marginRight:size.default_padding,
                                marginTop:size.default_padding,
                                marginBottom:size.med_padding,
                                }}
                            >
                                <Text
                                style={{flex : 0.4, }}
                                >Tempat</Text>
                                <Text style={{flex : 0.6, fontSize:size.font_title,}}>{": "+ tempat}</Text>
                            </View>
                        </View> 
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
                                    setPesanKursi(true);
                                }} 
                            >
                                <Text 
                                style={{
                                color: 'white',
                                fontSize: 16,
                                alignSelf:'center',
                                }}>
                                    Pesan Kursi</Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>

            {modalPesanKursi}
          
        </SafeAreaView>
      );
};

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor:color.grey,
      
    },
    container: {
      flex:1,
      flexDirection:"column",
      paddingLeft:size.padding_big,
      paddingRight:size.padding_big,
    },
    imageBackground: {
        resizeMode: "cover",
        flex:1,
    },
    contentPesanKursi:{
        backgroundColor:color.dark_grey,
        flexDirection:'column',
        flex:0.5,
        padding:size.padding_big,
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
  

export default DetailIbadah;