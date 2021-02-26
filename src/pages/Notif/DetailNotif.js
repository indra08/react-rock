import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    Dimensions,
    Image,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    BackHandler,

} from 'react-native';
import Api from '../../api';
const size = require('../../Res/size');
const color = require('../../Res/color');
const win = Dimensions.get('window');

const DetailNotif = ({route, navigation}) => {

    const [imgURL, setImgURL] = useState('');
    const [title, setTitle] = useState('');
    const [notif, setNotif] = useState('');
    const [date, setDate] = useState('');
    const [hour, setHour] = useState('');

    const { id } = route.params;

    const getDetailNotif = async () => {
  
        const params = {
            id: id
        };

        await Api.post('/notification/detail_notif', params)
          .then( async (response) => {
              const metadata = response.data.metadata;
              const respon = response.data.response;
    
              if(metadata.status == 200){
    
                  setTitle(respon.title);
                  setNotif(respon.notif);
                  setDate(respon.date);
                  setHour(respon.hour);
                  setImgURL(respon.img_url);
              }
            })
            .catch((error) => {
              console.log(error);
            });
      };

    useEffect(() => {
      
        getDetailNotif();

        // Handling Back press
        const backAction = () => {
            navigation.navigate('Notif');
            return true;
          };
      
          const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
          );
      
          return () => backHandler.remove();
  
      }, []);

    return (
        <SafeAreaView 
            style={styles.container}
        >
            <ScrollView
                style={styles.scrollView}
            >

                <View
                    style={{
                        flexDirection:'row'
                    }}
                >
                    <Text
                        style={{
                            flex:0.6,
                            color:'black',
                            fontSize:16,
                            fontWeight:'bold',
                        }}
                    >{title}</Text>

                    <Text
                        style={{
                            flex:0.4,
                            color:'black',
                            fontSize:13,
                            textAlign:'right',
                        }}
                    >
                        {date +" "+ hour}
                    </Text>
                </View>

                <Text
                    style={{
                        color:'black',
                        margin:size.padding_big,
                        fontSize:17,
                    }}
                >{notif}</Text>

                <Image
                  source={{uri: imgURL}}
                  style={{
                      width:win.width,
                      height: (win.width * 3 / 5),
                      resizeMode:'cover',
                  }}
                ></Image>

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      padding:size.padding_default,
    },
    scrollView: {
        backgroundColor:'white'
      },
  });
  

export default DetailNotif
