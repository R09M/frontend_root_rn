import { StyleSheet, ImageBackground, Text, Alert, 
  Keyboard, // 🔹키보드 이벤트를 감지하기 위한 API
  Animated  // 🔹애니메이션 효과를 위한 API
} from 'react-native'
import Input1 from '@/component/Input1'
import Button1 from '@/component/Button1'
import { useRouter } from 'expo-router'
import bgImage from '@/assets/images/login_img.jpg'
import { useState, useEffect, useRef } from 'react' // 🔹useEffect, useRef 추가
import * as SecureStore from 'expo-secure-store'
import axios from 'axios'
import { SERVER_URL } from '@/constants/appConst'

const LoginScreen = () => {
  
  const router = useRouter()
  
  // 🔹marginTop을 애니메이션으로 제어하기 위한 Animated Value 생성
  // 🔹초기값은 300 (원래 marginTop 값)
  const marginTopAnim = useRef(new Animated.Value(300)).current
  
  // 아이디, 비밀번호 입력값을 저장할 State변수선언
  const [loginData, setLoginData] = useState({
    userId: '',
    userPw: '',
  })

  // 🔹컴포넌트가 마운트될 때 키보드 이벤트 리스너 등록
  useEffect(() => {
    // 🔹키보드가 나타날 때 실행되는 이벤트 리스너
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        // 🔹marginTop을 300에서 150으로 부드럽게 애니메이션
        Animated.timing(marginTopAnim, {
          toValue: 150,  // 🔹목표값: 150
          duration: 300,  // 🔹애니메이션 지속시간: 300ms
          useNativeDriver: false,  
        }).start()
      }
    )

    // 🔹키보드가 사라질 때 실행되는 이벤트 리스너
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        // 🔹marginTop을 다시 300으로 복원
        Animated.timing(marginTopAnim, {
          toValue: 300,  // 🔹원래값: 300
          duration: 300,  // 🔹애니메이션 지속시간: 300ms
          useNativeDriver: false,
        }).start()
      }
    )

    // 🔹컴포넌트가 언마운트될 때 리스너 제거
    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [marginTopAnim])  

  // 로그인 요청 함수
  const login = async () => {
    try {
      // appConst.js를 이용하여 팀장의 절대경로로 설정
      const res = await axios.post(`${SERVER_URL}/users/login`, loginData)
      console.log(res.data)
      if (res.data && res.data.userId) {
        Alert.alert('로그인 성공', '정상적으로 로그인되었습니다.')
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
        Alert.alert('로그인 실패', '아이디 또는 비밀번호가 일치하지 않습니다.')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <ImageBackground source={bgImage} style={styles.container}>
      {/* 🔹View를 Animated.View로 변경하고, marginTop을 동적으로 제어 */}
      <Animated.View style={[styles.content, { marginTop: marginTopAnim }]}>
        <Input1
          placeholder="아이디"
          value={loginData.userId}
          onChangeText={(text) =>
            setLoginData((prev) => ({ ...prev, userId: text }))
          }
          textColor="white" 
          fontSize={18}
        />
        <Input1
          placeholder="비밀번호"
          isPw={true}
          value={loginData.userPw}
          onChangeText={(text) =>
            setLoginData((prev) => ({ ...prev, userPw: text }))
          }
          textColor="white"
          fontSize={18}
        />
        <Button1 title="로그인" onPress={login} />
        <Text style={styles.menu}>
          아이디찾기 | 비밀번호 수정 | 비밀번호찾기
        </Text>
        <Button1 
          title="회원가입" 
          color="#9b3b16ff" 
          onPress={() => router.replace('/auth/join')} 
        />
      </Animated.View>
    </ImageBackground>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover', // 배경이미지 꽉차게
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '70%',
  },
  menu: {
    fontSize: 13,
    color: 'white',
    textAlign: 'center',
    marginVertical: 10,
  },
})