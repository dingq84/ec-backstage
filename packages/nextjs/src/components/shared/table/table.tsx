import { useMemo, useState, useRef, HTMLAttributes, useCallback } from 'react'
import {
  useTable,
  useFlexLayout,
  useResizeColumns,
  usePagination,
  useSortBy,
  Row,
  TableOptions,
  SortingRule
} from 'react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
  faSortUp,
  faSortDown
} from '@fortawesome/free-solid-svg-icons'
import tw from 'twin.macro'

// components
import Button from '@/components/shared/button'
import Paper from '@/components/shared/paper'

// hooks
import useEnhancedEffect from '@/hooks/useEnhancedEffect'

// types
import { CustomColumn } from '@/types/components/table'

// utils
import calculatePagination from '@/utils/components/table/calculatePagination'

interface TableProps<T extends object> extends HTMLAttributes<HTMLDivElement> {
  columns: CustomColumn<T>[]
  data: Array<T>
  headerFixed?: boolean
  disabledPagination?: boolean
  handleRowClick?: (data: Row<T>) => void
  handleSort?: (data: SortingRule<T>[]) => void
  tableOptions?: Partial<TableOptions<T>>
  slots?: {
    [key: string]: (data: Row<T>) => JSX.Element
  }
  pagination: {
    currentPage: number // 目前第幾頁
    lastPage: number // 最後一頁
    totalRows: number // 總共幾筆
    nextPage: (page: number) => void // 換頁 call api
    goPage: (page: number) => void // 換頁 call api
    pageSize?: number
  }
}

const Table = <T extends object>(props: TableProps<T>) => {
  const {
    columns,
    data,
    headerFixed = true,
    pagination,
    disabledPagination = false,
    tableOptions = {},
    slots,
    handleRowClick,
    handleSort,
    ...restProps
  } = props
  const {
    currentPage,
    lastPage,
    totalRows,
    pageSize = 10,
    nextPage: propNextPage,
    goPage
  } = pagination
  const [totalWidth, setTotalWidth] = useState(1000)
  const ref = useRef<HTMLDivElement>(null!)
  const getColumnsSlot = useCallback(
    (slotName: string) => {
      if (slots === undefined) {
        return () => <span>{`請提供 ${slotName} 的 FC`}</span>
      }

      return slots[slotName]
    },
    [slots]
  )
  // 官方建議將 column 和 data 做 useMemo
  const memoColumns = useMemo(
    () =>
      columns.map(column => {
        if (column.headerSlot) {
          column.Header = ({ row }: { row: Row<T> }) => getColumnsSlot(column.headerSlot!)(row)
        } else if (column.cellSlot) {
          column.Cell = ({ row }: { row: Row<T> }) => getColumnsSlot(column.cellSlot!)(row)
        }

        return column
      }),
    [columns, getColumnsSlot]
  )
  const memoData = useMemo(() => data, [data])
  const defaultColumn = useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 600,
      disableSortBy: true
    }),
    []
  )
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    canPreviousPage,
    canNextPage,
    previousPage,
    nextPage,
    gotoPage
  } = useTable<T>(
    {
      columns: memoColumns,
      data: memoData,
      defaultColumn,
      manualPagination: true,
      pageCount: Math.ceil(totalRows / pageSize),
      manualSortBy: true,
      disableSortRemove: true,
      ...tableOptions
    },
    useFlexLayout,
    useResizeColumns,
    useSortBy,
    usePagination
  )
  const { pageIndex, sortBy } = state

  useEnhancedEffect(() => {
    // 取 columns 的 width 總和和實際 element 的 width 兩者間較大的值，並設定回 table header 和 body
    const columnTotalWidth = memoColumns.reduce(
      (accumulate, { width = 0, minWidth = 0, maxWidth = 0 }) =>
        accumulate + Math.max(Number(width), minWidth, maxWidth),
      60
    )
    const { clientWidth } = ref.current
    const actualWidth = clientWidth - 48 // padding x
    setTotalWidth(Math.max(columnTotalWidth, actualWidth))
  }, [memoColumns])

  useEnhancedEffect(() => {
    if (handleSort) {
      handleSort(sortBy)
    }
  }, [sortBy])

  const handleClick = (data: Row<T>): void => {
    if (handleRowClick) {
      handleRowClick(data)
    }
  }

  const handlePagination = (page: number): void => {
    if (page > 0) {
      nextPage()
    } else {
      previousPage()
    }

    propNextPage(page)
  }

  const handleSpecificPagination = (page: number): void => {
    gotoPage(page - 1)
    goPage(page)
  }

  return (
    /* eslint-disable react/jsx-key */
    <Paper
      ref={ref}
      tw="w-full p-0 relative overflow-hidden bg-transparent"
      shadow={false}
      {...restProps}
    >
      <div
        className="scroll"
        tw="h-full w-full border border-solid border-gray-1 rounded-lg"
        {...getTableProps()}
      >
        <div css={[headerFixed && tw`sticky top-0`]} style={{ minWidth: totalWidth }}>
          {headerGroups.map(headerGroup => (
            <div
              {...headerGroup.getHeaderGroupProps()}
              tw="px-6 py-4 border-b border-solid border-gray-1 bg-blue-1 flex"
            >
              {headerGroup.headers.map(column => (
                <div
                  tw="text-gray-3 text-xs font-medium flex justify-start items-center"
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render('Header')}
                  {column.isSorted ? (
                    <FontAwesomeIcon tw="ml-2" icon={column.isSortedDesc ? faSortDown : faSortUp} />
                  ) : null}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div {...getTableBodyProps()} style={{ minWidth: totalWidth, height: 'calc(100% - 49px)' }}>
          {rows.map(row => {
            prepareRow(row)
            return (
              <div
                {...row.getRowProps()}
                tw="px-6 py-6 text-black border-b border-solid border-gray-1 cursor-pointer hover:(bg-blue-2)"
                onClick={() => handleClick(row)}
              >
                {row.cells.map((cell, i) => {
                  return (
                    <div
                      tw="text-sm text-black font-normal"
                      css={[
                        columns[i].align === 'center' && tw`text-center`,
                        columns[i].align === 'right' && tw`text-right`
                      ]}
                      {...cell.getCellProps()}
                    >
                      {cell.render('Cell')}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      <div tw="mt-2.5 w-full">
        <span tw="float-right text-xs text-black font-normal">{`總資料筆數：${totalRows}`}</span>

        {disabledPagination ? null : (
          <div className="flex-center" tw="gap-x-2">
            {canPreviousPage ? (
              <Button
                className="btn-text"
                label={<FontAwesomeIcon icon={faChevronLeft} />}
                onClick={() => handlePagination(-1)}
              />
            ) : null}

            {calculatePagination(currentPage, lastPage).map(pagination => (
              <Button
                key={pagination.toString()}
                className="btn-text"
                onClick={() => handleSpecificPagination(pagination)}
                label={
                  <span
                    tw="w-5 h-5 rounded inline-block leading-5 text-sm text-blue-gray-3"
                    css={[pagination === pageIndex + 1 && tw`bg-blue-2 text-primary`]}
                  >
                    {pagination}
                  </span>
                }
              />
            ))}
            {canNextPage ? (
              <Button
                className="btn-text"
                label={<FontAwesomeIcon icon={faChevronRight} />}
                onClick={() => handlePagination(1)}
              />
            ) : null}
          </div>
        )}
      </div>
    </Paper>
  )
}

export default Table
