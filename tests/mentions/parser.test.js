const { parser } = require('../../mentions/parser');

test('parser should parse a command to create a new rota', () => {
  const input = 'create "standup" "daily standup"';
  const result = parser.parse(input);
  
  expect(result).toMatchObject({
    name: '"standup"',
    description: '"daily standup"'
  });
});