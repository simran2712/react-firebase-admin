/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useTable, useSortBy, usePagination, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table';
import PropTypes from 'prop-types';
import {matchSorter} from 'match-sorter';

import { useFormatMessage } from 'hooks';
import classes from './Table.module.scss';
import './TableMobile.css';

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val;

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce(value_ => {
    setGlobalFilter(value_ || undefined);
  }, 200);

  return (
    <span>
      Search:{' '}
      <input
        value={value || ""}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
        style={{
          fontSize: '1.1rem',
          border: '0',
        }}
      />
    </span>
  );
}

const Table = ({ columns, data }) => {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
    }),
    []
  );
  const defaultColumn = useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    pageCount,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { globalFilter, pageIndex, pageSize },
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
    canPreviousPage,
    canNextPage,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const perPage = useFormatMessage('Table.perPage');
  return (
    <div className="table-wrapper">
      <table
        className="table is-striped has-mobile-cards is-hoverable"
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  className={classNames(
                    { [classes.isCurrentSort]: column.isSorted },
                    { [classes.isSortable]: column.canSort }
                  )}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  <div className="th-wrap">
                    {column.render('Header')}
                    {column.isSorted && (
                      <span className="icon is-small">
                        <i
                          className={classNames(
                            'mdi',
                            classes.tableIcon,
                            { 'mdi-arrow-down': column.isSortedDesc },
                            { 'mdi-arrow-up': !column.isSortedDesc }
                          )}
                        />
                      </span>
                    )}
                    {column.canFilter ? column.render('Filter') : null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
          <tr>
            <th
              colSpan={visibleColumns.length}
              style={{
                textAlign: 'left',
              }}
            >
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </th>
          </tr>
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td
                      className={classNames(
                        { 'is-actions-cell': cell.column.id === 'actions' },
                        {
                          'has-no-head-mobile is-image-cell':
                            cell.column.id === 'logoUrl',
                        }
                      )}
                      data-label={cell.column.Header}
                      {...cell.getCellProps()}
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className={classNames('level', classes.level)}>
        <div className="level-left">
          <div className="control">
            <span className="select">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[5, 10, 15, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size} {perPage}
                  </option>
                ))}
              </select>
            </span>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            <nav className="pagination">
              <button
                type="button"
                className="pagination-link pagination-previous"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <span className="icon" aria-hidden="true">
                  <i className="mdi mdi-chevron-left mdi-24px" />
                </span>
              </button>
              <button
                type="button"
                className="pagination-link pagination-next"
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                <span className="icon" aria-hidden="true">
                  <i className="mdi mdi-chevron-right mdi-24px" />
                </span>
              </button>
              <ul className="pagination-list">
                {pageIndex !== 0 && (
                  <li>
                    <button
                      type="button"
                      className="pagination-link"
                      onClick={() => gotoPage(0)}
                    >
                      1
                    </button>
                  </li>
                )}
                {pageIndex > 3 && (
                  <li>
                    <span className="pagination-ellipsis">…</span>
                  </li>
                )}
                {pageIndex === 3 && (
                  <li>
                    <button
                      type="button"
                      className="pagination-link"
                      onClick={() => gotoPage(1)}
                    >
                      2
                    </button>
                  </li>
                )}
                {pageIndex - 1 > 0 && (
                  <li>
                    <button
                      type="button"
                      className="pagination-link"
                      onClick={() => previousPage()}
                    >
                      {pageIndex}
                    </button>
                  </li>
                )}
                <li>
                  <button
                    type="button"
                    className={classNames(
                      'pagination-link',
                      classes.currentPage
                    )}
                    aria-current="true"
                  >
                    {pageIndex + 1}
                  </button>
                </li>
                {canNextPage && (
                  <li>
                    <button
                      type="button"
                      className="pagination-link"
                      onClick={() => nextPage()}
                    >
                      {pageIndex + 2}
                    </button>
                  </li>
                )}
                {pageCount - pageIndex === 4 && (
                  <li>
                    <button
                      type="button"
                      className="pagination-link"
                      onClick={() => gotoPage(pageCount - 2)}
                    >
                      {pageCount - 1}
                    </button>
                  </li>
                )}
                {pageCount - pageIndex > 4 && (
                  <li>
                    <span className="pagination-ellipsis">…</span>
                  </li>
                )}
                {pageIndex + 2 < pageCount && (
                  <li>
                    <button
                      type="button"
                      className="pagination-link"
                      onClick={() => gotoPage(pageCount - 1)}
                    >
                      {pageCount}
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      Cell: PropTypes.func,
      sortType: PropTypes.string,
      id: PropTypes.string,
      disableSortBy: PropTypes.bool,
    })
  ).isRequired,
};

export default Table;
