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
    FlatList,
 } from 'react-native';

//Import Custom
import Api from '../../api';
const size = require('../../Res/size');
const color = require('../../Res/color');
const win = Dimensions.get('window');
import SwiperFlatList from 'react-native-swiper-flatlist';

var selectedPart = 0;

const DetailRenungan = ({route, navigation}) => {

    const [title, setTitle] = useState('');
    const [subTitle, setSubTitle] = useState('');
    const [text, setText] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [listPart, setListPart] = useState([]);

    const { id } = route.params;

    useEffect(() => {
        
        selectedPart = 0;
        getListPart();
    }, []);

    const getListPart = async () => {

        const param = {
          id : id,
        }; 
    
        await Api.post('/renungan/get_part_renungan', param)
          .then( async (response) => {
              const metadata = response.data.metadata;
              const respon = response.data.response;
    
              if(metadata.status == 200){
    
                var part = respon.part_renungan;

                var data = [];
                var i = 0;
                part.map((item)=>{
                
                  data.push(
                    {
                      id        : item.id_detail,
                      part      : item.part,
                      selected  : selectedPart == i ? true :false,
                    }
                  );

                  if(i == 0) {
                    
                    getDetailRenungan(item.id_detail);
                  }

                  i ++;
    
                });
    
                setListPart(data);
              }
            })
            .catch((error) => {
              console.log(error);
            });
      };

      const getDetailRenungan = async (id_detail) => {

        const param = {
          id_header : id,
          id_detail : id_detail,
        }; 
    
        await Api.post('/renungan/detail_renungan', param)
          .then( async (response) => {
              const metadata = response.data.metadata;
              const respon = response.data.response;
    
              if(metadata.status == 200){

                    setTitle(respon.title);            
                    setSubTitle(respon.sub_title);
                    setText(respon.text);
                    setImgUrl(respon.img_url);          
              }
            })
            .catch((error) => {
              console.log(error);
            });
      };

      const renderItem = ({item, index}) => {

        return (

          <TouchableOpacity 
                style={{
                    width: win.width / listPart.length,
                    height:40,
                }}
                onPress={() => {

                    listPart[selectedPart].selected = false;
                    selectedPart = index;
                    var part = listPart;
                    var data = [];
                    setListPart(data);
                    var i = 0;

                    part.map((items)=>{
                    
                        data.push(
                            {
                            id        : items.id,
                            part      : items.part,
                            selected  : selectedPart == i ? true :false,
                            }
                        );

                        i ++;
        
                    });
        
                    setListPart(data);
                    getDetailRenungan(item.id);
            }}>
                    
                <View
                    style={{
                        flexDirection:'column',
                        padding:size.default_padding,
                        alignItems:'center',
                    }}
                >

                    <Text
                        style={{
                            color: item.selected ? '#C9A95F' : 'black',
                        }}
                    >
                        {item.part}
                    </Text>

                </View>
          </TouchableOpacity>
          
        );
      };

    return (
        <SafeAreaView style={styles.saveArea}>

            {/* Tittle */}
            <View
                style={{
                    flexDirection:"row",
                    marginBottom:size.padding_big,
                    marginLeft:size.padding_big,
                    marginRight:size.padding_big,
                }}>
                    <TouchableOpacity
                        onPress={() => {
                          navigation.goBack();
                        }}>
                          <Image source={require('../../../img/ic_back_white.png')} 
                            style={{
                              width:size.icon_size,
                              height:size.icon_size,
                              tintColor:'black',
                            }}/>
                    </TouchableOpacity>

                    <Text
                    style={{
                        flex:1,
                        fontSize:18,
                        color:'black',
                        marginLeft:size.padding_default,
                        marginRight:size.padding_default,
                    }}>{title}</Text>
            </View>

            {/* Bagian Part */}
            <FlatList
                data={listPart}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                style={{
                    flexGrow:0,
                }}
            />

            <Image
                style={{
                    width:'100%',
                    height:win.width * 2 / 4,
                    resizeMode:'cover'
                }}
                source={{uri:imgUrl}}
            />

            <View
                style={{
                    flex:1,
                    flexDirection:'column',
                }}
            >

                <ScrollView
                    style={{margin:size.padding_big}}
                >

                    <Text
                        style={{
                            color:'black',
                            fontSize:14,
                            marginTop:size.padding_big,
                        }}
                    >{subTitle}</Text>

                    <Text
                        style={{
                            color:'black',
                            fontSize:14,
                            marginTop:size.padding_big,
                        }}
                    >{text}</Text>
                </ScrollView>
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    saveArea:{
        flex: 1,
        backgroundColor: color.grey,
    },
});

export default DetailRenungan;
