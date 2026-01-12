import React, { useEffect } from 'react';
import { io } from 'socket.io-client';

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const url = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    // create a single shared socket and attach to window for reuse
    if (!(window as any).__TYPING_SOCKET) {
      const s = io(url, { autoConnect: true, transports: ['websocket', 'polling'] });
      s.on('connect_error', (err: any) => console.warn('Socket connect error', err));
      s.on('reconnect', () => console.log('Socket reconnected'));
      (window as any).__TYPING_SOCKET = s;

      // perform simple time sync (NTP-like) to compute offset
      (async function syncTime() {
        try {
          const samples = 6;
          const offsets: number[] = [];
          for (let i = 0; i < samples; i++) {
            const t0 = Date.now();
            // send request with t0
            s.emit('time:request', { clientSent: t0 });
            // wait for response once
            const resp: any = await new Promise(resolve => {
              const handler = (msg: any) => { resolve(msg); s.off('time:response', handler); };
              s.on('time:response', handler);
            });
            const t2 = Date.now();
            const serverTime = resp.serverTime as number;
            const rtt = t2 - t0;
            const offset = serverTime - (t0 + rtt / 2);
            offsets.push(offset);
            await new Promise(r => setTimeout(r, 120));
          }
          const avg = Math.round(offsets.reduce((a, b) => a + b, 0) / offsets.length);
          (window as any).__TYPING_TIME_OFFSET = avg;
          console.log('Time sync offset (ms):', avg);
        } catch (err) {
          console.warn('Time sync failed', err);
        }
      })();
    }

    return () => {
      // keep socket alive across navigation; do not disconnect here
    };
  }, []);

  return <>{children}</>;
}
