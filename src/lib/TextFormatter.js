function format(text) {
  return text
    .trim()
    .split('\n')
    .map((sentence) => sentence.trim().replace(/\s+/g, ' '))
    .join('\n');
}

module.exports = {
  format,
};
