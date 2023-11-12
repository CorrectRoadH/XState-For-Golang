export const defaultText = `{
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
