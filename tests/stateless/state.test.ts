import { expect, test } from 'vitest'
import { exportAsCode } from '../../export/stateless';

import { state_event_test_cases } from './state.data'


test('only State and Event', () => {
  state_event_test_cases.forEach(({input,except})=> {
    expect(exportAsCode(input)).toBe(except)
  })
})

  