import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import ClipLoader from 'react-spinners/ClipLoader';

import { useFormatMessage} from 'hooks';
import Table from 'components/Table';
import { fetchCancellations, deletecancellation, CancellationsCleanUp } from 'state/actions/scribeCancellation';
import paths from 'pages/Router/paths';
import ConfirmationModal from 'components/ConfirmationModal';
// import { scribesData } from 'pages/Scribes';
import classes from './ScribeCancellations.module.scss';

const Cancellations=()=>{
    const { CancellationsList, error, loading, deleted } = useSelector(
        (state) => ({
          CancellationsList: state.Cancellations.data,
          error: state.Cancellations.error,
          loading: state.Cancellations.loading,
          deleted: state.Cancellations.deleted,
        }),
        shallowEqual
      );

      const [deleteModal, setDeleteModal] = useState({
        cancellationId: null,
        isOpen: false,
      });

      const dispatch = useDispatch();

  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchCancellations());
    return () => dispatch(CancellationsCleanUp());
  }, [dispatch]);

  useEffect(() => {
    if (deleted && !loading) {
      setDeleteModal((prevState) => ({
        cancellationId: null,
        isOpen: !prevState.isOpen,
      }));
    }
  }, [deleted, loading]);

//   const onRemoveButtonClickHandler = (cancellationId) => {
//     setDeleteModal((prevState) => ({
//       cancellationId,
//       isOpen: !prevState.isOpen,
//     }));
//   };

  const onCloseModalHandler = () => {
    setDeleteModal({ cancellationId: null, isOpen: false });
  };

  const onDeleteCancellationHandler = () => {
    dispatch(deletecancellation(deleteModal.cancellationId));
  };

  // const sdata = scribesData;

  // const getScribeName = (uid) => {
  //   let name = "";
  //   for (let i = 0; i < sdata.length; i += 1) {
  //     if (sdata[i].id === uid) {
  //       name = sdata[i].name;
  //       break;
  //     }
  //   }
  //   return name;
  // };

  const columns =[
    {
        Header: useFormatMessage('Scribe_Cancellation.dateSlot'),
        accessor: 'dateSlot',
        Cell: ({ row }) => (
            <small className="has-text-grey is-abbr-like">
              {row.original.dateSlot}
            </small>
          ),
      },
      // {
      //   Header: useFormatMessage('Scribes.name'),
      //   accessor: 'name',
      //   Cell: ({ row }) => (
      //     <small className="has-text-grey is-abbr-like">
      //       {getScribeName(row.original.uid)}
      //     </small>
      //   ),
      // },
      {
        Header: useFormatMessage('Scribe_Cancellation.reason'),
        accessor: 'Reason',
        Cell: ({ row }) => (
          <small className="has-text-grey is-abbr-like">
            {row.original.reason}
          </small>
        ),
      },
      {
        Header: useFormatMessage('Scribe_Cancellation.reqId'),
        accessor: 'Req_ID',
        Cell: ({ row }) => (
          <small className="has-text-grey is-abbr-like">
            {row.original.req_id}
          </small>
        ),
      },
      {
        Header: useFormatMessage('Scribe_Cancellation.uid'),
        accessor: 'Uid',
        Cell: ({ row }) => (
          <small className="has-text-grey is-abbr-like">
            {row.original.uid}
          </small>
        ),
      },
  ];
  const data = search
    ? CancellationsList.filter((el) => {
        const clonedElem = { ...el };
        delete clonedElem.id;
        delete clonedElem.logoUrl;
        return Object.values(clonedElem).some((field) =>
          String(field).toLowerCase().includes(search.toLowerCase())
        );
      })
    : CancellationsList;
    console.log(data);

    const deleteMessage = useFormatMessage('Cancellations.delete');

    const confirmMessage = useFormatMessage('Cancellations.confirm');

    
  const permDeleteMessage = useFormatMessage('Cancellations.permDelete');

  const cancelMessage = useFormatMessage('Cancellations.cancel');
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
          onConfirmation={onDeleteCancellationHandler}
          onCancel={onCloseModalHandler}
        />
      )}
      <section className="hero is-hero-bar">
        <div className="hero-body">
          <div className="level">
            <div className="level-left">
              <div className="level-item">
                <h1 className="title">{useFormatMessage('Scribe Cancellations')}</h1>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item">
                <Link to={paths.ADD_REQUEST} className="button">
                  {useFormatMessage('New Scribe Cancellation')}
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
              <span>{useFormatMessage('Search')}</span>
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

export default Cancellations;