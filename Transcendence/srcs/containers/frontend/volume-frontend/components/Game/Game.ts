import { GameState } from './Models/GameState';
import { Camera } from './Models/Camera';
import { Field } from './Models/Field';
import { Player } from './Models/Player';
import { Ball } from './Models/Ball';
import { Light } from './Models/Light';
import { PowerUp } from './Models/PowerUp';

import { PaddleX } from './Objects/PaddleX';
import { FieldX, WallX } from './Objects/FieldX';
import { BallX } from './Objects/BallX';
import { ScoreboardX } from './Objects/ScoreboardX';

import * as BABYLON from 'babylonjs';
import { Engine, Scene, UniversalCamera } from 'babylonjs';

import API_ROUTES from "@utils/api.routes";
import MyHtml from '@utils/MyHtml3';

import { startGameController, startTournamentController } from '@components/Game/gameStartService';

import GameOverlay from './GameOverlay/GameOverlay';

import Logger from '@utils/Logger';

import { blockchainButton } from './GameOverlay/Screens/TournamentResults';

type LoggingMode = 'full' | 'minimal' | 'none';
export type GameMode = 'local' | 'remote' | 'bot' | 'test' | 'reconnect';
export type GameType = '1v1' | '2v2' | 'tournament';

export class Game {
  private gameArea: HTMLDivElement;
  public overlay: HTMLDivElement;
  private canvas: HTMLCanvasElement;
  private engine: Engine | null;
  private scene: Scene | null;
  private camera: UniversalCamera | null;

  private paddles: PaddleX[] = [];
  private balls: BallX[] = [];
  private field: FieldX;
  private scoreboard: ScoreboardX;
  private light: BABYLON.Light;

  private _active: boolean = false;
  private remoteSetupDone: boolean = false;
  private sessionId: string = '';
  private userSide: 'left' | 'right' = 'left';

  private gameType: GameType = '1v1';
  private gameMode: GameMode = 'local';

  private context: 'play' | 'tournament' = 'play';

  private readonly fieldHeight = 800;
  private readonly fieldWidth = 800 * (16 / 9);
  private readonly displayHeight = this.fieldHeight + 150;
  private readonly displayWidth = this.fieldWidth + 150;
  private readonly fov = 0.8;
  private readonly initialCameraZ = -1200;

  constructor() {
    this.createGameArea();
    this.engine = new Engine(this.canvas, true);
    this.setupScene();
    this.createCamera();
    this.createLight();
    this.createScoreboard();
  }

  private createGameCanvas(): void {
    const canvas = MyHtml.canvas({
      id: 'render-canvas',
      class: `game-canvas
      absolute
      left-0 top-0
      w-full h-full`
    });
    this.canvas = canvas;
    const resizeObserver = new ResizeObserver(() => {
      this.resizeCanvas();
      this.adjustPerspectiveCameraToFitCanvas();
      this.render();
    });
    resizeObserver.observe(this.canvas);
  }

  private createGameArea(): void {
    const gameArea = MyHtml.div({
      class: `game-area
      relative
      flex
      flex-3
      w-full h-full`
    });
    this.createGameOverlay();
    gameArea.appendChild(this.overlay);
    this.createGameCanvas();
    gameArea.appendChild(this.canvas);
    this.gameArea = gameArea;
  }

  private createGameOverlay(): void {
    this.overlay = GameOverlay.getInstance().getElement();
  }

  public getElement(): HTMLDivElement {
    return this.gameArea;
  }

  public setContext(context: 'play' | 'tournament'): void {
    this.context = context;
    if (context === 'play') {
      GameOverlay.getInstance().show('modeSelection');
    } else if (context === 'tournament') {
      GameOverlay.getInstance().show('tournamentRegistration');
    }
  }

