"use client";

import { useState } from "react";
import { convert } from "@/utils/convert";

import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';


const jsonStr = `
{
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
            "有新版本": {
              "target": "out-of-date"
            },
            "无新版本": {
              "target": "up-to-date"
            },
            "出错": {
              "target": "#Installer State.Failure"
            }
          }
        },
        "out-of-date": {
          "on": {
            "点击下载": {
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
            "安装完成": {
              "target": "#Installer State.fetching.up-to-date"
            }
          }
        }
      },
      "on": {
        "出错": {
          "target": "Failure"
        }
      }
    },
    "download": {
      "initial": "pending",
      "states": {
        "pending": {
          "on": {
            "下载完成": {
              "target": "ready-to-date"
            },
            "出错": {
              "target": "#Installer State.Failure"
            }
          }
        },
        "ready-to-date": {
          "on": {
            "点击安装": {
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
}
`
export default function Home() {
  const [json, setJson] = useState(jsonStr);
  const [code,setCode] = useState("");

  const handleConvertBtnClick = () => {
    setCode(convert(JSON.parse(json)));
  }
  return (
    <main>
      <div className="navbar bg-base-300">
        <a className="btn btn-ghost normal-case text-xl">XState for Golang</a>

        <div className="navbar-end">
          <a className="btn" href="">GitHub</a>
        </div>

      </div>
      <div className="flex items-center justify-between">
        
        <div className="w-5/12 rounded-3xl p-5">
          <div className="text-3xl	font-black">XState Json</div>
          <textarea 
            className="textarea textarea-primary	 w-full h-[45rem]" 
            value={json}
            onChange={(e) => setJson(e.target.value)}
          />
        </div>

        <div className="flex flex-col w-2/12 gap-5">
          <div>
            <div>Go State Machine library</div>
            <select className="select select-bordered w-full max-w-xs">
              <option selected>Stateless</option>
              <option disabled>FMS</option>

            </select>
          </div>

          <button className="btn btn-primary"
            onClick={handleConvertBtnClick}
          >
            Convert
          </button>
        </div>
        
        <div className="w-5/12 p-5">
          <div className="text-3xl	font-black">Golang Code</div>

          <span>copy</span>

          <SyntaxHighlighter className="w-full h-[45rem] textarea" language="javascript" style={docco}>
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </main>
  )
}
