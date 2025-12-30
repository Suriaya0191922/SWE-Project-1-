'use client';

import Link from 'next/link';

export default function AboutUs() {
  const styles = {
    navyBg: "bg-[#23355b]",
    navyText: "text-[#23355b]",
    purpleText: "text-[#a855f7]",
    greenAccent: "bg-[#22c55e]",
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <header className={`${styles.navyBg} text-white py-24 px-6 text-center shadow-xl`}>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">By CUETians, For CUETians</h1>
        <p className="text-blue-100/70 text-xl max-w-3xl mx-auto font-medium">
          The official second-hand marketplace for students, teachers, and staff of Chittagong University of Engineering and Technology.
        </p>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className={`text-4xl font-black ${styles.navyText} mb-6 leading-tight`}>
              Sustainable Campus <br/><span className={styles.purpleText}>Shopping</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              ThriftStore is designed specifically for the CUET community. We provide a secure and professional platform where students can pass on their lab equipment, hostel essentials, and books to juniors, and where staff and teachers can list quality pre-loved items.
            </p>
            <div className="flex gap-4">
              <div className="flex flex-col">
                <span className={`text-3xl font-black ${styles.navyText}`}>5k+</span>
                <span className="text-slate-400 text-sm font-bold uppercase">Community Members</span>
              </div>
              <div className="w-px h-12 bg-slate-200 mx-4"></div>
              <div className="flex flex-col">
                <span className={`text-3xl font-black ${styles.navyText}`}>CUET</span>
                <span className="text-slate-400 text-sm font-bold uppercase">Exclusive Access</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="p-8 border border-slate-100 rounded-[2.5rem] bg-slate-50 shadow-sm hover:shadow-md transition-shadow">
              <h3 className={`text-xl font-bold ${styles.navyText} mb-2`}>Our Mission</h3>
              <p className="text-slate-500 text-sm">To reduce the financial burden on students while promoting a zero-waste culture across the CUET campus.</p>
            </div>
            <div className="p-8 border border-slate-100 rounded-[2.5rem] bg-slate-50 shadow-sm hover:shadow-md transition-shadow">
              <h3 className={`text-xl font-bold ${styles.navyText} mb-2`}>Our Vision</h3>
              <p className="text-slate-500 text-sm">Becoming the primary hub for resource sharing among the engineers and educators of tomorrow.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}