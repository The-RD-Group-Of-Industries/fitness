import axios from "axios"

export async function likePost(postId: string, userId: string) {
  const response = await axios.post("http://localhost:3000/api/likes", {
    postId,
    userId,
  })
  return response.data
}

export async function unlikePost(postId: string, userId: string) {
  const response = await axios.delete("http://localhost:3000/api/likes", {
    data: { postId, userId },
  })
  return response.data
}

export async function hasUserLikedPost(postId: string, userId: string) {
  const response = await axios.get(`http://localhost:3000/api/likes?postId=${postId}&userId=${userId}`)
  return response.data.hasLiked
}