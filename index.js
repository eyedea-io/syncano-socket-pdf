const ElectronPDF = require('electron-pdf')
const express = require('express')
const app = express()
const exporter = new ElectronPDF()

exporter.on('charged', () => {
  app.listen(3000, 'localhost', () => {})

  app.get('/', (req, res) => {
    const jobOptions = {inMemory: true, closeWindow: false}

    exporter
      .createJob('./render.html', './template.pdf', [], jobOptions)
      .then(job => {
        job.on('job-complete', r => {
          res.setHeader('Content-Type', 'application/pdf')
          res.setHeader(
            'Content-Disposition',
            'attachment; filename=' + 'template.pdf'
          )
          res.end(r.results[0], 'binary')
        })
        job.render()
      })
  })
})

exporter.start()
