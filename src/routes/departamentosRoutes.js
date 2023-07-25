import con from '../services/connection.js'

const departamentosRoutes = (app) => {
  const base = '/api'

  /**
   * @swagger
   * 
   * components:
   *  schemas:
   *    Departamentos:
   *      type: object
   *      required:
   *        - nome
   *        - sigla
   *      properties:
   *        nome:
   *          type: string
   *          description: nome do departamento
   *        sigla:
   *          type: string
   *          description: sigla do departamento
   *      example:
   *        nome: ex_depto
   *        sigla: exd
   */




  /**
   * @swagger
   * 
   * /api/departamentos:
   *  get:
   *    description: Lista todos os departamentos
   *    produces:
   *      - application/json
   *    responses:
   *      200:
   *        description: O servidor respondeu com sucesso
   */
  app.get(`${base}/departamentos`, async (req, res) => {
    const [rows] = await con.query('SELECT * FROM DEPARTAMENTOS')
    res.json(rows)
  })

  /**
   * @swagger
   * 
   * /api/departamentos:
   *  post:
   *    description: Cadastra um departamento
   *    produces:
   *      - application/json
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/Departamentos'
   *    responses:
   *      201:
   *        description: Registro inserido com sucesso
   *      400:
   *        description: Parametros insuficientes 
   *      500:
   *        description: Erro interno
   */
  app.post(`${base}/departamentos`, async (req, res) => {
    const { nome, sigla } = req.body

    // Validação antes de executar a query
    if (!nome || !sigla) {
      res.status(400).json({ message: 'One or more fields are unset'})
      return
    }
    
    try {
      const [result] = await con.query('INSERT INTO DEPARTAMENTOS (nome, sigla) VALUES (?, ?)', [nome, sigla])
      res.status(201).json(result)
    } catch(e) {
      console.error(`[ERROR] ${e}`)
      if (e.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ message: e.message })
        return
      }
      // Se não tiver encontrado o erro, foi algo critico
      res.status(500).json({ message: e.message })
    }
  })

  app.delete(`${base}/departamentos/:id_departamento`, async (req, res) => {
    const { id_departamento } = req.params

    if (!id_departamento) {
      res.status(400).json({ message: 'One or more fields are unset' })
      return
    }

    try {
      const query = 'DELETE FROM DEPARTAMENTOS WHERE id_departamento = ?'
      const [result] = await con.query(query, [id_departamento])

      // Valida se o registro existe
      if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Record not found' })
        return
      }

      res.json({ message: 'Record was deleted' })
    } catch(e) {
      res.status(500).json({ message: 'Error on delete record', exception: e })
    }

  })

  app.patch(`${base}/departamentos/:id_departamento`, async (req, res) => {
    const { id_departamento } = req.params
    const { nome, sigla } = req.body

    if (!id_departamento || (!nome && !sigla)) {
      res.status(400).json({ message: 'One or more fields are unset' })
      return
    }

    try {
      const departamento = {}
      if (nome) departamento.nome = nome
      if (sigla) departamento.sigla = sigla

      const query = 'UPDATE DEPARTAMENTOS SET ? WHERE id_departamento = ?'
   
      const [result] = await con.query(query, [departamento, id_departamento])

      res.json(result)

    } catch(e) {
      res.status(500).json({ message: 'Error on update record', exception: e })
    }

  })
}

export default departamentosRoutes
