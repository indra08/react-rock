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
} from "react-native";

// import custom
import Api from '../../api';
const size = require('../../Res/size');
const color = require('../../Res/color');
const win = Dimensions.get('window');
import DropDownPicker from 'react-native-dropdown-picker';

const Tiket = ({navigation}) => {
    
    const [listTiket, setListTiket] = useState([]);
    const [selectedTiket, setSelectedTiket] = useState('all');
    const [dinamicHeight, setDinamicHeight] = useState(0);

    useEffect(() => {
      

    }, []);

    return (

        <SafeAreaView style={styles.safeArea}>

          <View style={styles.container}>

              <DropDownPicker
                            items={[
                              {value : "all", label : "Semua Tiket", }
                              ,{value : "ibadah", label : "Tiket Ibadah"}
                              ,{value : "event", label : "Tiket Event"}
                            ]}
                            containerStyle={{height: 45}}
                            style={{
                                backgroundColor: 'white',
                                marginTop:size.small_padding,
                            }}
                            defaultValue={ selectedTiket}
                            placeholder={"- Pilih -"}
                            itemStyle={{
                                justifyContent: 'flex-start',
                            }}
                            dropDownStyle={{backgroundColor: 'white'}}
                            onChangeItem={item => {

                                console.log(item.value);
                                setSelectedTiket(item.value);
                            }}
                            onOpen={() => {
                                
                                setDinamicHeight(45 * 2);
                            }}
                            onClose={() => {
                                setDinamicHeight(0);
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
  

export default Tiket;