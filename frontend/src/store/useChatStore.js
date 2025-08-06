import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set,get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    getUsers: async () => {
       set({isUsersLoading: true});

       try {
        const res = await axiosInstance.get("/message/users");
        set({users: res.data});
       } catch (error) {
        toast.error(error.response.data.message);
       } finally {
        set({isUsersLoading: false});
       }
    },
   getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
        const res = await axiosInstance.get(`/message/${userId}`);
        set({ messages: res.data });   
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch messages');
    } finally {
        set({ isMessagesLoading: false });
    }
},
    sendMessages: async (messageData) => {
         const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
    },
    
    listenToMessages: () => {
        const {selectedUser} = get();
        if(!selectedUser) return;
        
        const socket = useAuthStore.getState().socket;
        socket.on("newMessage", (newMessage) => {
            const isMessagesSentFromSelectedUser = newMessage.senderId === selectedUser._id;

            if(!isMessagesSentFromSelectedUser) return;

             set({
                 messages: [...get().messages, newMessage],
            });
        })
    },

    unlistenToMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },
    setSelectedUser: (selectedUser) =>{
        set({ selectedUser });
    },
}));