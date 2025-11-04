// React 및 React Native 핵심 라이브러리 import
import { View, Text, StyleSheet } from 'react-native';

// 라우터 및 외부 라이브러리 import
import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';

// 컨텍스트 import
import { AppProvider } from '../context/AppContext';

/**
 * ============================================
 * RootLayout 컴포넌트
 * ============================================
 * 앱의 최상위 레이아웃 컴포넌트
 * - 전역 상태 관리 (AppProvider)
 * - 라우팅 구조 설정 (Stack)
 * - Toast 메시지 설정
 */
const RootLayout = () => {
  
  // ============================================
  // 커스텀 Toast 디자인 설정
  // ============================================
  const toastConfig = {
    motionAlert: ({ text1, text2 }) => (
      <View style={styles.toastContainer}>
        {/* Toast 아이콘 영역 */}
        <View style={styles.toastIcon}>
          <Text style={styles.iconText}>🚨</Text>
        </View>
        {/* Toast 컨텐츠 영역 */}
        <View style={styles.toastContent}>
          <Text style={styles.toastTitle}>{text1}</Text>
          <Text style={styles.toastMessage}>{text2}</Text>
        </View>
      </View>
    ),
  };

  // ============================================
  // 메인 렌더링
  // ============================================
  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* 탭 네비게이션 화면 (홈, 설정 등) */}
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
        />
        
        {/* 인증 관련 화면 (로그인, 회원가입) */}
        <Stack.Screen 
          name="auth" 
          options={{ 
            headerShown: false,
            presentation: 'card',
            contentStyle: { backgroundColor: 'transparent' }
          }} 
        />
      </Stack>
      
      {/* 전역 Toast 컴포넌트 */}
      <Toast config={toastConfig} />
    </AppProvider>
  );
};

export default RootLayout;

// ============================================
// 스타일 정의
// ============================================
const styles = StyleSheet.create({
  // Toast 컨테이너
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
  // Toast 아이콘 영역
  toastIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  // 아이콘 텍스트
  iconText: {
    fontSize: 24,
  },
  // Toast 컨텐츠 영역
  toastContent: {
    flex: 1,
  },
  // Toast 타이틀
  toastTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  // Toast 메시지
  toastMessage: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.9,
  },
});