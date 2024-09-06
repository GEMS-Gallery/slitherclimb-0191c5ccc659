import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface GameState {
  'winner' : [] | [string],
  'currentTurn' : bigint,
  'players' : Array<Player>,
}
export interface Player { 'name' : string, 'position' : bigint }
export type Result = { 'ok' : bigint } |
  { 'err' : string };
export type Result_1 = { 'ok' : string } |
  { 'err' : string };
export type Result_2 = { 'ok' : GameState } |
  { 'err' : string };
export interface _SERVICE {
  'getGameState' : ActorMethod<[], Result_2>,
  'initGame' : ActorMethod<[Array<string>], Result_1>,
  'movePlayer' : ActorMethod<[bigint], Result_1>,
  'rollDice' : ActorMethod<[], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
