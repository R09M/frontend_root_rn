import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import useWebSocket from '../../../hooks/useWebSocket';
import Button from '../../../component/Button';

const ControlHomeScreen = () => {
  const { 
    controlLED, 
    controlPump, 
    controlFan,
    connectionStatus 
  } = useWebSocket();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text>장치 제어</Text>
        <Text>{connectionStatus}</Text>

        <View>
          <Text>💡 LED 조명</Text>
          <Button 
            title="켜기" 
            size="large"
            onPress={() => controlLED('ON')}
          />
          <Button 
            title="끄기" 
            size="large"
            onPress={() => controlLED('OFF')}
          />
        </View>

        <View>
          <Text>💦 물펌프</Text>
          <Button 
            title="작동" 
            size="large"
            onPress={() => controlPump('ON')}
          />
          <Button 
            title="정지" 
            size="large"
            onPress={() => controlPump('OFF')}
          />
        </View>

        <View>
          <Text>🌀 환풍기</Text>
          <Button 
            title="작동" 
            size="large"
            onPress={() => controlFan('ON')}
          />
          <Button 
            title="정지" 
            size="large"
            onPress={() => controlFan('OFF')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ControlHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
});