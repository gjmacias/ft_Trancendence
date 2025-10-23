import API_ROUTES from '@utils/api.routes';
import Logger from '@utils/Logger';

import { game } from '@components/Game/Game';

let websocket: WebSocket | null = null;

let debugCounter = 0;

class GameWebSocket {
  private _websocket: WebSocket | null = websocket;
  private messageHandler: ((data: any) => void) | null = null;
  private openHandler: (() => void) | null = null;

  private pingIntervalId: number;
  private pingIntervalMs: number = 30 * 1000;

  public constructor() {}

  public connect(onMessage?: (data: any) => void) {
    // Logger.debug('GameWebSocket.connect()');
    if (this.isActive()) {
      Logger.debug('WebSocket is already connected');
      return;
    }
    if (onMessage) {
      this.messageHandler = onMessage;
    } else {
      this.messageHandler = null;
    }

    const sessionId = sessionStorage.getItem('sessionId');
    this._websocket = new WebSocket(`${API_ROUTES.GAME.WEBSOCKET}?sessionId=${sessionId}`);
    // Logger.debug('Starting WebSocket connection');

    this._websocket.onopen = () => {
      Logger.debug('WebSocket connection established');
      if (this.openHandler) {
        Logger.debug('Triggering open handler');
        this.openHandler();
      }
      this.startPing();
    };

    this._websocket.onmessage = (event) => {
      try {
        if (event.data === 'PONG') {
          return; // ignore pong messages
        }
        const data = JSON.parse(event.data);
        const type = data.type;
        game.processMessage(type, data);
      } catch (error) {
        Logger.error('Error processing WebSocket message:', error);
        Logger.error('Received data:', event.data);
      }
    };

    this._websocket.onclose = (event) => {
      this.stopPing();
      Logger.info('WebSocket connection closed', {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean
      });
      this._websocket = null;
    };

    this._websocket.onerror = (error) => {
      Logger.error('WebSocket error:', error);
    };
  }

  public send(data: any) {
    if (this._websocket && this._websocket.readyState === WebSocket.OPEN) {
      this._websocket.send(JSON.stringify(data));
    }
  }

  public close() {
    this.stopPing();
    if (this._websocket) {
      this._websocket.close();
      this._websocket = null;
    }
  }

  public isActive(): boolean {
    return this._websocket !== null && this._websocket.readyState === WebSocket.OPEN;
  }

  public onMessage(callback: (data: any) => void) {
    this.messageHandler = callback;
  }

  public onOpen(callback: () => void) {
    this.openHandler = callback;
  }

  public get ws(): WebSocket | null {
    return this._websocket;
  }

  private startPing() {
    if (!this._websocket) return;
    this.pingIntervalId = setInterval(() => {
      if (this._websocket && this._websocket.readyState === WebSocket.OPEN) {
        const pingMessage = {
          type: 'health',
          command: 'PING',
          timestamp: Date.now()
        };
        this._websocket.send(JSON.stringify(pingMessage));
      }
    }, this.pingIntervalMs);
  }

  private stopPing() {
    if (this.pingIntervalId) {
      clearInterval(this.pingIntervalId);
      this.pingIntervalId = null;
    }
  }
}

export const gameWebSocket = new GameWebSocket();
