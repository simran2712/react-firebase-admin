import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import ClipLoader from 'react-spinners/ClipLoader';

import { useFormatMessage, useFormatDate } from 'hooks';
import Table from 'components/Table';
import { fetchScribes, deleteScribe, ScribesCleanUp } from 'state/actions/scribes';
// import paths from 'pages/Router/paths';
import ConfirmationModal from 'components/ConfirmationModal';
import classes from './Scribes.module.scss';

// export const { scribesData } = useSelector((state) => ({scribesData: state.Scribes.data}));

function sanitizeOption(value) {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "boolean") {
    return (value ? "true" : "false");
  }
  return "unknown";
}
function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = useMemo(() => {
    const options_ = new Set();
    preFilteredRows.forEach(row => {
      options_.add(row.values[id]);

    });
    /* eslint-disable no-console */
    console.log(options_);
    /* eslint-enable no-console */
    return [...options_.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  /* eslint-disable no-nested-ternary */
  
  
  return (
    <select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i.toString()} value={sanitizeOption(option)}>
          {sanitizeOption(option)}
        </option>
      ))}
    </select>
  );
  /* eslint-enable no-nested-ternary */
}

const Scribes = () => {
  const { ScribesList, error, loading, deleted } = useSelector(
    (state) => ({
      ScribesList: state.Scribes.data,
      error: state.Scribes.error,
      loading: state.Scribes.loading,
      deleted: state.Scribes.deleted,
    }),
    shallowEqual
  );

  const [deleteModal, setDeleteModal] = useState({
    ScribeId: null,
    isOpen: false,
  });

  const dispatch = useDispatch();

  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchScribes());
    return () => dispatch(ScribesCleanUp());
  }, [dispatch]);

  useEffect(() => {
    if (deleted && !loading) {
      setDeleteModal((prevState) => ({
        ScribeId: null,
        isOpen: !prevState.isOpen,
      }));
    }
  }, [deleted, loading]);

  // const onRemoveButtonClickHandler = (ScribeId) => {
  //   setDeleteModal((prevState) => ({
  //     ScribeId,
  //     isOpen: !prevState.isOpen,
  //   }));
  // };

  const onCloseModalHandler = () => {
    setDeleteModal({ ScribeId: null, isOpen: false });
  };

  const onDeleteScribeHandler = () => {
    dispatch(deleteScribe(deleteModal.ScribeId));
  };

  const columns = [
    
    {
      Header: useFormatMessage('Scribes.name'),
      accessor: 'name',
    },
    {
      Header: useFormatMessage('Scribes.uid'),
      accessor: 'uid',
      Cell: ({ row }) => (
        <small className="has-text-grey is-abbr-like">
          {row.original.id}
        </small>
      ),
    },
    {
      Header: useFormatMessage('Scribes.email'),
      accessor: 'email',
    },
    {
      Header: useFormatMessage('Scribes.created'),
      accessor: 'created',
      Cell: ({ row }) => (
        <small className="has-text-grey is-abbr-like">
          {row.original.createdAt ? useFormatDate(new Date(row.original.createdAt.seconds * 1000), {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }) : "unknown"}
        </small>
      ),
    },
    {
      Header: useFormatMessage('Scribes.dob'),
      accessor: 'dob',
      Cell: ({ row }) => (
        <small className="has-text-grey is-abbr-like">
          {row.original.DOB ? useFormatDate(new Date(row.original.DOB.seconds * 1000), {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }) : "unknown"}
        </small>
      ),
    },
    {
      Header: useFormatMessage('Scribes.address'),
      accessor: 'address',
    },
    {
      Header: useFormatMessage('Scribes.cbt'),
      accessor: 'cbt',
      Filter: SelectColumnFilter,
      filter: 'exactTextCase',
      Cell: ({ row }) => (
        <small className="has-text-grey is-abbr-like">
          {row.original.CBT ? "true" : "false"}
        </small>
      ),
    },
    {
      Header: useFormatMessage('Scribes.English'),
      accessor: 'English',
      Filter: SelectColumnFilter,
      filter: 'exactTextCase',
      Cell: ({ row }) => (
        <small className="has-text-grey is-abbr-like">
          {row.original.English ? "true" : "false"}
        </small>
      ),
    },
    {
      Header: useFormatMessage('Scribes.Hindi'),
      accessor: 'Hindi',
      Filter: SelectColumnFilter,
      filter: 'exactTextCase',
      Cell: ({ row }) => (
        <small className="has-text-grey is-abbr-like">
          {row.original.Hindi ? "true" : "false"}
        </small>
      ),
    },
    {
      Header: useFormatMessage('Scribes.Math'),
      accessor: 'Math',
      Filter: SelectColumnFilter,
      filter: 'exactTextCase',
      Cell: ({ row }) => (
        <small className="has-text-grey is-abbr-like">
          {row.original.Math ? "true" : "false"}
        </small>
      ),
    },
    {
      Header: useFormatMessage('Scribes.languages'),
      accessor: 'languages',
    },
    {
      Header: useFormatMessage('Scribes.gender'),
      accessor: 'gender',
      Filter: SelectColumnFilter,
      filter: 'exactTextCase',
    },
    {
      Header: useFormatMessage('Scribes.appLang'),
      accessor: 'appLang',
    },
    {
      Header: useFormatMessage('Scribes.eno'),
      accessor: 'eno',
    },
    {
      Header: useFormatMessage('Scribes.mobile'),
      accessor: 'mobile',
    },
    {
      Header: useFormatMessage('Scribes.pinCode'),
      accessor: 'pinCode',
    },
    {
      Header: useFormatMessage('Scribes.reviews'),
      id: 'actions',
      accessor: 'actions',
      Cell: ({ row }) => (
        <>
          <div className="buttons is-right">
            <Link
              to={`/scribes/${row.original.id}`}
              className="button"
            >
              <span className="icon is-small">
                <i className="mdi mdi-account-edit" />
              </span>
            </Link>
            {/* <Link
              to={`/Scribes/${row.original.id}`}
              className="button is-small is-primary"
            >
              <span className="icon is-small">
                <i className="mdi mdi-account-edit" />
              </span>
            </Link>

            <button
              type="button"
              className="button is-small is-danger"
              onClick={() => onRemoveButtonClickHandler(row.original.id)}
            >
              <span className="icon is-small">
                <i className="mdi mdi-trash-can" />
              </span>
            </button> */}
          </div>
        </>
      ),
      disableSortBy: true,
    },
  ];

  const data = search
    ? ScribesList.filter((el) => {
        const clonedElem = { ...el };
        delete clonedElem.id;
        delete clonedElem.logoUrl;
        return Object.values(clonedElem).some((field) =>
          String(field).toLowerCase().includes(search.toLowerCase())
        );
      })
    : ScribesList;

  const deleteMessage = useFormatMessage('Scribes.delete');

  const confirmMessage = useFormatMessage('Scribes.confirm');

  const permDeleteMessage = useFormatMessage('Scribes.permDelete');

  const cancelMessage = useFormatMessage('Scribes.cancel');

  return (
    <>
      
      {deleteModal.isOpen && (
        <ConfirmationModal
          isActive={deleteModal.isOpen}
          isLoading={loading}
          confirmButtonMessage={deleteMessage}
          title={confirmMessage}
          body={permDeleteMessage}
          cancelButtonMessage={cancelMessage}
          onConfirmation={onDeleteScribeHandler}
          onCancel={onCloseModalHandler}
        />
      )}
      <section className="hero is-hero-bar">
        <div className="hero-body">
          <div className="level">
            <div className="level-left">
              <div className="level-item">
                <h1 className="title">{useFormatMessage('Scribes.Scribes')}</h1>
              </div>
            </div>
            {/* <div className="level-right">
              <div className="level-item">
                <Link to={paths.ADD_Scribe} className="button">
                  {useFormatMessage('Scribes.newScribe')}
                </Link>
              </div>
            </div> */}
          </div>
        </div>
      </section>
      <section className="section is-main-section">
        <div className="card has-table has-mobile-sort-spaced">
          <header className="card-header">
            <p className={classNames('card-header-title', classes.tableHeader)}>
              <span>{useFormatMessage('Scribes.search')}</span>
              <input
                type="text"
                className="input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </p>
          </header>
          <div className="b-table">
            {loading ? <ClipLoader /> : <Table columns={columns} data={data} />}
            {error && 'Show error'}
          </div>
        </div>
      </section>
    </>
  );
};

export default Scribes;