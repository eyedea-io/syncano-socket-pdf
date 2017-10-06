/* global describe it */
import {assert} from 'chai'
import {run} from 'syncano-test'

describe('generate', function () {
  const args = {
    file: '<h1>Testing!</h1><p>With some paragraph</p>',
    filename: 'test.pdf'
  }

  it('small pdf', function (done) {
    run('generate', {args})
      .then(res => {
        assert.propertyVal(res, 'code', 200)
        assert.propertyVal(res, 'mimetype', 'application/pdf')
        done()
      })
  })
})
