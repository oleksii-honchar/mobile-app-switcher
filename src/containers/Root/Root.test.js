import React from 'react'
import { render } from '@testing-library/react'

import { Root } from './Root'

describe('Root', () => {
  it('matches snapshot when no props provided', () => {
    const { container } = render(
      <Root />
    )
    expect(container).toMatchSnapshot()
  })
})
