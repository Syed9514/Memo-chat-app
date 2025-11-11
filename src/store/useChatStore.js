import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  unreadMessages: {},

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to get users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to get messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToMessages: () => {
		const socket = useAuthStore.getState().socket;
		if (!socket) return;

		socket.off("newMessage"); // Remove old listener to prevent duplicates

		// MODIFIED: This function now handles unread messages
		socket.on("newMessage", (newMessage) => {
			const { selectedUser, messages } = get();
			const isMessageFromSelectedUser = newMessage.senderId === selectedUser?._id;

			if (isMessageFromSelectedUser) {
				// User is already viewing this chat, add message directly
				set({ messages: [...messages, newMessage] });
			} else {
				// It's from another user, mark as unread
				toast.success(`New message from another user!`); // Optional: notify user
				set((state) => ({
					unreadMessages: { ...state.unreadMessages, [newMessage.senderId]: true },
				}));
			}
		});
	},

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
			socket.off("newMessage");
		}
  },

  setSelectedUser: (selectedUser) => {
		set((state) => {
			// Create a copy of unreadMessages
			const newUnreadMessages = { ...state.unreadMessages };
			if (selectedUser) {
				// Remove the selected user's ID from unread list
				delete newUnreadMessages[selectedUser._id];
			}
			return { selectedUser, unreadMessages: newUnreadMessages };
		});
	},
}));
