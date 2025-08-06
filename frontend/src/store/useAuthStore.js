import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';
import {io} from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3001" : "/";

export const useAuthStore = create((set,get) => ({
  authUser: null,
  isSigningUp: false,
  isSigningIn: false,
  isUpdateProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  signup: async (data) => {
   set({isSigningUp: true});
   try {
    const res = await axiosInstance.post("/user/signup", data);
     toast.success("Account created successfully");
     get().connectSocket();
    set({ authUser: res.data});
   } catch (error) {
    toast.error(error.response.data.message);
   } finally {
    set({isSigningUp: false});
   }
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/user/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },    
  logout: async () => {
    try {
        await axiosInstance.post("/user/signout");
        set({ authUser: null });
        toast.success("Logged out successfully");
        get().disconnectSocket();
    } catch (error) {
        toast.error(error.response.data.message);
    }
  },
  signin: async (data) => {
    set({isSigningIn: true});
    try {
        const res = await axiosInstance.post("/user/signin", data);
        toast.success("Logged in successfully");
        set({ authUser: res.data });
        get().connectSocket();
    } catch (error) {
        toast.error(error.response?.data?.message || "Login failed");
    } finally {
        set({isSigningIn: false})
    }
  },
  updateProfile: async (data) => {
    set({isUpdateProfile: true});
    try {
        const res = await axiosInstance.put("/user/update-profile", data);
        toast.success("Profile updated successfully");
        set({ authUser: res.data });
    } catch (error) {
        toast.error(error.response.data.message);
    } finally {
        set({isUpdateProfile: false});
    }
  },
  connectSocket: () => {
    const {authUser} = get();
    if(!authUser && !get().socket?.connected) return;

    const socket = io(BASE_URL,{
      query: {
        userId: authUser._id
      },
    });

    socket.connect();

    //setting the socketId to the socket state.
    set({ socket: socket});

//Here we are adding the userIds of onlineUser to the Online Users Array.
    socket.on("getOnlineUsers", (userIds) => {
      set({onlineUsers: userIds})
    })
  },
  disconnectSocket: () => {
    if(get().socket?.connected) get().socket.disconnect();
  }
}));