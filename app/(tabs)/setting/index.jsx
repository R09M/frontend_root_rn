import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert, Button, Modal, Pressable, StyleSheet, Switch, Text, TextInput, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../component/layout/Header';
import { colors, SWITCH_THEME } from '../../../constants/colorConstant';
import useWebSocket from '../../../hooks/useWebSocket';
import useCheckLogin from '../../../hooks/useCheckLogin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMotionAlert } from '../../../utils/showMotionAlert';
import { useAppContext } from '../../../context/AppContext'; // 다크모드 + 다국어 Context 추가

// ============================================
// 다국어 번역 데이터 추가
// ============================================
const translations = {
  ko: {
    title: '설정',
    temperature: '온도',
    illuminance: '조도',
    humidity: '습도',
    shareAllDevices: '모든 기기에서 공유',
    abnormalDetectionAlert: '이상 감지 알림',
    save: '저장',
    cancel: '취소',
    error: '오류',
    enterNumber: '숫자를 입력해주세요',
    notification: '알림',
    thresholdChanged: '기준값이',
    changedTo: '로 변경되었습니다.',
    abnormalAlertDisplay: '이상감지 알림 표시',
    always: '항상',
    onlyWhenAppOpen: '앱이 켜져있을 때만',
    off: '끔',
    explain1: '사용자가 설정한 수치에 도달하면 연결된 기기가 자동으로 작동하여 실내 환경을 관리합니다.',
    explain2: '현재 공유되고 있는 사용자의 기기와 웹에 설정값이 동기화됩니다. 버튼을 비활성화할 경우 값을 설정할 수 없습니다.',
    explain3: '앱에 권한을 허용하면 해당 앱이 위험을 감지할 때마다 알림을 울립니다.',
    thresholdSetting: '기준값 설정',
  },
  en: {
    title: 'Settings',
    temperature: 'Temperature',
    illuminance: 'Illuminance',
    humidity: 'Humidity',
    shareAllDevices: 'Share on all devices',
    abnormalDetectionAlert: 'Abnormal Detection Alert',
    save: 'Save',
    cancel: 'Cancel',
    error: 'Error',
    enterNumber: 'Please enter a number',
    notification: 'Notification',
    thresholdChanged: 'Threshold value',
    changedTo: 'has been changed to',
    abnormalAlertDisplay: 'Abnormal Alert Display',
    always: 'Always',
    whileUsing: 'While using',
    off: 'Off',
    explain1: 'When the user-set value is reached, connected devices automatically operate to manage the indoor environment.',
    explain2: 'Settings are synchronized with the user\'s devices and web. If the button is disabled, values cannot be set.',
    explain3: 'If you allow app permissions, the app will alert you whenever it detects a risk.',
    thresholdSetting: 'Threshold Setting',
  },
  ja: {
    title: '設定',
    temperature: '温度',
    illuminance: '照度',
    humidity: '湿度',
    shareAllDevices: 'すべてのデバイスで共有',
    abnormalDetectionAlert: '異常検知アラート',
    save: '保存',
    cancel: 'キャンセル',
    error: 'エラー',
    enterNumber: '数字を入力してください',
    notification: '通知',
    thresholdChanged: '基準値が',
    changedTo: 'に変更されました。',
    abnormalAlertDisplay: '異常検知アラート表示',
    always: '常に',
    onlyWhenAppOpen: 'アプリ起動時のみ通知',
    off: 'オフ',
    explain1: 'ユーザーが設定した値に達すると、接続されたデバイスが自動的に動作して室内環境を管理します。',
    explain2: '現在共有されているユーザーのデバイスとウェブに設定値が同期されます。ボタンを無効にすると値を設定できません。',
    explain3: 'アプリに権限を許可すると、アプリが危険を検知するたびに通知が鳴ります。',
    thresholdSetting: '基準値設定',
  },
  zh: {
    title: '设置',
    temperature: '温度',
    illuminance: '照度',
    humidity: '湿度',
    shareAllDevices: '在所有设备上共享',
    abnormalDetectionAlert: '异常检测警报',
    save: '保存',
    cancel: '取消',
    error: '错误',
    enterNumber: '请输入数字',
    notification: '通知',
    thresholdChanged: '阈值已',
    changedTo: '更改为',
    abnormalAlertDisplay: '异常警报显示',
    always: '始终',
    onlyWhenAppOpen: '仅当应用打开时',
    off: '关闭',
    explain1: '当达到用户设置的值时，连接的设备会自动运行以管理室内环境。',
    explain2: '设置与当前共享的用户设备和网络同步。如果禁用按钮，则无法设置值。',
    explain3: '如果您允许应用权限，应用会在检测到风险时发出警报。',
    thresholdSetting: '阈值设置',
  },
};

