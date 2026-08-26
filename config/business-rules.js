/**
 * Medigo Prototype - Configuration & Business Rules
 * Tất cả các con số nghiệp vụ được tập trung tại file này (không hard-code trong giao diện).
 *
 * QUY ƯỚC: file này chỉ chứa SỐ GỐC và HÀM SUY DIỄN từ số gốc.
 * Không lưu giá trị đã tính sẵn (ví dụ tiền hoa hồng từng tầng) để tránh sai lệch khi đổi giá.
 */

const MEDIGO_CONFIG = {
  // Thông tin sản phẩm chính
  product: {
    code: "CN02",
    name: "CN02 - Gói Bác sĩ 24/7 hỗ trợ tư vấn sức khỏe (01 năm + 01 đồng hồ HW01)",
    shortName: "Gói Bác sĩ 24/7 (01 năm + 01 đồng hồ HW01)",
    price: 10000000, // 10.000.000 VNĐ
    currency: "đ",
    stockStatus: "Còn hàng",
    durationDays: 365, // 1 năm tính từ lúc kích hoạt
    expiringSoonDays: 30, // Dưới ngưỡng này thì chuyển trạng thái "Sắp hết hạn"
    storageYears: 10,
    storageSizeMB: 50,

    /**
     * Bộ ảnh giới thiệu gói CN02, lấy từ mock/assets (ảnh gốc của GoCare).
     * Mỗi ảnh 1890x1063 (16:9) nên khung ảnh dùng object-fit: contain —
     * đây là ảnh infographic có chữ, cắt cover sẽ mất nội dung.
     * Tên file gốc có dấu cách và ngoặc nên phải mã hóa URL (%20).
     */
    gallery: [
      { src: "./mock/assets/nc%20(1).png", title: "Theo dõi, quản lý sức khỏe cá nhân",
        alt: "Theo dõi, quản lý sức khỏe cá nhân trên nền tảng GOCARE" },
      { src: "./mock/assets/nc%20(2).png", title: "Thu nhận dữ liệu vào APP",
        alt: "Thu nhận dữ liệu từ thiết bị đo, nhập thủ công và chụp OCR vào ứng dụng" },
      { src: "./mock/assets/nc%20(3).png", title: "Lưu trữ dữ liệu sức khỏe",
        alt: "Lưu trữ dữ liệu sức khỏe 10 năm, dung lượng tối đa 50MB" },
      { src: "./mock/assets/nc%20(4).png", title: "Chia sẻ thông tin sức khỏe online",
        alt: "Chia sẻ dữ liệu sức khỏe với Trung tâm TT247 GOCARE và người thân" },
      { src: "./mock/assets/nc%20(5).png", title: "Cảnh báo và hỗ trợ khẩn cấp (SOS)",
        alt: "Cảnh báo chỉ số bất thường, Callbot gọi người thân và nút SOS trên ứng dụng" },
      { src: "./mock/assets/nc%20(6).png", title: "Theo dõi và chăm sóc sức khỏe từ xa",
        alt: "Trung tâm TT247 GOCARE theo dõi và hỗ trợ sức khỏe từ xa" }
    ]
  },

  // Quy tắc hoa hồng 7 tầng (phần trăm theo giá trị đơn hàng).
  // Số tiền KHÔNG lưu ở đây — dùng MEDIGO_RULES.commissionAmount(level) để tính.
  commissionRates: [
    { level: 1, rate: 0.15 },
    { level: 2, rate: 0.05 },
    { level: 3, rate: 0.03 },
    { level: 4, rate: 0.02 },
    { level: 5, rate: 0.01 },
    { level: 6, rate: 0.01 },
    { level: 7, rate: 0.01 }
  ],

  // Ngưỡng phân hạng thành viên
  memberRanks: [
    { rank: "Đồng", minOrders: 0, maxOrders: 9, badgeClass: "rank-bronze" },
    { rank: "Bạc", minOrders: 10, maxOrders: 49, badgeClass: "rank-silver" },
    { rank: "Vàng", minOrders: 50, maxOrders: Infinity, badgeClass: "rank-gold" }
  ],

  // Quy tắc Rút tiền
  withdrawal: {
    minAmount: 500000, // Tối thiểu 500.000đ mới được rút
    taxRate: 0.10, // Thuế TNCN 10%
    taxThreshold: 2000000, // Chỉ khấu trừ thuế nếu số tiền rút > 2.000.000đ (mẫu)
    estimatedProcessingDays: "1 - 3 ngày làm việc"
  },

  /**
   * Các cổng thanh toán hiển thị ở màn nhận hàng.
   * Lấy đúng theo mockup 26/08 khách đã duyệt (VNPAY · Viettel Money).
   * `brandColor` là màu thương hiệu của đối tác thanh toán — nằm ngoài bảng token
   * của GoCare một cách hợp lệ, giống như logo của họ.
   */
  paymentMethods: [
    { id: 'vnpay',        label: 'Thanh toán bằng VNPAY',         shortLabel: 'VNPAY',         logoText: 'VN',  brandColor: '#005BAA' },
    { id: 'viettelmoney', label: 'Thanh toán bằng Viettel Money', shortLabel: 'Viettel Money', logoText: 'VTM', brandColor: '#EE0033' }
  ],
  defaultPaymentMethod: 'vnpay',

  /**
   * Bộ lọc khoảng thời gian của biểu đồ thống kê trên dashboard seller.
   * Lấy đúng theo mockup 26/08 (RANGES), mặc định 'week'.
   */
  statRanges: [
    { id: 'today',  label: 'Hôm nay' },
    { id: 'week',   label: 'Tuần' },
    { id: 'month',  label: 'Tháng' },
    { id: 'custom', label: 'Tùy chọn' }
  ],
  defaultStatRange: 'week',

  // Cấu hình mã QR & Đếm ngược
  qrPayment: {
    timeoutSeconds: 900, // 15 phút đếm ngược
    warningSeconds: 60,  // Dưới 60s chuyển sang màu cảnh báo --err
    accountName: "CÔNG TY TNHH GIẢI PHÁP CÔNG NGHỆ HUY GIÁP",
    accountNo: "0108294845",
    bankName: "Vietcombank - CN Hà Nội"
  },

  // OTP
  otp: {
    resendSeconds: 30,
    length: 6,
    mockCode: "123456"
  },

  // Thông tin công ty HGTECHS
  company: {
    fullName: "CÔNG TY TNHH GIẢI PHÁP CÔNG NGHỆ HUY GIÁP (HGTECHS CO.,LTD)",
    address: "Liền kề 18, 114 Đường Thanh Bình, Phường Mộ Lao, Quận Hà Đông, TP. Hà Nội",
    phones: ["+84 982466668", "+84 943013331"],
    email: "info@hgtechs.vn",
    license: "Giấy chứng nhận đăng ký kinh doanh số: 0108294845; Ngày cấp: 28/05/2018",
    hotline: "1900 6868"
  },

  // Các danh mục chính sách
  policies: [
    "Chính sách bảo hành",
    "Chính sách đổi trả và hoàn tiền",
    "Quy chế hoạt động website",
    "Chính sách vận chuyển và giao nhận",
    "Chính sách thanh toán",
    "Chính sách bảo mật thông tin",
    "Chính sách kiểm hàng"
  ],

  // Phân trang bảng admin
  admin: {
    pageSize: 10
  },

  // Cấu hình riêng cho bản demo
  demo: {
    // Độ trễ giả lập khi nạp bảng/biểu đồ, để khách nhìn thấy trạng thái "đang tải".
    // Đặt về 0 nếu muốn hiển thị tức thì.
    simulatedLatencyMs: 500
  }
};

