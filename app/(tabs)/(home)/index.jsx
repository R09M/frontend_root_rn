// React 및 React Native 핵심 라이브러리 import
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// 아이콘 라이브러리 import
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// 커스텀 컴포넌트 및 훅 import
import Header from '../../../component/layout/Header';
import useWebSocket from '../../../hooks/useWebSocket';
import useCheckLogin from '../../../hooks/useCheckLogin';
import { useAppContext } from '../../../context/AppContext';

// 외부 라이브러리 import
import axios from 'axios';
import dayjs from 'dayjs';

// 상수 import
import { SERVER_URL } from '../../../constants/appConst';
import { colors } from '../../../constants/colorConstant';

// ============================================
// 다국어 번역 데이터 (한국어, 영어, 일본어, 중국어)
// ============================================
const translations = {
  ko: {
    title: '홈 화면',
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
    title: 'Home',
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
    title: 'ホーム',
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
    title: '主页',
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

/**
 * ============================================
 * HomeScreen 컴포넌트
 * ============================================
 */
const HomeScreen = () => {
  // ============================================
  // 훅 및 상태 관리
  // ============================================
  const router = useRouter();
  
  // 로그인 체크
  useCheckLogin();

  // Context에서 다크모드와 언어 가져오기
  const { language, isDarkMode } = useAppContext();
  
  // 현재 선택된 언어의 번역 객체
  const t = translations[language];
  
  // WebSocket 훅
  const { 
    sensorData,
    getSensorData,
    connectionStatus
  } = useWebSocket();

  // 제어 장치 작동 횟수 상태
  const [controlCnt, setControlCnt] = useState({
    motionDetectedCnt: 0,
    fanMotorCnt: 0,
    waterPumpCnt: 0,
    ledLightCnt: 0,
    lastMotionDate: '-'
  });

  // ============================================
  // 데이터 로딩 및 자동 갱신 (1분마다)
  // ============================================
  useEffect(() => {
    if (connectionStatus === '연결됨 ✅') {
      getSensorData();
      
      axios.get(`${SERVER_URL}/motions/today`)
      .then(res => {
        const controlCntList = res.data;
        const motionList = controlCntList.filter(item => item.motionDetected === true);
        
        setControlCnt({
          motionDetectedCnt: motionList.length,
          fanMotorCnt: controlCntList.filter(item => item.fanMotor === 1).length,
          waterPumpCnt: controlCntList.filter(item => item.waterPump === 1).length,
          ledLightCnt: controlCntList.filter(item => item.ledLight === 1).length,
          lastMotionDate: motionList.length > 0 ? motionList[0].timestamp : '-'
        });
      })
      .catch(e => console.log(e));

      const interval = setInterval(() => {
        getSensorData();
        
        axios.get(`${SERVER_URL}/motions/today`)
        .then(res => {
          const controlCntList = res.data;
          const motionList = controlCntList.filter(item => item.motionDetected === true);
          
          setControlCnt({
            motionDetectedCnt: motionList.length,
            fanMotorCnt: controlCntList.filter(item => item.fanMotor === 1).length,
            waterPumpCnt: controlCntList.filter(item => item.waterPump === 1).length,
            ledLightCnt: controlCntList.filter(item => item.ledLight === 1).length,
            lastMotionDate: motionList.length > 0 ? motionList[0].timestamp : '-'
          });
        })
        .catch(e => console.log(e));
      }, 60000);
      
      return () => clearInterval(interval);
    }
  }, [connectionStatus, getSensorData]);

  // ============================================
  // 로딩 화면
  // ============================================
  if (!sensorData) {
    return (
      <SafeAreaView style={styles.container}>
        <Header 
          title={t.title} 
          showLanguageSelector={true}
          showDarkModeToggle={true}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1452ff" />
          <Text style={styles.loadingText}>{connectionStatus}</Text>
          <Text style={styles.loadingSubText}>{t.loading}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ============================================
  // 메인 화면 렌더링
  // ============================================
  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Header 
        title={t.title}
        showLanguageSelector={true}
        showDarkModeToggle={true}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
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

export default HomeScreen;

// 스타일
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.GRAY_200,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  loadingText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
  },
  loadingSubText: {
    fontSize: 14,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 100,
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
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#b0deffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    marginHorizontal: 16,
    marginTop: 16,
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