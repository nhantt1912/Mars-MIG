
import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
import SingletonComponent from './SingletonComponent';
const { ccclass, property } = _decorator;

@ccclass('SpriteManager')
export class SpriteManager extends SingletonComponent<SpriteManager>() {

    @property([SpriteFrame])
    ENEMY_SPRITE_TYPE : SpriteFrame[] = [];
    
    @property([SpriteFrame])
    ITEM_SPRITE_TYPE : SpriteFrame[] = [];

}


