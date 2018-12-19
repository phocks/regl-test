import React from 'react';
import renderer from 'react-test-renderer';

import TestCanva from '.';

describe('TestCanvas', () => {
  test('It renders', () => {
    const component = renderer.create(<TestCanvas />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
