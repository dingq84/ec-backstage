import { useRouter } from 'next/router'
import { useState, HTMLAttributes, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faCaretLeft } from '@fortawesome/free-solid-svg-icons'
import tw, { css } from 'twin.macro'

// components
import Collapse from '@/components/shared/collapse'
import Inner from '@/components/layout/sidebar/inner'
import Popover from '@/components/shared/popover/popover'
import Prefix from '@/components/layout/sidebar/prefix'

// hooks
import useEnhancedEffect from '@/hooks/useEnhancedEffect'

// states
import { useAppSelector } from '@/states/hooks'

// types
import { SidebarMenuType } from '@/types/components/sidebar'

// utils
import hasActiveChildren from '@/utils/components/sidebar/hasActiveChildren'

const divExtendGradientGradient = css`
  & {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.5) 0%,
      rgba(255, 255, 255, 0.12393) 99.88%,
      rgba(255, 255, 255, 0) 111.08%
    );
    ${tw`opacity-100`}
  }
`

const divShrinkGradientGradient = css`
  & {
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 135%);
    ${tw`opacity-100`}
  }
`

const divHoverExtendGradient = css`
  &:hover {
    ${divExtendGradientGradient}
  }
`
const divHoverShrinkGradient = css`
  &:hover {
    ${divShrinkGradientGradient}
  }
`

const liBackgroundGradient = css`
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(255, 255, 255, 0.12393) 99.88%,
    rgba(255, 255, 255, 0) 111.08%
  );
`

interface OuterProps extends HTMLAttributes<HTMLDivElement> {
  menu: SidebarMenuType
}

const Outer = (props: OuterProps) => {
  const { menu } = props
  // 分兩次解構，為了下方可以直接使用排除 children、prefix 的 menu
  const { children, prefix, ...restMenu } = menu
  const { name, href } = restMenu
  const router = useRouter()
  const { pathname } = router
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null!)
  const sidebarIsExtend = useAppSelector(state => state.settings.sidebarIsExtend)

  useEnhancedEffect(() => {
    const isActive = pathname === href || hasActiveChildren(children || [], pathname)
    setActive(isActive)

    if (children) {
      setOpen(sidebarIsExtend && isActive)
    }
  }, [sidebarIsExtend])

  useEnhancedEffect(() => {
    const onRouteChangeDone = (value: string): void => {
      const isActive = value === href || hasActiveChildren(children || [], value)
      setActive(isActive)

      if (children) {
        setOpen(isActive)
      }
    }

    router.events.on('routeChangeComplete', onRouteChangeDone)

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeDone)
    }
  }, [router.events])

  const handleClick = (): void => {
    if (children) {
      setOpen(open => !open)
    } else if (href) {
      router.push(href)
    }
  }

  const handleMouseEnter = (): void => {
    if (sidebarIsExtend === false) {
      setOpen(true)
    }
  }

  const handleMouseLeave = (): void => {
    if (sidebarIsExtend === false) {
      setOpen(false)
    }
  }

  return (
    <li
      tw="list-none rounded-lg mb-3"
      css={[open && liBackgroundGradient]}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={ref}
        tw="flex text-blue-1 opacity-40 justify-start items-center px-2 py-4 font-size[0px] hover:(cursor-pointer) rounded-lg"
        css={[
          sidebarIsExtend === false && tw`py-2 justify-center`,
          sidebarIsExtend ? divHoverExtendGradient : divHoverShrinkGradient,
          (open || active) && sidebarIsExtend && divExtendGradientGradient,
          (open || active) && sidebarIsExtend === false && divShrinkGradientGradient
        ]}
        onClick={handleClick}
      >
        <Prefix url={prefix} css={[sidebarIsExtend === false && tw`mr-0`]} />
        <Collapse inProps={sidebarIsExtend} orientation="horizontal">
          <div tw="w-32 mx-1 flex items-center justify-between">
            <span tw="color[inherit] select-none text-base leading-none text-center">{name}</span>

            {children ? (
              <span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  tw="transition-transform color[inherit]"
                  css={[open && tw`transform rotate-180`]}
                />
              </span>
            ) : null}
          </div>
        </Collapse>
      </div>

      {sidebarIsExtend && children ? (
        <Collapse inProps={open}>
          <Inner items={children} open={open} tw="pl-8 text-sm" />
        </Collapse>
      ) : null}

      {sidebarIsExtend === false ? (
        <Popover
          open={open}
          anchorEl={ref.current}
          autoWidth={false}
          anchorOrigin={{
            horizontal: 'left',
            vertical: 'top'
          }}
          hiddenBackdrop
          horizontalSpace={40}
          paperProps={{
            css: [tw`flex justify-center items-center rounded-l-none bg-transparent`]
          }}
        >
          <div
            tw="w-52 ml-7 bg-blue-7 rounded py-2 px-4 relative all-child:first-of-type:text-base"
            css={[active && tw`all-child:first-of-type:opacity-100`]}
          >
            <FontAwesomeIcon
              icon={faCaretLeft}
              tw="text-3xl! absolute text-blue-7 -left-2.5 top-1"
            />
            <Inner items={[restMenu, ...(children || [])]} open={open} tw="text-sm h-8" />
          </div>
        </Popover>
      ) : null}
    </li>
  )
}

export default Outer
