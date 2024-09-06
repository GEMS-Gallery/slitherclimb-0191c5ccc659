export const idlFactory = ({ IDL }) => {
  const Player = IDL.Record({ 'name' : IDL.Text, 'position' : IDL.Nat });
  const GameState = IDL.Record({
    'winner' : IDL.Opt(IDL.Text),
    'currentTurn' : IDL.Nat,
    'players' : IDL.Vec(Player),
  });
  const Result_2 = IDL.Variant({ 'ok' : GameState, 'err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  return IDL.Service({
    'getGameState' : IDL.Func([], [Result_2], ['query']),
    'initGame' : IDL.Func([IDL.Vec(IDL.Text)], [Result_1], []),
    'movePlayer' : IDL.Func([IDL.Nat], [Result_1], []),
    'rollDice' : IDL.Func([], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
