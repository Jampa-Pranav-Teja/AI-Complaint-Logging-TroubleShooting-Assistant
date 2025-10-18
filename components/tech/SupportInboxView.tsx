import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { SupportRequest } from '../../types';
import SupportChatView from '../shared/SupportChatView';

const SupportInboxView: React.FC = () => {
    const { supportRequests, resolveSupportRequest, currentUser } = useAppContext();
    const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);

    const openRequests = useMemo(() => {
        return supportRequests.filter(r => r.status === 'open');
    }, [supportRequests]);

    const handleSelectRequest = (request: SupportRequest) => {
        setSelectedRequest(request);
    };

    const handleCloseChat = () => {
        setSelectedRequest(null);
    };

    const handleResolve = () => {
        if (selectedRequest) {
            resolveSupportRequest(selectedRequest.id);
            setSelectedRequest(null);
        }
    }

    if (!currentUser) return null;

    return (
        <div className="h-full flex gap-6">
            <div className="w-1/3 h-full flex flex-col">
                <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Support Inbox ({openRequests.length})</h1>
                <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-3">
                    {openRequests.length > 0 ? openRequests.map(request => (
                        <div
                            key={request.id}
                            onClick={() => handleSelectRequest(request)}
                            className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${selectedRequest?.id === request.id ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
                        >
                            <p className={`font-semibold ${selectedRequest?.id === request.id ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                Chat with {request.user.name}
                            </p>
                            <p className={`text-xs mt-1 ${selectedRequest?.id === request.id ? 'text-purple-200' : 'text-gray-500 dark:text-gray-400'}`}>
                                Requested at {new Date(request.createdAt).toLocaleString()}
                            </p>
                        </div>
                    )) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 pt-8">No open support requests.</p>
                    )}
                </div>
            </div>
            <div className="w-2/3 h-full">
                {selectedRequest ? (
                    <SupportChatView 
                        request={selectedRequest} 
                        currentUser={currentUser} 
                        onClose={handleCloseChat} 
                        onResolve={handleResolve}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-white dark:bg-gray-800 rounded-lg shadow-md text-center text-gray-500 dark:text-gray-400">
                        <p>Select a request to view the chat.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupportInboxView;
