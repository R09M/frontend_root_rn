// React 및 React Native 핵심 라이브러리 import
import { Keyboard, Animated, StyleSheet, ImageBackground, Text, Alert, View, TouchableOpacity } from 'react-native'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'expo-router'

// 아이콘 라이브러리 import
import { Ionicons } from '@expo/vector-icons'

// 외부 라이브러리 import
import * as SecureStore from 'expo-secure-store'
import axios from 'axios'

// 커스텀 컴포넌트 및 상수 import
import Input1 from '@/component/Input1'
import Button1 from '@/component/Button1'
import bgImage from '@/assets/images/login_background.jpg'
import { SERVER_URL } from '@/constants/appConst'
import { useAppContext } from '@/context/AppContext'

// ============================================
// 다국어 번역 데이터 (한국어, 영어, 일본어, 중국어)
// ============================================
const translations = {
  ko: {
    welcome: '환영합니다 !',
    idPlaceholder: '아이디',
    pwPlaceholder: '비밀번호',
    loginButton: '로그인',
    menuText: '아이디찾기 | 비밀번호 수정 | 비밀번호찾기',
    signupButton: '회원가입',
    loginSuccess: '로그인 성공',
    loginSuccessMsg: '정상적으로 로그인되었습니다.',
    loginFailed: '로그인 실패',
    loginFailedMsg: '아이디 또는 비밀번호가 일치하지 않습니다.',
  },
  en: {
    welcome: 'Welcome !',
    idPlaceholder: 'ID',
    pwPlaceholder: 'Password',
    loginButton: 'Login',
    menuText: 'Find ID | Change Password | Find Password',
    signupButton: 'Sign Up',
    loginSuccess: 'Login Success',
    loginSuccessMsg: 'You have successfully logged in.',
    loginFailed: 'Login Failed',
    loginFailedMsg: 'ID or password does not match.',
  },
  ja: {
    welcome: 'ようこそ !',
    idPlaceholder: 'ID',
    pwPlaceholder: 'パスワード',
    loginButton: 'ログイン',
    menuText: 'ID検索 | パスワード変更 | パスワード検索',
    signupButton: '会員登録',
    loginSuccess: 'ログイン成功',
    loginSuccessMsg: '正常にログインしました。',
    loginFailed: 'ログイン失敗',
    loginFailedMsg: 'IDまたはパスワードが一致しません。',
  },
  zh: {
    welcome: '欢迎 !',
    idPlaceholder: 'ID',
    pwPlaceholder: '密码',
    loginButton: '登录',
    menuText: '查找ID | 修改密码 | 查找密码',
    signupButton: '注册',
    loginSuccess: '登录成功',
    loginSuccessMsg: '已成功登录。',
    loginFailed: '登录失败',
    loginFailedMsg: 'ID或密码不匹配。',
  },
};

// ============================================
// 언어 코드 매핑
// ============================================
const languageLabels = {
  ko: 'KOR',
  en: 'ENG',
  ja: 'JPN',
  zh: 'CHN',
};

/**
 * ============================================
 * LoginScreen 컴포넌트
 * ============================================
 * 로그인 화면
 */
