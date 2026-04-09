'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, Video, Music, Settings, Database, ExternalLink, Trash2, AlertTriangle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGame } from '@/lib/game-context';
import { resetGateKeeper } from '@/components/GateKeeper';

const adminModules = [
  {
    id: 'photos',
    name: '照片管理',
    icon: <ImageIcon className="w-6 h-6" />,
    description: '管理照片墙中的照片',
    color: 'from-pink-400 to-rose-400',
  },
  {
    id: 'videos',
    name: '视频管理',
    icon: <Video className="w-6 h-6" />,
    description: '上传和管理纪念视频',
    color: 'from-rose-400 to-orange-400',
  },
  {
    id: 'music',
    name: '音乐管理',
    icon: <Music className="w-6 h-6" />,
    description: '设置背景音乐播放列表',
    color: 'from-orange-400 to-amber-400',
  },
  {
    id: 'letters',
    name: '信件收件箱',
    icon: <Mail className="w-6 h-6" />,
    description: '查看女主角提交的专属信件',
    color: 'from-amber-400 to-yellow-400',
  },
  {
    id: 'data',
    name: '数据管理',
    icon: <Database className="w-6 h-6" />,
    description: '导入/导出网站数据，重置游戏进度',
    color: 'from-yellow-400 to-lime-400',
  },
  {
    id: 'settings',
    name: '网站设置',
    icon: <Settings className="w-6 h-6" />,
    description: '修改纪念日、名字等基本信息',
    color: 'from-lime-400 to-green-400',
  },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('photos');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFAF8] to-[#FFF8F5] pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Settings className="w-8 h-8 text-[#E8A598] mx-auto mb-4" />
          <h1 className="text-4xl font-light text-[#2D2D2D] mb-2">
            管理后台
          </h1>
          <p className="text-[#6B6B6B]">
            管理网站内容，更新照片、视频和设置
          </p>
        </motion.div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {adminModules.map((module, index) => (
            <motion.button
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setActiveTab(module.id)}
              className={`p-6 rounded-2xl text-left transition-all ${
                activeTab === module.id
                  ? 'bg-white shadow-lg ring-2 ring-[#E8A598]'
                  : 'bg-white/50 hover:bg-white hover:shadow-md'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${module.color} flex items-center justify-center text-white mb-4`}>
                {module.icon}
              </div>
              <h3 className="font-medium text-[#2D2D2D]">{module.name}</h3>
              <p className="text-xs text-[#6B6B6B] mt-1">{module.description}</p>
            </motion.button>
          ))}
        </div>

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {activeTab === 'photos' && (
            <PhotoManager />
          )}
          {activeTab === 'videos' && (
            <VideoManager />
          )}
          {activeTab === 'music' && (
            <MusicManager />
          )}
          {activeTab === 'letters' && (
            <LettersManager />
          )}
          {activeTab === 'data' && (
            <DataManager />
          )}
          {activeTab === 'settings' && (
            <SettingsManager />
          )}
        </motion.div>
      </div>
    </div>
  );
}

