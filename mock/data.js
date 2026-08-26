/**
 * Medigo Prototype - Mock Data & State Management
 *
 * MEDIGO_SEED  = dữ liệu mẫu gốc, chỉ dùng để khởi tạo lần đầu.
 * MedigoStore  = nguồn dữ liệu DUY NHẤT mà giao diện được phép đọc/ghi.
 *
 * Giao diện KHÔNG được đọc thẳng MEDIGO_SEED, nếu không mọi thao tác của người dùng
 * (kích hoạt mã, gửi yêu cầu rút tiền, duyệt/từ chối, khóa tài khoản) sẽ không lưu lại
 * và bản demo sẽ "bấm xong không thấy gì đổi".
 */

const MEDIGO_SEED = {
  // Seller hiện tại đang thao tác
  currentSeller: {
    aff_id: "923983",
    fullName: "Nguyễn Văn A",
    shortName: "Nguyễn V. A",
    phone: "0908123456",
    maskedPhone: "090•••456",
    email: "nguyenvana@gmail.com",
    maskedEmail: "nguyen•••@gmail.com",
    cccd: "001092001234",
    maskedCccd: "001092••••34",
    address: "123 Nguyễn Trãi, Phường Thanh Xuân Trung, Quận Thanh Xuân, Hà Nội",
    city: "Hà Nội",
    district: "Quận Thanh Xuân",
    ward: "Phường Thanh Xuân Trung",
    dob: "15/08/1978",
    gender: "Nam",
    totalOrders: 128,
    totalPoints: 3420,
    availableBalance: 4850000,
    bankName: "Vietcombank",
    bankAccountNo: "0123456789",
    maskedBankAccountNo: "0123•••789",
    bankAccountOwner: "NGUYEN VAN A",
    joinDate: "10/01/2026",
    status: "Đang hoạt động"
    // rank: KHÔNG lưu ở đây — suy ra từ totalOrders qua MEDIGO_RULES.rankFor()
  },

  // Giỏ hàng
  cart: [
    { code: "CN02", qty: 1 }
  ],

  // Xu hướng hoa hồng 7 ngày gần nhất (A10)
  commissionTrend7Days: [
    { day: "T4 (20/08)", amount: 300000 },
    { day: "T5 (21/08)", amount: 1500000 },
    { day: "T6 (22/08)", amount: 800000 },
    { day: "T7 (23/08)", amount: 2000000 },
    { day: "CN (24/08)", amount: 500000 },
    { day: "T2 (25/08)", amount: 1200000 },
    { day: "Hôm nay", amount: 1500000 }
  ],

  // Danh sách tổng hợp tuyến dưới 7 tầng của Seller 923983 (A10)
  // Quy định: CHỈ hiển thị tên viết tắt, ngày tham gia, số đơn (KHÔNG lộ SĐT, email)
  downlineTiers: [
    {
      level: 1,
      memberCount: 15,
      totalOrders: 42,
      members: [
        { shortName: "Trần T. B", joinDate: "12/01/2026", orderCount: 8 },
        { shortName: "Phạm V. C", joinDate: "15/01/2026", orderCount: 5 },
        { shortName: "Lê T. D", joinDate: "20/01/2026", orderCount: 3 },
        { shortName: "Hoàng V. E", joinDate: "02/02/2026", orderCount: 12 },
        { shortName: "Vũ T. F", joinDate: "10/02/2026", orderCount: 14 }
      ]
    },
    {
      level: 2,
      memberCount: 28,
      totalOrders: 35,
      members: [
        { shortName: "Đỗ V. G", joinDate: "18/01/2026", orderCount: 4 },
        { shortName: "Ngô T. H", joinDate: "25/01/2026", orderCount: 6 },
        { shortName: "Đặng V. K", joinDate: "05/02/2026", orderCount: 9 }
      ]
    },
    {
      level: 3,
      memberCount: 32,
      totalOrders: 20,
      members: [
        { shortName: "Bùi T. L", joinDate: "01/02/2026", orderCount: 2 },
        { shortName: "Dương V. M", joinDate: "12/02/2026", orderCount: 5 }
      ]
    },
    {
      level: 4,
      memberCount: 18,
      totalOrders: 12,
      members: [
        { shortName: "Lý T. N", joinDate: "08/02/2026", orderCount: 3 }
      ]
    },
    {
      level: 5,
      memberCount: 10,
      totalOrders: 8,
      members: [
        { shortName: "Đinh V. P", joinDate: "14/02/2026", orderCount: 2 }
      ]
    },
    {
      level: 6,
      memberCount: 5,
      totalOrders: 4,
      members: [
        { shortName: "Mai T. Q", joinDate: "20/02/2026", orderCount: 1 }
      ]
    },
    {
      level: 7,
      memberCount: 2,
      totalOrders: 2,
      members: [
        { shortName: "Trịnh V. R", joinDate: "22/02/2026", orderCount: 1 }
      ]
    }
  ],

  // Lịch sử đơn hàng & hoa hồng của Seller (A10)
  // level là SỐ — tiền hoa hồng suy ra qua MEDIGO_RULES.commissionAmount(level)
  sellerCommissionHistory: [
    { id: "10234", product: "CN02 - Gói Bác sĩ 24/7", date: "26/08/2026", level: 1, status: "Chờ duyệt" },
    { id: "10210", product: "CN02 - Gói Bác sĩ 24/7", date: "25/08/2026", level: 2, status: "Đã duyệt" },
    { id: "10195", product: "CN02 - Gói Bác sĩ 24/7", date: "23/08/2026", level: 1, status: "Đã chi trả" },
    { id: "10180", product: "CN02 - Gói Bác sĩ 24/7", date: "20/08/2026", level: 3, status: "Đã chi trả" },
    { id: "10150", product: "CN02 - Gói Bác sĩ 24/7", date: "15/08/2026", level: 1, status: "Đã chi trả" }
  ],

  // Đơn hàng & Mã kích hoạt của Khách hàng (A13)
  customerOrders: [
    {
      orderId: "MDG-88492",
      productName: "CN02 - Gói Bác sĩ 24/7 (01 năm + 01 đồng hồ HW01)",
      price: 10000000,
      orderDate: "26/08/2026",
      shipping: {
        currentStep: 3, // 1 Chờ đóng gói · 2 Đã gửi hàng · 3 Đang giao · 4 Đã nhận máy
        trackingCode: "VNPOST-883920192",
        carrier: "VNPost Chuyển phát nhanh"
      },
      activationKey: {
        code: "GOCARE-CN02-9982-4410",
        activated: false,
        activatedDate: null
      }
    },
    {
      orderId: "MDG-77102",
      productName: "CN02 - Gói Bác sĩ 24/7 (01 năm + 01 đồng hồ HW01)",
      price: 10000000,
      orderDate: "10/01/2026",
      shipping: {
        currentStep: 4,
        trackingCode: "GHN-99812401",
        carrier: "Giao Hàng Nhanh"
      },
      activationKey: {
        code: "GOCARE-CN02-1102-8839",
        activated: true,
        activatedDate: "12/01/2026"
      }
    },
    {
      orderId: "MDG-66012",
      productName: "CN02 - Gói Bác sĩ 24/7 (01 năm + 01 đồng hồ HW01)",
      price: 10000000,
      orderDate: "15/09/2025",
      shipping: {
        currentStep: 4,
        trackingCode: "VTPOST-112049",
        carrier: "Viettel Post"
      },
      activationKey: {
        code: "GOCARE-CN02-0044-1299",
        activated: true,
        activatedDate: "20/09/2025" // hết hạn 20/09/2026 -> "Sắp hết hạn" ở mốc 26/08/2026
      }
    }
  ],

  // Danh sách thành viên Admin quản lý (B2)
  adminMembers: [
    {
      aff_id: "923983",
      fullName: "Nguyễn Văn A",
      phone: "0908123456",
      maskedPhone: "090•••456",
      email: "nguyenvana@gmail.com",
      cccd: "001092001234",
      sponsorAffId: "881204",
      joinDate: "10/01/2026",
      status: "Đang hoạt động",
      bankName: "Vietcombank",
      bankAccountNo: "0123456789",
      bankAccountOwner: "NGUYEN VAN A",
      totalOrders: 128,
      downline: [
        { level: 1, shortName: "Trần T. B", orderCount: 8, children: [{ level: 2, shortName: "Đỗ V. G", orderCount: 4 }] },
        { level: 1, shortName: "Hoàng V. E", orderCount: 12, children: [] }
      ]
    },
    {
      aff_id: "881204",
      fullName: "Trần Thị Minh",
      phone: "0912345678",
      maskedPhone: "091•••678",
      email: "tranminh@gmail.com",
      cccd: "001085004321",
      sponsorAffId: "770192",
      joinDate: "01/11/2025",
      status: "Đang hoạt động",
      bankName: "BIDV",
      bankAccountNo: "88192039401",
      bankAccountOwner: "TRAN THI MINH",
      totalOrders: 210,
      downline: [
        { level: 1, shortName: "Nguyễn V. A", orderCount: 128, children: [{ level: 2, shortName: "Phạm Q. T", orderCount: 4 }] }
      ]
    },
    {
      aff_id: "770192",
      fullName: "Lê Hoàng Long",
      phone: "0987654321",
      maskedPhone: "098•••321",
      email: "longle@gmail.com",
      cccd: "034091008877",
      sponsorAffId: "",
      joinDate: "05/05/2025",
      status: "Đang hoạt động",
      bankName: "Techcombank",
      bankAccountNo: "190388291029",
      bankAccountOwner: "LE HOANG LONG",
      totalOrders: 540,
      downline: [
        { level: 1, shortName: "Trần T. M", orderCount: 210, children: [{ level: 2, shortName: "Nguyễn V. A", orderCount: 128 }] }
      ]
    },
    {
      aff_id: "934812",
      fullName: "Phạm Quốc Tuấn",
      phone: "0934567890",
      maskedPhone: "093•••890",
      email: "tuanpham@gmail.com",
      cccd: "025090001122",
      sponsorAffId: "923983",
      joinDate: "15/02/2026",
      status: "Đã khóa",
      bankName: "MBBank",
      bankAccountNo: "0934567890",
      bankAccountOwner: "PHAM QUOC TUAN",
      totalOrders: 4,
      downline: []
    }
  ],

  // Yêu cầu rút tiền Admin quản lý (B3)
  // tax/netAmount KHÔNG lưu — suy ra qua MEDIGO_RULES.calcWithdrawal(amount)
  adminWithdrawals: [
    {
      id: "WD-1092",
      sellerAffId: "923983",
      sellerName: "Nguyễn Văn A",
      amount: 3000000,
      requestDate: "26/08/2026 - 14:30",
      bankName: "Vietcombank",
      bankAccountNo: "0123456789",
      bankAccountOwner: "NGUYEN VAN A",
      branch: "Chi nhánh Hà Nội",
      status: "Chờ duyệt", // Chờ duyệt | Đã duyệt | Đã chi trả | Từ chối
      rejectReason: ""
    },
    {
      id: "WD-1088",
      sellerAffId: "881204",
      sellerName: "Trần Thị Minh",
      amount: 5000000,
      requestDate: "25/08/2026 - 09:15",
      bankName: "BIDV",
      bankAccountNo: "88192039401",
      bankAccountOwner: "TRAN THI MINH",
      branch: "Chi nhánh Cầu Giấy",
      status: "Đã duyệt",
      rejectReason: ""
    },
    {
      id: "WD-1075",
      sellerAffId: "770192",
      sellerName: "Lê Hoàng Long",
      amount: 10000000,
      requestDate: "20/08/2026 - 16:45",
      bankName: "Techcombank",
      bankAccountNo: "190388291029",
      bankAccountOwner: "LE HOANG LONG",
      branch: "Chi nhánh Đông Đô",
      status: "Đã chi trả",
      rejectReason: ""
    },
    {
      id: "WD-1060",
      sellerAffId: "934812",
      sellerName: "Phạm Quốc Tuấn",
      amount: 1000000,
      requestDate: "18/08/2026 - 11:20",
      bankName: "MBBank",
      bankAccountNo: "0934567890",
      bankAccountOwner: "PHAM QUOC TUAN",
      branch: "Chi nhánh Hà Đông",
      status: "Từ chối",
      rejectReason: "Thông tin chủ tài khoản ngân hàng không khớp với hồ sơ CCCD"
    }
  ]
};

