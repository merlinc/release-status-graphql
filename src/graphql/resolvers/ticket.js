module.exports = {
  id(ticket) {
    return ticket.number;
  },

  status(ticket) {
    return ticket.state;
  },

  title(ticket) {
    return ticket.title;
  },
};
