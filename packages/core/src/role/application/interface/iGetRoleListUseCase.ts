import { Either } from 'fp-ts/lib/Either'

import { Order } from '@/common/constants/order'
import { IErrorOutputPort } from '@/common/application/interface/iErrorUseCase'
import { IPaginationOutputPort } from '@/common/application/interface/iPaginationUseCase'
import { IGetPermissionListOutputPort } from '@/permission/application/interface/iGetPermissionListUseCase'
import { Status } from '@/common/constants/status'

export interface IGetRoleListInputPort {
  status?: Status
  name?: string
  orderBy: Order
  page: number
}

export interface IGetRoleOutput {
  id: number
  name: string
  status: Status
  statusText: string
  createdAt: string
  updatedAt: string
  permissions: Pick<IGetPermissionListOutputPort, 'id' | 'name'>[]
}

export interface IGetRoleListOutputPort {
  roles: IGetRoleOutput[]
  pagination: IPaginationOutputPort
}

export interface IGetRoleListUseCase {
  getRoleList(
    parameters: IGetRoleListInputPort
  ): Promise<Either<IErrorOutputPort, IGetRoleListOutputPort>>
}
