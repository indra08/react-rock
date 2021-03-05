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
import DropDownPicker from 'react-native-dropdown-picker';

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
    const [pesanKursiUsia, setPesanKursiUsia] = useState(0);
    const [listKursi, setListKursi] = useState([]);
    const [selectedKategoriKursi, setSelectedKategoriKursi] = useState("0");
    const [dinamicHeight, setDinamicHeight] = useState(0);
    
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

    const getKategoriKursi = async (usia) => {

        const param = {
            id_jadwal   : id,
            umur        : usia,
        };
    
        await Api.post('/jadwal/dropdown_denah', param)
          .then( async (response) => {
            const metadata = response.data.metadata;
            const respon = response.data.response;
    
            var data = [];
            data.push(
            {
                value       : "0",
                label       : "- Pilih -",
                selected    : true
                }
            );

            if(metadata.status == 200){
                
                respon.map((item)=>{
        
                data.push(
                    {
                        value    : item.id_denah+ "",
                        label    : item.nama_denah,
                        }
                    );
                });
    
            }else{
                
            }

            setListKursi(data);
            setSelectedKategoriKursi("0");
          })
          .catch((error) => {
            console.log(error);
          });
    };
  
    const modalPesanKursi = (
            
        <Modal animationType="slide" transparent={true} visible={pesanKursi}>
            
            <View
                style={{flex:1, flexDirection:'column', backgroundColor:'rgba(52, 52, 52, 0.8)',}}
            >
                <TouchableOpacity
                style={{
                    
                    flex:0.5,
                    
                }}
                onPress={()=>{
                    setPesanKursi(false);
                }}
                />

                <View style={styles.contentPesanKursi} >

                    <ScrollView>

                        <Text style={{ color:'white', fontSize:18}}>
                            Nama
                        </Text>

                        <View style={styles.textInput}>
                            <TextInput
                                underlineColorAndroid="transparent"
                                value={pesanKursiNama}
                                onChangeText={(value) => setPesanKursiNama(value)}
                                style={styles.textInputValue}
                            />
                        </View>

                        <Text style={{ color:'white', fontSize:18, marginTop:size.padding_big}}>
                            Usia
                        </Text>

                        <View style={styles.textInput}>

                            <TextInput
                                underlineColorAndroid="transparent"
                                value={pesanKursiUsia}
                                onChangeText={(value) => {

                                    setPesanKursiUsia(value);
                                    getKategoriKursi(value);
                                    
                                }}
                                style={styles.textInputValue}
                            />
                        </View>

                        <View
                            marginBottom={dinamicHeight}
                        >

                            <Text style={{ color:'white', fontSize:18, marginTop:size.padding_big}}>
                                Kategori Kursi
                            </Text>

                            <DropDownPicker
                                items={listKursi}
                                containerStyle={{height: 45}}
                                style={{
                                    backgroundColor: 'white',
                                    marginTop:size.small_padding,
                                }}
                                defaultValue={ listKursi.length > 0 ? selectedKategoriKursi : false}
                                placeholder={"- Pilih -"}
                                itemStyle={{
                                    justifyContent: 'flex-start',
                                }}
                                dropDownStyle={{backgroundColor: 'white'}}
                                onChangeItem={item => {

                                    console.log(item.value);
                                    setSelectedKategoriKursi(item.value);
                                }}
                                onOpen={() => {
                                    
                                    setDinamicHeight(45 * (listKursi.length - 1));
                                }}
                                onClose={() => {
                                    setDinamicHeight(0);
                                }}
                            />
                        </View>

                        <View
                            style={{flexDirection:'row', justifyContent:'center', marginBottom:size.padding_big}}
                        >

                            <TouchableOpacity
                                    style={{ 
                                    width: '40%',
                                    marginTop:40,
                                    justifyContent:'center',
                                    backgroundColor: '#AFAFB0',
                                    borderRadius: size.default_border,
                                    borderColor: 'gray', 
                                    alignSelf:'center',
                                    marginBottom: 5,
                                    padding:size.padding_default,
                                    }}
                                    onPress={() => {
                                        
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

                            <TouchableOpacity
                                    style={{ 
                                    width: '40%',
                                    marginTop:40,
                                    marginLeft:'10%',
                                    justifyContent:'center',
                                    backgroundColor: '#C9A95F',
                                    borderRadius: size.default_border,
                                    borderColor: 'gray', 
                                    alignSelf:'center',
                                    marginBottom: 5,
                                    padding:size.padding_default,
                                    }}
                                    onPress={() => {
                                        
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

                    </ScrollView>
                    
                </View>

            </View>                
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
    textInputValue:{ 
        width:'100%',
        paddingRight: size.default_padding,
        paddingLeft: size.default_padding,
        color: 'black',
    }
  });
  

export default DetailIbadah;