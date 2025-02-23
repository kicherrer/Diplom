import { useEffect, useRef, useState, useCallback } from 'react';

export const useWebSocket = (url: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const wsUrl = `${url}?token=${token}`;
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      setIsConnected(true);
    };

    wsRef.current.onclose = () => {
      setIsConnected(false);
    };

    wsRef.current.onmessage = (event) => {
      setLastMessage(event.data);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url]);

  const sendMessage = useCallback((message: string) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(message);
    }
  }, [isConnected]);

  const reconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = new WebSocket(url);
    }
  }, [url]);

  return { isConnected, lastMessage, sendMessage, reconnect };
};
