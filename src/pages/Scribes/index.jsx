import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import classNames from 'classnames';
import ClipLoader from 'react-spinners/ClipLoader';

import { useFormatMessage, useFormatDate } from 'hooks';
import Table from 'components/Table';
import { fetchScribes, deleteScribe, ScribesCleanUp } from 'state/actions/Scribes';
import paths from 'pages/Router/paths';
import ConfirmationModal from 'components/ConfirmationModal';
import classes from './Scribes.module.scss';

const Scribes = () => {
  const { ScribesList, isAdmin, error, loading, deleted } = useSelector(
    (state) => ({
      ScribesList: state.Scribes.data,
      isAdmin: state.auth.ScribeData.isAdmin,
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
    if (isAdmin) {
      dispatch(fetchScribes());
    }

    return () => dispatch(ScribesCleanUp());
  }, [dispatch, isAdmin]);

  useEffect(() => {
    if (deleted && !loading) {
      setDeleteModal((prevState) => ({
        ScribeId: null,
        isOpen: !prevState.isOpen,
      }));
    }
  }, [deleted, loading]);

  const redirect = !isAdmin && <Redirect to={paths.ROOT} />;

  const onRemoveButtonClickHandler = (ScribeId) => {
    setDeleteModal((prevState) => ({
      ScribeId,
      isOpen: !prevState.isOpen,
    }));
  };

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
      Header: useFormatMessage('Scribes.email'),
      accessor: 'email',
    },
    {
      Header: useFormatMessage('Scribes.created'),
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
              </button>
            </div>
          )}
        </>
      ),
      disableSortBy: true,
    },
  ];

  const data = search
    ? ScribesList.filter((el) => {
        const clonedElem = { ...el };
        delete clonedElem.id;
        delete clonedElem.isAdmin;
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
      {redirect}
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
            <div className="level-right">
              <div className="level-item">
                <Link to={paths.ADD_Scribe} className="button">
                  {useFormatMessage('Scribes.newScribe')}
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
