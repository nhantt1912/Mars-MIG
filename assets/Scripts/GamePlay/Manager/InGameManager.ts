import { _decorator, Component, Node } from "cc";
import { EnemiesManager } from "./EnemiesManager";
import { Bullet } from "../Bullet";
import { BulletManager } from "./BulletManager";
import { ItemManager } from "./ItemManager";
import { PlayerController } from "../Controller/PlayerController";
import EventManager from "./EventManager";
import { EVENT_TYPE } from "../../Core/Defines";
import { GameStateManager } from "./GameStateManager";
const { ccclass, property } = _decorator;

@ccclass("InGameManager")
export class InGameManager extends Component {
  @property(EnemiesManager)
  enemiesManager: EnemiesManager = null!;

  @property(BulletManager)
  bulletManager: BulletManager = null!;

  @property(ItemManager)
  itemManager: ItemManager = null!;

  @property(PlayerController)
  playerController: PlayerController = null!;

  update(dt: number) {
    if (!GameStateManager.Instance?.isPlaying()) {
      return;
    }

    this.enemiesManager.Update(dt);
    this.bulletManager.Update(dt);
    this.itemManager.Update(dt);
    this.playerController.Update(dt);
  }

  start() {
    EventManager.GetInstance().on(EVENT_TYPE.GAME_OVER, this.onGameOver, this);
    EventManager.GetInstance().on(EVENT_TYPE.GAME_WIN, this.onGameWin, this);

    GameStateManager.Instance.play();
  }

  onGameOver(): void {
    console.log("Game Over");
  }

  onGameWin(): void {
    console.log("You Win!");
    this.bulletManager.returnAllBullet();
    this.enemiesManager.returnAllEnemy();
    this.itemManager.returnAllItem();
  }

  public pauseGame(): void {
    GameStateManager.Instance?.pause();
  }

  public resumeGame(): void {
    GameStateManager.Instance?.resume();
  }
}
