import { StyleSheet, TextInput, View } from 'react-native'
import { useState } from 'react'

const Input = ({
  label = '',
  color = 'black',                       // 배경색
  textColor = 'rgba(26, 155, 65, 1)',  // 글자색 props
  borderColor = 'green',                 // 테두리색
  focusBorderColor = 'white',            // 포커스시 테두리색
  size = 'large',                        // 넓이 설정 : small | medium | large
  padding = 10,
  fontSize = 18,                  
  borderRadius = 8,
  outlined = false,
  style,
  isPw = false,
  placeholderColor = 'rgba(100,100,100,0.6)', // placeholder 색상 기본값
  ...props
}) => {

  // focus 상태 관리
  const [isFocus, setIsFocus] = useState(false)

  // 사이즈별 높이 설정
  const sizeStyles = {
    small: { height: 36 },
    medium: { height: 44 },
    large: { height: 46 },
  }

  return (
    <View>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: outlined
              ? 'transparent'
              : color === 'black'
              ? 'rgba(10, 243, 41, 0.1)'
              : color,
            color: textColor,
            borderColor: isFocus ? focusBorderColor : borderColor,
            borderRadius,
            fontSize,
            paddingHorizontal: padding,
            ...sizeStyles[size],
          },
          style, // 외부 style을 나중에 적용
          // focus 상태일 때 borderColor를 강제로 다시 적용
          isFocus && { borderColor: focusBorderColor }
        ]}
      //  placeholderTextColor="rgba(255,255,255,0.5)" // placeholder도 흰색톤
        placeholderTextColor={placeholderColor} // 외부 prop 사용 
        secureTextEntry={isPw} // 비밀번호일 경우 숨김 처리
        onFocus={() => setIsFocus(true)} // focus 상태 true
        onBlur={() => setIsFocus(false)} // focus 상태 false
        {...props} // 외부에서 전달한 props (value, onChangeText 등)
      />
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    marginBottom: 8,
  },
  label: {
    marginBottom: 6,
    fontSize: 18,
    color: 'gray',
  },
})
