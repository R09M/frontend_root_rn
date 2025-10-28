import { StyleSheet, ImageBackground, View, Text } from 'react-native'
import Input1 from '@/component/Input'
import Button1 from '@/component/Button'
import { useRouter } from 'expo-router'
import bgImage from '@/assets/images/login_img.jpg'
import { useState } from 'react'
import * as SecureStore from 'expo-secure-store' 

const LoginScreen = () => {

  //입력한 아이디, 비번을 저장할 변수
  const [loginData, setLoginData] = useState({
    userId: '',
    userPw: '',
  })

  const router = useRouter()

  // 로그인 함수
  const login = async () => {
    const loginInfo = {
      userId: 'hong1234',
      userName: '홍길동',
      userRole: 'USER',
    }

    await SecureStore.setItemAsync('loginInfo', JSON.stringify(loginInfo))

    if (router.canDismiss()) {
      router.dismissAll()
    }
    router.replace('/') // 로그인후 홈스크린으로 교체이동
  }

  return (
    <ImageBackground source={bgImage} style={styles.container}>
      <View style={styles.content}>
        <Input1
          placeholder="아이디"
          value={loginData.userId}
          onChangeText={(text) =>
            setLoginData({
              ...loginData,
              userId: text,
            })
          }
        />
        <Input1
          placeholder="비밀번호"
          isPw={true}
          value={loginData.userPw}
          onChangeText={(text) =>
            setLoginData({
              ...loginData,
              userPw: text,
            })
          }
        />

        <Button1 title="로그인" onPress={login} />

        <Text style={styles.menu}>
           아이디찾기   |   비밀번호 수정   |   비밀번호찾기
        </Text>

        <Button1 title="회원가입" color="#9b3b16ff" />
      </View>
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
    marginTop : 300,
  },
  menu: {
    fontSize: 13, 
    color: 'white',
    textAlign: 'center',
    marginVertical: 10,
  },
})