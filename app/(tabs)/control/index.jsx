import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Text, Switch, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useWebSocket from '../../../hooks/useWebSocket';
import Header from '../../../component/layout/Header';
import ControlCard from '../../../component/card/ControlCard';
import { colors } from '../../../constants/colorConstant';
import { useFocusEffect, useRouter } from 'expo-router';
import useCheckLogin from '../../../hooks/useCheckLogin';
import { showMotionAlert } from '../../../utils/showMotionAlert';
import { useAppContext } from '../../../context/AppContext'; // 다크모드 + 다국어 Context 추가

// ============================================
// 다국어 번역 데이터 추가
// ============================================
const translations = {
  ko: {
    title: '장치 제어',
    autoMode: '자동',
    manualMode: '수동',
    modeInUse: '모드 사용 중',
    switchToManual: '(수동 모드로 전환하려면 스위치를 꺼주세요.)',
    switchToAuto: '(자동 모드로 전환하려면 스위치를 켜주세요.)',
    ledLight: 'LED 조명',
    waterPump: '물펌프',
    fan: '환풍기',
  },
  en: {
    title: 'Device Control',
    autoMode: 'Auto',
    manualMode: 'Manual',
    modeInUse: 'mode in use',
    switchToManual: '(Turn off the switch to switch to manual mode.)',
    switchToAuto: '(Turn on the switch to switch to auto mode.)',
    ledLight: 'LED Light',
    waterPump: 'Water Pump',
    fan: 'Fan',
  },
  ja: {
    title: 'デバイス制御',
    autoMode: '自動',
    manualMode: '手動',
    modeInUse: 'モード使用中',
    switchToManual: '(手動モードに切り替えるにはスイッチをオフにしてください。)',
    switchToAuto: '(自動モードに切り替えるにはスイッチをオンにしてください。)',
    ledLight: 'LED照明',
    waterPump: 'ウォーターポンプ',
    fan: '換気扇',
  },
  zh: {
    title: '设备控制',
    autoMode: '自动',
    manualMode: '手动',
    modeInUse: '模式使用中',
    switchToManual: '(关闭开关以切换到手动模式。)',
    switchToAuto: '(打开开关以切换到自动模式。)',
    ledLight: 'LED灯',
    waterPump: '水泵',
    fan: '风扇',
  },
};

const ControlHomeScreen = () => {

  // 로그아웃 상태인지 판단하는 hook
  useCheckLogin();

  // ============================================
  // 다크모드 & 다국어 Context 가져오기
  // ============================================
  const { language, isDarkMode } = useAppContext();
  const t = translations[language]; // 현재 언어의 번역 객체

  // 제어할 장치 정보를 배열로 정의 (다국어 적용)
  const CONTROL_ITEMS = [
    { id: 'led', icon: '💡', title: t.ledLight, type: 'led' },
    { id: 'pump', icon: '💦', title: t.waterPump, type: 'pump' },
    { id: 'fan', icon: '🌀', title: t.fan, type: 'fan' },
  ];

  // handleMotionAlert 함수 추가
  const handleMotionAlert = (data) => {
    showMotionAlert(data);
  };

  const { controlLED, controlPump, controlFan, setMode } = useWebSocket(handleMotionAlert); // 웹소켓 훅 호출

  const [mode, setModeState] = useState('auto'); // 현재 모드 상태 ('auto' | 'manual')
  const [status, setStatus] = useState({
    led: false,
    pump: false,
    fan: false,
  }); // 각 장치 상태 저장

  const isAuto = mode === 'auto'; // 자동 모드 여부 확인

  // 모드 스위치 변경 핸들러
  const handleModeToggle = (value) => {
    const newMode = value ? 'auto' : 'manual';
    setModeState(newMode); // 로컬 상태 업데이트
    setMode('all', newMode); // 웹소켓에 모드 전송
  };

  // 장치 토글 핸들러
  const handleToggle = (id) => {
    if (isAuto) return; // 자동 모드면 제어 불가

    setStatus((prev) => {
      const newValue = !prev[id]; // 상태 반전
      // 각 장치별 WebSocket 호출
      if (id === 'led') controlLED(newValue ? 'ON' : 'OFF');
      if (id === 'pump') controlPump(newValue ? 'ON' : 'OFF');
      if (id === 'fan') controlFan(newValue ? 'ON' : 'OFF');

      return { ...prev, [id]: newValue }; // 상태 업데이트
    });
  };

  // ============================================
  // FlatList에서 각 장치 아이템 렌더링 (다크모드 prop 전달)
  // ============================================
  const renderItem = ({ item }) => (
    <ControlCard
      icon={item.icon} // 아이콘 표시
      title={item.title} // 장치 이름
      isOn={status[item.id]} // 켜짐/꺼짐 상태
      onToggle={() => handleToggle(item.id)} // 토글 함수 연결
      type={item.type} // 카드 타입 지정
      disabled={isAuto} // 자동 모드면 비활성화
      isDarkMode={isDarkMode} // 다크모드 prop 전달
    />
  );

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* ============================================ */}
      {/* Header 컴포넌트에 다크모드 + 언어선택 추가 */}
      {/* ============================================ */}
      <Header 
        title={t.title}
        showLanguageSelector={true}
        showDarkModeToggle={true}
      />

      {/* ============================================ */}
      {/* 다크모드 스타일 적용 */}
      {/* ============================================ */}
      <View style={[styles.modeContainer, isDarkMode && styles.darkModeContainer]}>
        <View>
          <Text style={[styles.modeLabel, isDarkMode && styles.darkText]}>
            {isAuto ? t.autoMode : t.manualMode} {t.modeInUse}
          </Text>
          <Text style={[styles.modeSubLabel, isDarkMode && styles.darkSubText]}>
            {isAuto ? t.switchToManual : t.switchToAuto}
          </Text>
        </View>
        <Switch
          value={isAuto} // 스위치 상태
          onValueChange={handleModeToggle} // 스위치 변경 시 핸들러
          trackColor={{ false: colors.GRAY_300, true: colors.BLUE_500 }} // 트랙 색상
          thumbColor={colors.WHITE} // 스위치 동그라미 색상
        />
      </View>

      <FlatList
        data={CONTROL_ITEMS} // 렌더링할 장치 데이터
        renderItem={renderItem} // 아이템 렌더링 함수
        keyExtractor={(item) => item.id} // 각 아이템 고유 키
        contentContainerStyle={styles.listContent} // FlatList 패딩/간격
        showsVerticalScrollIndicator={false} // 스크롤바 숨김
      />

    </SafeAreaView>
  );
};

export default ControlHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.GRAY_200,
  },
  // ============================================
  // 다크모드 스타일 추가
  // ============================================
  darkContainer: {
    backgroundColor: '#1A1A1A',
  },
  darkModeContainer: {
    backgroundColor: '#2D2D2D',
  },
  darkText: {
    color: '#E0E0E0',
  },
  darkSubText: {
    color: '#B0B0B0',
  },
  modeContainer: {
    backgroundColor: colors.WHITE,
    borderRadius: 20,
    padding: 20,
    margin: 16,
    shadowColor: colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.GRAY_700,
  },
  modeSubLabel: {
    fontSize: 12,
    color: colors.GRAY_500,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 16,
  },
});