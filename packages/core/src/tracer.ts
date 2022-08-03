// this will act like a bunlder to map out all the imports and each files
// calls and parameters and how they related to each other for Reverse Engineers
import type { AnyType } from './types'
import { swcParserSync } from './lib/swc-parser-base'
import { getOptions } from './lib/common'

/* the main call to the swc */
export function tracer (pathToFile: string, options = {}) {
  const ast = pathToAst(pathToFile, options)

  return extractBody(ast)
}

/* the real mean here we need to trace the import and go to the next file */
function extractImports (ast: Array<AnyType>): Array<AnyType> | boolean {
  const imports = ast.filter((a: AnyType) => a.type === 'ImportDeclaration')
  if (imports.length > 0) {

  }

  return false
}

/* when we get the import path then we need to workout the full path to the import file */
function getFullPathToImport (importPath: string): string {

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
  const opts = getOptions('ts')
  const defaultTarget = { target: 'es2021' } // set a default target

  return swcParserSync(pathToFile, Object.assign(opts, defaultTarget, options))
}
