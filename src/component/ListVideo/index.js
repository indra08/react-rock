import React from 'react';
import {Image, StyleSheet, Text, Dimensions,View, TouchableOpacity, Linking} from 'react-native';

const win = Dimensions.get('window');

const ListVideo = ({title, img_url, link, id}) => {
    return (
      <TouchableOpacity style={styles.container}
      onPress={() => {
        Linking.openURL(link)
      }}>
        <Image source={{uri: img_url}} style={styles.image}/>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
    );
  };
  
  export default ListVideo;

  const styles = StyleSheet.create({
    container: {
      flex:1,
      flexDirection: "column",
      backgroundColor: 'white',
      marginTop:16,
    },
    image:{
        width:'100%',
        height: (win.width *2/4),
        resizeMode:'stretch',
    },
    title: {
      fontSize: 14,
      color: 'black',
      width: '100%',
      paddingTop:2,
      paddingLeft:4,
      paddingRight:4,
      paddingBottom:8,
    },
    
  });
  