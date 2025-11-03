import {
  _decorator,
  BoxCollider2D,
  Component,
  Contact2DType,
  Node,
  Pool,
  UITransform,
  Vec3,
  view,
} from "cc";
import { Enemy } from "./Enemy";
import EventManager from "./Manager/EventManager";
import { EVENT_TYPE, POOL_TYPE } from "../Core/Defines";
import Timer from "../Core/Timer";
import { Item } from "./Item";
import { PoolManager } from "./Manager/PoolManager";
const { ccclass, property } = _decorator;

export enum LAYERS {
  ITEM = 2,
}

@ccclass("Bullet")
export class Bullet extends Component {
  @property(Number)
  speed: number = 500;

  @property(Number)
  dame: number = 1;

  private boxCollider2D: any = null!;

  start() {
    this.boxCollider2D = this.getComponent(BoxCollider2D);
    this.boxCollider2D?.on(
      Contact2DType.BEGIN_CONTACT,
      this.onBeginContact,
      this
    );
  }

  init(pos: Vec3) {
    this.node.setWorldPosition(pos);
    this.node.active = true;
  }

  updateDame(dame: number) {
    this.dame = dame;
  }

  onBeginContact(
    selfCollider: BoxCollider2D,

    otherCollider: BoxCollider2D,
    contact: any
  ) {
    otherCollider.getComponent(Enemy)?.onHit(this.dame);
    otherCollider.getComponent(Item)?.onHit(this.dame);
    PoolManager.Instance.returnObject(POOL_TYPE.BULLET, this.node);
  }

  Update(dt: number) {
    const newPos = new Vec3(
      this.node.worldPosition.x + this.speed * dt,
      this.node.worldPosition.y,
      this.node.worldPosition.z
    );
    this.node.setWorldPosition(newPos);

    if (this.isOutOfScreen()) {
      PoolManager.Instance.returnObject(POOL_TYPE.BULLET, this.node);
    }
  }

  private isOutOfScreen(): boolean {
    const visibleSize = view.getVisibleSize();
    const halfWidth = visibleSize.width ;

    return this.node.worldPosition.x > halfWidth;
  }

 
}