/**
 * Các hàm suy diễn từ MEDIGO_CONFIG.
 * Giao diện PHẢI gọi qua đây, không được tự tính hoặc viết số cứng.
 */
const MEDIGO_RULES = {
  /** Tiền hoa hồng của một tầng, theo giá trị đơn hàng (mặc định: giá sản phẩm CN02). */
  commissionAmount: function(level, orderValue) {
    const base = typeof orderValue === 'number' ? orderValue : MEDIGO_CONFIG.product.price;
    const row = MEDIGO_CONFIG.commissionRates.find(r => r.level === level);
    return row ? Math.round(base * row.rate) : 0;
  },

  /** Nhãn hiển thị của một tầng, ví dụ "Tầng 1 (15%)". */
  commissionLabel: function(level) {
    const row = MEDIGO_CONFIG.commissionRates.find(r => r.level === level);
    return row ? `Tầng ${level} (${Math.round(row.rate * 100)}%)` : `Tầng ${level}`;
  },

  /** Tổng tỉ lệ chi ra cho cả 7 tầng — dùng để đối chiếu ngân sách hoa hồng. */
  totalCommissionRate: function() {
    return MEDIGO_CONFIG.commissionRates.reduce((sum, r) => sum + r.rate, 0);
  },

  /** Hạng thành viên suy ra từ số đơn tích lũy. */
  rankFor: function(orderCount) {
    const n = Number(orderCount) || 0;
    const found = MEDIGO_CONFIG.memberRanks.find(r => n >= r.minOrders && n <= r.maxOrders);
    return found || MEDIGO_CONFIG.memberRanks[0];
  },

  /** Class badge tương ứng tên hạng. Không viết ternary màu trong component. */
  rankBadgeClass: function(rankName) {
    const found = MEDIGO_CONFIG.memberRanks.find(r => r.rank === rankName);
    return found ? found.badgeClass : MEDIGO_CONFIG.memberRanks[0].badgeClass;
  },

  /**
   * Tạm tính rút tiền: chỉ khấu trừ thuế khi vượt taxThreshold.
   * Trả về { amount, taxRate, tax, net, taxable }.
   */
  calcWithdrawal: function(amount) {
    const w = MEDIGO_CONFIG.withdrawal;
    const amt = Math.max(0, Math.round(Number(amount) || 0));
    const taxable = amt > w.taxThreshold;
    const tax = taxable ? Math.round(amt * w.taxRate) : 0;
    return { amount: amt, taxRate: w.taxRate, tax: tax, net: amt - tax, taxable: taxable };
  },

  /** Kiểm tra một yêu cầu rút tiền có hợp lệ không. Trả về { ok, message }. */
  validateWithdrawal: function(amount, availableBalance) {
    const w = MEDIGO_CONFIG.withdrawal;
    const amt = Number(amount) || 0;
    if (amt < w.minAmount) {
      return { ok: false, message: `Số tiền rút tối thiểu là ${MEDIGO_RULES.formatMoney(w.minAmount)}.` };
    }
    if (amt > availableBalance) {
      return { ok: false, message: `Số tiền rút vượt quá số dư khả dụng (${MEDIGO_RULES.formatMoney(availableBalance)}).` };
    }
    return { ok: true, message: '' };
  },

  /** Cổng thanh toán theo id. */
  paymentMethod: function(id) {
    return MEDIGO_CONFIG.paymentMethods.find(p => p.id === id)
        || MEDIGO_CONFIG.paymentMethods.find(p => p.id === MEDIGO_CONFIG.defaultPaymentMethod)
        || MEDIGO_CONFIG.paymentMethods[0];
  },

  /** Nhãn của một khoảng thống kê. */
  statRangeLabel: function(id) {
    const r = MEDIGO_CONFIG.statRanges.find(x => x.id === id);
    return r ? r.label : '';
  },

  /** Định dạng tiền: 10.000.000đ */
  formatMoney: function(num) {
    const n = Math.round(Number(num) || 0);
    const sign = n < 0 ? '-' : '';
    return sign + Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + MEDIGO_CONFIG.product.currency;
  },

  /** Ngày dd/mm/yyyy từ đối tượng Date. */
  formatDate: function(date) {
    const d = date instanceof Date ? date : new Date(date);
    const p = (v) => String(v).padStart(2, '0');
    return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
  },

  /** Parse chuỗi dd/mm/yyyy về Date. */
  parseDate: function(str) {
    const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(str || '').trim());
    return m ? new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1])) : null;
  },

  /**
   * Vòng đời mã kích hoạt tính từ ngày kích hoạt.
   * Trả về { activatedDate, expiredDate, daysRemaining, percentUsed, status }.
   */
  activationPeriod: function(activatedDate, today) {
    const start = activatedDate instanceof Date ? activatedDate : MEDIGO_RULES.parseDate(activatedDate);
    if (!start) return null;
    const now = today instanceof Date ? today : new Date();
    const total = MEDIGO_CONFIG.product.durationDays;
    const end = new Date(start.getTime());
    end.setDate(end.getDate() + total);
    const dayMs = 24 * 60 * 60 * 1000;
    const daysRemaining = Math.max(0, Math.ceil((end - now) / dayMs));
    const percentUsed = Math.min(100, Math.max(0, Math.round(((total - daysRemaining) / total) * 100)));
    let status = 'Đã kích hoạt';
    if (daysRemaining <= 0) status = 'Hết hạn';
    else if (daysRemaining <= MEDIGO_CONFIG.product.expiringSoonDays) status = 'Sắp hết hạn';
    return {
      activatedDate: MEDIGO_RULES.formatDate(start),
      expiredDate: MEDIGO_RULES.formatDate(end),
      daysRemaining: daysRemaining,
      percentUsed: percentUsed,
      status: status
    };
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MEDIGO_CONFIG, MEDIGO_RULES };
}
