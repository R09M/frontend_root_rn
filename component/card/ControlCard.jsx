import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../constants/colorConstant';

// ControlCard 컴포넌트: 장치 토글 버튼과 정보 표시용 카드
const ControlCard = ({ icon, title, subtitle, isOn, onToggle, type, disabled }) => {
  
  // 장치 타입에 따라 그라디언트 색상 설정
  const gradientColors =
    type === 'led'
      ? [colors.YELLOW, '#FFF4CC']
      : type === 'pump'
      ? [colors.BLUE_500, colors.BLUE_300]
      : [colors.SKY_500, colors.SKY_200];

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.titleContainer}>
          <Text style={styles.cardTitle}>{title}</Text>
          {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
        </View>
      </View>

      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={disabled ? 1 : 0.7}
        disabled={disabled}
      >
        <LinearGradient
          colors={isOn ? gradientColors : [colors.GRAY_200, colors.GRAY_200]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.toggleButton, disabled && styles.cardDisabled]}
        >
          <Text style={[styles.toggleText, isOn && styles.toggleTextActive]}>
            {isOn ? 'ON' : 'OFF'}
          </Text>
          <View style={styles.powerIconContainer}>
            <View style={styles.powerIcon}>
              <View style={styles.powerIconInner} />
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
  powerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
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
  powerIconInner: {
    width: 2.5,
    height: 8,
    backgroundColor: colors.GRAY_500,
    borderRadius: 2,
  },
});
