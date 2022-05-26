import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import React from 'react';
import * as Animatable from 'react-native-animatable';

import PushModal from '../components/PushModal';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const pushModalRef = React.useRef(null)
  
  const data = [{ _id: 0, text: 'Hello all well?' }, { _id: 1, text: 'hey...' }, { _id: 2, text: 'Hello, how are you?' }, { _id: 3, text: 'hey how are you' }, { _id: 4, text: 'hey uncle' }]
  
  const elementRefs = {}
  const [selected, setSelected] = React.useState(undefined)
  data?.forEach(item => {
    elementRefs[item?._id] = React.createRef();
  })

  return (
    <View style={styles.container}>
      <FlatList 
        data={data}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', padding: 10 }}>
            <TouchableOpacity onLongPress={(e) => {
              if (elementRefs[item?._id]?.current) {
                pushModalRef.current?.open(elementRefs[item?._id], 'right');
                setSelected(item?._id)
              }
            }}>
                  <View ref={elementRefs[item?._id]} >
                    <Item item={item}/>
                  </View>
            </TouchableOpacity>
          </View>
        )}
      />
      <PushModal ref={pushModalRef} 
            padding={10}
            contentContainerstyle={[{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-end'  }]}
            options={[
              { label: 'Favoritar' },
              { label: 'Responder', icon: 'arrow-undo-circle' ,onPress: item => setReply(item?._id) },
              { label: 'Encaminhar' },
              { label: 'Copiar' },
              { label: 'Dados' },
              { label: 'Apagar' },
            ]}
          >
            <Item item={data?.find(item => item?._id === selected)}/>
        </PushModal>
    </View>
  );
}

const Item: React.FC = ({ item }) => {
  return (
    <View style={{ padding: 20, backgroundColor: 'white', borderWidth: 1, borderColor: 'rgba(0,0,0,.1)', borderRadius:20 }}>
      <Text>{item?.text}</Text>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
