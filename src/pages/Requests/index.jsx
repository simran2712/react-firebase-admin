import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import classNames from 'classnames';
import ClipLoader from 'react-spinners/ClipLoader';

import { useFormatMessage, useFormatDate } from 'hooks';
import Table from 'components/Table';
import { fetchRequests, deleteUser, RequestsCleanUp } from 'state/actions/Requests';
import paths from 'pages/Router/paths';
import ConfirmationModal from 'components/ConfirmationModal';
import classes from './Requests.module.scss';

const Requests = () => {
  const { RequestsList, isAdmin, error, loading, deleted } = useSelector(
    (state) => ({
      RequestsList: state.Requests.data,
      isAdmin: state.auth.userData.isAdmin,
      error: state.Requests.error,
      loading: state.Requests.loading,
      deleted: state.Requests.deleted,
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
      dispatch(fetchRequests());
    }

    return () => dispatch(RequestsCleanUp());
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

  const onRemoveButtonClickHandler = (userId) => {
    setDeleteModal((prevState) => ({
      userId,
      isOpen: !prevState.isOpen,
    }));
  };

  const onCloseModalHandler = () => {
    setDeleteModal({ userId: null, isOpen: false });
  };

  const onDeleteUserHandler = () => {
    dispatch(deleteUser(deleteModal.userId));
  };

  const columns = [
    {
      Header: useFormatMessage('Requests.name'),
      accessor: 'name',
    },
    {
      Header: useFormatMessage('Requests.email'),
      accessor: 'email',
    },
    {
      Header: useFormatMessage('Requests.created'),
      accessor: 'created',
      Cell: ({ row }) => (
        <small className="has-text-grey is-abbr-like">
          {useFormatDate(row.original.createdAt, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </small>
      ),
    },
    {
      Header: '',
      id: 'actions',
      accessor: 'actions',
      Cell: ({ row }) => (
        <>
          {!row.original.isAdmin && (
            <div className="buttons is-right">
              <Link
                to={`/Requests/${row.original.id}`}
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
              </button>
            </div>
          )}
        </>
      ),
      disableSortBy: true,
    },
  ];

  const data = search
    ? RequestsList.filter((el) => {
        const clonedElem = { ...el };
        delete clonedElem.id;
        delete clonedElem.isAdmin;
        delete clonedElem.logoUrl;
        return Object.values(clonedElem).some((field) =>
          String(field).toLowerCase().includes(search.toLowerCase())
        );
      })
    : RequestsList;

  const deleteMessage = useFormatMessage('Requests.delete');

  const confirmMessage = useFormatMessage('Requests.confirm');

  const permDeleteMessage = useFormatMessage('Requests.permDelete');

  const cancelMessage = useFormatMessage('Requests.cancel');

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
                <h1 className="title">{useFormatMessage('Requests.Requests')}</h1>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item">
                <Link to={paths.ADD_USER} className="button">
                  {useFormatMessage('Requests.newUser')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section is-main-section">
        <div className="card has-table has-mobile-sort-spaced">
          <header className="card-header">
            <p className={classNames('card-header-title', classes.tableHeader)}>
              <span>{useFormatMessage('Requests.search')}</span>
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

export default Requests;