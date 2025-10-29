// Header.js
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../constants/colorConstant';
import MenuPopup from './MenuPopup';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect, useRouter } from 'expo-router';

const Header = ({ title, onBackPress }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      setMenuVisible(false); // 화면이 포커스될 때 메뉴 닫기
    }, [])
  );

  // 로그아웃 함수
  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('loginInfo');
      if (router.canDismiss()) {
        router.dismissAll();
      }
      router.replace('/auth/login'); // 로그인 페이지로 이동
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const menuOptions = [
    { label: '내 정보', onPress: () => alert('내 정보 클릭') },
    { label: '로그아웃', onPress: logout, color: 'red' },
  ];

  return (
    <View style={styles.header}>
      {/* 뒤로가기 버튼 */}
      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <Text style={styles.backButtonText}>‹</Text>
      </TouchableOpacity>

      {/* 타이틀 */}
      <Text style={styles.headerTitle}>{title}</Text>

      {/* 메뉴 버튼 */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setMenuVisible(!menuVisible)}
      >
        <Text style={styles.menuButtonText}>⋮</Text>
      </TouchableOpacity>

      {/* 메뉴 팝업 */}
      {menuVisible && (
        <MenuPopup options={menuOptions} onClose={() => setMenuVisible(false)} />
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.GRAY_200,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_200,
    position: 'relative',
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 32,
    color: colors.GRAY_700,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.GRAY_700,
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButtonText: {
    fontSize: 24,
    color: colors.GRAY_700,
  },
});
