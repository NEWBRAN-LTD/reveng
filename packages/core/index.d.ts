/* take this to types.d.ts later */
import type { AnyType } from '@jsonql/ast/index'
export type SpanNode = {
  start: number
  end: number
  ctxt: number
}

export type SpecifierLocalNode = {
  type: string
  span: SpanNode
  value: string
  optional: boolean
}

export type SpecifiersNode = {
  type: string
  span: SpanNode,
  local: SpecifierLocalNode
  imported?: AnyType
  isTypeOnly: boolean
}

export type AnyType
