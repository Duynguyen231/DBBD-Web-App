import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Sứ mệnh - Tầm nhìn | Đường Bộ Bình Định' }

const VALUES = [
  { icon: '🛡️', title: 'An toàn', desc: 'Đảm bảo an toàn giao thông là ưu tiên hàng đầu trong mọi hoạt động.' },
  { icon: '⭐', title: 'Chất lượng', desc: 'Cam kết chất lượng công trình đạt tiêu chuẩn cao nhất.' },
  { icon: '🤝', title: 'Trung thực', desc: 'Minh bạch và trung thực trong mọi giao dịch và hoạt động.' },
  { icon: '🌱', title: 'Bền vững', desc: 'Phát triển bền vững, bảo vệ môi trường và cộng đồng.' },
]

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-12 h-[2px] bg-white/50" />
            <p className="text-sm uppercase tracking-[0.3em] text-white/80">Định hướng phát triển</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Sứ mệnh - Tầm nhìn</h1>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Sứ mệnh - First */}
          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[var(--primary)] to-[var(--primary-dark)]" />
            <div className="p-8 md:p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center text-3xl shadow-lg">
                  🎯
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Sứ mệnh</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                Cung cấp dịch vụ quản lý, bảo trì và xây dựng đường bộ với chất lượng cao, đảm bảo an toàn giao thông, phục vụ tốt nhất nhu cầu đi lại của người dân và phát triển kinh tế - xã hội của tỉnh Bình Định.
              </p>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 italic">Cam kết phục vụ cộng đồng và phát triển bền vững</p>
              </div>
            </div>
          </div>

          {/* Tầm nhìn - Second */}
          <div className="group relative bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
            <div className="relative p-8 md:p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow-lg">
                  🚀
                </div>
                <h2 className="text-3xl font-bold">Tầm nhìn</h2>
              </div>
              <p className="text-blue-50 leading-relaxed text-lg">
                Trở thành đơn vị hàng đầu trong lĩnh vực quản lý, bảo trì và xây dựng đường bộ tại miền Trung Việt Nam, góp phần xây dựng hạ tầng giao thông hiện đại, an toàn và bền vững.
              </p>
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-sm text-blue-100 italic">Hướng tới tương lai phát triển bền vững</p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-[var(--primary)]" />
              <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Giá trị cốt lõi</p>
              <span className="w-8 h-[2px] bg-[var(--primary)]" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Những giá trị chúng tôi theo đuổi</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, idx) => (
              <div 
                key={v.title} 
                className="group relative bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-xl hover:border-[var(--primary)]/30 transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--primary)]/5 rounded-bl-full transition-all group-hover:w-24 group-hover:h-24" />
                <div className="relative">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {v.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-[var(--primary)] transition-colors">
                    {v.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-gradient-to-r from-[var(--primary-50)] via-blue-50 to-[var(--primary-50)] rounded-2xl p-8 md:p-10 border border-[var(--primary)]/10">
            <p className="text-xl md:text-2xl font-semibold text-gray-800 italic mb-2">
              "Xây dựng tương lai - Kết nối hành trình"
            </p>
            <p className="text-gray-600">Công ty CP Quản lý & Xây dựng Đường Bộ Bình Định</p>
          </div>
        </div>
      </div>
    </div>
  )
}
