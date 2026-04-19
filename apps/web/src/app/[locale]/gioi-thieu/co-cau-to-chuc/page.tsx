import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Cơ cấu tổ chức | Đường Bộ Bình Định' }

const FUNCTIONAL_DEPTS = [
  {
    name: 'Phòng Kế hoạch - Kỹ thuật',
    desc: 'Lập hồ sơ dự thầu, tổ chức thi công, giám sát chất lượng và nghiệm thu công trình.',
  },
  {
    name: 'Phòng Kế toán - Tài chính',
    desc: 'Quản lý dòng tiền, quyết toán vật tư, chi phí nhân công và báo cáo tài chính.',
  },
  {
    name: 'Phòng Tổ chức - Hành chính',
    desc: 'Quản trị nhân sự, đào tạo, hồ sơ lao động, trang thiết bị và công tác hành chính.',
  },
]

const FIELD_UNITS = [
  'Các Hạt/Đội quản lý đường bộ (tuần đường, duy tu, sửa chữa thường xuyên).',
  'Đội thi công công trình (máy đào, lu, ủi, xe tưới nhựa...).',
  'Trạm sản xuất vật liệu (trạm trộn bê tông nhựa nóng, mỏ khai thác vật liệu).',
]

export default function OrgPage() {
  return (
    <div className="py-12 max-w-5xl mx-auto px-4 space-y-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Mô hình vận hành</p>
        <h1 className="text-3xl font-bold text-[var(--primary)]">Cơ cấu tổ chức</h1>
        <p className="text-gray-600">
          Thiết kế theo mô hình chuẩn của doanh nghiệp cổ phần trong lĩnh vực thi công và quản lý hạ tầng giao thông, đảm bảo phân quyền rõ
          ràng giữa cơ quan chủ sở hữu, bộ máy quản trị và các đơn vị điều hành trực tiếp.
        </p>
      </header>

      <section className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 md:p-10 space-y-6">
        <div className="text-center">
          <div className="inline-block bg-[var(--primary)] text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg">
            Đại hội đồng Cổ đông
          </div>
          <p className="mt-3 text-sm text-gray-500">Cơ quan quyền lực cao nhất gồm toàn bộ cổ đông có quyền biểu quyết.</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="w-0.5 h-6 bg-[var(--primary)]" />
          <div className="px-6 py-3 rounded-full border border-[var(--primary-200)] text-sm font-semibold text-[var(--primary-dark)]">
            Bầu chọn & giám sát
          </div>
          <div className="w-0.5 h-6 bg-[var(--primary)]" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-[var(--primary-100)] bg-[var(--primary-50)]">
            <h2 className="text-lg font-semibold text-[var(--primary-dark)]">Hội đồng Quản trị (HĐQT)</h2>
            <p className="mt-2 text-sm text-gray-700">
              Do Đại hội đồng cổ đông bầu ra, chịu trách nhiệm quản trị, quyết sách chiến lược, phê duyệt đầu tư và giám sát hoạt động điều hành.
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-[var(--primary-100)] bg-[var(--primary-50)]">
            <h2 className="text-lg font-semibold text-[var(--primary-dark)]">Ban Giám đốc</h2>
            <p className="mt-2 text-sm text-gray-700">
              Đứng đầu là Giám đốc (Bà Đoàn Thị Minh Thọ) cùng các Phó Giám đốc, chịu trách nhiệm điều hành hoạt động SXKD hằng ngày.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Các phòng ban chức năng</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {FUNCTIONAL_DEPTS.map((dept) => (
            <div key={dept.name} className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <div className="text-sm font-semibold text-[var(--primary)]">{dept.name}</div>
              <p className="mt-2 text-gray-700 text-sm leading-relaxed">{dept.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Khối đơn vị trực thuộc</h2>
        <div className="space-y-3">
          {FIELD_UNITS.map((item, idx) => (
            <div key={item} className="flex items-start gap-3 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-[var(--primary-50)] text-[var(--primary)] font-semibold flex items-center justify-center">
                {idx + 1}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
