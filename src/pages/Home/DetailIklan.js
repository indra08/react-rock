import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    Dimensions,
    Image,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Alert,
} from 'react-native';
import Api from '../../api';
const size = require('../../Res/size');
const color = require('../../Res/color');
const win = Dimensions.get('window');

const DetailIklan = ({route, navigation}) => {

    const [imgURL, setImgURL] = useState('');
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');

    const { id } = route.params;

    const getDetailIklan = async () => {
  
        const params = {
            id: id
        };

        await Api.post('/iklan/detail_iklan', params)
          .then( async (response) => {
              const metadata = response.data.metadata;
              const respon = response.data.response;
    
              if(metadata.status == 200){
    
                  setTitle(respon.title);
                  setText(respon.text);
                  setImgURL(respon.img_url);
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

    useEffect(() => {
      
        getDetailIklan();
  
      }, []);

    return (
        <SafeAreaView 
            style={styles.container}
        >
            <ScrollView
                style={styles.scrollView}
            >
                <Image
                  source={{uri: imgURL}}
                  style={{
                      width:win.width,
                      height: (win.width * 3 / 5),
                      resizeMode:'cover',
                  }}
                ></Image>

                <Text
                    style={{
                        color:'black',
                        marginTop:size.padding_big,
                        marginLeft:size.padding_big,
                        marginRight:size.padding_big,
                        fontSize:20,
                        fontWeight:'bold',
                    }}
                >{title}</Text>

                <Text
                    style={{
                        color:'black',
                        margin:size.padding_big,
                        fontSize:17,
                    }}
                >{text}</Text>

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
    },
    scrollView: {
        backgroundColor:'white'
      },
  });
  

export default DetailIklan
