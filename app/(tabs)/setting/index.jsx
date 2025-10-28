import { Pressable, StyleSheet, Switch, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, SWITCH_THEME } from '../../../constants/colorConstant'
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const SettingHomeScreen = () => {
  //공유 버튼 슬라이드 스위치
  const [isEnabled, setIsEnabled] = useState(false);

  //모달 상태
  const [modalVisivle, setModalVisible] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [inputValue, setInputValue] = useState('');

  //설정 클릭 시 모달 열기
  const openModal = (type) => {
    setSelectedSetting(type);
    setInputValue(setting[type].value.toString());
    setModalVisible(ture);
  }

  // 값 저장
  const saveValue = () => {
    const numValue = parseFloat(inputValue); //문자열을 실수로 변환
    const setting = settings[selectedSetting];
    
    // 유효성 검증
    if (isNaN(numValue)) {
      Alert.alert('오류', '숫자를 입력해주세요');
      return;
    }

    if (numValue < setting.min || numValue > setting.max) {
      Alert.alert('오류', `${setting.min}~${setting.max} 범위의 값을 입력해주세요`);
      return;
    }
  }
  
  // 상태 업데이트
  setSettings(prev => ({
    ...prev,
    [selectedSetting]: { ...prev[selectedSetting], value: numValue }
  }));

  //슬라이드로 스위치를 on/off함
  //previousState => !previousState -> 이전 상태의 반대값을 반환하는 코드
  //const toggleSwitch = () => {setIsEnabled(!isEnabled)}; 와 같음
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);


  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.container}>
        <Pressable>
          {/* 온도 */}
          <View style={styles.mainContainer}>
            <View style={styles.leftSection}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="fan" size={30} color={colors.BLUE_600} />
              </View>
              <Text style={styles.content}>온도</Text>
            </View>
            <View style={styles.rightSection}>
              <Text style={styles.status}>26도</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.GRAY_500} />
            </View>
          </View>
          <View style={styles.divider} />
          {/* 조도 */}
          <View style={styles.mainContainer}>
            <View style={styles.leftSection}>
              <View style={styles.iconCircle}>
                <Ionicons name="sunny" size={30} color={colors.YELLOW} />
              </View>
              <Text style={styles.content}>조도</Text>
            </View>
            <View style={styles.rightSection}>
              <Text style={styles.status}>150</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.GRAY_500} />
            </View>
          </View>
          <View style={styles.divider} />
          {/* 습도 */}
          <View style={styles.mainContainer}>
            <View style={styles.leftSection}>
              <View style={styles.iconCircle}>
                <Ionicons name="water" size={30} color={colors.SKY_400} />
              </View>
              <Text style={styles.content}>습도</Text>
            </View>
            <View style={styles.rightSection}>
              <Text style={styles.status}>34%</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.GRAY_500} />
            </View>
          </View>
          <View style={styles.divider} />
          {/* 모션 감지 */}
          <View style={styles.mainContainer}>
            <View style={styles.leftSection}>
              <View style={styles.iconCircle}>
                <Octicons name="alert-fill" size={24} color={colors.RED} />
              </View>
              <Text style={styles.content}>모션 감지</Text>
            </View>
            <View style={styles.rightSection}>
              <Text style={styles.status}>켬</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.GRAY_500} />
            </View>
          </View>
        </Pressable>
      </View>
      <Text style={styles.explain}>사용자가 설정한 수치에 도달하면 연결된 기기가 자동으로 작동하여 실내 환경을 관리합니다.</Text>
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <Text style={styles.content}>모든 기기에서 공유</Text>
          <Switch
            trackColor={SWITCH_THEME.trackColor}
            thumbColor={isEnabled ? SWITCH_THEME.thumbColor.true : SWITCH_THEME.thumbColor.false}
            ios_backgroundColor={SWITCH_THEME.iosBackgroundColor}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </View>
      <Text style={styles.explain}>현재 공유되고 있는 사용자의 기기와 웹에 설정값이 동기화됩니다. 버튼을 비활성화할 경우 값을 설정할 수 없습니다.</Text>
    </SafeAreaView>
  )
}

export default SettingHomeScreen

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.GRAY_200
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30
  },
  container: {
    backgroundColor: colors.WHITE,
    marginHorizontal: '3%',
    borderRadius: 12,
  },
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  content: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.BLACK,
  },
  status: {
    fontSize: 15,
    color: colors.GRAY_500,
  },
  divider: {
    height: 1,
    backgroundColor: colors.GRAY_300,
    marginHorizontal: 16,
  },
  explain : {
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize : 13,
    marginBottom : 30
  }
})