// TBD for tracer
import test from 'ava'
import { join } from 'node:path'

import {
  tracer,
  getFullPathToImport,
  extractImportsPaths
} from '../src/tracer'

const mainFile = join(__dirname, 'fixtures', 'trace', 'index.ts')

test('Testing the getFullPathToImport', async t => {
  const target1 = join(__dirname, 'fixtures', 'trace')
  const target2 = join(__dirname, 'fixtures', 'trace', 'lib')

  const result1 = await getFullPathToImport(target1)
  const result2 = await getFullPathToImport(target2)

  t.true(result1.indexOf(join('trace', 'index.ts')) > -1)
  t.true(result2.indexOf(join('trace', 'lib.ts')) > -1)
})

test.skip('Should able to return an ast file', t => {
  const ast = tracer(mainFile)

  console.dir(ast, { depth: null })

  t.pass()
})

test.only('Developing the tracer', async t => {
  const basePath = join(__dirname, 'fixtures', 'trace')
  const libFile = join(basePath, 'lib.ts')

  const ast = tracer(libFile)
  const imports = extractImportsPaths(ast)
  console.log(imports)

  const result = await Promise.all(
    imports.map((p) =>
      getFullPathToImport(p, basePath)
    )
  )

  console.log(result)

  t.pass()
})
