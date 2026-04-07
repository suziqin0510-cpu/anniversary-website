'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// 相册照片数据 - 所有135张照片
const ALBUM_PHOTOS = [
  { id: 1, src: "/album/1772287494571.JPEG" },
  { id: 2, src: "/album/3c8f20500ba03b84d6794491c36f764c.JPG" },
  { id: 3, src: "/album/4dcaadea81d8361b1fbbdbd11c671cee.JPG" },
  { id: 4, src: "/album/IMG_0053.jpg" },
  { id: 5, src: "/album/IMG_0256.jpg" },
  { id: 6, src: "/album/IMG_0283.jpg" },
  { id: 7, src: "/album/IMG_0295.jpg" },
  { id: 8, src: "/album/IMG_0413.jpg" },
  { id: 9, src: "/album/IMG_0531.jpg" },
  { id: 10, src: "/album/IMG_0616.jpg" },
  { id: 11, src: "/album/IMG_0658.JPG" },
  { id: 12, src: "/album/IMG_0699.jpg" },
  { id: 13, src: "/album/IMG_0755.jpg" },
  { id: 14, src: "/album/IMG_0775.jpg" },
  { id: 15, src: "/album/IMG_0868.jpg" },
  { id: 16, src: "/album/IMG_1211.jpg" },
  { id: 17, src: "/album/IMG_1338.jpg" },
  { id: 18, src: "/album/IMG_1718.jpg" },
  { id: 19, src: "/album/IMG_1915.jpg" },
  { id: 20, src: "/album/IMG_1929.jpg" },
  { id: 21, src: "/album/IMG_2207.jpg" },
  { id: 22, src: "/album/IMG_2361.jpg" },
  { id: 23, src: "/album/IMG_2411.jpg" },
  { id: 24, src: "/album/IMG_2448.jpg" },
  { id: 25, src: "/album/IMG_2475.jpg" },
  { id: 26, src: "/album/IMG_2510.jpg" },
  { id: 27, src: "/album/IMG_2524.jpg" },
  { id: 28, src: "/album/IMG_2533.jpg" },
  { id: 29, src: "/album/IMG_2745.jpg" },
  { id: 30, src: "/album/IMG_2816.jpg" },
  { id: 31, src: "/album/IMG_3085.jpg" },
  { id: 32, src: "/album/IMG_3209.jpg" },
  { id: 33, src: "/album/IMG_3677.jpg" },
  { id: 34, src: "/album/IMG_3714.jpg" },
  { id: 35, src: "/album/IMG_3772.jpg" },
  { id: 36, src: "/album/IMG_3812.jpg" },
  { id: 37, src: "/album/IMG_4116.jpg" },
  { id: 38, src: "/album/IMG_4175.jpg" },
  { id: 39, src: "/album/IMG_4343.jpg" },
  { id: 40, src: "/album/IMG_4699.jpg" },
  { id: 41, src: "/album/IMG_4749.jpg" },
  { id: 42, src: "/album/IMG_4766.jpg" },
  { id: 43, src: "/album/IMG_4777.jpg" },
  { id: 44, src: "/album/IMG_4809.jpg" },
  { id: 45, src: "/album/IMG_4866.jpg" },
  { id: 46, src: "/album/IMG_4929.jpg" },
  { id: 47, src: "/album/IMG_4936.jpg" },
  { id: 48, src: "/album/IMG_5181.jpg" },
  { id: 49, src: "/album/IMG_5210.jpg" },
  { id: 50, src: "/album/IMG_5234.jpg" },
  { id: 51, src: "/album/IMG_5282.jpg" },
  { id: 52, src: "/album/IMG_5322.jpg" },
  { id: 53, src: "/album/IMG_5329.jpg" },
  { id: 54, src: "/album/IMG_5332.jpg" },
  { id: 55, src: "/album/IMG_5334.jpg" },
  { id: 56, src: "/album/IMG_5347.jpg" },
  { id: 57, src: "/album/IMG_5355.jpg" },
  { id: 58, src: "/album/IMG_5356.jpg" },
  { id: 59, src: "/album/IMG_5374.jpg" },
  { id: 60, src: "/album/IMG_5379.jpg" },
  { id: 61, src: "/album/IMG_5441.jpg" },
  { id: 62, src: "/album/IMG_5453.jpg" },
  { id: 63, src: "/album/IMG_5460.jpg" },
  { id: 64, src: "/album/IMG_5499.jpg" },
  { id: 65, src: "/album/IMG_5550.jpg" },
  { id: 66, src: "/album/IMG_5558.jpg" },
  { id: 67, src: "/album/IMG_5562.jpg" },
  { id: 68, src: "/album/IMG_5564.jpg" },
  { id: 69, src: "/album/IMG_5671.jpg" },
  { id: 70, src: "/album/IMG_5869.jpg" },
  { id: 71, src: "/album/IMG_5925.jpg" },
  { id: 72, src: "/album/IMG_6060.jpg" },
  { id: 73, src: "/album/IMG_6065.jpg" },
  { id: 74, src: "/album/IMG_6127.jpg" },
  { id: 75, src: "/album/IMG_6270.jpg" },
  { id: 76, src: "/album/IMG_6365.jpg" },
  { id: 77, src: "/album/IMG_6402.jpg" },
  { id: 78, src: "/album/IMG_6413.jpg" },
  { id: 79, src: "/album/IMG_6429.jpg" },
  { id: 80, src: "/album/IMG_6501.jpg" },
  { id: 81, src: "/album/IMG_6525.jpg" },
  { id: 82, src: "/album/IMG_6642.jpg" },
  { id: 83, src: "/album/IMG_6680.jpg" },
  { id: 84, src: "/album/IMG_6691.jpg" },
  { id: 85, src: "/album/IMG_6790.jpg" },
  { id: 86, src: "/album/IMG_6799.jpg" },
  { id: 87, src: "/album/IMG_6865.jpg" },
  { id: 88, src: "/album/IMG_6875.jpg" },
  { id: 89, src: "/album/IMG_6890.jpg" },
  { id: 90, src: "/album/IMG_6911.jpg" },
  { id: 91, src: "/album/IMG_6952.jpg" },
  { id: 92, src: "/album/IMG_6966.jpg" },
  { id: 93, src: "/album/IMG_6968.jpg" },
  { id: 94, src: "/album/IMG_6979.jpg" },
  { id: 95, src: "/album/IMG_6991.jpg" },
  { id: 96, src: "/album/IMG_7001.jpg" },
  { id: 97, src: "/album/IMG_7021.jpg" },
  { id: 98, src: "/album/IMG_7039.jpg" },
  { id: 99, src: "/album/IMG_7096.jpg" },
  { id: 100, src: "/album/IMG_7099.jpg" },
  { id: 101, src: "/album/IMG_7103.jpg" },
  { id: 102, src: "/album/IMG_7126.jpg" },
  { id: 103, src: "/album/IMG_7156.jpg" },
  { id: 104, src: "/album/IMG_7194.jpg" },
  { id: 105, src: "/album/IMG_7273.jpg" },
  { id: 106, src: "/album/IMG_7296.jpg" },
  { id: 107, src: "/album/IMG_7393.jpg" },
  { id: 108, src: "/album/IMG_7494.jpg" },
  { id: 109, src: "/album/IMG_7575.jpg" },
  { id: 110, src: "/album/IMG_7644.jpg" },
  { id: 111, src: "/album/IMG_7658.jpg" },
  { id: 112, src: "/album/IMG_7660.jpg" },
  { id: 113, src: "/album/IMG_7765.jpg" },
  { id: 114, src: "/album/IMG_7785.jpg" },
  { id: 115, src: "/album/IMG_7953.jpg" },
  { id: 116, src: "/album/IMG_7983.jpg" },
  { id: 117, src: "/album/IMG_8246.jpg" },
  { id: 118, src: "/album/IMG_8254.jpg" },
  { id: 119, src: "/album/IMG_8352.jpg" },
  { id: 120, src: "/album/IMG_8356.jpg" },
  { id: 121, src: "/album/IMG_8378.jpg" },
  { id: 122, src: "/album/IMG_8390.jpg" },
  { id: 123, src: "/album/IMG_8402.jpg" },
  { id: 124, src: "/album/IMG_8467.jpg" },
  { id: 125, src: "/album/IMG_8613.jpg" },
  { id: 126, src: "/album/IMG_8680.jpg" },
  { id: 127, src: "/album/IMG_8760.jpg" },
  { id: 128, src: "/album/IMG_8814.jpg" },
  { id: 129, src: "/album/IMG_8842.jpg" },
  { id: 130, src: "/album/IMG_8856.jpg" },
  { id: 131, src: "/album/fxn 2025-06-17 183643.526.JPG" },
  { id: 132, src: "/album/fxn 2025-06-17 183755.274.JPG" },
  { id: 133, src: "/album/fxn 2025-06-20 171234.554.JPG" },
  { id: 134, src: "/album/fxn 2025-06-22 152536.764.JPG" },
  { id: 135, src: "/album/fxn 2025-06-22 152626.269.JPG" },
];

