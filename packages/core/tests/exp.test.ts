// testing small stuff outside of the code
import test from 'ava'

test('Should always evaluate to false', t => {
  const emptyObj = {}
  t.false(emptyObj === {})

  const fn = (o) => o === {}
  t.false(fn({}))
})
