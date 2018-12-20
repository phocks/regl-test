import React from 'react';
import renderer from 'react-test-renderer';

import DotStream from '.';

describe('DotStream', () => {
  test('It renders', () => {
    const component = renderer.create(<DotStream />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
