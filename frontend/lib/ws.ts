let socket: WebSocket | null = null;
let listeners: ((data: any) => void)[] = [];

export function connectWS(token: string) {
  if (socket && socket.readyState === WebSocket.OPEN) return socket;
  socket = new WebSocket(`ws://127.0.0.1:8000/ws?token=${token}`);
  socket.onmessage = (e) => {
    const data = JSON.parse(e.data);
    listeners.forEach((cb) => cb(data));
  };
  return socket;
}

export function onWSMessage(cb: (data: any) => void) {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

export function sendWS(data: any) {
  socket?.send(JSON.stringify(data));
}