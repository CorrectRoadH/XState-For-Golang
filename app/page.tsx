import Editor from "@/components/editor";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div className="navbar bg-base-300">
        <a className="btn btn-ghost normal-case text-xl">XState for Golang</a>

        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">

          <li>
            <a>XState</a>
            <ul class="p-2">
              <li><a>XState</a></li>
              <li><a>Stately Studio</a></li>
            </ul>
          </li>

          <li>
            <a>Golang State Library</a>
            <ul class="p-2">
              <li><a>Stateless</a></li>
              <li><a>FSm</a></li>
            </ul>
          </li>

          <li>
            <a>Other</a>
            <ul class="p-2">
              <li><a>What is State machine</a></li>
              <li><a>Usage</a></li>
            </ul>
          </li>

        </ul>

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
