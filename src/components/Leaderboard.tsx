import { useMemo, useState } from 'react';
import Image from 'next/image';
import { trpc } from "../utils/trpc";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Skeleton } from './Skeleton';
import {
  IconArrowLeft,
  IconArrowBarLeft,
  IconArrowRight,
  IconArrowBarRight,
  IconArrowDown,
  IconArrowUp,
} from '@tabler/icons';
import { Entry } from '@prisma/client';
import { LeaderboardView } from '../types';
import { leaderboardViewToRangeMap } from '../config';

const columnHelper = createColumnHelper<Entry>();

const columns = [
  columnHelper.accessor(
    'rank',
    {
      cell: (info) => {
        return (
          <span className="font-bold">{info.getValue()}</span>
        );
      },
      enableSorting: true,
    },
  ),
  columnHelper.accessor(
    'gamerName',
    {
      header: () => <span>Gamer Name</span>,
      enableSorting: false,
    },
  ),
  columnHelper.accessor(
    'profilePic',
    {
      header: () => 'Profile Pic',
      cell: (info) => {
        return (
          <div className="avatar">
            <div className="w-16 rounded">
              <Image src={info.getValue()} alt={`${info.getValue()} profile pic`} width={64} height={64} />
            </div>
          </div>
        );
      },
      enableSorting: false,
    },
  ),
  columnHelper.accessor(
    'score',
    {
      enableSorting: false,
    },
  ),
];

type LeaderboardProps = {
  eventName: string;
  view: LeaderboardView;
}

export const Leaderboard = (
  {
    eventName,
    view = 'global',
  }: LeaderboardProps,
) => {

  const range = leaderboardViewToRangeMap[view];

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>(
    {
      pageIndex: 0,
      pageSize: 15,
    }
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const sortOrder = sorting[0]?.id === 'rank' && sorting[0]?.desc ? -1 : 1;

  const res = trpc.useQuery(
    [
      'events.leaderboard',
      {
        eventName,
        view,
        page: pageIndex + 1,
        sortOrder,
      },
    ],
    {
      enabled: !!eventName,
    }
  );

  const { isLoading, data } = res;

  const defaultData = useMemo(() => [], []);

  const pagination = useMemo(
    () => (
      {
        pageIndex,
        pageSize,
      }
    ),
    [pageIndex, pageSize],
  );

  const pageCount = data?.pageCount;

  const table = useReactTable(
    {
      data: data?.entries ?? defaultData,
      columns,
      pageCount,
      state: {
        sorting,
        pagination,
      },
      onPaginationChange: setPagination,
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      manualPagination: true,
      manualSorting: true,
      debugTable: true,
    }
  );

  if (isLoading) {
    return <div>Loading</div>;
  }

  const Table = (
    <table className="table table-zebra w-full">
      <thead>
        {
          table.getHeaderGroups().map(
            (headerGroup) => (
              <tr key={headerGroup.id}>
                {
                  headerGroup.headers.map(
                    (header) => (
                      <th key={header.id}>
                        {
                          header.isPlaceholder ? null : (
                            <div
                              {...{
                                className: header.column.getCanSort() ? 'flex items-center cursor-pointer select-none' : '',
                                onClick: header.column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: <IconArrowUp />,
                                desc: <IconArrowDown />,
                                }[header.column.getIsSorted() as string] ?? null}
                            </div>
                          )
                        }
                      </th>
                    )
                  )
                }
              </tr>
            )
          )
        }
      </thead>
      <tbody>
        {
          table.getRowModel().rows.map(
            (row) => (
              <tr key={row.id}>
                {
                  row.getVisibleCells().map(
                    (cell) => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    )
                  )
                }
              </tr>
            )
          )
        }
      </tbody>
    </table>
  );

  return (
    <Skeleton visible={isLoading}>
      <h1>{range} Leaderboard for {eventName}</h1>
      {
        data?.entries.length ? (
          <div className="flex flex-col gap-y-3">
            <div className="overflow-x-auto w-full">
              {Table}
            </div>
            <div className="btn-group self-end">
              <button className="btn" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                <IconArrowBarLeft />
              </button>
              <button className="btn" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                <IconArrowLeft />
              </button>
              <button className="btn">
                {table.getState().pagination.pageIndex + 1} of{' '}{table.getPageCount()}
              </button>
              <button className="btn" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                <IconArrowRight />
              </button>
              <button className="btn" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                <IconArrowBarRight />
              </button>
            </div>
          </div>
        ) : (
            <div>No results</div>
          )
      }
    </Skeleton>
  );
};
