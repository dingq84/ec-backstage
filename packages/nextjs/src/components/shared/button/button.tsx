/**
 * @author Dean Chen 2021-04-13
 * Button 提供最基本的問題，擁有方形、圓角和圓形的樣式
 *
 * @modified
 * [Dean Chen 2021-06-10]: 因為按鈕有多種樣式，像是 fill、outline 和文字等等，
 * 以 js 來寫需要判斷傳入各種參數，因此將 button 三種樣式拉到 tw 的 component 定義，
 * 但這邊變得沒有存在的必要
 * TODO: 待專案後續走向，決定使否需要此 component
 */

import { HTMLAttributes, forwardRef } from 'react'
import 'twin.macro'

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  label: string | React.ReactNode
  type?: 'button' | 'submit'
  disabled?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props: ButtonProps, ref) {
  const { label, className = '', type = 'button', ...restProps } = props

  return (
    <button ref={ref} type={type} className={`flex-center ${className}`} {...restProps}>
      {label}
    </button>
  )
})

export default Button
