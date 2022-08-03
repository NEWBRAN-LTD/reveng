// this is for testing if we could trace the import paths
import type { Id } from './lib'
import { someFunc, getId } from './lib'

const userId = 100

const userObj: Id = someFunc(userId)

const _userId = getId(userObj)

console.log(`the user id is: ${_userId}`)
