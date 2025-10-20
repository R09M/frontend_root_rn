import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const ControlLayout = () => {
  return (
    <Stack 
      screenOptions={{
        headerShown: false
      }}
    />
  )
}

export default ControlLayout

const styles = StyleSheet.create({})