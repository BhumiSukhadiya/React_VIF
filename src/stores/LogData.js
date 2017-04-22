
class LogData {
  constructor(dataList){
    this.data=dataList;
    this.size = this.data.length;
    this._cache = [];
  }

  getObjectAt(index) {
    if (index < 0 || index > this.size){
      return undefined;
    }
    if (this._cache[index] === undefined) {
      this._cache[index] = this.data[index];
    }
    return this._cache[index];
  }

  getAll() {
    if (this._cache.length < this.size) {
      for (let i = 0; i < this.size; i++) {
        this.getObjectAt(i);
      }
    }
    return this._cache.slice();
  }

  getSize() {
    return this.size;
  }
}

export default LogData;
