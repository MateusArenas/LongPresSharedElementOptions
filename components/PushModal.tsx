import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, TouchableHighlight, SafeAreaView, StyleProp, ViewStyle, useWindowDimensions, TouchableOpacity } from "react-native";
import { BlurView } from 'expo-blur'
import Collapsible from 'react-native-collapsible';

import * as Animatable from 'react-native-animatable';
import { Ionicons } from "@expo/vector-icons";
import { useDebounce, useDebounceEffect, useDebounceHandler } from "../hooks/useDebounce";

interface PushModalProps {
  onShow: () => any
  onDimiss: () => any
  contentContainerstyle?: StyleProp<ViewStyle>
  options: Array<any>
}

const PushModal: React.FC<PushModalProps> = React.forwardRef(({ 
  children, onShow, onDimiss, contentContainerstyle, options=[], padding,
  timing=200
}, ref) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [coords, setCoords] = useState({ bottom: 0, left: 0, right: 0 });


  React.useEffect(() => {
    if (!collapsed) {
      OptionsAnimationRef?.current?.transitionTo(
        { bottom: 0, left: 0, right: 0 }, timing
      )
    }
  }, [collapsed])


  const { height: screenHeight, width: screenwidth } = useWindowDimensions()

  const OptionsAnimationRef = React.useRef<Animatable.View>();

  React.useImperativeHandle<any, any>(ref, () => ({
    close,
    open
  }));

  async function close () {
    OptionsAnimationRef?.current?.transitionTo(coords, timing)
    setCollapsed(true)
    useDebounceHandler(setModalVisible, timing+100)(false)
  }

  async function open (ref, posKey="left") {
    setModalVisible(true)
    useDebounceHandler(setCollapsed, timing)(false)
    
    OptionsAnimationRef.current?.pulse(timing)
    
    ref?.current?.measure?.((c, y, width, height, pageX, pageY) => {

      const coords = { 
        bottom:((screenHeight-pageY)-height) -padding, left: 0, right: 0,
        ...{[posKey]: ((screenwidth-pageX)-width) -padding }
      }

      setCoords(coords)
      OptionsAnimationRef.current?.transition(coords, coords, timing)
    })
          
    
  }

  return (
      <Modal
            onDismiss={() => {
                console.log('dimis')
                onDimiss?.()
                // elementRef?.current?.setNativeProps?.({
                //   style: { opacity: 1 }
                // })
              }}
              onShow={() => {
                console.log('show')
                onShow?.()
                // elementRef?.current?.setNativeProps?.({
                //   style: { opacity: 0 }
                // })
            }}
            animationType={'fade'}
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                Alert.alert("Modal has been closed.");
            }}
        >
            <BlurView style={[styles.centeredView, { flex: 1 }, contentContainerstyle]} intensity={50} tint={'dark'} >
                <Pressable style={{ position: 'absolute', height: '100%', width: '100%', }} onPress={close} />
                    <Animatable.View ref={OptionsAnimationRef}  duration={400} >
                          <View style={{ padding }} >
                          {children}
                          </View>
                    </Animatable.View>
                    <View style={{ width: '100%'}}>
                          <Collapsible collapsed={collapsed} 
                              style={[{ width: '100%',}]}
                              // renderChildrenCollapsed
                              enablePointerEvents

                              duration={timing}
                          >
                          <View style={{ margin: 10, borderRadius: 10, overflow: 'hidden'}}>
                            {options?.map((item, index) => (
                                <TouchableHighlight key={item?._id || index}  onPress={() => {
                                    // onChangeAction?.(item)
                                    // item?.onPress?.(message)
                                }}>
                                    <View style={[
                                        { padding: 10, backgroundColor: 'white', borderBottomWidth: 1, borderColor: 'rgba(0,0,0,.1)' },
                                        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }
                                    ]}>
                                        <Text style={{ padding: 5, fontSize: 14 }}>{item?.label}</Text>
                                        {!!item?.icon && <Ionicons style={{ padding: 5 }} name={item?.icon} size={18} color={'black'} />}
                                    </View>
                                </TouchableHighlight>
                            ))}
                        </View>
                    </Collapsible>
                    </View>
            </BlurView>
        </Modal>
  );
});

export default PushModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});
