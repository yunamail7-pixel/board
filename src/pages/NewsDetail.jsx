import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, User, Loader2, Link as LinkIcon } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function NewsDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPostDetails()
    }, [id])

    const fetchPostDetails = async () => {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error
            if (data) setPost(data)
        } catch (error) {
            console.error('讀取文章失敗:', error.message)
            navigate('/') // 找不到文章或發生錯誤時退回首頁
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString) => {
        return dateString.split('T')[0]
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-brand-green">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">載入內容中...</p>
            </div>
        )
    }

    if (!post) return null

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {post.image_url && (
                <div className="w-full h-48 sm:h-72 md:h-96 bg-slate-100 relative overflow-hidden group">
                    <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                </div>
            )}

            <div className={`px-5 py-6 sm:p-8 space-y-6 ${post.image_url ? 'pt-6 sm:pt-8' : ''}`}>
                {/* 返回按鈕 */}
                <Link
                    to="/"
                    className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-brand-green transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1.5" />
                    返回列表
                </Link>

                {/* 標題與標籤 */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${post.category === '活動' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                            }`}>
                            {post.category}
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-slate-500 pb-4 border-b border-slate-100">
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1.5" />
                            {formatDate(post.created_at)}
                        </div>
                        <div className="flex items-center">
                            <User className="w-4 h-4 mr-1.5" />
                            綠綠因子管理員
                        </div>
                    </div>
                </div>

                {/* 文章內容：保留換行符號的渲染方式 */}
                <div className="prose prose-slate prose-green max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {post.content}
                </div>

                {/* 外部連結 / 報名按鈕 */}
                {post.link_url && (
                    <div className="pt-8 pb-4">
                        <a
                            href={post.link_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-green-600 active:bg-green-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5 w-full sm:w-auto text-lg"
                        >
                            <LinkIcon className="w-5 h-5" />
                            前往報名 / 查看詳細連結
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}
