/* global describe it */
import fs from 'fs'
import path from 'path'
import {run} from '@syncano/test'
import pdfMock from 'phantom-html2pdf'

describe('generate', function () {
  const args = {
    html: '<h1>Testing!</h1><p>With some paragraph</p>',
    filename: 'test.pdf'
  }

  it('pdf', async () => {
    const result = await run('generate', {args})

    expect(result).toHaveProperty('code', 200)
    expect(result).toHaveProperty('mimetype', 'application/pdf')

    fs.writeFileSync(path.join(__dirname, '.results/pdf1.pdf'), result.data)
  })

  it('pdf with css', async () => {
    const argsWithCss = Object.assign(args, {css: 'h1 {font-size: 60px}'})
    const result = await run('generate', {args: argsWithCss})

    expect(result).toHaveProperty('code', 200)
    expect(result).toHaveProperty('mimetype', 'application/pdf')

    fs.writeFileSync(path.join(__dirname, '.results/pdf2.pdf'), result.data)
  })

  it('pdf gen error', async () => {
    const errorMsg = 'Error'
    pdfMock.convert = jest.fn()
    pdfMock.convert.mockImplementationOnce((args, callback) => {
      callback({message: errorMsg})
    })

    const result = await run('generate', {args})

    expect(result).toHaveProperty('code', 400)
    expect(result.data).toHaveProperty('message', errorMsg)
  })
})
