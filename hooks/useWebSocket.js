import { useState, useEffect, useCallback } from 'react';

const useWebSocket = () => {
  const [ws, setWs] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('대기 중');

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
          
          if (data.data) {
            setSensorData(data.data);
            console.log('✅ 센서 데이터 업데이트 완료');
          }
        } catch (e) {
          console.error('❌ JSON 파싱 에러:', e);
        }
      };

      socket.onerror = (error) => {
        console.error('❌ 웹소켓 에러!', error);
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
          console.error('❌ 재연결 실패: 최대 시도 횟수 초과');
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
  }, []);

  // ✅ useCallback으로 함수 메모이제이션
  const getSensorData = useCallback(() => {
    console.log('📡 센서 데이터 요청');
    
    if (!ws) {
      console.error('❌ WebSocket 객체 없음');
      return;
    }
    
    if (ws.readyState === WebSocket.OPEN) {
      const command = { command: 'get_sensor_data' };
      console.log('📤 전송:', command);
      ws.send(JSON.stringify(command));
      console.log('✅ 전송 완료');
    } else {
      console.error('❌ WebSocket 연결 안됨 - 상태:', ws.readyState);
    }
  }, [ws]);

  const controlLED = useCallback((state) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error('❌ WebSocket 연결 안됨');
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
      console.error('❌ WebSocket 연결 안됨');
      return;
    }
    
    const actualState = state === 'ON' ? 'OFF' : 'ON';
    const command = {
      command: 'manual_control',
      device: 'pump',
      state: actualState
    };
    ws.send(JSON.stringify(command));
    console.log('💦 펌프 제어:', state, '→', actualState);
  }, [ws]);

  const controlFan = useCallback((state) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error('❌ WebSocket 연결 안됨');
      return;
    }
    
    const actualState = state === 'ON' ? 'OFF' : 'ON';
    const command = {
      command: 'manual_control',
      device: 'fan',
      state: actualState
    };
    ws.send(JSON.stringify(command));
    console.log('🌀 팬 제어:', state, '→', actualState);
  }, [ws]);

  const updateSettings = useCallback((key, value) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error('❌ WebSocket 연결 안됨');
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
      console.error('❌ WebSocket 연결 안됨');
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
    controlLED,
    controlPump,
    controlFan,
    updateSettings,
    setMode,
    connectionStatus
  };
};

export default useWebSocket;