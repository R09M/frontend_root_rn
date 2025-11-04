import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export const showMotionAlert = async (data) => {
  // ✅ 이 부분 추가
  const savedIndex = await AsyncStorage.getItem('alertSettingIndex');
  
  if (savedIndex === '2') {
    console.log('🔕 알림 끔 - 표시 안 함');
    return;
  }
  
  // 기존 Toast 코드
  Toast.show({
    type: 'motionAlert',
    text1: '알림!',
    text2: data.message,
    position: 'top',
    visibilityTime: 4000,
    topOffset: 50,
  });
};