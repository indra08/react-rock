import React, { useState, useEffect } from 'react';
import { 
  Image,
  StyleSheet,
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  Dimensions,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";

// import custom
import Api from '../../api';
const size = require('../../Res/size');
const color = require('../../Res/color');
const win = Dimensions.get('window');

import ListVideo from "../../component/ListVideo";
var offset = 0;
var onProcess = false;

const Video = ({navigation}) => {
    
    const [video, setVideo] = useState([]);
    const [length, setLength] = useState(10);
    const [isLast, setLast] = useState(false);
    

    useEffect(() => {
      
      onProcess = false;
      offset = 0;
      getListVideo();
    }, []);

    const getListVideo = async () => {
  
      onProcess = true;
      console.log("1: " + offset);
      const param = {
        start: offset,
        limit: length,
      };

      await Api.post('/video/list_video', param)
        .then( async (response) => {
          const metadata = response.data.metadata;
          const respon = response.data.response;

          if(metadata.status == 200){

            var dataVideo = [];
            respon.map((item)=>{
            
              dataVideo.push(
                {
                  id       :item.id,
                  img_url  :item.img_url,
                  link     :item.link,
                  title    :item.title
                }
              );
            });

            setVideo(offset == 0 ? dataVideo : [...video, ...dataVideo]);
            offset = (dataVideo.length != 0 ? (offset + dataVideo.length) : offset);
            console.log("2: " + offset);
            setLast(dataVideo.length != length ? true : false);
            
          }else{
            setLast(true);
          }

          onProcess = false;
        })
        .catch((error) => {
          console.log(error);
          onProcess = false;
        });
    };

    const renderItem = ({item}) => {
      return (
        <ListVideo
          key={item.id}
          title={item.title}
          img_url={item.img_url}
          link={item.link}
          id={item.id}
        />
      );
    };

    const loadMore = async() => {
      
      if(isLast === false && !onProcess){
          await getListVideo();
      }
    }

    const renderFooter = () => {
      return (
        // Footer View with Loader
        <View style={styles.footer}>
          {onProcess ? (
            <ActivityIndicator
              color="black"
              style={{margin: 15}} />
          ) : null}
        </View>
      );
    };

    return (

        <SafeAreaView style={styles.safeArea}>

          <View style={styles.container}>

          <FlatList
                data={video}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                onEndReached={loadMore}
                ListFooterComponent={renderFooter}
                style={{
                  flexGrow:1,
                  flex:1,
                }}
              />
          </View>
        </SafeAreaView>
      );
};

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      flexDirection: "column",
      
    },
    container: {
      flex:1,
      flexDirection:"column",
      paddingLeft:size.padding_big,
      paddingRight:size.padding_big,
    }
  });
  

export default Video;