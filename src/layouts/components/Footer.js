import { pluginSourceCodeUrl, serverVersion } from "../../../github";

export default function Footer() {
    return (
        // <div className="bg-base-100 container mx-auto flex justify-center gap-x-4 text-gray-400 text-xs mt-24">
        <div className="bg-base-200 py-4 text-center">
            <p className="text-sm text-gray-600">This plugin is released under the MIT License. {serverVersion}</p>
            <p className="text-xs text-gray-500">&copy; 2023 Alter. All rights reserved.</p>
        </div>
        // </div>
    );
};