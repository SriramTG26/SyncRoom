const BASE_URL = "http://localhost:5000/api"; // Added / at the end

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};

export const registerUser = (body) =>
  request("/auth/register", { method: "POST", body: JSON.stringify(body) });

export const loginUser = (body) =>
  request("/auth/login", { method: "POST", body: JSON.stringify(body) });

export const getMe = () => request("/auth/me");

export const logoutUser = () =>
  request("/auth/logout", { method: "POST" });

export const createRoom = (body) =>
  request("/rooms/create", { method: "POST", body: JSON.stringify(body) });

export const joinRoom = (code) =>
  request("/rooms/join", { method: "POST", body: JSON.stringify({ code }) });

export const getRoom = (code) => request(`/rooms/${code}`);

export const getRoomMessages = (code) => request(`/rooms/${code}/messages`);

export const searchUsers = (q) => request(`/users/search?q=${q}`);

export const getUserProfile = (username) => request(`/users/profile/${username}`);
// ── YouTube ──
export const getVideoTitle = async (videoId) => {
  try {
    const key = import.meta.env.VITE_YOUTUBE_API_KEY;
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${key}`
    );
    const data = await res.json();
    if (data.items && data.items.length > 0) {
      return {
        title:     data.items[0].snippet.title,
        thumbnail: data.items[0].snippet.thumbnails?.medium?.url || "",
        channel:   data.items[0].snippet.channelTitle,
      };
    }
    return null;
  } catch {
    return null;
  }
};
export const searchYouTube = async (query) => {
  try {
    const key = import.meta.env.VITE_YOUTUBE_API_KEY;
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=6&q=${encodeURIComponent(query)}&key=${key}`
    );
    const data = await res.json();
    if (data.items) {
      return data.items.map(item => ({
        videoId:   item.id.videoId,
        title:     item.snippet.title,
        channel:   item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails?.medium?.url,
      }));
    }
    return [];
  } catch { return []; }
};