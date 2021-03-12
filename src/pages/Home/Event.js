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
  TextInput,
} from "react-native";

// import custom
import Api from '../../api';
const size = require('../../Res/size');
const color = require('../../Res/color');
const win = Dimensions.get('window');

const Event = ({navigation}) => {

  const [listEvent, setListEvent] = useState([]);
  var offset = 0;
  const [length, setLength] = useState(5);
  const [isLast, setLast] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
      
  }, []);

  return (

      <SafeAreaView style={styles.safeArea}>

        <View style={styles.container}>

            <View
                style={{
                    
                    flexDirection:'row',
                    backgroundColor:color.dark_grey_soft,
                    padding:10,
                    borderRadius:size.radius_default,
                    marginTop:size.padding_default
                }}
            >
                <Image
                    style={{
                        width:size.icon_size,
                        height:size.icon_size,
                    }}
                    source={require('../../../img/ic_search_gold.png')}
                ></Image>

                <TextInput
                    placeholder="Cari Event yang Sedang Berlangsung"
                    value={search}
                    style={{
                        marginLeft:size.padding_default,
                    }}
                    onChangeText={(value) => setSearch(value)}
                    keyboardType="web-search"
                    onSubmitEditing={() =>{
                        
                    }}
                />
            </View>            
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
  

export default Event;