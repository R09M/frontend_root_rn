import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Switch, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// 아이콘 라이브러리 import
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// 커스텀 컴포넌트
import Header from '../../../component/layout/Header';
import { useAppContext } from '../../../context/AppContext';

// 외부 라이브러리 import
import dayjs from 'dayjs';

// 상수 import
import { colors } from '../../../constants/colorConstant';

// ============================================
// Mock 데이터
// ============================================
const mockSensorData = {
  temperature: 24.7,
  humidity: 60.5,
  soil_moisture: 31.8,
  light_value: 888,
  last_update: new Date(),
};

const mockControlCnt = {
  motionDetectedCnt: 7,
  fanMotorCnt: 15,
  waterPumpCnt: 4,
  ledLightCnt: 9,
  lastMotionDate: new Date(),
};

// ============================================
// 다국어 번역 데이터 (한국어, 영어, 일본어, 중국어)
// ============================================
const translations = {
  ko: {
    title: '홈 화면 (Mock)',
    welcome: '환영합니다',
    loading: '센서 데이터를 불러오는 중...',
    envUpdate: '마지막 업데이트',
    temperature: '온도',
    humidity: '습도',
    soil: '토양',
    light: '조도',
    motionUpdate: '모션감지센서 마지막 작동 : ',
    motionDetect: '모션 감지',
    ledLight: 'LED 조명',
    waterPump: '물펌프',
    fan: '환풍기',
    times: '회',
    measuring: '측정 중...',
    language: 'Language',
  },
  en: {
    title: 'Home (Mock)',
    welcome: 'Welcome',
    loading: 'Loading sensor data...',
    envUpdate: 'Data Last Update',
    temperature: 'Temperature',
    humidity: 'Humidity',
    soil: 'Soil',
    light: 'Light',
    motionUpdate: 'Motion Sensor Last Activity : ',
    motionDetect: 'Motion Detect',
    ledLight: 'LED Light',
    waterPump: 'Water Pump',
    fan: 'Fan',
    times: 'times',
    measuring: 'Measuring...',
    language: 'Language',
  },
  ja: {
    title: 'ホーム (Mock)',
    welcome: 'こんにちは',
    loading: 'センサーデータを読み込み中...',
    envUpdate: '最終更新',
    temperature: '温度',
    humidity: '湿度',
    soil: '土壌',
    light: '照度',
    motionUpdate: 'モーションセンサー最終動作 : ',
    motionDetect: 'モーション検知',
    ledLight: 'LED照明',
    waterPump: 'ウォーターポンプ',
    fan: '換気扇',
    times: '回',
    measuring: '測定中...',
    language: 'Language',
  },
  zh: {
    title: '主页 (Mock)',
    welcome: '欢迎',
    loading: '正在加载传感器数据...',
    envUpdate: '最后更新',
    temperature: '温度',
    humidity: '湿度',
    soil: '土壤',
    light: '光照',
    motionUpdate: '运动传感器最后活动 : ',
    motionDetect: '运动检测',
    ledLight: 'LED灯',
    waterPump: '水泵',
    fan: '风扇',
    times: '次',
    measuring: '测量中...',
    language: 'Language',
  },
};

// 언어별 이미지와 라벨 매핑
const languageConfig = {
  ko: { image: require('@/assets/images/korea.png'), label: '한국어' },
  en: { image: require('@/assets/images/usa.png'), label: 'English' },
  ja: { image: require('@/assets/images/japan.png'), label: '日本語' },
  zh: { image: require('@/assets/images/china.png'), label: '简体中文' },
};

/**
 * ============================================
 * HomeMockScreen 컴포넌트
 * ============================================
 */
