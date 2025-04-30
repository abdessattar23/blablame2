import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Avatar,
  Badge,
  IconButton,
} from "@mui/material";
import { initializeApp, getApp, getApps } from "firebase/app";
import {
  getDatabase,
  ref,
  onValue,
  push,
  set,
  get,
  off,
  remove,
  child,
} from "firebase/database";
import { Send as SendIcon, Chat as ChatIcon } from "@mui/icons-material";
import DoneAllIcon from "@mui/icons-material/DoneAll";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7g76v78SwcyY1REaNsnQzEhgYdrbcZto",
  authDomain: "blablame-project.firebaseapp.com",
  projectId: "blablame-project",
  storageBucket: "blablame-project.firebasestorage.app",
  messagingSenderId: "177550990108",
  appId: "1:177550990108:web:66647c67876f4d7c3478d9",
  measurementId: "G-8HN0DSS4Z8",
  databaseURL:
    "https://blablame-project-default-rtdb.europe-west1.firebasedatabase.app", // Corrected URL
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

// Get current user ID from localStorage profile (adjust as needed)
const getCurrentUserId = () => {
  // Use the same fetchProfile logic to get the user id and cache it in localStorage
  // But for this component, fetch and set profile on mount, and use its id
  return JSON.parse(localStorage.getItem("profile"))?.id || null;
};

