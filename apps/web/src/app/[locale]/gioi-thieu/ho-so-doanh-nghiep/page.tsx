import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hồ sơ doanh nghiệp | Đường Bộ Bình Định',
}

export default async function CompanyProfilePage() {
  const t = await getTranslations('nav')

  const summaryCards = [
    { label: 'Mã số thuế', value: '4100259388' },
    { label: 'Tình trạng', value: 'Đang hoạt động' },
    { label: 'Ngày hoạt động', value: '01/10/1998' },
    { label: 'Ngành nghề chính', value: 'Xây dựng công trình đường bộ' },
  ]

  const generalInfo = [
    { label: 'Tên đầy đủ', value: 'CÔNG TY CỔ PHẦN QUẢN LÝ VÀ XÂY DỰNG ĐƯỜNG BỘ BÌNH ĐỊNH' },
    { label: 'Tên quốc tế', value: 'BINH DINH ROAD MANAGEMENT AND CONSTRUCTION JOINT STOCK COMPANY' },
    { label: 'Tên viết tắt', value: 'CTY CỔ PHẦN QL&XD ĐB BÌNH ĐỊNH' },
    { label: 'Địa chỉ thuế', value: 'Lô OTM12-13 Khu đô thị Long Vân, Phường Quy Nhơn Bắc, Tỉnh Gia Lai, Việt Nam' },
    { label: 'Địa chỉ trụ sở', value: 'Lô OTM12-13 Khu đô thị Long Vân, Phường Quy Nhơn Bắc, Tỉnh Gia Lai, Việt Nam' },
    { label: 'Người đại diện', value: 'ĐOÀN THỊ MINH THỌ' },
    { label: 'Quản lý bởi', value: 'Cục Thuế tỉnh Gia Lai' },
    { label: 'Loại hình doanh nghiệp', value: 'Công ty cổ phần' },
    { label: 'Cập nhật thuế', value: '01/04/2026 13:37:02' },
  ]

  const industries = [
    { code: '0810', name: 'Khai thác đá, cát, sỏi, đất sét', detail: 'Khai thác đá, cát, sỏi làm vật liệu xây dựng thông thường' },
    { code: '2395', name: 'Sản xuất bê tông và các sản phẩm từ xi măng và thạch cao', detail: 'Sản xuất bê tông nhựa nóng và bê tông xi măng thương phẩm' },
    { code: '3320', name: 'Lắp đặt máy móc và thiết bị công nghiệp' },
    { code: '3511', name: 'Sản xuất điện', detail: 'Sản xuất điện mặt trời' },
    { code: '3530', name: 'Sản xuất, phân phối hơi nước, nước nóng, điều hoà không khí và sản xuất nước đá', detail: 'Sản xuất nước đá' },
    { code: '4101', name: 'Xây dựng nhà để ở' },
    { code: '4102', name: 'Xây dựng nhà không để ở' },
    { code: '4211', name: 'Xây dựng công trình đường sắt' },
    { code: '4212', name: 'Xây dựng công trình đường bộ' },
    { code: '4221', name: 'Xây dựng công trình điện' },
    { code: '4222', name: 'Xây dựng công trình cấp, thoát nước' },
    { code: '4223', name: 'Xây dựng công trình viễn thông, thông tin liên lạc' },
    { code: '4229', name: 'Xây dựng công trình công ích khác' },
    { code: '4291', name: 'Xây dựng công trình thủy' },
    { code: '4311', name: 'Phá dỡ' },
    { code: '4312', name: 'Chuẩn bị mặt bằng' },
    { code: '4330', name: 'Hoàn thiện công trình xây dựng' },
    { code: '4390', name: 'Hoạt động xây dựng chuyên dụng khác' },
    { code: '4511', name: 'Bán buôn ô tô và xe có động cơ khác' },
    { code: '4520', name: 'Bảo dưỡng, sửa chữa ô tô và xe có động cơ khác' },
    { code: '4530', name: 'Bán phụ tùng và các bộ phận phụ trợ của ô tô và xe có động cơ khác' },
    { code: '4659', name: 'Bán buôn máy móc, thiết bị và phụ tùng máy khác' },
    { code: '4663', name: 'Bán buôn vật liệu, thiết bị lắp đặt khác trong xây dựng' },
    { code: '4730', name: 'Bán lẻ nhiên liệu động cơ trong các cửa hàng chuyên doanh', detail: 'Bán lẻ xăng dầu và các sản phẩm liên quan' },
    { code: '4932', name: 'Vận tải hành khách đường bộ khác', detail: 'Kinh doanh vận tải hành khách bằng ô tô theo hợp đồng' },
    { code: '4933', name: 'Vận tải hàng hóa bằng đường bộ', detail: 'Vận tải hàng hóa bằng ô tô chuyên dùng' },
    { code: '5210', name: 'Kho bãi và lưu giữ hàng hóa' },
    { code: '5225', name: 'Hoạt động dịch vụ hỗ trợ trực tiếp cho vận tải đường bộ', detail: 'Dịch vụ lưu giữ xe ô tô các loại' },
    { code: '5510', name: 'Dịch vụ lưu trú ngắn ngày' },
    { code: '5610', name: 'Nhà hàng và các dịch vụ ăn uống phục vụ lưu động' },
    { code: '7730', name: 'Cho thuê máy móc, thiết bị và đồ dùng hữu hình khác', detail: 'Cho thuê máy móc, thiết bị công trình' },
    { code: '7830', name: 'Cung ứng và quản lý nguồn lao động', detail: 'Cung ứng và quản lý nguồn lao động trong nước' },
  ]

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 space-y-10">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-gray-400">{t('about')}</p>
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mt-2">
          CÔNG TY CỔ PHẦN QUẢN LÝ VÀ XÂY DỰNG ĐƯỜNG BỘ BÌNH ĐỊNH
        </h1>
        <p className="mt-4 text-gray-600 max-w-3xl">
          Đơn vị nòng cốt trong công tác quản lý, vận hành và phát triển các tuyến giao thông huyết mạch của khu vực
          Bình Định – Gia Lai, đồng thời mở rộng lĩnh vực hoạt động sang xây dựng hạ tầng, năng lượng sạch và dịch vụ hỗ
          trợ công nghiệp.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="p-5 rounded-2xl border border-gray-100 shadow-sm bg-white">
            <div className="text-xs uppercase tracking-wide text-gray-500">{card.label}</div>
            <div className="mt-2 text-lg font-semibold text-gray-900">{card.value}</div>
          </div>
        ))}
      </div>

      <section className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 md:p-10">
        <div className="md:flex md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Hồ sơ doanh nghiệp</h2>
            <p className="mt-1 text-gray-500">Thông tin pháp lý và điều hành cập nhật đến 01/04/2026.</p>
          </div>
          <a
            href="https://masothue.com/Search/?s=4100259388"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)] text-white text-sm font-semibold"
          >
            Tra cứu mã số thuế
          </a>
        </div>
        <dl className="mt-8 grid md:grid-cols-2 gap-x-10 gap-y-6">
          {generalInfo.map((info) => (
            <div key={info.label}>
              <dt className="text-sm font-medium text-gray-500">{info.label}</dt>
              <dd className="mt-1 text-gray-900 font-semibold">{info.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Lĩnh vực kinh doanh</h2>
          <p className="text-sm text-gray-500">Tổng hợp theo hệ thống ngành kinh tế Việt Nam (VSIC).</p>
        </div>
        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--primary-50)] text-gray-600 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-4 py-3">Mã</th>
                <th className="px-4 py-3">Ngành nghề</th>
                <th className="px-4 py-3">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {industries.map((industry, idx) => (
                <tr key={industry.code} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/70'}>
                  <td className="px-4 py-3 font-semibold text-gray-900">{industry.code}</td>
                  <td className="px-4 py-3 text-gray-800">{industry.name}</td>
                  <td className="px-4 py-3 text-gray-600 text-sm">{industry.detail || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Khám phá thêm</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {['Phần mềm quản lý doanh nghiệp', 'Sách về luật doanh nghiệp', 'Bảo hiểm cho doanh nghiệp'].map((item) => (
            <div key={item} className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="text-sm font-semibold text-gray-900">{item}</div>
              <p className="mt-1 text-sm text-gray-500">Liên hệ bộ phận tư vấn để được hỗ trợ giải pháp phù hợp.</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
