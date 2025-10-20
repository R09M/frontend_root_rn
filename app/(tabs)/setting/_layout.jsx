import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const SettingLayout = () => {
  return (
    <Stack 
      screenOptions={{
        headerShown: false
      }}
    />
  )
}

export default SettingLayout

const styles = StyleSheet.create({})