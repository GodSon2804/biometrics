import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';

type RootTabParamList = {
    index: undefined;
    explore: undefined;
};

type IndexProps = {
    navigation: BottomTabNavigationProp<RootTabParamList, 'index'>;
};

const Index: React.FC<IndexProps> = () => {
    const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList, 'index'>>();
    const [greeting, setGreeting] = useState<string>('');
    const [glowAnimation] = useState(new Animated.Value(0));
    const [showConfirmation, setShowConfirmation] = useState(false);

    const getGreeting = () => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) {
            setGreeting('Good morning!');
        } else if (currentHour < 18) {
            setGreeting('Good afternoon!');
        } else {
            setGreeting('Good evening!');
        }
    };

    useEffect(() => {
        getGreeting();
        const interval = setInterval(startGlowAnimation, 5000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const startGlowAnimation = () => {
        glowAnimation.setValue(0.5);
        Animated.timing(glowAnimation, {
            toValue: 1,
            duration: 1500,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start(() => {
            Animated.timing(glowAnimation, {
                toValue: 0.5,
                duration: 1500,
                easing: Easing.ease,
                useNativeDriver: true,
            }).start();
        });
    };

    const handleStartRegistration = () => {
        setShowConfirmation(true);
    };

    const glowStyle = {
        opacity: glowAnimation,
        transform: [
            {
                scale: glowAnimation.interpolate({
                    inputRange: [0.5, 1],
                    outputRange: [1, 1.2],
                }),
            },
        ],
    };

    return (
        <View style={styles.container}>
            <View style={styles.topLeftContainer}>
                <View style={styles.profileCircle}>
                    <MaterialIcons name="person" size={34} color="#841584" style={styles.profileIcon} />
                </View>
                <Text style={styles.greeting}>{greeting}</Text>
            </View>
            <Text style={styles.title}>Welcome to {'\n'}BioCheck</Text>
            <Text style={styles.subtitle}>
                Are you ready to start {'\n'} your biometric registration?{'\n'}Touch the fingerprint to start
            </Text>
            <TouchableOpacity
                style={styles.button}
                onPress={handleStartRegistration}
            >
                <Animated.View style={[styles.glowEffect, glowStyle]}>
                    <MaterialIcons name="fingerprint" size={120} color="white" />
                </Animated.View>
            </TouchableOpacity>

            <Modal
                visible={showConfirmation}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setShowConfirmation(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <View style={styles.exclamationContainer}>
                            <MaterialIcons name="error" size={80} color="red" />
                        </View>
                        <Text style={styles.modalText}>Are you ready for your Biometrics verification?</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.yesButton]}
                                onPress={() => {
                                    setShowConfirmation(false);
                                    navigation.navigate('ConnectionStatus'); // Navigate to ConnectionStatus screen
                                }}
                            >
                                <Text style={styles.buttonText}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.noButton]}
                                onPress={() => setShowConfirmation(false)}
                            >
                                <Text style={styles.buttonText}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        paddingHorizontal: 20,
    },
    topLeftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 20,
        marginLeft: 20,
        top: -130,
        left: -80,
    },
    profileCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileIcon: {
        backgroundColor: 'transparent',
    },
    greeting: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 10,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 50,
        paddingHorizontal: 20,
        color: '#fff',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 50,
    },
    glowEffect: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
        elevation: 5,
    },
    exclamationContainer: {
        marginBottom: 20,
    },
    modalText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
        fontWeight: 'bold',
        fontStyle: 'italic',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
        lineHeight: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        paddingVertical: 10,
        width: '45%',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    yesButton: {
        backgroundColor: '#4caf50',
    },
    noButton: {
        backgroundColor: '#f44336',
    },
});

export default Index;