// 照片管理组件
function PhotoManager() {
  const [photos, setPhotos] = useState([
    { id: '1', url: '', title: '', date: '', category: '' },
  ]);

  const addPhoto = () => {
    setPhotos([...photos, { id: Date.now().toString(), url: '', title: '', date: '', category: '' }]);
  };

  const updatePhoto = (id: string, field: string, value: string) => {
    setPhotos(photos.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removePhoto = (id: string) => {
    setPhotos(photos.filter(p => p.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>照片管理</span>
          <Button onClick={addPhoto} size="sm">
            <Upload className="w-4 h-4 mr-2" />
            添加照片
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
            <p className="font-medium mb-1">💡 使用说明：</p>
            <p>1. 先将照片上传到图床（如 sm.ms）</p>
            <p>2. 粘贴图片 URL 到下方输入框</p>
            <p>3. 填写照片标题、日期和分类</p>
            <p>4. 点击保存即可在网站中显示</p>
          </div>

          {photos.map((photo, index) => (
            <div key={photo.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#6B6B6B]">照片 #{index + 1}</span>
                {photos.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removePhoto(photo.id)}>
                    删除
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="图片 URL (从图床复制)"
                  value={photo.url}
                  onChange={(e) => updatePhoto(photo.id, 'url', e.target.value)}
                />
                <Input
                  placeholder="照片标题"
                  value={photo.title}
                  onChange={(e) => updatePhoto(photo.id, 'title', e.target.value)}
                />
                <Input
                  placeholder="日期 (2026-05-20)"
                  value={photo.date}
                  onChange={(e) => updatePhoto(photo.id, 'date', e.target.value)}
                />
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={photo.category}
                  onChange={(e) => updatePhoto(photo.id, 'category', e.target.value)}
                >
                  <option value="">选择分类</option>
                  <option value="first-meet">初见</option>
                  <option value="travel">旅行</option>
                  <option value="daily">日常</option>
                  <option value="anniversary">纪念</option>
                </select>
              </div>
              {photo.url && (
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img src={photo.url} alt="预览" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          ))}

          <Button className="w-full" onClick={() => alert('保存成功！')}>保存所有照片</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// 视频管理组件
function VideoManager() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>视频管理</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
            <p className="font-medium mb-1">💡 视频上传说明：</p>
            <p>1. 建议将视频上传到 B站/优酷/YouTube 等平台</p>
            <p>2. 如果是 MP4 文件，可以上传到图床获取直链</p>
            <p>3. 粘贴视频链接或嵌入代码</p>
          </div>

          <div className="border rounded-lg p-4 space-y-3">
            <Input placeholder="视频标题" />
            <Input placeholder="视频 URL 或嵌入链接" />
            <Input placeholder="封面图片 URL" />
            <Input placeholder="视频时长 (如: 05:20)" />
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
              placeholder="视频描述..."
            />
          </div>

          <Button className="w-full">保存视频</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// 音乐管理组件
function MusicManager() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>背景音乐</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-[#6B6B6B]">
            添加你们的专属歌单，每首歌都是一个回忆
          </p>

          <div className="border rounded-lg p-4 space-y-3">
            <Input placeholder="歌曲名称" />
            <Input placeholder="歌手" />
            <Input placeholder="音乐文件 URL" />
          </div>

          <Button className="w-full">添加歌曲</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// 数据管理组件
function DataManager() {
  const { resetGame, unlockedLevels, collectedLetters } = useGame();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    // 1. 重置游戏进度（关卡、字母收集等）
    resetGame();

    // 2. 重置音乐状态
    localStorage.removeItem('music_current_index');
    localStorage.removeItem('music_current_time');

    // 3. 重置暗号验证状态（GateKeeper + IntroPage）
    resetGateKeeper();
    localStorage.removeItem('authenticated');

    // 4. 重置时间线章节槽位
    localStorage.removeItem('timeline-emoji-slots');

    // 5. 通知用户并重载页面
    setShowConfirm(false);

    // 跳转回首页并强制刷新，使所有组件重新加载初始状态
    window.location.href = '/';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>数据管理</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 导入导出 */}
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
              <Upload className="w-6 h-6 mb-2" />
              <span>导入数据</span>
              <span className="text-xs text-[#6B6B6B]">从 JSON 文件</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
              <ExternalLink className="w-6 h-6 mb-2" />
              <span>导出数据</span>
              <span className="text-xs text-[#6B6B6B]">备份到 JSON</span>
            </Button>
          </div>

          {/* 游戏状态概览 */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-medium text-amber-900 mb-2">当前游戏状态</h4>
            <div className="space-y-1 text-sm text-amber-800">
              <p>已解锁关卡: {unlockedLevels.length > 0 ? unlockedLevels.join(', ') : '无'}</p>
              <p>已收集字母: {collectedLetters.length > 0 ? collectedLetters.join(', ').toUpperCase() : '无'}</p>
            </div>
          </div>

          {/* 重置游戏进度 */}
          <div className="border-t pt-6">
            <h4 className="font-medium text-red-600 mb-3 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              危险区域
            </h4>

            {!showConfirm ? (
              <Button
                variant="outline"
                className="w-full h-16 flex flex-col items-center justify-center border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => setShowConfirm(true)}
              >
                <Trash2 className="w-5 h-5 mb-1" />
                <span>重置所有进度</span>
                <span className="text-xs text-red-400">清除游戏、音乐、暗号等所有状态</span>
              </Button>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-4">
                <p className="text-sm text-red-700">
                  确定要重置吗？这将清除所有已解锁的关卡、收集的字母、音乐播放状态以及暗号验证记录，网站将回归初始状态，此操作不可恢复！
                </p>
                <div className="flex space-x-3">
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleReset}
                  >
                    确认重置
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowConfirm(false)}
                  >
                    取消
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 设置管理组件
function SettingsManager() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>网站设置</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border rounded-lg p-4 space-y-3">
            <div>
              <label className="text-sm font-medium text-[#2D2D2D]">男生名字</label>
              <Input defaultValue="苏子钦" />
            </div>
            <div>
              <label className="text-sm font-medium text-[#2D2D2D]">女生名字</label>
              <Input defaultValue="李丹" />
            </div>
            <div>
              <label className="text-sm font-medium text-[#2D2D2D]">恋爱开始日期</label>
              <Input defaultValue="2026-05-20" type="date" />
            </div>
          </div>

          <Button className="w-full">保存设置</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// 信件收件箱组件
function LettersManager() {
  const [letters, setLetters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchLetters = () => {
    setLoading(true);
    fetch('/api/letter')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLetters(data.letters || []);
        } else {
          setError(data.error || '加载失败');
        }
      })
      .catch((err) => {
        setError(err.message || '加载失败');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLetters();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这封信吗？删除后不可恢复。')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/letter?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setLetters((prev) => prev.filter((l) => l.id !== id));
      } else {
        alert(data.error || '删除失败');
      }
    } catch {
      alert('删除失败，请稍后重试');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mail className="w-5 h-5 text-rose-500" />
          <span>专属信件收件箱</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading && (
            <div className="text-center py-12 text-[#6B6B6B]">正在加载信件...</div>
          )}

          {!loading && error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
              <p className="font-medium mb-1">加载失败</p>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && letters.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-50 flex items-center justify-center">
                <Mail className="w-8 h-8 text-rose-300" />
              </div>
              <p className="text-[#6B6B6B] font-medium">暂未收到信件，请耐心等待~</p>
              <p className="text-xs text-[#9B6A6C] mt-1">
                女主角在成就勋章页投递的信件将显示在这里
              </p>
            </div>
          )}

          {!loading && !error && letters.length > 0 && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 flex items-center justify-between">
                <div>
                  <p className="font-medium mb-1">💌 来信统计</p>
                  <p>目前共收到 <span className="font-bold text-amber-900">{letters.length}</span> 封专属信件</p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchLetters}>
                  刷新
                </Button>
              </div>

              {letters.map((letter, index) => (
                <div
                  key={letter.id || index}
                  className="border rounded-xl p-5 bg-gradient-to-br from-white to-rose-50/30"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm font-bold">
                        {letters.length - index}
                      </span>
                      <span className="font-medium text-[#2D2D2D]">
                        第 {letters.length - index} 封信
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-[#9B6A6C]">
                        {new Date(letter.createdAt).toLocaleString('zh-CN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        disabled={deletingId === letter.id}
                        onClick={() => handleDelete(letter.id)}
                      >
                        {deletingId === letter.id ? '删除中...' : '删除'}
                      </Button>
                    </div>
                  </div>

                  <div className="relative">
                    <div
                      className="w-full p-4 rounded-lg bg-[#FDFBF7] text-[#7C444F] leading-relaxed whitespace-pre-wrap min-h-[120px]"
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient(transparent, transparent 27px, rgba(227, 93, 106, 0.08) 27px, rgba(227, 93, 106, 0.08) 28px)',
                        lineHeight: '28px',
                      }}
                    >
                      {letter.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
