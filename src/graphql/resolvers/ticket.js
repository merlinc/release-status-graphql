module.exports = {
  id(parent) {
    return parent.number;
  },

  status(parent) {
    return parent.state;
  },

  title(parent) {
    return parent.title;
  },
};
