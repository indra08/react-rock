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
  Alert,
  Image,
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
    const [pesanDenah, setPesanDenah] = useState(false);
    const [pesanKursiNama, setPesanKursiNama] = useState('');
    const [pesanKursiUsia, setPesanKursiUsia] = useState(0);
    const [listKursi, setListKursi] = useState([]);
    const [listIsiKursi, setListIsiKursi] = useState([]);
    const [selectedKategoriKursi, setSelectedKategoriKursi] = useState("0");
    const [selectedIsiKursi, setSelectedIsiKursi] = useState("0");
    const [dinamicHeight, setDinamicHeight] = useState(0);
    const [dinamicHeight1, setDinamicHeight1] = useState(0);
    const [gambarDenah, setGambarDenah] = useState('');
    
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

    const getInfoProfile = async () => {

        const param = {
          
        };
    
        await Api.post('/account/profile', param)
          .then( async (response) => {
            const metadata = response.data.metadata;
            const respon = response.data.response;
    
            if(metadata.status == 200){
                
                var profileLengkap = respon.flag_profil_lengkap;
                if(profileLengkap == 1){

                    setPesanKursi(false);
                    doPesanKursi();
                }else{

                    Alert.alert("Profil belum lengkap", "Silahkan melengkapi profil anda terlebih dahulu", [
                        { text: "Ok", onPress: () => {
                              navigation.navigate('Profile');
                        }}
                      ]);

                }
    
            }else{
                
            }
          })
          .catch((error) => {
            console.log(error);
        });
    };

    const doPesanKursi = async () => {

        const param = {
          
            id_jadwal: id,
            id_denah: selectedKategoriKursi,
        };
    
        await Api.post('/jadwal/get_kursi_denah', param)
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

                setGambarDenah(respon.img_denah);
                
                respon.dropdown_kursi.map((item)=>{
        
                data.push(
                    {
                        value    : item.id_kursi+ "",
                        label    : item.kode_kursi,
                        }
                    );
                });
    
            }else{
                
                Alert.alert("Pesan", metadata.message, [
                    { text: "Ok", onPress: () => {
                          
                        
                    }}
                  ]);
            }

            setListIsiKursi(data);
            setPesanDenah(true);
            
          })
          .catch((error) => {
            console.log(error);
        });
    };

    const doPesanTiket = async () => {

        const param = {
          
            id_jadwal: id,
            id_denah: selectedKategoriKursi,
            umur: pesanKursiUsia,
            id_kursi: selectedIsiKursi,
            nama: pesanKursiNama,

        };
    
        await Api.post('/ticket/order', param)
          .then( async (response) => {

            const metadata = response.data.metadata;
            const respon = response.data.response;
    

            if(metadata.status == 200){

                Alert.alert("Pesan", metadata.message, [
                    { text: "Ok", onPress: () => {
                          
                        navigation.navigate('DetailTiket',{

                            paramNama : respon.nama,
                            paramNamaIbadah : respon.nama_ibadah,
                            paramTanggal :  respon.tanggal,
                            paramJam : respon.jam,
                            paramKategori : respon.tempat,
                            paramKursi : respon.kursi,
                            paramURL : respon.qr_code

                        });
                    }}
                  ]);
            }else{

                Alert.alert("Pesan", metadata.message, [
                    { text: "Ok", onPress: () => {
                          
                        setPesanDenah(true);     
                    }}
                  ]);
            }
            
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
                                keyboardType="number-pad"
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

                                       setPesanKursi(false); 
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
                                        
                                        if(pesanKursiNama == ''){

                                            Alert.alert("Peringatan", "Nama Harap diisi");
                                            return;
                                        }

                                        if(pesanKursiUsia == '' || pesanKursiUsia == '0'){
                                            
                                            Alert.alert("Peringatan", "Usia Harap diisi");
                                            return;
                                        }

                                        if(selectedKategoriKursi == '0'){
                                            
                                            Alert.alert("Peringatan", "Kategori kursi harap dipilih");
                                            return;
                                        }

                                        setPesanKursi(false); 
                                        getInfoProfile();
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

    const modalDenahKursi = (
            
        <Modal animationType="slide" transparent={true} visible={pesanDenah}>
            
            <View
                style={{flex:1, flexDirection:'column', backgroundColor:'rgba(52, 52, 52, 0.8)',}}
            >
                <TouchableOpacity
                style={{
                    
                    flex:0.35,
                    
                }}
                onPress={()=>{
                    setPesanDenah(false);
                }}
                />

                <View style={styles.contentPesanDenah} >

                    <ScrollView>

                        <Text style={{ color:'black', fontSize:18}}>
                            Denah
                        </Text>

                        <View
                            style={{
                                marginTop:size.default_padding,
                            }}
                        >

                            <Image
                                source={{uri:gambarDenah}}
                                style={{
                                    width:'100%',
                                    height: (win.width * 3 / 5),
                                    resizeMode:'stretch',
                                }}
                            />
                        </View>

                        <View
                            marginBottom={dinamicHeight1}
                        >

                            <Text style={{ color:'black', fontSize:18, marginTop:size.padding_big}}>
                                Pilih Kursi
                            </Text>

                            <DropDownPicker
                                items={listIsiKursi}
                                containerStyle={{height: 50}}
                                style={{
                                    backgroundColor: color.grey,
                                    marginTop:size.default_padding,
                                }}
                                defaultValue={ listIsiKursi.length > 0 ? selectedIsiKursi : false}
                                placeholder={"- Pilih -"}
                                itemStyle={{
                                    justifyContent: 'flex-start',
                                }}
                                dropDownStyle={{backgroundColor: color.grey}}
                                onChangeItem={item => {

                                    console.log(item.value);
                                    setSelectedIsiKursi(item.value);
                                }}
                                onOpen={() => {
                                    
                                    setDinamicHeight1(45 * 3);
                                }}
                                onClose={() => {
                                    setDinamicHeight1(0);
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

                                       setPesanDenah(false);
                                       setPesanKursi(true); 
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
                                        
                                        if(selectedIsiKursi == '0'){
                                            
                                            Alert.alert("Peringatan", "Kursi harap dipilih");
                                            return;
                                        }
                                        
                                        setPesanDenah(false); 
                                        doPesanTiket();
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

            {modalDenahKursi}
          
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
    contentPesanDenah:{
        backgroundColor:'white',
        flexDirection:'column',
        flex:0.65,
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