export const MessageSanitizer = {
  /**
   * Clean up message text so it can be parsed
   * @param {string} input original message text
   * @return {string} cleaned message text
   */
  clean: function (input: string): string {
    return input
      .replace(/^<@U\w+>/, '')
      .replace(/^Reminder: <@(\w+)\|?(\w+)?>/, '')
      .replace(/\.$/, '')
      .replace(/“/g, '"')
      .replace(/”/g, '"')
      .replace(/’/g, '\'')
      .trim();
  },
  /**
   * Remove quotes from message text
   * @param {string} input original message text
   * @return {string} cleaned message text
   */
  removeQuotes: function (input: string): string {
    return input.replace(/"+/g, '');
  }
}
