import React, { useEffect, useState } from "react"
import { View, ScrollView, TouchableOpacity, StyleSheet } from "react-native"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { useAuth } from "@/context/AuthContext"
import { likePost, unlikePost, hasUserLikedPost } from "@/lib/likes"
import { Ionicons } from "@expo/vector-icons"
import axios from "axios"
import { PortableText, type PortableTextReactComponents } from "@portabletext/react-native"

interface Post {
  _id: string
  title: string
  body: any[] // Portable Text content
  publishedAt: string
  author?: {
    name: string
    image: string
  }
  likes: number
}

export default function ExploreScreen() {
  const [posts, setPosts] = useState<Post[]>([])
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({})
  const { user } = useAuth()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await axios.get("https://fitness-admin-tau.vercel.app/api/posts")
      const data = response.data
      // Sort posts by publishedAt date in descending order
      const sortedPosts = data.sort(
        (a: Post, b: Post) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      )
      setPosts(sortedPosts)

      if (user?.id) {
        const likedStatus = await Promise.all(sortedPosts.map((post: Post) => hasUserLikedPost(post._id, user.id)))
        const likedMap = sortedPosts.reduce((acc: any, post: Post, index: number) => {
          acc[post._id] = likedStatus[index]
          return acc
        }, {})
        setLikedPosts(likedMap)
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
    }
  }

  const handleLike = async (postId: string) => {
    if (!user?.id) return

    try {
      if (likedPosts[postId]) {
        await unlikePost(postId, user.id)
        setLikedPosts({ ...likedPosts, [postId]: false })
        setPosts(posts.map((post) => (post._id === postId ? { ...post, likes: post.likes - 1 } : post)))
      } else {
        await likePost(postId, user.id)
        setLikedPosts({ ...likedPosts, [postId]: true })
        setPosts(posts.map((post) => (post._id === postId ? { ...post, likes: post.likes + 1 } : post)))
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  const components: Partial<PortableTextReactComponents> = {
    block: ({ children }) => <ThemedText style={styles.postContent}>{children}</ThemedText>,
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedText style={styles.header}>Fitness Community</ThemedText>
        {posts.map((post) => (
          <View key={post._id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.authorInfo}>
                <ThemedText style={styles.authorName}>{post.author?.name || "Anonymous"}</ThemedText>
                <ThemedText style={styles.role}>Fitness Enthusiast</ThemedText>
              </View>
              <ThemedText style={styles.publishDate}>{new Date(post.publishedAt).toLocaleDateString()}</ThemedText>
            </View>

            <PortableText value={post.body} components={components} />

            <View style={styles.postActions}>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(post._id)}>
                <Ionicons
                  name={likedPosts[post._id] ? "heart" : "heart-outline"}
                  size={24}
                  color={likedPosts[post._id] ? "#ff4444" : "#ffffff"}
                />
                <ThemedText style={styles.actionText}>{post.likes}</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090E21",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
    color: "#ffffff",
  },
  postCard: {
    backgroundColor: "#1A1F38",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  role: {
    fontSize: 14,
    color: "#8E8E93",
    marginLeft: 8,
  },
  publishDate: {
    fontSize: 12,
    color: "#8E8E93",
  },
  postContent: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 16,
    lineHeight: 24,
  },
  postActions: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#2C3149",
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  actionText: {
    marginLeft: 6,
    color: "#ffffff",
    fontSize: 14,
  },
})