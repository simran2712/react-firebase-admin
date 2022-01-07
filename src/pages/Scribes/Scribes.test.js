import React from 'react';
import * as reactRedux from 'react-redux';

import * as actions from 'state/actions/scribes';
import Scribes from '.';

describe('<Scribes /> rendering', () => {
  const dispatchMock = jest.fn();

  beforeEach(() => {
    jest
      .spyOn(reactRedux, 'useDispatch')
      .mockImplementation(() => dispatchMock);
    jest.spyOn(actions, 'scribesCleanUp').mockImplementation(jest.fn);
  });

  it('should render without crashing', () => {
    const { component } = renderWithProviders(<Scribes />)({
      scribes: {
        data: [],
      },
      auth: {
        userData: {},
      },
    });

    expect(component.asFragment()).toMatchSnapshot();
  });
});
