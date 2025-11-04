// React 및 React Native 핵심 라이브러리 import
import React, { useCallback, useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput } from 'react-native';

// 아이콘 라이브러리 import
import { Ionicons } from '@expo/vector-icons';

// 상수 및 컨텍스트 import
import { colors } from '../../constants/colorConstant';
import { SERVER_URL } from '../../constants/appConst';
import { useAppContext } from '../../context/AppContext';

// 외부 라이브러리 import
import axios from 'axios';
import { useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';

// 커스텀 컴포넌트 import
import DaumPostcodeModal from './DaumPostcodeModal';

// ============================================
// 다국어 번역 데이터 (한국어, 영어, 일본어, 중국어)
// ============================================
const translations = {
  ko: {
    basicInfo: '기본 정보',
    farmInfo: '농장 정보',
    manage: '관리',
    save: '저장',
    name: '이름',
    contact: '연락처',
    email: '이메일',
    applicationType: '신청 유형',
    farmName: '농장명',
    managerContact: '실무자 연락처',
    address: '주소',
    addressButton: '주소',
    detailAddress: '상세 주소',
    noAddress: '주소 없음',
    corporate: '법인',
    personal: '개인',
    profileHint: '사진을 클릭하여 변경',
    galleryPermission: '갤러리 접근 권한이 필요합니다.',
    profileUpdated: '프로필 사진이 변경되었습니다.',
    uploadFailed: '이미지 업로드에 실패했습니다.',
    basicInfoUpdated: '기본 정보가 수정되었습니다.',
    farmInfoUpdated: '농장 정보가 수정되었습니다.',
    updateFailed: '수정에 실패했습니다.',
    basicAddressPlaceholder: '기본 주소',
    detailAddressPlaceholder: '상세 주소',
  },
  en: {
    basicInfo: 'Basic Information',
    farmInfo: 'Farm Information',
    manage: 'Manage',
    save: 'Save',
    name: 'Name',
    contact: 'Contact',
    email: 'Email',
    applicationType: 'Application Type',
    farmName: 'Farm Name',
    managerContact: 'Manager Contact',
    address: 'Address',
    addressButton: 'Search',
    detailAddress: 'Detail Address',
    noAddress: 'No Address',
    corporate: 'Corporate',
    personal: 'Personal',
    profileHint: 'Click photo to change',
    galleryPermission: 'Gallery access permission required.',
    profileUpdated: 'Profile photo has been changed.',
    uploadFailed: 'Image upload failed.',
    basicInfoUpdated: 'Basic information has been updated.',
    farmInfoUpdated: 'Farm information has been updated.',
    updateFailed: 'Update failed.',
    basicAddressPlaceholder: 'Basic Address',
    detailAddressPlaceholder: 'Detail Address',
  },
  ja: {
    basicInfo: '基本情報',
    farmInfo: '農場情報',
    manage: '管理',
    save: '保存',
    name: '名前',
    contact: '連絡先',
    email: 'メール',
    applicationType: '申請タイプ',
    farmName: '農場名',
    managerContact: '実務者連絡先',
    address: '住所',
    addressButton: '検索',
    detailAddress: '詳細住所',
    noAddress: '住所なし',
    corporate: '法人',
    personal: '個人',
    profileHint: '写真をクリックして変更',
    galleryPermission: 'ギャラリーアクセス権限が必要です。',
    profileUpdated: 'プロフィール写真が変更されました。',
    uploadFailed: '画像のアップロードに失敗しました。',
    basicInfoUpdated: '基本情報が修正されました。',
    farmInfoUpdated: '農場情報が修正されました。',
    updateFailed: '修正に失敗しました。',
    basicAddressPlaceholder: '基本住所',
    detailAddressPlaceholder: '詳細住所',
  },
  zh: {
    basicInfo: '基本信息',
    farmInfo: '农场信息',
    manage: '管理',
    save: '保存',
    name: '姓名',
    contact: '联系方式',
    email: '邮箱',
    applicationType: '申请类型',
    farmName: '农场名称',
    managerContact: '负责人联系方式',
    address: '地址',
    addressButton: '搜索',
    detailAddress: '详细地址',
    noAddress: '无地址',
    corporate: '法人',
    personal: '个人',
    profileHint: '点击照片更改',
    galleryPermission: '需要图库访问权限。',
    profileUpdated: '个人资料照片已更改。',
    uploadFailed: '图片上传失败。',
    basicInfoUpdated: '基本信息已更新。',
    farmInfoUpdated: '农场信息已更新。',
    updateFailed: '更新失败。',
    basicAddressPlaceholder: '基本地址',
    detailAddressPlaceholder: '详细地址',
  },
};

/**
 * ============================================
 * MyInfoModal 컴포넌트
 * ============================================
 * 사용자 정보 조회 및 수정 모달
 * 
 * @param {boolean} visible - 모달 표시 여부
 * @param {function} onClose - 모달 닫기 콜백
 */
const MyInfoModal = ({ visible, onClose }) => {
  // ============================================
  // Context에서 다크모드와 언어 가져오기
  // ============================================
  const { language, isDarkMode } = useAppContext();
  
  // 현재 선택된 언어의 번역 객체
  const t = translations[language];

  // ============================================
  // 상태 관리
  // ============================================
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

  // ============================================
  // 내 정보를 세팅할 useEffect
  // ============================================
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
            console.log('========== 이미지 URL:', imageUrl);
            console.log('========== attachedImgName:', res.data.userDTO.userImgDTO.attachedImgName);
            setProfileImage(imageUrl);
          } else {
            // 이미지 없으면 기본 이미지
            console.log('========== 이미지 없음, res.data:', res.data);
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

  // ============================================
  // 프로필 이미지 수정 핸들러
  // ============================================
  const handleImageEdit = async () => {
    // 1. 갤러리 권한 요청
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      alert(t.galleryPermission);
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

  // ============================================
  // 프로필 이미지 서버 업로드 함수
  // ============================================
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
        alert(t.profileUpdated);
      }
    } catch (error) {
      console.log('업로드 실패:', error);
      alert(t.uploadFailed);
      setProfileImage('https://via.placeholder.com/80');
    }
  };

  // ============================================
  // 일반 필드 변경 핸들러
  // ============================================
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

  // ============================================
  // 배열 필드 변경 핸들러 (전화번호, 이메일)
  // ============================================
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

  // ============================================
  // 기본 정보 수정한 것 저장 함수
  // ============================================
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
      alert(t.basicInfoUpdated);
    } catch (e) {
      console.log('기본 정보 수정 실패:', e);
      alert(t.updateFailed);
    }
  };
  
  // ============================================
  // 농장 정보 수정한 것 저장 함수
  // ============================================
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
      alert(t.farmInfoUpdated);
    } catch (e) {
      console.log('농장 정보 수정 실패:', e);
      alert(t.updateFailed);
    }
  };

  // ============================================
  // 일반 InfoRow 컴포넌트
  // ============================================
  const InfoRow = ({ label, value, field, type, isEditing, isLast = false }) => (
    <View style={[
      styles.infoRow, 
      isLast && styles.infoRowLast,
      isDarkMode && styles.darkInfoRow
    ]}>
      <Text style={[styles.label, isDarkMode && styles.darkLabel]}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={[styles.input, isDarkMode && styles.darkInput]}
          value={
            type === 'basic' 
              ? (editedBasicData[field] ?? value)
              : (editedFarmData[field] ?? value)
          }
          onChangeText={(text) => handleFieldChange(type, field, text)}
          placeholderTextColor={isDarkMode ? "#888" : "#999"}
        />
      ) : (
        <Text style={[styles.value, isDarkMode && styles.darkValue]}>{value || ''}</Text>
      )}
    </View>
  );

  // ============================================
  // 전화번호 InfoRow 컴포넌트 (3개 input)
  // ============================================
  const TelInfoRow = ({ label, telArr, field, type, isEditing, isLast = false }) => (
    <View style={[
      styles.infoRow, 
      isLast && styles.infoRowLast,
      isDarkMode && styles.darkInfoRow
    ]}>
      <Text style={[styles.label, isDarkMode && styles.darkLabel]}>{label}</Text>
      {isEditing ? (
        <View style={styles.telInputContainer}>
          <TextInput
            style={[styles.telInput, isDarkMode && styles.darkInput]}
            value={telArr[0]}
            onChangeText={(text) => handleArrayFieldChange(type, field, 0, text)}
            keyboardType="numeric"
            maxLength={3}
            placeholderTextColor={isDarkMode ? "#888" : "#999"}
          />
          <Text style={[styles.telDash, isDarkMode && styles.darkText]}>-</Text>
          <TextInput
            style={[styles.telInput, isDarkMode && styles.darkInput]}
            value={telArr[1]}
            onChangeText={(text) => handleArrayFieldChange(type, field, 1, text)}
            keyboardType="numeric"
            maxLength={4}
            placeholderTextColor={isDarkMode ? "#888" : "#999"}
          />
          <Text style={[styles.telDash, isDarkMode && styles.darkText]}>-</Text>
          <TextInput
            style={[styles.telInput, isDarkMode && styles.darkInput]}
            value={telArr[2]}
            onChangeText={(text) => handleArrayFieldChange(type, field, 2, text)}
            keyboardType="numeric"
            maxLength={4}
            placeholderTextColor={isDarkMode ? "#888" : "#999"}
          />
        </View>
      ) : (
        <Text style={[styles.value, isDarkMode && styles.darkValue]}>
          {telArr.filter(Boolean).join('-') || ''}
        </Text>
      )}
    </View>
  );

  // ============================================
  // 이메일 InfoRow 컴포넌트 (2개 input)
  // ============================================
  const EmailInfoRow = ({ label, emailArr, field, type, isEditing, isLast = false }) => (
    <View style={[
      styles.infoRow, 
      isLast && styles.infoRowLast,
      isDarkMode && styles.darkInfoRow
    ]}>
      <Text style={[styles.label, isDarkMode && styles.darkLabel]}>{label}</Text>
      {isEditing ? (
        <View style={styles.emailInputContainer}>
          <TextInput
            style={[styles.emailInput, isDarkMode && styles.darkInput]}
            value={emailArr[0]}
            onChangeText={(text) => handleArrayFieldChange(type, field, 0, text)}
            placeholderTextColor={isDarkMode ? "#888" : "#999"}
          />
          <Text style={[styles.emailAt, isDarkMode && styles.darkText]}>@</Text>
          <TextInput
            style={[styles.emailInput, isDarkMode && styles.darkInput]}
            value={emailArr[1]}
            onChangeText={(text) => handleArrayFieldChange(type, field, 1, text)}
            placeholderTextColor={isDarkMode ? "#888" : "#999"}
          />
        </View>
      ) : (
        <Text style={[styles.value, isDarkMode && styles.darkValue]}>
          {emailArr.filter(Boolean).join('@') || ''}
        </Text>
      )}
    </View>
  );

  // ============================================
  // 주소 InfoRow 컴포넌트 (2개 input: 기본주소 + 상세주소)
  // ============================================
  const AddressInfoRow = ({ label, applAddr, addrDetail, type, isEditing, isLast = false }) => (
    <View style={[
      styles.infoRow, 
      isLast && styles.infoRowLast,
      isDarkMode && styles.darkInfoRow
    ]}>
      <Text style={[styles.label, isDarkMode && styles.darkLabel]}>{label}</Text>
      {isEditing ? (
        <View style={styles.addressContainer}>
          <View style={styles.addressFirstRow}>
            <TouchableOpacity
              onPress={() => setPostcodeModalVisible(true)}
              activeOpacity={0.8}
            >
              <TextInput
                style={[styles.addressInput, { width: 120 }, isDarkMode && styles.darkInput]}
                value={editedFarmData.applAddr ?? applAddr ?? ''}
                onChangeText={(text) => handleFieldChange(type, 'applAddr', text)}
                placeholder={t.basicAddressPlaceholder}
                placeholderTextColor={isDarkMode ? "#888" : "#999"}
                editable={false}
                pointerEvents="none"
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.addressButton, isDarkMode && styles.darkAddressButton]}
              onPress={() => setPostcodeModalVisible(true)}
            >
              <Text style={styles.addressButtonText}>{t.addressButton}</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.addressDetailInput, isDarkMode && styles.darkInput]}
            value={editedFarmData.addrDetail ?? addrDetail ?? ''}
            onChangeText={(text) => handleFieldChange(type, 'addrDetail', text)}
            placeholder={t.detailAddressPlaceholder}
            placeholderTextColor={isDarkMode ? "#888" : "#999"}
          />
        </View>
      ) : (
        <Text style={[styles.value, isDarkMode && styles.darkValue]}>
          {[applAddr, addrDetail].filter(Boolean).join('\n') || t.noAddress}
        </Text>
      )}
    </View>
  );

  // ============================================
  // 라디오 버튼 InfoRow 컴포넌트
  // ============================================
  const RadioInfoRow = ({ label, value, field, type, isEditing, isLast = false }) => (
    <View style={[
      styles.infoRow, 
      isLast && styles.infoRowLast,
      isDarkMode && styles.darkInfoRow
    ]}>
      <Text style={[styles.label, isDarkMode && styles.darkLabel]}>{label}</Text>
      {isEditing ? (
        <View style={styles.radioContainer}>
          <TouchableOpacity 
            style={styles.radioOption}
            onPress={() => handleFieldChange(type, field, 'CORPORATE')}
          >
            <View style={[styles.radio, isDarkMode && styles.darkRadio]}>
              {(editedFarmData[field] ?? value) === 'CORPORATE' && 
                <View style={[styles.radioSelected, isDarkMode && styles.darkRadioSelected]} />
              }
            </View>
            <Text style={[styles.radioText, isDarkMode && styles.darkText]}>{t.corporate}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.radioOption}
            onPress={() => handleFieldChange(type, field, 'PERSONAL')}
          >
            <View style={[styles.radio, isDarkMode && styles.darkRadio]}>
              {(editedFarmData[field] ?? value) === 'PERSONAL' && 
                <View style={[styles.radioSelected, isDarkMode && styles.darkRadioSelected]} />
              }
            </View>
            <Text style={[styles.radioText, isDarkMode && styles.darkText]}>{t.personal}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={[styles.value, isDarkMode && styles.darkValue]}>
          {value === 'CORPORATE' ? t.corporate : value === 'PERSONAL' ? t.personal : ''}
        </Text>
      )}
    </View>
  );

  // ============================================
  // 모달 닫기 핸들러
  // ============================================
  const handleModalClose = () => {
    // 편집 상태 초기화
    setIsEditingBasic(false);
    setIsEditingFarm(false);
    
    // 외부 onClose 호출
    onClose();
  };

  // ============================================
  // 주소 선택 핸들러
  // ============================================
  const handleSelectAddress = (address) => {
    setEditedFarmData(prev => ({
      ...prev,
      applAddr: address
    }));
    setPostcodeModalVisible(false);
  };

  // ============================================
  // 메인 렌더링
  // ============================================
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleModalClose}
    >
      {/* 반투명 배경 오버레이 */}
      <View style={[styles.overlay, isDarkMode && styles.darkOverlay]}>
        <TouchableOpacity style={styles.backdrop} onPress={handleModalClose} activeOpacity={1} />
        
        {/* 모달 컨텐츠 */}
        <View style={[styles.modalContent, isDarkMode && styles.darkModalContent]}>
          {/* 닫기 아이콘 */}
          <TouchableOpacity style={styles.closeIcon} onPress={handleModalClose}>
            <Ionicons name="close" size={28} color={isDarkMode ? '#E0E0E0' : '#333333'} />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* 프로필 영역 */}
            <View style={[styles.profileSection, isDarkMode && styles.darkProfileSection]}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: profileImage }}
                  style={styles.avatar}
                />
                <TouchableOpacity 
                  style={[styles.editImageButton, isDarkMode && styles.darkEditButton]}
                  onPress={handleImageEdit}
                  activeOpacity={0.7}
                >
                  <Ionicons name="pencil" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* 기본 정보 섹션 */}
            <View style={[styles.section, isDarkMode && styles.darkSection]}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}>
                  {t.basicInfo}
                </Text>
                <TouchableOpacity 
                  style={[styles.manageButton, isDarkMode && styles.darkManageButton]}
                  onPress={() => isEditingBasic ? handleBasicSave() : setIsEditingBasic(true)}
                >
                  <Text style={styles.manageButtonText}>
                    {isEditingBasic ? t.save : t.manage}
                  </Text>
                </TouchableOpacity>
              </View>
              <InfoRow 
                label={t.name}
                value={userInfo?.userDTO?.userName || ''} 
                field="userName"
                type="basic"
                isEditing={isEditingBasic}
              />
              <TelInfoRow 
                label={t.contact}
                telArr={editedBasicData.userTelArr}
                field="userTelArr"
                type="basic"
                isEditing={isEditingBasic}
              />
              <EmailInfoRow 
                label={t.email}
                emailArr={editedBasicData.userEmailArr}
                field="userEmailArr"
                type="basic"
                isEditing={isEditingBasic}
                isLast 
              />
            </View>

            {/* 농장 정보 섹션 */}
            <View style={[styles.section, isDarkMode && styles.darkSection]}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}>
                  {t.farmInfo}
                </Text>
                <TouchableOpacity 
                  style={[styles.manageButton, isDarkMode && styles.darkManageButton]}
                  onPress={() => isEditingFarm ? handleFarmSave() : setIsEditingFarm(true)}
                >
                  <Text style={styles.manageButtonText}>
                    {isEditingFarm ? t.save : t.manage}
                  </Text>
                </TouchableOpacity>
              </View>
              <RadioInfoRow 
                label={t.applicationType}
                value={userInfo.applRole || ''} 
                field="applRole"
                type="farm"
                isEditing={isEditingFarm}
              />
              <InfoRow 
                label={t.farmName}
                value={userInfo.farmName || ''} 
                field="farmName"
                type="farm"
                isEditing={isEditingFarm}
              />
              <TelInfoRow 
                label={t.managerContact}
                telArr={editedFarmData.businessTelArr}
                field="businessTelArr"
                type="farm"
                isEditing={isEditingFarm}
              />
              <AddressInfoRow 
                label={t.address}
                applAddr={userInfo.applAddr || ''}
                addrDetail={userInfo.addrDetail || ''}
                type="farm"
                isEditing={isEditingFarm}
                isLast 
              />
            </View>
          </ScrollView>
          
          {/* 다음 우편번호 검색 모달 */}
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

