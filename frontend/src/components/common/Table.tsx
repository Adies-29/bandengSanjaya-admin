import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronLeft, ChevronRight, Inbox, Search } from 'lucide-react';
import { Button } from './Button';

interface TableProps<T> {
  columns: ColumnDef<T, any>[];
  data: T[];
  isLoading?: boolean;
  isError?: boolean;
  emptyText?: string;
  emptyIcon?: React.ReactNode;
  searchPlaceholder?: string;
}

export function Table<T>({
  columns,
  data,
  isLoading = false,
  isError = false,
  emptyIcon = <Inbox className="w-8 h-8 text-slate-500" />,
  emptyText = 'Belum ada data',
  searchPlaceholder = 'Cari...',
}: TableProps<T>) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden space-y-4 p-4 border border-slate-200">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="relative w-full max-w-xs">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider"
              >
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="py-3.5 px-6">
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none flex items-center gap-1.5 hover:text-slate-900'
                            : ''
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-slate-500"
                >
                  <div className="inline-flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                    <span>Memuat Data...</span>
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td
                  className="py-12 text-center text-red-500"
                  colSpan={columns.length}
                >
                  Gagal mengambil data dari server.
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-slate-400"
                >
                  <div className="flex flex-col items-center gap-2">
                    {emptyIcon}
                    <p>{emptyText}</p>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  className="hover:bg-slate-50 transition-colors"
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-4 px-6">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs sm:text-sm text-slate-500">
        <div>
          Menampilkan{' '}
          <span className="font-semibold text-slate-800">
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              (table.getRowModel().rows.length > 0 ? 1 : 0)}
          </span>{' '}
          -{' '}
          <span className="font-semibold text-slate-800">
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              table.getRowModel().rows.length}
          </span>{' '}
          dari{' '}
          <span className="font-semibold text-slate-800">
            {table.getFilteredRowModel().rows.length}
          </span>{' '}
          data
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs font-semibold text-slate-700 px-2">
            Halaman {table.getState().pagination.pageIndex + 1} dari{' '}
            {table.getPageCount() || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}