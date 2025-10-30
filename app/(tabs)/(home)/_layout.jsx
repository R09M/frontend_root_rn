import { Stack } from 'expo-router'
import { StyleSheet } from 'react-native'


// 개발용 Mock 화면 사용 여부
// ============================================
// import HomeMockScreen from './HomeMockScreen';
// export default HomeMockScreen;

// 실제 화면 사용: 아래 주석 해제 (기본값)
// ============================================
const HomeLayout = () => {
  return (
    <Stack 
      screenOptions={{headerShown: false}}
    />
  )
}

export default HomeLayout

const styles = StyleSheet.create({})