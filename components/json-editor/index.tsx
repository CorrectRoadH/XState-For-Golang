"use client";
import { useDebouncedEffect } from '@react-hookz/web';
import { useState } from 'react';
import { toast } from 'sonner';

import { render } from "react-dom";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

interface JsonEditorProps {
    json:string
    setJson:(json:string)=>void
}

const JsonEditor =({json,setJson}:JsonEditorProps)=>{

    const [valid, setValid] = useState(true)

    useDebouncedEffect(
        () => {
          try{
            JSON.parse(json)
            setValid(true)
          }catch{
            setValid(false)
          }
        },
        [json],
        200,
        500
      );
    
    
    const handleFormatBtnClick = ()=>{
        setJson(JSON.stringify(JSON.parse(json), null, 2))
        toast('Format Success!')
    }
  
    return (
        <div className="w-5/12 rounded-3xl p-5">
          <div className="text-3xl	font-black">XState Json</div>
            {/* <textarea 
              className="textarea textarea-primary w-full h-[45rem]" 
              value={json}
              onChange={(e) => setJson(e.target.value)}
            /> */}
             <AceEditor
              className="textarea textarea-primary !w-full !h-[45rem]" 
              mode="json"
              theme="github"
              onChange={setJson}
              value={json}
              name="UNIQUE_ID_OF_DIV"
              editorProps={{ $blockScrolling: true }}
            />

            <div className="flex py-2 gap-5">
                <button className="btn btn-neutral"
                  onClick={handleFormatBtnClick}
                >Format</button>

                <div className="my-auto flex gap-2">
                  <span>{valid?`✅`:`🚫`}</span>
                  <div className={`${valid?"text-green-600":"text-red-600"} font-semibold`}>
                    {
                      valid ? "Json is valid" : "Json is invalid"}
                  </div>
                </div>
            </div>
        </div>
    )
}

export default JsonEditor;