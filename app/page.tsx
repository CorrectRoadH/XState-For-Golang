"use client"
import Editor from "@/components/editor";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div className="navbar bg-base-300">
        <div className="navbar-start">
          <a className="btn btn-ghost normal-case text-xl">XState for Golang</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <details>
                <summary>
                XState
                </summary>
                <ul className="p-2 bg-base-100">
                  <li><a>XState</a></li>
                  <li><a>Stately Studio</a></li>
                </ul>
              </details>
            </li>

            <li>
              <details>
                <summary>
                Golang State Library
                </summary>
                <ul className="p-2 bg-base-100">
                  <li><a>Stateless</a></li>
                  <li><a>FSM</a></li>
                </ul>
              </details>
            </li>
          </ul>
        </div>

        <div className="navbar-end overflow-hidden">
          <a className="btn btn-circle overflow-hidden" href="https://github.com/CorrectRoadH/XState-for-golang" target="_blank" >
            <Image 
              src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
              alt="github"
              width={52}
              height={52}
            />
          </a>
        </div>
      </div>
      <Editor />
    </main>
  )
}
