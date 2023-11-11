"use client";

import { useState } from "react";
import { convert } from "@/utils/convert";

import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {defaultText} from "./default";
import { Toaster, toast } from 'sonner'

import { useCopyToClipboard } from 'usehooks-ts'

const Editor = () => {

    const [json, setJson] = useState(defaultText);
    const [code,setCode] = useState("");
    const [value, copy] = useCopyToClipboard()

    const handleConvertBtnClick = () => {
      setCode(convert(JSON.parse(json)));
    }
  
    const handleFormatBtnClick = ()=>{
      setJson(JSON.stringify(JSON.parse(json), null, 2))
    }

    const valid = true


    const handleCopyBtnClick = ()=>{
      copy(code)
      toast('Copy Success!')
    }
    return (
        <div className="flex items-center justify-between">
        <Toaster />
        <div className="w-5/12 rounded-3xl p-5">
          <div className="text-3xl	font-black">XState Json</div>
          <textarea 
            className="textarea textarea-primary	 w-full h-[45rem]" 
            value={json}
            onChange={(e) => setJson(e.target.value)}
          />

            <div className="flex py-2 gap-5">
                <button className="btn btn-neutral"
                  onClick={handleFormatBtnClick}
                >Format</button>

                <div className="my-auto flex gap-2">
                  <span>{`✅`}</span>
                  <div className="text-green-600 font-semibold	">Json is valid</div>
                </div>
            </div>


        </div>

        <div className="flex flex-col w-2/12 gap-5">
          <div>
            <div>Go State Machine library</div>
            <select className="select select-bordered w-full max-w-xs"
              defaultValue="1"
            >
              <option value="1" selected>Stateless</option>
              <option value="2" disabled>FMS</option>
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
            <button className="btn btn-neutral"
              onClick={handleCopyBtnClick}
            >Copy</button>
          </div>
        </div>
      </div>

    )
}

export default Editor;