  public async start(mode: GameMode, type: GameType = '1v1'): Promise<boolean> {
    if (!this.engine || !this.scene) {
      return;
    }
    this.gameMode = mode;
    GameOverlay.getInstance().show('loading');
    this.resizeCanvas();
    this.scoreboard.show();
    this.active = true;
    const status = await startGameController(mode);
    if (status !== 210) {
      if (status === 403) {
        GameOverlay.getInstance().show('gameError', 'alreadyInGame');
      } else {
        GameOverlay.getInstance().show('gameError');
      }
      this.active = false;
      return false;
    }
    return true;
  }
  public async startTournament(gameSettings: any = {}): Promise<boolean> {
    this.active = true;
    if (await startTournamentController(gameSettings) === false) {
      this.active = false;
      return false;
    }
    if (GameOverlay.getInstance().getScreenName() !== 'matchAnnouncement') {
      GameOverlay.getInstance().show('loading');
    }
    this.resizeCanvas();
    this.scoreboard.show();
    return true;
  }

  private setupScene(): void {
    this.scene = new Scene(this.engine);
    this.scene.clearColor = BABYLON.Color3.FromHexString('#000000'); // Set a default background color
  }

  private resizeCanvas(): void {
    if (this.canvas) {
      const { width, height } = this.canvas.getBoundingClientRect();
      // Logger.debug('Canvas dimensions: ', width, height);
      this.canvas.width = width;
      this.canvas.height = height;
      this.engine.resize();
    } else {
      Logger.error('Canvas not found');
    }
  }

  private createLight(): void {
    Logger.info('createLight()');
    this.light = new BABYLON.DirectionalLight(
      'light', // name
      new BABYLON.Vector3(0, 0, 1), // direction
      this.scene // scene
    );
    this.light.position = new BABYLON.Vector3(0, -1200, 0);
    this.light.intensity = 0.2; // Adjust intensity as needed
    this.scene.lights.push(this.light);
  }

  private createCamera(): void {
    this.camera = new BABYLON.UniversalCamera(
      'camera',
      new BABYLON.Vector3(0, 30, this.initialCameraZ),
      this.scene
    );
    this.camera.setTarget(new BABYLON.Vector3(0, 30, 0));
    this.camera.fov = this.fov;
  }

  private createPlayers(players: Player[]): void {
    if (!this.scene) return;
    for (const player of players) {
      this.paddles.push(new PaddleX(this.scene, player));
    }
  }

  private createField(field: Field): void {
    if (!this.scene) return;
    this.field = new FieldX(this.scene, field);
  }

  private createBalls(balls: Ball[]): void {
    if (!this.scene)
      return;
    for (const ball of balls) {
      this.balls.push(new BallX(this.scene, ball));
    }
  }

  private createScoreboard(): void {
    this.scoreboard = new ScoreboardX(this.gameArea);
  }

  public async processMessage(type: string, data: any): Promise<void> {
    switch (type) {
      case 'remote:start':
        const sessionId = data.sessionId as string;
        Logger.info(`REMOTE GAME STARTING AS ${sessionId}`);
        this.sessionId = sessionId;
        game.start('remote');
        break;
      case 'game:loop':
        if (!this.active) return;
        GameOverlay.getInstance().hide();
        const snapshot = JSON.parse(data.snapshot);
        if (snapshot.status === 'ended') {
          if (this.gameMode === 'remote' && snapshot.players.length === 4) {
            snapshot.players[0].nickname = 'Team 1';
            snapshot.players[1].nickname = 'Team 2';
            snapshot.players[2].nickname = 'Team 1';
            snapshot.players[3].nickname = 'Team 2';
          }
          GameOverlay.getInstance().show('matchResults', snapshot, this.context, this.userSide);
          this.scoreboard.reset();
        }
        this.update(snapshot);
        this.render();
        break;
      case 'tournament:pause':
        if (!this.active) return;
        const players = data.players;
        GameOverlay.getInstance().show('matchAnnouncement', players[0], players[1]);
        break;
      case 'tournament:result':
        if (!this.active) return;
        const results = data.results;
        GameOverlay.getInstance().show('tournamentResults', results);
        break;
      case 'tournament:blockchain':
        if (!this.active) return;

        const tournamentId = data.blockchainId;
        try {
          const response = await fetch(API_ROUTES.TOURNAMENT.BLOCKCHAIN(tournamentId.toString()));
          if (response.ok) {
            const data = await response.json();
            const explorerLink = data.explorer_link;
            blockchainButton.addEventListener('active', 'click', () => {
              window.open(explorerLink, '_blank');
            });
            blockchainButton.activate();
          } else {
            throw new Error('Failed to fetch tournament blockchain data');
          }
        } catch (error) {
          Logger.error('Error fetching tournament blockchain data:', error);
        }
        break;
      default:
        Logger.warn('Unknown message type received in game:', type);
    }
  }

