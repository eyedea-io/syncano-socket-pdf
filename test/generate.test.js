/* global describe it */
import {assert} from 'chai'
import {run} from 'syncano-test'

describe('generate', function () {
  const args = {
    html: '<h1>Testing!</h1><p>With some paragraph</p>',
    filename: 'test.pdf'
  }

  it('pdf', function (done) {
    run('generate', {args})
      // .then(res => res.is('success'))
      .then(res => {
        assert.propertyVal(res, 'code', 200)
        assert.propertyVal(res, 'mimetype', 'application/pdf')
        done()
      })
  })

  it('pdf with css', function (done) {
    const argsWithCss = Object.assign(args, {css: 'h1 {font-size: 60px}'})
    run('generate', {argsWithCss})
      // .then(res => res.is('success'))
      .then(res => {
        assert.propertyVal(res, 'code', 200)
        assert.propertyVal(res, 'mimetype', 'application/pdf')
        done()
      })
  })
})
