"use client";
import { useState } from "react";
import { exportAsCode } from "@/export/stateless";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {defaultText} from "./default";
import { Toaster, toast } from 'sonner'

import { useCopyToClipboard } from 'usehooks-ts'
import JsonEditor from "./json-editor";

const Editor = () => {

    const [json, setJson] = useState(defaultText);
    const [code,setCode] = useState("");
    const [value, copy] = useCopyToClipboard()

    const handleConvertBtnClick = () => {
      setCode(exportAsCode(json));
      toast('Export Success!')

    }

    const handleCopyBtnClick = ()=>{
      copy(code)
      toast('Copy Success!')
    }

    return (
        <div className="flex items-center justify-between">
        <Toaster />
        <JsonEditor json={json} setJson={setJson} />

        <div className="flex flex-col w-2/12 gap-5">
          <div>
            <div>Go State Machine library</div>
            <select className="select select-bordered w-full max-w-xs"
              defaultValue="1"
            >
              <option value="1">Stateless</option>
              <option value="2" disabled>FMS</option>
            </select>
          </div>

          <button className="btn btn-primary"
            onClick={handleConvertBtnClick}
          >
            Export
          </button>
        </div>
        
        <div className="w-5/12 p-5">
          <div className="text-3xl	font-black">Golang Code</div>

          <SyntaxHighlighter className="w-full h-[45rem] textarea textarea-primary" language="javascript" style={docco}>
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