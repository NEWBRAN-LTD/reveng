// this will act like a bunlder to map out all the imports and each files
// calls and parameters and how they related to each other for Reverse Engineers
import type { AnyType } from '@jsonql/ast/index'
import { swcParserSync } from '@jsonql/ast/dist/parsers'
import fsx from 'fs-extra'
import { resolve, join, extname } from 'node:path'

/* the main call to the swc */
export function tracer (pathToFile: string, options = {}) {
  const ast = pathToAst(pathToFile, options)

  return extractBody(ast)
}

/* the real mean here we need to trace the import and go to the next file */
export function extractImportsTree (ast: Array<AnyType>, store = {}): Array<AnyType> | boolean {
  const imports = ast.filter((a: AnyType) => a.type === 'ImportDeclaration')
  if (imports.length > 0) {
    
  }

  return false
}

/* when we get the import path then we need to workout the full path to the import file */
export async function getFullPathToImport (importPath: string): Promise<string> {
  const _path = resolve(importPath)
  if (fsx.existsSync(_path)) {
    return getFileStat(_path)
  }
  // is there an extension?
  const ext = extname(_path)
  if (ext) {
    return Promise.reject(`${_path} not found!`)
  }
  // @TODO should we include the other extensions like cjs / mjs / js ?
  return getFileStat([_path, 'ts'].join('.'))
}

/** The actual method to get the file path */
async function getFileStat (importPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fsx.stat(importPath, (err: Error, stats: AnyType) => {
      if (err) {
        return reject(err)
      }
      if (stats.isDirectory()) {
        // just do this in a dumb way
        const p1 = [importPath, 'ts'].join('.')
        if (fsx.existsSync(p1)) {
          return resolve(p1)
        }
        const p2 = join(importPath, 'index.ts')
        if (fsx.existsSync(p2)) {
          return resolve(p2)
        }
      } else if (stats.isFile()) {
        return resolve(importPath)
      }
      reject(`${importPath} not found!`)
    })
  })
}



/* we only want the body part */
function extractBody (ast: AnyType) {
  if (ast.body) {
    return ast.body
  }
  throw new Error(`There is no body field in the ast!`)
}



/* fileToAst low level code to rip the input path file to AST */
function pathToAst (pathToFile: string, options: AnyType) {

  const defaultTarget = { target: 'es2021' } // set a default target

  return swcParserSync(pathToFile, Object.assign(defaultTarget, options))
}
