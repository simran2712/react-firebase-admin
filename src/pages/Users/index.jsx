import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Redirect } from 'react-router-dom';
// import { Link } from 'react-router-dom';
import classNames from 'classnames';
import ClipLoader from 'react-spinners/ClipLoader';

import { useFormatMessage, useFormatDate } from 'hooks';
import Table from 'components/Table';
import { fetchUsers, deleteUser, usersCleanUp } from 'state/actions/users';
import paths from 'pages/Router/paths';
import ConfirmationModal from 'components/ConfirmationModal';
import classes from './Users.module.scss';

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
const Users = () => {
  const { usersList, isAdmin, error, loading, deleted } = useSelector(
    (state) => ({
      usersList: state.users.data,
      isAdmin: state.auth.userData.isAdmin,
      error: state.users.error,
      loading: state.users.loading,
      deleted: state.users.deleted,
    }),
    shallowEqual
  );

  const [deleteModal, setDeleteModal] = useState({
    userId: null,
    isOpen: false,
  });

  const dispatch = useDispatch();

  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchUsers());
    }

    return () => dispatch(usersCleanUp());
  }, [dispatch, isAdmin]);

  useEffect(() => {
    if (deleted && !loading) {
      setDeleteModal((prevState) => ({
        userId: null,
        isOpen: !prevState.isOpen,
      }));
    }
  }, [deleted, loading]);

  const redirect = !isAdmin && <Redirect to={paths.ROOT} />;

  // const onRemoveButtonClickHandler = (userId) => {
  //   setDeleteModal((prevState) => ({
  //     userId,
  //     isOpen: !prevState.isOpen,
  //   }));
  // };

  const onCloseModalHandler = () => {
    setDeleteModal({ userId: null, isOpen: false });
  };

  const onDeleteUserHandler = () => {
    dispatch(deleteUser(deleteModal.userId));
  };

  const columns = [
    {
      Header: useFormatMessage('Users.name'),
      accessor: 'name',
      filter: 'fuzzyText'
    },
    {
      Header: useFormatMessage('Users.uid'),
      accessor: 'uid',
      Cell: ({ row }) => (
        <small className="has-text-grey is-abbr-like">
          {row.original.id}
        </small>
      ),
    },
    {
      Header: useFormatMessage('Users.email'),
      accessor: 'email',
      filter: 'fuzzyText',
    },
    {
      Header: useFormatMessage('Users.created'),
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
      Header: useFormatMessage('Users.dob'),
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
      Header: useFormatMessage('Users.address'),
      accessor: 'address',
    },
    {
      Header: useFormatMessage('Users.cbt'),
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
      Header: useFormatMessage('Users.English'),
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
      Header: useFormatMessage('Users.Hindi'),
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
      Header: useFormatMessage('Users.Math'),
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
      Header: useFormatMessage('Users.languages'),
      accessor: 'languages',
    },
    {
      Header: useFormatMessage('Users.gender'),
      accessor: 'gender',
      Filter: SelectColumnFilter,
      filter: 'exactTextCase',
    },
    {
      Header: useFormatMessage('Users.appLang'),
      accessor: 'appLang',
    },
    {
      Header: useFormatMessage('Users.eno'),
      accessor: 'eno',
    },
    {
      Header: useFormatMessage('Users.mobile'),
      accessor: 'mobile',
    },
    {
      Header: useFormatMessage('Users.pinCode'),
      accessor: 'pinCode',
    },
    {
      Header: '',
      id: 'actions',
      accessor: 'actions',
      // Cell: ({ row }) => (
      //   <>
      //     {!row.original.isAdmin && (
      //       <div className="buttons is-right">
      //         <Link
      //           to={`/users/${row.original.id}`}
      //           className="button is-small is-primary"
      //         >
      //           <span className="icon is-small">
      //             <i className="mdi mdi-account-edit" />
      //           </span>
      //         </Link>

      //         <button
      //           type="button"
      //           className="button is-small is-danger"
      //           onClick={() => onRemoveButtonClickHandler(row.original.id)}
      //         >
      //           <span className="icon is-small">
      //             <i className="mdi mdi-trash-can" />
      //           </span>
      //         </button>
      //       </div>
      //     )}
      //   </>
      // ),
      disableSortBy: true,
    },
  ];

  const data = search
    ? usersList.filter((el) => {
        const clonedElem = { ...el };
        delete clonedElem.id;
        delete clonedElem.isAdmin;
        delete clonedElem.logoUrl;
        return Object.values(clonedElem).some((field) =>
          String(field).toLowerCase().includes(search.toLowerCase())
        );
      })
    : usersList;

  const deleteMessage = useFormatMessage('Users.delete');

  const confirmMessage = useFormatMessage('Users.confirm');

  const permDeleteMessage = useFormatMessage('Users.permDelete');

  const cancelMessage = useFormatMessage('Users.cancel');

  return (
    <>
      {redirect}
      {deleteModal.isOpen && (
        <ConfirmationModal
          isActive={deleteModal.isOpen}
          isLoading={loading}
          confirmButtonMessage={deleteMessage}
          title={confirmMessage}
          body={permDeleteMessage}
          cancelButtonMessage={cancelMessage}
          onConfirmation={onDeleteUserHandler}
          onCancel={onCloseModalHandler}
        />
      )}
      <section className="hero is-hero-bar">
        <div className="hero-body">
          <div className="level">
            <div className="level-left">
              <div className="level-item">
                <h1 className="title">{useFormatMessage('Users.users')}</h1>
              </div>
            </div>
            {/* <div className="level-right">
              <div className="level-item">
                <Link to={paths.ADD_USER} className="button">
                  {useFormatMessage('Users.newUser')}
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
              <span>{useFormatMessage('Users.search')}</span>
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

export default Users;
