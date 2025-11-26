'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Category {
    id: string
    name: string
    slug: string
}

interface Post {
    id: string
    title: string
    published: boolean
    createdAt: string
    category: Category | null
}

export default function AdminDashboard() {
    const router = useRouter()
    const [posts, setPosts] = useState<Post[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // 检查登录状态
        if (typeof window !== 'undefined') {
            const isAuth = localStorage.getItem('admin_authenticated')
            if (!isAuth) {
                router.push('/admin')
                return
            }
        }

        // 加载数据
        Promise.all([
            fetch('/api/posts').then(res => res.json()),
            fetch('/api/categories').then(res => res.json())
        ]).then(([postsData, categoriesData]) => {
            setPosts(postsData)
            setCategories(categoriesData)
            setLoading(false)
        })
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('admin_authenticated')
        router.push('/admin')
    }

    const handleDelete = async (id: string) => {
        if (!confirm('确定要删除这篇文章吗？')) return

        await fetch(`/api/posts/${id}`, { method: 'DELETE' })
        setPosts(posts.filter(p => p.id !== id))
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl text-gray-600">加载中...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        管理后台
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                        退出登录
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="text-4xl font-bold mb-2">{posts.length}</div>
                        <div className="text-blue-100">总文章数</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="text-4xl font-bold mb-2">
                            {posts.filter(p => p.published).length}
                        </div>
                        <div className="text-green-100">已发布</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="text-4xl font-bold mb-2">{categories.length}</div>
                        <div className="text-purple-100">分类数</div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mb-8">
                    <Link
                        href="/admin/posts/new"
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all"
                    >
                        + 写新文章
                    </Link>
                    <Link
                        href="/admin/categories"
                        className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:shadow-md transition-all"
                    >
                        管理分类
                    </Link>
                </div>

                {/* Posts List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">文章列表</h2>
                    </div>

                    {posts.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            还没有文章，点击上方按钮创建第一篇文章吧！
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {posts.map((post) => (
                                <div key={post.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    {post.title}
                                                </h3>
                                                {post.published ? (
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                                        已发布
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                        草稿
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                {post.category && (
                                                    <span className="flex items-center gap-1">
                                                        <span>📁</span>
                                                        {post.category.name}
                                                    </span>
                                                )}
                                                <span>
                                                    {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/admin/posts/${post.id}`}
                                                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                编辑
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                删除
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
