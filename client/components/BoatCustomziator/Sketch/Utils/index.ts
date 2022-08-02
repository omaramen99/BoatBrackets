export namespace Utils {
  /**
   * Simple cache manager
   */
  export class Cache<Type extends any, Key extends string = string> {
    private records: Record<string, Type> = {};

    get(key: Key): Type | undefined {
      return this.records[key];
    }

    set(key: Key, object: Type) {
      this.records[key] = object;
      return this;
    }

    remove(key: Key) {
      const value = this.records[key];
      delete this.records[key];
      return value;
    }

    removeAll() {
      this.records = {};
      return this;
    }

    forEach(callback: (record: [key: string, value: Type]) => void) {
      Object.entries(this.records).forEach(callback);
    }
  }

  export function average(...nums: number[]) {
    return nums.reduce((sum, num) => sum + num, 0) / nums.length;
  }

  export function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}
