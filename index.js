const ElectronPDF = require('electron-pdf')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const fs = require('fs')
const exporter = new ElectronPDF()

app.use(bodyParser.json({limit: '5mb'}))
app.use(bodyParser.urlencoded({extended: true, limit: '5mb'}))

exporter.on('charged', () => {
  app.listen(3000, 'localhost', () => {})

  app.post('/', (req, res) => {
    const {template} = req.body

    createTemplate(template)
      .then(queueJob)
      .then(resolveJob)
      .then(({pdf, filename}) => {
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=' + `${filename}.pdf`
        )
        res.end(pdf, 'binary')
      })
  })
})

exporter.start()

function createTemplate (template) {
  return new Promise((resolve, reject) => {
    const filename = `${hashString(template).toString(36)}`

    fs.writeFile(`./storage/${filename}.html`, template, () => {
      resolve(filename)
    })
  })
}

function queueJob (filename) {
  const jobOptions = {
    inMemory: true,
    closeWindow: false
  }

  return exporter
    .createJob(`./storage/${filename}.html`, `${filename}.pdf`, [], jobOptions)
    .then(job => ({job, filename}))
}

function resolveJob ({job, filename}) {
  return new Promise(resolve => {
    job.on('job-complete', r => {
      resolve({pdf: r.results[0], filename})
      fs.unlink(`./storage/${filename}.html`)
    })

    job.render()
  })
}

function hashString (str, seed) {
  let hash = 0
  let i
  let chr

  if (str.length === 0) return hash

  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0
  }

  return hash
}
