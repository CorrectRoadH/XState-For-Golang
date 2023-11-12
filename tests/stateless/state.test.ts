import { expect, test } from 'vitest'
import { convert } from "../../utils/convert";


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
test('adds simple example to equal stateless code', () => {
    expect(convert(JSON.parse(defaultStateProject))).toBe(``)
  })
  