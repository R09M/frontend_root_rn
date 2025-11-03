// components/DaumPostcodeModal.js
import React from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const DaumPostcodeModal = ({ visible, onClose, onSelectAddress }) => {
  const handleMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    onSelectAddress(data.address);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>닫기</Text>
        </TouchableOpacity>
        <WebView
          source={{ uri: 'https://your-server.com/daum-postcode.html' }}
          onMessage={handleMessage}
        />
      </View>
    </Modal>
  );
};