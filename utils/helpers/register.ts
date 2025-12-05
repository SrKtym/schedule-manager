// オブジェクトの値を取得するヘルパー関数
export function objectValues<T extends object, K extends keyof T>(
    obj: T,
    key: K
): T[K] {
    return obj[key];
}

// すべてのパラメータから特定のパラメータをフィルタリングするヘルパー関数
export function filterByParams<
  T extends string,
  targetParams extends readonly T[]
>(
  allParams: readonly T[],
  targetParams: targetParams
): Extract<T, targetParams[number]>[] {
  return allParams.filter((x): x is Extract<T, targetParams[number]> => 
    targetParams.includes(x)
  );
}
