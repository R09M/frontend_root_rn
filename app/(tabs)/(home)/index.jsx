import axios from 'axios'
import { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


// http://192.168.30.108:8080 [IP 주소]

const HomeScreen = () => {
  const [growingData, setGrowingData] = useState(null)
  const [motionCounts, setMotionCounts] = useState({
    waterPump: 0,
    led: 0,
    fan: 0,
    motion: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // 센서 데이터 조회
      const growingResponse = await axios.get(`http://192.168.30.108:8080/growings`)
      const lastGrowingData = growingResponse.data[growingResponse.data.length - 1]
      setGrowingData(lastGrowingData)

      // 오늘 작동 횟수 조회
      const motionResponse = await axios.get(`http://192.168.30.108:8080/motions/today`)
      const motionData = motionResponse.data

      // 각 속성이 1인 데이터의 개수 계산
      const counts = {
        waterPump: motionData.filter(item => item.waterPump === 1).length,
        led: motionData.filter(item => item.ledLight === 1).length,
        fan: motionData.filter(item => item.fanMotor === 1).length,
        motion: motionData.filter(item => item.motionDetected === 1).length
      }
      
      setMotionCounts(counts)

    } catch (error) {
      console.log(error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>에러: {error}</Text>
      </SafeAreaView>
    )
  }

return (
  <SafeAreaView style={styles.container}>
    {/* 상단: 센서 데이터 */}
    <View style={styles.sensorSectionTop}>
      <Text style={styles.sectionTitleTop}>센서 데이터</Text>
      <View style={styles.dataBoxTop}>
        <Text style={styles.dataTextTemper}>온도: {growingData?.temper}°C</Text>
        <Text style={styles.dataTextHumidity}>습도: {growingData?.humidity}%</Text>
        <Text style={styles.dataTextSoilHumiditiy}>토양습도: {growingData?.soilHumidity}%</Text>
        <Text style={styles.dataTextIllumination}>조도: {growingData?.illumination} lux</Text>
      </View>
    </View>

    {/* 하단: 오늘 작동 횟수 */}
    <View style={styles.motionSectionBtm}>
      <Text style={styles.sectionTitleBtm}>오늘 작동 횟수</Text>
      <View style={styles.dataBoxBtm}>
        <Text style={styles.dataTextWater}>물펌프: {motionCounts.waterPump}회</Text>
        <Text style={styles.dataTextLed}>LED: {motionCounts.led}회</Text>
        <Text style={styles.dataTextFan}>팬: {motionCounts.fan}회</Text>
        <Text style={styles.dataTextMotion}>모션감지: {motionCounts.motion}회</Text>
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