const HomeMockScreen = () => {
  // ============================================
  // 훅 및 상태 관리
  // ============================================
  const router = useRouter();

  // Context에서 다크모드와 언어 가져오기
  const { language, setLanguage, isDarkMode, setIsDarkMode } = useAppContext();
  
  // 현재 선택된 언어의 번역 객체
  const t = translations[language];
  
  // Mock 데이터 사용
  const sensorData = mockSensorData;
  const controlCnt = mockControlCnt;

  // 언어 선택 팝업 상태
  const [isLanguageExpanded, setIsLanguageExpanded] = useState(false);
  
  // 애니메이션 값
  const animatedValues = useRef({
    ko: new Animated.Value(0),
    en: new Animated.Value(0),
    ja: new Animated.Value(0),
    zh: new Animated.Value(0),
  }).current;

  // ============================================
  // 언어 선택 팝업 토글 함수
  // ============================================
  const toggleLanguageSelector = () => {
    const toValue = isLanguageExpanded ? 0 : 1;

    // 현재 선택된 언어를 제외한 나머지 언어들
    const otherLanguages = Object.keys(languageConfig).filter(lang => lang !== language);

    if (!isLanguageExpanded) {
      // 펼치기
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
      // 접기
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

  // ============================================
  // 언어 선택 함수
  // ============================================
  const selectLanguage = (lang) => {
    setLanguage(lang);
    toggleLanguageSelector();
  };

  // 현재 선택된 언어를 제외한 나머지 언어들
  const otherLanguages = Object.keys(languageConfig).filter(lang => lang !== language);

  // ============================================
  // 메인 화면 렌더링
  // ============================================
  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Header title={t.title} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* 상단바 */}
        <View style={styles.topBar}>
          <View style={styles.leftSection}>
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
          </View>
          
          {/* welcomeText를 topBar 바로 아래로 이동 */}
          <Text style={[styles.welcomeText, isDarkMode && styles.darkText]}>{t.welcome}</Text>
        </View>

        {/* 언어 선택 팝업 - topBar와 같은 라인에 위치 */}
        <View style={styles.languageSelectorWrapper}>
          <View style={styles.languageSelectorContainer}>
            {/* 현재 선택된 언어 버튼 */}
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

            {/* 다른 언어 옵션들 (애니메이션) - 아래로 수직 배치 */}
            {isLanguageExpanded && (
              <>
                {/* 첫 번째 옵션 */}
                <Animated.View
                  style={[
                    styles.languageOptionVertical,
                    {
                      top: 55,
                      opacity: animatedValues[otherLanguages[0]],
                      transform: [
                        {
                          translateY: animatedValues[otherLanguages[0]].interpolate({
                            inputRange: [0, 1],
                            outputRange: [-20, 0],
                          }),
                        },
                        {
                          scale: animatedValues[otherLanguages[0]],
                        },
                      ],
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.languageOptionButton}
                    onPress={() => selectLanguage(otherLanguages[0])}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionFlag}>
                      <Image
                        source={languageConfig[otherLanguages[0]].image}
                        style={styles.flagImage}
                        resizeMode="cover"
                      />
                    </View>
                    <Text style={styles.optionLabel}>
                      {languageConfig[otherLanguages[0]].label}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>

                {/* 두 번째 옵션 */}
                <Animated.View
                  style={[
                    styles.languageOptionVertical,
                    {
                      top: 95,
                      opacity: animatedValues[otherLanguages[1]],
                      transform: [
                        {
                          translateY: animatedValues[otherLanguages[1]].interpolate({
                            inputRange: [0, 1],
                            outputRange: [-20, 0],
                          }),
                        },
                        {
                          scale: animatedValues[otherLanguages[1]],
                        },
                      ],
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.languageOptionButton}
                    onPress={() => selectLanguage(otherLanguages[1])}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionFlag}>
                      <Image
                        source={languageConfig[otherLanguages[1]].image}
                        style={styles.flagImage}
                        resizeMode="cover"
                      />
                    </View>
                    <Text style={styles.optionLabel}>
                      {languageConfig[otherLanguages[1]].label}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>

                {/* 세 번째 옵션 */}
                <Animated.View
                  style={[
                    styles.languageOptionVertical,
                    {
                      top: 135,
                      opacity: animatedValues[otherLanguages[2]],
                      transform: [
                        {
                          translateY: animatedValues[otherLanguages[2]].interpolate({
                            inputRange: [0, 1],
                            outputRange: [-20, 0],
                          }),
                        },
                        {
                          scale: animatedValues[otherLanguages[2]],
                        },
                      ],
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.languageOptionButton}
                    onPress={() => selectLanguage(otherLanguages[2])}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionFlag}>
                      <Image
                        source={languageConfig[otherLanguages[2]].image}
                        style={styles.flagImage}
                        resizeMode="cover"
                      />
                    </View>
                    <Text style={styles.optionLabel}>
                      {languageConfig[otherLanguages[2]].label}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              </>
            )}
          </View>
        </View>

        {/* 환경 데이터 업데이트 시간 */}
        <View style={[styles.infoCard, isDarkMode && styles.darkInfoCard]}>
          <MaterialIcons name="info" size={20} color={isDarkMode ? "#64B5F6" : "#235effff"} />
          <Text style={[styles.infoText, isDarkMode && styles.darkInfoText]}>
            {t.envUpdate} : {dayjs(sensorData.last_update).format('YYYY-MM-DD HH:mm:ss')}
          </Text>
        </View>

        {/* 온도 센서 */}
        <TouchableOpacity 
          style={[styles.settingCard, isDarkMode && styles.darkCard]}
          onPress={() => router.push('/setting')}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: '#FFEBEE' }]}>
              <MaterialCommunityIcons name="thermometer" size={24} color="#FF5252" />
            </View>
            <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>{t.temperature}</Text>
            <Text style={[styles.cardValue, styles.sensorValue, isDarkMode && styles.darkText]}>
              {sensorData.temperature !== null ? `${parseFloat(sensorData.temperature).toFixed(1)}°C` : t.measuring}
            </Text>
            <Ionicons name="chevron-forward" size={24} color={isDarkMode ? "#B0B0B0" : "#999"} style={styles.chevron} />
          </View>
        </TouchableOpacity>

        {/* 습도 센서 */}
        <TouchableOpacity 
          style={[styles.settingCard, isDarkMode && styles.darkCard]}
          onPress={() => router.push('/setting')}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: '#E0F7FA' }]}>
              <Ionicons name="water" size={24} color="#00BCD4" />
            </View>
            <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>{t.humidity}</Text>
            <Text style={[styles.cardValue, styles.sensorValue, isDarkMode && styles.darkText]}>
              {sensorData.humidity !== null ? `${parseFloat(sensorData.humidity).toFixed(1)}%` : t.measuring}
            </Text>
            <Ionicons name="chevron-forward" size={24} color={isDarkMode ? "#B0B0B0" : "#999"} style={styles.chevron} />
          </View>
        </TouchableOpacity>

        {/* 토양 습도 센서 */}
        <TouchableOpacity 
          style={[styles.settingCard, isDarkMode && styles.darkCard]}
          onPress={() => router.push('/setting')}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
              <MaterialCommunityIcons name="sprout" size={24} color="#4CAF50" />
            </View>
            <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>{t.soil}</Text>
            <Text style={[styles.cardValue, styles.sensorValue, isDarkMode && styles.darkText]}>
              {sensorData.soil_moisture !== null ? `${parseFloat(sensorData.soil_moisture).toFixed(1)}%` : t.measuring}
            </Text>
            <Ionicons name="chevron-forward" size={24} color={isDarkMode ? "#B0B0B0" : "#999"} style={styles.chevron} />
          </View>
        </TouchableOpacity>

        {/* 조도 센서 */}
        <TouchableOpacity 
          style={[styles.settingCard, isDarkMode && styles.darkCard]}
          onPress={() => router.push('/setting')}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="sunny" size={24} color="#FFB800" />
            </View>
            <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>{t.light}</Text>
            <Text style={[styles.cardValue, styles.sensorValue, isDarkMode && styles.darkText]}>
              {sensorData.light_value !== null ? sensorData.light_value : t.measuring}
            </Text>
            <Ionicons name="chevron-forward" size={24} color={isDarkMode ? "#B0B0B0" : "#999"} style={styles.chevron} />
          </View>
        </TouchableOpacity>

        {/* 모션센서 업데이트 시간 */}
        <View style={[styles.infoCard, isDarkMode && styles.darkInfoCard]}>
          <MaterialIcons name="info" size={20} color={isDarkMode ? "#64B5F6" : "#3d5affff"} />
          <Text style={[styles.infoText, isDarkMode && styles.darkInfoText]}>
            {t.motionUpdate} {dayjs(controlCnt.lastMotionDate).format('YYYY-MM-DD HH:mm:ss')}
          </Text>
        </View>

        {/* 모션 감지 횟수 */}
        <TouchableOpacity 
          style={[styles.settingCard, isDarkMode && styles.darkCard]}
          onPress={() => router.push('/setting')}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: '#FFEBEE' }]}>
              <MaterialCommunityIcons name="motion-sensor" size={24} color="#FF3B30" />
            </View>
            <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>{t.motionDetect}</Text>
            <Text style={[styles.cardValue, isDarkMode && { color: "#64B5F6" }]}>{controlCnt.motionDetectedCnt}{t.times}</Text>
            <Ionicons name="chevron-forward" size={24} color={isDarkMode ? "#B0B0B0" : "#999"} style={styles.chevron} />
          </View>
        </TouchableOpacity>

        {/* LED 조명 작동 횟수 */}
        <TouchableOpacity 
          style={[styles.settingCard, isDarkMode && styles.darkCard]}
          onPress={() => router.push('/control')}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="bulb" size={24} color="#FFB800" />
            </View>
            <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>{t.ledLight}</Text>
            <Text style={[styles.cardValue, isDarkMode && { color: "#64B5F6" }]}>{controlCnt.ledLightCnt}{t.times}</Text>
            <Ionicons name="chevron-forward" size={24} color={isDarkMode ? "#B0B0B0" : "#999"} style={styles.chevron} />
          </View>
        </TouchableOpacity>

        {/* 물펌프 작동 횟수 */}
        <TouchableOpacity 
          style={[styles.settingCard, isDarkMode && styles.darkCard]}
          onPress={() => router.push('/control')}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
              <MaterialCommunityIcons name="water-pump" size={24} color="#2196F3" />
            </View>
            <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>{t.waterPump}</Text>
            <Text style={[styles.cardValue, isDarkMode && { color: "#64B5F6" }]}>{controlCnt.waterPumpCnt}{t.times}</Text>
            <Ionicons name="chevron-forward" size={24} color={isDarkMode ? "#B0B0B0" : "#999"} style={styles.chevron} />
          </View>
        </TouchableOpacity>

        {/* 환풍기 작동 횟수 */}
        <TouchableOpacity 
          style={[styles.settingCard, isDarkMode && styles.darkCard]}
          onPress={() => router.push('/control')}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: '#F3E5F5' }]}>
              <MaterialCommunityIcons name="fan" size={24} color="#9C27B0" />
            </View>
            <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>{t.fan}</Text>
            <Text style={[styles.cardValue, isDarkMode && { color: "#64B5F6" }]}>{controlCnt.fanMotorCnt}{t.times}</Text>
            <Ionicons name="chevron-forward" size={24} color={isDarkMode ? "#B0B0B0" : "#999"} style={styles.chevron} />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeMockScreen;

// 스타일
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.GRAY_200,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    position: 'relative',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: -1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex: 1,
  },
  darkModeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  darkContainer: {
    backgroundColor: '#1A1A1A',
  },
  darkText: {
    color: '#e0e0e0ff',
  },
  darkCard: {
    backgroundColor: '#2D2D2D',
  },
  darkInfoCard: {
    backgroundColor: '#1E3A5F',
  },
  darkInfoText: {
    color: '#B0C4DE',
  },
  // 언어 선택 래퍼 - topBar와 같은 라인에 위치
  languageSelectorWrapper: {
    position: 'absolute',
    top: 12,
    right: 16,
    zIndex: 100,
  },
  // 언어 선택 팝업 스타일
  languageSelectorContainer: {
    position: 'relative',
    width: 50,
    height: 50,
    justifyContent: 'flex-start',
    alignItems: 'center',
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
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#b0deffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    marginHorizontal: 16,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#585858ff',
  },
  settingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1452ff',
    marginRight: 4,
  },
  sensorValue: {
    color: '#000000ff',
  },
  chevron: {
    marginLeft: 4,
  },
});