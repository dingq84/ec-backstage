/**
 * @author Dean Chen 2021-04-17
 * Header 從首頁中拉出來，主要顯示使用者訊息已經 Sidebar 的控制，
 * 屬於 Default layout 的一個 component，所以放在 layout 底下
 */

import { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import tw from 'twin.macro'

// components
import Button from '@/components/shared/button'
import Popover from '@/components/shared/popover'
import ModifyPasswordDialog from '@/components/layout/header/modifyPasswordDialog'
import LogoutDialog from '@/components/layout/header/logoutDialog'

// states
import { useAppSelector } from '@/states/global/hooks'

const Header = () => {
  const anchorEl = useRef<HTMLSpanElement>(null!)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const [modifyPasswordDialogOpen, setModifyPasswordDialogOpen] = useState(false)
  const user = useAppSelector(state => state.me.user)

  const userName = user?.name ? `嗨${user.name}，您好!` : ''
  const accountName = user?.account || ''
  const roleName = user?.roles && user?.roles.length ? user?.roles[0].name : ''

  const togglePopover = (open: boolean): void => {
    setPopoverOpen(open)
  }

  const openLogoutDialog = (): void => {
    setPopoverOpen(false)
    setLogoutDialogOpen(true)
  }

  const closeLogoutDialog = (): void => {
    setLogoutDialogOpen(false)
  }

  const openUpdatePasswordDialog = (): void => {
    setPopoverOpen(false)
    setModifyPasswordDialogOpen(true)
  }

  const closeModifyPasswordDialog = (): void => {
    setModifyPasswordDialogOpen(false)
  }

  return (
    <>
      <header tw="relative bg-blue-1 flex flex-col md:flex-row">
        <nav tw="flex justify-between text-black flex-grow pr-3">
          <div>router</div>
          <div tw="text-gray-3" data-testid="functions" className="flex-center">
            <small tw="text-gray-3">{userName}</small>
            <small tw="text-black ml-5 mr-2.5" ref={anchorEl}>
              {roleName}
            </small>
            <Button
              className="btn-text"
              onClick={() => togglePopover(true)}
              label={
                <FontAwesomeIcon
                  icon={faChevronDown}
                  tw="text-sm transition-transform duration-300 text-black"
                  css={[popoverOpen && tw`transform rotate-180`]}
                />
              }
            />
          </div>
        </nav>
        <Popover
          verticalSpace={25}
          horizontalSpace={-35}
          open={popoverOpen}
          autoWidth={false}
          anchorEl={anchorEl.current}
          onClose={() => togglePopover(false)}
          paperProps={{ css: [tw`w-32 px-0 py-0 shadow-xl flex-col`] }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <div tw="h-12" className="flex-center">
            <small tw="mx-1.5 text-gray-3">{accountName}</small>
          </div>

          <div tw="mx-auto mt-1 mb-2.5 w-11/12 bg-gray-2 height[1px]"></div>

          <ul tw="w-full all:(py-1.5 text-xs font-normal flex justify-center hover:(bg-gray-2))">
            <li onClick={openUpdatePasswordDialog}>
              <Button className="btn-text" label="重設密碼" tw="text-black" />
            </li>
            <li onClick={openLogoutDialog} tw="cursor-pointer">
              <Button className="btn-text" label="登出" tw="text-black" />
            </li>
          </ul>
        </Popover>
      </header>
      <LogoutDialog open={logoutDialogOpen} close={closeLogoutDialog} />
      {modifyPasswordDialogOpen ? (
        <ModifyPasswordDialog open={modifyPasswordDialogOpen} close={closeModifyPasswordDialog} />
      ) : null}
    </>
  )
}

export default Header
