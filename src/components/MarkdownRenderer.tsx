'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MarkdownRendererProps {
    content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <div className="markdown-content">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // 代码块 - 使用更美观的主题
                    code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '')
                        const language = match ? match[1] : ''

                        return !inline && match ? (
                            <div className="my-6 rounded-xl overflow-hidden shadow-lg">
                                {/* 代码块头部 - 显示语言 */}
                                <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                                    <span className="text-gray-400 text-sm font-mono uppercase">
                                        {language}
                                    </span>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(String(children).replace(/\n$/, ''))
                                        }}
                                        className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                                    >
                                        📋 复制
                                    </button>
                                </div>
                                {/* 代码内容 */}
                                <SyntaxHighlighter
                                    style={oneDark}
                                    language={language}
                                    PreTag="div"
                                    customStyle={{
                                        margin: 0,
                                        borderRadius: 0,
                                        fontSize: '0.9rem',
                                        lineHeight: '1.6'
                                    }}
                                    showLineNumbers
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            </div>
                        ) : (
                            <code className="bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                                {children}
                            </code>
                        )
                    },
                    // 引用块
                    blockquote({ children }) {
                        return (
                            <blockquote className="border-l-4 border-blue-500 bg-blue-50 py-3 px-6 my-4 italic text-gray-700 rounded-r-lg">
                                {children}
                            </blockquote>
                        )
                    },
                    // 标题
                    h1({ children }) {
                        return <h1 className="text-4xl font-bold mt-8 mb-4 text-gray-900 pb-2 border-b-2 border-gray-200">{children}</h1>
                    },
                    h2({ children }) {
                        return <h2 className="text-3xl font-bold mt-6 mb-3 text-gray-800 pb-2 border-b border-gray-200">{children}</h2>
                    },
                    h3({ children }) {
                        return <h3 className="text-2xl font-bold mt-5 mb-2 text-gray-800">{children}</h3>
                    },
                    h4({ children }) {
                        return <h4 className="text-xl font-bold mt-4 mb-2 text-gray-800">{children}</h4>
                    },
                    h5({ children }) {
                        return <h5 className="text-lg font-bold mt-3 mb-2 text-gray-700">{children}</h5>
                    },
                    h6({ children }) {
                        return <h6 className="text-base font-bold mt-3 mb-2 text-gray-700">{children}</h6>
                    },
                    // 段落
                    p({ children }) {
                        return <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
                    },
                    // 链接
                    a({ href, children }) {
                        return (
                            <a
                                href={href}
                                className="text-blue-600 hover:text-blue-700 underline decoration-2 underline-offset-2 transition-colors"
                                target={href?.startsWith('http') ? '_blank' : undefined}
                                rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                            >
                                {children}
                            </a>
                        )
                    },
                    // 图片
                    img({ src, alt }) {
                        return (
                            <img
                                src={src}
                                alt={alt}
                                className="rounded-lg shadow-md my-6 max-w-full h-auto"
                                loading="lazy"
                            />
                        )
                    },
                    // 无序列表
                    ul({ children }) {
                        return <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 ml-4">{children}</ul>
                    },
                    // 有序列表
                    ol({ children }) {
                        return <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 ml-4">{children}</ol>
                    },
                    // 列表项
                    li({ children }) {
                        return <li className="ml-2">{children}</li>
                    },
                    // 粗体
                    strong({ children }) {
                        return <strong className="font-bold text-gray-900">{children}</strong>
                    },
                    // 斜体
                    em({ children }) {
                        return <em className="italic text-gray-800">{children}</em>
                    },
                    // 表格
                    table({ children }) {
                        return (
                            <div className="overflow-x-auto my-6 rounded-lg border border-gray-200">
                                <table className="min-w-full">
                                    {children}
                                </table>
                            </div>
                        )
                    },
                    thead({ children }) {
                        return <thead className="bg-gradient-to-r from-gray-50 to-gray-100">{children}</thead>
                    },
                    th({ children }) {
                        return (
                            <th className="border-b-2 border-gray-300 px-6 py-3 text-left font-semibold text-gray-800">
                                {children}
                            </th>
                        )
                    },
                    tbody({ children }) {
                        return <tbody className="bg-white">{children}</tbody>
                    },
                    tr({ children }) {
                        return <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">{children}</tr>
                    },
                    td({ children }) {
                        return <td className="px-6 py-3 text-gray-700">{children}</td>
                    },
                    // 水平线
                    hr() {
                        return <hr className="my-8 border-t-2 border-gray-300" />
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}
