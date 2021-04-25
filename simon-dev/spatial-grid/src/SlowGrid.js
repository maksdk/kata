export default class SlowGrid {
    constructor() {
      this._clients = new Set();
    }
  
    newClient(position, dimensions) {
      const client = {
        position: position,
        dimensions: dimensions
      };
  
      this._insert(client);
  
      return client;
    }
  
    updateClient(client) {}
  
    findNear(position, dimensions) {
      const searchBox = {
        position: position,
        dimensions: dimensions
      };
  
      const overlaps = (a, b) => {
        const [aw, ah] = a.dimensions;
        const [bw, bh] = b.dimensions;
        return (
          Math.abs(a.position[0] - b.position[0]) * 2 < aw + bw &&
          Math.abs(a.position[1] - b.position[1]) * 2 < ah + bh
        );
      };
  
      const results = [];
  
      for (let c of this._clients) {
        if (overlaps(searchBox, c)) {
          results.push(c);
        }
      }
  
      return results;
    }
  
    _insert(client) {
      this._clients.add(client);
    }
  
    remove(client) {
      this._clients.delete(client);
    }
  }
  