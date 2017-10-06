import pdf from 'phantom-html2pdf'
import Syncano from 'syncano-server'

export default (ctx) => {
  const {response} = Syncano(ctx)

  return new Promise((resolve, reject) => {
    pdf.convert({html: ctx.args.html}, (err, result) => {
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
