// lib just export some function

export type Id = {
  id: number
}

export function someFunc(id: number): Id {
  return { id }
}

export function getId(payload: Id): number {
  return payload.id
}
