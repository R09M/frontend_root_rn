import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Pressable } from 'react-native'
import { colors } from '../constants/colorConstant'

const Button = ({title='버튼', size='large', onPress}) => {
  return (
    <Pressable
      style={({pressed}) => [
        styles.btnContainer,
        styles[size],
        pressed && styles.pressed
      ]}
      onPress={() => onPress()}
    >
      <Text>{title}</Text>
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
    height : 34
  },
  normal : {
    width : '70%',
    height : 30
  },
  pressed : {
    opacity : 0.8
  }
})