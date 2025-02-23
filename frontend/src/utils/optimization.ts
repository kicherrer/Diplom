import { memoize } from 'lodash';

export const imageLoader = memoize((url: string, width: number = 300) => {
  const params = new URLSearchParams({
    url: encodeURIComponent(url),
    w: width.toString(),
    q: '75'
  });

  return `/api/optimize-image?${params.toString()}`;
});

export const lazyImport = <T extends any>(
  factory: () => Promise<T>,
  timeout = 3000
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Import timeout'));
    }, timeout);

    factory()
      .then((module) => {
        clearTimeout(timer);
        resolve(module);
      })
      .catch(reject);
  });
};

export const measurePerformance = async <T>(
  fn: () => Promise<T>,
  name: string
): Promise<T> => {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    console.log(`${name} took ${duration.toFixed(2)}ms`);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`${name} failed after ${duration.toFixed(2)}ms:`, error);
    throw error;
  }
};
