import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
// 아이콘회사
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
// Context import 추가
import { useAppContext } from '../../context/AppContext';

// 다국어 번역 추가
const tabTranslations = {
  ko: { control: '제어', home: '홈', setting: '설정' },
  en: { control: 'Control', home: 'Home', setting: 'Setting' },
  ja: { control: '制御', home: 'ホーム', setting: '設定' },
  zh: { control: '控制', home: '主页', setting: '设置' },
};

// 커스텀 TabBarButton - 소라색 오버레이 제거
const TabBarButton = (props) => {
  return (
    <Pressable
      {...props}
      android_ripple={{ color: 'transparent' }} // Android 리플 효과 제거
      style={({ pressed }) => [
        props.style,
        {
          backgroundColor: 'transparent', // 배경 투명 유지
        }
      ]}
    />
  )
}

const TabLayout = () => {
  // Context에서 언어와 다크모드 가져오기
  const { language, isDarkMode } = useAppContext();
  const t = tabTranslations[language];

  return (
    <Tabs
      initialRouteName="(home)"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDarkMode ? '#90EE90' : 'green', // 다크모드에서 연두색
        tabBarInactiveTintColor: isDarkMode ? '#FFFFFF' : 'gray', // 다크모드에서 흰색
        tabBarButton: (props) => <TabBarButton {...props} />, // 커스텀 버튼으로 소라색 제거
        tabBarStyle: {
          position: 'absolute', // 절대 위치로 고정
          backgroundColor: isDarkMode ? '#2D2D2D' : '#FFFFFF', // 다크모드에 따라 배경색 변경
          borderTopWidth: 0, // 상단 테두리 제거
          elevation: 8, // Android 그림자
          shadowColor: '#000', // iOS 그림자
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: isDarkMode ? 0.3 : 0.1, // 다크모드에서 그림자 진하게
          shadowRadius: 8,
          height: 85, // 탭바 높이 유지
          paddingBottom: 25, // 하단 여백 증가 (홈바 공간 확보)
          paddingTop: 5, // 상단 여백 줄임
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 2, // 아이콘과 라벨 사이 간격 줄임
          marginBottom: 0,
        },
        tabBarItemStyle: {
          justifyContent: 'center', // 세로 중앙 정렬
          alignItems: 'center', // 가로 중앙 정렬
          paddingVertical: 0, // 상하 여백 제거하여 더 위로
          paddingTop: 2, // 위쪽으로 조금만 여백
        },
      }}
    >
      <Tabs.Screen 
        name='control'
        options={{
          title: t.control, // 다국어 적용
          tabBarIcon: ({ focused, color }) => (
            <MaterialIcons 
              name={focused ? "settings-power" : "power-settings-new"} 
              size={30} 
              color={focused ? (isDarkMode ? "#90EE90" : "green") : (isDarkMode ? "#FFFFFF" : "gray")} 
            />
          )
        }}
      />

      <Tabs.Screen 
        name='(home)'
        options={{
          title: t.home, // 다국어 적용
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons 
              name={focused ? "leaf-circle" : "leaf-circle-outline"} 
              size={30} 
              color={focused ? (isDarkMode ? "#90EE90" : "green") : (isDarkMode ? "#FFFFFF" : "gray")} 
            />
          )
        }}
      />

      <Tabs.Screen 
        name='setting'
        options={{
          title: t.setting, // 다국어 적용
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons 
              name={focused ? "cog" : "cog-outline"} 
              size={30} 
              color={focused ? (isDarkMode ? "#90EE90" : "green") : (isDarkMode ? "#FFFFFF" : "gray")} 
            />
          )
        }}
      />
    </Tabs>
  )
}

export default TabLayout

const styles = StyleSheet.create({
})