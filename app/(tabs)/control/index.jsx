import { View, StyleSheet, Pressable, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useState } from 'react';
import useWebSocket from '../../../hooks/useWebSocket';
import Header from '../../../component/layout/Header';
import ControlCard from '../../../component/card/ControlCard';
import { colors } from '../../../constants/colorConstant';
import { useFocusEffect, useRouter } from 'expo-router';


const ControlHomeScreen = () => {


  // 로그인 페이지 이동을 위해 useRouter사용
  const router = useRouter();

 {/*

  // 로그인 여부 확인 후, 로그인정보가 null이면 로그인 페이지로 이동
  useFocusEffect(
    useCallback(()=>{
        const getLoginInfo = async () =>{   
        const loginInfo = await SecureStore.getItemAsync('loginInfo');
        const result = JSON.parse(loginInfo);
        console.log('로그인 데이터=', loginInfo);
        if(result === null){
          router.replace('/auth/login');  
        }
      }
      getLoginInfo();
    },[])
  )

*/}

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


  // 로그아웃 기능 구현
  const logout = async() => {
    // SecureStore에 저장된 로그인 정보를 삭제하는 것
    await SecureStore.deleteItemAsync('loginInfo');
    // 로그아웃 성공후 기존에 존재하던 모든화면 Stack을 제거
    if(router.canDismiss()){
       router.dismissAll(); 
    }
    router.replace('/');  // HomeScreen으로 교체이동시킴
  }


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

      {/* 로그인페이지 이동 & 로그아웃 버튼 */}
      <View style={styles.loginout}>
        <Pressable onPress={()=>router.push('/auth/login')}>
          <Text> 로그인 페이지로 이동   | </Text>  
        </Pressable>
        <Pressable onPress={()=> logout()}>
          <Text>   로그아웃</Text>  
        </Pressable>
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
  loginout : {
    paddingTop : 30,
    paddingHorizontal : 14,
    flexDirection : 'row',
    justifyContent : 'center',
  }
});