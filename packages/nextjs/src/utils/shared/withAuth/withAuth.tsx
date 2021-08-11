/**
 * @author Dean Chen 2021-04-17
 * withAuth 這支主要負責處理權限的判斷，透過 next-auth 的 utils，判斷 session，並回傳對應的 Component
 *
 * @modified
 * [Dean Chen 2021-06-05]: 因為專案為 SSG，因此移除 next-auth，改用 client side 判斷
 */

import 'twin.macro'
import Link from 'next/link'
import { isLeft, isRight } from 'fp-ts/lib/Either'

// constants
import { ApiKey } from '@/constants/services/api'

// components
import Modal from '@/components/shared/modal'
import Paper from '@/components/shared/paper'
import Button from '@/components/shared/button'
import Loading from '@/components/shared/loading'

// core
import core from '@ec-backend/core'

// hooks
import useEnhancedEffect from '@/hooks/useEnhancedEffect'

// services
import useNoCacheQuery from '@/services/useNoCacheQuery'

// states
import { setMe } from '@/states/global/me'
import { useAppDispatch } from '@/states/global/hooks'

const DefaultAccessDeniedComponent = () => (
  <Modal open>
    <Paper tw="flex flex-col w-80">
      <h1 tw="text-2xl mb-6">Please Log in</h1>
      <Link href="/auth/login" passHref>
        <Button label="Sign in" className="btn" />
      </Link>
    </Paper>
  </Modal>
)

function withAuth<T extends {}>(
  Component: React.ComponentType<T>, // Protected Component
  AccessDeniedComponent: React.ComponentType<{}> = DefaultAccessDeniedComponent // Access denied Component
) {
  return function WrapperComponent(props: T) {
    // 1. 確認 accessToken 是否存在，存在的話跳至 3
    const accessToken = core.auth.token.getAccessToken()
    // 2. 如果不存在 accessToken，執行 refresh token api
    const { isLoading: refreshTokenIsLoading } = useNoCacheQuery(
      'refreshToken',
      () => core.auth.token.refreshToken(),
      {
        enabled: !accessToken
      }
    )
    // 3. 執行 me api
    const { data, isLoading, isError } = useNoCacheQuery(
      ApiKey.isLogged,
      () => core.auth.me.getMe(),
      {
        enabled: !refreshTokenIsLoading
      }
    )
    const dispatch = useAppDispatch()

    useEnhancedEffect(() => {
      // 在每次檢查是否登入時，都會更新 me 的 state
      if (data && isRight(data)) {
        dispatch(setMe(data.right))
      }
    }, [data, dispatch])

    if (isLoading || refreshTokenIsLoading) {
      return <Loading isLoading />
    }

    if (isError || (data && isLeft(data))) {
      return <AccessDeniedComponent />
    }

    return <Component {...props} />
  }
}

export default withAuth