import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false
      }}
    >
      <Tabs.Screen 
        name='control' // 두번째 탭을 터치하면 profile/index.jsx 파일이 실행
        options={{
          title: '제어'
        }}
      />
      <Tabs.Screen 
        name='(home)' // 첫번째 탭을 터치하면 (home)/index.jsx 파일이 실행
        options={{
          title: '홈'
        }}
      />
      <Tabs.Screen 
        name='setting' // 세번째 탭을 터치하면 setting/index.jsx 파일이 실행
        options={{
          title: '설정'
        }}
      />
    </Tabs>
  )
}

export default TabLayout

const styles = StyleSheet.create({})