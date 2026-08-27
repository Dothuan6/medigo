/**
 * Medigo Prototype - Router & Screen Control Switcher
 */

const MedigoApp = {
  currentScreen: '',
  _suppressHashEvent: false,

  // Bảng định tuyến: mã màn -> hàm render. Tham số phụ lấy từ query trong hash.
  routes: {
    A0:  (root) => MedigoViews.renderA0(root),
    A2:  (root) => MedigoViews.renderA2(root),
    A3:  (root) => MedigoViews.renderA3(root),
    A4:  (root) => MedigoViews.renderA4(root),
    A5:  (root, q) => MedigoViews.renderA5(root, q.get('state') || 'expired'),
    A6:  (root) => MedigoViews.renderA6(root),
    A7:  (root) => MedigoViews.renderA7(root),
    A8:  (root) => MedigoViews.renderA8(root),
    A9:  (root) => MedigoViews.renderA9(root),
    A10: (root) => MedigoViews.renderA10(root),
    A11: (root) => MedigoViews.renderA11(root),
    A12: (root, q) => MedigoViews.renderA12(root, q.get('state') || 'form'),
    A13: (root) => MedigoViews.renderA13(root),
    B1:  (root) => MedigoViews.renderB1(root),
    B2:  (root) => MedigoViews.renderB2(root),
    B3:  (root) => MedigoViews.renderB3(root),
    B4:  (root) => MedigoViews.renderB4(root)
  },

  init: function() {
    this.captureAffId();

    // Nút Back/Forward của trình duyệt phải render lại đúng màn.
    window.addEventListener('hashchange', () => {
      if (this._suppressHashEvent) { this._suppressHashEvent = false; return; }
      const target = window.location.hash.replace('#', '');
      this.render(target || MEDIGO_RULES.entryScreen());
    });

    // Khách bấm link giới thiệu của seller là vào thẳng màn tiếp đất
    // (phase 1: form mua hàng A2 — trang chủ A0 đang tạm ẩn).
    const hash = window.location.hash.replace('#', '');
    const wanted = hash.split('?')[0];
    const valid = hash && this.routes[wanted] && this.isScreenEnabled(wanted);
    this.navigate(valid ? hash : MEDIGO_RULES.entryScreen(), { replace: true });
  },

  /**
   * Bắt aff_id từ URL thật (?aff_id=... hoặc #A0?aff_id=...) và lưu lại ngay.
   * Lý do (Spec mục 8): luồng thanh toán sẽ chuyển hướng ra cổng thanh toán rồi quay về,
   * tham số trên URL gần như chắc chắn bị mất — nên phải lưu ở lần chạm đầu tiên.
   */
  captureAffId: function() {
    const fromSearch = new URLSearchParams(window.location.search).get('aff_id');
    const hashQuery = window.location.hash.split('?')[1] || '';
    const fromHash = new URLSearchParams(hashQuery).get('aff_id');
    const affId = (fromSearch || fromHash || '').trim();

    if (/^\d{4,12}$/.test(affId)) {
      MedigoStore.setAffId(affId);
    }
  },

  /** Điều hướng có ghi lịch sử (mặc định) hoặc thay thế mục hiện tại. */
  navigate: function(screenCode, options) {
    const opts = options || {};
    const nextHash = '#' + screenCode;

    if (window.location.hash !== nextHash) {
      this._suppressHashEvent = true;
      if (opts.replace) {
        window.history.replaceState(null, '', nextHash);
        this._suppressHashEvent = false;
      } else {
        window.location.hash = screenCode;
      }
    }
    this.render(screenCode);
  },

  /** Màn có đang được bật hay không (xem MEDIGO_CONFIG.features). */
  isScreenEnabled: function(screenCode) {
    if (screenCode === 'A0') return MEDIGO_CONFIG.features.landingPage;
    return true;
  },

  /** Render thuần túy, không đụng vào lịch sử trình duyệt. */
  render: function(screenCode) {
    const root = document.getElementById('app-root');
    if (!root) return;

    // Màn đang tắt thì đưa về màn tiếp đất, tránh màn trắng khi gõ hash tay
    if (!this.isScreenEnabled(screenCode.split('?')[0])) {
      this.navigate(MEDIGO_RULES.entryScreen(), { replace: true });
      return;
    }

    this.clearTimers();
    window.scrollTo(0, 0);
    this.currentScreen = screenCode;

    const [baseScreen, queryString] = screenCode.split('?');
    const query = new URLSearchParams(queryString || '');

    const route = this.routes[baseScreen] || this.routes.A0;
    route(root, query);
  },

  /** Dọn bộ đếm của màn trước, tránh chạy ngầm sau khi đã rời màn. */
  clearTimers: function() {
    ['qrInterval', 'otpInterval'].forEach((k) => {
      if (window[k]) { clearInterval(window[k]); window[k] = null; }
    });
  },

  /**
   * Nạp lại dữ liệu mẫu. Không còn nút bấm trên giao diện (đã bỏ thanh demo) —
   * gọi từ console khi cần: MedigoApp.resetDemoData()
   */
  resetDemoData: function() {
    if (!window.confirm('Nạp lại toàn bộ dữ liệu mẫu? Mọi thao tác đã thực hiện trong bản demo sẽ bị xóa.')) return;
    MedigoStore.reset();
    this.render(this.currentScreen || MEDIGO_RULES.entryScreen());
  }

};

document.addEventListener('DOMContentLoaded', () => {
  MedigoApp.init();
});