const LoginScreen = () => {
  
  const router = useRouter()
  
  // ============================================
  // Context에서 언어 가져오기
  // ============================================
  const { language, setLanguage } = useAppContext()
  
  // 현재 선택된 언어의 번역 객체
  const t = translations[language]
  
  // ============================================
  // 상태 관리
  // ============================================
  // marginTop을 애니메이션으로 제어하기 위한 Animated Value 생성
  const marginTopAnim = useRef(new Animated.Value(300)).current
  
  // 아이디, 비밀번호 입력값을 저장할 State변수선언
  const [loginData, setLoginData] = useState({
    userId: '',
    userPw: '',
  })

  // 언어 선택 드롭다운 표시 상태
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)

  // ============================================
  // 초기 언어 설정 (KOR로 설정)
  // ============================================
  useEffect(() => {
    // 초기 언어가 설정되지 않았으면 한국어로 설정
    if (!language) {
      setLanguage('ko')
    }
  }, [])

  // ============================================
  // 언어 변경 핸들러
  // ============================================
  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    setShowLanguageMenu(false)
  }

  // ============================================
  // 키보드 이벤트 처리
  // ============================================
  // 컴포넌트가 마운트될 때 키보드 이벤트 리스너 등록
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {    
        Animated.timing(marginTopAnim, {
          toValue: 150,  // 목표값: 150
          duration: 300,  // 애니메이션 지속시간: 300ms
          useNativeDriver: false,  
        }).start()
      }
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        Animated.timing(marginTopAnim, {
          toValue: 300,  
          duration: 300,  
          useNativeDriver: false,
        }).start()
      }
    )
    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [marginTopAnim])  

  // ============================================
  // 로그인 요청 함수
  // ============================================
  const login = async () => {
    try {
      // appConst.js를 이용하여 팀장의 절대경로로 설정
      const res = await axios.post(`${SERVER_URL}/users/login`, loginData)
      console.log(res.data)
      if (res.data && res.data.userId) {
        Alert.alert(t.loginSuccess, t.loginSuccessMsg)
        // 로그인 정보 SecureStore에 저장
        const loginInfo = {
          userId: res.data.userId,
          userName: res.data.userName,
          userRole: res.data.userRole,
        }
        await SecureStore.setItemAsync('loginInfo', JSON.stringify(loginInfo))
        // 모든 Stack을 제거하고, 라우터 이동 처리
        if (router.canDismiss()) {
          router.dismissAll()
        }
        router.replace('/') // 홈스크린으로 교체이동
      } else {
        Alert.alert(t.loginFailed, t.loginFailedMsg)
      }
    } catch (error) {
      console.error(error)
      Alert.alert(t.loginFailed, t.loginFailedMsg)
    }
  }

  // ============================================
  // 메인 렌더링
  // ============================================
  return (
    <View style={styles.wrapper}>
      <ImageBackground source={bgImage} style={styles.container}>
        {/* 언어 선택 버튼 (좌측 상단 고정) */}
        <View style={styles.languageContainer}>
          <TouchableOpacity 
            style={styles.languageButton}
            onPress={() => setShowLanguageMenu(!showLanguageMenu)}
            activeOpacity={0.7}
          >
            <Text style={styles.languageButtonText}>
              {languageLabels[language] || 'KOR'}
            </Text>
          </TouchableOpacity>

          {/* 언어 선택 드롭다운 메뉴 */}
          {showLanguageMenu && (
            <View style={styles.languageMenu}>
              <TouchableOpacity 
                style={[styles.languageMenuItem, language === 'ko' && styles.languageMenuItemActive]}
                onPress={() => handleLanguageChange('ko')}
              >
                <Text style={[styles.languageMenuText, language === 'ko' && styles.languageMenuTextActive]}>
                  한국어
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.languageMenuItem, language === 'en' && styles.languageMenuItemActive]}
                onPress={() => handleLanguageChange('en')}
              >
                <Text style={[styles.languageMenuText, language === 'en' && styles.languageMenuTextActive]}>
                  English
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.languageMenuItem, language === 'ja' && styles.languageMenuItemActive]}
                onPress={() => handleLanguageChange('ja')}
              >
                <Text style={[styles.languageMenuText, language === 'ja' && styles.languageMenuTextActive]}>
                  日本語
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.languageMenuItem, language === 'zh' && styles.languageMenuItemActive]}
                onPress={() => handleLanguageChange('zh')}
              >
                <Text style={[styles.languageMenuText, language === 'zh' && styles.languageMenuTextActive]}>
                  中文
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 환영 메시지 (완전히 독립적으로 위치 조정) */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>{t.welcome}</Text>
        </View>

        {/* 로그인 폼 */}
        <Animated.View style={[styles.content, { marginTop: marginTopAnim }]}>
          {/* 아이디 입력 */}
          <Input1
            placeholder={t.idPlaceholder}
            value={loginData.userId}
            onChangeText={(text) =>
              setLoginData((prev) => ({ ...prev, userId: text }))
            }
            textColor="white" 
            placeholderColor='rgba(255, 255, 255, 0.5)'
            fontSize={18}
          />
          {/* 비밀번호 입력 */}
          <Input1
            placeholder={t.pwPlaceholder}
            isPw={true}
            value={loginData.userPw}
            onChangeText={(text) =>
              setLoginData((prev) => ({ ...prev, userPw: text }))
            }
            textColor="white"
            placeholderColor='rgba(255, 255, 255, 0.5)'
            fontSize={18}
          />
          {/* 로그인 버튼 */}
          <Button1 title={t.loginButton} onPress={login} />
          {/* 메뉴 텍스트 */}
          <Text style={styles.menu}>
            {t.menuText}
          </Text>
          {/* 회원가입 버튼 */}
          <Button1 
            title={t.signupButton}
            color="rgba(155, 59, 22, 1)" 
            onPress={() => router.replace('/auth/join')} 
          />
        </Animated.View>
      </ImageBackground>
    </View>
  )
}

export default LoginScreen

// ============================================
// 스타일 정의
// ============================================
const styles = StyleSheet.create({
  // 최상위 래퍼 (전체 화면)
  wrapper: {
    flex: 1,
  },
  // 배경 이미지 컨테이너
  container: {
    flex: 1,
    resizeMode: 'cover', // 배경이미지 꽉차게
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 로그인 폼 컨텐츠
  content: {
    width: '70%',
  },
  // 환영 메시지 컨테이너 (absolute로 완전히 독립)
  welcomeContainer: {
    position: 'absolute',
    top: '16%',
    left: 0, // 전체 화면 기준
    right: -20, // 전체 화면 기준
    alignItems: 'center', // 중앙 정렬
    zIndex: 100,
  },
  // 환영 메시지 텍스트
  welcomeText: {
    fontSize: 52,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center', // 중앙 정렬
    fontFamily: 'NanumSquareRoundOTFEB', // 남산체 폰트
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  // 메뉴 텍스트
  menu: {
    fontSize: 13,
    color: 'white',
    textAlign: 'center',
    marginVertical: 10,
  },
  // 언어 선택 컨테이너 (좌측 상단 고정 위치)
  languageContainer: {
    position: 'absolute',
    top: '8%',
    left: '7%',
    zIndex: 1000,
  },
  // 언어 선택 버튼 (둥근 보더, 투명 배경, 흰색 텍스트)
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 언어 버튼 텍스트 (흰색)
  languageButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  // 언어 선택 드롭다운 메뉴
  languageMenu: {
    position: 'absolute',
    top: 45,
    left: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 120,
    overflow: 'hidden',
    zIndex: 1000,
  },
  // 언어 메뉴 항목
  languageMenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  // 활성화된 언어 메뉴 항목
  languageMenuItemActive: {
    backgroundColor: '#E3F2FD',
  },
  // 언어 메뉴 텍스트
  languageMenuText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  // 활성화된 언어 메뉴 텍스트
  languageMenuTextActive: {
    color: '#1976D2',
    fontWeight: '700',
  },
})