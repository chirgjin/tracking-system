/**
 * Set key on an object.
 * Splits the key on '.' & nests it
 */
export type SetKey<
  T extends any,
  Key extends string,
  Value
> = Key extends `${infer U1}.${infer U2}`
  ? U1 extends keyof T
    ? T[U1] extends object | Record<string, any>
      ? T & Record<U1, SetKey<T[U1], U2, Value>>
      : T & Record<U1, SetKey<{}, U2, Value>>
    : T & Record<U1, SetKey<{}, U2, Value>>
  : T & Record<Key, Value>

export type User = {
  entityId: string
  name: string
  email: string
  apiKey: string
  createdAt: string
  updatedAt: string | null
}
