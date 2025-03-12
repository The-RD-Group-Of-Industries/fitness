import axios from "axios"

export async function likePost(postId: string, userId: string) {
  const response = await axios.post("https://fitness-admin-tau.vercel.app/api/likes", {
    postId,
    userId,
  })
  return response.data
}

export async function unlikePost(postId: string, userId: string) {
  const response = await axios.delete("https://fitness-admin-tau.vercel.app/api/likes", {
    data: { postId, userId },
  })
  return response.data
}

export async function hasUserLikedPost(postId: string, userId: string) {
  const response = await axios.get(`https://fitness-admin-tau.vercel.app/api/likes?postId=${postId}&userId=${userId}`)
  return response.data.hasLiked
}