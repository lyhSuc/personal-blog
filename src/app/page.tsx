import { prisma } from '@/lib/prisma'

interface Post {
  id: string
  title: string
  content: string
  published: boolean
  createdAt: Date
  updatedAt: Date
  categoryId: string | null
  category: {
    id: string
    name: string
    slug: string
  } | null
}

async function getPosts(): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return posts
}

export default async function Home() {
  const posts = await getPosts()
  const publishedPosts = posts.filter(post => post.published)

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            欢迎来到我的博客
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            分享技术见解、学习心得与生活感悟
          </p>
        </div>
      </section>

      {/* Posts Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">最新文章</h2>

        {publishedPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-xl text-gray-600 mb-4">还没有文章</p>
            <p className="text-gray-500">前往管理后台发布你的第一篇文章吧！</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 hover:-translate-y-1"
              >
                <div className="p-6">
                  {post.category && (
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-medium mb-3">
                      {post.category.name}
                    </span>
                  )}
                  <h3 className="text-xl font-bold mb-3 text-gray-800 hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.content.substring(0, 150)}...
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <time>
                      {new Date(post.createdAt).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                    <a
                      href={`/posts/${post.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                    >
                      阅读更多 →
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
