import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Lịch sử hình thành | Đường Bộ Bình Định' }

const SECTIONS = [
  {
    title: 'Khởi nguồn (1998)',
    summary:
      'Tiền thân là đơn vị nhà nước chuyên trách quản lý, bảo trì và duy tu các tuyến đường bộ trên địa bàn tỉnh Bình Định.',
    body: `Công ty bắt đầu hoạt động vào 01/10/1998 với nhiệm vụ quản lý, bảo trì mạng lưới quốc lộ và tỉnh lộ tại Bình Định.`,
  },
  {
    title: 'Cổ phần hóa và chuyển đổi (2006)',
    summary:
      'Thực hiện chủ trương cổ phần hóa doanh nghiệp nhà nước, doanh nghiệp chuyển sang mô hình Công ty Cổ phần vào 26/06/2006.',
    body: `Việc chuyển đổi giúp doanh nghiệp tiếp cận nguồn vốn xã hội hóa, thu hút nhân sự có tay nghề cao và xây dựng cơ chế quản trị linh hoạt hơn.`,
  },
  {
    title: 'Mở rộng năng lực & các dự án trọng điểm',
    summary:
      'Sau gần 3 thập kỷ, công ty trở thành nhà thầu hạ tầng giao thông tổng hợp với năng lực thi công, sản xuất vật liệu và vận hành khai thác.',
    body: `Doanh nghiệp đầu tư trạm trộn bê tông nhựa nóng, mở rộng đội xe máy thi công và thành lập các hạt quản lý đường khu vực. Công ty tham gia nhiều dự án giao thông quy mô lớn và quản lý cao tốc Bắc - Nam đoạn Quảng Ngãi - Hoài Nhơn.`,
  },
]

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-12 h-[2px] bg-white/50" />
            <p className="text-sm uppercase tracking-[0.3em] text-white/80">Hành trình phát triển</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Lịch sử hình thành và phát triển</h1>
          <p className="text-lg text-blue-100 max-w-3xl leading-relaxed">
            Từ một đơn vị nhà nước chuyên trách duy tu tuyến đường bộ tại Bình Định, doanh nghiệp đã không ngừng lớn mạnh để trở thành
            nhà thầu hạ tầng giao thông đa lĩnh vực.
          </p>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden md:block absolute left-[2.5rem] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[var(--primary)] via-[var(--primary-light)] to-gray-200" />

          <div className="space-y-12">
            {SECTIONS.map((section, idx) => (
              <article key={section.title} className="relative">
                {/* Timeline Dot */}
                <div className="hidden md:flex absolute left-0 w-20 h-20 items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white font-bold text-xl flex items-center justify-center shadow-lg ring-4 ring-white">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                </div>

                {/* Content Card */}
                <div className="md:ml-28 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
                  <div className="bg-gradient-to-r from-[var(--primary-50)] to-white p-6 md:p-8">
                    <div className="flex items-start gap-4 mb-4">
                      {/* Mobile Number Badge */}
                      <div className="md:hidden w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white font-bold flex items-center justify-center shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[var(--primary)] transition-colors">
                          {section.title}
                        </h2>
                        <p className="text-[var(--primary)] font-medium leading-relaxed">
                          {section.summary}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 md:p-8 pt-4">
                    <p className="text-gray-700 leading-relaxed text-[15px]">{section.body}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-gradient-to-br from-[var(--primary-50)] to-blue-50 rounded-2xl p-8 md:p-12 border border-[var(--primary)]/10">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Tiếp tục hành trình phát triển</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Với nền tảng vững chắc và kinh nghiệm tích lũy, chúng tôi cam kết tiếp tục đóng góp vào sự phát triển hạ tầng giao thông Việt Nam.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/vi/gioi-thieu" className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[var(--primary-dark)] transition-all shadow-md hover:shadow-lg">
              Về chúng tôi
            </a>
            <a href="/vi/lien-he" className="inline-flex items-center gap-2 bg-white text-[var(--primary)] px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all border-2 border-[var(--primary)]">
              Liên hệ
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
