
import { _decorator, Component, Node } from 'cc';
import EventManager from './EventManager';
import { EVENT_TYPE } from '../../Core/Defines';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
 
    @property(Node)
    winPopup: Node = null!;

    protected start(): void {
        EventManager.GetInstance().on(EVENT_TYPE.GAME_WIN, this.onGameWin, this);
    }

    onGameWin(){
        this.winPopup.active = true;
    }


}

