export default function memoize(callback: (...a: any) => any): any {
  const cash = new Map();
  return function func(...args: any) {
    const key = args.length + args.join('&');

    if (cash.has(key)) {
      return cash.get(key);
    } else {
      const result = callback.apply(func, args);
      cash.set(key, result);
      return result;
    }
  };
}
