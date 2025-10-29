import { StyleSheet, Text } from 'react-native'
import { Pressable } from 'react-native'


const Button = ({
  title = '버튼',
  color = 'green',
  textColor = '#fff',
  size = 'large', // small | medium | large
  padding = 10,
  fontSize = 16,
  borderRadius = 8,
  outlined = false,
  style,
  onPress = () => {},
  ...props
}) => {
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        styles.base,
        styles[size] || styles.large, // fallback 안전 처리
        {
          backgroundColor: outlined ? 'transparent' : color,
          borderColor: outlined ? color : 'transparent',
          borderWidth: outlined ? 1 : 0,
          padding,
          borderRadius,
        },
        pressed && styles.pressed,
        style,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: outlined ? color : textColor, fontSize }]}>
        {title}
      </Text>
    </Pressable>
  )
}

export default Button

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  small: {
    width: '23%',
    height: 46,
  },
  medium: {
    width: '60%',
    height: 46,
  },
  large: {
    width: '100%',
    height: 48,
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    fontWeight: '600',
  },
})