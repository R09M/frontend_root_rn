import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../constants/colorConstant';

// ============================================
// ControlCard 컴포넌트: 장치 토글 버튼과 정보 표시용 카드
// isDarkMode, isAuto prop 추가
// ============================================
const ControlCard = ({ icon, title, subtitle, isOn, onToggle, type, disabled, isDarkMode, isAuto }) => {
  
  // ============================================
  // 장치 타입에 따라 그라디언트 색상 설정 (라이트모드)
  // ============================================
  const gradientColors =
    type === 'led'
      ? [colors.YELLOW, '#FFF4CC']
      : type === 'pump'
      ? [colors.BLUE_500, colors.BLUE_300]
      : ['#78737eaa', '#e9e9e9ff'];

  // ============================================
  // 장치 타입에 따라 그라디언트 색상 설정 (다크모드)
  // ============================================
  const darkGradientColors =
    type === 'led'
      ? ['#fde699ff', '#FFA726'] // 밝은 노란색-주황색
      : type === 'pump'
      ? ['#afd7f8ff', '#42A5F5'] // 밝은 파란색
      : ['#d6d6d6ff', '#78737eaa']; // 밝은 하늘색

  // ✅ 자동 모드일 때 그라데이션 색상 결정
  const getGradientColors = () => {
    // 자동 모드일 때는 회색
    if (isAuto) {
      return isDarkMode ? ['#3A3A3A', '#3A3A3A'] : ['#D1D5DB', '#D1D5DB'];
    }
    
    // 수동 모드일 때 기존 로직
    if (isOn) {
      return isDarkMode ? darkGradientColors : gradientColors;
    } else {
      return isDarkMode ? ['#3A3A3A', '#3A3A3A'] : [colors.GRAY_200, colors.GRAY_200];
    }
  };

  return (
    <View style={[styles.card, isDarkMode && styles.darkCard]}>
      <View style={styles.cardHeader}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.titleContainer}>
          <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>{title}</Text>
          {subtitle && <Text style={[styles.cardSubtitle, isDarkMode && styles.darkSubText]}>{subtitle}</Text>}
        </View>
      </View>

      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={disabled ? 1 : 0.7}
        disabled={disabled}
      >
        <LinearGradient
          colors={getGradientColors()} // ✅ 함수로 색상 결정
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.toggleButton, disabled && styles.cardDisabled]}
        >
          {/* ✅ 자동 모드일 때만 "Disabled" 표시, 아니면 기존대로 ON/OFF */}
          <Text style={[
            styles.toggleText, 
            isOn && !isAuto && styles.toggleTextActive,
            isDarkMode && !isOn && !isAuto && styles.darkToggleText
          ]}>
            {isAuto ? 'Disabled' : (isOn ? 'ON' : 'OFF')}
          </Text>
          <View style={[styles.powerIconContainer, isDarkMode && styles.darkPowerIconContainer]}>
            <View style={[styles.powerIcon, isDarkMode && styles.darkPowerIcon]}>
              <View style={[styles.powerIconInner, isDarkMode && styles.darkPowerIconInner]} />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default ControlCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.WHITE,
    borderRadius: 20,
    padding: 20,
    shadowColor: colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  // ============================================
  // 다크모드 카드 스타일
  // ============================================
  darkCard: {
    backgroundColor: '#2D2D2D',
    shadowOpacity: 0.3,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 28,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.GRAY_700,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.GRAY_500,
  },
  // ============================================
  // 다크모드 텍스트 스타일
  // ============================================
  darkText: {
    color: '#E0E0E0',
  },
  darkSubText: {
    color: '#B0B0B0',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 64,
  },
  toggleText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.GRAY_500,
  },
  toggleTextActive: {
    color: colors.WHITE,
  },
  // ============================================
  // 다크모드 토글 텍스트 스타일
  // ============================================
  darkToggleText: {
    color: '#B0B0B0',
  },
  powerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ============================================
  // 다크모드 아이콘 컨테이너 스타일
  // ============================================
  darkPowerIconContainer: {
    backgroundColor: '#1A1A1A',
  },
  powerIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: colors.GRAY_500,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 3,
  },
  // ============================================
  // 다크모드 전원 아이콘 스타일
  // ============================================
  darkPowerIcon: {
    borderColor: '#E0E0E0',
  },
  powerIconInner: {
    width: 2.5,
    height: 8,
    backgroundColor: colors.GRAY_500,
    borderRadius: 2,
  },
  // ============================================
  // 다크모드 전원 아이콘 내부 스타일
  // ============================================
  darkPowerIconInner: {
    backgroundColor: '#E0E0E0',
  },
});