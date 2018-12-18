import React from 'react';
import renderer from 'react-test-renderer';

import PulsatingBall from '.';

describe('PulsatingBall', () => {
  test('It renders', () => {
    const component = renderer.create(<PulsatingBall />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
