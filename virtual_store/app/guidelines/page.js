'use client';

import Link from 'next/link';

export default function ProcessAndRegulations() {
  const styles = {
    navyBg: "bg-[#23355b]",
    navyText: "text-[#23355b]",
    purpleBrand: "text-[#a855f7]",
    greenBrand: "text-[#22c55e]",
    cardBg: "bg-white",
  };

  const steps = [
    { title: "List Your Item", desc: "Upload clear photos and set a fair price for your lab equipment or books." },
    { title: "Campus Meetup", desc: "Meet the buyer at a safe CUET campus location like the Central Library or Cafeteria." },
    { title: "Finalize Sale", desc: "Verify the product, receive payment via Cash or Bkash, and hand over the item." }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      {/* Hero Section */}
      <header className={`${styles.navyBg} text-white py-24 px-6 text-center shadow-2xl`}>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">How It Works</h1>
        <p className="text-blue-100/70 text-xl max-w-2xl mx-auto font-medium">
          Simple steps for a sustainable CUET campus.
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-6 -mt-16 pb-24">
        {/* The Process Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {steps.map((step, index) => (
            <div key={index} className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 text-center relative overflow-hidden group">
              <span className="absolute -top-4 -right-4 text-9xl font-black text-slate-50 group-hover:text-purple-50 transition-colors">
                {index + 1}
              </span>
              <div className="relative z-10">
                <h3 className={`text-2xl font-black ${styles.navyText} mb-4`}>{step.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Regulations / Safety Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="bg-[#23355b] text-white p-12 rounded-[3rem] shadow-2xl">
            <h2 className="text-3xl font-black mb-8 border-b border-white/10 pb-4">Campus Regulations</h2>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <span className="w-6 h-6 rounded-full bg-[#22c55e] flex-shrink-0 mt-1"></span>
                <p className="font-medium text-blue-50">Only verified CUET students, staff, and teachers can list products.</p>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-6 h-6 rounded-full bg-[#22c55e] flex-shrink-0 mt-1"></span>
                <p className="font-medium text-blue-50">Illegal items, harmful substances, or fake products are strictly prohibited.</p>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-6 h-6 rounded-full bg-[#22c55e] flex-shrink-0 mt-1"></span>
                <p className="font-medium text-blue-50">Sellers must provide accurate descriptions and real photos of the items.</p>
              </li>
            </ul>
          </div>

          <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl">
            <h2 className={`text-3xl font-black ${styles.navyText} mb-8 border-b border-slate-100 pb-4`}>Safety Guidelines</h2>
            <div className="space-y-8">
              <div>
                <h4 className={`text-lg font-black ${styles.purpleBrand} mb-2`}>Public Meetings</h4>
                <p className="text-slate-500 font-medium italic">Always trade during daylight in crowded campus areas (e.g., Gol Chattar or Dept. Corridors).</p>
              </div>
              <div>
                <h4 className={`text-lg font-black ${styles.purpleBrand} mb-2`}>Payment Security</h4>
                <p className="text-slate-500 font-medium italic">We recommend checking the item thoroughly before making any digital or cash payment.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
            <Link href="/searchProduct" className={`inline-block py-5 px-12 ${styles.navyBg} text-white font-black text-lg rounded-2xl hover:bg-[#a855f7] transition-all shadow-2xl`}>
                Start Browsing CUET Listings
            </Link>
        </div>
      </main>
    </div>
  );
}