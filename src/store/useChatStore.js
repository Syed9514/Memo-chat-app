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
  isTyping: false,

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
    socket.off("typing");
		socket.off("stop_typing");

		// MODIFIED: This function now handles unread messages
		socket.on("newMessage", (newMessage) => {
      console.log("NEW MESSAGE RECEIVED, INSPECT THIS OBJECT:", newMessage);
			const { selectedUser, messages } = get();
			const isMessageFromSelectedUser = newMessage.senderId === selectedUser?._id;

			if (isMessageFromSelectedUser) {
				// User is already viewing this chat, add message directly
				set({ messages: [...messages, newMessage], isTyping: false });
			} else {
				// It's from another user, mark as unread
				toast.success(`New message from another user!`); // Optional: notify user
				set((state) => {
					const newUnread = {
						...state.unreadMessages,
						[newMessage.senderId]: (state.unreadMessages[newMessage.senderId] || 0) + 1,
					};

					// --- ADD THIS LOG ---
					console.log("UNREAD MESSAGES STATE UPDATED:", newUnread);
					
					return { unreadMessages: newUnread };
				});
			}
		});

    // Listen for *who* is typing
		socket.on("typing", (senderId) => {
      console.log("Typing event HEARD from sender:", senderId);
			const { selectedUser } = get();
      console.log("Currently selected user:", selectedUser?._id);
			// Only show typing if it's from the selected user
			if (senderId === selectedUser?._id) {
				set({ isTyping: true });
			}
		});

		socket.on("stop_typing", () => {
      console.log("Stop_typing event HEARD");
			set({ isTyping: false });
		});

	},

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
			socket.off("newMessage");
      socket.off("typing");
			socket.off("stop_typing");
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
			return { selectedUser, unreadMessages: newUnreadMessages, isTyping: false };
		});
	},
}));
