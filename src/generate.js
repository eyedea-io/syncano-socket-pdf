import pdf from 'phantom-html2pdf'
import Syncano from '@syncano/core'

export default (ctx) => {
  const {response} = new Syncano(ctx)

  return new Promise((resolve, reject) => {
    pdf.convert(ctx.args, (err, result) => {
      if (err) {
        resolve(response({message: err.message}, 400))
      } else {
        return result.toBuffer((returnedBuffer) => {
          resolve(response(returnedBuffer, 200, 'application/pdf', {
            'Content-Disposition': `inline; filename="${ctx.args.filename || 'output.pdf'}`
          }))
        })
      }
    })
  })
}
