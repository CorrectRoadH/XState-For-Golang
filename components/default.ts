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
          "target": "Parent state",
          "cond": "some condition"
        },
        "elseNext": {
          "target": "Initial state"
        }
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
