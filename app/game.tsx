import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, PanResponder, SafeAreaView, TouchableOpacity, Text, Image, Alert } from 'react-native';
import { addLikedMovie, checkMatch } from '../utils/game';
import { auth } from '@/firebaseConfig';
import { useLocalSearchParams } from 'expo-router';

export default function Game() {
    const [cards, setCards] = useState<{ id: number; title: string; img: string }[]>([]);
    const [page, setPage] = useState(1);
    const [isFetching, setIsFetching] = useState(false);
    const [isCanSwipe, setIsCanSwipe] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(auth.currentUser);
    const params = useLocalSearchParams();
    const { roomId } = params;

    const fetchMovies = async () => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiY2Q5MTcyZmQwOWViN2RiZjkxNzIxODJkNTI4MWM1ZCIsIm5iZiI6MTcyNTc5NjMyNi42NDA2MDMsInN1YiI6IjYzMTk4Y2FmMGYwZGE1MDA4MjU2MzBiNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9vMSVnDEhpS7e4ZQ4C6QGR4hKTwSmdbZQuTxuy3hFZk'
            },
        };

        try {
            setIsFetching(true);
            const response = await fetch(
                `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=fr&page=${page}&sort_by=popularity.desc`,
                options
            );
            const data = await response.json();
            const movies = data.results.map((movie: any) => ({
                id: movie.id,
                title: movie.title,
                img: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            }));
            setCards(movies);
            setIsFetching(false);
            setPage(page + 1);
        } catch (err) {
            console.error('Erreur lors de la récupération des films:', err);
            setIsFetching(false);
        }
    };

    useEffect(() => {
        if (cards.length === 2 && !isFetching) {
            fetchMovies();
        }
    }, [cards, isFetching]);

    useEffect(() => {
        fetchMovies();
    }, []);

    const position = useRef(new Animated.ValueXY()).current;

    const likeCard = async () => {
        if (!cards || !currentUser || !roomId) {
            console.error('Données insuffisantes pour liker la carte.');
            return;
        }

        console.log(cards[0]);
        
        await addLikedMovie(currentUser.uid, roomId, cards[0]).then(() => {
            checkMatch(roomId, cards[0].id, currentUser.uid).then((isMatch) => {
                if (isMatch) {
                    Alert.alert('Match', 'Vous avez un match !');
                }
            });
        }).catch((error) => {
            console.error('Erreur lors de l\'ajout du film liké:', error);
        });
    };

    const swipeCard = (direction: string) => {
      if (!isCanSwipe) {
        console.log('Impossible de swiper');
        
        return;
      }
      
      const xValue = direction === 'right' ? 500 : -500;
      
  
      if (direction === 'right') {
        likeCard();
      }
  
      setIsCanSwipe(false);
  
      Animated.spring(position, {
          toValue: { x: xValue, y: 0 },
          useNativeDriver: true,
      }).start(() => {
          setCards((prevCards) => {
              const newCards = prevCards.slice(1);
              return newCards;
          });
          position.setValue({ x: 0, y: 0 });
          setIsCanSwipe(true);
      });
  };
  

  const panResponder = useRef(
    PanResponder.create({
        onStartShouldSetPanResponder: () => true,

        onPanResponderMove: (e, { dx, dy }) => {
            Animated.event([null, { dx: position.x, dy: position.y }], { useNativeDriver: false })(e, { dx, dy });
        },

        onPanResponderRelease: (e, { dx, dy }) => {
            if (dx > 0) {
                swipeCard('right');
            } else if (dx < -120) {
                swipeCard('left');
            } else {              
                Animated.spring(position, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: true,
                }).start();
            }
        },
    })
).current;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.status}></View>
            <View style={styles.swiperContainer}>
                {cards.length > 0 ? (
                    <View style={styles.swiper}>
                        {cards.map((card, index) => {
                            const isTopCard = index === 0;
                            const animatedStyle = isTopCard
                                ? {
                                    transform: [
                                        { translateX: position.x },
                                        { translateY: position.y },
                                        {
                                            rotate: position.x.interpolate({
                                                inputRange: [-200, 0, 200],
                                                outputRange: ['-15deg', '0deg', '15deg'],
                                            }),
                                        },
                                    ],
                                }
                                : {};

                            return (
                                <Animated.View
                                    key={card.id}
                                    style={[
                                        styles.cardContainer,
                                        animatedStyle,
                                        { zIndex: cards.length - index },
                                    ]}
                                    {...(isTopCard ? panResponder.panHandlers : {})}
                                >
                                    <View style={styles.card}>
                                        <Image source={{ uri: card.img }} style={{ flex: 1, borderRadius: 10 }} />
                                        <Text style={styles.filmTitle}>{card.title}</Text>
                                    </View>
                                </Animated.View>
                            );
                        })}
                    </View>
                ) : (
                    <Text>Chargement des films...</Text>
                )}
                <View style={styles.buttonsMatch}>
                    <TouchableOpacity style={styles.button} onPress={() => swipeCard('left')}>
                        <Image source={require('@/assets/images/crossIcon.png')} style={{ width: 30, height: 30 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => swipeCard('right')}>
                        <Image source={require('@/assets/images/hearthIcon.png')} style={{ width: 30, height: 30 }} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  status: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  swiperContainer: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 40,
    marginHorizontal: 40,
    gap: 20,
  },
  swiper: {
    position: 'relative',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  cardContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    padding: 10,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    paddingBottom: 5,
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filmTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonsMatch: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
