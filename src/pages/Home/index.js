export default function Home() {
    return (
        // <div className="mb-0 p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
        //     <div className="shrink-0">
        //         <img className="h-12 w-12" src="/static/pro_icon.svg" alt="ChitChat Logo" />
        //     </div>
        //     <div>
        //         <div className="text-xl font-medium text-black">ChitChat</div>
        //         <p className="text-slate-50">You have a new message!</p>
        //     </div>
        // </div>
        <div className="bg-blue-200 w-1/3  mx-auto flex-wrap flex justify-start">
            {Array.from({ length: 300 }).map((v, i) => (
                <div className="w-1/4 border border-black border-solid ">
                    <div className="w-5/6 aspect-square">{i}</div>
                </div>
            ))}
        </div>
    );
}
