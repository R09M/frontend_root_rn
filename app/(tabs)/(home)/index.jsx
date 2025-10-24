import { useEffect } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import useWebSocket from '../../../hooks/useWebSocket'

const HomeScreen = () => {
  const { 
    sensorData,
    getSensorData,
    connectionStatus 
  } = useWebSocket()

  useEffect(() => {
    // WebSocket이 연결될 때까지 기다렸다가 데이터 요청
    if (connectionStatus === '연결됨') {
      // 즉시 데이터 요청
      getSensorData()
      
      // 1분(60초)마다 자동으로 데이터 갱신
      const interval = setInterval(() => {
        getSensorData()
      }, 60000)
      
      // 클린업: 컴포넌트 언마운트 시 interval 제거
      return () => clearInterval(interval)
    }
  }, [connectionStatus])  // connectionStatus가 변경될 때마다 실행!

  // 연결 대기 중이거나 센서 데이터가 없을 때
  if (!sensorData) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          {connectionStatus}
        </Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단: 센서 데이터 */}
      <View style={styles.sensorSectionTop}>
        <Text style={styles.sectionTitleTop}>센서 데이터</Text>
        <View style={styles.dataBoxTop}>
          <Text style={styles.dataTextTemper}>온도 : {sensorData.temperature || 0}°C</Text>
          <Text style={styles.dataTextHumidity}>습도 : {sensorData.humidity || 0}%</Text>
          <Text style={styles.dataTextSoilHumiditiy}>토양습도 : {sensorData.soil_moisture || 0}%</Text>
          <Text style={styles.dataTextIllumination}>조도 : {sensorData.light_value || 0}</Text>
        </View>
      </View>

      {/* 하단: 오늘 작동 횟수 */}
      <View style={styles.motionSectionBtm}>
        <Text style={styles.sectionTitleBtm}>오늘 작동 횟수</Text>
        <View style={styles.dataBoxBtm}>
          <Text style={styles.dataTextWater}>물펌프 : 0회</Text>
          <Text style={styles.dataTextLed}>LED : 0회</Text>
          <Text style={styles.dataTextFan}>팬 : 0회</Text>
          <Text style={styles.dataTextMotion}>모션감지 : 0회</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 20
  },
  // Top 섹션 ---------------
  sensorSectionTop: {
    flex: 1,
    justifyContent: 'center'
  },
  sectionTitleTop: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15
  },
  dataBoxTop: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    gap: 10
  },
  dataTextTemper: {
    fontSize: 16,
    lineHeight: 24
  },
  dataTextHumidity: {
    fontSize: 16,
    lineHeight: 24
  },
  dataTextSoilHumiditiy: {
    fontSize: 16,
    lineHeight: 24
  },
  dataTextIllumination: {
    fontSize: 16,
    lineHeight: 24
  },
  // Btm 섹션 ---------------
  motionSectionBtm: {
    flex: 1,
    justifyContent: 'center'
  },
  sectionTitleBtm: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15
  },
  dataBoxBtm: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    gap: 10
  },
  dataTextWater: {
    fontSize: 16,
    lineHeight: 24
  },
  dataTextLed: {
    fontSize: 16,
    lineHeight: 24
  },
  dataTextFan: {
    fontSize: 16,
    lineHeight: 24
  },
  dataTextMotion: {
    fontSize: 16,
    lineHeight: 24
  }
})