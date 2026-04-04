'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Heart, Calendar, Film, Utensils, MapPin, Moon, Footprints, Smile } from 'lucide-react';
import { calculateDaysTogether, NAMES } from '@/lib/utils';

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
  delay?: number;
}

function StatItem({ icon, value, label, suffix = '', delay = 0 }: StatItemProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 2,
      delay: delay,
      ease: 'easeOut',
    });

    const unsubscribe = rounded.on('change', (v) => setDisplayValue(v));

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [count, value, delay, rounded]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-3 bg-[#E8A598]/10 rounded-xl">
          {icon}
        </div>
      </div>
      <div className="text-4xl font-light text-[#2D2D2D] mb-1">
        {displayValue.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-[#6B6B6B]">{label}</div>
    </motion.div>
  );
}

export default function StatsPage() {
  const days = calculateDaysTogether();

  const stats = [
    { icon: <Heart className="w-6 h-6 text-[#E8A598]" />, value: days, label: '恋爱天数', suffix: '' },
    { icon: <Calendar className="w-6 h-6 text-[#E8A598]" />, value: Math.floor(days / 7), label: '约会次数', suffix: '' },
    { icon: <Film className="w-6 h-6 text-[#E8A598]" />, value: 12, label: '一起看电影', suffix: '部' },
    { icon: <Utensils className="w-6 h-6 text-[#E8A598]" />, value: 48, label: '打卡餐厅', suffix: '家' },
    { icon: <MapPin className="w-6 h-6 text-[#E8A598]" />, value: 3, label: '去过的城市', suffix: '个' },
    { icon: <Moon className="w-6 h-6 text-[#E8A598]" />, value: days, label: '互道晚安', suffix: '次' },
    { icon: <Footprints className="w-6 h-6 text-[#E8A598]" />, value: 1286, label: '累计步行', suffix: 'km' },
    { icon: <Smile className="w-6 h-6 text-[#E8A598]" />, value: 365, label: '最开心的一天', suffix: '' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFAF8] to-[#FFF8F5] pt-24 pb-12">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Heart className="w-8 h-8 text-[#E8A598] mx-auto mb-4 fill-[#E8A598]" />
          <h1 className="text-4xl md:text-5xl font-light text-[#2D2D2D] mb-4">
            恋爱数据
          </h1>
          <p className="text-[#6B6B6B] max-w-2xl mx-auto">
            用数字记录我们的爱情故事
          </p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Special Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-block p-8 bg-gradient-to-r from-[#E8A598]/10 to-[#D4AF37]/10 rounded-3xl">
            <Heart className="w-6 h-6 text-[#E8A598] mx-auto mb-4 fill-[#E8A598]" />
            <p className="text-lg text-[#2D2D2D] italic">
              "{NAMES.boy} 和 {NAMES.girl} 的故事，"
            </p>
            <p className="text-lg text-[#2D2D2D] italic">
              "还在继续..."
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
