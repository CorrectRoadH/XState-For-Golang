export const defaultText = `{
  "id": "New Machine",
  "initial": "upload",
  "states": {
    "upload": {
      "states": {
        "upload": {
          "initial": "idle",
          "states": {
            "idle": {
              "on": {
                "start": {
                  "target": "pending"
                }
              }
            },
            "pending": {
              "on": {
                "Event 1": {
                  "target": "success"
                }
              }
            },
            "success": {}
          }
        },
        "download": {
          "initial": "idle",
          "states": {
            "idle": {
              "on": {
                "start": {
                  "target": "pending"
                }
              }
            },
            "pending": {
              "on": {
                "Event 1": {
                  "target": "sucess"
                }
              }
            },
            "sucess": {}
          }
        }
      },
      "type": "parallel"
    }
  }
}`
