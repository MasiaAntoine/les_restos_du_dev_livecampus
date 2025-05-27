import { UnitModel } from './UnitModel.model'

export interface IngredientModel {
  id: string
  name: string
  quantity: number
  unit: UnitModel[]
}
