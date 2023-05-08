const utils = require('../mentions/utils');

describe('clean', () => {
  test('clean slack username from the start of the string', async () => {
    const input = '<@U04NTE95SLS> list';
    const result = await utils.clean(input);
    expect(result).toEqual('list');
  });

  test("don't clean usernames from anywhere else in the string", async () => {
    const input = '<@U04NTE95SLS> add standup <@UUYDKKSK1> <@U01RY5FBPDH>';
    const result = await utils.clean(input);
    expect(result).toEqual('add standup <@UUYDKKSK1> <@U01RY5FBPDH>');
  });

  test('clean smart quotes', async () => {
    const input = 'create “Coffee” “Who’s turn is it to make coffee?”';
    const result = await utils.clean(input);
    expect(result).toEqual('create "Coffee" "Who\'s turn is it to make coffee?"');
  });

  test('clean reminder', async () => {
    const input = 'Reminder: <@U04NTE95SLS> @Rota standup who.';
    const result = await utils.clean(input);
    expect(result).toEqual('@Rota standup who');
  });
});
