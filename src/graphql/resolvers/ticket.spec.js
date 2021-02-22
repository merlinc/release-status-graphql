jest.mock('config');

const ticketResolver = require('./ticket');

describe('resolvers', () => {
  describe('Ticket', () => {
    describe('id', () => {
      it('should return correctly', () => {
        expect(ticketResolver.id({ number: 100 })).toEqual(100);
      });
    });

    describe('status', () => {
      it('should return correctly', () => {
        expect(ticketResolver.status({ state: 'ok' })).toEqual('ok');
      });
    });

    describe('title', () => {
      it('should return correctly', () => {
        expect(ticketResolver.title({ title: 'This is a title' })).toEqual(
          'This is a title'
        );
      });
    });
  });
});
