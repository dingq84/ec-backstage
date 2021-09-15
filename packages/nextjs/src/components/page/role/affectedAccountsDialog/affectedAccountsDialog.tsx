import { useQuery } from 'react-query'
import { useState } from 'react'
import { isLeft } from 'fp-ts/lib/Either'
import 'twin.macro'

// components
import Button from '@/components/shared/button'
import Dialog from '@/components/shared/dialog'
import Loading from '@/components/shared/loading'
import Select from '@/components/shared/select'

// constants
import { ApiKey } from '@/constants/services/api'

// core
import core from '@ec-backstage/core/src'

// hooks
import useEnhancedEffect from '@/hooks/useEnhancedEffect'

// states
import { useAppDispatch } from '@/states/global/hooks'
import { setError } from '@/states/global/error'

// types
import { Option } from '@/types/components/input'
interface RoleDialogProps {
  id: number
  open: boolean
  close: () => void
  callback: () => void
}

const AffectedAccountsDialog = (props: RoleDialogProps) => {
  const { id, open, close, callback } = props
  const [accounts, setAccounts] = useState<Option[]>([])
  const dispatch = useAppDispatch()
  const { data, isLoading } = useQuery(
    [ApiKey.roleAccountList, id],
    () => core.role.getRoleAccountList({ id }),
    {
      enabled: id !== -1,
      staleTime: 6000000,
      refetchOnWindowFocus: false
    }
  )

  useEnhancedEffect(() => {
    if (data) {
      if (isLeft(data)) {
        const { errorMessage } = data.left
        dispatch(setError({ message: errorMessage }))
      } else {
        setAccounts(
          data.right.accounts.map(account => ({ key: account.id.toString(), value: account.name }))
        )
      }
    }
  }, [data])

  const handleClick = () => {
    callback()
    close()
  }

  return (
    <>
      <Loading isLoading={isLoading} />
      <Dialog
        open={open}
        content={
          <div tw="pt-5 py-6 w-full px-15">
            <h1 tw="font-medium text-black text-2xl mb-6 text-center">系統提醒</h1>
            <p tw="text-lg font-normal text-black text-center mb-6 whitespace-pre">
              {'確訂要停用此角色？\n 停用後，綁定的帳號皆會改為預設角色。'}
            </p>
            <Select value="" options={accounts} inputProps={{ placeholder: '查看受影響帳號' }} />
          </div>
        }
        Footer={
          <div className="flex-center" tw="pb-9">
            <Button label="取消" className="btn-outline" onClick={close} />
            <Button label="確認" className="btn" tw="ml-10" onClick={handleClick} />
          </div>
        }
        close={close}
      />
    </>
  )
}

export default AffectedAccountsDialog
