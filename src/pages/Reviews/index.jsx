import React, { useEffect, useState } from 'react';
// import { useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
// import { Link } from 'react-router-dom';
import classNames from 'classnames';
import ClipLoader from 'react-spinners/ClipLoader';

import { useFormatMessage } from 'hooks';
import Table from 'components/Table';
import { fetchReviews, deleteReview, ReviewsCleanUp } from 'state/actions/reviews';
// import paths from 'pages/Router/paths';
import ConfirmationModal from 'components/ConfirmationModal';
import classes from './Reviews.module.scss';

// function sanitizeOption(value) {
//   if (typeof value === "string") {
//     return value;
//   }
//   if (typeof value === "boolean") {
//     return (value ? "true" : "false");
//   }
//   return "unknown";
// }
// function SelectColumnFilter({
//   column: { filterValue, setFilter, preFilteredRows, id },
// }) {
//   // Calculate the options for filtering
//   // using the preFilteredRows
//   const options = useMemo(() => {
//     const options_ = new Set();
//     preFilteredRows.forEach(row => {
//       options_.add(row.values[id]);

//     });
//     /* eslint-disable no-console */
//     console.log(options_);
//     /* eslint-enable no-console */
//     return [...options_.values()];
//   }, [id, preFilteredRows]);

//   // Render a multi-select box
//   /* eslint-disable no-nested-ternary */
  
  
//   return (
//     <select
//       value={filterValue}
//       onChange={e => {
//         setFilter(e.target.value || undefined);
//       }}
//     >
//       <option value="">All</option>
//       {options.map((option, i) => (
//         <option key={i.toString()} value={sanitizeOption(option)}>
//           {sanitizeOption(option)}
//         </option>
//       ))}
//     </select>
//   );
//   /* eslint-enable no-nested-ternary */
// }

const Reviews = () => {
  const { reviewsList, error, loading, deleted } = useSelector(
    (state) => ({
      reviewsList: state.Reviews.data,
      error: state.Reviews.error,
      loading: state.Reviews.loading,
      deleted: state.Reviews.deleted,
    }),
    shallowEqual
  );

  const [deleteModal, setDeleteModal] = useState({
    ReviewId: null,
    isOpen: false,
  });

  const dispatch = useDispatch();

  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchReviews());
    return () => dispatch(ReviewsCleanUp());
  }, [dispatch]);

  useEffect(() => {
    if (deleted && !loading) {
      setDeleteModal((prevState) => ({
        ReviewId: null,
        isOpen: !prevState.isOpen,
      }));
    }
  }, [deleted, loading]);

  // const onRemoveButtonClickHandler = (ReviewId) => {
  //   setDeleteModal((prevState) => ({
  //     ReviewId,
  //     isOpen: !prevState.isOpen,
  //   }));
  // };

  const onCloseModalHandler = () => {
    setDeleteModal({ ReviewId: null, isOpen: false });
  };

  const onDeleteReviewHandler = () => {
    dispatch(deleteReview(deleteModal.ReviewId));
  };

  const columns = [
    {
      Header: 'uid',
      accessor: 'uid',
      Cell: ({ row }) => (
        <small className="has-text-grey is-abbr-like">
          {row.original.id}
        </small>
      ),
    },
    {
      Header: useFormatMessage('Reviews.rating'),
      accessor: 'rating',
      Cell: ({ row }) => (
        <small className="has-text-grey is-abbr-like">
          {row.original.rating}
        </small>
      ),
    },
  ];

  const data = search
    ? reviewsList.filter((el) => {
        const clonedElem = { ...el };
        delete clonedElem.id;
        delete clonedElem.logoUrl;
        return Object.values(clonedElem).some((field) =>
          String(field).toLowerCase().includes(search.toLowerCase())
        );
      })
    : reviewsList;

  const deleteMessage = useFormatMessage('Reviews.delete');

  const confirmMessage = useFormatMessage('Reviews.confirm');

  const permDeleteMessage = useFormatMessage('Reviews.permDelete');

  const cancelMessage = useFormatMessage('Reviews.cancel');

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
          onConfirmation={onDeleteReviewHandler}
          onCancel={onCloseModalHandler}
        />
      )}
      <section className="hero is-hero-bar">
        <div className="hero-body">
          <div className="level">
            <div className="level-left">
              <div className="level-item">
                <h1 className="title">{useFormatMessage('Reviews.Reviews')}</h1>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section is-main-section">
        <div className="card has-table has-mobile-sort-spaced">
          <header className="card-header">
            <p className={classNames('card-header-title', classes.tableHeader)}>
              <span>{useFormatMessage('Reviews.search')}</span>
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

export default Reviews;
