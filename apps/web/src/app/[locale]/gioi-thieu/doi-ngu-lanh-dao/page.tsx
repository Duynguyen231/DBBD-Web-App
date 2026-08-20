import type { Metadata } from 'next'
import Image from "next/image";

export const metadata: Metadata = { title: 'Đội ngũ lãnh đạo | Đường Bộ Bình Định' }

const BOARD_FACTS = [
  {
    label: 'Cơ chế bầu chọn',
    value: 'Đại hội đồng cổ đông bầu Hội đồng Quản trị và Ban Kiểm soát theo từng nhiệm kỳ.',
  },
  {
    label: 'Người đại diện pháp luật',
    value: 'Bà Đoàn Thị Minh Thọ – giữ chức Giám đốc và trực tiếp điều hành mọi hoạt động kinh doanh và kỹ thuật.',
  },
  {
    label: 'Vai trò HĐQT',
    value: 'Định hướng chiến lược, phê duyệt kế hoạch đầu tư, giám sát hoạt động của Ban Giám đốc.',
  },
]

export default function LeadersPage() {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4 space-y-8">
      <header>
        <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Đại hội đồng cổ đông</p>
        <h1 className="text-3xl font-bold text-[var(--primary)] mt-2">Đội ngũ lãnh đạo</h1>
        <p className="mt-3 text-gray-600">
          Bộ máy lãnh đạo được kiện toàn theo từng nhiệm kỳ Đại hội đồng cổ đông. Người điều hành trực tiếp hiện nay là bà Đoàn Thị Minh Thọ
          – Giám đốc kiêm Người đại diện theo pháp luật của công ty.
        </p>
      </header>

      {/* <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 md:p-10">
        <div className="md:flex md:items-center md:gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">Người đại diện pháp luật</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Bà <span className="font-semibold text-gray-900">Đoàn Thị Minh Thọ</span> giữ chức Giám đốc, chịu trách nhiệm điều hành mọi hoạt động kinh doanh,
              kỹ thuật và trực tiếp quản lý các dự án thi công, duy tu đường bộ. Bà đồng thời đại diện công ty ký kết hợp đồng, làm việc với
              cơ quan quản lý nhà nước và phối hợp với các chủ đầu tư.
            </p>
          </div>
          <div className="mt-6 md:mt-0 md:w-72 bg-[var(--primary-50)] rounded-2xl p-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-[var(--primary)] text-white text-3xl font-bold flex items-center justify-center">
              ĐT
            </div>
            <div className="mt-4 font-semibold text-gray-900">Đoàn Thị Minh Thọ</div>
            <div className="text-sm text-[var(--primary)] font-medium">Giám đốc / Legal Representative</div>
          </div>
        </div>
      </div> */}


      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 md:p-10">
        <div className="md:flex md:items-center md:gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">Người đại diện pháp luật</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Bà <span className="font-semibold text-gray-900">Đoàn Thị Minh Thọ</span> giữ chức Giám đốc, chịu trách nhiệm điều hành mọi hoạt động kinh doanh,
              kỹ thuật và trực tiếp quản lý các dự án thi công, duy tu đường bộ. Bà đồng thời đại diện công ty ký kết hợp đồng, làm việc với
              cơ quan quản lý nhà nước và phối hợp với các chủ đầu tư.
            </p>
          </div>
          <div className="mt-6 md:mt-0 md:w-72 bg-[var(--primary-50)] rounded-2xl p-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden">
              <Image
                src="/images/doan-thi-minh-tho.png"
                alt="Đoàn Thị Minh Thọ"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 font-semibold text-gray-900">
              Đoàn Thị Minh Thọ
            </div>
            <div className="text-sm text-[var(--primary)] font-medium">
              Giám đốc / Legal Representative
            </div>
          </div>
        </div>
      </div>



      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Nguyên tắc quản trị</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {BOARD_FACTS.map((fact) => (
            <div key={fact.label} className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <div className="text-sm font-semibold text-[var(--primary)]">{fact.label}</div>
              <p className="mt-2 text-gray-700 text-sm leading-relaxed">{fact.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
