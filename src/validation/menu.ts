import * as yup from 'yup'
import mongoose from 'mongoose'
import { Request, Response, NextFunction } from 'express'

import Menu from '../models/menu'

export default {
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const schema = yup.object().shape({
                name: yup.string().required().min(3).max(60),
                relatedId: yup.string().min(3).max(60)
            })

            await schema.validate(req.body, { abortEarly: false })
            return next()
        } catch (err) {
            const { errors } = err as yup.ValidationError
            return res.status(422).json({ messages: errors })
        }
    },
    objectId: (req: Request, res: Response, next: NextFunction) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.id))
            return res
                .status(400)
                .json({ message: 'Id must be a valid MongoDB ObjectId' })

        return next()
    },
    checkExistenceId: async (req: Request, res: Response, next: NextFunction) => {

        const id = req.params?.id || req.body?.relatedId

        if(!id) return next()

        if (!mongoose.Types.ObjectId.isValid(id))
            return res
                .status(400)
                .json({ message: 'Id must be a valid MongoDB ObjectId' })

        const menu = await Menu.findOne({ _id: id })

        if (!menu)
            return res
                .status(404)
                .json({ message: `Menu with id ${id} not found` })

        return next()
    },
    checkUniqueName: async (req: Request, res: Response, next: NextFunction) => {
        const menu = await Menu.findOne({ name: req.body.name })

        if (menu)
            return res
                .status(409)
                .json({ message: `There is already a record with of name ${req.body.name}` })

        return next()
    },
    checkRelatedId: async (req: Request, res: Response, next: NextFunction) => {
        const quantityMenu = await Menu.count({ relatedId: req.params.id })

        if (quantityMenu > 0)
            return res
                .status(400)
                .json({ message: `There is reference to this ${req.params.id}` })

        return next()
    }
}
