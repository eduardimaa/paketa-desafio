import { Request, Response } from 'express'
import Menu from '../models/menu'

const _sanitizeMenus = (menus: Array<any>) => {
    return menus.map((menu: any) => {
        return { id: menu._id.toString(), name: menu.name, relatedId: menu?.relatedId?.toString() }
    })
}

const _createTreeMenu = (menus: any, parentId?: any) => {
    return menus
        .filter((menu: any) => menu?.relatedId === parentId)
        .reduce(
            (tree: any, menu: any) => [
                ...tree,
                {
                    ...menu,
                    submenus: _createTreeMenu(menus, menu.id)
                },
            ],
            []
        )
}

export default {
    create: async (req: Request, res: Response): Promise<Response> => {
        const { id } = await Menu.create(req.body)

        return res.status(201).json({
            id
        })
    },
    getAll: async (_: Request, res: Response): Promise<Response> => {
        let menus: any[] = await Menu.find()

        const cleanMenu = _sanitizeMenus(menus)

        return res.json(_createTreeMenu(cleanMenu))
    },
    delete: async (req: Request, res: Response): Promise<Response> => {
        await Menu.deleteOne({ _id: req.params.id })
        return res.json(200)
    },
}
