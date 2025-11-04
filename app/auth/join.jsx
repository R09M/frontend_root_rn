import Button1 from '@/component/Button1'
import Input1 from '@/component/Input1'
import { useRouter } from 'expo-router'
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet, Text, TouchableWithoutFeedback, View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const JoinScreen = () => {

  const router = useRouter()

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={{ flex: 1 }}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            
            <View style={styles.titleBox}>
              <Text style={styles.title}>회원가입(Join)</Text>
              <Text style={styles.titleText}>모든 항목은 필수 입력사항입니다.</Text>
            </View>

            <View>
              <Text style={styles.Label}>이름 (필수)</Text>
              <Input1 
                name='userName'
                color='rgba(245, 245, 245, 1)'
                borderColor='rgba(220, 220, 220, 1)'
                focusBorderColor="green"
                textColor="rgba(66, 66, 66, 1)"
                fontSize={18}
              />
            </View>  

            <View style={styles.id}>  
              <Text style={styles.Label}>아이디 (필수)</Text>  
              <View style={styles.confirm}>
                <View style={{ flex: 1 }}>
                  <Input1  
                    name="userId"     
                    color='rgba(245, 245, 245, 1)'          
                    borderColor='rgba(220, 220, 220, 1)'
                    focusBorderColor="green"
                    textColor="rgba(66, 66, 66, 1)"
                    fontSize={18} 
                    size="large"
                  />
                </View>
                <Button1 title="중복확인" size="small" />
              </View>
            </View> 

            <View>
              <Text style={styles.Label}>비밀번호 (필수)</Text>  
              <Input1 
                name="userPw"
                color='rgba(245, 245, 245, 1)'
                borderColor='rgba(220, 220, 220, 1)'
                focusBorderColor="green"
                textColor="rgba(66, 66, 66, 1)"
                fontSize={18} 
                isPw={true}
              />
            </View>

            <View>
              <Text style={styles.Label}>비밀번호 확인 (필수)</Text>
              <Input1 
                name='userPwConfirm'
                color='rgba(245, 245, 245, 1)'
                borderColor='rgba(220, 220, 220, 1)'
                focusBorderColor="green"
                textColor="rgba(66, 66, 66, 1)"
                fontSize={18}           
                isPw={true}
              />
            </View>

            <View style={styles.confirmButton}>
              <Button1 
                title="핸드폰 인증하기 필수" 
                color="green" 
                onPress={() => router.replace('/auth/confirm')} 
              />
            </View>

            <View style={styles.phone}>
              <Text style={styles.Label}>스마트폰 (필수)</Text> 
              <View style={styles.phoneRow}>
                <Input1 
                  name='userTelArr'
                  color="rgba(245, 245, 245, 1)"
                  borderColor="rgba(220, 220, 220, 1)"
                  focusBorderColor="green"
                  textColor="rgba(66, 66, 66, 1)"
                  fontSize={18}
                  style={styles.phoneInput}
                  keyboardType="numeric"
                  maxLength={3}
                /> 
                <Text style={styles.hyphen}>-</Text>
                <Input1 
                  name='userTelArr'
                  color="rgba(245, 245, 245, 1)"
                  borderColor="rgba(220, 220, 220, 1)"
                  focusBorderColor="green"
                  textColor="rgba(66, 66, 66, 1)"
                  fontSize={18}
                  style={styles.phoneInput}
                  keyboardType="numeric"
                  maxLength={4}
                /> 
                <Text style={styles.hyphen}>-</Text>
                <Input1 
                  name='userTelArr'
                  color="rgba(245, 245, 245, 1)"
                  borderColor="rgba(220, 220, 220, 1)"
                  focusBorderColor="green"
                  textColor="rgba(66, 66, 66, 1)"
                  fontSize={18}
                  style={styles.phoneInput}
                  keyboardType="numeric"
                  maxLength={4}
                /> 
              </View>
            </View>        

            <View style={styles.email}>
              <Text style={styles.Label}>이메일 (필수)</Text> 
              <View style={styles.emailRow}>
                <Input1 
                  name='firstEmail'
                  color="rgba(245, 245, 245, 1)"
                  borderColor="rgba(220, 220, 220, 1)"
                  focusBorderColor="green"
                  textColor="rgba(66, 66, 66, 1)"
                  fontSize={18}
                  style={styles.emailInput}
                  maxLength={10}
                /> 
                <Text style={styles.hyphen}>@</Text>
                <Input1 
                  name='secondEmail'
                  color="rgba(245, 245, 245, 1)"
                  borderColor="rgba(220, 220, 220, 1)"
                  focusBorderColor="green"
                  textColor="rgba(66, 66, 66, 1)"
                  fontSize={18}
                  style={styles.emailInput}
                  maxLength={10}
                /> 
              </View>
            </View>        

            <View style={styles.sendButton}>
              <Button1 
                title="회원가입 완료" 
                color="rgba(155, 59, 22, 1)" 
                onPress={() => router.replace('/')} 
              />
            </View>
          
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

export default JoinScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 50,
  },
  titleBox: {
    marginBottom: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'rgba(105, 105, 105, 1)',
  },
  titleText: {
    fontSize: 20,
    color: 'rgba(105, 105, 105, 1)',
  },
  confirm: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    gap: 10,
  },
  Label: {
    fontSize: 14,
    color: 'rgba(51, 51, 51, 1)',
    marginBottom: 4,
  },
  phone: {
    marginTop: 4,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',  
    justifyContent: 'center', 
    gap: 10, 
  },
  phoneInput: {
    width: 104, 
    height: 45,
    textAlign: 'center',
    borderRadius: 8,
  },
  hyphen: {
    fontSize: 20,
    color: 'rgba(51, 51, 51, 1)',
    textAlignVertical: 'center',
  },
  email: {
    marginTop: 4,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',  
    justifyContent: 'center', 
    gap: 10, 
  },
  emailInput: {
    width: 162, 
    height: 45,
    textAlign: 'center',
    borderRadius: 8,
  },
  sendButton: {
    marginTop: 20,
  },
  confirmButton: {
    marginTop: 20,
  },
})
