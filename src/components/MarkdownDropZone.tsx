'use client'

import { useState } from 'react'

interface MarkdownDropZoneProps {
    onFileLoad: (title: string, content: string) => void
}

export default function MarkdownDropZone({ onFileLoad }: MarkdownDropZoneProps) {
    const [isDragging, setIsDragging] = useState(false)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        const files = Array.from(e.dataTransfer.files)
        const mdFile = files.find(file => file.name.endsWith('.md') || file.name.endsWith('.markdown'))

        if (!mdFile) {
            alert('请拖入 .md 或 .markdown 文件')
            return
        }

        try {
            const text = await mdFile.text()

            // 从文件名提取标题 (去掉扩展名)
            const fileName = mdFile.name.replace(/\.(md|markdown)$/, '')

            // 尝试从内容中提取标题 (查找第一个 # 标题)
            const titleMatch = text.match(/^#\s+(.+)$/m)
            const extractedTitle = titleMatch ? titleMatch[1] : fileName

            onFileLoad(extractedTitle, text)
        } catch (error) {
            alert('读取文件失败')
            console.error(error)
        }
    }

    const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.name.endsWith('.md') && !file.name.endsWith('.markdown')) {
            alert('请选择 .md 或 .markdown 文件')
            return
        }

        try {
            const text = await file.text()
            const fileName = file.name.replace(/\.(md|markdown)$/, '')
            const titleMatch = text.match(/^#\s+(.+)$/m)
            const extractedTitle = titleMatch ? titleMatch[1] : fileName

            onFileLoad(extractedTitle, text)
        } catch (error) {
            alert('读取文件失败')
            console.error(error)
        }
    }

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
        relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer
        ${isDragging
                    ? 'border-blue-500 bg-blue-50 scale-105'
                    : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50'
                }
      `}
        >
            <input
                type="file"
                accept=".md,.markdown"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="pointer-events-none">
                <div className="text-5xl mb-4">📄</div>
                <p className="text-lg font-medium text-gray-700 mb-2">
                    {isDragging ? '松开以导入文件' : '拖拽 Markdown 文件到此处'}
                </p>
                <p className="text-sm text-gray-500">
                    或点击选择 .md / .markdown 文件
                </p>
            </div>
        </div>
    )
}
