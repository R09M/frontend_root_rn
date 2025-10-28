import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios from 'axios'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import useWebSocket from '../../../hooks/useWebSocket'
import { SERVER_URL } from '../../../constants/appConst';

const HomeScreen = () => {
  const { 
    sensorData,
    getSensorData,
    connectionStatus 
  } = useWebSocket()
  const [controlCnt, setControlCnt] = useState({
    motionDetectedCnt: 0,
    fanMotorCnt: 0,
    waterPumpCnt: 0,
    ledLightCnt: 0,
    lastMotionDate: '-'
  });
  useEffect(() => {
    if (connectionStatus === '연결됨 ✅') {
      getSensorData()
      axios.get(`${SERVER_URL}/motions/today`)
      .then(res => {
        const controlCntList = res.data;
        const motionList = controlCntList.filter(item => item.motionDetected === true);
        setControlCnt({
          motionDetectedCnt: motionList.length,
          fanMotorCnt: controlCntList.filter(item => item.fanMotor === 1).length,
          waterPumpCnt: controlCntList.filter(item => item.waterPump === 1).length,
          ledLightCnt: controlCntList.filter(item => item.ledLight === 1).length,
          lastMotionDate: motionList.length > 0 ? motionList[0].timestamp : '-'
        })
      })
      .catch(e => console.log(e));
      const interval = setInterval(() => {
        getSensorData()
        axios.get(`${SERVER_URL}/motions/today`)
        .then(res => {
          const controlCntList = res.data;
          const motionList = controlCntList.filter(item => item.motionDetected === true);
          setControlCnt({
            motionDetectedCnt: motionList.length,
            fanMotorCnt: controlCntList.filter(item => item.fanMotor === 1).length,
            waterPumpCnt: controlCntList.filter(item => item.waterPump === 1).length,
            ledLightCnt: controlCntList.filter(item => item.ledLight === 1).length,
            lastMotionDate: motionList.length > 0 ? motionList[0].timestamp : '-'
          })
        })
        .catch(e => console.log(e));
      }, 60000)
      return () => clearInterval(interval)
    }
  }, [connectionStatus, getSensorData])

  if (!sensorData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFC04C" />
          <Text style={styles.loadingText}>{connectionStatus}</Text>
          <Text style={styles.loadingSubText}>센서 데이터를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    )
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.infoTextContainer}>
          <MaterialIcons name="info" 
            size={17} 
            color="black"
          />
          <Text style={styles.updateText}>
            환경 데이터 마지막 업데이트 : {dayjs(sensorData.last_update).format('YYYY-MM-DD HH:mm:ss')}
          </Text>
        </View>
        <View style={styles.sensorGrid}>
          <View style={styles.leftColumn}>
            <View style={[styles.sensorBox, styles.temperatureBox]}>
              <Text style={[styles.sensorLabel, {color: '#FF3C2B'}]}>온도</Text>
              <Text style={[styles.sensorValue, styles.temperatureValue, {color: '#d42c1dff'}]}>
                {sensorData.temperature !== null ? `${parseFloat(sensorData.temperature).toFixed(1)}°C` : '측정 중...'}
              </Text>
            </View>
            <View style={[styles.sensorBox, styles.soilBox]}>
              <Text style={[styles.sensorLabel, {color: '#2B80FF'}]}>토양</Text>
              <Text style={[styles.sensorValue, styles.soilValue, {color: '#1865daff'}]}>
                {sensorData.soil_moisture !== null ? `${parseFloat(sensorData.soil_moisture).toFixed(1)}%` : '측정 중...'}
              </Text>
            </View>
          </View>
          <View style={styles.rightColumn}>
            <View style={styles.iotHumiditySection}>
              <View style={styles.iotHeader}>
                <Text style={styles.iotText}>IoT&nbsp;&nbsp;
                  <FontAwesome5 name="wifi" 
                  size={22} 
                  color="black" 
                  />&nbsp;
                센서 데이터</Text>
              </View>
              <View style={[styles.sensorBox, styles.humidityBox]}>
                <Text style={[styles.sensorLabel, {color: '#E506CF'}]}>습도</Text>
                <Text style={[styles.sensorValue, styles.humidityValue, {color: '#ca00b6ff'}]}>
                  {sensorData.humidity !== null ? `${parseFloat(sensorData.humidity).toFixed(1)}%` : '측정 중...'}
                </Text>
              </View>
            </View>
            
            <View style={[styles.sensorBox, styles.lightBox]}>
              <Text style={[styles.sensorLabel, {color: '#18E506'}]}>조도</Text>
              <Text style={[styles.sensorValue, styles.lightValue, {color: '#2eb921ff'}]}>
                {sensorData.light_value !== null ? sensorData.light_value : '측정 중...'}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.middleRow}>
          <View style={styles.welcomeImageContainer}>
            <Text style={[styles.welcomeText, {color: '#FFB641'}]}>welcome !</Text>
            <View style={styles.greenhouseImagePlaceholder}>
              <Image 
                source={require('@/assets/images/figma-source.png')} 
                style={styles.greenhouseImage}
                resizeMode="contain"
              />
            </View>
          </View>
          <View style={styles.todayColumn}>
            <View style={styles.todayTitleContainer}>
              <FontAwesome name="power-off" 
                size={20} 
                color="black"
                style={{marginTop: 3}}
              />
              <Text style={styles.todayTitle}> Today 작동 횟수</Text>
            </View>
            <View style={[styles.controlBox, styles.ledBoxSmall]}>
              <Text style={[styles.controlLabel, styles.ledLabel]}>LED</Text>
              <Text style={[styles.controlValue, styles.ledValue]}>{controlCnt.ledLightCnt}회</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.motionTimeContainer}>
        <View style={styles.infoTextContainer}>
          <MaterialIcons name="info" 
            size={17} 
            color="black"
          />
          <Text style={styles.motionTimeText}>
            모션감지센서 마지막 작동 {dayjs(controlCnt.lastMotionDate).format('YYYY-MM-DD HH:mm:ss')}
          </Text>
        </View>
      </View>
      <View style={styles.bottomSection}>
        <View style={styles.controlGrid}>
          <View style={[styles.controlBox, styles.waterPumpBoxTall]}>
            <Text style={[styles.controlLabel, styles.waterPumpLabel]}>Water
              Pump</Text>
            <Text style={[styles.controlValue, styles.waterPumpValue]}>{controlCnt.waterPumpCnt}회</Text>
          </View>
          <View style={styles.rightControlColumn}>
            <View style={[styles.controlBox, styles.motionBoxHalf]}>
              <Text style={[styles.controlLabel, styles.motionLabel]}>Motion{"\n"}Detector</Text>
              <Text style={[styles.controlValue, styles.motionValue]}>{controlCnt.motionDetectedCnt}회</Text>
            </View>
            <View style={[styles.controlBox, styles.fanBoxHalf]}>
              <Text style={[styles.controlLabel, styles.fanLabel]}>Fan{"\n"}Motor</Text>
              <Text style={[styles.controlValue, styles.fanValue]}>{controlCnt.fanMotorCnt}회</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7ff',
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15
  },
  loadingText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
  },
  loadingSubText: {
    fontSize: 14,
    color: '#666',
  },
  topSection: {
    marginBottom: 12,
  },
  infoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 8,
  },
  updateText: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#000000ff',
  },
  sensorGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
    height: 300,
  },
  leftColumn: {
    gap: 8,
    width: 200,
  },
  temperatureBox: {
    width: 150,
    height: 146,
    backgroundColor: '#FDDDDD',
  },
  soilBox: {
    width: 200,
    height: 146,
    backgroundColor: '#DDE9FF',
  },
  rightColumn: {
    flex: 1,
    gap: 8,
  },
  iotHumiditySection: {
    height: 146,
    gap: 8,
    marginLeft: -50,
  },
  iotHeader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iotText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  humidityBox: {
    height: 70,
    backgroundColor: '#F5E2FF',
  },
  lightBox: {
    height: 146,
    backgroundColor: '#E4FFE0',
  },
  sensorBox: {
    borderRadius: 12,
    padding: 8,
  },
  sensorLabel: {
    fontSize: 23,
    fontWeight: '900',
    color: '#333333ff',
    position: 'absolute',
    top: 17,
    left: 15,
  },
  sensorValue: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  // 센서 데이터 개별 글자 크기
  // 온도
  temperatureValue: {
    fontSize: 35,
    lineHeight: 100,
    marginTop: 30,
    marginLeft: 0,
  },
  // 토양습도
  soilValue: {
    fontSize: 32,
    lineHeight: 100,
    marginTop: 30,
    marginRight: 70,
  },
  // 습도
  humidityValue: {
    fontSize: 32,
    lineHeight: 45,
    marginTop: 5,
    marginRight: -50,
  },
  // 조도
  lightValue: {
    fontSize: 32,
    lineHeight: 100,
    marginTop: 30,
    marginRight: 80,
  },
  middleRow: {
    flexDirection: 'row',
    gap: 12,
    height: 150,
    marginBottom: 12,
  },
  welcomeImageContainer: {
    width: 200,
    backgroundColor: '#f7ffaaff',
    borderWidth: 1,
    borderColor: '#fffb05ff',
    borderRadius: 20,
    padding: 10,
  },
  welcomeText: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#f59f00ff',
    position: 'absolute',
    top: 10,
    left: 20,
  },
  greenhouseImagePlaceholder: {
    width: 170,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 25,
  },
  placeholderText: {
    fontSize: 10,
    color: '#999',
  },
  todayColumn: {
    flex: 1,
    gap: 6,
  },
  todayTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 35,
  },
  todayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  ledBoxSmall: {
    flex: 1,
    backgroundColor: '#ffb050ff',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#000000ff',
  },
  motionTimeContainer: {
    marginBottom: 10,
  },
  motionTimeText: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#000000ff',
  },
  bottomSection: {
    flex: 1,
  },
  controlGrid: {
    flexDirection: 'row',
    gap: 10,
    height: 200,
  },
  controlBox: {
    borderRadius: 20,
    padding: 2,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    position: 'absolute',
  },
  // 각 라벨의 개별 크기와 위치
  ledLabel: {
    fontSize: 28,
    top: 10,
    left: 15,
    color: '#000',
  },
  waterPumpLabel: {
    fontSize: 28,
    top: 13,
    left: 15,
    color: '#000',
  },
  motionLabel: {
    fontSize: 23,
    top: 15,
    left: 15,
    color: '#000',
  },
  fanLabel: {
    fontSize: 23,
    top: 15,
    left: 15,
    color: '#000',
  },
  controlValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    lineHeight: 176,
  },
  // 제어 횟수 개별 글자 크기
  // LED 값
  ledValue: {
    fontSize: 40,
    lineHeight: 80,
    marginTop: 20,
    marginLeft: 60,
  },
  // 물펌프 값
  waterPumpValue: {
    fontSize: 40,
    lineHeight: 80,
    marginTop: 90,
    marginLeft: -50,
  },
  // 모션감지 값
  motionValue: {
    fontSize: 40,
    lineHeight: 80,
    marginTop: 2,
    marginLeft: 100,
  },
  // 팬 값
  fanValue: {
    fontSize: 40,
    lineHeight: 80,
    marginTop: 2,
    marginLeft: 100,
  },
  // 각 박스의 개별 색상 및 테두리
  waterPumpBoxTall: {
    width: '39%',
    height: '100%',
    backgroundColor: '#3ce2ffff',
    borderWidth: 3,
    borderColor: '#000000ff',
  },
  rightControlColumn: {
    flex: 1,
    gap: 10,
  },
  motionBoxHalf: {
    height: '48%',
    backgroundColor: '#69fa75ff',
    borderWidth: 3,
    borderColor: '#000000ff',
  },
  fanBoxHalf: {
    height: '48%',
    backgroundColor: '#fdb8ffff',
    borderWidth: 3,
    borderColor: '#000000ff',
  },
  greenhouseImage: {
    width: '100%',
    height: '100%',
  }
})