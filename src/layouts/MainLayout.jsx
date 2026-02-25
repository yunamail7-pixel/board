import { Outlet, Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'

export default function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
            {/* 頂部導航 */}
            <header className="sticky top-0 z-50 bg-white shadow-sm">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-brand-green font-bold text-xl tracking-wide">
                        <Leaf className="w-6 h-6" />
                        <span>綠綠因子健康生活</span>
                    </Link>
                    <div className="text-sm font-medium text-slate-500">
                        最新消息
                    </div>
                </div>
            </header>

            {/* 主要內容區塊 (限制最大寬度以適應電腦版，手機版則滿版) */}
            <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <Outlet />
            </main>

            {/* 底部 Footer */}
            <footer className="bg-white border-t border-slate-200 mt-auto">
                <div className="max-w-3xl mx-auto px-4 py-6 text-center text-sm text-slate-500">
                    <p>© {new Date().getFullYear()} 綠綠因子健康生活. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
