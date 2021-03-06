/**
 * @author Dean Chen 2021-04-20
 * 製作一個偵測 resize 的 hook，並提供 debounce 的選擇，讓使用它的地方可以傳入各自的 handler
 */

import { useEffect } from 'react'

// utils
import debounce from '@/utils/shared/debounce'

type useResizeProps = {
  handler: Function
} & ({ wait: number; isDebounced: true } | { wait?: undefined; isDebounced?: boolean })

function useResize(props: useResizeProps) {
  const { handler, isDebounced = true, wait = 166 } = props

  useEffect(() => {
    const handleResize = isDebounced ? debounce(() => handler(), wait) : () => handler()

    window.addEventListener('resize', handleResize)

    return () => {
      // TODO: handleResize 的 型別定義應該可以迴避掉 as 的用法
      if (isDebounced) {
        ;(handleResize as ReturnType<typeof debounce>).clear()
      }

      window.removeEventListener('resize', handleResize)
    }
  })
}

export default useResize
