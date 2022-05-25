import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import Axios from 'axios';
import { CardItem } from '../components/CardItem';
import { ScrollView } from 'react-native-gesture-handler';
import { Header } from '../components/Header';
import { ItemContext } from '../providers/ItemProvider';
import PushModal from '../components/PushModal';


let scrollPosition = 0;
export const HomeScreen = ({ navigation }) => {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const { selectedItem, setSelectedItem } = useContext(ItemContext);

  const pushModalRef = React.useRef(null)

    
  const elementRefs = {}
  const [selected, setSelected] = React.useState(undefined)
  results?.forEach(item => {
    elementRefs[item?.id] = React.createRef();
  })


  useEffect(() => {
    Axios.get(`https://rickandmortyapi.com/api/character/?page=${page}`).then(
      res => {
        setResults(res.data.results);
      }
    );
  }, [page]);

  const handleScroll = event => {
    scrollPosition = event.nativeEvent.contentOffset.y;
  };

  return (
    <>
      <ScrollView
        bounces={false}
        onScroll={handleScroll}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={1}>
        <Header
          page={page}
          onNext={() => setPage(page + 1)}
          onPrevious={() => setPage(page - 1)}
        />
        <View style={styles.content}>
          {results.map((result, i) => {
            return (
              <View ref={elementRefs[result.id]} key={result.id}>
                <CardItem
                  key={result.id}
                  item={result}
                  onLongPress={() => {
                    if (elementRefs[result?.id]?.current) {
                      pushModalRef.current?.open(elementRefs[result?.id], 'right');
                      setSelected(result?.id)
                    }
                  }}
                  selectedItem={selectedItem}  // context api'den gelen state
                  onPress={(item, itemPosition) => {
                    setSelectedItem(item.id);  //context api'den gelen method
                    navigation.navigate('Detail', {
                      item,
                      scrollPosition,
                      itemPosition,
                    });
                  }}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
      <PushModal ref={pushModalRef} 
            padding={0}
            contentContainerstyle={[{ flex: 1, alignItems: 'center', justifyContent: 'flex-end'  }]}
            options={[
              { label: 'Favoritar' },
              { label: 'Responder', icon: 'arrow-undo-circle' ,onPress: item => setReply(item?._id) },
              // { label: 'Encaminhar' },
              // { label: 'Copiar' },
              // { label: 'Dados' },
              // { label: 'Apagar' },
            ]}
          >
           {!!selected && <CardItem
                item={results?.find(item => item?.id === selected)}
                selectedItem={selectedItem}  // context api'den gelen state
                onPress={(item, itemPosition) => {
                  pushModalRef?.current?.close()
                  setSelected(undefined)
                  setSelectedItem(item.id);  //context api'den gelen method
                  navigation.navigate('Detail', {
                    item,
                    scrollPosition,
                    itemPosition,
                  });
                }}
              />}
        </PushModal>
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
  },
});
