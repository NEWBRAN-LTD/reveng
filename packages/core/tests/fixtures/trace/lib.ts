// lib just export some function

import another from './another'

export type Id = {
  id: number
  [key: string]: string | number
}

export function someFunc(id: number): Id {
  const msg = another()
  return { id, msg }
}

export function getId(payload: Id): number {
  return payload.id
}
