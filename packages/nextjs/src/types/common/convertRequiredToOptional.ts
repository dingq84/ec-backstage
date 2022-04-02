type ConvertRequiredToOptional<T> = {
  [K in keyof T]-?: T[K]
}

export type { ConvertRequiredToOptional }