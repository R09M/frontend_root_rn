import Button1 from '@/component/Button1';
import Input1 from '@/component/Input1';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ConfirmScreen = () => {

  const router = useRouter()

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>

        {/* 안내 문구 */}
        <View style={styles.titleBox}>
          <Text style={styles.titleText}>회원가입을 위해</Text>
          <Text style={styles.titleHighlight}>본인 인증이 꼭</Text>
          <Text style={styles.titleHighlight}>필요해요!</Text>
        </View>

        {/* 전화번호 입력 */}
        <View style={styles.phoneRow}>
          <Input1
            placeholder="'-'없이 숫자만 입력"
            color='rgba(245, 245, 245, 1)'
            borderColor='rgba(220, 220, 220, 1)'
            focusBorderColor="green"
            textColor="black"
            placeholderColor="gray"
            fontSize={16}
          />
        </View>

        {/* 인증번호 요청 버튼 */}
        <View style={styles.sendButton}>
          <Button1 title="인증번호 요청" 
            color="green" 
          />
        </View>

        {/* 인증번호 입력 */}
        <View style={styles.numberRow}>
          <Input1
            placeholder="인증번호 입력"
            color='rgba(245, 245, 245, 1)'
            borderColor='rgba(220, 220, 220, 1)'
            focusBorderColor="green"
            textColor="black"
            placeholderColor="gray"
            fontSize={16}
          />
        </View>

        {/* 인증완료 버튼 */}
        <View style={styles.sendButton}>
          <Button1 title="인증완료" 
            color="#9b3b16ff" 
            onPress={() => router.replace('/auth/join')}
          />
        </View>

        {/* 아이콘 */}    
        <View style={styles.icon}>
          <MaterialCommunityIcons name="cellphone-check" size={90} color="rgba(220, 220, 220, 1)" />
        </View>

      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default ConfirmScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    paddingHorizontal: 24,
    paddingTop: 50,
  },
  titleBox: {
    marginBottom: 50,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    color: 'rgba(105, 105, 105, 1)',
  },
  titleHighlight: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'rgba(105, 105, 105, 1)',
    lineHeight: 38,
  },
  input: {
    marginVertical: -8,
  },
  fixedInput: {
    width: '100%',
    flexShrink: 0, 
    minHeight: 48, 
  },
  numberRow : {
    marginTop : 30,
  },
  sendButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  icon: {
  borderColor: 'rgba(220, 220, 220, 1)',
  borderWidth: 2,          // 선 굵기 추가
  borderRadius: 80,       
  width: 160,              
  height: 160,
  justifyContent: 'center', 
  alignItems: 'center',     
  alignSelf: 'center',      
  marginTop: 50,
},
});
