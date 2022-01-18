import React from 'react';
import * as reactRedux from 'react-redux';

import * as actions from 'state/actions/scribeCancellation';
import Cancellations from '.';

describe('<Cancellations /> rendering', () => {
    const dispatchMock = jest.fn();
  
    beforeEach(() => {
      jest
        .spyOn(reactRedux, 'useDispatch')
        .mockImplementation(() => dispatchMock);
      jest.spyOn(actions, 'cancellationsCleanUp').mockImplementation(jest.fn);
    });
  
    it('should render without crashing', () => {
      const { component } = renderWithProviders(<Cancellations />)({
        cancellations: {
          data: [],
        },
        auth: {
          userData: {},
        },
      });
  
      expect(component.asFragment()).toMatchSnapshot();
    });
  });
  