const MessagesTab = ({ sendNotification, currentUser }) => {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [profile, setProfile] = useState(null);
  const [userMap, setUserMap] = useState({}); // userId -> { name, avatar }
  const [fileUploading, setFileUploading] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Fetch logged-in user profile for currentUserId
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/profile/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) return;
        const data = await res.json();
        setProfile(data.data);
        // Save to localStorage for other components if needed
        localStorage.setItem("profile", JSON.stringify(data.data));
      } catch (e) {
        setProfile(null);
      }
    };
    fetchProfile();
  }, []);

  // Use profile?.id as currentUserId
  const currentUserId = profile?.id;

  // Fetch all users for name mapping
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) return;
        const data = await res.json();
        // data.data should be an array of users with id and name
        const map = {};
        (data.data || []).forEach((u) => {
          map[u.id] = u.name;
        });
        setUserMap(map);
      } catch (e) {
        setUserMap({});
      }
    };
    fetchUsers();
  }, []);

  // Fetch chats containing the current user
  useEffect(() => {
    if (!currentUserId) {
      console.log("No currentUserId found for chats");
      return;
    }
    setLoadingChats(true);
    const chatsRef = ref(db, "chats");
    const handleChats = (snapshot) => {
      const data = snapshot.val() || {};
      console.log("Chats snapshot data:", data);
      const userChats = Object.entries(data)
        .filter(
          ([, chat]) =>
            chat.participants &&
            Object.values(chat.participants).includes(currentUserId)
        )
        .map(([chatId, chat]) => ({
          id: chatId,
          ...chat,
        }));
      console.log("Filtered userChats:", userChats);
      setChats(userChats);
      setLoadingChats(false);
      // Remove auto-select logic to avoid forcing to first chat
      // if (!selectedChatId && userChats.length > 0) {
      //   setSelectedChatId(userChats[0].id);
      //   console.log("Auto-selected chat:", userChats[0].id);
      // }
    };
    onValue(chatsRef, handleChats, (err) => {
      console.error("onValue error for chatsRef:", err);
    });
    return () => off(chatsRef, "value", handleChats);
  }, [currentUserId]);

  // Fetch messages for selected chat
  useEffect(() => {
    if (!selectedChatId) {
      setMessages([]);
      return;
    }
    setLoadingMessages(true);
    const msgsRef = ref(db, `chats/${selectedChatId}/messages`);
    const handleMsgs = (snapshot) => {
      const data = snapshot.val() || {};
      console.log("Messages snapshot for chat", selectedChatId, ":", data);
      const msgs = Object.entries(data)
        .map(([id, msg]) => ({ id, ...msg }))
        .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      setMessages(msgs);
      setLoadingMessages(false);
    };
    onValue(msgsRef, handleMsgs, (err) => {
      console.error("onValue error for msgsRef:", err);
    });
    return () => off(msgsRef, "value", handleMsgs);
  }, [selectedChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Typing indicator logic
  useEffect(() => {
    if (!selectedChatId || !currentUserId) return;
    const typingRef = ref(db, `chats/${selectedChatId}/typing`);
    const handleTyping = (snapshot) => {
      const data = snapshot.val() || {};
      setTypingUsers(data);
    };
    onValue(typingRef, handleTyping);
    return () => off(typingRef, "value", handleTyping);
  }, [selectedChatId, currentUserId]);

  // Remove typing status on unmount or chat change
  useEffect(() => {
    return () => {
      if (selectedChatId && currentUserId) {
        const typingRef = ref(
          db,
          `chats/${selectedChatId}/typing/${currentUserId}`
        );
        set(typingRef, false);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [selectedChatId, currentUserId]);

  // Mark messages as read when chat is open and messages are received
  useEffect(() => {
    if (!selectedChatId || !currentUserId || messages.length === 0) return;
    const unreadMsgs = messages.filter(
      (msg) => msg.senderId !== currentUserId && !msg.read
    );
    if (unreadMsgs.length === 0) return;
    unreadMsgs.forEach(async (msg) => {
      if (msg.id) {
        // Mark as read in messages
        await set(
          ref(db, `chats/${selectedChatId}/messages/${msg.id}/read`),
          true
        );

        // Remove notification for this message if exists
        // Find the sender (who sent the message)
        const chat = chats.find((c) => c.id === selectedChatId);
        let myUserId = currentUserId;
        if (chat && chat.participants) {
          // Remove notification from my notifications node
          const notifRef = ref(db, `notifications/${myUserId}`);
          // Find notification with matching message text and sender
          const notifSnap = await get(notifRef);
          if (notifSnap.exists()) {
            const notifData = notifSnap.val();
            for (const [key, notif] of Object.entries(notifData)) {
              // Match by message text and sender name (could be improved with a messageId if available)
              if (
                notif.message === msg.text &&
                notif.title &&
                notif.title.includes(userMap[msg.senderId] || "")
              ) {
                await remove(child(notifRef, key));
              }
            }
          }
        }
      }
    });
  }, [messages, selectedChatId, currentUserId, chats, userMap]);

  // Handle typing events
  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!selectedChatId || !currentUserId) return;
    const typingRef = ref(
      db,
      `chats/${selectedChatId}/typing/${currentUserId}`
    );
    if (!isTyping) {
      setIsTyping(true);
      set(typingRef, true);
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      set(typingRef, false);
      setIsTyping(false);
    }, 1500);
    // If input is cleared, immediately set typing to false
    if (e.target.value === "") {
      set(typingRef, false);
      setIsTyping(false);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedChatId || !currentUserId) {
      console.log("Cannot send: missing input, chat, or user");
      return;
    }
    setSending(true);
    try {
      const msgsRef = ref(db, `chats/${selectedChatId}/messages`);
      const newMsgRef = push(msgsRef);
      await set(newMsgRef, {
        text: input,
        senderId: currentUserId,
        createdAt: Date.now(),
        read: false,
      });
      setInput("");
      // Remove typing status after sending
      if (selectedChatId && currentUserId) {
        const typingRef = ref(
          db,
          `chats/${selectedChatId}/typing/${currentUserId}`
        );
        set(typingRef, false);
        setIsTyping(false);
      }
      // --- Notification logic fix ---
      // Find recipient userId (the other participant)
      const chat = chats.find((c) => c.id === selectedChatId);
      let recipientId = null;
      if (chat && chat.participants) {
        const ids = Object.values(chat.participants);
        recipientId = ids.find((id) => id !== currentUserId);
      }
      // Only send notification if recipient is not the sender
      if (
        sendNotification &&
        currentUser &&
        recipientId &&
        recipientId !== currentUserId
      ) {
        await sendNotification({
          toUserId: recipientId,
          fromUserName: currentUser.name,
          message: input,
        });
      }
      // --- end notification logic ---
    } catch (err) {
      console.error("Error sending message:", err);
    }
    setSending(false);
  };

  // Handle file upload (pdf, images, zip) via backend API
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedChatId || !currentUserId) return;
    setFileUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("http://localhost:8000/api/messages/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload file");
      const data = await res.json();
      const filePath = data.path; // e.g. "/file.pdf"
      const ext = file.name.split(".").pop();
      const fileUrl = "http://localhost:8000" + filePath;

      // Send a message with file info
      const msgsRef = ref(db, `chats/${selectedChatId}/messages`);
      const newMsgRef = push(msgsRef);
      await set(newMsgRef, {
        file: {
          url: fileUrl,
          name: file.name,
          type: file.type,
          ext,
        },
        senderId: currentUserId,
        createdAt: Date.now(),
      });
    } catch (err) {
      console.error("File upload error:", err);
    }
    setFileUploading(false);
    e.target.value = "";
  };

  // Fetch user info by id and cache in userMap
  const fetchUserInfo = async (userId) => {
    if (!userId || userMap[userId]) return;
    try {
      const res = await fetch(`http://localhost:8000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.data) {
        setUserMap((prev) => ({
          ...prev,
          [userId]: {
            name: data.data.name,
            avatar: data.data.avatar,
          },
        }));
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "calc(100vh - 64px)", // 64px = default MUI AppBar height
        minHeight: 400,
        bgcolor: "var(--color-background-paper)",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        borderRadius: 3,
        boxShadow: 0,
      }}
    >
      {/* Chat list */}
      <Paper
        elevation={0}
        sx={{
          width: { xs: "100%", md: 320 },
          minWidth: 180,
          borderRight: { md: "1px solid var(--color-base-300)" },
          p: 0,
          bgcolor: "var(--color-base-200)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: "1px solid var(--color-base-200)",
            display: "flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "#f3f6fb",
          }}
        >
          <ChatIcon sx={{ color: "var(--color-primary)" }} />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Chats
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1, overflowY: "auto", p: 1 }}>
          {loadingChats ? (
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : chats.length === 0 ? (
            <Typography
              color="text.secondary"
              sx={{ mt: 2, textAlign: "center" }}
            >
              No chats yet.
            </Typography>
          ) : (
            <List dense>
              {chats.map((chat) => {
                const ids = Object.values(chat.participants || {});
                const otherId = ids.find((id) => id !== profile?.id);
                if (
                  otherId &&
                  (!userMap[otherId] || !userMap[otherId].name) &&
                  (!chat.participantNames || !chat.participantNames[otherId])
                ) {
                  fetchUserInfo(otherId);
                }
                let displayName =
                  (chat.participantNames && chat.participantNames[otherId]) ||
                  (userMap[otherId] && userMap[otherId].name) ||
                  `User ${otherId}`;
                let avatarUrl =
                  userMap[otherId] && userMap[otherId].avatar
                    ? userMap[otherId].avatar.startsWith("http")
                      ? userMap[otherId].avatar
                      : "http://localhost:8000/" + userMap[otherId].avatar
                    : undefined;
                return (
                  <React.Fragment key={chat.id}>
                    <ListItem
                      button
                      selected={selectedChatId === chat.id}
                      onClick={() => setSelectedChatId(chat.id)}
                      sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        bgcolor:
                          selectedChatId === chat.id
                            ? "var(--color-primary-light, #e3edfa)"
                            : "transparent",
                        transition: "background 0.2s",
                        px: 1.5,
                        py: 1,
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Badge
                        color="primary"
                        variant="dot"
                        invisible={true /* TODO: add unread logic */}
                        sx={{ mr: 1 }}
                      >
                        <Avatar
                          src={avatarUrl}
                          alt={displayName}
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: "var(--color-primary)",
                            fontWeight: "bold",
                            fontSize: 18,
                          }}
                        >
                          {displayName[0]}
                        </Avatar>
                      </Badge>
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              color:
                                selectedChatId === chat.id
                                  ? "var(--color-primary)"
                                  : "var(--color-base-content)",
                              fontSize: 16,
                              mb: 0.2,
                            }}
                            noWrap
                          >
                            {displayName}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                            sx={{ maxWidth: 170 }}
                          >
                            {chat.lastMessage?.text || ""}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <Divider sx={{ mx: 1 }} />
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </Box>
      </Paper>
      {/* Messages area */}
      <Paper
        elevation={0}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          p: 0,
          bgcolor: "var(--color-background-paper)",
          minHeight: 300,
          height: "100%",
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: "1px solid var(--color-base-200)",
            bgcolor: "#f3f6fb",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {selectedChatId
              ? (() => {
                  const chat = chats.find((c) => c.id === selectedChatId);
                  if (!chat) return "Messages";
                  const ids = Object.values(chat.participants || {});
                  const otherId = ids.find((id) => id !== profile?.id);
                  return (
                    (chat.participantNames && chat.participantNames[otherId]) ||
                    (userMap[otherId] && userMap[otherId].name) ||
                    `User ${otherId}`
                  );
                })()
              : "Select a chat to start messaging"}
          </Typography>
          {/* Typing indicator */}
          {selectedChatId &&
            (() => {
              const chat = chats.find((c) => c.id === selectedChatId);
              if (!chat) return null;
              const ids = Object.values(chat.participants || {});
              const otherId = ids.find((id) => id !== currentUserId);
              if (otherId && typingUsers && typingUsers[otherId]) {
                return (
                  <Typography variant="caption" color="primary" sx={{ ml: 1 }}>
                    {userMap[otherId]?.name || "User"} is typing...
                  </Typography>
                );
              }
              return null;
            })()}
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            px: { xs: 1, md: 3 },
            py: 2,
            bgcolor: "#f8fafc",
            minHeight: 200,
          }}
        >
          {loadingMessages ? (
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : messages.length === 0 ? (
            <Typography
              color="text.secondary"
              sx={{ mt: 2, textAlign: "center" }}
            >
              No messages yet.
            </Typography>
          ) : (
            messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.senderId === profile?.id ? "flex-end" : "flex-start",
                  mb: 1.5,
                }}
              >
                <Box
                  sx={{
                    bgcolor:
                      msg.senderId === profile?.id
                        ? "var(--color-primary)"
                        : "var(--color-base-200)",
                    color:
                      msg.senderId === profile?.id
                        ? "var(--color-primary-content)"
                        : "var(--color-base-content)",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    maxWidth: "70%",
                    boxShadow: 1,
                    fontSize: 15,
                    position: "relative",
                  }}
                >
                  {/* Show file if present */}
                  {msg.file ? (
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ wordBreak: "break-word" }}
                      >
                        <a
                          href={msg.file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "inherit",
                            textDecoration: "underline",
                            wordBreak: "break-all",
                          }}
                        >
                          {msg.file.type &&
                          msg.file.type.startsWith("image/") ? (
                            <img
                              src={msg.file.url}
                              alt={msg.file.name}
                              style={{
                                maxWidth: 180,
                                maxHeight: 180,
                                borderRadius: 8,
                                marginBottom: 6,
                                display: "block",
                              }}
                            />
                          ) : msg.file.ext === "pdf" ? (
                            <span>📄 {msg.file.name}</span>
                          ) : msg.file.ext === "zip" ? (
                            <span>🗜️ {msg.file.name}</span>
                          ) : (
                            <span>{msg.file.name}</span>
                          )}
                        </a>
                      </Typography>
                    </Box>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {msg.text}
                    </Typography>
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      opacity: 0.7,
                      display: "block",
                      textAlign: "right",
                      mt: 0.5,
                      fontSize: 11,
                    }}
                  >
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                    {/* Read indicator for sent messages */}
                    {msg.senderId === currentUserId && msg.read && (
                      <DoneAllIcon
                        fontSize="small"
                        sx={{
                          color: "var(--color-primary-content)",
                          ml: 0.5,
                          verticalAlign: "middle",
                        }}
                      />
                    )}
                  </Typography>
                </Box>
              </Box>
            ))
          )}
          <div ref={messagesEndRef} />
        </Box>
        {selectedChatId && (
          <Box
            component="form"
            onSubmit={handleSend}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              px: { xs: 1, md: 3 },
              py: 2,
              borderTop: "1px solid var(--color-base-200)",
              bgcolor: "#f3f6fb",
            }}
          >
            <TextField
              value={input}
              onChange={handleInputChange}
              placeholder="Type a message..."
              size="small"
              fullWidth
              disabled={sending || fileUploading}
              sx={{
                bgcolor: "#fff",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
              inputProps={{ maxLength: 1000 }}
            />
            <input
              type="file"
              accept="image/*,.pdf,.zip"
              style={{ display: "none" }}
              id="chat-file-upload"
              onChange={handleFileUpload}
              disabled={fileUploading}
            />
            <label htmlFor="chat-file-upload">
              <IconButton
                component="span"
                color="primary"
                disabled={fileUploading}
                sx={{
                  bgcolor: "var(--color-primary)",
                  color: "var(--color-primary-content)",
                  borderRadius: 2,
                  "&:hover": {
                    bgcolor: "var(--color-primary)",
                    filter: "brightness(0.9)",
                  },
                  ml: 1,
                }}
              >
                📎
              </IconButton>
            </label>
            <IconButton
              type="submit"
              color="primary"
              disabled={!input.trim() || sending || fileUploading}
              sx={{
                bgcolor: "var(--color-primary)",
                color: "var(--color-primary-content)",
                borderRadius: 2,
                "&:hover": {
                  bgcolor: "var(--color-primary)",
                  filter: "brightness(0.9)",
                },
                ml: 1,
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default MessagesTab;