  public update(gameState: GameState): void {
    if (!this.scene) return;
    if (!this.remoteSetupDone && this.gameMode === 'remote') {
      this.remoteSetup(gameState);
    }
    this.updateField(gameState.field);
    this.updatePlayers(gameState.players);
    this.updateBalls(gameState.balls);
    this.updateScoreboard(gameState.players);
  }

  private remoteSetup(gameState: GameState): void {
    const player = gameState.players.find(p => p.id === this.sessionId);
    if (!player) {
      Logger.warn('Player not found in Game.remoteSetup()');
      return;
    }
    const radians = (n: number) => n * (Math.PI / 180);
    const rotation = player.rotation - radians(90);
    if (Math.abs(player.rotation - 1.57) < 0.1) {
      this.userSide = 'left';
    } else {
      this.userSide = 'right';
      this.camera.position.y = -30;
      this.camera.setTarget(new BABYLON.Vector3(0, -30, 0));
    }
    this.camera.rotation.z += rotation;
    this.remoteSetupDone = true;
  }

  private updatePlayers(players: Player[]): void {
    if (!this.scene) return;
    this.updateScoreboard(players);
    if (this.paddles.length === 0) {
      this.createPlayers(players);
    }
    for (let i = 0; i < this.paddles.length; i++) {
      const paddle = this.paddles[i];
      const player = players[i];
      paddle.update(player);
    }
  }

  private adjustPerspectiveCameraToFitCanvas(): void {
    if (!this.camera) return;

    const aspectCanvas = this.canvas.width / this.canvas.height;

    const halfHeight = this.displayHeight / 2;
    const requiredZForHeight = halfHeight / Math.tan(this.fov / 2);

    const visibleWidthAtZ = 2 * requiredZForHeight * Math.tan(this.fov / 2) * aspectCanvas;

    if (visibleWidthAtZ >= this.displayWidth) {
      this.camera.position.z = -requiredZForHeight;
    } else {
      const halfWidth = this.displayWidth / 2;
      const requiredZForWidth = halfWidth / (Math.tan(this.fov / 2) * aspectCanvas);
      this.camera.position.z = -requiredZForWidth;
    }
  }

  private updateField(field: Field): void {
    if (!this.scene) return;
    if (!this.field) {
      this.createField(field);
    } else {
      this.field.update(field);
    }
  }

  private updateBalls(balls: Ball[]): void {
    if (!this.scene) return;
    if (this.balls.length === 0) {
      this.createBalls(balls);
    }
    for (const ball of balls) {
      let ballX = this.balls.find(b => b.getId() === ball.id);
      if (ballX) {
        ballX.update(ball);
      }
    }
  }

  private updateScoreboard(players: Player[]): void {
    if (this.gameMode === 'remote') {
      const player = players.find(p => p.id === this.sessionId);
      if (players.length === 4) {
        players[0].nickname = 'Team 1';
        players[1].nickname = 'Team 2';
        players[2].nickname = 'Team 1';
        players[3].nickname = 'Team 2';
      }
      let playersFixed = [players[0], players[1]];
      if (this.userSide === 'right') {
        playersFixed = playersFixed.reverse();
      }
      this.scoreboard.update(playersFixed);
      return;
    }
    this.scoreboard.update(players);
  }

  public render(): void {
    if (this.scene && this.engine) {
      this.scene.render();
    }
  }

  public set active(state: boolean) {
    this._active = state;
  }
  public get active(): boolean {
    return this._active;
  }
}

export const game = new Game();
