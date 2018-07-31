import pdf from 'phantom-html2pdf'

import * as S from '@eyedea/syncano'

// Arguments
interface Args {
  // filename: string
  html: string,
  // css: string
}

class Endpoint extends S.Endpoint<Args> {
  async run(
    {response}: S.Core,
    {args, meta, config}: S.Context<Args>
  ) {
    console.log('XXX')
    // response({message: 'xXXX'}, 200)
    // return {}
    const output = await new Promise((resolve, reject) => {
      pdf.convert(args, (err, result) => {
        if (err) {
          console.log('XX1', err.message)
          resolve(response({message: err.message}, 400))
        } else {
          return result.toBuffer((returnedBuffer) => {
            console.log('XX1', response)
            resolve(response(returnedBuffer, 200, 'application/pdf', {
              'Content-Disposition': `inline; filename="${args.filename || 'output.pdf'}`,
            }))
          })
        }
      })
    })
  }

  // Any error thrown in `run` method can be handled using `endpointDidCatch` method
  endpointDidCatch({message}: Error) {
    this.syncano.response.json({message}, 400)
  }
}

export default ctx => new Endpoint(ctx)