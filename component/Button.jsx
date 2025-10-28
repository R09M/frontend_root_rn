import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Pressable } from 'react-native'
import { colors } from '../constants/colorConstant'

const Button = ({
  title='버튼', 
  size='large', 
  onPress
}) => {
  return (
    <Pressable
      style={({pressed}) => [
        styles.btnContainer,
        styles[size],
        pressed && styles.pressed
      ]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  )
}

export default Button

const styles = StyleSheet.create({
  btnContainer : {
    backgroundColor : colors.BLUE_300,
    borderRadius : 8,
    justifyContent : 'center',
    alignItems : 'center'
  },
  large : {
    width : '100%',
    height : 54
  },
  normal : {
    width : 'auto',
    height : 44
  },
  small: {     
    width: 'auto',
    minWidth: 80,
    height: 36,
  },
  pressed : {
    opacity : 0.7
  }
})