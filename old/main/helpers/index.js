module.exports = {

  v_os: require('./v_os'),

  roundNumber: (val, i = 0) => {
    i = Math.pow(10, i);
    return Math.round(val * i) / i;
  },

  getRandomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

  getRandomFloat: (min, max) => Math.random() * (max - min) + min,

  getRandomColor: () => `#${Math.floor(Math.random() * 16777215).toString(16)}`,

};
