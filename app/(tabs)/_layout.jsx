import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
// 아이콘회사
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor : 'green'
      }}
    >
      <Tabs.Screen 
        name='control' // 두번째 탭을 터치하면 profile/index.jsx 파일이 실행
        options={{
          title: '제어',
          // 들어감
          // tabBarIcon : () => <MaterialIcons name="settings-power" size={28} color="green" />
          // 안 들어감
          tabBarIcon : () => <MaterialIcons name="power-settings-new" size={30} color="gray" />
        }}
      />
      <Tabs.Screen 
        name='(home)' // 첫번째 탭을 터치하면 (home)/index.jsx 파일이 실행
        options={{
          title: '홈',
          // 들어감
          tabBarIcon : () => <MaterialCommunityIcons name="leaf-circle" size={30} color="green" />
          // 안 들어감
          // tabBarIcon : () => <MaterialCommunityIcons name="leaf-circle-outline" size={24} color="gray" />
        }}
      />
      <Tabs.Screen 
        name='setting' // 세번째 탭을 터치하면 setting/index.jsx 파일이 실행
        options={{
          title: '설정',
          // 들어감
          // tabBarIcon : () => <MaterialCommunityIcons name="cog" size={30} color="green" />
          // 안 들어감
          tabBarIcon : () => <MaterialCommunityIcons name="cog-outline" size={30} color="gray" />
        }}
      />
    </Tabs>
  )
}

export default TabLayout

const styles = StyleSheet.create({


})