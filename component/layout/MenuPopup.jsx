// MenuPopup.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../constants/colorConstant';
import { useAppContext } from '../../context/AppContext';

const { width, height } = Dimensions.get('window');

const MenuPopup = ({ options, onClose }) => {
  const { isDarkMode } = useAppContext();

  return (
    <View style={styles.overlay}>
      {/* 배경 클릭 시 팝업 닫기 */}
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />

      {/* 실제 메뉴 */}
      <View style={[styles.menuPopup, isDarkMode && styles.menuPopupDark]}>
        {options.map((opt, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => {
              opt.onPress();
              onClose();
            }}
            style={styles.menuItemContainer}
          >
            <Text
              style={[
                styles.menuItem,
                isDarkMode && styles.menuItemDark,
                opt.color ? { color: opt.color } : null
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default MenuPopup;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  menuPopup: {
    position: 'absolute',
    top: 50, // Header 높이보다 조금 아래
    right: 16,
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.GRAY_200,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 0,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    maxWidth: 200,
    minWidth: 150,
  },
  menuPopupDark: {
    backgroundColor: '#3D3D3D',
    borderColor: '#505050',
  },
  menuItemContainer: {
    paddingVertical: 0,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 14,
    color: colors.GRAY_700,
  },
  menuItemDark: {
    color: '#FFFFFF',
  },
});