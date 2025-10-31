import Toast from 'react-native-toast-message';

export const showMotionAlert = (data) => {
  Toast.show({
    type: 'motionAlert',
    text1: '모션 감지!',
    text2: data.message || '움직임이 감지되었습니다',
    visibilityTime: 1500,  // ← 여기서만 수정!
    position: 'top',
    topOffset: 60,
  });
};