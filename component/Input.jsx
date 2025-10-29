import { StyleSheet, Text, View, TextInput } from 'react-native'
import React, { useState } from 'react'
import { colors } from '../constants/colorConstant';

const Input = ({
  label='', 
  isPw=false,
  value='',
  onChangeText,
  placeholder='',
  editable=true,
  ...props
}) => {
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

        value={value}
        onChangeText={onChangeText} //타이핑 시 
        placeholder={placeholder}
        secureTextEntry={isPw} // 비밀번호 
        editable={editable} // 수정 가능 여부
        {...props}
      />
    </View>
  );
};

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
  },
  disabled : {
    backgroundColor : colors.GRAY_100,
    color : colors.GRAY_500
  }
})