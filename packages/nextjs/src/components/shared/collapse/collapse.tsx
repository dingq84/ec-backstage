/**
 * @author Dean Chen 2021-04-09
 * @link https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/Collapse/Collapse.js
 * Collapse 主要是為了達成需要伸縮動畫的地方，像是 Sidebar，至於 Drawer 請參考 Slide，
 * 大部分邏輯借鏡 Material-UI 的 Collapse，刪減部分功能，並修復一些問題，
 * 如 Material 的垂直向是透過 Height 控制，但在實作伸縮的縮 Transition 沒有奏效，
 * 因此改良成 Max-height
 *
 * @modified
 * [Dean Chen 2021-04-17]: 將原本預設的寬度或是最大高為 0 的設定改成根據 inProps 來決定是否放入
 * 目的是為了解決初始狀態為 true，畫面會是縮小的樣子
 */

import { HTMLAttributes, forwardRef, useRef } from 'react'
import { Transition } from 'react-transition-group'
import tw from 'twin.macro'

// constants
import { Status } from '@/constants/components/transition'

// hooks
import useForkRef from '@/hooks/useForkRef'
import useEnhancedEffect from '@/hooks/useEnhancedEffect'

// types
import type { TransitionProps } from '@/types/components/transition'

export interface CollapseProps extends HTMLAttributes<HTMLDivElement>, TransitionProps {
  inProps: boolean
  orientation?: 'horizontal' | 'vertical'
  collapsedSize?: string
}

const Collapse: React.ForwardRefRenderFunction<HTMLDivElement, CollapseProps> = (
  props: CollapseProps,
  ref
) => {
  const {
    orientation = 'vertical',
    collapsedSize = '0px',
    timeout = 300,
    inProps,
    appear = false,
    onEnter,
    onEntering,
    onEntered,
    onExit,
    onExiting,
    onExited,
    children,
    ...restProps
  } = props
  const nodeRef = useRef<HTMLDivElement>(null!) // 控制 Transition component
  const handleRef = useForkRef<HTMLDivElement>(ref, nodeRef) // 這邊可將外部傳入的 ref 和這邊需要的 ref 合併成一個，可同時運作
  const wrapperRef = useRef<HTMLDivElement>(null!) // 控制 Wrapper component，用來控制橫向伸縮的 position
  const isHorizontal = orientation === 'horizontal'
  const size = isHorizontal ? 'width' : 'maxHeight'

  const getWrapperSize = () =>
    wrapperRef.current[isHorizontal ? 'clientWidth' : 'clientHeight'] || 0

  useEnhancedEffect(() => {
    if (inProps === false) {
      nodeRef.current.style[size] = collapsedSize
    }
  }, [collapsedSize])

  useEnhancedEffect(() => {
    if (inProps) {
      nodeRef.current.style[size] = `${getWrapperSize()}px`
    } else {
      nodeRef.current.style[size] = '0px'
    }
  }, [])

  const normalizedTransitionCallback = (callback?: Function) => (maybeIsAppearing?: any) => {
    if (callback) {
      const node = nodeRef.current
      // onEnterXxx and onExitXxx callbacks have a different arguments.length value.
      if (maybeIsAppearing === undefined) {
        callback(node)
      } else {
        callback(node, maybeIsAppearing)
      }
    }
  }

  const handleEnter = normalizedTransitionCallback((node: HTMLElement, isAppearing: any) => {
    if (wrapperRef.current && isHorizontal) {
      // Set absolute position to get the size of collapsed content
      wrapperRef.current.style.position = 'absolute'
    }
    node.style[size] = collapsedSize

    if (onEnter) {
      onEnter(node, isAppearing)
    }
  })

  const handleEntering = normalizedTransitionCallback((node: HTMLElement, isAppearing: any) => {
    const wrapperSize = getWrapperSize()

    if (wrapperRef.current && isHorizontal) {
      // After the size is read reset the position back to default
      wrapperRef.current.style.position = 'static'
    }
    node.style.transitionDuration = `${timeout}ms`
    node.style[size] = `${wrapperSize}px`

    if (onEntering) {
      onEntering(node, isAppearing)
    }
  })

  const handleEntered = normalizedTransitionCallback((node: HTMLElement, isAppearing: any) => {
    if (isHorizontal) {
      node.style[size] = `${getWrapperSize()}px` // 因為 width auto 的動畫效果不如預期，改良為 wrapper 的 width
    } else {
      node.style[size] = 'unset'
    }

    if (onEntered) {
      onEntered(node, isAppearing)
    }
  })

  const handleExit = normalizedTransitionCallback((node: HTMLElement): void => {
    node.style[size] = `${getWrapperSize()}px`

    if (onExit) {
      onExit(node)
    }
  })

  const handleExiting = normalizedTransitionCallback((node: HTMLElement) => {
    // 先維持原本的寬或高，等下一次再改成 collapsed size
    node.style[size] = `${getWrapperSize()}px`
    node.style.transitionDuration = `${timeout}ms`

    node.style[size] = collapsedSize

    if (onExiting) {
      onExiting(node)
    }
  })

  const handleExited = normalizedTransitionCallback(onExited)

  return (
    <Transition
      in={inProps}
      timeout={timeout}
      nodeRef={nodeRef}
      onEnter={handleEnter}
      onEntered={handleEntered}
      onEntering={handleEntering}
      onExit={handleExit}
      onExited={handleExited}
      onExiting={handleExiting}
      appear={appear}
    >
      {(status: Status, childProps: Object) => (
        <div
          data-testid="root"
          ref={handleRef}
          css={[
            tw`overflow-hidden transition-timing-function[cubic-bezier(0.4, 0, 0.2, 1)] transition-delay[0ms]`,
            orientation === 'horizontal' && tw`transition-property[width]`,
            orientation === 'vertical' && tw`max-h-0 transition-property[max-height]`,
            status === Status.entered && tw`overflow-visible`
            // status === Status.exited && tw`invisible`
          ]}
          style={{ [isHorizontal ? 'minWidth' : 'minHeight']: collapsedSize }}
          {...childProps}
          {...restProps}
        >
          <div ref={wrapperRef} data-testid="wrapper">
            {children}
          </div>
        </div>
      )}
    </Transition>
  )
}

export default forwardRef(Collapse)
