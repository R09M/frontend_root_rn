import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../constants/colorConstant';

const Input = ({label='', isPw=false}) => {
  //input 태그의 focus 여부를 저장하는 변수
  const [isFocus, setIsFocus] = useState(false);


  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput 
        style={[styles.input, isFocus && styles.focused]}
        //focus 상태일 때 실행 함수
        onFocus={() => setIsFocus(true)}
        //focus를 잃을 때 실행 함수
        onBlur={() => setIsFocus(false)}
      />
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
  input : {
    borderColor : colors.GRAY_600,
    borderWidth : 1,
    height : 40,
    borderRadius : 8,
    paddingHorizontal : 10
  },
  label : {
    marginBottom : 6,
    fontSize : 16,
    color : colors.GRAY_600,
  },
  focused : {
    borderColor : colors.BLACK
  }
})