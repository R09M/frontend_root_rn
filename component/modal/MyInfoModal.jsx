import React, { useCallback, useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colorConstant';
import axios from 'axios';
import { useFocusEffect } from 'expo-router';
import { SERVER_URL } from '../../constants/appConst';
import * as SecureStore from 'expo-secure-store';
import DaumPostcodeModal from './DaumPostcodeModal';
import * as ImagePicker from 'expo-image-picker';

const MyInfoModal = ({ visible, onClose }) => {

  // 주소 선택 모달 상태
  const [postcodeModalVisible, setPostcodeModalVisible] = useState(false);

  // 내 정보 수정 state 변수
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [isEditingFarm, setIsEditingFarm] = useState(false);
  
  // 내 정보를 저장할 state 변수
  const [userInfo, setUserInfo] = useState({});

  // reload state 변수
  const [reload, setReload] = useState(false);

  // 수정된 데이터를 임시 저장할 state
  const [editedBasicData, setEditedBasicData] = useState({
    userTelArr: ['', '', ''],
    userEmailArr: ['', '']
  });
  const [editedFarmData, setEditedFarmData] = useState({
    businessTelArr: ['', '', '']
  });

  // 프로필 이미지 state 추가
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/80');

  // 내 정보를 세팅할 useEffect
  useFocusEffect(
    useCallback(() => {
      const getLoginInfo = async () => {
        try {
          const loginInfo = await SecureStore.getItemAsync('loginInfo');
          const result = JSON.parse(loginInfo);
          console.log('로그인 데이터=', result);
          
          const res = await axios.get(`${SERVER_URL}/applications/${result.userId}`);
          setUserInfo(res.data);

          if (res.data.userDTO?.userImgDTO?.attachedImgName) {
            // 서버 이미지 경로 설정
            const imageUrl = `${SERVER_URL}/upload_files/user/${res.data.userDTO.userImgDTO.attachedImgName}`;
            console.log('========== 이미지 URL:', imageUrl);  // ← 이거 추가
            console.log('========== attachedImgName:', res.data.userDTO.userImgDTO.attachedImgName);  // ← 이거 추가
            setProfileImage(imageUrl);
          } else {
            // 이미지 없으면 기본 이미지
            console.log('========== 이미지 없음, res.data:', res.data);  // ← 이거 추가
            setProfileImage('https://via.placeholder.com/80');
          }
          
          if (res.data.userDTO?.userName) {
            setEditedBasicData(prev => ({
              ...prev,
              userName: res.data.userDTO.userName
            }));
          }

          // 초기 데이터 세팅 (전화번호, 이메일 분리)
          if (res.data.userDTO?.userTel) {
            const telArr = res.data.userDTO.userTel.split('-');
            setEditedBasicData(prev => ({
              ...prev,
              userTelArr: telArr.length === 3 ? telArr : ['', '', '']
            }));
          }
          if (res.data.userDTO?.userEmail) {
            const emailArr = res.data.userDTO.userEmail.split('@');
            setEditedBasicData(prev => ({
              ...prev,
              userEmailArr: emailArr.length === 2 ? emailArr : ['', '']
            }));
          }
          if (res.data.businessTel) {
            const businessTelArr = res.data.businessTel.split('-');
            setEditedFarmData(prev => ({
              ...prev,
              businessTelArr: businessTelArr.length === 3 ? businessTelArr : ['', '', '']
            }));
          }
          
          console.log(res.data);
        } catch (e) {
          console.log('에러 발생:', e);
        }
      };
      
      getLoginInfo();
    }, [visible, reload])
  );

  const handleImageEdit = async () => {
    // 1. 갤러리 권한 요청
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      alert('갤러리 접근 권한이 필요합니다.');
      return;
    }

    // 2. 이미지 선택 (편집 가능, 1:1 비율)
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    // 3. 이미지 선택 완료 시
    if (!result.canceled) {
      const selectedImage = result.assets[0];
      
      // 미리보기 즉시 표시
      setProfileImage(selectedImage.uri);
      
      // 서버에 즉시 업로드
      await uploadProfileImage(selectedImage);
    }
  };

  // 프로필 이미지 서버 업로드 함수
  const uploadProfileImage = async (imageInfo) => {
    try {
      const loginInfo = await SecureStore.getItemAsync('loginInfo');
      const result = JSON.parse(loginInfo);

      // FormData 생성
      const formData = new FormData();
      
      // 이미지 파일 추가 (React Native 방식)
      formData.append('userImg', {
        uri: imageInfo.uri,
        type: 'image/jpeg',
        name: 'profile.jpg'
      });
      
      // userId 추가
      formData.append('userId', result.userId);

      // axios로 전송
      const response = await axios.post(
        `${SERVER_URL}/users/upload-img`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      if (response.status === 200) {
        alert('프로필 사진이 변경되었습니다.');
        // setReload(!reload);
      }
    } catch (error) {
      console.log('업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다.');
      setProfileImage('https://via.placeholder.com/80');
    }
  };

  // 일반 필드 변경 핸들러
  const handleFieldChange = (type, field, value) => {
    if (type === 'basic') {
      setEditedBasicData(prev => ({
        ...prev,
        [field]: value
      }));
    } else if (type === 'farm') {
      setEditedFarmData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // 배열 필드 변경 핸들러 (전화번호, 이메일)
  const handleArrayFieldChange = (type, field, index, value) => {
    if (type === 'basic') {
      const newArr = [...editedBasicData[field]];
      newArr[index] = value;
      setEditedBasicData(prev => ({
        ...prev,
        [field]: newArr
      }));
    } else if (type === 'farm') {
      const newArr = [...editedFarmData[field]];
      newArr[index] = value;
      setEditedFarmData(prev => ({
        ...prev,
        [field]: newArr
      }));
    }
  };

  // 기본 정보 수정한 것 저장 함수
  const handleBasicSave = async () => {
    try {
      const loginInfo = await SecureStore.getItemAsync('loginInfo');
      const result = JSON.parse(loginInfo);
      
      // 전화번호, 이메일 합치기
      const userTel = editedBasicData.userTelArr.join('-');
      const userEmail = editedBasicData.userEmailArr.join('@');

      await axios.put(`${SERVER_URL}/users`, {
        userId: result.userId,
        userName: editedBasicData.userName,
        userTel,
        userEmail
      });
      
      setIsEditingBasic(false);
      setReload(!reload);
      alert('기본 정보가 수정되었습니다.');
    } catch (e) {
      console.log('기본 정보 수정 실패:', e);
      alert('수정에 실패했습니다.');
    }
  };
  
  // 농장 정보 수정한 것 저장 함수
  const handleFarmSave = async () => {
    try {
      const loginInfo = await SecureStore.getItemAsync('loginInfo');
      const result = JSON.parse(loginInfo);
      
      // 실무자 연락처 합치기
      const businessTel = editedFarmData.businessTelArr.join('-');
      
      await axios.put(`${SERVER_URL}/applications`, {
        userId: result.userId,
        applRole: editedFarmData.applRole ?? userInfo.applRole,
        farmName: editedFarmData.farmName ?? userInfo.farmName,
        businessTel,
        applAddr: editedFarmData.applAddr ?? userInfo.applAddr,
        addrDetail: editedFarmData.addrDetail ?? userInfo.addrDetail
      });
      
      setIsEditingFarm(false);
      setReload(!reload);
      alert('농장 정보가 수정되었습니다.');
    } catch (e) {
      console.log('농장 정보 수정 실패:', e);
      alert('수정에 실패했습니다.');
    }
  };

  // 일반 InfoRow
  const InfoRow = ({ label, value, field, type, isEditing, isLast = false }) => (
    <View style={[styles.infoRow, isLast && styles.infoRowLast]}>
      <Text style={styles.label}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={
            type === 'basic' 
              ? (editedBasicData[field] ?? value)
              : (editedFarmData[field] ?? value)
          }
          onChangeText={(text) => handleFieldChange(type, field, text)}
          placeholderTextColor="#999"
        />
      ) : (
        <Text style={styles.value}>{value || ''}</Text>
      )}
    </View>
  );

  // 전화번호 InfoRow (3개 input)
  const TelInfoRow = ({ label, telArr, field, type, isEditing, isLast = false }) => (
    <View style={[styles.infoRow, isLast && styles.infoRowLast]}>
      <Text style={styles.label}>{label}</Text>
      {isEditing ? (
        <View style={styles.telInputContainer}>
          <TextInput
            style={styles.telInput}
            value={telArr[0]}
            onChangeText={(text) => handleArrayFieldChange(type, field, 0, text)}
            keyboardType="numeric"
            maxLength={3}
            placeholderTextColor="#999"
          />
          <Text style={styles.telDash}>-</Text>
          <TextInput
            style={styles.telInput}
            value={telArr[1]}
            onChangeText={(text) => handleArrayFieldChange(type, field, 1, text)}
            keyboardType="numeric"
            maxLength={4}
            placeholderTextColor="#999"
          />
          <Text style={styles.telDash}>-</Text>
          <TextInput
            style={styles.telInput}
            value={telArr[2]}
            onChangeText={(text) => handleArrayFieldChange(type, field, 2, text)}
            keyboardType="numeric"
            maxLength={4}
            placeholderTextColor="#999"
          />
        </View>
      ) : (
        <Text style={styles.value}>{telArr.filter(Boolean).join('-') || ''}</Text>
      )}
    </View>
  );

  // 이메일 InfoRow (2개 input)
  const EmailInfoRow = ({ label, emailArr, field, type, isEditing, isLast = false }) => (
    <View style={[styles.infoRow, isLast && styles.infoRowLast]}>
      <Text style={styles.label}>{label}</Text>
      {isEditing ? (
        <View style={styles.emailInputContainer}>
          <TextInput
            style={styles.emailInput}
            value={emailArr[0]}
            onChangeText={(text) => handleArrayFieldChange(type, field, 0, text)}
            placeholderTextColor="#999"
          />
          <Text style={styles.emailAt}>@</Text>
          <TextInput
            style={styles.emailInput}
            value={emailArr[1]}
            onChangeText={(text) => handleArrayFieldChange(type, field, 1, text)}
            placeholderTextColor="#999"
          />
        </View>
      ) : (
        <Text style={styles.value}>{emailArr.filter(Boolean).join('@') || ''}</Text>
      )}
    </View>
  );

  // 주소 InfoRow (2개 input: 기본주소 + 상세주소)
  const AddressInfoRow = ({ label, applAddr, addrDetail, type, isEditing, isLast = false }) => (
    <View style={[styles.infoRow, isLast && styles.infoRowLast]}>
      <Text style={styles.label}>{label}</Text>
      {isEditing ? (
        <View style={styles.addressContainer}>
          <View style={styles.addressFirstRow}>
            <TouchableOpacity
              onPress={() => setPostcodeModalVisible(true)}
              activeOpacity={0.8} // 눌렀을 때 살짝 투명하게
            >
              <TextInput
                style={[styles.addressInput, { width: 120 }]}
                value={editedFarmData.applAddr ?? applAddr ?? ''}
                onChangeText={(text) => handleFieldChange(type, 'applAddr', text)}
                placeholder="기본 주소"
                placeholderTextColor="#999"
                editable={false}       // 키보드 방지
                pointerEvents="none"   // TextInput 자체 터치 무시
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.addressButton}
              onPress={() => setPostcodeModalVisible(true)} // 주소 모달 열기
            >
              <Text style={styles.addressButtonText}>주소</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.addressDetailInput}
            value={editedFarmData.addrDetail ?? addrDetail ?? ''}
            onChangeText={(text) => handleFieldChange(type, 'addrDetail', text)}
            placeholder="상세 주소"
            placeholderTextColor="#999"
          />
        </View>
      ) : (
        <Text style={styles.value}>
          {/* 수정: 안전하게 문자열로 변환 */}
          {[applAddr, addrDetail].filter(Boolean).join('\n') || '주소 없음'}
        </Text>
      )}
    </View>
  );

  // 라디오 버튼 InfoRow
  const RadioInfoRow = ({ label, value, field, type, isEditing, isLast = false }) => (
    <View style={[styles.infoRow, isLast && styles.infoRowLast]}>
      <Text style={styles.label}>{label}</Text>
      {isEditing ? (
        <View style={styles.radioContainer}>
          <TouchableOpacity 
            style={styles.radioOption}
            onPress={() => handleFieldChange(type, field, 'CORPORATE')}
          >
            <View style={styles.radio}>
              {(editedFarmData[field] ?? value) === 'CORPORATE' && <View style={styles.radioSelected} />}
            </View>
            <Text style={styles.radioText}>법인</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.radioOption}
            onPress={() => handleFieldChange(type, field, 'PERSONAL')}
          >
            <View style={styles.radio}>
              {(editedFarmData[field] ?? value) === 'PERSONAL' && <View style={styles.radioSelected} />}
            </View>
            <Text style={styles.radioText}>개인</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.value}>{value === 'CORPORATE' ? '법인' : value === 'PERSONAL' ? '개인' : ''}</Text>
      )}
    </View>
  );

  const handleModalClose = () => {
    // 편집 상태 초기화
    setIsEditingBasic(false);
    setIsEditingFarm(false);
    
    // 외부 onClose 호출
    onClose();
  };

  const handleSelectAddress = (address) => {
    setEditedFarmData(prev => ({
      ...prev,
      applAddr: address
    }));
    setPostcodeModalVisible(false);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleModalClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={handleModalClose} activeOpacity={1} />
        
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeIcon} onPress={handleModalClose}>
            <Ionicons name="close" size={28} color='#333333' />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* 프로필 영역 */}
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: profileImage }} // state로 변경
                  style={styles.avatar}
                />
                <TouchableOpacity 
                  style={styles.editImageButton}
                  onPress={handleImageEdit}
                  activeOpacity={0.7} // 살짝 더 부드러운 터치 효과
                >
                  <Ionicons name="pencil" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              {/* <Text style={styles.profileHint}>사진을 클릭하여 변경</Text> */}
            </View>

            {/* 기본 정보 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>기본 정보</Text>
                <TouchableOpacity 
                  style={styles.manageButton}
                  onPress={() => isEditingBasic ? handleBasicSave() : setIsEditingBasic(true)}
                >
                  <Text style={styles.manageButtonText}>
                    {isEditingBasic ? '저장' : '관리'}
                  </Text>
                </TouchableOpacity>
              </View>
              <InfoRow 
                label="이름" 
                value={userInfo?.userDTO?.userName || ''} 
                field="userName"
                type="basic"
                isEditing={isEditingBasic}
              />
              <TelInfoRow 
                label="연락처" 
                telArr={editedBasicData.userTelArr}
                field="userTelArr"
                type="basic"
                isEditing={isEditingBasic}
              />
              <EmailInfoRow 
                label="이메일" 
                emailArr={editedBasicData.userEmailArr}
                field="userEmailArr"
                type="basic"
                isEditing={isEditingBasic}
                isLast 
              />
            </View>

            {/* 농장 정보 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>농장 정보</Text>
                <TouchableOpacity 
                  style={styles.manageButton}
                  onPress={() => isEditingFarm ? handleFarmSave() : setIsEditingFarm(true)}
                >
                  <Text style={styles.manageButtonText}>
                    {isEditingFarm ? '저장' : '관리'}
                  </Text>
                </TouchableOpacity>
              </View>
              <RadioInfoRow 
                label="신청 유형" 
                value={userInfo.applRole || ''} 
                field="applRole"
                type="farm"
                isEditing={isEditingFarm}
              />
              <InfoRow 
                label="농장명" 
                value={userInfo.farmName || ''} 
                field="farmName"
                type="farm"
                isEditing={isEditingFarm}
              />
              <TelInfoRow 
                label="실무자 연락처" 
                telArr={editedFarmData.businessTelArr}
                field="businessTelArr"
                type="farm"
                isEditing={isEditingFarm}
              />
              <AddressInfoRow 
                label="주소" 
                applAddr={userInfo.applAddr || ''}
                addrDetail={userInfo.addrDetail || ''}
                type="farm"
                isEditing={isEditingFarm}
                isLast 
              />
            </View>
          </ScrollView>
          <DaumPostcodeModal
            visible={postcodeModalVisible}
            onClose={() => setPostcodeModalVisible(false)}
            onSelectAddress={handleSelectAddress}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  modalContent: {
    width: '85%',
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  closeIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 4,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'visible',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    backgroundColor: '#F0F0F0',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  editImageButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.GREEN_300,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  profileHint: {
    marginTop: 8,
    fontSize: 12,
    color: '#999999',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  manageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.SKY_300,
    borderRadius: 6,
  },
  manageButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  input: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.SKY_300,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  telInputContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  telInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.SKY_300,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  telDash: {
    marginHorizontal: 4,
    color: '#666666',
    fontSize: 14,
  },
  emailInputContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  emailInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.SKY_300,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  emailAt: {
    marginHorizontal: 4,
    color: '#666666',
    fontSize: 14,
  },
  addressContainer: {
    flex: 2,
  },
  addressFirstRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  addressInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.SKY_300,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  addressButton: {
    backgroundColor: colors.SKY_300,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    justifyContent: 'center',
  },
  addressButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  addressDetailInput: {
    fontSize: 14,
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.SKY_300,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  radioContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.SKY_300,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.SKY_300,
  },
  radioText: {
    fontSize: 14,
    color: '#1A1A1A',
  },
});

export default MyInfoModal;