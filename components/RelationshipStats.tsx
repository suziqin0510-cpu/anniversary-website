'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Heart, Plane, MapPin, Film } from 'lucide-react';
import { calculateDaysTogether } from '@/lib/utils';
import { RELATIONSHIP_CONFIG } from '@/lib/relationship-config';

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
      className="flex flex-col items-center text-center"
    >
      <div className="p-3 bg-white/30 rounded-2xl backdrop-blur-sm border border-white/40 mb-3">
        {icon}
      </div>
      <div className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg mb-1">
        {displayValue.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-white/90 drop-shadow-md">{label}</div>
    </motion.div>
  );
}

export default function RelationshipStats() {
  const days = calculateDaysTogether();

  const stats = [
    { icon: <Heart className="w-6 h-6 text-white" />, value: days, label: '相爱天数', suffix: '' },
    { icon: <Plane className="w-6 h-6 text-white" />, value: RELATIONSHIP_CONFIG.flightMiles, label: '飞行里程', suffix: 'km' },
    { icon: <MapPin className="w-6 h-6 text-white" />, value: RELATIONSHIP_CONFIG.visitedCities, label: '打卡城市', suffix: '个' },
    { icon: <Film className="w-6 h-6 text-white" />, value: RELATIONSHIP_CONFIG.moviesWatched, label: '一起看电影', suffix: '部' },
  ];

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-xl p-6 md:p-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
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
    </div>
  );
}
