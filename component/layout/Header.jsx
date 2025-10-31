import React, { useCallback, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Image, Animated } from 'react-native';
import { colors } from '../../constants/colorConstant';
import MenuPopup from './MenuPopup';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAppContext } from '../../context/AppContext';
import Ionicons from '@expo/vector-icons/Ionicons';

// 다국어 번역
const translations = {
  ko: {
    myInfo: '내 정보',
    logout: '로그아웃',
    language: 'Language',
  },
  en: {
    myInfo: 'My Info',
    logout: 'Logout',
    language: 'Language',
  },
  ja: {
    myInfo: 'マイ情報',
    logout: 'ログアウト',
    language: 'Language',
  },
  zh: {
    myInfo: '我的信息',
    logout: '登出',
    language: 'Language',
  },
};

// 언어별 이미지와 라벨
const languageConfig = {
  ko: { image: require('@/assets/images/korea.png'), label: '한국어' },
  en: { image: require('@/assets/images/usa.png'), label: 'English' },
  ja: { image: require('@/assets/images/japan.png'), label: '日本語' },
  zh: { image: require('@/assets/images/china.png'), label: '简体中文' },
};

const Header = ({ title, onBackPress, showLanguageSelector = false, showDarkModeToggle = false }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isLanguageExpanded, setIsLanguageExpanded] = useState(false);
  const router = useRouter();
  const { language, setLanguage, isDarkMode, setIsDarkMode } = useAppContext();
  const t = translations[language];

  const animatedValues = useRef({
    ko: new Animated.Value(0),
    en: new Animated.Value(0),
    ja: new Animated.Value(0),
    zh: new Animated.Value(0),
  }).current;

  useFocusEffect(
    useCallback(() => {
      setMenuVisible(false);
      setIsLanguageExpanded(false);
    }, [])
  );

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('loginInfo');
      if (router.canDismiss()) {
        router.dismissAll();
      }
      router.replace('/auth/login');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const toggleLanguageSelector = () => {
    const toValue = isLanguageExpanded ? 0 : 1;
    const otherLanguages = Object.keys(languageConfig).filter(lang => lang !== language);

    if (!isLanguageExpanded) {
      setIsLanguageExpanded(true);
      Animated.stagger(60, [
        Animated.spring(animatedValues[otherLanguages[0]], {
          toValue,
          useNativeDriver: true,
          tension: 60,
          friction: 8,
        }),
        Animated.spring(animatedValues[otherLanguages[1]], {
          toValue,
          useNativeDriver: true,
          tension: 60,
          friction: 8,
        }),
        Animated.spring(animatedValues[otherLanguages[2]], {
          toValue,
          useNativeDriver: true,
          tension: 60,
          friction: 8,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(animatedValues[otherLanguages[0]], {
          toValue,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues[otherLanguages[1]], {
          toValue,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues[otherLanguages[2]], {
          toValue,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setIsLanguageExpanded(false));
    }
  };

  const selectLanguage = (lang) => {
    setLanguage(lang);
    toggleLanguageSelector();
  };

  const menuOptions = [
    { label: t.myInfo, onPress: () => alert(t.myInfo) },
    { label: t.logout, onPress: logout, color: 'red' },
  ];

  const otherLanguages = Object.keys(languageConfig).filter(lang => lang !== language);

  return (
    <View style={[styles.header, isDarkMode && styles.headerDark]}>
      {/* 왼쪽 영역: 뒤로가기 + 다크모드 세트 */}
      <View style={styles.leftSection}>
        {/* 뒤로가기 버튼 */}
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <Text style={[styles.backButtonText, isDarkMode && styles.textDark]}>‹</Text>
        </TouchableOpacity>

        {/* 다크모드 토글 (옵션) */}
        {showDarkModeToggle && (
          <View style={styles.darkModeToggle}>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#E0E0E0', true: '#4A5568' }}
              thumbColor={isDarkMode ? '#F4F4F4' : '#FFFFFF'}
              ios_backgroundColor="#E0E0E0"
              style={styles.switch}
            />
            <Ionicons 
              name={isDarkMode ? "moon" : "sunny"} 
              size={18} 
              color={isDarkMode ? "#FFD700" : "#FFB800"} 
            />
          </View>
        )}
      </View>

      {/* 타이틀 */}
      <Text style={[styles.headerTitle, isDarkMode && styles.textDark]}>{title}</Text>

      {/* 오른쪽 영역: 언어 선택 + 메뉴 버튼 */}
      <View style={styles.rightSection}>
        {/* 언어 선택 (옵션) */}
        {showLanguageSelector && (
          <View style={styles.languageSelectorContainer}>
            <TouchableOpacity
              style={styles.currentLanguageButton}
              onPress={toggleLanguageSelector}
              activeOpacity={0.7}
            >
              <Text style={styles.languageTopLabel}>{t.language}</Text>
              <View style={styles.currentFlag}>
                <Image
                  source={languageConfig[language].image}
                  style={styles.flagImage}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.currentLabel}>{languageConfig[language].label}</Text>
            </TouchableOpacity>

            {isLanguageExpanded && (
              <>
                {otherLanguages.map((lang, index) => (
                  <Animated.View
                    key={lang}
                    style={[
                      styles.languageOptionVertical,
                      {
                        top: 55 + (index * 40),
                        opacity: animatedValues[lang],
                        transform: [
                          {
                            translateY: animatedValues[lang].interpolate({
                              inputRange: [0, 1],
                              outputRange: [-20, 0],
                            }),
                          },
                          {
                            scale: animatedValues[lang],
                          },
                        ],
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.languageOptionButton}
                      onPress={() => selectLanguage(lang)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.optionFlag}>
                        <Image
                          source={languageConfig[lang].image}
                          style={styles.flagImage}
                          resizeMode="cover"
                        />
                      </View>
                      <Text style={styles.optionLabel}>
                        {languageConfig[lang].label}
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </>
            )}
          </View>
        )}

        {/* 메뉴 버튼 */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuVisible(!menuVisible)}
        >
          <Text style={[styles.menuButtonText, isDarkMode && styles.textDark]}>⋮</Text>
        </TouchableOpacity>
      </View>

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
  headerDark: {
    backgroundColor: '#2D2D2D',
    borderBottomColor: '#404040',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -4,
  },
  backButtonText: {
    fontSize: 32,
    color: colors.GRAY_700,
  },
  darkModeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: -16,
    marginTop: 5,
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.GRAY_700,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: -1,
  },
  languageSelectorContainer: {
    position: 'relative',
    width: 50,
    height: 50,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: -15,
  },
  currentLanguageButton: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  languageTopLabel: {
    fontSize: 10,
    color: '#004cf1ff',
    fontWeight: '500',
    marginBottom: 2,
  },
  currentFlag: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#1452ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    padding: 2,
  },
  currentLabel: {
    fontSize: 10,
    color: '#1452ff',
    fontWeight: '600',
    marginTop: 2,
  },
  languageOptionVertical: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 5,
    alignItems: 'center',
  },
  languageOptionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionFlag: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    padding: 2,
  },
  optionLabel: {
    fontSize: 9,
    color: '#646fd8ff',
    fontWeight: '500',
    marginTop: 2,
  },
  flagImage: {
    width: '100%',
    height: '76%',
    borderRadius: 1,
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
  textDark: {
    color: '#FFFFFF',
  },
});