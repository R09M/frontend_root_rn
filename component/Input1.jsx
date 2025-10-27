import { StyleSheet, Text, TextInput, View } from 'react-native'
import { useState } from 'react'


const Input = ({
  label = '',
  color = 'black',        // 배경색
  textColor = 'rgba(255, 255, 255, 1)',    // 글자색
  borderColor = 'green',  // 테두리색
  size = 'large',         // small | medium | large
  padding = 10,
  fontSize = 16,
  borderRadius = 8,
  outlined = false,
  style,
  isPw = false,
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
                : color,             // 다른 색상은 그대로
            color: 'black',
            borderColor: isFocus ? 'white' : borderColor,
            borderRadius,
            fontSize,
            paddingHorizontal: padding,
            ...sizeStyles[size],
          },
          style,
        ]}
          placeholderTextColor='rgba(255,255,255,0.5)'
          secureTextEntry={isPw}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          {...props}
      />
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    marginBottom : 5,
  },
  label: {
    marginBottom: 6,
    fontSize: 16,
    color: 'white',
  },
})