import { Text, View, StyleSheet, TouchableOpacity, FlatList, Modal, Button, TextInput } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import Api_Url from "./Api_Url";

export default App=()=>{
  const [data,setData]=useState(null);
  const [modalVisible, setModalVisible]=useState(false);
  const [selectedItem, setSelectedItem]=useState(null);
  const [inputValue, setInputValue]=useState("");

  const HandleSave=()=>{
    fetch(Api_Url + "/Departamentos/spGuardarDepartamento",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        id:selectedItem.id,
        nombre:inputValue
      })
    })
    .then(response=>{
      if(!response.ok){
        throw new Error("Network response was not ok");
      }
      CloseModal();
      return console.log(response.json());
    })
    .catch(error=>{
      console.error("Hubo un problema al guardar", error);
    })
  }

  const HandleItemClick=item=>{
    setSelectedItem(item);
    setModalVisible(true);
  }

  const CloseModal=()=>{
    setModalVisible(false);
    setSelectedItem(null);
    setInputValue("");
  }

  const HandleInputChange=text=>{
    setInputValue(text);
  }
  
  useEffect(()=>{
    fetch(Api_Url + "/Departamentos/spConsultarDepartamentos")
    .then(response=>{
      if(!response.ok){
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data=>{
      setData(data);
    })
    .catch(error=>{
      console.error("There was a problem with the fetch operation", error);
    });
  },[]);

  return(
    <View style={styles.container}>
      <Text style={styles.titleView}>Departamentos</Text>
      <FlatList
        data={data}
        renderItem={({item})=>(
          <TouchableOpacity
            style={styles.touchableItem}
            onPress={()=>HandleItemClick(item)}>
              <Text style={styles.itemText}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item=>item.id}>
      </FlatList>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={CloseModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Detalles</Text>
              {/* <Text>{selectedItem?.nombre}</Text> */}
              <TextInput
                style={styles.input}
                placeholder="..."
                defaultValue={selectedItem?.nombre}
                onChangeText={HandleInputChange}></TextInput>
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    onPress={CloseModal}
                    style={[styles.button, styles.buttonClose]}>
                      <Text style={styles.buttonText}>Cerrar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonSave]}
                    onPress={HandleSave}>
                      <Text style={styles.buttonText}>Guardar</Text>
                  </TouchableOpacity>
                </View>
            </View>
          </View>
      </Modal>
    </View>
  )
}

const styles=StyleSheet.create({
  container:{
    marginTop:"10%",
    marginLeft:"2%",
    marginRight:"2%"
  },
  itemText:{
    fontSize:20
  },
  touchableItem:{
    borderWidth: 1,
    borderColor:"blue",
    borderRadius: 8,
    padding:10,
    marginVertical:3
  },
  centeredView:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    marginTop:22
  },
  modalView:{
    width:"80%",
    margin:20,
    backgroundColor:"white",
    borderRadius:20,
    padding:35,
    alignItems:"center",
    shadowColor:"#000",
    shadowOffset:{
      width:0,
      height:2
    },
    shadowOpacity:0.25,
    shadowRadius:4,
    elevation:4
  },
  input:{
    height:40,
    width:"100%",
    borderColor:"blue",
    borderWidth:1,
    borderRadius:8,
    marginTop:10,
    marginBottom:10,
    paddingHorizontal:10
  },
  modalTitle:{
    fontSize:20
  },
  titleView:{
    fontSize:20,
    textAlign:"center"
  },
  buttonsContainer:{
    flexDirection:"row"
  },
  button:{
    paddingVertical:10,
    paddingHorizontal:20,
    borderRadius:5,
    width:"40%"
  },
  buttonText:{
    color:"white",
    fontWeight:"bold",
    textAlign:"center"
  },
  buttonClose:{
    marginRight:"4%",
    backgroundColor:"red"
  },
  buttonSave:{
    backgroundColor:"blue"
  }
});
