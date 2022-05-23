import express from 'express'
import Menu from '../controllers/menu'
import validation from '../validation/menu'

const routes = express.Router()

routes.post('/', validation.create, validation.checkUniqueName, validation.checkExistenceId, Menu.create)
routes.get('/', Menu.getAll)
routes.delete('/:id', validation.checkExistenceId, validation.checkRelatedId, Menu.delete)

export default routes
