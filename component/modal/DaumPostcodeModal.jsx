import React from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import Postcode from '@actbase/react-daum-postcode';
import { colors } from '../../constants/colorConstant';

const { width, height } = Dimensions.get('window');

const DaumPostcodeModal = ({ visible, onClose, onSelectAddress }) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true} // 배경 투명
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Daum Postcode */}
          <Postcode
            style={{ flex: 1 }}
            jsOptions={{ animation: true, hideMapBtn: true }}
            onSelected={(data) => {
              onSelectAddress(data.address);
              onClose();
            }}
          />

          {/* 하단 닫기 버튼 */}
          <TouchableOpacity style={styles.closeButtonBottom} onPress={onClose}>
            <Text style={styles.closeTextBottom}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DaumPostcodeModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // 반투명 배경
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,  // 화면 가로 90%
    height: height * 0.6, // 화면 세로 60%
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  closeButtonBottom: {
    paddingVertical: 7,
    backgroundColor: colors.SKY_300, // 파란색 버튼
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeTextBottom: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
