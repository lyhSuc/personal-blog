import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import MarkdownRenderer from '@/components/MarkdownRenderer'

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

async function getPost(id: string): Promise<Post | null> {
    try {
        const post = await prisma.post.findUnique({
            where: { id },
            include: { category: true },
        })
        return post
    } catch {
        return null
    }
}

export default async function PostPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const post = await getPost(id)

    if (!post || !post.published) {
        notFound()
    }

    return (
        <main className="min-h-screen bg-white">
            <article className="max-w-4xl mx-auto px-6 py-16">
                {/* Header */}
                <header className="mb-12">
                    {post.category && (
                        <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                            {post.category.name}
                        </span>
                    )}
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-4 text-gray-600">
                        <time>
                            {new Date(post.createdAt).toLocaleDateString('zh-CN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </time>
                        <span>·</span>
                        <span>{Math.ceil(post.content.length / 400)} 分钟阅读</span>
                    </div>
                </header>

                {/* Content - Now with Markdown rendering */}
                <MarkdownRenderer content={post.content} />

                {/* Footer */}
                <footer className="mt-16 pt-8 border-t border-gray-200">
                    <a
                        href="/"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                        ← 返回首页
                    </a>
                </footer>
            </article>
        </main>
    )
}
