import { expect, test } from 'vitest'
import { convert } from "../../utils/convert";
import { exportAsCode } from '../../export/stateless';


const defaultStateProject = `{
    "id": "New Machine",
    "initial": "Initial state",
    "states": {
      "Initial state": {
        "on": {
          "next": {
            "target": "Another state"
          }
        }
      },
      "Another state": {
        "on": {
          "next": [
            {
              "target": "Parent state",
              "cond": "some condition"
            },
            {
              "target": "Initial state"
            }
          ]
        }
      },
      "Parent state": {
        "initial": "Child state",
        "states": {
          "Child state": {
            "on": {
              "next": {
                "target": "Another child state"
              }
            }
          },
          "Another child state": {}
        },
        "on": {
          "back": {
            "target": "Initial state",
            "actions": {
              "type": "reset"
            }
          }
        }
      }
    }
  }`



// the test case should be data driven test?
// test('adds simple example to equal stateless code', () => {
//     expect(convert(JSON.parse(defaultStateProject))).toBe(``)
//   })


const test_case_2 = `{
  "id": "New Machine",
  "initial": "Initial state",
  "states": {
    "Initial state": {
      "on": {
        "next": {
          "target": "Another state"
        }
      }
    },
    "Another state": {
      "on": {
        "next": {
          "target": "Initial state"
        },
        "Event 2": {
          "target": "New state 1"
        }
      }
    },
    "New state 1": {
      "on": {
        "Event 1": {
          "target": "New state 2"
        }
      }
    },
    "New state 2": {
      "on": {
        "Event 1": {
          "target": "Another state"
        }
      }
    }
  }
}`
test('only State and Event', () => {
  expect(exportAsCode(test_case_2)).toBe(`package state
import "github.com/qmuntal/stateless"

type State string
type Trigger string

const (
    New_Machine State = "New Machine"
    New_Machine_Initial_state State = "New Machine.Initial state"
    New_Machine_Another_state State = "New Machine.Another state"
    New_Machine_New_state_1 State = "New Machine.New state 1"
    New_Machine_New_state_2 State = "New Machine.New state 2"
)

const (
    Next Trigger = "next"
    Event_2 Trigger = "Event 2"
    Event_1 Trigger = "Event 1"
)


func Create_New_Machine() *stateless.StateMachine {
    machine := stateless.NewStateMachine(New_Machine_Initial_state)

    machine.Configure(New_Machine_Initial_state).SubstateOf(New_Machine).Permit(Next,New_Machine_Another_state)
    machine.Configure(New_Machine_Another_state).SubstateOf(New_Machine).Permit(Next,New_Machine_Initial_state).Permit(Event_2,New_Machine_New_state_1)
    machine.Configure(New_Machine_New_state_1).SubstateOf(New_Machine).Permit(Event_1,New_Machine_New_state_2)
    machine.Configure(New_Machine_New_state_2).SubstateOf(New_Machine).Permit(Event_1,New_Machine_Another_state)
    return machine
}
`)
})

  