import { _decorator, Component, Node, Sprite, UITransform } from "cc";
import { SpriteManager } from "./Manager/SpriteManager";
import { EnemiesData } from "./Enemies";
import { PoolManager } from "./Manager/PoolManager";
import { ENEMY_STATE, EVENT_TYPE, POOL_TYPE } from "../Core/Defines";
import EventManager from "./Manager/EventManager";
import { GameStateManager } from "./Manager/GameStateManager";
const { ccclass, property } = _decorator;

@ccclass("Enemy")
export class Enemy extends Component {
  @property(Sprite)
  sprite: Sprite = null!;

  state = ENEMY_STATE.NONE;

  private dataEnemies = {
    hp: 0,
    speed: 0,
    isBoss : false,
  };

  Update(dt: number) {
    if (this.state === ENEMY_STATE.MOVE) this.onMove(dt);
  }

  init(data: EnemiesData) {
    const { type, hp, speed, position, isBoss, state } = data;

    let size = this.node.getComponent(UITransform);
    this.node.setWorldPosition(position.add3f(size.width / 2, 0, 0));

    this.dataEnemies.hp = hp;
    this.dataEnemies.speed = speed;
    this.sprite.spriteFrame = SpriteManager.Instance.ENEMY_SPRITE_TYPE[type];
    this.dataEnemies.isBoss = isBoss;
    this.state = state;

  }

  onMove(dt: number) {
    const newPos = this.node.worldPosition.add3f(
      -this.dataEnemies.speed * dt,
      0,
      0
    );
    this.node.setWorldPosition(newPos);
  }

  onHit(dame : number){
     this.dataEnemies.hp -= dame;
        if(this.dataEnemies.hp <= 0 ){

            this.onChangeState(ENEMY_STATE.DEAD);

            if(this.dataEnemies.isBoss){
              console.log(" Boss Die -----> Win Game ");
              GameStateManager.Instance.win();              
            }
        }
  }

  onChangeState(state: ENEMY_STATE) {
    this.state = state;
    switch (state) {
      case ENEMY_STATE.DEAD:
        PoolManager.Instance.returnObject(POOL_TYPE.ENEMY, this.node);
        break;

    }
  }

}
