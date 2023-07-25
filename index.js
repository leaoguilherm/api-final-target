import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import departamentosRoutes from './src/routes/departamentosRoutes.js'

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded( { extended: true } ))
app.use(cors())

const swaggerOptions = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'API da Turma de NODEJS',
      version: '1.0.0',
      description: 'Api desenvolvida em NodeJS',
    },
    host: 'locahost',
    basePath: '/',
    servers: [
      {
        url: 'http://localhost',
      }
    ]
  },
  apis: ['./src/routes/*.js'],
}
const swaggerSpec = swaggerJsdoc(swaggerOptions)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

departamentosRoutes(app)

app.get('/', (req, res) => {
  res.send('Welcome to API')
})

app.listen(80, () => {
  console.log('Servidor sendo executado...')
})


