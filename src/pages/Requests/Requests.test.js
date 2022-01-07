import React from 'react';
import * as reactRedux from 'react-redux';

import * as actions from 'state/actions/Requests';
import Requests from '.';

describe('<Requests /> rendering', () => {
  const dispatchMock = jest.fn();

  beforeEach(() => {
    jest
      .spyOn(reactRedux, 'useDispatch')
      .mockImplementation(() => dispatchMock);
    jest.spyOn(actions, 'RequestsCleanUp').mockImplementation(jest.fn);
  });

  it('should render without crashing', () => {
    const { component } = renderWithProviders(<Requests />)({
      Requests: {
        data: [],
      },
      auth: {
        userData: {},
      },
    });

    expect(component.asFragment()).toMatchSnapshot();
  });
});
