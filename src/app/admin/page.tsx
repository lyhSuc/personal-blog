'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // 简易密码验证 (生产环境应使用更安全的方式)
        if (password === 'admin123') {
            localStorage.setItem('admin_authenticated', 'true')
            router.push('/admin/dashboard')
        } else {
            setError('密码错误')
            setPassword('')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🔐</div>
                    <h1 className="text-3xl font-bold text-white mb-2">管理后台</h1>
                    <p className="text-white/80">请输入密码以继续</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setError('')
                            }}
                            placeholder="输入密码"
                            className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                            autoFocus
                        />
                        {error && (
                            <p className="mt-2 text-red-200 text-sm">{error}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-white/90 transition-all hover:shadow-lg transform hover:scale-105"
                    >
                        登录
                    </button>

                    <p className="text-sm text-white/60 text-center">
                        提示: 默认密码为 admin123
                    </p>
                </form>
            </div>
        </div>
    )
}
