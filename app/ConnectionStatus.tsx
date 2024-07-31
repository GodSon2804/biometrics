import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useNavigationState } from '@react-navigation/native';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, Button, StyleSheet, Text, View } from 'react-native';

const ConnectionStatus: React.FC = () => {
  const [connectionType, setConnectionType] = useState<'internet' | 'vpn' | 'both' | 'none'>('none');
  const [showMessage, setShowMessage] = useState(false);
  const router = useRouter();
  const currentRoute = useNavigationState(state => state.routes[state.index].name);

  useEffect(() => {
    const checkConnectionType = async () => {
      try {
        const netInfo: NetInfoState = await NetInfo.fetch();
        if (netInfo.isInternetReachable === false) {
          setConnectionType('none');
          setShowMessage(true);
        } else if (netInfo.type === 'vpn') {
          setConnectionType('vpn');
          setShowMessage(true);
        } else if (netInfo.type === 'wifi' || netInfo.type === 'cellular') {
          if (isUsingVPN(netInfo)) {
            setConnectionType('both');
            setShowMessage(true);
          } else {
            setConnectionType('internet');
            navigateToLocationApp(); // Navigate to LocationApp if internet is reachable
          }
        }
      } catch (error) {
        console.error('Error checking connection type:', error);
        setConnectionType('none');
        setShowMessage(true);
      }
    };

    checkConnectionType();
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (currentRoute === 'lock') {
          return true;
        }
        return false;
      });

      return () => backHandler.remove();
    }, [currentRoute])
  );

  const navigateToLocationApp = () => {
    setTimeout(() => {
      router.replace('/LocationApp');
    }, 5000);
  };

  const isUsingVPN = (netInfo: NetInfoState): boolean => {
    // Custom logic to determine if VPN is being used.
    return false; // Update this with actual logic if available.
  };

  const handleBackButton = () => {
    router.replace('/'); // Navigate to the first page
  };

  return (
    <View style={styles.container}>
      {showMessage ? (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            {connectionType === 'none'
              ? 'Check your internet connection'
              : 'Please turn off your VPN'}
          </Text>
          <Button title="Back" onPress={handleBackButton} />
        </View>
      ) : (
        <>
          <Text style={styles.title}>Connection Type</Text>
          <Text style={[styles.statusText, styles[connectionType]]}>
            {connectionType === 'internet'
              ? 'Connected to the internet'
              : connectionType === 'both'
              ? 'Connected to the internet with VPN'
              : connectionType === 'vpn'
              ? 'Connected to VPN'
              : 'No internet connection'}
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  internet: {
    color: '#4CAF50',
  },
  vpn: {
    color: '#FFA500',
  },
  both: {
    color: '#FFA500',
  },
  none: {
    color: '#F44336',
  },
  messageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    fontSize: 18,
    marginVertical: 10,
    color: '#F44336',
  },
});

export default ConnectionStatus;
