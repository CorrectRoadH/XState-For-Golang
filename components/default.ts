export const defaultText = `{
    "id": "Installer State",
    "initial": "idle",
    "states": {
      "idle": {
        "on": {
          "getRelease": {
            "target": "fetching"
          }
        }
      },
      "fetching": {
        "initial": "pending",
        "states": {
          "pending": {
            "on": {
              "found-new-version": {
                "target": "out-of-date"
              },
              "not-found-new-version": {
                "target": "up-to-date"
              },
              "error": {
                "target": "#Installer State.Failure"
              }
            }
          },
          "out-of-date": {
            "on": {
              "download": {
                "target": "#Installer State.download"
              }
            }
          },
          "up-to-date": {
            "on": {
              "getRelease": {
                "target": "pending"
              }
            }
          }
        }
      },
      "install": {
        "initial": "beforeInstall",
        "states": {
          "beforeInstall": {
            "on": {
              "Event 1": {
                "target": "install"
              }
            }
          },
          "install": {
            "on": {
              "Event 1": {
                "target": "postInstall"
              }
            }
          },
          "postInstall": {
            "on": {
              "Event 1": {
                "target": "launch"
              }
            }
          },
          "launch": {
            "on": {
              "installComplete": {
                "target": "#Installer State.fetching.up-to-date"
              }
            }
          }
        },
        "on": {
          "error": {
            "target": "Failure"
          }
        }
      },
      "download": {
        "initial": "pending",
        "states": {
          "pending": {
            "on": {
              "downloadComplete": {
                "target": "ready-to-date"
              },
              "error": {
                "target": "#Installer State.Failure"
              }
            }
          },
          "ready-to-date": {
            "on": {
              "install": {
                "target": "#Installer State.install"
              }
            }
          }
        }
      },
      "Failure": {
        "on": {
          "reset": {
            "target": "idle"
          }
        }
      }
    }
  }`
