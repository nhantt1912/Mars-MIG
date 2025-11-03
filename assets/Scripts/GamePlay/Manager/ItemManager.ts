import {
  _decorator,
  Component,
  instantiate,
  math,
  Node,
  Prefab,
  randomRange,
  UITransform,
  Vec3,
} from "cc";
import { Bullet } from "../Bullet";
import Timer from "../../Core/Timer";
import { Item } from "../Item";
import { PoolManager } from "./PoolManager";
import { ITEM_TYPE, POOL_TYPE } from "../../Core/Defines";
const { ccclass, property } = _decorator;

@ccclass("ItemManager")
export class ItemManager extends Component {
  @property(Node)
  spawnZone: Node | null = null;

  @property(Prefab)
  itemPrefab: Prefab | null = null;

  arrItem: Node[] = [];
  pos: Vec3 = null!;
  private timer = new Timer();

  start() {
    if (this.itemPrefab) {
      this.initPoolItem();
    }
    this.timer.SetDuration(2);
  }

  initPoolItem() {
    PoolManager.Instance.createPool(POOL_TYPE.ITEM, this.itemPrefab, 10);
  }

  Update(dt: number) {

    this.timer.Update(dt);
    if (this.timer.JustFinished()) {
      this.timer.SetDuration(5);
      this.getItem(this.getPosition());
    }

    this.arrItem = this.arrItem.filter((item) =>{
      if(item.active) {
        item.getComponent(Item)?.Update(dt);
        return true;
      }
      return false;
    });

  }

  getItem(pos: Vec3) {
    const item = PoolManager.Instance.getObject(
      POOL_TYPE.ITEM,
      this.itemPrefab,
      pos
    );

    if (item) {
      const type = randomRange(0, 1) > 0.5 ? ITEM_TYPE.BULLET_BUFF : ITEM_TYPE.DESTROY_ENEMY;
      item.getComponent(Item)?.init(pos,type);
      if(this.arrItem.indexOf(item) === -1) this.arrItem.push(item);
      return item;
    }
  }

  returnAllItem() {
    this.arrItem.forEach((item) => {
      PoolManager.Instance.returnObject(POOL_TYPE.ITEM, item);
    });
    this.arrItem = [];
  }

  getPosition() {
    if (!this.spawnZone) {
      console.error("SpawnZone is not assigned in ItemManager");
      return new Vec3(0, 0, 0);
    }

    const zoneUITransform = this.spawnZone.getComponent(UITransform);
    if (!zoneUITransform) {
      console.error("SpawnZone does not have a UITransform component");
      return new Vec3(0, 0, 0);
    }

    const zoneHeight = zoneUITransform.height;
    const zonePos = this.spawnZone.getWorldPosition();

    const y = math.randomRange(
      zonePos.y - zoneHeight / 2,
      zonePos.y + zoneHeight / 2
    );
    return new Vec3(zonePos.x, y, 0);
  }
  
}