// 알림 옵션 다국어 매핑
const alertOptionsMap = {
  ko: ['항상', '앱이 켜져있을 때만', '끔'],
  en: ['Always', 'While using', 'Off'],
  ja: [' 常に', ' アプリ起動時のみ通知', ' オフ'],
  zh: ['始终', '仅当应用打开时', '关闭'],
};

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

  // ============================================
  // 다크모드 & 다국어 Context 가져오기
  // ============================================
  const { language, isDarkMode } = useAppContext();
  const t = translations[language]; // 현재 언어의 번역 객체
  const alertOptions = alertOptionsMap[language]; // 현재 언어의 알림 옵션

  // ✅ settings에서 label 제거 (값만 저장)
  const [settings, setSettings] = useState({
    tempt: { value: 26, unit: '°C' },
    illum: { value: 150, unit: ''},
    humdt: { value: 34, unit: '%'}
  });

  // ✅ 언어 변경 시 label을 동적으로 가져오는 헬퍼 함수
  const getSettingLabel = (type) => {
    const labelMap = {
      tempt: t.temperature,
      illum: t.illuminance,
      humdt: t.humidity
    };
    return labelMap[type];
  };

  // 이상감지 알림 모달 상태
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  // ✅ 저장된 알림 설정 인덱스 (언어 독립적)
  const [selectedAlertIndex, setSelectedAlertIndex] = useState(0); // 기본값: 0 (항상)
  const selectedAlertIndexRef = useRef(0);

  // 🔹 앱 시작 시 저장된 알림 설정 불러오기
  useEffect(() => {
    const loadAlertSetting = async () => {
      try {
        const saved = await AsyncStorage.getItem('alertSettingIndex');
        if (saved !== null) {
          const index = parseInt(saved, 10);
          console.log('✅ 저장된 알림 설정 인덱스 불러오기:', index);
          setSelectedAlertIndex(index);
          selectedAlertIndexRef.current = index;
        }
      } catch (e) {
        console.error('❌ 알림 설정 불러오기 실패:', e);
      }
    };
    loadAlertSetting();
  }, []);

  // ✅ 현재 선택된 알림 옵션 텍스트 (언어에 따라 자동 변경)
  const selectedAlert = alertOptions[selectedAlertIndex];

  // 🚨 모션 알림 핸들러
  const handleMotionAlert = useCallback((data) => {
    if (selectedAlertIndexRef.current === 2) { // '끔'에 해당하는 인덱스
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
    const settingLabel = getSettingLabel(selectedSetting); // ✅ 동적으로 label 가져오기
    
    if (isNaN(numValue)) {
      Alert.alert(t.error, t.enterNumber);
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

    // ✅ 알림 메시지에 동적 label 사용
    Alert.alert(t.notification, `${settingLabel} ${t.thresholdChanged} ${numValue}${setting.unit}${t.changedTo}`);
    setModalVisible(false);
  }

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [isEnabled, setIsEnabled] = useState(true);

  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode && styles.darkContainer]}>
      {/* ============================================ */}
      {/* Header 컴포넌트에 다크모드 + 언어선택 추가 */}
      {/* ============================================ */}
      <Header
        title={t.title}
        showLanguageSelector={true}
        showDarkModeToggle={true}
      />

      <ScrollView>
        {/* ============================================ */}
        {/* 다크모드 스타일 적용 */}
        {/* ============================================ */}
        <View style={[styles.container, isDarkMode && styles.darkCard]}>
          <Pressable onPress={() => openModal('tempt')} disabled={!isEnabled}>
            <View style={styles.mainContainer}>
              <View style={styles.leftSection}>
                <View style={styles.iconCircle}>
                  <MaterialCommunityIcons name="fan" size={30} color={colors.BLUE_600} />
                </View>
                <Text style={[styles.content, isDarkMode && styles.darkText]}>{t.temperature}</Text>
              </View>
              <View style={styles.rightSection}>
                <Text style={[styles.status, isDarkMode && styles.darkSubText]}>{settings.tempt.value}{settings.tempt.unit}</Text>
                <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#B0B0B0" : colors.GRAY_500} />
              </View>
            </View>
          </Pressable>

          <View style={[styles.divider, isDarkMode && styles.darkDivider]} />

          <Pressable onPress={() => openModal('illum')} disabled={!isEnabled}>
            <View style={styles.mainContainer}>
              <View style={styles.leftSection}>
                <View style={styles.iconCircle}>
                  <Ionicons name="sunny" size={30} color={colors.YELLOW} />
                </View>
                <Text style={[styles.content, isDarkMode && styles.darkText]}>{t.illuminance}</Text>
              </View>
              <View style={styles.rightSection}>
                <Text style={[styles.status, isDarkMode && styles.darkSubText]}>{settings.illum.value}{settings.illum.unit}</Text>
                <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#B0B0B0" : colors.GRAY_500} />
              </View>
            </View>
          </Pressable>

          <View style={[styles.divider, isDarkMode && styles.darkDivider]} />

          <Pressable onPress={() => openModal('humdt')} disabled={!isEnabled}>
            <View style={styles.mainContainer}>
              <View style={styles.leftSection}>
                <View style={styles.iconCircle}>
                  <Ionicons name="water" size={30} color={colors.SKY_400} />
                </View>
                <Text style={[styles.content, isDarkMode && styles.darkText]}>{t.humidity}</Text>
              </View>
              <View style={styles.rightSection}>
                <Text style={[styles.status, isDarkMode && styles.darkSubText]}>{settings.humdt.value}{settings.humdt.unit}</Text>
                <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#B0B0B0" : colors.GRAY_500} />
              </View>
            </View>
          </Pressable>
        </View>
        <Text style={[styles.explain, isDarkMode && styles.darkText]}>{t.explain1}</Text>

        <View style={[styles.container, isDarkMode && styles.darkCard]}>
          <View style={styles.mainContainer}>
            <Text style={[styles.content, isDarkMode && styles.darkText]}>{t.shareAllDevices}</Text>
            <Switch
              trackColor={SWITCH_THEME.trackColor}
              thumbColor={isEnabled ? SWITCH_THEME.thumbColor.true : SWITCH_THEME.thumbColor.false}
              ios_backgroundColor={SWITCH_THEME.iosBackgroundColor}
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>
        <Text style={[styles.explain, isDarkMode && styles.darkText]}>{t.explain2}</Text>

        <View style={[styles.container, isDarkMode && styles.darkCard]}>
          <Pressable onPress={() => setAlertModalVisible(true)}>
            <View style={styles.mainContainer}>
              <View style={styles.leftSection}>
                <View style={styles.iconCircle}>
                  <Octicons name="alert-fill" size={24} color={colors.RED} />
                </View>
                <Text style={[styles.content, isDarkMode && styles.darkText]}>{t.abnormalDetectionAlert}</Text>
              </View>
              <View style={styles.rightSection}>
                <Text style={[styles.status, isDarkMode && styles.darkSubText]}>{selectedAlert}</Text>
                <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#B0B0B0" : colors.GRAY_500} />
              </View>
            </View>
          </Pressable>
        </View>    
        <Text style={[styles.explain, isDarkMode && styles.darkText]}>{t.explain3}</Text>
      </ScrollView>

      {/* 기준값 설정 모달 */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, isDarkMode && styles.darkModalContainer]}>
            <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>
              {/* ✅ 동적으로 label 가져오기 */}
              {getSettingLabel(selectedSetting)} {t.thresholdSetting}
            </Text>
            <TextInput
              style={[styles.input, isDarkMode && styles.darkInput]}
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType="numeric"
              placeholder={t.enterNumber}
              placeholderTextColor={isDarkMode ? "#888" : "#999"}
            />
            <View style={styles.modalButtons}>
              <Button title={t.save} onPress={saveValue} />
              <View style={{ width: 10 }} />
              <Button title={t.cancel} color={colors.GRAY_300} onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>

      {/* 이상감지 알림 모달 */}
      <Modal visible={alertModalVisible} animationType="slide" transparent={false}>
        <SafeAreaView style={[{ flex: 1 }, isDarkMode ? styles.darkContainer : { backgroundColor: colors.GRAY_100 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
            <Pressable onPress={() => setAlertModalVisible(false)}>
              <Ionicons name="chevron-back" size={23} color={isDarkMode ? colors.WHITE : colors.BLACK} />
            </Pressable>
            <Text style={[{ fontSize: 17, fontWeight: '600', marginLeft: 15 }, isDarkMode && styles.darkText]}>
              {t.abnormalAlertDisplay}
            </Text>
          </View>

          <View style={[styles.container, isDarkMode && styles.darkCard]}>
            {alertOptions.map((option, index, arr) => {
              const isLast = index === arr.length - 1;

              return (
                <Pressable
                  key={option}
                  onPress={async () => {
                    // ✅ 인덱스 저장 (언어 독립적)
                    setSelectedAlertIndex(index);
                    selectedAlertIndexRef.current = index;
                    
                    try {
                      await AsyncStorage.setItem('alertSettingIndex', index.toString());
                      console.log('✅ 알림 설정 인덱스 저장:', index);
                    } catch (e) {
                      console.error('❌ 알림 설정 저장 실패:', e);
                    }
                    
                    setAlertModalVisible(false);
                  }}
                  style={[styles.optionItem, !isLast && styles.optionDivider, isDarkMode && !isLast && styles.darkDivider]}
                >
                  <Text style={[styles.content, isDarkMode && styles.darkText]}>{option}</Text>
                  {/* ✅ 인덱스로 비교 */}
                  {selectedAlertIndex === index && (
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
  // ============================================
  // 다크모드 스타일 추가
  // ============================================
  darkContainer: {
    backgroundColor: '#1A1A1A',
  },
  darkCard: {
    backgroundColor: '#2D2D2D',
  },
  darkText: {
    color: '#E0E0E0',
  },
  darkSubText: {
    color: '#B0B0B0',
  },
  darkDivider: {
    backgroundColor: '#404040',
  },
  darkModalContainer: {
    backgroundColor: '#2D2D2D',
  },
  darkInput: {
    backgroundColor: '#3A3A3A',
    color: '#E0E0E0',
    borderColor: '#505050',
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