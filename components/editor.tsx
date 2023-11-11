"use client";

import { useState } from "react";
import { convert } from "@/utils/convert";

import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import jsonStr from "./default.json";

const Editor = () => {

    const [json, setJson] = useState(JSON.stringify(jsonStr));
    const [code,setCode] = useState("");
  
    const handleConvertBtnClick = () => {
      setCode(convert(JSON.parse(json)));
    }
  
    return (
        <div className="flex items-center justify-between">
        
        <div className="w-5/12 rounded-3xl p-5">
          <div className="text-3xl	font-black">XState Json</div>
          <textarea 
            className="textarea textarea-primary	 w-full h-[45rem]" 
            value={json}
            onChange={(e) => setJson(e.target.value)}
          />

            <div className="flex py-2">
                <button className="btn btn-neutral">Format</button>
            </div>
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

          

          <SyntaxHighlighter className="w-full h-[45rem] textarea" language="javascript" style={docco}>
            {code}
          </SyntaxHighlighter>
          
          <div className="flex py-2">
            <button className="btn btn-neutral">Copy</button>
          </div>
        </div>
      </div>

    )
}

export default Editor;