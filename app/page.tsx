import Editor from "@/components/editor";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div className="navbar bg-base-300">
        <a className="btn btn-ghost normal-case text-xl">XState for Golang</a>
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
