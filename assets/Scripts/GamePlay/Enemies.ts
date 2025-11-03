import { _decorator, Component, Node, Sprite, Vec3 } from "cc";
import { ENEMIES_TYPE, ENEMY_STATE } from "../Core/Defines";
import { SpriteManager } from "./Manager/SpriteManager";

export interface EnemiesData{
    state : ENEMY_STATE;
    type : ENEMIES_TYPE;
    hp : number;
    speed : number;
    position : Vec3;
    isBoss : boolean;
}

