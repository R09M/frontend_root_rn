import Button1 from '@/component/Button1';
import Input1 from '@/component/Input1';
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

        {/* 이름 입력 */}
        <Input1
          placeholder="이름(핸드폰 가입자명) 입력"
          color='rgba(245, 245, 245, 1)'
          borderColor='rgba(220, 220, 220, 1)'
          focusBorderColor="green"
          textColor="black"
          placeholderColor="gray"
          fontSize={16}
          style={[styles.input, styles.fixedInput]}
        />

        {/* 통신사 선택 */}
        <View style={styles.carrierRow}>
          <Button1 title="SKT" size="small" />
          <Button1 title="KT" size="small" />
          <Button1 title="LG U+" size="small" />
          <Button1 title="알뜰폰" size="small" />
        </View>

        {/* 전화번호 입력 */}
        <View style={styles.phoneRow}>
          <Text style={styles.phonePrefix}>010</Text>
          <Text style={styles.hyphen}>-</Text>
          <View style={{ flex: 1 }}>
            <Input1
              placeholder="'-' 없이 핸드폰 숫자만 입력"
              color='rgba(245, 245, 245, 1)'
              borderColor='rgba(220, 220, 220, 1)'
              focusBorderColor="green"
              textColor="black"
              placeholderColor="gray"
              fontSize={16}
              style={[styles.input, styles.fixedInput]}
            />
          </View>
        </View>

        {/* 전송 버튼 */}
        <View style={styles.sendButton}>
          <Button1 title="본인인증 완료" 
            color="#9b3b16ff" 
            onPress={() => router.replace('/auth/join')}
          />
        </View>

      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default ConfirmScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 50,
  },
  titleBox: {
    marginBottom: 50,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    color: '#696969ff',
  },
  titleHighlight: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#696969ff',
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
  hyphen: {
    fontSize: 20,
    color: '#888',
    marginHorizontal: 8,
  },
  carrierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    marginBottom: 28,
    gap: 8,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phonePrefix: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#696969ff',
  },
  sendButton: {
    marginTop: 20,
    alignItems: 'center',
  },
});