/**
 * Kho dữ liệu chạy (LocalStorage). Giao diện chỉ nói chuyện với đối tượng này.
 */
const MedigoStore = {
  PREFIX: 'MEDIGO_',
  // Tăng số này mỗi khi đổi cấu trúc dữ liệu để trình duyệt cũ nạp lại seed,
  // tránh trường hợp localStorage giữ dữ liệu theo schema cũ gây lỗi render.
  SCHEMA_VERSION: 2,

  // Các khóa được seed từ MEDIGO_SEED khi khởi tạo
  SEEDED_KEYS: [
    'currentSeller', 'cart', 'commissionTrend7Days', 'downlineTiers',
    'sellerCommissionHistory', 'customerOrders', 'adminMembers', 'adminWithdrawals'
  ],

  get: function(key, defaultVal) {
    try {
      const item = localStorage.getItem(this.PREFIX + key);
      return item !== null ? JSON.parse(item) : defaultVal;
    } catch (e) {
      return defaultVal;
    }
  },

  set: function(key, value) {
    try {
      localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('LocalStorage error:', e);
      return false;
    }
  },

  init: function() {
    const current = this.get('schemaVersion', 0);
    if (current !== this.SCHEMA_VERSION) {
      this.reset();
    }
  },

  /** Nạp lại toàn bộ dữ liệu mẫu — dùng cho nút "Nạp lại dữ liệu mẫu" trên thanh demo. */
  reset: function() {
    this.SEEDED_KEYS.forEach((k) => {
      this.set(k, JSON.parse(JSON.stringify(MEDIGO_SEED[k])));
    });
    this.set('schemaVersion', this.SCHEMA_VERSION);
  },

  // ---------- Đọc ----------
  getSeller:      function() { return this.get('currentSeller', MEDIGO_SEED.currentSeller); },
  getCart:        function() { return this.get('cart', []); },
  getTrend:       function() { return this.get('commissionTrend7Days', MEDIGO_SEED.commissionTrend7Days); },
  getDownlines:   function() { return this.get('downlineTiers', MEDIGO_SEED.downlineTiers); },
  getHistory:     function() { return this.get('sellerCommissionHistory', MEDIGO_SEED.sellerCommissionHistory); },
  getOrders:      function() { return this.get('customerOrders', MEDIGO_SEED.customerOrders); },
  getMembers:     function() { return this.get('adminMembers', MEDIGO_SEED.adminMembers); },
  getWithdrawals: function() { return this.get('adminWithdrawals', MEDIGO_SEED.adminWithdrawals); },

  /** aff_id đang được ghi nhận cho phiên này (bắt từ URL ở A0, xem js/app.js). */
  getAffId: function() { return this.get('aff_id', ''); },
  setAffId: function(id) { if (id) this.set('aff_id', String(id)); },

  // ---------- Ghi ----------
  saveSeller: function(patch) {
    const seller = Object.assign({}, this.getSeller(), patch || {});
    this.set('currentSeller', seller);
    return seller;
  },

  /** Số lượng sản phẩm trong giỏ (prototype chỉ bán 1 mã CN02). */
  setCartQty: function(qty) {
    const n = Math.max(0, parseInt(qty, 10) || 0);
    this.set('cart', n === 0 ? [] : [{ code: 'CN02', qty: n }]);
    return n;
  },

  getCartQty: function() {
    const cart = this.getCart();
    return cart.length ? (cart[0].qty || 0) : 0;
  },

  clearCart: function() { this.set('cart', []); },

  /** Kích hoạt mã phần mềm của một đơn — mốc tính hạn 1 năm bắt đầu từ đây. */
  activateOrder: function(orderId, today) {
    const orders = this.getOrders();
    const order = orders.find(o => o.orderId === orderId);
    if (!order || order.activationKey.activated) return null;
    order.activationKey.activated = true;
    order.activationKey.activatedDate = MEDIGO_RULES.formatDate(today || new Date());
    this.set('customerOrders', orders);
    return order;
  },

  /** Tạo yêu cầu rút tiền mới và trừ vào số dư khả dụng. */
  createWithdrawal: function(amount, now) {
    const seller = this.getSeller();
    const check = MEDIGO_RULES.validateWithdrawal(amount, seller.availableBalance);
    if (!check.ok) return { ok: false, message: check.message, request: null };

    const list = this.getWithdrawals();
    const amt = Math.round(Number(amount));
    const d = now instanceof Date ? now : new Date();
    const p = (v) => String(v).padStart(2, '0');
    const request = {
      id: 'WD-' + (1093 + list.filter(r => r.id.startsWith('WD-')).length),
      sellerAffId: seller.aff_id,
      sellerName: seller.fullName,
      amount: amt,
      requestDate: `${MEDIGO_RULES.formatDate(d)} - ${p(d.getHours())}:${p(d.getMinutes())}`,
      bankName: seller.bankName,
      bankAccountNo: seller.bankAccountNo,
      bankAccountOwner: seller.bankAccountOwner,
      branch: 'Chi nhánh Hà Nội',
      status: 'Chờ duyệt',
      rejectReason: ''
    };
    list.unshift(request);
    this.set('adminWithdrawals', list);
    this.saveSeller({ availableBalance: seller.availableBalance - amt });
    return { ok: true, message: '', request: request };
  },

  /**
   * Đổi trạng thái một yêu cầu rút tiền.
   * Ràng buộc bắt buộc theo spec: không được nhảy thẳng "Chờ duyệt" -> "Đã chi trả".
   * Khi Từ chối thì hoàn lại số dư cho seller.
   */
  updateWithdrawalStatus: function(reqId, nextStatus, rejectReason) {
    const list = this.getWithdrawals();
    const r = list.find(item => item.id === reqId);
    if (!r) return { ok: false, message: 'Không tìm thấy yêu cầu.' };

    const allowed = {
      'Chờ duyệt': ['Đã duyệt', 'Từ chối'],
      'Đã duyệt': ['Đã chi trả'],
      'Đã chi trả': [],
      'Từ chối': []
    };
    if (!(allowed[r.status] || []).includes(nextStatus)) {
      return { ok: false, message: `Không thể chuyển từ "${r.status}" sang "${nextStatus}".` };
    }
    if (nextStatus === 'Từ chối' && !String(rejectReason || '').trim()) {
      return { ok: false, message: 'Vui lòng nhập lý do từ chối.' };
    }

    r.status = nextStatus;
    if (nextStatus === 'Từ chối') {
      r.rejectReason = String(rejectReason).trim();
      const seller = this.getSeller();
      if (seller.aff_id === r.sellerAffId) {
        this.saveSeller({ availableBalance: seller.availableBalance + r.amount });
      }
    }
    this.set('adminWithdrawals', list);
    return { ok: true, message: '', request: r };
  },

  /** Khóa / mở khóa tài khoản thành viên. */
  setMemberStatus: function(affId, status) {
    const members = this.getMembers();
    const m = members.find(x => x.aff_id === affId);
    if (!m) return null;
    m.status = status;
    this.set('adminMembers', members);
    return m;
  }
};

MedigoStore.init();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MEDIGO_SEED, MedigoStore };
}
