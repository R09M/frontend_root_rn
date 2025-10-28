import { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import useWebSocket from '../../../hooks/useWebSocket'
import axios from 'axios'
import {SERVER_URL} from '../../../constants/appConst'
import dayjs from 'dayjs'

const HomeScreen = () => {
  const { 
    sensorData,
    getSensorData,
    connectionStatus 
  } = useWebSocket()

  // 작동 횟수 데이터를 담을 state 변수
  const [controlCnt, setControlCnt] = useState({
    motionDetectedCnt: 0
    , fanMotorCnt: 0
    , waterPumpCnt: 0
    , ledLightCnt: 0
    , lastMotionDate: '-'
  });

  useEffect(() => {
    console.log('🏠 HomeScreen useEffect 실행', {
      connectionStatus,
      timestamp: new Date().toLocaleTimeString()
    })

    // WebSocket이 연결되면 데이터 요청
    if (connectionStatus === '연결됨 ✅') {
      console.log('✅ 연결됨 - 데이터 요청 시작')
      
      // 즉시 데이터 요청
      getSensorData()

      axios.get(`${SERVER_URL}/motions/today`)
      .then(res => {
        const controlCntList = res.data;
        const setMotionDetectedCnt = controlCntList.filter(item => item.motionDetected === true).length; 
        const setFanMotorCnt = controlCntList.filter(item => item.fanMotor === 1).length; 
        const setWaterPumpCnt = controlCntList.filter(item => item.waterPump === 1).length; 
        const setLedLightCnt = controlCntList.filter(item => item.ledLight === 1).length; 
        const motionList = controlCntList.filter(item => item.motionDetected === true);
        const lastMotionDate = motionList.length > 0
                              ? motionList[0].timestamp
                              : '-'
        setControlCnt({
          motionDetectedCnt: setMotionDetectedCnt
          , fanMotorCnt: setFanMotorCnt
          , waterPumpCnt: setWaterPumpCnt
          , ledLightCnt: setLedLightCnt
          , lastMotionDate
        })
      })
      .catch(e => console.log(e));
      
      // 1분(60초)마다 자동으로 데이터 갱신
      const interval = setInterval(() => {
        console.log('⏰ 1분 경과 - 데이터 재요청')
        getSensorData()

        axios.get(`${SERVER_URL}/motions/today`)
        .then(res => {
          const controlCntList = res.data;
          const setMotionDetectedCnt = controlCntList.filter(item => item.motionDetected === true).length; 
          const setFanMotorCnt = controlCntList.filter(item => item.fanMotor === 1).length; 
          const setWaterPumpCnt = controlCntList.filter(item => item.waterPump === 1).length; 
          const setLedLightCnt = controlCntList.filter(item => item.ledLight === 1).length; 
          const motionList = controlCntList.filter(item => item.motionDetected === true);
          const lastMotionDate = motionList.length > 0
                              ? motionList[0].timestamp
                              : '-'
          setControlCnt({
            motionDetectedCnt: setMotionDetectedCnt
            , fanMotorCnt: setFanMotorCnt
            , waterPumpCnt: setWaterPumpCnt
            , ledLightCnt: setLedLightCnt
            , lastMotionDate
          })
        })
        .catch(e => console.log(e));
      }, 60000)
      
      // 클린업: 컴포넌트 언마운트 시 interval 제거
      return () => {
        console.log('🧹 HomeScreen 정리 - interval 제거')
        clearInterval(interval)
      }
    }
  }, [connectionStatus, getSensorData])  // ✅ 의존성 배열에 둘 다 추가

  // 연결 대기 중이거나 센서 데이터가 없을 때
  if (!sensorData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>
            {connectionStatus}
          </Text>
          <Text style={styles.loadingSubText}>
            센서 데이터를 불러오는 중...
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 연결 상태 표시 (선택사항) */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>{connectionStatus}</Text>
      </View>

      {/* 상단: 센서 데이터 */}
      <View style={styles.sensorSectionTop}>
        <Text style={styles.sectionTitleTop}>센서 데이터</Text>
        <View style={styles.dataBoxTop}>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>🌡️ 온도</Text>
            <Text style={styles.dataValue}>
              {sensorData.temperature !== null && sensorData.temperature !== undefined 
                ? `${sensorData.temperature}°C` 
                : '측정 중...'}
            </Text>
          </View>
          
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>💧 습도</Text>
            <Text style={styles.dataValue}>
              {sensorData.humidity !== null && sensorData.humidity !== undefined 
                ? `${sensorData.humidity}%` 
                : '측정 중...'}
            </Text>
          </View>
          
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>🌱 토양습도</Text>
            <Text style={styles.dataValue}>
              {sensorData.soil_moisture !== null && sensorData.soil_moisture !== undefined 
                ? `${sensorData.soil_moisture}%` 
                : '측정 중...'}
            </Text>
          </View>
          
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>☀️ 조도</Text>
            <Text style={styles.dataValue}>
              {sensorData.light_value !== null && sensorData.light_value !== undefined 
                ? sensorData.light_value 
                : '측정 중...'}
            </Text>
          </View>

          {/* 마지막 업데이트 시간 */}
          {sensorData.last_update && (
            <View style={styles.updateTimeContainer}>
              <Text style={styles.updateTimeText}>
                마지막 업데이트: {dayjs(sensorData.last_update).format('YYYY-MM-DD HH:mm:ss')}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* 하단: 오늘 작동 횟수 */}
      <View style={styles.motionSectionBtm}>
        <Text style={styles.sectionTitleBtm}>오늘 작동 횟수</Text>
        <View style={styles.dataBoxBtm}>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>💦 물펌프</Text>
            <Text style={styles.dataValue}>{controlCnt.waterPumpCnt}회</Text>
          </View>
          
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>💡 LED</Text>
            <Text style={styles.dataValue}>{controlCnt.ledLightCnt}회</Text>
          </View>
          
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>🌀 팬</Text>
            <Text style={styles.dataValue}>{controlCnt.fanMotorCnt}회</Text>
          </View>
          
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>👁️ 모션감지</Text>
            <Text style={styles.dataValue}>{controlCnt.motionDetectedCnt}회</Text>
          </View>
        </View>

        {/* 마지막 업데이트 시간 */}
        <View>
          <Text>
            마지막 업데이트: {dayjs(controlCnt.lastMotionDate).format('YYYY-MM-DD HH:mm:ss')}
          </Text>
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
  
  // 로딩 화면 스타일
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center'
  },
  loadingSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  },

  // 상태 바
  statusBar: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 15,
    alignSelf: 'flex-start'
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500'
  },

  // Top 섹션 (센서 데이터)
  sensorSectionTop: {
    flex: 1,
    justifyContent: 'center'
  },
  sectionTitleTop: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333'
  },
  dataBoxTop: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 12,
    gap: 12
  },

  // 데이터 행 스타일
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  dataLabel: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500'
  },
  dataValue: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600'
  },

  // 업데이트 시간
  updateTimeContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  updateTimeText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center'
  },

  // Bottom 섹션 (작동 횟수)
  motionSectionBtm: {
    flex: 1,
    justifyContent: 'center'
  },
  sectionTitleBtm: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333'
  },
  dataBoxBtm: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 12,
    gap: 12
  }
})