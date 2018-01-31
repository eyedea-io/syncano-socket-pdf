/* global describe it */
import fs from 'fs'
import path from 'path'
import {assert} from 'chai'
import {run} from '@syncano/test'

describe('generate', function () {
  const args = {
    html: '<h1>Testing!</h1><p>With some paragraph</p>',
    filename: 'test.pdf'
  }

  it('pdf', async () => {
    const res = await run('generate', {args})

    assert.propertyVal(res, 'code', 200)
    assert.propertyVal(res, 'mimetype', 'application/pdf')

    fs.writeFileSync(path.join(__dirname, '.results/pdf1.pdf'), res.data)
  })

  it.only('pdf with css', async () => {
    const argsWithCss = Object.assign(args, {css: 'h1 {font-size: 60px}'})
    const res = await run('generate', {args: argsWithCss})

    assert.propertyVal(res, 'code', 200)
    assert.propertyVal(res, 'mimetype', 'application/pdf')

    fs.writeFileSync(path.join(__dirname, '.results/pdf2.pdf'), res.data)
  })
})
