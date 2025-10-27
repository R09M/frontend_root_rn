import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../constants/colorConstant';
import CardHeader from './CardHeader';

const ControlCard = ({ icon, title, subtitle, isOn, onToggle, type }) => {
  return (
    <View style={styles.card}>
      <CardHeader 
        icon={icon} 
        title={title} 
        subtitle={subtitle} 
      />
      
      <TouchableOpacity onPress={onToggle} activeOpacity={0.7}>
        {isOn ? (
          <LinearGradient
            colors={
              type === 'led' ? [colors.YELLOW, '#FFF4CC'] :
              type === 'pump' ? [colors.BLUE_500, colors.BLUE_300] :
              [colors.SKY_500, colors.SKY_200]
            }
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.toggleButtonActive}
          >
            <Text style={styles.toggleTextActive}>Purifying</Text>
            <View style={styles.powerIconContainer}>
              <View style={styles.powerIcon}>
                <View style={styles.powerIconInner} />
              </View>
            </View>
          </LinearGradient>
        ) : (
          <View style={styles.toggleButton}>
            <Text style={styles.toggleText}>Off</Text>
            <View style={styles.powerIconContainer}>
              <View style={styles.powerIcon}>
                <View style={styles.powerIconInner} />
              </View>
            </View>
          </View>
        )}
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
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.GRAY_200,
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 64,
  },
  toggleButtonActive: {
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
    fontSize: 20,
    fontWeight: '600',
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