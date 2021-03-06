import { useState, memo } from 'react'
import tw, { css } from 'twin.macro'

// components
import Button from '@/components/shared/button'
import Paper from '@/components/shared/paper'
import { Tabs, Tab, TabList, TabPanel } from '@/components/shared/tab'
import Select from '@/components/shared/select'
import TextField from '@/components/shared/textField'
import AccountTable from '@/components/page/account/table'
import AccountDrawer from '@/components/page/account/drawer'

// constants
import { ApiKey } from '@/constants/services/api'

// core
import core from '@ec-backstage/core/src'
import { Order } from '@ec-backstage/core/src/common/constants/order'
import { Status } from '@ec-backstage/core/src/common/constants/status'

// layouts
import DefaultLayout from '@/layouts/default'
import useEnhancedEffect from '@/hooks/useEnhancedEffect'

// services
import useNormalQuery from '@/services/useNormalQuery'

// types
import { Option } from '@/types/components/input'

const inputCss = css`
  & {
    ${tw`flex-grow`}

    & > div > div {
      ${tw`bg-blue-1`}
    }

    & input {
      ${tw`text-sm placeholder:text-gray-3`}
    }
  }
`

const selectCss = css`
  & {
    width: 180px;
    ${tw`mx-5`}
  }

  & > div > div > div {
    ${tw`border-gray-1 bg-white text-gray-3`}
  }

  & input {
    ${tw`text-white text-xs placeholder:text-gray-3`}
  }

  & label {
    ${tw`text-xs mb-2`}
  }

  &[data-selected='true'] {
    & > div > div > div {
      ${tw`border-transparent bg-primary text-white`}
    }
  }
`

interface SearchContainer {
  keyword: string
  roleId: number | undefined
  search: (keyword: string, role: string) => void
}

const SearchContainer = memo(
  (props: SearchContainer) => {
    const { keyword: propKeyword, roleId: propRoleId, search } = props
    const [keyword, setKeyword] = useState(propKeyword)
    const [roleId, setRoleId] = useState(propRoleId === undefined ? '' : propRoleId.toString())
    const [roleList, setRoleList] = useState<Option[]>([])
    const { data } = useNormalQuery(
      ApiKey.roleList,
      () => core.role.getRoleList({ orderBy: Order.Desc, page: 1 }),
      {
        staleTime: 600000
      }
    )

    useEnhancedEffect(() => {
      setKeyword(propKeyword)
      if (propRoleId === undefined) {
        setRoleId('')
      } else {
        setRoleId(propRoleId.toString())
      }
    }, [propKeyword, propRoleId])

    useEnhancedEffect(() => {
      if (data) {
        setRoleList(data.roles.map(role => ({ key: role.id.toString(), value: role.name })))
      }
    }, [data])

    const handleNameChange = (newKeyword: string): void => {
      setKeyword(newKeyword)
    }

    const handleRoleChange = (newRoleId: string): void => {
      setRoleId(newRoleId)
    }

    const handleClick = (): void => {
      search(keyword, roleId)
    }

    return (
      <Paper tw="w-full flex-col items-start py-4 px-5 mb-5 relative">
        <span tw="text-black text-xs font-medium block absolute">?????????????????????</span>
        <div tw="w-full flex items-end">
          <TextField
            placeholder="??????????????????????????????"
            css={[inputCss]}
            value={keyword}
            onChange={handleNameChange}
            onClear={() => setKeyword('')}
            tabIndex={1}
          />
          <Select
            value={roleId}
            options={roleList}
            inputProps={{ label: '????????????', placeholder: '??????', border: true }}
            css={[selectCss]}
            onChange={handleRoleChange}
            paperProps={{ css: [tw`text-gray-3 text-xs`] }}
            data-selected={String(roleId !== '')}
          />
          <Button
            className="btn-outline"
            tw="py-2 px-9 text-sm"
            label="??????"
            onClick={handleClick}
            tabIndex={2}
          />
        </div>
      </Paper>
    )
  },
  (prevProps, nextProps) => {
    return prevProps.keyword === nextProps.keyword && prevProps.roleId === nextProps.roleId
  }
)

export enum Mode {
  'create' = 'create',
  'edit' = 'edit',
  'view' = 'view'
}

const Admin = () => {
  const [keyword, setKeyword] = useState('')
  const [roleId, setRoleId] = useState<undefined | number>(undefined)
  const [status, setStatus] = useState<Status>(-1)
  const [currentAccountId, setCurrentAccountId] = useState<number | undefined>(undefined)
  const [drawProps, setDrawProps] = useState({ open: false, mode: Mode.view })
  const handleSearch = (newKeyword: string, newRoleId: string): void => {
    setKeyword(newKeyword)
    setRoleId(newRoleId === '' ? undefined : Number(newRoleId))
  }

  const handleTabClick = (newStatus: Status): void => {
    setStatus(newStatus)
  }

  const changeModeToEdit = (): void => {
    setDrawProps({ ...drawProps, mode: Mode.edit })
  }

  const openDrawer = (mode: Mode, accountId: number | undefined = undefined): void => {
    setDrawProps({ open: true, mode })
    setCurrentAccountId(accountId)
  }

  const closeDrawer = (): void => {
    setDrawProps({ ...drawProps, open: false })
  }

  return (
    <>
      <div tw="flex items-center justify-between">
        <h1 tw="text-blue-gray-3 font-medium text-2xl">????????????</h1>
        <Button className="btn" label="????????????" onClick={() => openDrawer(Mode.create)} />
      </div>

      <Tabs>
        <TabList>
          <Tab click={() => handleTabClick(-1)}>????????????</Tab>
          <Tab click={() => handleTabClick(1)}>???????????????</Tab>
          <Tab click={() => handleTabClick(0)}>???????????????</Tab>
        </TabList>

        <TabPanel>
          <SearchContainer keyword={keyword} roleId={roleId} search={handleSearch} />
          <AccountTable keyword={keyword} roleId={roleId} status={status} openDrawer={openDrawer} />
        </TabPanel>

        <TabPanel>
          <SearchContainer keyword={keyword} roleId={roleId} search={handleSearch} />
          <AccountTable keyword={keyword} roleId={roleId} status={status} openDrawer={openDrawer} />
        </TabPanel>

        <TabPanel>
          <SearchContainer keyword={keyword} roleId={roleId} search={handleSearch} />
          <AccountTable keyword={keyword} roleId={roleId} status={status} openDrawer={openDrawer} />
        </TabPanel>
      </Tabs>

      <AccountDrawer
        {...drawProps}
        id={currentAccountId}
        close={closeDrawer}
        changeModeToEdit={changeModeToEdit}
      />
    </>
  )
}

Admin.layout = DefaultLayout
Admin.auth = true

export default Admin
