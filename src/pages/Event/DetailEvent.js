import React, {useEffect, useState} from 'react'
import { 
    View, 
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Modal,
    Alert,
    TextInput,
 } from 'react-native';

//Import Custom
import Api from '../../api';
const size = require('../../Res/size');
const color = require('../../Res/color');
const win = Dimensions.get('window');
import SwiperFlatList from 'react-native-swiper-flatlist';

const DetailEvent = ({route, navigation}) => {

    const [gambar, setGambar] = useState([]);
    const [namaEvent, setNamaEvent] = useState('');
    const [tanggal, setTanggal] = useState('');
    const [jam, setjam] = useState('');
    const [tempat, setTempat] = useState('');
    const [pesanNama, setPesanNama] = useState('');
    const [pesanSekarang, setPesanSekarang] = useState(false);

    const { id } = route.params;

    useEffect(() => {
        
        getDetailEvent();
    }, []);

    const getDetailEvent = async () => {

        const param = {
          id : id,
        }; 
    
        await Api.post('/jadwal/detail_jadwal_event', param)
          .then( async (response) => {
              const metadata = response.data.metadata;
              const respon = response.data.response;
    
              if(metadata.status == 200){
    
                setNamaEvent(respon.nama_event);
                setTanggal(respon.tanggal);
                setjam(respon.jam);
                setTempat(respon.tempat);

                var dataImage = [];
                dataImage.push(
                    {
                      img_url  :respon.img_event,
                    }
                  );
    
                setGambar(dataImage);
              }
            })
            .catch((error) => {
              console.log(error);
            });
    };

    const saveDaftarEvent = async () => {

        const param = {
          id_jadwal : id,
          nama      : pesanNama,
        }; 
    
        await Api.post('/ticket/order_event', param)
          .then( async (response) => {
              const metadata = response.data.metadata;
              const respon = response.data.response;
    
              if(metadata.status == 200){
    
                Alert.alert("Info", metadata.message, [
                    { text: "Ok", onPress: () => {
                        resetField();
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

    function resetField(){

        setPesanNama('');
    }

    const renderItemGambar = ({item}) => {
        return (
  
          <TouchableOpacity
              onPress={()=>{
  
              }}

              style={{
                width: win.width,
                height:(win.width *4/6),
              }}
            >
              <View style={{
                flex:1,
                padding:size.default_padding,
                flexDirection:'row',
                marginLeft:size.padding_default,
                marginRight:size.padding_default,
              }}>
                
                  <Image 
                    source={{uri: item.img_url}} 
                    style={{
                      flex:1,
                      resizeMode:'contain',
                      borderRadius: size.radius_default,
                    }}
                  />
                
              </View>
          </TouchableOpacity>
        );
    };

    const modalPesanSekarang = (
            
        <Modal animationType="slide" transparent={true} visible={pesanSekarang}>
            
            <View
                style={{
                    flex:1, 
                    flexDirection:'column', 
                    backgroundColor:'rgba(52, 52, 52, 0.8)',
                }}
            >
                <TouchableOpacity
                style={{
                    
                    flex:0.5,
                    
                }}
                onPress={()=>{

                    setPesanSekarang(false);
                }}
                />

                <View style={styles.contentPesan} >

                    <ScrollView
                        style={{
                            paddingTop: size.padding_big,
                            paddingLeft: size.padding_big,
                            paddingRight: size.padding_big,
                        }}
                    >

                        <Text
                            style={{
                                color:'black',
                                fontSize:24,
                                fontWeight:'bold',
                            }}
                        >Daftar {namaEvent}</Text>

                        <View
                            style={{
                                flexDirection:'row',
                                marginTop:size.padding_default,
                            }}
                        >

                            <Text
                                style={{
                                    flex:0.2
                                }}
                            >Tanggal</Text>
                            <Text style={{flex : 0.8, fontSize:size.font_title2,}}>{": "+ tanggal}</Text>
                        </View>

                        <View
                            style={{
                                flexDirection:'row',
                                marginTop:size.small_padding,
                            }}
                        >

                            <Text
                                style={{
                                    flex:0.2
                                }}
                            >Jam</Text>
                            <Text style={{flex : 0.8, fontSize:size.font_title2,}}>{": "+ jam}</Text>
                                
                        </View>

                        <View
                            style={{
                                flexDirection:'row',
                                marginTop:size.small_padding,
                            }}
                        >

                            <Text
                                style={{
                                    flex:0.2
                                }}
                            >Tempat</Text>
                            <Text style={{flex : 0.8, fontSize:size.font_title2,}}>{": "+ tempat}</Text>
                                
                        </View>

                        <View style={{height:1, width:'100%', backgroundColor:color.dark_grey, marginTop:size.padding_big}}></View>

                        <Text style={{ color:'black', fontSize:18, marginTop: size.padding_big}}>
                            Nama
                        </Text>

                        <View style={styles.textInput}>
                            <TextInput
                                underlineColorAndroid="transparent"
                                value={pesanNama}
                                onChangeText={(value) => setPesanNama(value)}
                                style={styles.textInputValue}
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

                                       setPesanSekarang(false); 
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
                                        
                                        if(pesanNama == ''){

                                            Alert.alert("Peringatan", "Nama Harap diisi");
                                            return;
                                        }

                                        Alert.alert("Konfirmasi", "Apakah anda yakin ingin melakukan pendaftaran?", [
                                            { text: "Ok", onPress: () => {
                                                setPesanSekarang(false); 
                                                saveDaftarEvent();
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
                                        Pesan Kursi</Text>
                            </TouchableOpacity>
                
                        </View>

                    </ScrollView>
                    
                </View>

            </View>                
        </Modal>
    );

    return (

        <SafeAreaView style={styles.saveArea}>

            <View
                style={{
                    flex:1,
                    flexDirection:'column',
                }}
            >

                <View
                    style={{
                        backgroundColor:color.dark_grey_soft,
                    }}
                >
                    <SwiperFlatList
                        index={0}
                        autoplay
                        autoplayDelay={4}
                        autoplayLoop
                        data={gambar}
                        renderItem={renderItemGambar}
                        showPagination
                        paginationDefaultColor={'white'}
                        paginationActiveColor={color.dark_gold}
                        paginationStyleItem={{
                            height:10,
                            width:10,
                            borderRadius:10,
                        }}
                        style={{
                            
                        }}
                    />
                </View>

                <ScrollView
                    style={{margin:size.padding_big}}
                >

                    <Text
                        style={{
                            color:'black',
                            fontSize:24,
                            fontWeight:'bold',
                        }}
                    >{namaEvent}</Text>

                    <View
                        style={{
                            flexDirection:'row',
                            marginTop:size.padding_default,
                        }}
                    >

                        <Text
                            style={{
                                flex:0.2
                            }}
                        >Tanggal</Text>
                        <Text style={{flex : 0.8, fontSize:size.font_title2,}}>{": "+ tanggal}</Text>
                    </View>

                    <View
                        style={{
                            flexDirection:'row',
                            marginTop:size.small_padding,
                        }}
                    >

                        <Text
                            style={{
                                flex:0.2
                            }}
                        >Jam</Text>
                        <Text style={{flex : 0.8, fontSize:size.font_title2,}}>{": "+ jam}</Text>
                            
                    </View>

                    <View
                        style={{
                            flexDirection:'row',
                            marginTop:size.small_padding,
                        }}
                    >

                        <Text
                            style={{
                                flex:0.2
                            }}
                        >Tempat</Text>
                        <Text style={{flex : 0.8, fontSize:size.font_title2,}}>{": "+ tempat}</Text>
                            
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
                                    
                                    setPesanSekarang(true);
                                }} 
                            >
                                <Text 
                                style={{
                                color: 'white',
                                fontSize: 16,
                                alignSelf:'center',
                                }}>
                                    Pesan Sekarang</Text>
                        </TouchableOpacity>
                    </View>                    
                </ScrollView>
                {modalPesanSekarang}
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    saveArea:{
        flex: 1,
        backgroundColor: color.grey,
    },
    contentPesan:{
        backgroundColor:'white',
        flexDirection:'column',
        flex:0.5,
        padding:size.padding_big,
    },
    textInput: {
        marginTop:size.small_padding,
        width: '100%',
        color: 'black',
        backgroundColor: color.grey,
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

export default DetailEvent;
