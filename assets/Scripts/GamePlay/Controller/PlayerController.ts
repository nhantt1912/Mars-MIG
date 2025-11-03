import {
  _decorator,
  Component,
  Node,
  EventTouch,
  SystemEvent,
  v3,
  Vec3,
  EventKeyboard,
  UITransform,
  director,
  math,
} from "cc";
import { BulletManager } from "../Manager/BulletManager";
import Timer from "../../Core/Timer";
import { GameStateManager } from "../Manager/GameStateManager";
const { ccclass, property } = _decorator;

@ccclass("PlayerController")
export class PlayerController extends Component {
  @property(BulletManager)
  bulletManager: BulletManager | null = null;

  @property(Node)
  safeZone: Node = null!;

  @property(Node)
  touchZone: Node = null!;

  @property(Node)
  bulletSpawnPoint: Node | null = null;

  private timerShooting = new Timer();

  isShooting: boolean = null!;

  private minClampedY: number = null!;
  private maxClampedY: number = null!;

  private movePos: Vec3 = null!;

  start() {
    this.registerEvent();
    this.init();
  }
  Update(dt: number) {
    if (this.movePos) {
      Vec3.lerp(
        this.node.worldPosition,
        this.node.worldPosition,
        this.movePos,
        10 * dt
      );
      this.node.setWorldPosition(this.node.worldPosition);
    }

    if (this.isShooting) {
      this.timerShooting.Update(dt);

      if (this.timerShooting.JustFinished()) {
        this.shootBullet();
      }
    }
  }

  private init() {
    const safeZoneUITransform = this.safeZone.getComponent(UITransform);
    this.minClampedY =
      this.safeZone.worldPosition.y - safeZoneUITransform?.height / 2;
    this.maxClampedY =
      this.safeZone.worldPosition.y + safeZoneUITransform?.height / 2;
  }

  onTouchStart(event: EventTouch) {
    if(!GameStateManager.Instance.isPlaying()) return;

    console.log("Touch Start");
    this.isShooting = true;
    this.timerShooting.SetDuration(0.2);
  }

  onTouchMove(ev: EventTouch) {
    const newPos = v3(ev.getUILocation().x, ev.getUILocation().y);
    const clampedY = Math.min(
      Math.max(newPos.y, this.minClampedY),
      this.maxClampedY
    );
    this.movePos = v3(this.node.worldPosition.x, clampedY);
  }

  onTouchEnd(event: any) {
    this.movePos = null;
    this.isShooting = false;
  }

  shootBullet() {
    if (this.bulletManager) {
      this.timerShooting.SetDuration(0.2);
      this.bulletManager.getBullet(this.bulletSpawnPoint!.worldPosition);
    }
  }

  private registerEvent() {
    this.touchZone?.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.touchZone?.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.touchZone?.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
  }

  private unRegisterEvent() {
    this.touchZone?.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.touchZone?.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.touchZone?.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
  }

  protected onDisable(): void {
    this.unRegisterEvent();
  }
}
