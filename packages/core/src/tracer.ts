// this will act like a bunlder to map out all the imports and each files
// calls and parameters and how they related to each other for Reverse Engineers
import type { AnyType, SpecifiersNode } from '../'
import { swcParserSync } from '@jsonql/ast/dist/parsers'
import { isEmptyObj } from '@jsonql/utils/dist/empty'
import { processAll } from '@jsonql/utils/dist/promise'
import fsx from 'fs-extra'
import { resolve, join, extname } from 'node:path'

/* the main call to the swc */
export function tracer (pathToFile: string, options = {}) {
  const ast = pathToAst(pathToFile, options)

  return extractBody(ast)
}

/** for filter out the import and not include the types */
function filterCallback (a: AnyType) {
  return a.type === 'ImportDeclaration' && a.typeOnly === false
}

/* we don't want duplicated import paths */
export function extractImportsPaths (ast: Array<AnyType>): Array<string> {
  // also ignore the typeOnly because we only want to know the import paths for now
  const imports = ast
    .filter(filterCallback)
    .map((a: AnyType) => {
      // the type is always source: 'StringLiteral' anyway until we encounter otherwise
      return a.source.value
    })
  return [...new Set(imports)]
}

/** this will map out what been import from where */
function extractImportProps (ast: Array<AnyType>) {
  return ast
    .filter(filterCallback)
    .map((a: AnyType) => (
      {
        importPath: a.source.value,
        identifiers: a.specifiers
          .filter((sn: SpecifiersNode) => sn.isTypeOnly !== false)
          .map((sn: SpecifiersNode) => sn.local.value)
      }
    ))
}

/** once we grab all the import paths we try to resolve them with the real path
and travel to the next */
export async function resolveImportsToPaths (
  imports: Array<string>,
  basePath?: string // how do we work out the base path?
) {
  return processAll(
    imports.map((i: string) => (
      getFullPathToImport(i, basePath)
    ))
  ).then((results: Array<AnyType>) => {
    const [ pass, fail ] = results
    // we have failed find paths
    if (fail.length > 0) {
      return processAll(fail.map((f: string) => {
        const nodeModulePath = isNodeModule(f)
        if (nodeModulePath !== false) {
          return Promise.resolve({
            full: nodeModulePath,
            path: f
          })
        }
        return Promise.reject({
          notFound: true,
          path: f
        })
      }))
      .then((results1) => {
        const [ pass1, fail1 ] = results1
        return [
          pass.concat(pass1),
          fail1
        ]
      })
    }

    return results // just return the results
  })
}

/* the real mean here we need to trace the import and go to the next file */
export function extractImportsTree (
  ast: Array<AnyType>,
  depth = 0, // id where we are and add result data to store
  store = [] // store the whole journey in an flat array
): object {
  const imports = extractImportsPaths(ast)
  const props = extractImportProps(ast)


  if (imports.length > 0) {


    const pathToImportFile = getFullPathToImport()
  }
  // finaly output will be the object map
  return store
}

/* when we get the import path then we need to workout the full path to the import file */
export async function getFullPathToImport (importPath: string, basePath?: string): Promise<string> {
  const _path = resolve(basePath ? basePath : __dirname, importPath)
  if (fsx.existsSync(_path)) {
    return getFileStat(_path)
  }
  // is there an extension? but it didn't exist
  const ext = extname(_path)
  if (!ext) {
    // @TODO should we include the other extensions like cjs / mjs / js ?
    const search = [_path, 'ts'].join('.')
    if (fsx.existsSync(search)) {
      return getFileStat(search)
    }
  }
  // This could be a node_modules, we fail it here and let the ne
  return Promise.reject(importPath) // just return the path
}

/** check the node_module to see if the import existed there */
function isNodeModule (importPath: string): boolean | string {
  // @NOTE we use the process.cwd() as the root
  // but this could be wrong
  const root = process.cwd()
  const nodeModulePath = join(root, 'node_modules')
  const searchPath = join(nodeModulePath, importPath)

  return fsx.existsSync(searchPath) ? searchPath : false
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
  // What if they have this import export only but there should be a body
  throw new Error(`There is no body field in the ast!`)
}

/* fileToAst low level code to rip the input path file to AST */
function pathToAst (pathToFile: string, options: AnyType) {
  const defaultTarget = { target: 'es2021' } // set a default target

  return swcParserSync(pathToFile, Object.assign(defaultTarget, options))
}
