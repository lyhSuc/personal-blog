import Link from 'next/link'

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all">
                        我的博客
                    </Link>

                    <div className="flex items-center gap-8">
                        <Link
                            href="/"
                            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                        >
                            首页
                        </Link>
                        <Link
                            href="/admin"
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all font-medium"
                        >
                            管理后台
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
