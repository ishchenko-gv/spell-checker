module.exports = {
  getRandomUserId,
};

/**
 * @returns {number}
 */
function getRandomUserId() {
  return Number.parseInt(Math.random() * 1000000);
}
