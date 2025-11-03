import {
  _decorator,
  Component,
  instantiate,
  Node,
  Pool,
  Prefab,
  Vec3,
} from "cc";
import { Bullet } from "../Bullet";
import EventManager from "./EventManager";
import { EVENT_TYPE, ITEM_TYPE, POOL_TYPE } from "../../Core/Defines";
import { PoolManager } from "./PoolManager";
import Timer from "../../Core/Timer";
const { ccclass, property } = _decorator;

@ccclass("BulletManager")
export class BulletManager extends Component {
  @property(Prefab)
  bulletPrefab: Prefab | null = null;

  arrBullet: Node[] = [];

  isBuff: boolean = false;

  private timer = new Timer();

  start() {
    this.initBulletPool();
    EventManager.GetInstance().on(
      EVENT_TYPE.COLLECT_ITEM,
      this.onCollectItem,
      this
    );
  }

  Update(dt: number) {
    // Update all active bullets and remove inactive ones
    this.timer.Update(dt);

    this.arrBullet = this.arrBullet.filter((bulletNode) => {
      if (bulletNode.active) {
        bulletNode.getComponent(Bullet)?.Update(dt);

        if (this.isBuff && bulletNode.getComponent(Bullet)?.dame === 1) {
          bulletNode.getComponent(Bullet)?.updateDame(10);
          this.timer.SetDuration(3);
          if (this.timer.JustFinished()) {
            bulletNode.getComponent(Bullet)?.updateDame(1);
            this.isBuff = false;
          }
        }
        return true;
      }
      return false;
    });
  }

  initBulletPool() {
    PoolManager.Instance.createPool(POOL_TYPE.BULLET, this.bulletPrefab, 20);
  }

  getBullet(pos: Vec3) {
    const bullet = PoolManager.Instance.getObject(
      POOL_TYPE.BULLET,
      this.bulletPrefab,
      pos
    );

    if (bullet) {
      bullet.getComponent(Bullet)?.init(pos);

      // Only add if not already in array
      if (this.arrBullet.indexOf(bullet) === -1) {
        this.arrBullet.push(bullet);
      }
    }

    return bullet;
  }

  returnAllBullet() {
    this.arrBullet.forEach((bullet) => {
      PoolManager.Instance.returnObject(POOL_TYPE.BULLET, bullet);
    });
    this.arrBullet = []; // Clear array after returning all
  }

  onCollectItem(type: ITEM_TYPE) {
    if (type === ITEM_TYPE.BULLET_BUFF) {
      this.isBuff = true;
      console.log("buff");
    }
  }
}
