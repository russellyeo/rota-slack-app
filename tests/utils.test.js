const utils = require('../mentions/utils');

test('clean slack username', async () => {
  const input = '<@U04NTE95SLS> list';
  const result = await utils.clean(input);
  expect(result).toEqual('list');
});

test('clean smart quotes', async () => {
  const input = 'create “Coffee” “Who’s turn is it to make coffee?”';
  const result = await utils.clean(input);
  expect(result).toEqual('create "Coffee" "Who\'s turn is it to make coffee?"');
});

test('clean reminder', async () => {
  const input = 'Reminder: @Rota "Standup" who.';
  const result = await utils.clean(input);
  expect(result).toEqual('@Rota "Standup" who.');
});
