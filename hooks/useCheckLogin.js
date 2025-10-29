// useCheckLogin.js
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

const useCheckLogin = () => {
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const getLoginInfo = async () => {
        const loginInfo = await SecureStore.getItemAsync('loginInfo');
        const result = JSON.parse(loginInfo);
        console.log('로그인 데이터=', loginInfo);
        if (result === null) {
          router.replace('/auth/login');
        }
      };
      getLoginInfo();
    }, [])
  );
};

export default useCheckLogin;
