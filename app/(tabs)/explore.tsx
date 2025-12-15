import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Linking 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  imageUrl: string;
  readTime: string;
}


const BLOG_DATA: BlogPost[] = [
  {
    id: '1',
    title: '5 Tips for Building Muscle Fast',
    description: 'Discover the essential rules of hypertrophy and how to maximize your gains in the gym with these 5 simple steps.',
    author: 'Vikram Khatkar',
    date: 'Dec 12, 2025',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'The Importance of Recovery',
    description: 'Why rest days are just as important as training days. Learn how sleep and nutrition affect your performance.',
    author: 'Dr. Sarah Fit',
    date: 'Dec 10, 2025',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Home Workout vs Gym: Which is Better?',
    description: 'A comprehensive comparison between working out at home and joining a commercial gym.',
    author: 'Alex Trainer',
    date: 'Dec 08, 2025',
    readTime: '7 min read',
    imageUrl: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '4',
    title: 'Top Superfoods for Energy',
    description: 'Boost your energy levels naturally with these nutrient-dense foods that serve as perfect pre-workout fuel.',
    author: 'Nutrition Team',
    date: 'Dec 05, 2025',
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop',
  },
];

export default function ExploreScreen() {

  const renderBlogItem = ({ item }: { item: BlogPost }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.9}>
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>{item.date}</Text>
          <Text style={styles.metaText}>•</Text>
          <Text style={styles.metaText}>{item.readTime}</Text>
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.author}>By {item.author}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <Text style={styles.headerSubtitle}>Latest fitness insights & tips</Text>
      </View>

      <FlatList
        data={BLOG_DATA}
        renderItem={renderBlogItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070F2B',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#090E26',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#A0AEC0',
    marginTop: 5,
  },
  listContent: {
    padding: 20,
  },
  card: {
    backgroundColor: '#1B2236',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2D3748',
    elevation: 3, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  metaText: {
    color: '#306BFF',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 6,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#A0AEC0',
    lineHeight: 20,
    marginBottom: 12,
  },
  author: {
    fontSize: 12,
    color: '#718096',
    fontStyle: 'italic',
  },
});
