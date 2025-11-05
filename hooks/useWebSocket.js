import { useState, useEffect, useCallback, useRef } from 'react';

const useWebSocket = (onMotionAlert, onSettingsReceived, onAutoControlResult, onDeviceStatusReceived) => {
  const [ws, setWs] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('대기 중');

  // ✅ 콜백을 ref로 저장 (최신 값 유지하면서 useEffect 재실행 방지)
  const onMotionAlertRef = useRef(onMotionAlert);
  const onSettingsReceivedRef = useRef(onSettingsReceived);
  const onAutoControlResultRef = useRef(onAutoControlResult);
  const onDeviceStatusReceivedRef = useRef(onDeviceStatusReceived);

  // ref 업데이트
  useEffect(() => {
    onMotionAlertRef.current = onMotionAlert;
    onSettingsReceivedRef.current = onSettingsReceived;
    onAutoControlResultRef.current = onAutoControlResult;
    onDeviceStatusReceivedRef.current = onDeviceStatusReceived;
  }, [onMotionAlert, onSettingsReceived, onAutoControlResult, onDeviceStatusReceived]);

  useEffect(() => {
    const SERVER_IP = '192.168.30.235';
    const SERVER_PORT = '8765';
    const SERVER_URL = `ws://${SERVER_IP}:${SERVER_PORT}`;
    
    let socket = null;
    let reconnectTimer = null;
    let isIntentionalClose = false;
    let reconnectAttempts = 0;
    const MAX_RECONNECT_ATTEMPTS = 10;
    
    const connect = () => {
      console.log('═══════════════════════════════');
      console.log('🔌 웹소켓 연결 시도');
      console.log('서버:', SERVER_URL);
      console.log('시간:', new Date().toLocaleTimeString());
      if (reconnectAttempts > 0) {
        console.log(`재연결 시도: ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`);
      }
      console.log('═══════════════════════════════');
      
      setConnectionStatus('연결 시도 중...');
      
      socket = new WebSocket(SERVER_URL);
      
      socket.onopen = () => {
        console.log('✅ 웹소켓 연결 성공!');
        setConnectionStatus('연결됨 ✅');
        reconnectAttempts = 0;
        
        if (reconnectTimer) {
          clearTimeout(reconnectTimer);
          reconnectTimer = null;
        }
      };
      
      socket.onmessage = (event) => {
        console.log('📩 서버 메시지 수신:', event.data);
        
        try {
          const data = JSON.parse(event.data);
          console.log('📊 파싱 성공:', data);
          
          // 센서 데이터 처리
          if (data.data && data.command === 'get_sensor_data') {
            setSensorData(data.data);
            console.log('✅ 센서 데이터 업데이트 완료');
          }
          
          // 🚨 모션 알림 처리 - ref 사용
          if (data.command === 'alert' && data.type === 'motion') {
            console.log('🚨 모션 감지 알림:', data.message);
            onMotionAlertRef.current?.(data);
          }
          
          // ⚙️ 설정값 수신 처리 - ref 사용
          if (data.command === 'get_settings' && data.data) {
            console.log('⚙️ 설정값 수신:', data.data);
            onSettingsReceivedRef.current?.(data.data);
          }

          // 🔄 자동 모드 전환 제어 결과 처리 - ref 사용
          if (data.command === 'set_mode' && data.mode === 'auto' && data.control_result) {
            console.log('🔄 자동 모드 제어 결과:', data.control_result);
            onAutoControlResultRef.current?.(data.control_result);
          }
          
          // 🔄 수동 모드 전환 시 현재 상태 처리 - ref 사용
          if (data.command === 'set_mode' && data.mode === 'manual' && data.device_status) {
            console.log('🔄 수동 모드 현재 상태:', data.device_status);
            onDeviceStatusReceivedRef.current?.(data.device_status);
          }
          
          // 🔌 장치 상태 수신 처리 - ref 사용
          if (data.command === 'get_device_status' && data.data) {
            console.log('🔌 장치 상태 수신:', data.data);
            onDeviceStatusReceivedRef.current?.(data.data);
          }
        } catch (e) {
          // console.error('❌ JSON 파싱 에러:', e);
        }
      };

      socket.onerror = (error) => {
        // console.error('❌ 웹소켓 에러!', error);
        setConnectionStatus('에러 ❌');
      };

      socket.onclose = (event) => {
        console.log('🔌 웹소켓 연결 종료 - 코드:', event.code);
        
        if (!isIntentionalClose && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts++;
          console.log('⏱️  5초 후 재연결 시도...');
          setConnectionStatus('재연결 중...');
          
          reconnectTimer = setTimeout(() => {
            connect();
          }, 5000);
        } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
          // console.error('❌ 재연결 실패: 최대 시도 횟수 초과');
          setConnectionStatus('연결 불가 ❌');
        } else {
          setConnectionStatus('연결 종료');
        }
      };

      setWs(socket);
    };
    
    connect();

    return () => {
      console.log('🧹 컴포넌트 언마운트 - 웹소켓 정리');
      isIntentionalClose = true;
      
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      
      if (socket) {
        socket.close();
      }
    };
  }, []); // ✅ 의존성 배열 비우기 - 마운트 시 한 번만 실행

  // 나머지 코드는 동일...
  const getSensorData = useCallback(() => {
    console.log('📡 센서 데이터 요청');
    
    if (!ws) {
      // console.error('❌ WebSocket 객체 없음');
      return;
    }
    
    if (ws.readyState === WebSocket.OPEN) {
      const command = { command: 'get_sensor_data' };
      console.log('📤 전송:', command);
      ws.send(JSON.stringify(command));
      console.log('✅ 전송 완료');
    } else {
      // console.error('❌ WebSocket 연결 안됨 - 상태:', ws.readyState);
    }
  }, [ws]);

  const getSettings = useCallback(() => {
    console.log('⚙️ 설정값 요청');
    
    if (!ws) {
      // console.error('❌ WebSocket 객체 없음');
      return;
    }
    
    if (ws.readyState === WebSocket.OPEN) {
      const command = { command: 'get_settings' };
      console.log('📤 전송:', command);
      ws.send(JSON.stringify(command));
      console.log('✅ 전송 완료');
    } else {
      // console.error('❌ WebSocket 연결 안됨 - 상태:', ws.readyState);
    }
  }, [ws]);

  const getDeviceStatus = useCallback(() => {
    console.log('🔌 장치 상태 요청');
    
    if (!ws) {
      // console.error('❌ WebSocket 객체 없음');
      return;
    }
    
    if (ws.readyState === WebSocket.OPEN) {
      const command = { command: 'get_device_status' };
      console.log('📤 전송:', command);
      ws.send(JSON.stringify(command));
      console.log('✅ 전송 완료');
    } else {
      // console.error('❌ WebSocket 연결 안됨 - 상태:', ws.readyState);
    }
  }, [ws]);

  const controlLED = useCallback((state) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return;
    }
    
    const command = {
      command: 'manual_control',
      device: 'led',
      state: state
    };
    ws.send(JSON.stringify(command));
    console.log('💡 LED 제어:', state);
  }, [ws]);

  const controlPump = useCallback((state) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return;
    }
    
    const command = {
      command: 'manual_control',
      device: 'pump',
      state: state
    };
    ws.send(JSON.stringify(command));
  }, [ws]);

  const controlFan = useCallback((state) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return;
    }
    
    const command = {
      command: 'manual_control',
      device: 'fan',
      state: state
    };
    ws.send(JSON.stringify(command));
  }, [ws]);

  const updateSettings = useCallback((key, value) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      // console.error('❌ WebSocket 연결 안됨');
      return;
    }
    
    const command = {
      command: 'update_settings',
      key: key,
      value: value
    };
    ws.send(JSON.stringify(command));
    console.log('⚙️ 설정 변경:', key, '=', value);
  }, [ws]);

  const setMode = useCallback((device, mode) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      // console.error('❌ WebSocket 연결 안됨');
      return;
    }
    
    const command = {
      command: 'set_mode',
      device: device,
      mode: mode
    };
    ws.send(JSON.stringify(command));
    console.log('🔄 모드 변경:', device, '→', mode);
  }, [ws]);

  return {
    sensorData,
    getSensorData,
    getSettings,
    getDeviceStatus,
    controlLED,
    controlPump,
    controlFan,
    updateSettings,
    setMode,
    connectionStatus
  };
};

export default useWebSocket;