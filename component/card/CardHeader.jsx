import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colorConstant';

// ============================================
// CardHeader 컴포넌트
// isDarkMode prop 추가
// ============================================
const CardHeader = ({ icon, title, subtitle, isDarkMode }) => {
  return (
    <View style={styles.cardHeader}>
      <View style={[styles.iconContainer, isDarkMode && styles.darkIconContainer]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.titleContainer}>
        <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>{title}</Text>
        <Text style={[styles.cardSubtitle, isDarkMode && styles.darkSubText]}>{subtitle}</Text>
      </View>
    </View>
  );
};

export default CardHeader;

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.GRAY_100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  // ============================================
  // 다크모드 아이콘 컨테이너 스타일
  // ============================================
  darkIconContainer: {
    backgroundColor: '#3A3A3A',
  },
  icon: {
    fontSize: 28,
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
});