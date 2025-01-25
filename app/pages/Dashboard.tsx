import React, { useEffect, useState, useContext } from 'react';
import { PlusCircle, Settings, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AuthContext } from '../App';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  created_at: string;
  user_id: string;
}

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function deletePost(postId: string) {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => window.location.href = '/new'}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          New Post
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No posts yet. Create your first post!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-card rounded-lg shadow p-6 flex justify-between items-start"
            >
              <div>
                <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                <p className="text-muted-foreground text-sm mb-2">{post.excerpt}</p>
                <div className="flex items-center space-x-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => window.location.href = `/edit/${post.id}`}
                  className="p-2 hover:bg-accent rounded-md"
                >
                  <Settings className="h-5 w-5" />
                </button>
                <button
                  onClick={() => deletePost(post.id)}
                  className="p-2 hover:bg-destructive/10 text-destructive rounded-md"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}