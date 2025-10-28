import React, { useState } from 'react';
import { View, StyleSheet, Text, Switch, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useWebSocket from '../../../hooks/useWebSocket';
import Header from '../../../component/layout/Header';
import ControlCard from '../../../component/card/ControlCard';
import { colors } from '../../../constants/colorConstant';

// 제어할 장치 정보를 배열로 정의
const CONTROL_ITEMS = [
  { id: 'led', icon: '💡', title: 'LED 조명', type: 'led' },
  { id: 'pump', icon: '💦', title: '물펌프', type: 'pump' },
  { id: 'fan', icon: '🌀', title: '환풍기', type: 'fan' },
];

const ControlHomeScreen = () => {
  const { controlLED, controlPump, controlFan, setMode } = useWebSocket(); // 웹소켓 훅 호출

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

  // FlatList에서 각 장치 아이템 렌더링
  const renderItem = ({ item }) => (
    <ControlCard
      icon={item.icon} // 아이콘 표시
      title={item.title} // 장치 이름
      isOn={status[item.id]} // 켜짐/꺼짐 상태
      onToggle={() => handleToggle(item.id)} // 토글 함수 연결
      type={item.type} // 카드 타입 지정
      disabled={isAuto} // 자동 모드면 비활성화
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="장치 제어" // 화면 헤더 제목
        onBackPress={() => console.log('back')} // 뒤로가기 이벤트
        onMenuPress={() => console.log('menu')} // 메뉴 버튼 이벤트
      />

      <View style={styles.modeContainer}>
        <View>
          <Text style={styles.modeLabel}>
            {isAuto ? '자동' : '수동'} 모드 사용 중
          </Text>
          <Text style={styles.modeSubLabel}>
            {isAuto
              ? '(수동 모드로 전환하려면 스위치를 꺼주세요.)'
              : '(자동 모드로 전환하려면 스위치를 켜주세요.)'}
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
    backgroundColor: colors.GRAY_100,
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
