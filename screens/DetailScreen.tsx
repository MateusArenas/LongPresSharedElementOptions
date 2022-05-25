import React, {
    useEffect,
    useState,
    useRef,
    useContext,
    useCallback,
  } from 'react';
  import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Animated,
    LayoutAnimation,
    Platform,
    UIManager,
    BackHandler,
  } from 'react-native';
  import {
    NativeViewGestureHandler,
    PanGestureHandler,
    State,
  } from 'react-native-gesture-handler';
  import { useFocusEffect } from '@react-navigation/native';
  import { CardItem } from '../components/CardItem';
  import { theme } from '../utils/theme';
  import {
    springAnimation,
    timingAnimation,
    layoutConfig,
  } from '../utils/animation';
  import { ItemContext } from '../providers/ItemProvider';
  
  import { CloseButton } from '../components/CloseButton';
  
  const {
    CARD_HEIGHT,
    CARD_WIDTH,
    CARD_BORDER,
    SCREEN_WIDTH,
    CARD_DETAIL_HEIGHT,
    SPACE,
    HEADER_HEIGHT,
    primaryColor,
  } = theme;
  
  const pageAnimatedValue = new Animated.Value(0);
  const detailAnimatedValue = new Animated.Value(0);
  const panGestureState = new Animated.Value(-1);
  const panAnimatedValue = new Animated.Value(0);
  const scrollAnimatedValue = new Animated.Value(0);
  
  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  
  export const DetailScreen = props => {
    const { setSelectedItem } = useContext(ItemContext);
    const [draggable, setDraggable] = useState(true);
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const {
      navigation,
      route: { params: { item, itemPosition, scrollPosition } = {} } = {},
    } = props;
    const { y } = itemPosition;
    const [cardWidth, setCardWidth] = useState(CARD_WIDTH);
    const [cardHeight, setCardHeight] = useState(CARD_HEIGHT);
    const [cardBorder, setCardBorder] = useState(CARD_BORDER);
  
    const scrollRef = useRef(null);
    const gestureRef = useRef(null);
    const panRef = useRef(null);
  
    useEffect(() => {
      LayoutAnimation.configureNext(layoutConfig);
      setCardHeight(CARD_DETAIL_HEIGHT);
      setCardWidth(SCREEN_WIDTH);
      setCardBorder(0);
      Animated.parallel([
        springAnimation({ value: pageAnimatedValue, toValue: 100 }),
        springAnimation({ value: detailAnimatedValue, toValue: 100 }),
      ]).start();
      return () => {
        panAnimatedValue.setValue(0);
      };
    }, []);
  
    // Android back button handler
    useFocusEffect(
      useCallback(() => {
        const onBackPress = () => {
          scrollRef.current
            .getNode()
            .scrollTo({ y: 0, animated: true, duration: 300 });
          setTimeout(
            () => {
              popAnimations().start(({ finished }) => {
                if (finished) {
                  setSelectedItem(null);
                  navigation.pop();
                }
              });
            },
            draggable ? 0 : 300
          );
          return true;
        };
  
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
        return () =>
          BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      }, [draggable, navigation, setSelectedItem])
    );
  
    const onPanGestureEvent = Animated.event(
      [
        {
          nativeEvent: {
            state: panGestureState,
            translationY: draggable && panAnimatedValue,
          },
        },
      ],
      { listener: event => panListener(event) },
      { useNativeDriver: Platform.OS !== 'web' }
    );
  
    const panListener = event => {
      const { nativeEvent: { translationY } = {} } = event;
      if (draggable) {
        if (translationY > 200) {
          setDraggable(false);
          setScrollEnabled(false);
          handleBack();
        }
        if (panGestureState._value !== State.ACTIVE) {
          if (!translationY || translationY < 200) {
            timingAnimation({
              value: panAnimatedValue,
              toValue: 0,
              duration: 150,
            }).start();
          }
        }
      }
    };
  
    const onScroll = Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              y: scrollAnimatedValue,
            },
          },
        },
      ],
      { listener: event => scrollListener(event) },
      { useNativeDriver: Platform.OS !== 'web' }
    );
  
    const scrollListener = event => {
      const {
        nativeEvent: {
          contentOffset: { y: offSet },
        },
      } = event;
      if (offSet <= 0) {
        setDraggable(true);
      } else {
        setDraggable(false);
      }
    };
  
    const popAnimations = () => {
      LayoutAnimation.configureNext(layoutConfig);
      setCardHeight(CARD_HEIGHT);
      setCardWidth(CARD_WIDTH);
      setCardBorder(CARD_BORDER);
      return Animated.parallel([
        timingAnimation({
          value: detailAnimatedValue,
          toValue: 0,
        }),
        timingAnimation({
          value: pageAnimatedValue,
          toValue: 0,
        }),
        timingAnimation({
          value: panAnimatedValue,
          toValue: 0,
        }),
      ]);
    };
  
    const handleBack = () => {
      scrollRef?.current?.scrollTo?.({ y: 0, animated: true, duration: 300 });
      setTimeout(
        () => {
          popAnimations().start(({ finished }) => {
            if (finished) {
              setSelectedItem(null);
              navigation.pop();
            }
          });
        },
        draggable ? 0 : 300
      );
    };
  
    const findInitialPosition = () => {
      if (scrollPosition > y) {
        return Math.floor(y - scrollPosition) + HEADER_HEIGHT;
      } else {
        return Math.floor(Math.abs(scrollPosition - y)) + HEADER_HEIGHT;
      }
    };
  
    //interpolations
    const pageTransformYInterpolate = pageAnimatedValue.interpolate({
      inputRange: [0, 100],
      outputRange: [findInitialPosition(), 0],
      extrapolate: 'clamp',
    });
  
    const detailTranslateInterpolate = detailAnimatedValue.interpolate({
      inputRange: [0, 100],
      outputRange: [-CARD_DETAIL_HEIGHT, 0],
      extrapolate: 'clamp',
    });
  
    const closeButtonInterpolate = pageAnimatedValue.interpolate({
      inputRange: [0, 90, 100],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp',
    });
  
    const panScaleInterpolate = panAnimatedValue.interpolate({
      inputRange: [-1, 0, 100, 200],
      outputRange: [1, 1, 0.9, 0.9],
      extrapolate: 'clamp',
    });
  
    // styles
    const WrapperStyle = {
      transform: [
        { translateY: pageTransformYInterpolate },
        { scale: panScaleInterpolate },
      ],
      borderRadius: cardBorder,
    };
  
    const DetailContainerStyle = {
      transform: [{ translateY: detailTranslateInterpolate }],
      width: cardWidth,
    };
  
    const CardStyle = {
      width: cardWidth,
      height: cardHeight,
      borderRadius: cardBorder,
      marginBottom: 0,
    };
  
    const CloseButtonStyle = {
      opacity: closeButtonInterpolate,
    };
  
    return (
      <Animated.View style={WrapperStyle}>
        <NativeViewGestureHandler ref={gestureRef} simultaneousHandlers={panRef}>
          <Animated.ScrollView
            scrollEnabled={scrollEnabled}
            ref={scrollRef}
            bounces={false}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            onScroll={onScroll}>
            <PanGestureHandler
              ref={panRef}
              enabled={draggable}
              simultaneousHandlers={gestureRef}
              onGestureEvent={onPanGestureEvent}
              onHandlerStateChange={onPanGestureEvent}>
              <Animated.View style={[styles.container]}>
                <CardItem disable item={item} style={CardStyle} />
                <Animated.View
                  style={[styles.detailContainer, DetailContainerStyle]}>
                  <Text style={styles.title}>Origin</Text>
                  <Text style={styles.name}>{item.origin.name} </Text>
                  <Text style={styles.title}>Location</Text>
                  <Text style={styles.name}>{item.location.name} </Text>
                  <Text style={styles.title}>Species</Text>
                  <Text style={styles.name}>{item.species}</Text>
                  <Text style={styles.title}>Status</Text>
                  <Text style={styles.name}>{item.status}</Text>
                  <Text style={styles.title}>Gender</Text>
                  <Text style={styles.name}>{item.gender}</Text>
                </Animated.View>
              </Animated.View>
            </PanGestureHandler>
          </Animated.ScrollView>
        </NativeViewGestureHandler>
        <CloseButton style={CloseButtonStyle} onPress={handleBack} />
      </Animated.View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
    },
    detailContainer: {
      zIndex: -1,
      paddingBottom: SPACE,
      paddingHorizontal: SPACE,
      backgroundColor: primaryColor,
    },
    title: {
      fontSize: 21,
      fontWeight: 'bold',
      marginTop: SPACE * 2,
      color: '#fff',
    },
    name: {
      fontSize: 24,
      color: '#fff',
    },
  });
  