'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Category {
    id: string
    name: string
    slug: string
    _count?: { posts: number }
}

export default function CategoriesPage() {
    const router = useRouter()
    const [categories, setCategories] = useState<Category[]>([])
    const [newName, setNewName] = useState('')
    const [newSlug, setNewSlug] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (typeof window !== 'undefined' && !localStorage.getItem('admin_authenticated')) {
            router.push('/admin')
            return
        }

        loadCategories()
    }, [router])

    const loadCategories = async () => {
        const res = await fetch('/api/categories')
        const data = await res.json()
        setCategories(data)
        setLoading(false)
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newName || !newSlug) return

        await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName, slug: newSlug })
        })

        setNewName('')
        setNewSlug('')
        loadCategories()
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl text-gray-600">加载中...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-6">
                <div className="mb-6">
                    <button
                        onClick={() => router.push('/admin/dashboard')}
                        className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
                    >
                        ← 返回仪表板
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        分类管理
                    </h1>

                    {/* 创建新分类 */}
                    <form onSubmit={handleCreate} className="mb-8 p-6 bg-gray-50 rounded-xl">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">创建新分类</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    分类名称
                                </label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="例如: 技术"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    URL Slug
                                </label>
                                <input
                                    type="text"
                                    value={newSlug}
                                    onChange={(e) => setNewSlug(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="例如: tech"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                        >
                            创建分类
                        </button>
                    </form>

                    {/* 分类列表 */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">
                            现有分类 ({categories.length})
                        </h2>

                        {categories.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">还没有分类</p>
                        ) : (
                            <div className="space-y-3">
                                {categories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div>
                                            <div className="font-semibold text-gray-800">
                                                {category.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Slug: {category.slug}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
