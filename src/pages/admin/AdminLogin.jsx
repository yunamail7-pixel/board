import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Leaf, Lock } from 'lucide-react'

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault()
        setError('')

        // 簡易前端防護，密碼設為綠綠因子
        if (password === 'green123') {
            navigate('/admin/dashboard')
        } else {
            setError('帳號或密碼錯誤')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-brand-green mb-4">
                        <Leaf className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">綠綠因子 後臺登入</h1>
                    <p className="text-sm text-slate-500 mt-2">請輸入您的管理員帳號密碼</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            電子郵件
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-colors"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            密碼
                        </label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-colors"
                            placeholder="提示密碼：green123"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-brand-green hover:bg-green-600 active:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors"
                    >
                        <Lock className="w-4 h-4" />
                        登入系統
                    </button>
                </form>
            </div>
        </div>
    )
}
