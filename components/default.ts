export const defaultText = `{
  "id": "Self_Parent",
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
        "Event 1": {
          "target": "#Self_Parent.SelfParent.Selft"
        }
      }
    },
    "SelfParent": {
      "initial": "Selft",
      "states": {
        "Selft": {
          "on": {
            "backSelf": {
              "target": "Selft"
            }
          }
        }
      },
      "on": {
        "Event 1": {
          "target": "Initial state"
        }
      }
    }
  }
}`
