import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import useWebSocket from '../../../hooks/useWebSocket';
import Header from '../../../component/layout/Header';
import ControlCard from '../../../component/card/ControlCard';
import { colors } from '../../../constants/colorConstant';

const ControlHomeScreen = () => {
  const { controlLED, controlPump, controlFan, connectionStatus } = useWebSocket();
  
  const [ledStatus, setLedStatus] = useState(false);
  const [pumpStatus, setPumpStatus] = useState(false);
  const [fanStatus, setFanStatus] = useState(false);

  const handleLEDToggle = () => {
    const newStatus = !ledStatus;
    setLedStatus(newStatus);
    controlLED(newStatus ? 'ON' : 'OFF');
  };

  const handlePumpToggle = () => {
    const newStatus = !pumpStatus;
    setPumpStatus(newStatus);
    controlPump(newStatus ? 'ON' : 'OFF');
  };

  const handleFanToggle = () => {
    const newStatus = !fanStatus;
    setFanStatus(newStatus);
    controlFan(newStatus ? 'ON' : 'OFF');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="장치 제어"
        onBackPress={() => console.log('back')}
        onMenuPress={() => console.log('menu')}
      />

      <View style={styles.content}>
        <ControlCard
          icon="💡"
          title="LED 조명"
          isOn={ledStatus}
          onToggle={handleLEDToggle}
          type="led"
        />
        
        <ControlCard
          icon="💦"
          title="물펌프"
          isOn={pumpStatus}
          onToggle={handlePumpToggle}
          type="pump"
        />
        
        <ControlCard
          icon="🌀"
          title="환풍기"
          isOn={fanStatus}
          onToggle={handleFanToggle}
          type="fan"
        />
      </View>
    </SafeAreaView>
  );
};

export default ControlHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.GRAY_100,
  },
  content: {
    padding: 16,
    gap: 16,
  },
});