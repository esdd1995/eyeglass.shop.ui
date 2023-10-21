import { AuthModel } from "./auth.model"

export class UserModel extends AuthModel {
  userName: string
  firstName: string
  lastName: string
  fullName: string
  nationalCode: string
  email: string
  imageUrl: string
  phoneNumber: string
  isNew: boolean
  address: any
  postalCode: any
  city: any
  state: any
}