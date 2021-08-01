// adapters
import TokenRepository from '@ec-backend/core/src/auth/adapters/repositories/Token'

// interfaces
import { IInfrastructures } from '@/dependencyInjection/interfaces/IInfrastructures'
import { IRepositories } from '@/dependencyInjection/interfaces/IRepositories'

function createRepositories(infrastructures: IInfrastructures): IRepositories {
  return {
    token: new TokenRepository(infrastructures.storage, infrastructures.http)
  }
}

export default createRepositories
