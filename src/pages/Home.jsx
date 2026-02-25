import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, ChevronRight, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Home() {
    const [news, setNews] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchNews()
    }, [])

    const fetchNews = async () => {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            if (data) setNews(data)
        } catch (error) {
            console.error('讀取消息失敗:', error.message)
        } finally {
            setLoading(false)
        }
    }

    // 格式化日期：移除時間部分
    const formatDate = (dateString) => {
        return dateString.split('T')[0]
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900 border-l-4 border-brand-green pl-3">
                    最新消息與活動
                </h1>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-brand-green">
                    <Loader2 className="w-8 h-8 animate-spin mb-4" />
                    <p className="text-slate-500 font-medium">資料載入中...</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {news.map((item) => (
                        <Link
                            key={item.id}
                            to={`/news/${item.id}`}
                            className="group block bg-white rounded-xl shadow-sm border border-slate-100 p-5 transition-all hover:shadow-md hover:border-green-200 active:scale-[0.99]"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${item.category === '活動' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                            {item.category}
                                        </span>
                                        <div className="flex items-center text-xs text-slate-500">
                                            <Calendar className="w-3.5 h-3.5 mr-1" />
                                            {formatDate(item.created_at)}
                                        </div>
                                    </div>
                                    <h2 className="text-lg font-semibold text-slate-800 group-hover:text-brand-green transition-colors line-clamp-2">
                                        {item.title}
                                    </h2>
                                    <p className="text-sm text-slate-600 line-clamp-2">
                                        {item.content}
                                    </p>
                                </div>
                                <div className="flex-shrink-0 pt-2 text-slate-400 group-hover:text-brand-green transition-colors">
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </div>
                        </Link>
                    ))}

                    {news.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-xl border border-slate-100 text-slate-500">
                            目前還沒有發佈任何最新消息喔！
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