export default MyInfoModal;

// ============================================
// 스타일 정의
// ============================================
const styles = StyleSheet.create({
  // 반투명 배경 오버레이
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  // 다크모드 오버레이
  darkOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  // 백드롭 (배경 터치 영역)
  backdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  // 모달 컨텐츠 컨테이너
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
  // 다크모드 모달 컨텐츠
  darkModalContent: {
    backgroundColor: '#2D2D2D',
  },
  // 닫기 아이콘
  closeIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 4,
  },
  // 프로필 섹션
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  // 다크모드 프로필 섹션
  darkProfileSection: {
    borderBottomColor: '#444',
  },
  // 아바타 컨테이너
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
  // 아바타 이미지
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    backgroundColor: '#F0F0F0',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  // 이미지 편집 버튼
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
  // 다크모드 편집 버튼
  darkEditButton: {
    borderColor: '#2D2D2D',
  },
  // 프로필 힌트 텍스트
  profileHint: {
    marginTop: 8,
    fontSize: 12,
    color: '#999999',
    fontWeight: '500',
  },
  // 섹션 컨테이너
  section: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  // 다크모드 섹션
  darkSection: {
    backgroundColor: '#1A1A1A',
  },
  // 섹션 헤더
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  // 섹션 타이틀
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  // 다크모드 섹션 타이틀
  darkSectionTitle: {
    color: '#E0E0E0',
  },
  // 관리 버튼
  manageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.SKY_300,
    borderRadius: 6,
  },
  // 다크모드 관리 버튼
  darkManageButton: {
    backgroundColor: '#1A73E8',
  },
  // 관리 버튼 텍스트
  manageButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  // 정보 행
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  // 다크모드 정보 행
  darkInfoRow: {
    borderBottomColor: '#333',
  },
  // 마지막 정보 행 (하단 보더 제거)
  infoRowLast: {
    borderBottomWidth: 0,
  },
  // 라벨 텍스트
  label: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  // 다크모드 라벨
  darkLabel: {
    color: '#B0B0B0',
  },
  // 값 텍스트
  value: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  // 다크모드 값
  darkValue: {
    color: '#E0E0E0',
  },
  // 입력 필드
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
  // 다크모드 입력 필드
  darkInput: {
    backgroundColor: '#333',
    color: '#E0E0E0',
    borderColor: '#555',
  },
  // 전화번호 입력 컨테이너
  telInputContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  // 전화번호 입력 필드
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
  // 전화번호 대시
  telDash: {
    marginHorizontal: 4,
    color: '#666666',
    fontSize: 14,
  },
  // 다크모드 텍스트
  darkText: {
    color: '#E0E0E0',
  },
  // 이메일 입력 컨테이너
  emailInputContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  // 이메일 입력 필드
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
  // 이메일 @ 기호
  emailAt: {
    marginHorizontal: 4,
    color: '#666666',
    fontSize: 14,
  },
  // 주소 컨테이너
  addressContainer: {
    flex: 2,
  },
  // 주소 첫 번째 행
  addressFirstRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  // 주소 입력 필드
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
  // 주소 검색 버튼
  addressButton: {
    backgroundColor: colors.SKY_300,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    justifyContent: 'center',
  },
  // 다크모드 주소 버튼
  darkAddressButton: {
    backgroundColor: '#1A73E8',
  },
  // 주소 버튼 텍스트
  addressButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  // 상세 주소 입력 필드
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
  // 라디오 버튼 컨테이너
  radioContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  // 라디오 옵션
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  // 라디오 버튼
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
  // 다크모드 라디오 버튼
  darkRadio: {
    borderColor: '#1A73E8',
  },
  // 라디오 선택 상태
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.SKY_300,
  },
  // 다크모드 라디오 선택 상태
  darkRadioSelected: {
    backgroundColor: '#1A73E8',
  },
  // 라디오 텍스트
  radioText: {
    fontSize: 14,
    color: '#1A1A1A',
  },
});