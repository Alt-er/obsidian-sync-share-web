

export default function GitConfig() {
    return <div className="bg-base-300 rounded-lg p-4">

        <div className="form-control ">
            <label className="label cursor-pointer justify-start gap-4">
                <span className="label-text">Log updates for each note to the local git repository</span>
                <input type="checkbox" className="toggle" checked />
            </label>

            <label className="label cursor-pointer justify-start gap-4">
                <span className="label-text">Reject commits to git that exceed the size of the file</span>
                <div className="join">
                    <input className="input input-bordered join-item" placeholder="size" />
                    <button className="btn join-item rounded-r-full">MB</button>
                </div>
            </label>

            <label className="label cursor-pointer justify-start gap-4">
                <span className="label-text">Remote git service address , skip push if not filled</span>
                <input type="text" placeholder="git server address" className="input input-bordered w-full max-w-xs" />
            </label>



        </div>
    </div>
}