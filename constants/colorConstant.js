//프로젝트에 사용하는 대표컬러
export const colors = {
  WHITE : '#FFFFFF',
  BLACK : '#000000',
  GRAY_100 : '#F6F6F6',
  GRAY_200 : '#E2E8F0',
  GRAY_300 : '#D1D5DB',
  GRAY_500 : '#6B7280',
  GRAY_600 : '#4b5563',
  GRAY_700 : '#374151',
  MINT_50: '#F0FDFA',
  MINT_100: '#CCFBF1',
  MINT_200: '#99F6E4',
  MINT_300: '#5EEAD4',
  MINT_400: '#2DD4BF',
  MINT_500: '#14B8A6',
  GREEN_100: '#E8F9E3',
  GREEN_200: '#D1F3C7',
  GREEN_300: '#A8E890',
  GREEN_400: '#8ADC6E',
  GREEN_500: '#6BCF4F',
  GREEN_600: '#52B83A',
  BLUE_100: '#E1EAFF',
  BLUE_200: '#C3D5FF',
  BLUE_300: '#A1BAFF',
  BLUE_400: '#7A9EFF',
  BLUE_500: '#5B85F5',
  BLUE_600: '#4A6FDB',
  SKY_100: '#E0F2FE',
  SKY_200: '#BAE6FD',
  SKY_300: '#7DD3FC',
  SKY_400: '#38BDF8',
  SKY_500: '#0EA5E9',
  YELLOW: '#ffc525f8',
  RED: '#f52727ff',
}

//스위치 슬라이드 전용 컬러
export const SWITCH_THEME = {
  trackColor: { 
    false: colors.GRAY_300, 
    true: colors.GREEN_400 
  },
  thumbColor: { 
    true: colors.WHITE, 
    false: colors.GRAY_100 
  },
  iosBackgroundColor: colors.GRAY_300
};