import { Stack } from 'expo-router';
import { AppProvider } from '../context/AppContext';
import Toast from 'react-native-toast-message';
import { View, Text, StyleSheet } from 'react-native';

const RootLayout = () => {
  
  // 🎨 커스텀 Toast 디자인
  const toastConfig = {
    motionAlert: ({ text1, text2 }) => (
      <View style={styles.toastContainer}>
        <View style={styles.toastIcon}>
          <Text style={styles.iconText}>🚨</Text>
        </View>
        <View style={styles.toastContent}>
          <Text style={styles.toastTitle}>{text1}</Text>
          <Text style={styles.toastMessage}>{text2}</Text>
        </View>
      </View>
    ),
  };

  return (
    <AppProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
      <Toast config={toastConfig} />
    </AppProvider>
  );
};

export default RootLayout;

const styles = StyleSheet.create({
  toastContainer: {
    width: '90%',
    backgroundColor: '#FF3B30',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  toastIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 24,
  },
  toastContent: {
    flex: 1,
  },
  toastTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  toastMessage: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.9,
  },
});