import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Verify: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verification</Text>
      <Text style={styles.subtext}>Choose how you want to verify whether you're in school.</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.box} onPress={() => router.push('/fingerprint')}>
          <Text style={styles.boxText}>Fingerprint</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box} onPress={() => router.push('/face-id')}>
          <Text style={styles.boxText}>Face ID</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    width: '80%',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  box: {
    width: '80%',
    marginVertical: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  boxText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
  },
  backButtonText: {
    fontSize: 18,
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default Verify;
