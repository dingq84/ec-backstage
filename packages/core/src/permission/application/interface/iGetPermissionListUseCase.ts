import { Either } from 'fp-ts/lib/Either'

import { IErrorOutputPort } from '@/common/application/interface/iErrorUseCase'

// out port
export interface IGetPermissionListOutputPort {
  id: number
  name: string
  value: boolean
  children: {
    id: number
    name: string
    parentId: number
    value: boolean
  }[]
}

export interface IGetPermissionListUseCase {
  getPermissionList(): Promise<Either<IErrorOutputPort, IGetPermissionListOutputPort[]>>
}
