'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import MarkdownDropZone from '@/components/MarkdownDropZone'

interface Category {
    id: string
    name: string
    slug: string
}

export default function NewPost() {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [published, setPublished] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [saving, setSaving] = useState(false)
    const [showDropZone, setShowDropZone] = useState(true)

    useEffect(() => {
        // 检查登录
        if (typeof window !== 'undefined' && !localStorage.getItem('admin_authenticated')) {
            router.push('/admin')
            return
        }

        // 加载分类
        fetch('/api/categories')
            .then(res => res.json())
            .then(setCategories)
    }, [router])

    const handleFileLoad = (extractedTitle: string, extractedContent: string) => {
        setTitle(extractedTitle)
        setContent(extractedContent)
        setShowDropZone(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !content) return

        setSaving(true)
        try {
            await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content,
                    categoryId: categoryId || null,
                    published
                })
            })
            router.push('/admin/dashboard')
        } catch (error) {
            alert('保存失败')
            setSaving(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-6">
                <div className="mb-6">
                    <button
                        onClick={() => router.back()}
                        className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
                    >
                        ← 返回
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        写新文章
                    </h1>

                    {/* Markdown Drop Zone */}
                    {showDropZone && (
                        <div className="mb-6">
                            <MarkdownDropZone onFileLoad={handleFileLoad} />
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">或手动输入</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {!showDropZone && (
                        <div className="mb-6">
                            <button
                                onClick={() => setShowDropZone(true)}
                                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-2"
                            >
                                📄 重新上传 Markdown 文件
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                文章标题
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="输入文章标题..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                分类
                            </label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            >
                                <option value="">无分类</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                内容 (支持 Markdown)
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono text-sm"
                                rows={20}
                                placeholder="# 标题&#10;&#10;正文内容..."
                                required
                            />
                            <p className="mt-2 text-sm text-gray-500">
                                支持 Markdown 格式：# 标题, **粗体**, *斜体* 等
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="published"
                                checked={published}
                                onChange={(e) => setPublished(e.target.checked)}
                                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="published" className="text-sm font-medium text-gray-700">
                                立即发布
                            </label>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? '保存中...' : '保存文章'}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
                            >
                                取消
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
