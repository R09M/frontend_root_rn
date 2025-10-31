import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert, Button, Modal, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../component/layout/Header';
import { colors, SWITCH_THEME } from '../../../constants/colorConstant';
import useWebSocket from '../../../hooks/useWebSocket';
import useCheckLogin from '../../../hooks/useCheckLogin';
import AsyncStorage from '@react-native-async-storage/async-storage';  // ← 추가
import { showMotionAlert } from '../../../utils/showMotionAlert';

//기준값 파이썬으로 전송
const KEY_MAP = {
  tempt: 'fan_day',
  illum: 'light_threshold',
  humdt: 'soil_min'
};

// 낮/밤 판단 함수
const isDaytime = () => {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18;
};

const SettingHomeScreen = () => {

  useCheckLogin();

  const [settings, setSettings] = useState({
    tempt: { label: '온도', value: 26, unit: '°C' },
    illum: { label: '조도', value: 150, unit: ''},
    humdt: { label: '습도', value: 34, unit: '%'}
  });

  // 이상감지 알림 모달 상태
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState('항상');
  const selectedAlertRef = useRef('항상');

  // 🔹 앱 시작 시 저장된 알림 설정 불러오기
  useEffect(() => {
    const loadAlertSetting = async () => {
      try {
        const saved = await AsyncStorage.getItem('alertSetting');
        if (saved) {
          console.log('✅ 저장된 알림 설정 불러오기:', saved);
          setSelectedAlert(saved);
          selectedAlertRef.current = saved;
        }
      } catch (e) {
        console.error('❌ 알림 설정 불러오기 실패:', e);
      }
    };
    loadAlertSetting();
  }, []);

  // 🚨 모션 알림 핸들러
  const handleMotionAlert = useCallback((data) => {
    if (selectedAlertRef.current === '끔') {
      console.log('🔕 알림 설정: 끔');
      return;
    }
    
    showMotionAlert(data);
  }, []);

  const {updateSettings, getSettings, connectionStatus} = useWebSocket(
    handleMotionAlert,
    (serverSettings) => {
      console.log('📥 서버 설정값 수신:', serverSettings);

      const settings = serverSettings.system_settings;
      const fanValue = isDaytime() ? settings.fan_day : settings.fan_night;

      setSettings(prev => ({
        tempt: { ...prev.tempt, value: fanValue },
        illum: { ...prev.illum, value: settings.light_threshold || prev.illum.value },
        humdt: { ...prev.humdt, value: settings.soil_min || prev.humdt.value }
      }));
    }
  );

  useEffect(() => {
    if (connectionStatus === '연결됨 ✅') {
      console.log('⚙️ 서버 설정값 요청 중...');
      getSettings();
    }
  }, [connectionStatus, getSettings]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const openModal = (type) => {
    setSelectedSetting(type);
    setInputValue(settings[type].value.toString());
    setModalVisible(true);
  }

  const saveValue = () => {
    const numValue = parseFloat(inputValue);
    const setting = settings[selectedSetting];
    
    if (isNaN(numValue)) {
      Alert.alert('오류', '숫자를 입력해주세요');
      return;
    }

    setSettings(prev => ({
      ...prev,
      [selectedSetting]: { ...prev[selectedSetting], value: numValue }
    }));

    if (selectedSetting === 'tempt') {
      updateSettings('fan_day', numValue);
      updateSettings('fan_night', numValue);
    } 
    else if (selectedSetting === 'humdt') {
      updateSettings('soil_min', numValue);
      updateSettings('soil_max', numValue);
    } 
    else {
      updateSettings(KEY_MAP[selectedSetting], numValue);
    }

    Alert.alert('알림', `${setting.label} 기준값이 ${numValue}${setting.unit}로 변경되었습니다.`);
    setModalVisible(false);
  }

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [isEnabled, setIsEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title='Settings'
        onBackPress={() => console.log('back')}
        onMenuPress={() => console.log('menu')}
      />

      <View style={styles.container}>
        <Pressable onPress={() => openModal('tempt')} disabled={!isEnabled}>
          <View style={styles.mainContainer}>
            <View style={styles.leftSection}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="fan" size={30} color={colors.BLUE_600} />
              </View>
              <Text style={styles.content}>온도</Text>
            </View>
            <View style={styles.rightSection}>
              <Text style={styles.status}>{settings.tempt.value}{settings.tempt.unit}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.GRAY_500} />
            </View>
          </View>
        </Pressable>

        <View style={styles.divider} />

        <Pressable onPress={() => openModal('illum')} disabled={!isEnabled}>
          <View style={styles.mainContainer}>
            <View style={styles.leftSection}>
              <View style={styles.iconCircle}>
                <Ionicons name="sunny" size={30} color={colors.YELLOW} />
              </View>
              <Text style={styles.content}>조도</Text>
            </View>
            <View style={styles.rightSection}>
              <Text style={styles.status}>{settings.illum.value}{settings.illum.unit}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.GRAY_500} />
            </View>
          </View>
        </Pressable>

        <View style={styles.divider} />

        <Pressable onPress={() => openModal('humdt')} disabled={!isEnabled}>
          <View style={styles.mainContainer}>
            <View style={styles.leftSection}>
              <View style={styles.iconCircle}>
                <Ionicons name="water" size={30} color={colors.SKY_400} />
              </View>
              <Text style={styles.content}>습도</Text>
            </View>
            <View style={styles.rightSection}>
              <Text style={styles.status}>{settings.humdt.value}{settings.humdt.unit}</Text>
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

      <View style={styles.container}>
        <Pressable onPress={() => setAlertModalVisible(true)}>
          <View style={styles.mainContainer}>
            <View style={styles.leftSection}>
              <View style={styles.iconCircle}>
                <Octicons name="alert-fill" size={24} color={colors.RED} />
              </View>
              <Text style={styles.content}>이상 감지 알림</Text>
            </View>
            <View style={styles.rightSection}>
              <Text style={styles.status}>{selectedAlert}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.GRAY_500} />
            </View>
          </View>
        </Pressable>
      </View>    
      <Text style={styles.explain}>앱에 권한을 허용하면 해당 앱이 위험을 감지할 때마다 알림을 울립니다.</Text>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {settings[selectedSetting]?.label} 기준값 설정
            </Text>
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType="numeric"
              placeholder="숫자를 입력하세요"
            />
            <View style={styles.modalButtons}>
              <Button title="저장" onPress={saveValue} />
              <View style={{ width: 10 }} />
              <Button title="취소" color={colors.GRAY_300} onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={alertModalVisible} animationType="slide" transparent={false}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.GRAY_100}}>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
            <Pressable onPress={() => setAlertModalVisible(false)}>
              <Ionicons name="chevron-back" size={23} color={colors.BLACK} />
            </Pressable>
            <Text style={{ fontSize: 17, fontWeight: '600', marginLeft : 15 }}>이상감지 알림 표시</Text>
          </View>

          <View style={styles.container}>
            {['항상', '앱이 켜져있을 때만', '끔'].map((option, index, arr) => {
              const isLast = index === arr.length - 1;

              return (
                <Pressable
                  key={option}
                  onPress={async () => {
                    setSelectedAlert(option);
                    selectedAlertRef.current = option;
                    
                    // 🔹 AsyncStorage에 저장
                    try {
                      await AsyncStorage.setItem('alertSetting', option);
                      console.log('✅ 알림 설정 저장:', option);
                    } catch (e) {
                      console.error('❌ 알림 설정 저장 실패:', e);
                    }
                    
                    setAlertModalVisible(false);
                  }}
                  style={[styles.optionItem, !isLast && styles.optionDivider]}
                >
                  <Text style={styles.content}>{option}</Text>
                  {selectedAlert === option && (
                    <Ionicons name="checkmark" size={22} color={colors.BLUE_600} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
};

export default SettingHomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.GRAY_200
  },
  container: {
    backgroundColor: colors.WHITE,
    marginHorizontal: '3%',
    borderRadius: 14,
    marginTop : 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2
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
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.GRAY_400,
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  optionItem: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.GRAY_300,
  },
  optionText: {
    fontSize: 16,
    color: colors.BLACK,
  },
});