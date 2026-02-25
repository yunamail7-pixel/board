import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Trash2, LogOut, Loader2, X, ImagePlus, Link as LinkIcon, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function AdminDashboard() {
    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    // 新增/編輯 Modal 狀態
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({ title: '', category: '活動', content: '', link_url: '' })
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            if (data) setPosts(data)
        } catch (error) {
            alert('讀取失敗: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id, imageUrl) => {
        if (!window.confirm('確定要刪除這筆消息嗎？刪除後無法復原。')) return

        try {
            // 如果有圖片，順便刪除儲存空間裡的圖片
            if (imageUrl) {
                try {
                    const fileName = imageUrl.split('/').pop()
                    if (fileName) {
                        await supabase.storage.from('images').remove([fileName])
                    }
                } catch (imgErr) {
                    console.error("圖片刪除失敗，但將繼續刪除文章", imgErr)
                }
            }

            const { error } = await supabase.from('posts').delete().eq('id', id)
            if (error) throw error
            setPosts(posts.filter(p => p.id !== id))
        } catch (error) {
            alert('刪除失敗: ' + error.message)
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('圖片大小不能超過 5MB')
                return
            }
            setImageFile(file)
            // 建立預覽圖
            const objectUrl = URL.createObjectURL(file)
            setImagePreview(objectUrl)
        }
    }

    const removeImage = () => {
        setImageFile(null)
        setImagePreview(null)
        // 重置 input value
        const fileInput = document.getElementById('image-upload')
        if (fileInput) fileInput.value = ''
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            let uploadedImageUrl = null

            // 如果有選擇圖片，先進行上傳
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop()
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from('images')
                    .upload(fileName, imageFile)

                if (uploadError) {
                    throw new Error('圖片上傳失敗，請確認已在 Supabase 建立名稱為 images 的 Storage Bucket 並開放公開上傳權限。(詳細錯誤: ' + uploadError.message + ')')
                }

                // 取得公開網址
                const { data } = supabase.storage
                    .from('images')
                    .getPublicUrl(fileName)

                uploadedImageUrl = data.publicUrl
            }

            const { error } = await supabase.from('posts').insert([
                {
                    title: formData.title,
                    category: formData.category,
                    content: formData.content,
                    link_url: formData.link_url || null,
                    image_url: uploadedImageUrl
                }
            ])

            if (error) throw error

            closeModal()
            fetchPosts() // 重新整理列表
        } catch (error) {
            alert('儲存失敗: ' + error.message)
        } finally {
            setIsSaving(false)
        }
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setFormData({ title: '', category: '活動', content: '', link_url: '' })
        setImageFile(null)
        setImagePreview(null)
    }

    const formatDate = (dateString) => {
        return dateString.split('T')[0]
    }

    const handleLogout = () => {
        navigate('/')
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-12">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-slate-800">
                        綠綠因子 管理後臺
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">登出回前臺</span>
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">消息與活動管理</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-brand-green hover:bg-green-600 text-white px-4 py-2.5 sm:py-2 rounded-lg font-medium transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        發佈新消息
                    </button>
                </div>

                {/* 提示訊息 */}
                <div className="mb-6 bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold text-blue-900 mb-1">全新支援：圖片與報名網址！</h4>
                        <p className="text-sm text-blue-700 leading-relaxed">
                            現在您可以在發消息時上傳活動 DM，並附上專屬的報名連結喔！<br />
                            <span className="font-semibold text-red-600">※ 首次使用圖片上傳前，請務必先在您的 Supabase 後臺 Storage 建立一個叫做「images」的 public bucket，並開放允許新增(Insert)的 Policies。</span>
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-brand-green">
                            <Loader2 className="w-8 h-8 animate-spin mb-4" />
                            <p className="text-slate-500 font-medium">資料載入中...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-4 font-medium whitespace-nowrap">分類</th>
                                        <th className="px-6 py-4 font-medium min-w-[300px]">標題</th>
                                        <th className="px-6 py-4 font-medium whitespace-nowrap">附件/連結</th>
                                        <th className="px-6 py-4 font-medium whitespace-nowrap">日期</th>
                                        <th className="px-6 py-4 font-medium text-right whitespace-nowrap">操作</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {posts.map((post) => (
                                        <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap ${post.category === '活動' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                                                    }`}>
                                                    {post.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                {post.title}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2 text-slate-400">
                                                    {post.image_url && <ImagePlus className="w-4 h-4 text-brand-green" title="包含圖片" />}
                                                    {post.link_url && <LinkIcon className="w-4 h-4 text-blue-500" title="包含連結" />}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                                                {formatDate(post.created_at)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() => handleDelete(post.id, post.image_url)}
                                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                                        title="刪除"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {posts.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                                目前還沒有任何消息。<br />點擊右上方「發佈新消息」開始第一篇公告吧！
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* 新增消息 Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900">發佈新消息</h3>
                            <button
                                onClick={closeModal}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
                            <div className="p-6 overflow-y-auto space-y-6">
                                {/* 第一列：分類與標題 */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            分類 <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-colors"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="活動">活動</option>
                                            <option value="公告">公告</option>
                                            <option value="最新消息">最新消息</option>
                                        </select>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            標題 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-colors"
                                            placeholder="請輸入一個引人注目的標題..."
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* 第二列：圖片上傳與連結 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                                    {/* 圖片上傳區 */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                                            <ImagePlus className="w-4 h-4 text-slate-400" />
                                            活動圖片 / DM (選填)
                                        </label>
                                        {imagePreview ? (
                                            <div className="relative rounded-lg overflow-hidden border border-slate-200 group bg-slate-100 aspect-video flex items-center justify-center">
                                                <img src={imagePreview} alt="預覽" className="max-h-full object-contain" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={removeImage}
                                                        className="px-3 py-1.5 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors shadow-sm"
                                                    >
                                                        移除圖片
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                                                onClick={() => document.getElementById('image-upload').click()}
                                            >
                                                <div className="space-y-1 text-center">
                                                    <ImagePlus className="mx-auto h-8 w-8 text-slate-400" />
                                                    <div className="flex text-sm text-slate-600 justify-center">
                                                        <span className="relative cursor-pointer bg-transparent rounded-md font-medium text-brand-green hover:text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-green">
                                                            點擊選擇圖片
                                                            <input id="image-upload" name="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-2">支援 JPG, PNG (最大 5MB)</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* 報名連結區 */}
                                    <div className="flex flex-col justify-end">
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                                            <LinkIcon className="w-4 h-4 text-slate-400" />
                                            相關連結 / 報名網址 (選填)
                                        </label>
                                        <input
                                            type="url"
                                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-colors"
                                            placeholder="例如：https://forms.gle/..."
                                            value={formData.link_url}
                                            onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                                        />
                                        <p className="text-xs text-slate-500 mt-2 ml-1">若填寫網址，前臺會自動顯示一個明顯的跳轉按鈕。</p>
                                    </div>
                                </div>

                                {/* 內文區 */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        詳細內容 <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        required
                                        rows="6"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-colors resize-none"
                                        placeholder="在這裡輸入詳細的活動或消息內容... (自動支援段落換行)"
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 mt-auto">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded-lg transition-colors"
                                >
                                    取消
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-green hover:bg-green-600 active:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            處理中...
                                        </>
                                    ) : (
                                        '確認發佈'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

