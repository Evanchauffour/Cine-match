import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, PanResponder, SafeAreaView, TouchableOpacity, Text, Image, Alert, Modal, Pressable, Keyboard } from 'react-native';
import { addLikedMovie, checkMatch } from '../utils/game';
import { auth } from '@/firebaseConfig';
import { router, useLocalSearchParams } from 'expo-router';
import Buttons from '@/components/Button';
import LottieView from 'lottie-react-native';
import { getGroupUsers, leaveGroup, deleteRoom } from '../utils/room';

interface User {
    uid: string;
    displayName: string;
}

export default function Game() {
    const [cards, setCards] = useState<{ id: number; title: string; img: string }[]>([]);
    const [page, setPage] = useState(1);
    const [isFetching, setIsFetching] = useState(false);
    const [isCanSwipe, setIsCanSwipe] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(auth.currentUser);
    const params = useLocalSearchParams();
    const [isMatched, setIsMatched] = useState(false);
    const [cardMatched, setCardMatched] = useState<any>(null);
    const [groupUsers, setGroupUsers] = useState<User[]>([]);
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
            return;
        }

        console.log(cards[0]);
        
        await addLikedMovie(currentUser.uid, roomId, cards[0]).then(() => {
            checkMatch(roomId, cards[0].id, currentUser.uid).then((isMatch) => {
                if (isMatch) {
                    setIsMatched(true);
                    setCardMatched(cards[0]);
                    console.log('card matched:' + cards[0]);
                    
                }
            });
        }).catch((error) => {
            console.error('Erreur lors de l\'ajout du film liké:', error);
        });
    };

    const swipeCard = (direction: string) => {
      if (!isCanSwipe) {    
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

const handleLeaveGroup = async () => {
    const confirmLeaveGroup = async () => {
        try {
            await leaveGroup(roomId, currentUser.uid);
            router.push({ pathname: '/' });
        } catch (error) {
            console.error("Error while leaving the group:", error);
        }
    };

    Alert.alert('Quitter le groupe', 'Êtes-vous sûr de vouloir quitter le groupe ?', [
        {
            text: 'Annuler',
            onPress: () => console.log('Annuler'),
        },
        {
            text: 'Quitter',
            onPress: confirmLeaveGroup,
        },
    ]);
};

useEffect(() => {
    if (!roomId) return;

    const unsubscribe = getGroupUsers(roomId, (users: User[]) => {
        setGroupUsers(prevUsers => {
            if (prevUsers.length > users.length) {
                const usersWhoLeft = prevUsers.filter(prevUser => !users.some(user => user.uid === prevUser.uid));

                if (usersWhoLeft.length > 0) {
                    usersWhoLeft.forEach(user => {
                        if(currentUser.uid !== user.uid && users.find(u => u.uid === currentUser.uid)) {
                            Alert.alert(`${user.displayName} a quitté le groupe`);
                        }
                    });
                }
            }

            if (users.length === 0) {
                deleteRoom(roomId)
                    .then(() => {
                        console.log(`Room ${roomId} supprimée car il n'y a plus d'utilisateurs.`);
                    })
                    .catch(error => {
                        console.error("Erreur lors de la suppression de la room: ", error);
                    });
            }

            return users;
        });
    });

    return () => unsubscribe();
}, [roomId]);





    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.status}>
                <Buttons title="Quitter" onPress={handleLeaveGroup} />
                <Buttons title="Matches" onPress={() => console.log('Quitter le groupe')} icon='matchesIcon' buttonStyle={styles.allMatchesButton} textStyle={styles.textAllMatchesButton}/>
            </View>
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
                        <Image source={require('@/assets/images/heartIcon.png')} style={{ width: 30, height: 30 }} />
                    </TouchableOpacity>
                </View>
            </View>
            <Modal visible={isMatched} transparent={true} animationType="slide">
            <Pressable
                onPress={() => {
                    Keyboard.dismiss();
                }}
                style={styles.modalOverlay}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.cardMatched}>
                    {isMatched && cardMatched && (
                        <View style={{width: '100%', height: '100%'}}>
                            <Image source={{ uri: cardMatched.img }} style={{ flex:1, borderRadius: 10, resizeMode: 'contain', }} />
                            <Text style={styles.filmTitle}>{cardMatched.title}</Text>
                                <LottieView
                                    source={require('@/animation/hearth.json')}
                                    autoPlay
                                    style={styles.lottie}
                                    loop={false}
                                />
                        </View>
                    )}
                    </View>
                    <Buttons title="Continuer" onPress={() => setIsMatched(false)} />
                </View>
            </Pressable>
        </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  status: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  allMatchesButton: {
    backgroundColor: '#831FE8',
  },
  textAllMatchesButton: {
    color: 'white',
    alignSelf: 'center',
  },
  swiperContainer: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
    position: 'relative',
    height: '70%',
    gap: 20,
 },
 cardMatched: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
 },
 lottie: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: [{ translateX: -150 }, { translateY: -150 }],
    zIndex: 10,
    width: 300,
    height: 300,
 }
});
