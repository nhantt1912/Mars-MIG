import { GAME_STATE, EVENT_TYPE } from '../../Core/Defines';
import EventManager from './EventManager';

export class GameStateManager {
    private static _instance: GameStateManager | null = null;

    public static get Instance(): GameStateManager {
        if (!this._instance) {
            this._instance = new GameStateManager();
        }
        return this._instance;
    }

    private _currentState: GAME_STATE = GAME_STATE.PLAYING;

    public get currentState(): GAME_STATE {
        return this._currentState;
    }

    // Private constructor for singleton
    private constructor() {
        console.log("[GameStateManager] Singleton instance created");
    }

    public changeState(newState: GAME_STATE): void {
        if (this._currentState === newState) {
            return;
        }

        const oldState = this._currentState;
        this._currentState = newState;

        console.log(`[GameState] ${GAME_STATE[oldState]} -> ${GAME_STATE[newState]}`);

        EventManager.GetInstance().emit(EVENT_TYPE.GAME_STATE_CHANGED, {
            oldState,
            newState
        });

        this.emitStateEvent(newState);
    }

    private emitStateEvent(state: GAME_STATE): void {
        switch (state) {
            case GAME_STATE.PLAYING:
                EventManager.GetInstance().emit(EVENT_TYPE.GAME_PLAYING);
                break;
            case GAME_STATE.PAUSE:
                EventManager.GetInstance().emit(EVENT_TYPE.GAME_PAUSED);
                break;
            case GAME_STATE.GAME_OVER:
                EventManager.GetInstance().emit(EVENT_TYPE.GAME_OVER);
                break;
            case GAME_STATE.WIN:
                EventManager.GetInstance().emit(EVENT_TYPE.GAME_WIN);
                break;
        }
    }

    public isPlaying(): boolean {
        return this._currentState === GAME_STATE.PLAYING;
    }

    public isPaused(): boolean {
        return this._currentState === GAME_STATE.PAUSE;
    }

    public isGameOver(): boolean {
        return this._currentState === GAME_STATE.GAME_OVER;
    }


    public isWin(): boolean {
        return this._currentState === GAME_STATE.WIN;
    }

    public pause(): void {
        if (this._currentState === GAME_STATE.PLAYING) {
            this.changeState(GAME_STATE.PAUSE);
        }
    }

    public resume(): void {
        if (this._currentState === GAME_STATE.PAUSE) {
            this.changeState(GAME_STATE.PLAYING);
        }
    }

    public play(): void {
        this.changeState(GAME_STATE.PLAYING);
        console.log("Start Game : " + this.isPlaying());
    }

    public gameOver(): void {
        this.changeState(GAME_STATE.GAME_OVER);
    }

    public win(): void {
        this.changeState(GAME_STATE.WIN);
    }
}
