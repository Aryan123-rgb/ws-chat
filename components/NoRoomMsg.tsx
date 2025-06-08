import { MessageSquare } from 'lucide-react'
import React from 'react'

function NoRoomMsg() {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="bg-gray-800 p-6 rounded-full mb-4">
                <MessageSquare className="h-12 w-12 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-200 mb-2">Looks a bit quiet here...</h3>
            <p className="text-gray-400 max-w-md">
                Create your first chat room and get the convo started! 💬
            </p>
        </div>
    )
}

export default NoRoomMsg