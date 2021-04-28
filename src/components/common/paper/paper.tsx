/**
 * @author Dean Chen 2021-04-15
 * Paper 提供一個基本框框的樣式，靈感來自 Material-UI Paper
 *
 * @modified
 * [Dean Chen 2021-04-23]: 原本傳遞 className 的方法會無法修改預設樣式，因為 twin 的 priority 高於 className，
 * 因此實現一個 workaround 的方式，開一個 css 接口，如此外部可傳入 tw 或是 css
 */

import { forwardRef } from 'react'
import 'twin.macro'

// types
import type { BasicComponentProps } from '@/types/next'

type PaperProps = BasicComponentProps

const Paper: React.ForwardRefRenderFunction<HTMLDivElement, PaperProps> = (
  props: PaperProps,
  ref
) => {
  const { children, ...restProps } = props
  return (
    <div
      ref={ref}
      tw="bg-gray-50 w-full p-4 rounded-md shadow-lg flex justify-center items-center sm:(w-auto) md:(inline-flex py-8 px-12)"
      {...restProps}
    >
      {children}
    </div>
  )
}

export default forwardRef(Paper)