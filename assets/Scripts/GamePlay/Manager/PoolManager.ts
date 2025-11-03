import {
  _decorator,
  Component,
  instantiate,
  Node,
  Prefab,
  Vec3,
  director,
  game,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("PoolManager")
export class PoolManager extends Component {
  private static _instance: PoolManager;
  public static get Instance() {
    if (!this._instance) {
      // Try to find existing PoolManager in the scene
      const scene = director.getScene();
      if (scene) {
        const found = scene.getComponentInChildren(PoolManager);
        if (found) {
          this._instance = found;
        }
      }

      // If still not found, create a new one
      if (!this._instance) {
        const poolNode = new Node("PoolManager");
        this._instance = poolNode.addComponent(PoolManager);
        director.getScene()?.addChild(poolNode);
        game.addPersistRootNode(poolNode);
        console.log("PoolManager auto-created");
      }
    }
    return this._instance;
  }

  private poolMap: Map<string, Node[]> = new Map();

  onLoad() {
    if (!PoolManager._instance) {
      PoolManager._instance = this;
    } else if (PoolManager._instance !== this) {
      this.destroy();
    }
  }

  public createPool(key: string, prefab: Prefab, amount: number) {
    if (this.poolMap.has(key)) return;

    const pool: Node[] = [];
    for (let i = 0; i < amount; i++) {
      const obj = instantiate(prefab);
      obj.active = false;
      obj.parent = this.node;
      pool.push(obj);
    }
    this.poolMap.set(key, pool);

    console.log(`Pool ${key} created`);
  }

  public getObject(key: string, prefab: Prefab, position?: Vec3): Node {
    let pool = this.poolMap.get(key);
    if (!pool) {
      this.createPool(key, prefab, 1);
      pool = this.poolMap.get(key)!;
    }

    let obj: Node;
    if (pool.length > 0) {
      obj = pool.pop()!;
    } else {
      obj = instantiate(prefab);
    }

    obj.active = true;
    if (position) obj.setPosition(position);
    obj.parent = this.node;
    return obj;
  }

  /**
   * Return an object to its pool.
   */
  public returnObject(key: string, obj: Node) {

    console.log("return object : " + key);

    obj.active = false;
    obj.parent = this.node;

    const pool = this.poolMap.get(key);
    if (pool) {
      pool.push(obj);
    } else {
      this.poolMap.set(key, [obj]);
    }
  }
}
