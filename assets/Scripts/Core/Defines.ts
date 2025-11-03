
export enum GAME_STATE {
  PLAYING,
  PAUSE,
  GAME_OVER,
  WIN
}

export enum ENEMY_STATE {
  NONE,
  IDLE,
  MOVE,
  DEAD
}

export enum POOL_TYPE {
  ENEMY = 'enemy',
  BULLET = 'bullet',
  BULLET_BUFF = 'bullet_buff',
  ITEM = 'item',
  ENEMY_BOSS = "ENEMY_BOSS",
}


export enum ENEMY_TYPE {
  ENEMY_1,
  ENEMY_2,
  BOSS,
}

export enum EVENT_TYPE{
  COLLECT_ITEM = 'collect_item',
  // Game Sate Event
  GAME_STATE_CHANGED = "GAME_STATE_CHANGED",
  GAME_PLAYING = "GAME_PLAYING",
  GAME_PAUSED = "GAME_PAUSED",
  GAME_OVER = "GAME_OVER",
  GAME_WIN = "GAME_WIN"
  
}

export enum ITEM_TYPE{
  BULLET_BUFF,
  DESTROY_ENEMY
}


export const ENEMY = [
  [
    {
      hp: 3,
      speed:200,
      type: ENEMY_TYPE.ENEMY_1,
    },
  ],
  [
    {
      hp: 3,
      speed: 200,
      type: ENEMY_TYPE.ENEMY_1,
    },
    {
      hp: 5,
      speed: 100,
      type: ENEMY_TYPE.ENEMY_2,
    },
  ],
  [
    {
      hp: 2,
      speed: 200,
      type: ENEMY_TYPE.ENEMY_1,
    },
  ],
  [
    {
      hp: 3,
      speed: 200,
      type: ENEMY_TYPE.ENEMY_1,
    },
  ],
];

export const ENEMY_BOSS = {
  hp: 10,
  speed: 100,
  type: ENEMY_TYPE.BOSS,
};

