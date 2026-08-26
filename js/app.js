/**
 * Medigo Prototype - Router & Screen Control Switcher
 */

const MedigoApp = {
  currentScreen: '',
  _suppressHashEvent: false,

  // Bảng định tuyến: mã màn -> hàm render. Tham số phụ lấy từ query trong hash.
  routes: {
    A0:  (root) => MedigoViews.renderA0(root),
    A1:  (root, q) => MedigoViews.renderA1(root, q.get('empty') === 'true'),
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
    B3:  (root) => MedigoViews.renderB3(root)
  },

  init: function() {
    this.captureAffId();
    this.renderToolbar();

    // Nút Back/Forward của trình duyệt phải render lại đúng màn.
    window.addEventListener('hashchange', () => {
      if (this._suppressHashEvent) { this._suppressHashEvent = false; return; }
      const target = window.location.hash.replace('#', '');
      this.render(target || 'A0');
    });

    const hash = window.location.hash.replace('#', '');
    this.navigate(hash && this.routes[hash.split('?')[0]] ? hash : 'A0', { replace: true });
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

  /** Render thuần túy, không đụng vào lịch sử trình duyệt. */
  render: function(screenCode) {
    const root = document.getElementById('app-root');
    if (!root) return;

    this.clearTimers();
    window.scrollTo(0, 0);
    this.currentScreen = screenCode;

    const [baseScreen, queryString] = screenCode.split('?');
    const query = new URLSearchParams(queryString || '');

    const select = document.getElementById('screen-switcher-select');
    if (select) select.value = baseScreen;

    const route = this.routes[baseScreen] || this.routes.A0;
    route(root, query);
  },

  /** Dọn bộ đếm của màn trước, tránh chạy ngầm sau khi đã rời màn. */
  clearTimers: function() {
    ['qrInterval', 'otpInterval'].forEach((k) => {
      if (window[k]) { clearInterval(window[k]); window[k] = null; }
    });
  },

  resetDemoData: function() {
    if (!window.confirm('Nạp lại toàn bộ dữ liệu mẫu? Mọi thao tác đã thực hiện trong bản demo sẽ bị xóa.')) return;
    MedigoStore.reset();
    this.render(this.currentScreen || 'A0');
  },

  renderToolbar: function() {
    const bar = document.createElement('div');
    bar.id = 'medigo-demo-toolbar';
    bar.className = 'demo-toolbar';

    bar.innerHTML = `
      <strong class="demo-toolbar-title">Medigo Demo</strong>
      <select id="screen-switcher-select" class="demo-toolbar-select" aria-label="Chọn màn hình demo" onchange="MedigoApp.navigate(this.value)">
        <optgroup label="Nhóm A — Khách hàng &amp; Seller">
          <option value="A0">A0: Landing CN02</option>
          <option value="A1">A1: Giỏ hàng</option>
          <option value="A2">A2: Thông tin nhận hàng</option>
          <option value="A3">A3: Thanh toán QR</option>
          <option value="A4">A4: Thành công &amp; Popup Seller</option>
          <option value="A5">A5: Thất bại / Expired QR</option>
          <option value="A6">A6: Đăng ký Seller - Bước 1</option>
          <option value="A7">A7: Đăng ký Seller - OTP (Bước 2)</option>
          <option value="A8">A8: Đăng ký Seller - Điều khoản (Bước 3)</option>
          <option value="A9">A9: Kích hoạt Seller thành công</option>
          <option value="A10">A10: Dashboard Seller (7 tầng)</option>
          <option value="A11">A11: Đăng nhập Seller</option>
          <option value="A12">A12: Yêu cầu rút tiền</option>
          <option value="A13">A13: Đơn hàng &amp; Mã kích hoạt</option>
        </optgroup>
        <optgroup label="Nhóm B — Admin Vận hành">
          <option value="B1">B1: Đăng nhập Admin</option>
          <option value="B2">B2: Quản lý thành viên Admin</option>
          <option value="B3">B3: Yêu cầu rút tiền Admin</option>
        </optgroup>
      </select>
      <button type="button" class="demo-toolbar-reset" onclick="MedigoApp.resetDemoData()" title="Nạp lại dữ liệu mẫu">Nạp lại dữ liệu</button>
    `;

    document.body.appendChild(bar);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  MedigoApp.init();
});
