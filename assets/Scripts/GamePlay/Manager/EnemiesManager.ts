import {
  _decorator,
  Component,
  instantiate,
  math,
  Node,
  Prefab,
  randomRange,
  randomRangeInt,
  UITransform,
  Vec3,
} from "cc";
import { EnemiesData } from "../Enemies";
import {
  ENEMY,
  ENEMY_BOSS,
  ENEMY_STATE,
  ENEMY_TYPE,
  EVENT_TYPE,
  ITEM_TYPE,
  POOL_TYPE,
} from "../../Core/Defines";
import Timer from "../../Core/Timer";
import { Enemy } from "../Enemy";
import { PoolManager } from "./PoolManager";
import EventManager from "./EventManager";
import { GameStateManager } from "./GameStateManager";
const { ccclass, property } = _decorator;

@ccclass("EnemiesManager")
export class EnemiesManager extends Component {
  @property(Prefab)
  enemiesPrefab: Prefab = null!;

  @property(Node)
  spawnZone: Node = null!;

  @property(Number)
  minDistance: number = 50;

  @property(Number)
  countSpawn: number = 0;

  @property(Number)
  targetSpwanBoss: number = 5;

  private isSpawnBoss: boolean = false;

  arrEnemies: Node[] = [];
  private timerSpawn = new Timer();

  protected start(): void {
    this.initPoolEnemies();
    this.timerSpawn.SetDuration(1);

    EventManager.GetInstance().on(
      EVENT_TYPE.COLLECT_ITEM,
      this.onCollectItem,
      this
    );
  }

  Update(dt: number) {
    this.timerSpawn.Update(dt);

    // Update all active enemies and remove inactive ones
    this.arrEnemies = this.arrEnemies.filter((enemyNode) => {
      if (enemyNode.active) {
        enemyNode.getComponent(Enemy)?.Update(dt);
        return true; 
      }
      return false;
    });

    if (this.countSpawn == this.targetSpwanBoss && !this.isSpawnBoss) {
      this.isSpawnBoss = true;
      this.spawnBoss();
      return;
    }

    if (
      this.timerSpawn.JustFinished() &&
      this.countSpawn < this.targetSpwanBoss
    ) {
      this.timerSpawn.SetDuration(2);
      this.spawnEnemies();
      this.countSpawn++;
    }
  }

  onCollectItem(type: ITEM_TYPE) {
    if (type == ITEM_TYPE.DESTROY_ENEMY) {
      this.onReturnAllEnemy();
    }
  }

  onReturnAllEnemy() {
    // this.arrEnemies = this.arrEnemies.filter((enemyNode) => {
    //   if (enemyNode.active) {
    //     PoolManager.Instance.returnObject(POOL_TYPE.ENEMY, enemyNode);
    //     console.log(" Kill All Enemies And Complete Game ");
    //     if(enemyNode.getComponent(Enemy)?.type == ENEMY_TYPE.BOSS) {
    //       GameStateManager.Instance.win();
    //     }
    //     return false;
    //   }
    // });

    let hasBoss = false;

  this.arrEnemies.forEach((enemyNode) => {
    if (enemyNode.active) {
      const enemy = enemyNode.getComponent(Enemy);
      
      if (enemy?.type == ENEMY_TYPE.BOSS) {
        hasBoss = true;
      }
      
      PoolManager.Instance.returnObject(POOL_TYPE.ENEMY, enemyNode);
    }
  });

  this.arrEnemies = [];

  if (hasBoss) {
    console.log("Kill All Enemies Including Boss -> Win Game!");
    GameStateManager.Instance.win();
  } else {
    console.log("Kill All Enemies");
  }
  }

  private initPoolEnemies() {
    if (this.enemiesPrefab) {
      PoolManager.Instance.createPool(POOL_TYPE.ENEMY, this.enemiesPrefab, 20);
      PoolManager.Instance.createPool(
        POOL_TYPE.ENEMY_BOSS,
        this.enemiesPrefab,
        1
      );
    }
  }

  private getEnemiesFormPool() {
    return PoolManager.Instance.getObject(POOL_TYPE.ENEMY, this.enemiesPrefab);
  }

  private getEnemiesBossFormPool() {
    return PoolManager.Instance.getObject(
      POOL_TYPE.ENEMY_BOSS,
      this.enemiesPrefab
    );
  }

  spawnEnemies() {
    const randomWaveIndex = randomRangeInt(0, ENEMY.length);
    const wave = ENEMY[randomWaveIndex];
    const positions = this.getPositons(wave.length);

    for (let i = 0; i < wave.length; i++) {
      const data: EnemiesData = {
        hp: wave[i].hp,
        speed: wave[i].speed,
        type: wave[i].type,
        position: positions[i],
        isBoss: false,
        state: ENEMY_STATE.MOVE,
      };

      const enemyNode = this.getEnemiesFormPool();
      if (enemyNode) {
        enemyNode.getComponent(Enemy)?.init(data);
        // Only add if not already in array
        if (this.arrEnemies.indexOf(enemyNode) === -1) {
          this.arrEnemies.push(enemyNode);
        }
      }
    }
  }

  spawnBoss() {
    const wave = ENEMY_BOSS;

    const zoneUITransform = this.spawnZone.getComponent(UITransform);
    const zoneHeight = zoneUITransform.height;
    const zonePos = this.spawnZone.getWorldPosition();
    const y = math.randomRange(
      zonePos.y - zoneHeight / 2,
      zonePos.y + zoneHeight / 2
    );
    const pos = new Vec3(zonePos.x, y, 0);

    const data: EnemiesData = {
      hp: wave.hp,
      speed: wave.speed,
      type: wave.type,
      position: pos,
      isBoss: true,
      state: ENEMY_STATE.MOVE,
    };

    console.log("CREATE BOSS ");
    const bossNode = this.getEnemiesBossFormPool();
    if (bossNode) {
      bossNode.getComponent(Enemy)?.init(data);
      // Only add if not already in array
      if (this.arrEnemies.indexOf(bossNode) === -1) {
        this.arrEnemies.push(bossNode);
      }
    }
  }

  returnAllEnemy() {
    this.arrEnemies.forEach((enemyNode) => {
      if (enemyNode.active) {
        PoolManager.Instance.returnObject(POOL_TYPE.ENEMY, enemyNode);
      }
    });
    this.arrEnemies = []; 
  }

  getPositons(number: number) {
    const positions: Vec3[] = [];
    const zoneUITransform = this.spawnZone.getComponent(UITransform);
    const maxAttempts = 100;

    if (!zoneUITransform) {
      return positions;
    }

    const zoneHeight = zoneUITransform.height;
    const zonePos = this.spawnZone.getWorldPosition();

    for (let i = 0; i < number; i++) {
      let position: Vec3 | null = null;
      let attempts = 0;

      while (position === null && attempts < maxAttempts) {
        attempts++;
        const y = math.randomRange(
          zonePos.y - zoneHeight / 2,
          zonePos.y + zoneHeight / 2
        );

        const newPos = new Vec3(zonePos.x, y, 0);

        if (!this.isOverlapping(newPos, positions)) {
          position = newPos;
        }
      }

      if (position !== null) {
        positions.push(position);
      } else {
        break;
      }
    }

    return positions;
  }

  isOverlapping(pos: Vec3, existingPositions: Vec3[]): boolean {
    for (const existingPos of existingPositions) {
      const distance = Vec3.distance(pos, existingPos);
      if (distance < this.minDistance) {
        return true;
      }
    }
    return false;
  }
}
