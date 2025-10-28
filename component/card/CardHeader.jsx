import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colorConstant';

const CardHeader = ({ icon, title, subtitle }) => {
  return (
    <View style={styles.cardHeader}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
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
});