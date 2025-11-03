import { _decorator, Component, Node, Pool, Sprite, Vec3 } from "cc";
import { EnemiesData } from "./Enemies";
import EventManager from "./Manager/EventManager";
import { EVENT_TYPE, ITEM_TYPE, POOL_TYPE } from "../Core/Defines";
import { PoolManager } from "./Manager/PoolManager";
import { SpriteManager } from "./Manager/SpriteManager";
const { ccclass, property } = _decorator;

@ccclass("Item")
export class Item extends Component {
  @property(Number)
  speed: number = 100;

  @property(Number)
  hp: number = 3;

  @property(Sprite)
  sprite: Sprite = null!;

  type : ITEM_TYPE = null!;

  Update(dt: number) {
    this.onMove(dt);
  }

  init(pos : Vec3, type: ITEM_TYPE) {
    this.node.setWorldPosition(pos);
    this.type = type;
    this.sprite.spriteFrame = SpriteManager.Instance.ITEM_SPRITE_TYPE[type];
    this.node.active = true;
  }

  onMove(dt: number) {
    const newPos = this.node.worldPosition.add3f(-this.speed * dt, 0, 0);
    this.node.setWorldPosition(newPos);

    if (this.node.worldPosition.x < 0) {
      PoolManager.Instance.returnObject(POOL_TYPE.ITEM, this.node);
    }
  }

  onHit(dame: number) {
    this.hp -= dame;
    if (this.hp <= 0) {
      this.node.active = false;
      EventManager.GetInstance().emit(EVENT_TYPE.COLLECT_ITEM,this.type);
      PoolManager.Instance.returnObject(POOL_TYPE.ITEM, this.node);
    }
  }
}
