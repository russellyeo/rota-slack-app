/**
 * Clean up message text so it can be parsed
 * @param {string} input original message text
 * @return {string} cleaned message text
 */
function clean(input) {
  return input
    .replace(/<@U\w+>/g, '')  
    .replace('Reminder: ', '')  
    .replace(/“/g, '"')
    .replace(/”/g, '"')
    .replace(/’/g, '\'')
    .trim();
}

module.exports = { clean };