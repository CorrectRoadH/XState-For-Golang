const state_event_test_cases = [
    // test case 1. state and event
    {
        input:`{
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
            }`,
        except: `package state
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
`
    },
    
    // test case 2. state and nested state and event and self-transition
    {
        input:`{
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
          ,except:`package state
import "github.com/qmuntal/stateless"

type State string
type Trigger string

const (
    Self_Parent State = "Self_Parent"
    Self_Parent_Initial_state State = "Self_Parent.Initial state"
    Self_Parent_Another_state State = "Self_Parent.Another state"
    Self_Parent_SelfParent State = "Self_Parent.SelfParent"
    Self_Parent_SelfParent_Selft State = "Self_Parent.SelfParent.Selft"
)

const (
    Next Trigger = "next"
    Event_1 Trigger = "Event 1"
    BackSelf Trigger = "backSelf"
)


func Create_Self_Parent() *stateless.StateMachine {
    machine := stateless.NewStateMachine(Self_Parent_Initial_state)

    machine.Configure(Self_Parent_Initial_state).SubstateOf(Self_Parent).Permit(Next,Self_Parent_Another_state)
    machine.Configure(Self_Parent_Another_state).SubstateOf(Self_Parent).Permit(Event_1,Self_Parent_SelfParent_Selft)
    machine.Configure(Self_Parent_SelfParent).Initial(Self_Parent_SelfParent_Selft).SubstateOf(Self_Parent).Permit(Event_1,Self_Parent_Initial_state)
    machine.Configure(Self_Parent_SelfParent_Selft).SubstateOf(Self_Parent_SelfParent).Permit(BackSelf,Self_Parent_SelfParent_Selft)
    return machine
}
`
    },

    // test case 3. state and event and guard
    {
      input:`{
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
      }`,
      except:`package state`
    },

    // test case 4. state and entry and exit event
    {
      input:`{
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
            "entry": {
              "type": "entry action"
            },
            "exit": {
              "type": "exit action"
            },
            "on": {
              "next": {
                "target": "Initial state"
              }
            }
          }
        }
      }`,
      except:`package state`
    },

    // test case 5. Parallel State	
    {
      input:`{
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
      }`,
      except:`package state`
    },
]

export { state_event_test_cases }