import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Input1 from '@/component/Input1'
import Button1 from '@/component/Button1'
import { useRouter } from 'expo-router'

const JoinScreen = () => {

  const router = useRouter()

  return (
    <TouchableWithoutFeedback>
      <SafeAreaView style={styles.container}>
        
        <View style={styles.titleBox}>
          <Text style={styles.title}>회원가입(Join)</Text>
          <Text style={styles.titleText}>"모든 항목은 필수 입력사항입니다."</Text>
        </View>

        <View>
          <Text>이름 (필수)</Text>
          <Input1 
            color = 'rgba(245, 245, 245, 1)'
            borderColor ='rgba(220, 220, 220, 1)'
            focusBorderColor="green"
            textColor="rgba(66, 66, 66, 1)"
            fontSize={18}
          />
        </View>  

        <View style={styles.id}>  
          <Text>아이디 (필수)</Text>  
          <View style={styles.confirm}>
            <View style={{ flex: 1 }}>
              <Input1       
              color = 'rgba(245, 245, 245, 1)'          
              borderColor ='rgba(220, 220, 220, 1)'
              focusBorderColor="green"
              textColor="rgba(66, 66, 66, 1)"
              fontSize={18} 
              size="large"  // 부모의 남는 공간만큼만 차지
              />
            </View>
            <Button1 title="중복확인" size="small" />
          </View>
        </View> 

        <View>
          <Text>비밀번호 (필수)</Text>  
          <Input1 
          color = 'rgba(245, 245, 245, 1)'
          borderColor ='rgba(220, 220, 220, 1)'
          focusBorderColor="green"
          textColor="rgba(66, 66, 66, 1)"
          fontSize={18} 
          isPw={true}/>
        </View>
        <View>
          <Text>비밀번호 확인 (필수)</Text>
          <Input1 
          color = 'rgba(245, 245, 245, 1)'
          borderColor ='rgba(220, 220, 220, 1)'
          focusBorderColor="green"
          textColor="rgba(66, 66, 66, 1)"
          fontSize={18}           
          isPw={true}/>
        </View>

      {/* 핸드폰 본인인증 */}
      <View style={styles.confirmButton}>
        <Button1 title="핸드폰 본인인증 가기" 
          color="green" 
          onPress={() => router.replace('/auth/confirm')}
        />
      </View>

    <View style={styles.phone}>
      <Text style={styles.phoneLabel}>스마트폰 (필수)</Text> 
      <View style={styles.phoneRow}>
        <Input1 
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

        <View style={styles.sendButton}>
          <Button1 title="회원가입 완료" 
            color="#9b3b16ff" 
            onPress={() => router.replace('/')} />
        </View>

      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

export default JoinScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  titleBox : {
    marginBottom: 30,
    alignItems: 'center',
  },
  title : {
    fontSize: 25,
    fontWeight : 'bold',
    color: '#696969ff',
  },
  titleText : {
    fontSize: 20,
    color: '#696969ff',
  },
  confirm : {
    flexDirection : 'row',
    justifyContent: 'space-between', 
    gap : 10,
  },
  confirmButton : {
    marginTop : 18, 
    marginBottom : 8, 
  },
  number : {
    flexDirection : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',  
    gap : 8,
  },
  phone: {
    marginTop: 12,
  },
  phoneLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
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
    color: '#333',
    textAlignVertical: 'center',
  },
  sendButton : {
    marginTop : 20,
  },
})