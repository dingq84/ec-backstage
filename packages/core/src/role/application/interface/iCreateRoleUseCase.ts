import { Either } from 'fp-ts/lib/Either'

import { IErrorOutputPort } from '@/common/application/interface/iErrorUseCase'
import { IGetPermissionListOutputPort } from '@/permission/application/interface/iGetPermissionListUseCase'
import { Status } from '@/common/constants/status'

export interface ICreateRoleInputPort {
  name: string
  status: Status
  permissions: IGetPermissionListOutputPort[]
}

export interface ICreateRoleUseCase {
  createRole(parameters: ICreateRoleInputPort): Promise<Either<IErrorOutputPort, void>>
}