const ITEMS_PER_PAGE = 12;

// 单张照片组件 - 纯视觉展示
const HangingPhoto = ({
  photo,
  index,
}: {
  photo: (typeof ALBUM_PHOTOS)[0];
  index: number;
}) => {
  const rotation = (index % 3 - 1) * 2;

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % ITEMS_PER_PAGE) * 0.05, duration: 0.5 }}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* 悬挂绳 */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-transparent via-rose-300 to-rose-300" />

      {/* 夹子 */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-rose-300 rounded-sm shadow-sm" />

      {/* 照片容器 */}
      <div
        className="relative bg-white p-3 shadow-md hover:shadow-xl transition-all duration-500 ease-out group-hover:scale-[1.02]"
        style={{ aspectRatio: '4/5' }}
      >
        {/* 照片内容 - 100% 清晰彩色 */}
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={photo.src}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </motion.div>
  );
};

// 分页组件
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex items-center justify-center space-x-4 mt-16">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="flex items-center space-x-1 px-4 py-2 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>上一页</span>
      </button>

      <div className="text-rose-600 font-medium">
        {currentPage} / {totalPages}
      </div>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="flex items-center space-x-1 px-4 py-2 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <span>下一页</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function AlbumPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(ALBUM_PHOTOS.length / ITEMS_PER_PAGE);

  const currentPhotos = ALBUM_PHOTOS.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-white pt-20 pb-12 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 bg-rose-100 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-100 rounded-full blur-3xl" />
      </div>

      {/* 顶部拉线装饰 */}
      <div className="absolute top-28 left-0 right-0 h-px">
        <div className="h-full bg-gradient-to-r from-transparent via-rose-200 to-transparent" />
      </div>

      {/* 内容 */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题区 - 极简 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl font-bold text-rose-800 tracking-wider">
            我们的相册
          </h1>
        </motion.div>

        {/* 照片网格 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 pt-8">
          {currentPhotos.map((photo, index) => (
            <HangingPhoto
              key={photo.id}
              photo={photo}
              index={index}
            />
          ))}
        </div>

        {/* 分页器 */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
