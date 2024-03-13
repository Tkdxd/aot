import axios from 'axios';

describe('TestController', () => {
  beforeEach(async () => {
    jest.mock('axios', () => ({
      get: jest.fn().mockResolvedValue({ data: { foo: 'bar' } }),
    }));
  });

  describe('Test node component', () => {
    it('component open url should work', async () => {
      const payload = {
        nodes: [
          {
            id: '1',
            position: { x: 0, y: 0 },
            type: 'startNode',
            data: {},
          },
          {
            id: '2',
            position: { x: 100, y: 150 },
            type: 'openURLNode',
            data: {
              url: 'https://www.google.com/search?q=Tuy%E1%BB%83n%20d%E1%BB%A5ng%20marketing%20TopCV',
            },
          },
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2', sourceHandle: 'success' },
        ],
      };
      const response = await axios.post(
        'http://127.0.0.1:3000/api/test',
        payload,
      );
      console.log(response);
    });
  });

  afterAll(async () => {});
});
