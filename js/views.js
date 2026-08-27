/**
 * Medigo Prototype - Render Views for 16 Screens (A0 -> A13, B1 -> B3)
 * Modern Website Layout (Responsive for Desktop & Mobile)
 *
 * QUY ƯỚC BẮT BUỘC TRONG FILE NÀY
 * 1. Dữ liệu: chỉ đọc/ghi qua MedigoStore. Không đọc thẳng MEDIGO_SEED.
 * 2. Con số nghiệp vụ: chỉ lấy qua MEDIGO_CONFIG / MEDIGO_RULES. Không tính tay, không viết số cứng.
 * 3. Màu: chỉ dùng biến token. Không viết mã hex trong component.
 * 4. Cỡ chữ tối thiểu 14px, vùng bấm tối thiểu 44x44px.
 * 5. Không dùng emoji — dùng MedigoViews.icon() (SVG nội tuyến).
 * 6. Mọi dữ liệu do người dùng nhập phải qua esc() trước khi ghép vào HTML.
 */

const MedigoViews = {

  // ====================================================
  // Tiện ích chung
  // ====================================================

  /** Định dạng tiền, ủy quyền cho tầng rule để chỉ có một nguồn sự thật. */
  formatMoney: function(num) {
    return MEDIGO_RULES.formatMoney(num);
  },

  /**
   * Chống chèn HTML khi ghép chuỗi vào innerHTML.
   * Prototype đang dùng dữ liệu tĩnh nên chưa lộ rủi ro, nhưng khi nối API thật thì
   * mọi trường người dùng nhập (họ tên, lý do từ chối, địa chỉ) đều đi qua đây.
   */
  esc: function(value) {
    return String(value === null || value === undefined ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  /** Bộ biểu tượng SVG nội tuyến, thay cho emoji (Spec mục 3: không dùng emoji). */
  icons: {
    info:     '<path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>',
    warning:  '<path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>',
    share:    '<path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>',
    check:    '<path d="M5 13l4 4L19 7"/>',
    box:      '<path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>',
    key:      '<path d="M15 7a2 2 0 012 2m4-2a6 6 0 01-7.743 5.743L11 14H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>',
    users:    '<path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>',
    cash:     '<path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>',
    home:     '<path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>',
    search:   '<path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>',
    phone:    '<path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11 11 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>',
    mail:     '<path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>',
    pin:      '<path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>',
    id:       '<path d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0"/>',
    bank:     '<path d="M12 3l9 5H3l9-5zM5 10v7m5-7v7m4-7v7m5-7v7M3 21h18"/>',
    gift:     '<path d="M12 8v13m0-13a4 4 0 00-4-4 2 2 0 000 4h4zm0 0a4 4 0 014-4 2 2 0 010 4h-4zM4 21h16a1 1 0 001-1v-7H3v7a1 1 0 001 1zM3 8h18v5H3V8z"/>',
    tree:     '<path d="M12 3v4m0 0H7a1 1 0 00-1 1v3m6-4h5a1 1 0 011 1v3M6 11v0m12 0v0M4 14h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/>',
    chevron:  '<path d="M19 9l-7 7-7-7"/>',
    truck:    '<path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1"/>',
    copy:     '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 01-1-1V4a1 1 0 011-1h10a1 1 0 011 1v1"/>'
  },

  icon: function(name, size, extraStyle) {
    const path = this.icons[name];
    if (!path) return '';
    const s = size || 18;
    return `<svg class="ico" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
      style="${extraStyle || ''}">${path}</svg>`;
  },

  /** Logo Medigo dạng SVG, màu lấy từ token thay vì hex cứng. */
  logoMark: function(size) {
    const s = size || 34;
    return `<svg width="${s}" height="${s}" viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="54" fill="var(--c6)"/>
      <text x="60" y="76" font-family="Arial, sans-serif" font-size="50" font-weight="bold" fill="var(--c12)" text-anchor="middle">M</text>
    </svg>`;
  },

  /** Rút gọn số điện thoại cho danh sách công khai: 090•••456 */
  maskPhone: function(phone) {
    const p = String(phone || '');
    return p.length >= 6 ? `${p.slice(0, 3)}•••${p.slice(-3)}` : p;
  },

  /** Rút gọn số tài khoản: 0123•••789 */
  maskAccount: function(acc) {
    const a = String(acc || '');
    return a.length >= 7 ? `${a.slice(0, 4)}•••${a.slice(-3)}` : a;
  },

  /** Class badge theo nhãn trạng thái — bảng màu lấy đúng theo Spec mục 3. */
  statusBadgeClass: function(status) {
    const map = {
      'Chờ duyệt': 'badge-pending',
      'Chờ kích hoạt': 'badge-pending',
      'Sắp hết hạn': 'badge-pending',
      'Đã duyệt': 'badge-approved',
      'Từ chối': 'badge-rejected',
      'Đã chi trả': 'badge-paid',
      'Đã khóa': 'badge-locked',
      'Hết hạn': 'badge-locked',
      'Đang hoạt động': 'badge-active',
      'Đã kích hoạt': 'badge-active'
    };
    return map[status] || 'badge-locked';
  },

  /**
   * Khung xương "đang tải" cho bảng dữ liệu (Spec mục 5: mọi bảng và biểu đồ
   * đều phải có trạng thái đang tải).
   */
  tableSkeleton: function(cols, rows) {
    const c = cols || 8;
    const r = rows || 5;
    return `
      <div class="data-table-wrapper" aria-busy="true" aria-live="polite">
        <span class="sr-only">Đang tải dữ liệu...</span>
        <table class="data-table">
          <tbody>
            ${Array.from({ length: r }, () => `
              <tr>${Array.from({ length: c }, () => `<td><span class="skeleton-line"></span></td>`).join('')}</tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;
  },

  /** Khung xương "đang tải" cho biểu đồ cột. */
  chartSkeleton: function(bars) {
    const n = bars || 7;
    return `
      <div class="bar-chart" aria-busy="true" aria-live="polite">
        <span class="sr-only">Đang tải biểu đồ...</span>
        ${Array.from({ length: n }, (_, i) => `
          <div class="bar-chart-col">
            <div class="skeleton-bar" style="height: ${30 + ((i * 37) % 55)}%"></div>
            <span class="skeleton-line skeleton-line-sm"></span>
          </div>`).join('')}
      </div>`;
  },

  /**
   * Vẽ khung xương trước, rồi vẽ nội dung thật sau độ trễ giả lập.
   * Chỉ dùng ở lần nạp đầu của màn — thao tác lọc/phân trang vẽ ngay để không nhấp nháy.
   */
  withLoading: function(regionId, skeletonHTML, renderFn) {
    const region = document.getElementById(regionId);
    if (!region) return;
    const delay = MEDIGO_CONFIG.demo.simulatedLatencyMs;
    if (!delay) { renderFn(); return; }

    region.innerHTML = skeletonHTML;
    const token = (this._loadToken = (this._loadToken || 0) + 1);
    setTimeout(() => {
      // Bỏ qua nếu người dùng đã rời màn hoặc có lượt nạp mới hơn
      if (token !== this._loadToken) return;
      if (!document.getElementById(regionId)) return;
      renderFn();
    }, delay);
  },

  /** Khối trạng thái rỗng dùng chung (Spec mục 5). */
  emptyState: function(iconName, title, desc, actionHTML) {
    return `
      <div class="empty-state">
        <span class="empty-state-icon">${this.icon(iconName, 48)}</span>
        <h3 class="empty-state-title">${this.esc(title)}</h3>
        ${desc ? `<p class="empty-state-desc">${this.esc(desc)}</p>` : ''}
        ${actionHTML || ''}
      </div>
    `;
  },

  // ====================================================
  // Header dùng chung cho website
  // ====================================================
  renderWebHeader: function(activeTab = '') {
    const affId = MedigoStore.getAffId();
    const home = MEDIGO_RULES.entryScreen();

    const navItem = (code, label) =>
      `<li><a href="#${code}" class="web-nav-link ${activeTab === code ? 'active-nav' : ''}" data-go="${code}"
         onclick="event.preventDefault(); MedigoApp.navigate(this.dataset.go)">${label}</a></li>`;

    return `
      ${affId ? `
      <div class="aff-notice-bar">
        ${this.icon('info', 18)}
        <span>Bạn đang xem qua link giới thiệu của thành viên <strong>${this.esc(affId)}</strong></span>
      </div>` : ''}

      <header class="app-header">
        <a href="#${home}" class="logo-brand" onclick="event.preventDefault(); MedigoApp.navigate(this.dataset.go)" data-go="${home}">
          ${this.logoMark(34)}
          <span>MEDIGO</span>
        </a>

        <ul class="web-nav-links">
          ${MEDIGO_CONFIG.features.landingPage ? navItem('A0', 'Trang chủ Sản phẩm') : ''}
        </ul>

        <div class="app-header-actions">
          ${this.renderAccountMenu(activeTab)}
        </div>
      </header>
    `;
  },

  /**
   * Nút thông tin tài khoản — gom Đơn hàng, Kênh Seller, Rút tiền... vào một chỗ
   * thay vì trải hết ra thanh điều hướng.
   */
  renderAccountMenu: function(activeTab = '') {
    const seller = MedigoStore.getSeller();
    const rank = MEDIGO_RULES.rankFor(seller.totalOrders);
    const initials = seller.fullName.trim().split(/\s+/).slice(-1)[0].charAt(0).toUpperCase();

    const menuItem = (code, label, iconName) => `
      <li role="none">
        <a role="menuitem" href="#${code}" class="account-menu-item ${activeTab === code ? 'active' : ''}"
           data-go="${code}" onclick="event.preventDefault(); MedigoViews.goFromAccountMenu(this.dataset.go)">
          ${this.icon(iconName, 18)} <span>${label}</span>
        </a>
      </li>`;

    return `
      <div class="account-menu" id="account-menu">
        <button class="account-trigger" id="account-trigger" aria-haspopup="true" aria-expanded="false"
                aria-controls="account-dropdown" onclick="MedigoViews.toggleAccountMenu()">
          <span class="account-avatar" aria-hidden="true">${this.esc(initials)}</span>
          <span class="account-trigger-text">
            <span class="account-trigger-name">${this.esc(seller.shortName || seller.fullName)}</span>
            <span class="account-trigger-sub">Tài khoản</span>
          </span>
          ${this.icon('chevron', 16, 'flex-shrink:0')}
        </button>

        <div class="account-dropdown" id="account-dropdown" role="menu" aria-labelledby="account-trigger" hidden>
          <div class="account-head">
            <span class="account-avatar account-avatar-lg" aria-hidden="true">${this.esc(initials)}</span>
            <div class="account-head-body">
              <div class="account-head-name">${this.esc(seller.fullName)}</div>
              <div class="text-sm text-muted">${this.esc(this.maskPhone(seller.phone))}</div>
              <div class="account-head-meta">
                <span class="rank-badge ${rank.badgeClass}">${this.esc(rank.rank)}</span>
                <span class="text-sm text-muted">aff_id: <strong>${this.esc(seller.aff_id)}</strong></span>
              </div>
            </div>
          </div>

          <ul class="account-menu-list" role="none">
            <li class="account-menu-group" role="none">Mua hàng của tôi</li>
            ${menuItem('A13', 'Đơn hàng &amp; Mã kích hoạt', 'box')}

            <li class="account-menu-group" role="none">Kênh Seller</li>
            ${menuItem('A10', 'Dashboard Seller', 'users')}
            ${menuItem('A12', 'Yêu cầu rút tiền', 'cash')}
            ${menuItem('A6', 'Đăng ký làm Seller', 'gift')}

            <li class="account-menu-sep" role="none"></li>
            ${menuItem('A11', 'Đăng nhập Seller', 'key')}
            ${menuItem('B2', 'Khu vực Admin Vận hành', 'home')}
          </ul>
        </div>
      </div>
    `;
  },

  toggleAccountMenu: function(forceClose) {
    const trigger = document.getElementById('account-trigger');
    const dropdown = document.getElementById('account-dropdown');
    if (!trigger || !dropdown) return;

    const open = forceClose ? false : dropdown.hidden;
    dropdown.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));

    if (open) {
      this._accountOutside = (e) => {
        // Header có thể đã render lại — phải kiểm tra null, nếu không handler sẽ ném lỗi
        const root = document.getElementById('account-menu');
        if (!root || !root.contains(e.target)) this.toggleAccountMenu(true);
      };
      this._accountEsc = (e) => {
        if (e.key === 'Escape') {
          this.toggleAccountMenu(true);
          const t = document.getElementById('account-trigger');
          if (t) { try { t.focus(); } catch (err) {} }
        }
      };
      // hoãn 1 nhịp để không bắt chính cú bấm đang mở menu
      setTimeout(() => {
        if (this._accountOutside) document.addEventListener('click', this._accountOutside);
      }, 0);
      document.addEventListener('keydown', this._accountEsc);
      const first = dropdown.querySelector('.account-menu-item');
      if (first) { try { first.focus(); } catch (err) {} }
    } else {
      if (this._accountOutside) { document.removeEventListener('click', this._accountOutside); this._accountOutside = null; }
      if (this._accountEsc) { document.removeEventListener('keydown', this._accountEsc); this._accountEsc = null; }
    }
  },

  goFromAccountMenu: function(code) {
    this.toggleAccountMenu(true);
    MedigoApp.navigate(code);
  },

  renderFooter: function() {
    const config = MEDIGO_CONFIG;
    return `
      <footer class="site-footer">
        <div class="footer-grid">
          <div>
            <div class="footer-heading">${this.esc(config.company.fullName)}</div>
            <p class="footer-line">${this.icon('pin', 16)} Địa chỉ: ${this.esc(config.company.address)}</p>
            <p class="footer-line">${this.icon('phone', 16)} Điện thoại: ${this.esc(config.company.phones.join(' · '))}</p>
            <p class="footer-line">${this.icon('mail', 16)} Email: ${this.esc(config.company.email)}</p>
            <p class="footer-license">${this.esc(config.company.license)}</p>
          </div>
          <div>
            <div class="footer-heading">Danh mục chính sách</div>
            <ul class="footer-policy-list">
              ${config.policies.map(p => `<li><a href="javascript:void(0)">${this.esc(p)}</a></li>`).join('')}
            </ul>
          </div>
        </div>
      </footer>
    `;
  },

  // ====================================================
  // A0: Landing Sản phẩm CN02
  // ====================================================
  renderA0: function(container) {
    const config = MEDIGO_CONFIG;
    const p = config.product;

    // Nội dung 8 mục tính năng — số liệu lấy từ config, không viết cứng trong HTML.
    const features = [
      { title: '1. Theo dõi, quản lý sức khỏe cá nhân', items: [
        'Người dùng được sử dụng nền tảng GOCARE để theo dõi, quản lý dữ liệu sức khỏe cá nhân với các tính năng nâng cao.' ] },
      { title: '2. Các tính năng thu nhận dữ liệu vào APP', items: [
        'Thu nhận dữ liệu từ thiết bị đo kết nối đến APP',
        'Nhập dữ liệu thông tin sức khỏe thủ công',
        'Tải hồ sơ sức khỏe',
        'Nhập dữ liệu hồ sơ sức khỏe bằng chụp OCR' ] },
      { title: '3. Lưu trữ dữ liệu sức khỏe', items: [
        `Thời gian lưu trữ kéo dài ${p.storageYears} năm`,
        `Dung lượng lưu trữ tối đa ${p.storageSizeMB}MB` ] },
      { title: '4. Chia sẻ thông tin sức khỏe online', items: [
        'Chia sẻ dữ liệu sức khỏe với Trung tâm theo dõi, chăm sóc sức khỏe TT247 GOCARE',
        'Thêm không giới hạn người thân theo dõi',
        'Không cho phép thêm Bác sĩ theo dõi' ] },
      { title: '5. Cảnh báo và hỗ trợ khẩn cấp (SOS)', items: [
        'Hệ thống tự động gửi cảnh báo khi có chỉ số sức khỏe bất thường qua thông báo trên ứng dụng',
        'Cuộc gọi tự động Callbot thông báo tình trạng sức khỏe bất thường nghiêm trọng đến người thân',
        'Nút SOS trên APP để yêu cầu hỗ trợ từ TT247 GOCARE và người thân' ] },
      { title: '6. Theo dõi và chăm sóc sức khỏe từ xa', items: [
        'Gọi lên TT247 GOCARE để được Trợ lý sức khỏe giải đáp thông tin về dịch vụ và tư vấn sức khỏe trong phạm vi được hướng dẫn',
        'TT247 GOCARE chủ động theo dõi sức khỏe và hỗ trợ từ xa khi có bất thường nghiêm trọng hoặc khi nhấn nút SOS' ] },
      { title: '7. Dịch vụ Bác sĩ từ GOCARE', items: [
        'Bác sĩ 24/7 hỗ trợ khi người dùng gặp bất thường nghiêm trọng về sức khỏe hoặc nhấn nút SOS trên ứng dụng GOCARE' ] },
      { title: '8. Tính năng nâng cao của nền tảng GOCARE', items: [
        'Nhắc lịch uống thuốc',
        'Người thân theo dõi lịch uống thuốc',
        'Phân tích dữ liệu bằng AI theo tuần, tháng, năm để đưa ra xu hướng bệnh lý và nguy cơ tiềm ẩn, kèm tư vấn của bác sĩ' ] }
    ];

    container.innerHTML = `
      <div class="web-wrapper">
        ${this.renderWebHeader('A0')}

        <div class="product-hero-grid">
          <!-- Khối ảnh: ảnh lớn ở trên, dải thumbnail NẰM NGANG phía dưới -->
          <div class="product-gallery">
            <div class="gallery-main" id="product-carousel" data-swipe="true"
                 role="tabpanel" aria-live="polite" aria-label="Ảnh giới thiệu gói ${this.esc(p.code)}" tabindex="0">
              <img id="gallery-main-img" src="${p.gallery[0].src}" alt="${this.esc(p.gallery[0].alt)}"
                   width="1890" height="1063" fetchpriority="high" decoding="async" draggable="false">
              <button class="gallery-nav gallery-nav-prev" aria-label="Ảnh trước"
                      onclick="MedigoViews.stepGallery(-1)">‹</button>
              <button class="gallery-nav gallery-nav-next" aria-label="Ảnh kế tiếp"
                      onclick="MedigoViews.stepGallery(1)">›</button>
            </div>

            <div class="gallery-thumbs" role="tablist" aria-label="Chọn ảnh giới thiệu gói ${this.esc(p.code)}">
              ${p.gallery.map((img, i) => `
                <button class="gallery-thumb ${i === 0 ? 'active' : ''}" role="tab" id="gthumb-${i}"
                        aria-selected="${i === 0}" aria-controls="gallery-main-img"
                        title="${this.esc(img.title)}"
                        onclick="MedigoViews.switchGallery(${i})">
                  <img src="${img.thumb || img.src}" alt="" width="320" height="180"
                       loading="lazy" decoding="async" draggable="false">
                  <span class="sr-only">${this.esc(img.title)}</span>
                </button>`).join('')}
            </div>
          </div>

          <div class="product-summary">
            <div class="product-meta-row">
              <span>Mã gói: <strong class="text-strong">${this.esc(p.code)}</strong></span>
              <span class="badge badge-active">${this.esc(p.stockStatus)}</span>
            </div>

            <h1 class="product-title">${this.esc(p.name)}</h1>

            <div class="product-price-tag">${this.formatMoney(p.price)}</div>

            <p class="product-lead">
              Gói dịch vụ cao cấp bao gồm: <strong>01 đồng hồ thông minh HW01</strong> theo dõi nhịp tim/SOS
              gửi qua đơn vị vận chuyển + <strong>01 năm phần mềm Bác sĩ 24/7</strong> gửi qua Email.
            </p>

            <div class="product-qty-row">
              <span class="product-qty-label">Số lượng:</span>
              <div class="quantity-control">
                <button class="qty-btn" onclick="MedigoViews.changeQty(-1)" aria-label="Giảm số lượng">−</button>
                <input type="text" id="product-qty" class="qty-input" value="1" readonly aria-label="Số lượng">
                <button class="qty-btn" onclick="MedigoViews.changeQty(1)" aria-label="Tăng số lượng">+</button>
              </div>
            </div>

            <div class="product-cta-row">
              <button class="btn btn-primary btn-full btn-lg" onclick="MedigoViews.buyNow()">MUA NGAY</button>
            </div>

            <button class="btn btn-secondary btn-full" onclick="MedigoViews.copyText(MedigoViews.referralUrl(), 'Đã sao chép link chia sẻ sản phẩm.')">
              ${this.icon('share', 18)} Chia sẻ link giới thiệu sản phẩm
            </button>
          </div>
        </div>

        <div class="section-card">
          <h2 class="section-title">Chi tiết tính năng gói dịch vụ ${this.esc(p.code)}</h2>
          <p class="section-lead">
            Gói dịch vụ GOCARE - Bác sĩ 24/7 hỗ trợ, tư vấn sức khỏe (Ký hiệu ${this.esc(p.code)}) được thiết kế với mục đích
            cung cấp cho người dùng những tính năng nâng cao của nền tảng và dịch vụ GOCARE. Với gói ${this.esc(p.code)},
            người dùng ngoài việc tự theo dõi sức khỏe cá nhân, được Trợ lý sức khỏe theo dõi 24/7 còn được hỗ trợ tư vấn
            trực tuyến từ đội ngũ bác sĩ 24/7 của GOCARE, đồng thời khi xảy ra các tình huống bất thường khẩn cấp thì hệ thống
            sẽ tự động thực hiện cuộc gọi tới người thân thông báo thông tin bất thường và vị trí của người dùng để người thân
            có thể hỗ trợ kịp thời.
          </p>

          <div class="features-grid">
            ${features.map(f => `
              <div class="feature-block">
                <div class="feature-title">${this.esc(f.title)}</div>
                <ul class="feature-list">
                  ${f.items.map(i => `<li>${this.esc(i)}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>

        ${this.renderFooter()}
      </div>
    `;

    this.carouselIndex = 0;
    this.bindCarouselSwipe();
  },

  /**
   * Vuốt ngang để đổi ảnh (Spec A0). Dùng Pointer Events nên chạy cho cả
   * cảm ứng, chuột và bút. Kèm phím mũi tên trái/phải cho người dùng bàn phím.
   */
  carouselIndex: 0,

  bindCarouselSwipe: function() {
    const el = document.getElementById('product-carousel');
    if (!el) return;
    const THRESHOLD = 40; // px — đủ lớn để không nhầm với chạm nhẹ
    let startX = null;

    el.addEventListener('pointerdown', (e) => { startX = e.clientX; });
    el.addEventListener('pointerup', (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) < THRESHOLD) return;
      this.stepGallery(dx < 0 ? 1 : -1);
    });
    el.addEventListener('pointercancel', () => { startX = null; });

    el.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); this.stepGallery(1); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); this.stepGallery(-1); }
    });
  },

  /**
   * Link giới thiệu của seller — luôn là URL CÔNG KHAI của bản deploy.
   *
   * Cố tình KHÔNG dựng từ window.location: seller mở prototype ở localhost thì
   * link sẽ thành http://localhost:5173/... — gửi cho khách không ai mở được.
   * Link giới thiệu là thứ seller gửi ra ngoài nên phải luôn trỏ về domain công khai.
   *
   * Domain lấy từ MEDIGO_CONFIG.site.baseUrl — đổi một chỗ đó là mọi link đổi theo.
   * Chỉ khi baseUrl bỏ trống mới lùi về URL đang chạy, để bản chạy thuần local
   * vẫn có link bấm được.
   */
  referralUrl: function(affId) {
    const id = affId || MedigoStore.getAffId() || MedigoStore.getSeller().aff_id;
    const configured = (MEDIGO_CONFIG.site.baseUrl || '').trim();
    // Dùng URL API thay vì nối chuỗi: nối tay dễ sinh URL hỏng kiểu
    // ".../index.html/?aff_id=" (thừa dấu gạch chéo, mở ra là 404).
    const url = new URL(configured || (window.location.origin + window.location.pathname));
    url.search = '';
    url.hash = '';
    url.searchParams.set('aff_id', id);
    return url.toString();
  },

  /** Dạng rút gọn để hiển thị: bỏ phần giao thức cho đỡ dài. */
  referralLabel: function(affId) {
    return this.referralUrl(affId).replace(/^https?:\/\//, '');
  },

  /** Đổi ảnh lớn theo thumbnail được chọn. */
  switchGallery: function(index) {
    const gallery = MEDIGO_CONFIG.product.gallery;
    const total = gallery.length;
    const i = ((index % total) + total) % total;
    this.carouselIndex = i;

    const img = document.getElementById('gallery-main-img');
    if (img) {
      img.src = gallery[i].src;
      img.alt = gallery[i].alt;
    }

    const strip = document.querySelector('.gallery-thumbs');
    document.querySelectorAll('.gallery-thumb').forEach((thumb, idx) => {
      const on = idx === i;
      thumb.classList.toggle('active', on);
      thumb.setAttribute('aria-selected', String(on));

      // Kéo thumbnail đang chọn vào tầm nhìn bằng scrollLeft thay vì scrollIntoView.
      // scrollIntoView ép trình duyệt cập nhật layout/compositing của cả trang,
      // gây treo khi khung chứa đang ẩn.
      if (on && strip) {
        const left = thumb.offsetLeft;
        const right = left + thumb.offsetWidth;
        if (left < strip.scrollLeft) strip.scrollLeft = left;
        else if (right > strip.scrollLeft + strip.clientWidth) strip.scrollLeft = right - strip.clientWidth;
      }
    });
  },

  /** Lùi / tiến một ảnh, quay vòng ở hai đầu. */
  stepGallery: function(delta) {
    this.switchGallery(this.carouselIndex + delta);
  },

  changeQty: function(delta) {
    const input = document.getElementById('product-qty');
    if (!input) return;
    const val = Math.max(1, (parseInt(input.value, 10) || 1) + delta);
    input.value = val;
    return val;
  },

  /** Mua thẳng từ trang sản phẩm: ghi số lượng rồi sang màn nhận hàng. */
  buyNow: function() {
    const input = document.getElementById('product-qty');
    MedigoStore.setOrderQty(input ? input.value : 1);
    MedigoApp.navigate('A2');
  },

  /** Sao chép có phản hồi, thay cho alert() thuần. */
  copyText: function(text, message) {
    const done = () => this.toast(message || 'Đã sao chép.');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(done);
    } else {
      done();
    }
  },

  /**
   * Chia sẻ link giới thiệu qua hộp chia sẻ của hệ điều hành.
   * Máy/trình duyệt không hỗ trợ thì lùi về sao chép vào bộ nhớ tạm.
   */
  shareLink: function(url) {
    const link = /^https?:\/\//.test(url) ? url : 'https://' + url;
    if (navigator.share) {
      navigator.share({ title: 'Medigo GoCare', url: link })
        .catch(() => {}); // người dùng bấm hủy — không phải lỗi
      return;
    }
    this.copyText(link, 'Trình duyệt chưa hỗ trợ chia sẻ. Đã sao chép link vào bộ nhớ tạm.');
  },

  /** Thông báo ngắn góc màn hình. */
  toast: function(message) {
    let el = document.getElementById('medigo-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'medigo-toast';
      el.className = 'toast';
      el.setAttribute('role', 'status');
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
  },

  // ====================================================
  // A2: Thông tin nhận hàng
  // ====================================================
  renderA2: function(container) {
    const p = MEDIGO_CONFIG.product;
    const seller = MedigoStore.getSeller();
    const affId = MedigoStore.getAffId();
    const qty = MedigoStore.getOrderQty();
    const total = p.price * qty;
    const selectedPay = MedigoStore.getPaymentMethod();

    container.innerHTML = `
      <div class="web-wrapper">
        ${this.renderWebHeader()}

        <div class="page-wide">
          <h2 class="page-title">Thông tin nhận hàng &amp; Thanh toán</h2>

          <form id="checkout-form" novalidate onsubmit="return MedigoViews.submitCheckout(event)">
           <!-- Bố cục 2 cột theo mockup: trái = thông tin nhận hàng, phải = đơn hàng + thanh toán -->
           <div class="checkout-grid">
            <div class="checkout-main">
            <div class="section-card bordered">
              <h3 class="card-title">Thông tin nhận hàng</h3>

              <div class="form-grid-2">
                <div class="form-group">
                  <label for="ck-name">Họ tên <span class="required">*</span></label>
                  <input type="text" id="ck-name" class="form-control" value="${this.esc(seller.fullName)}" required>
                </div>
                <div class="form-group">
                  <label for="ck-phone">Số điện thoại <span class="required">*</span></label>
                  <input type="tel" id="ck-phone" class="form-control" value="${this.esc(seller.phone)}" required>
                </div>
              </div>

              <div class="form-grid-2">
                <div class="form-group" id="grp-email-1">
                  <label for="email-1">Email <span class="required">*</span></label>
                  <input type="email" id="email-1" class="form-control" value="${this.esc(seller.email)}" required
                         oninput="MedigoViews.validateEmailPair()">
                  <p class="error-message" id="err-email-1" hidden></p>
                </div>
                <div class="form-group">
                  <label for="ck-cccd">Số CCCD <span class="required">*</span></label>
                  <input type="text" id="ck-cccd" class="form-control" inputmode="numeric"
                         value="${this.esc(seller.cccd)}" required>
                </div>
              </div>

              <!-- Nhập lại email: email là kênh giao mã kích hoạt, gõ sai là mất hàng.
                   Spec mục A2 đặt đây là ràng buộc bắt buộc. -->
              <div class="form-group" id="grp-email-2">
                <label for="email-2">Nhập lại Email xác nhận <span class="required">*</span></label>
                <input type="email" id="email-2" class="form-control" value="${this.esc(seller.email)}" required
                       onpaste="return false" oninput="MedigoViews.validateEmailPair()">
                <p class="error-message" id="err-email-2" hidden></p>
              </div>

              <div class="callout callout-warning">
                ${this.icon('warning', 20)}
                <div><strong>Lưu ý quan trọng:</strong> Mã kích hoạt phần mềm sẽ được gửi trực tiếp tới Email này.
                Vui lòng kiểm tra thật kỹ trước khi thanh toán.</div>
              </div>

              <div class="form-group">
                <label for="ck-address">Địa chỉ <span class="required">*</span></label>
                <input type="text" id="ck-address" class="form-control" value="${this.esc(seller.address)}" required>
              </div>

              <!-- Địa chỉ hai cấp: Tỉnh/Thành phố → Phường/Xã (đã bỏ cấp Quận/Huyện) -->
              <div class="form-grid-2">
                <div class="form-group">
                  <label for="ck-city">Tỉnh/Thành phố <span class="required">*</span></label>
                  <select id="ck-city" class="form-control" onchange="MedigoViews.onCityChange()">
                    ${Object.keys(this.addressTree).map(c =>
                      `<option ${c === seller.city ? 'selected' : ''}>${this.esc(c)}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label for="ck-ward">Phường/Xã <span class="required">*</span></label>
                  <select id="ck-ward" class="form-control"></select>
                </div>
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label for="ck-dob">Ngày sinh</label>
                  <input type="text" id="ck-dob" class="form-control" placeholder="dd/mm/yyyy"
                         value="${this.esc(seller.dob)}">
                </div>
                <div class="form-group">
                  <label for="ck-gender">Giới tính</label>
                  <select id="ck-gender" class="form-control">
                    ${['Nam', 'Nữ', 'Khác'].map(g =>
                      `<option ${g === seller.gender ? 'selected' : ''}>${g}</option>`).join('')}
                  </select>
                </div>
              </div>

              <hr class="divider">

              <h3 class="card-title">Thông tin nhận hoa hồng</h3>

              <div class="form-grid-2">
                <div class="form-group">
                  <label for="ck-bank">Ngân hàng <span class="required">*</span></label>
                  <select id="ck-bank" class="form-control">
                    ${MEDIGO_CONFIG.banks.map(b =>
                      `<option ${b === seller.bankName ? 'selected' : ''}>${this.esc(b)}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label for="ck-acc">Số tài khoản <span class="required">*</span></label>
                  <input type="text" id="ck-acc" class="form-control" inputmode="numeric"
                         value="${this.esc(seller.bankAccountNo)}" required>
                </div>
              </div>

              <!-- Mã giới thiệu ghi nhận tự động từ link của seller, KHÔNG cho sửa tại đây:
                   sửa được đồng nghĩa hoa hồng có thể bị gán sai người. -->
              <div class="form-group">
                <label for="ck-aff">Mã giới thiệu</label>
                ${affId ? `
                  <div class="locked-field">
                    <input type="text" id="ck-aff" class="form-control" value="${this.esc(affId)}"
                           readonly aria-readonly="true">
                    ${this.icon('key', 18, 'color: var(--c5)')}
                  </div>
                  <span class="text-sm text-muted">
                    Ghi nhận tự động từ link giới thiệu bạn đã bấm. Không thể chỉnh sửa.
                  </span>
                ` : `
                  <div class="locked-field">
                    <input type="text" id="ck-aff" class="form-control" value="Không có"
                           readonly aria-readonly="true">
                  </div>
                  <span class="text-sm text-muted">
                    Bạn không vào qua link giới thiệu nào nên đơn hàng không gắn mã giới thiệu.
                  </span>
                `}
              </div>

              <p class="text-sm text-muted">Thông tin ngân hàng chỉ hiển thị đầy đủ trong khu vực quản trị nội bộ.</p>
            </div>

            <div class="section-card bordered">
              <h3 class="card-title">Hình thức thanh toán</h3>
              <!-- Hai cổng thanh toán lấy đúng theo mockup 26/08 khách đã xem -->
              ${MEDIGO_CONFIG.paymentMethods.map(pm => `
                <label class="payment-option ${pm.id === selectedPay ? 'is-selected' : ''}" for="ck-pay-${pm.id}">
                  <input type="radio" id="ck-pay-${pm.id}" name="payment" value="${pm.id}"
                         ${pm.id === selectedPay ? 'checked' : ''}
                         onchange="MedigoViews.selectPaymentMethod(this.value)">
                  <span class="payment-logo" style="background: ${pm.brandColor}">${this.esc(pm.logoText)}</span>
                  <span>
                    <strong>${this.esc(pm.label)}</strong>
                    <span class="text-sm text-muted">Quét mã QR trên ứng dụng, xác nhận tức thì sau khi chuyển tiền thành công</span>
                  </span>
                </label>`).join('')}
            </div>
            </div><!-- /checkout-main -->

            <!-- Cột phải: Thông tin đơn hàng + Thanh toán (dính khi cuộn trên desktop) -->
            <aside class="checkout-aside">
              <div class="section-card bordered">
                <h3 class="card-title">Thông tin đơn hàng</h3>
                <div class="order-item">
                  <img src="${p.gallery[0].src}" alt="${this.esc(p.shortName)}" class="order-item-thumb" loading="lazy">
                  <div class="order-item-body">
                    <div class="order-item-name">${this.esc(p.code)} — ${this.esc(p.shortName)}</div>
                    <div class="text-sm text-muted">Giá: ${this.formatMoney(p.price)} × ${qty}</div>
                  </div>
                </div>
              </div>

              <div class="section-card bordered">
                <h3 class="card-title">Thanh toán</h3>
                <div class="summary-line">
                  <span>Tạm tính</span>
                  <span class="text-bold">${this.formatMoney(total)}</span>
                </div>
                <div class="summary-line">
                  <span>Phí vận chuyển</span>
                  <span class="text-muted">Miễn phí</span>
                </div>
                <hr class="divider">
                <div class="summary-total">
                  <span>Thành tiền</span>
                  <span class="text-price">${this.formatMoney(total)}</span>
                </div>
                <button type="submit" class="btn btn-primary btn-full btn-lg checkout-submit">Thanh toán ngay</button>
              </div>
            </aside>
           </div><!-- /checkout-grid -->
          </form>
        </div>

        ${this.qrModalMarkup()}
      </div>
    `;

    // Nạp Phường/Xã theo tỉnh, giữ lại phường đang có trong hồ sơ
    this.fillWards('ck-city', 'ck-ward', seller.ward);
  },

  /**
   * Dữ liệu địa giới rút gọn cho prototype.
   * Địa chỉ chỉ còn HAI CẤP: Tỉnh/Thành phố → Phường/Xã (đã bỏ cấp Quận/Huyện).
   * Cấu trúc vì thế là { tỉnh: [danh sách phường/xã] } thay vì lồng ba tầng.
   */
  addressTree: {
    'Hà Nội': [
      'Phường Hà Đông', 'Phường Thanh Xuân', 'Phường Cầu Giấy',
      'Phường Ba Đình', 'Phường Hoàn Kiếm', 'Phường Đống Đa', 'Phường Tây Hồ'
    ],
    'TP. Hồ Chí Minh': [
      'Phường Sài Gòn', 'Phường Bến Thành', 'Phường Chợ Lớn',
      'Phường Bình Thạnh', 'Phường Gia Định', 'Phường Thủ Đức'
    ]
  },

  /** Ghi nhớ cổng thanh toán khách chọn để màn QR (A3) dùng lại. */
  selectPaymentMethod: function(id) {
    MedigoStore.setPaymentMethod(id);
    document.querySelectorAll('.payment-option').forEach(el => {
      const input = el.querySelector('input[type="radio"]');
      el.classList.toggle('is-selected', !!input && input.value === id);
    });
  },

  /**
   * Đổi Tỉnh/Thành phố thì nạp lại danh sách Phường/Xã (địa chỉ hai cấp).
   * `selected` dùng để giữ lại phường đang có trong hồ sơ khi vẽ lần đầu.
   */
  fillWards: function(citySelectId, wardSelectId, selected) {
    const city = document.getElementById(citySelectId);
    const ward = document.getElementById(wardSelectId);
    if (!city || !ward) return;
    const wards = this.addressTree[city.value] || [];
    ward.innerHTML = wards.map(w =>
      `<option ${w === selected ? 'selected' : ''}>${this.esc(w)}</option>`).join('');
  },

  onCityChange: function() {
    this.fillWards('ck-city', 'ck-ward');
  },

  onSellerCityChange: function() {
    this.fillWards('sg-city', 'sg-ward');
  },

  /**
   * Kiểm tra cặp email. Đây là ràng buộc quan trọng nhất của A2:
   * mã kích hoạt chỉ gửi qua email, nhập sai đồng nghĩa khách trả 10 triệu mà không nhận được hàng.
   */
  validateEmailPair: function(showEmpty) {
    const e1 = document.getElementById('email-1');
    const e2 = document.getElementById('email-2');
    if (!e1 || !e2) return true;

    const setError = (input, groupId, errId, message) => {
      const group = document.getElementById(groupId);
      const err = document.getElementById(errId);
      if (!group || !err) return;
      group.classList.toggle('has-error', !!message);
      err.textContent = message || '';
      err.hidden = !message;
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
    };

    const v1 = e1.value.trim();
    const v2 = e2.value.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    let msg1 = '';
    if (!v1) { if (showEmpty) msg1 = 'Vui lòng nhập email.'; }
    else if (!emailRe.test(v1)) msg1 = 'Email chưa đúng định dạng.';
    setError(e1, 'grp-email-1', 'err-email-1', msg1);

    let msg2 = '';
    if (!v2) { if (showEmpty) msg2 = 'Vui lòng nhập lại email để xác nhận.'; }
    else if (v1 && v2 !== v1) msg2 = 'Hai email chưa khớp nhau. Vui lòng kiểm tra lại.';
    setError(e2, 'grp-email-2', 'err-email-2', msg2);

    return !msg1 && !msg2 && !!v1 && v1 === v2;
  },

  submitCheckout: function(event) {
    event.preventDefault();
    const form = event.target;

    if (!this.validateEmailPair(true)) {
      const bad = form.querySelector('.has-error .form-control');
      if (bad) { bad.focus(); bad.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
      return false;
    }
    if (!form.checkValidity()) {
      form.reportValidity();
      return false;
    }

    const val = (id) => (document.getElementById(id) || {}).value || '';
    const cccd = val('ck-cccd').trim();
    const acc = val('ck-acc').trim();

    const fail = (id, message) => {
      const input = document.getElementById(id);
      const group = input && input.closest('.form-group');
      if (group) {
        group.classList.add('has-error');
        let err = group.querySelector('.error-message');
        if (!err) {
          err = document.createElement('p');
          err.className = 'error-message';
          group.appendChild(err);
        }
        err.textContent = message;
        err.hidden = false;
      }
      if (input) { try { input.focus(); } catch (e) {} input.scrollIntoView({ block: 'center' }); }
      return false;
    };

    form.querySelectorAll('.form-group.has-error').forEach(g => g.classList.remove('has-error'));
    if (!/^\d{9,12}$/.test(cccd)) return fail('ck-cccd', 'Số CCCD gồm 9 đến 12 chữ số.');
    if (!/^\d{6,20}$/.test(acc)) return fail('ck-acc', 'Số tài khoản chỉ gồm chữ số, độ dài 6 đến 20.');

    // Lưu lại để bước đăng ký seller (A6) điền sẵn được — Spec mục A6.
    MedigoStore.saveSeller({
      fullName: val('ck-name').trim(),
      shortName: this.shortenName(val('ck-name').trim()),
      phone: val('ck-phone').trim(),
      email: val('email-1').trim(),
      cccd: cccd,
      address: val('ck-address').trim(),
      city: val('ck-city'),
      ward: val('ck-ward'),
      dob: val('ck-dob').trim(),
      gender: val('ck-gender')
    });
    MedigoStore.saveSellerBank({
      bankName: val('ck-bank'),
      bankAccountNo: acc,
      bankAccountOwner: MedigoStore.getSeller().bankAccountOwner
    });

    // aff_id không đọc lại từ form: ô đó chỉ để đọc, giá trị thật đã lưu
    // từ lúc khách bấm link giới thiệu (xem MedigoApp.captureAffId).

    // Không rời trang: mở modal QR đè lên màn nhận hàng (theo mockup)
    this.openQrModal();
    return false;
  },

  // ====================================================
  // A3: Thanh toán QR — dựng dạng MODAL đè lên màn nhận hàng (A2),
  //     đúng theo mockup 26/08 (state showQRPayment, không phải màn riêng).
  //     Route A3 vẫn giữ để link sâu và thanh chuyển màn demo còn dùng được.
  // ====================================================
  renderA3: function(container) {
    this.renderA2(container);
    this.openQrModal();
  },

  /** Mã đơn dùng cho nội dung chuyển khoản. */
  orderRef: 'MDG88492',

  /** Khối HTML của modal QR, được nhúng sẵn trong A2. */
  qrModalMarkup: function() {
    const config = MEDIGO_CONFIG;
    const qty = MedigoStore.getOrderQty();
    const total = config.product.price * qty;
    const ref = this.orderRef;
    const pay = MEDIGO_RULES.paymentMethod(MedigoStore.getPaymentMethod());
    const secs = config.qrPayment.timeoutSeconds;
    const mm = String(Math.floor(secs / 60)).padStart(2, '0');
    const ss = String(secs % 60).padStart(2, '0');

    return `
      <div id="qr-modal" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="qr-modal-title"
           onclick="if(event.target===this) MedigoViews.closeQrModal()">
        <div class="modal-card qr-modal-card">
          <div class="qr-modal-head">
            <div>
              <h3 id="qr-modal-title" class="modal-title">Quét mã để thanh toán</h3>
              <p class="text-sm text-muted">Đơn hàng #${this.esc(ref)}</p>
            </div>
            <button class="modal-close" aria-label="Đóng" onclick="MedigoViews.closeQrModal()">✕</button>
          </div>

          <div class="qr-frame">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=GOCARE_${ref}_${pay.id}"
                 alt="Mã QR thanh toán đơn ${this.esc(ref)} qua ${this.esc(pay.shortLabel)}" width="200" height="200">
            <div class="qr-provider">
              <span class="payment-logo" style="background: ${pay.brandColor}">${this.esc(pay.logoText)}</span>
              <span>MÃ QR MOCKUP · ${this.esc(pay.shortLabel)}</span>
            </div>
          </div>

          <div class="qr-timer-block">
            <span class="text-sm text-muted">Mã QR hết hạn sau:</span>
            <span id="qr-timer" class="qr-timer" role="timer" aria-live="off">${mm}:${ss}</span>
          </div>

          <div class="qr-info">
            <div class="summary-line">
              <span>Số tiền</span>
              <strong class="text-primary">${this.formatMoney(total)}</strong>
            </div>
            <div class="summary-line">
              <span>Nội dung CK</span>
              <span class="copy-inline">
                <strong>MEDIGO ${this.esc(ref)}</strong>
                <button class="ref-copy-btn" data-copy="MEDIGO ${this.esc(ref)}" aria-label="Sao chép nội dung chuyển khoản"
                        onclick="MedigoViews.copyText(this.dataset.copy, 'Đã sao chép nội dung chuyển khoản.')">
                  ${this.icon('copy', 18)}
                </button>
              </span>
            </div>
            <div class="summary-line">
              <span>Người nhận</span>
              <strong>GoCare Medigo</strong>
            </div>
          </div>

          <div class="waiting-row">
            <span class="btn loading waiting-spinner"></span>
            <span>Đang chờ nhận tín hiệu thanh toán...</span>
          </div>

          <button class="btn btn-primary btn-full btn-lg" onclick="MedigoApp.navigate('A4')">Thanh toán</button>

          <div class="qr-modal-foot">
            <button class="btn btn-link" onclick="MedigoViews.closeQrModal()">Đổi hình thức thanh toán</button>
            <button class="btn btn-link" onclick="MedigoApp.navigate('A5?state=expired')">Hủy đơn hàng</button>
          </div>
        </div>
      </div>
    `;
  },

  /** Mở modal QR và chạy đồng hồ đếm ngược. */
  openQrModal: function() {
    const modal = document.getElementById('qr-modal');
    if (!modal) return;

    modal.classList.add('active');
    this._qrEsc = (e) => { if (e.key === 'Escape') this.closeQrModal(); };
    document.addEventListener('keydown', this._qrEsc);
    const close = modal.querySelector('.modal-close');
    if (close) close.focus();

    // Giữ hash ở A3 để link sâu và nút Back hoạt động đúng
    if (MedigoApp.currentScreen !== 'A3') MedigoApp.navigate('A3');

    const config = MEDIGO_CONFIG;
    let secondsLeft = config.qrPayment.timeoutSeconds;
    if (window.qrInterval) clearInterval(window.qrInterval);
    window.qrInterval = setInterval(() => {
      secondsLeft--;
      const timerEl = document.getElementById('qr-timer');
      if (!timerEl) { clearInterval(window.qrInterval); window.qrInterval = null; return; }

      const m = String(Math.floor(Math.max(0, secondsLeft) / 60)).padStart(2, '0');
      const s = String(Math.max(0, secondsLeft) % 60).padStart(2, '0');
      timerEl.textContent = `${m}:${s}`;

      if (secondsLeft < config.qrPayment.warningSeconds) timerEl.classList.add('is-warning');

      if (secondsLeft <= 0) {
        clearInterval(window.qrInterval);
        window.qrInterval = null;
        MedigoApp.navigate('A5?state=expired');
      }
    }, 1000);
  },

  /** Đóng modal, dừng đồng hồ, quay về màn nhận hàng. */
  closeQrModal: function() {
    const modal = document.getElementById('qr-modal');
    if (modal) modal.classList.remove('active');
    if (window.qrInterval) { clearInterval(window.qrInterval); window.qrInterval = null; }
    if (this._qrEsc) { document.removeEventListener('keydown', this._qrEsc); this._qrEsc = null; }
    if (MedigoApp.currentScreen === 'A3') MedigoApp.navigate('A2');
  },

  // ====================================================
  // A4: Thanh toán Thành công + Popup Mời Seller
  // ====================================================
  renderA4: function(container) {
    const p = MEDIGO_CONFIG.product;
    const seller = MedigoStore.getSeller();
    const orders = MedigoStore.getOrders();
    const order = orders[0];
    const qty = MedigoStore.getOrderQty();

    container.innerHTML = `
      <div class="web-wrapper text-center">
        ${this.renderWebHeader()}

        <div class="page-narrow page-narrow-sm">
          <div class="result-icon result-icon-success">${this.icon('check', 54)}</div>

          <h1 class="result-title">Thanh toán thành công</h1>
          <p class="page-lead">Mã đơn hàng: <strong>${this.esc(order.orderId)}</strong></p>

          <div class="activation-code-box">
            <span class="badge badge-pending">Chờ kích hoạt</span>
            <div class="activation-code-label">Mã kích hoạt phần mềm Bác sĩ 24/7</div>
            <div class="activation-code-text">${this.esc(order.activationKey.code)}</div>
            <button class="btn btn-secondary" data-copy="${this.esc(order.activationKey.code)}"
                    onclick="MedigoViews.copyText(this.dataset.copy, 'Đã sao chép mã kích hoạt.')">
              Sao chép mã phần mềm
            </button>
            <p class="activation-code-note">
              Mã đã được gửi tới email của bạn. Mã sẽ được kích hoạt khi bạn nhận được đồng hồ HW01.
              Thời hạn ${MEDIGO_CONFIG.product.durationDays} ngày tính từ ngày kích hoạt.
            </p>
          </div>

          <div class="section-card bordered text-left">
            <h3 class="card-title">Tóm tắt đơn hàng</h3>
            <div class="summary-line">
              <span>${this.esc(p.shortName)} × ${qty}</span>
              <span class="text-bold">${this.formatMoney(p.price * qty)}</span>
            </div>
            <hr class="divider">
            <div class="summary-line"><span>Người nhận:</span><strong>${this.esc(seller.fullName)} · ${this.esc(seller.phone)}</strong></div>
            <div class="summary-line"><span>Địa chỉ giao:</span><strong class="text-right">${this.esc(seller.address)}</strong></div>
          </div>

          <div class="result-actions">
            <button class="btn btn-primary btn-lg" onclick="MedigoApp.navigate('A13')">Xem đơn hàng của tôi</button>
            <button class="btn btn-secondary btn-lg" onclick="MedigoApp.navigate('A6')">Đăng ký làm Seller ngay</button>
          </div>
        </div>

        <div id="seller-invite-modal" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="seller-invite-title"
             onclick="if(event.target===this) MedigoViews.closeModal('seller-invite-modal')">
          <div class="modal-card text-center">
            <button class="modal-close modal-close-corner" aria-label="Đóng" onclick="MedigoViews.closeModal('seller-invite-modal')">✕</button>
            <div class="modal-icon">${this.icon('gift', 36)}</div>
            <h2 id="seller-invite-title" class="modal-title">Đăng ký thành viên Seller</h2>
            <p class="modal-text">
              Bạn có muốn đăng ký làm seller Medigo để nhận hoa hồng giới thiệu hấp dẫn từ GoCare không?
            </p>
            <div class="modal-actions-column">
              <button class="btn btn-primary btn-full btn-lg" onclick="MedigoApp.navigate('A6')">Đăng ký thành viên ngay</button>
              <button class="btn btn-link" onclick="MedigoViews.closeModal('seller-invite-modal')">Không, thoát ra</button>
            </div>
          </div>
        </div>
      </div>
    `;

    MedigoStore.resetOrderQty();

    setTimeout(() => this.openModal('seller-invite-modal'), 1000);
  },

  openModal: function(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('active');
    this._escHandler = (e) => { if (e.key === 'Escape') this.closeModal(id); };
    document.addEventListener('keydown', this._escHandler);
    const first = modal.querySelector('.btn-primary, .modal-close');
    if (first) first.focus();
  },

  closeModal: function(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
    if (this._escHandler) {
      document.removeEventListener('keydown', this._escHandler);
      this._escHandler = null;
    }
  },

  // ====================================================
  // A5: Thanh toán thất bại / QR hết hạn / Đang xác nhận
  // ====================================================
  renderA5: function(container, stateParam = 'expired') {
    const config = MEDIGO_CONFIG;

    const states = {
      expired: {
        variant: 'error',
        title: 'Mã QR đã hết hạn',
        desc: 'Thời gian thực hiện giao dịch đã kết thúc. Vui lòng tạo mã QR mới.',
        buttons: `
          <button class="btn btn-primary btn-full btn-lg" onclick="MedigoApp.navigate('A3')">Tạo mã mới</button>
          <button class="btn btn-secondary btn-full" onclick="MedigoApp.navigate('A2')">Quay lại thông tin đơn hàng</button>`
      },
      failed: {
        variant: 'error',
        title: 'Thanh toán không thành công',
        desc: 'Giao dịch bị gián đoạn hoặc không thành công. Vui lòng kiểm tra lại tài khoản.',
        buttons: `
          <button class="btn btn-primary btn-full btn-lg" onclick="MedigoApp.navigate('A3')">Thử lại</button>
          <button class="btn btn-secondary btn-full" data-hotline="${this.esc(config.company.hotline)}"
                  onclick="MedigoViews.toast('Tổng đài hỗ trợ: ' + this.dataset.hotline)">Liên hệ hỗ trợ</button>`
      },
      confirming: {
        variant: 'warning',
        title: 'Đang xác nhận thanh toán',
        desc: 'Hệ thống đang đối soát dữ liệu ngân hàng. Quá trình có thể mất vài phút...',
        buttons: `<div class="btn loading btn-processing">Đang xử lý...</div>`
      }
    };

    const s = states[stateParam] || states.expired;

    container.innerHTML = `
      <div class="web-wrapper text-center">
        ${this.renderWebHeader()}

        <div class="page-narrow page-narrow-sm">
          <div class="demo-variant-switch">
            ${Object.keys(states).map(k => `
              <button class="btn btn-secondary btn-compact ${k === stateParam ? 'active' : ''}"
                      onclick="MedigoApp.navigate('A5?state=${k}')">${this.esc(states[k].title)}</button>`).join('')}
          </div>

          <div class="result-icon result-icon-${s.variant}">${this.icon('warning', 44)}</div>

          <h2 class="result-title">${this.esc(s.title)}</h2>
          <p class="page-lead">${this.esc(s.desc)}</p>

          <div class="result-actions-column">${s.buttons}</div>

          <div class="hotline-note">
            Tổng đài hỗ trợ 24/7: <strong class="text-primary">${this.esc(config.company.hotline)}</strong>
          </div>
        </div>
      </div>
    `;
  },

  // ====================================================
  // A6 -> A9: Luồng Đăng ký Seller
  // ====================================================
  renderA6: function(container) {
    const seller = MedigoStore.getSeller();

    container.innerHTML = `
      <div class="web-wrapper">
        ${this.renderWebHeader()}

        <div class="page-narrow page-narrow-md">
          <div class="step-bar">
            <div class="step-item active">1</div>
            <div class="step-item">2</div>
            <div class="step-item">3</div>
          </div>
          <div class="step-heading">
            <h2>Thông tin đăng ký</h2>
            <p class="step-subtitle">Bước 1/3 · Thông tin cá nhân &amp; nhận hoa hồng</p>
          </div>

          <div class="callout callout-info">
            ${this.icon('info', 20)}
            <div>Chúng tôi đã điền sẵn thông tin từ đơn hàng của bạn. Vui lòng kiểm tra lại.</div>
          </div>

          <form id="seller-profile-form" novalidate
                onsubmit="return MedigoViews.submitSellerProfile(event)">
            <div class="section-card bordered">
              <h3 class="card-title">Thông tin cá nhân</h3>

              <div class="form-grid-2">
                <div class="form-group">
                  <label for="sg-name">Họ và tên <span class="required">*</span></label>
                  <input type="text" id="sg-name" class="form-control" value="${this.esc(seller.fullName)}" required>
                </div>
                <div class="form-group">
                  <label for="sg-phone">Số điện thoại <span class="required">*</span></label>
                  <input type="tel" id="sg-phone" class="form-control" value="${this.esc(seller.phone)}" required>
                </div>
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label for="sg-email">Email <span class="required">*</span></label>
                  <input type="email" id="sg-email" class="form-control" value="${this.esc(seller.email)}" required>
                </div>
                <div class="form-group">
                  <label for="sg-cccd">Số CCCD <span class="required">*</span></label>
                  <input type="text" id="sg-cccd" class="form-control" value="${this.esc(seller.cccd)}" required>
                </div>
              </div>

              <div class="form-group">
                <label for="sg-address">Địa chỉ <span class="required">*</span></label>
                <input type="text" id="sg-address" class="form-control" value="${this.esc(seller.address)}" required>
              </div>

              <!-- Địa chỉ hai cấp: Tỉnh/Thành phố → Phường/Xã (đã bỏ cấp Quận/Huyện) -->
              <div class="form-grid-2">
                <div class="form-group">
                  <label for="sg-city">Tỉnh/Thành phố <span class="required">*</span></label>
                  <select id="sg-city" class="form-control" onchange="MedigoViews.onSellerCityChange()">
                    ${Object.keys(this.addressTree).map(c =>
                      `<option ${c === seller.city ? 'selected' : ''}>${this.esc(c)}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label for="sg-ward">Phường/Xã <span class="required">*</span></label>
                  <select id="sg-ward" class="form-control"></select>
                </div>
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label for="sg-dob">Ngày sinh <span class="required">*</span></label>
                  <input type="text" id="sg-dob" class="form-control" value="${this.esc(seller.dob)}" placeholder="dd/mm/yyyy" required>
                </div>
                <div class="form-group">
                  <label for="sg-gender">Giới tính <span class="required">*</span></label>
                  <select id="sg-gender" class="form-control">
                    ${['Nam', 'Nữ', 'Khác'].map(g =>
                      `<option ${g === seller.gender ? 'selected' : ''}>${g}</option>`).join('')}
                  </select>
                </div>
              </div>
            </div>

            <div class="section-card bordered">
              <h3 class="card-title">Thông tin nhận hoa hồng</h3>
              <div class="form-grid-3">
                <div class="form-group">
                  <label for="sg-bank">Ngân hàng <span class="required">*</span></label>
                  <select id="sg-bank" class="form-control">
                    ${MEDIGO_CONFIG.banks.map(b =>
                      `<option ${b === seller.bankName ? 'selected' : ''}>${b}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label for="sg-acc">Số tài khoản <span class="required">*</span></label>
                  <input type="text" id="sg-acc" class="form-control" value="${this.esc(seller.bankAccountNo)}" required>
                </div>
                <div class="form-group">
                  <label for="sg-owner">Chủ tài khoản <span class="required">*</span></label>
                  <input type="text" id="sg-owner" class="form-control" value="${this.esc(seller.bankAccountOwner)}" required>
                </div>
              </div>
              <p class="text-sm text-muted">Chỉ hiển thị đầy đủ trong khu vực quản trị nội bộ.</p>
            </div>

            <button type="submit" class="btn btn-primary btn-full btn-lg">Tiếp tục sang bước 2</button>
          </form>
        </div>
      </div>
    `;

    // Nạp Phường/Xã theo tỉnh, giữ lại phường đang có trong hồ sơ
    this.fillWards('sg-city', 'sg-ward', seller.ward);
  },

  /**
   * Lưu hồ sơ seller ở bước 1/3 rồi mới sang bước OTP.
   * Trước đây form này chỉ điều hướng, không ghi gì — người dùng sửa họ tên hay
   * số tài khoản xong là mất trắng, và các màn sau vẫn hiện dữ liệu mẫu cũ.
   */
  submitSellerProfile: function(event) {
    event.preventDefault();
    const form = event.target;
    const val = (id) => (document.getElementById(id) || {}).value || '';

    // Xóa lỗi cũ
    form.querySelectorAll('.form-group.has-error').forEach(g => g.classList.remove('has-error'));
    form.querySelectorAll('.error-message').forEach(e => { e.hidden = true; e.textContent = ''; });

    const fail = (id, message) => {
      const input = document.getElementById(id);
      const group = input && input.closest('.form-group');
      if (group) {
        group.classList.add('has-error');
        let err = group.querySelector('.error-message');
        if (!err) {
          err = document.createElement('p');
          err.className = 'error-message';
          group.appendChild(err);
        }
        err.textContent = message;
        err.hidden = false;
      }
      if (input) {
        try { input.focus(); } catch (e) {}
        input.scrollIntoView({ block: 'center' });
      }
      return false;
    };

    const name = val('sg-name').trim();
    const phone = val('sg-phone').trim();
    const email = val('sg-email').trim();
    const cccd = val('sg-cccd').trim();
    const acc = val('sg-acc').trim();
    const owner = val('sg-owner').trim();

    if (name.length < 3) return fail('sg-name', 'Vui lòng nhập họ và tên.');
    if (!/^0\d{9}$/.test(phone)) return fail('sg-phone', 'Số điện thoại gồm 10 chữ số, bắt đầu bằng 0.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return fail('sg-email', 'Email chưa đúng định dạng.');
    if (!/^\d{9,12}$/.test(cccd)) return fail('sg-cccd', 'Số CCCD gồm 9 đến 12 chữ số.');
    if (!/^\d{6,20}$/.test(acc)) return fail('sg-acc', 'Số tài khoản chỉ gồm chữ số, độ dài 6 đến 20.');
    if (owner.length < 3) return fail('sg-owner', 'Vui lòng nhập tên chủ tài khoản.');

    // Hồ sơ cá nhân
    MedigoStore.saveSeller({
      fullName: name,
      shortName: MedigoViews.shortenName(name),
      phone: phone,
      email: email,
      cccd: cccd,
      address: val('sg-address').trim(),
      city: val('sg-city'),
      ward: val('sg-ward'),
      dob: val('sg-dob').trim(),
      gender: val('sg-gender')
    });

    // Tài khoản nhận hoa hồng — ghi cả sang hồ sơ admin để hai bên không lệch
    MedigoStore.saveSellerBank({
      bankName: val('sg-bank'),
      bankAccountNo: acc,
      bankAccountOwner: owner
    });

    MedigoApp.navigate('A7');
    return false;
  },

  /** "Nguyễn Văn A" -> "Nguyễn V. A" (dùng cho danh sách tuyến dưới). */
  shortenName: function(fullName) {
    const parts = String(fullName || '').trim().split(/\s+/);
    if (parts.length < 3) return fullName;
    const first = parts[0];
    const last = parts[parts.length - 1];
    const middle = parts.slice(1, -1).map(w => w.charAt(0).toUpperCase() + '.').join(' ');
    return `${first} ${middle} ${last}`;
  },

  renderA7: function(container) {
    const seller = MedigoStore.getSeller();
    const otpCfg = MEDIGO_CONFIG.otp;
    let resendSeconds = otpCfg.resendSeconds;

    container.innerHTML = `
      <div class="web-wrapper text-center">
        ${this.renderWebHeader()}

        <div class="page-narrow page-narrow-sm">
          <div class="step-bar">
            <div class="step-item done">✓</div>
            <div class="step-item active">2</div>
            <div class="step-item">3</div>
          </div>

          <div class="step-heading">
            <h2>Xác thực OTP</h2>
            <p class="step-subtitle">Bước 2/3 · Mã đã gửi tới <strong>${this.esc(this.maskPhone(seller.phone))}</strong></p>
          </div>

          <div id="otp-container" class="otp-group" onpaste="MedigoViews.handleOtpPaste(event)">
            ${Array.from({ length: otpCfg.length }, (_, i) => `
              <input type="text" inputmode="numeric" maxlength="1" class="otp-box"
                     aria-label="Ký tự thứ ${i + 1} của mã OTP"
                     oninput="MedigoViews.handleOtpInput(this, ${i})"
                     onkeydown="MedigoViews.handleOtpKey(event, ${i})">`).join('')}
          </div>
          <p class="error-message text-center" id="otp-error" hidden></p>

          <div class="otp-resend">
            Không nhận được mã?
            <button id="resend-btn" class="btn btn-link" disabled>Gửi lại (${resendSeconds}s)</button>
          </div>

          <div class="result-actions">
            <button class="btn btn-secondary btn-lg" onclick="MedigoApp.navigate('A6')">Quay lại</button>
            <button class="btn btn-primary btn-lg" onclick="MedigoViews.verifyOtp()">Xác nhận OTP</button>
          </div>

          <div class="demo-hint">
            <small class="demo-hint-label">[MÔ PHỎNG KIỂM THỬ DEMO]</small>
            Mã hợp lệ: <strong>${this.esc(otpCfg.mockCode)}</strong>
          </div>
        </div>
      </div>
    `;

    const firstBox = container.querySelector('.otp-box');
    if (firstBox) firstBox.focus();

    if (window.otpInterval) clearInterval(window.otpInterval);
    window.otpInterval = setInterval(() => {
      resendSeconds--;
      const btn = document.getElementById('resend-btn');
      if (!btn) { clearInterval(window.otpInterval); window.otpInterval = null; return; }

      if (resendSeconds > 0) {
        btn.textContent = `Gửi lại (${resendSeconds}s)`;
      } else {
        btn.disabled = false;
        btn.textContent = 'Gửi lại ngay';
        btn.onclick = () => this.toast('Đã gửi lại mã xác thực.');
        clearInterval(window.otpInterval);
        window.otpInterval = null;
      }
    }, 1000);
  },

  /**
   * Các hàm OTP dùng chung cho nhiều nơi (A7 đăng ký, modal đổi tài khoản thụ hưởng).
   * Truyền id khung chứa để mỗi nơi có bộ ô riêng, mặc định là màn A7.
   */
  otpBoxes: function(containerId) {
    return Array.from(document.querySelectorAll('#' + (containerId || 'otp-container') + ' .otp-box'));
  },

  handleOtpInput: function(input, index, containerId) {
    input.value = input.value.replace(/\D/g, '').slice(0, 1);
    this.clearOtpError(containerId);
    if (input.value) {
      const boxes = this.otpBoxes(containerId);
      if (boxes[index + 1]) boxes[index + 1].focus();
    }
  },

  handleOtpKey: function(event, index, containerId) {
    const boxes = this.otpBoxes(containerId);
    if (event.key === 'Backspace' && !event.target.value && boxes[index - 1]) {
      boxes[index - 1].focus();
      event.preventDefault();
    }
    if (event.key === 'ArrowLeft' && boxes[index - 1]) boxes[index - 1].focus();
    if (event.key === 'ArrowRight' && boxes[index + 1]) boxes[index + 1].focus();
  },

  /** Dán cả chuỗi OTP một lần (Spec A7). */
  handleOtpPaste: function(event, containerId) {
    event.preventDefault();
    const text = (event.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
    const boxes = this.otpBoxes(containerId);
    boxes.forEach((b, i) => { b.value = text[i] || ''; });
    this.clearOtpError(containerId);
    const nextEmpty = boxes.find(b => !b.value) || boxes[boxes.length - 1];
    if (nextEmpty) nextEmpty.focus();
  },

  clearOtpError: function(containerId) {
    const id = containerId || 'otp-container';
    const group = document.getElementById(id);
    const err = document.getElementById(id === 'otp-container' ? 'otp-error' : id + '-error');
    if (group) group.classList.remove('error');
    if (err) { err.hidden = true; err.textContent = ''; }
  },

  /** Hiện lỗi OTP sai cho một khung ô bất kỳ. */
  showOtpError: function(containerId, message) {
    const id = containerId || 'otp-container';
    const group = document.getElementById(id);
    const err = document.getElementById(id === 'otp-container' ? 'otp-error' : id + '-error');
    if (group) group.classList.add('error');
    if (err) { err.textContent = message; err.hidden = false; }
    const boxes = this.otpBoxes(id);
    boxes.forEach(b => { b.value = ''; });
    if (boxes[0]) { try { boxes[0].focus(); } catch (e) {} }
  },

  /** Dựng 6 ô nhập OTP cho một khung chứa. */
  otpInputsMarkup: function(containerId) {
    return Array.from({ length: MEDIGO_CONFIG.otp.length }, (_, i) => `
      <input type="text" inputmode="numeric" maxlength="1" class="otp-box"
             aria-label="Ký tự thứ ${i + 1} của mã OTP"
             oninput="MedigoViews.handleOtpInput(this, ${i}, '${containerId}')"
             onkeydown="MedigoViews.handleOtpKey(event, ${i}, '${containerId}')">`).join('');
  },

  verifyOtp: function() {
    const code = this.otpBoxes().map(b => b.value).join('');
    if (code === MEDIGO_CONFIG.otp.mockCode) {
      MedigoApp.navigate('A8');
      return;
    }
    const group = document.getElementById('otp-container');
    const err = document.getElementById('otp-error');
    if (group) group.classList.add('error');
    if (err) {
      err.textContent = 'Mã không đúng. Vui lòng thử lại.';
      err.hidden = false;
    }
    const boxes = this.otpBoxes();
    boxes.forEach(b => { b.value = ''; });
    if (boxes[0]) boxes[0].focus();
  },

  renderA8: function(container) {
    const taxPercent = Math.round(MEDIGO_CONFIG.withdrawal.taxRate * 100);
    const tiers = MEDIGO_CONFIG.commissionRates.length;

    container.innerHTML = `
      <div class="web-wrapper">
        ${this.renderWebHeader()}

        <div class="page-narrow page-narrow-md">
          <div class="step-bar">
            <div class="step-item done">✓</div>
            <div class="step-item done">✓</div>
            <div class="step-item active">3</div>
          </div>

          <div class="step-heading">
            <h2>Điều khoản tham gia</h2>
            <p class="step-subtitle">Bước 3/3 · Vui lòng đọc và xác nhận</p>
          </div>

          <div class="terms-box">
            <h4 class="terms-title">ĐIỀU KHOẢN CHƯƠNG TRÌNH AFFILIATE MEDIGO — GOCARE</h4>
            <p>Bằng việc tích chọn xác nhận, bạn đồng ý với chính sách hoa hồng ${tiers} tầng, quy định về tuyến trên/tuyến dưới,
               và các điều kiện rút tiền được GoCare quy định.</p>
            <p>1. Hoa hồng được hạch toán khi đơn hàng hoàn tất thanh toán.</p>
            <p>2. Không vi phạm các chính sách truyền thông thương hiệu.</p>
            <p>3. Thuế TNCN sẽ được khấu trừ ${taxPercent}% theo quy định pháp luật hiện hành đối với khoản thu nhập hoa hồng.</p>
            <p class="text-sm text-muted">Nội dung đầy đủ do bộ phận Pháp lý cung cấp trước khi go-live.</p>
          </div>

          <label class="terms-check" for="terms-check">
            <input type="checkbox" id="terms-check"
                   onchange="document.getElementById('confirm-act-btn').disabled = !this.checked">
            <span>Tôi đã đọc và đồng ý với toàn bộ điều khoản tham gia chương trình affiliate Medigo.</span>
          </label>

          <div class="result-actions">
            <button class="btn btn-secondary btn-lg" onclick="MedigoApp.navigate('A7')">Quay lại</button>
            <button id="confirm-act-btn" class="btn btn-primary btn-lg" disabled onclick="MedigoViews.openActivatedModal()">
              Xác nhận &amp; Kích hoạt tài khoản
            </button>
          </div>
        </div>

        ${this.activatedModalMarkup()}
      </div>
    `;
  },

  // ====================================================
  // A9: Kích hoạt seller thành công — dựng dạng MODAL đè lên bước 3 (A8).
  //     Route A9 vẫn giữ để link sâu và thanh chuyển màn demo còn dùng được.
  // ====================================================
  renderA9: function(container) {
    this.renderA8(container);
    this.openActivatedModal();
  },

  /** Khối HTML của modal "Kích hoạt thành công", nhúng sẵn trong A8. */
  activatedModalMarkup: function() {
    const seller = MedigoStore.getSeller();
    const refUrl = this.referralUrl(seller.aff_id);      // URL thật, bấm được
    const refLink = this.referralLabel(seller.aff_id);   // dạng rút gọn để hiển thị

    return `
      <div id="activated-modal" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="activated-title"
           onclick="if(event.target===this) MedigoViews.closeActivatedModal()">
        <div class="modal-card activated-modal-card">
          <button class="modal-close modal-close-corner" aria-label="Đóng" onclick="MedigoViews.closeActivatedModal()">✕</button>

          <div class="result-icon result-icon-success">${this.icon('check', 44)}</div>
          <h2 id="activated-title" class="modal-title">Kích hoạt thành công</h2>
          <p class="modal-text">Bạn đã chính thức là seller Medigo</p>

          <div class="ref-block">
            <span class="text-sm text-muted">Mã giới thiệu (aff_id)</span>
            <!-- Mã giới thiệu để trần: không nền, không nút copy -->
            <div class="ref-code">${this.esc(seller.aff_id)}</div>
          </div>

          <div class="ref-block">
            <span class="text-sm text-muted">Link giới thiệu sản phẩm</span>
            <div class="ref-field">
              <span class="ref-link" title="${this.esc(refLink)}">${this.esc(refLink)}</span>
              <button class="ref-copy-btn" data-copy="${this.esc(refUrl)}"
                      aria-label="Sao chép link giới thiệu"
                      onclick="MedigoViews.copyText(this.dataset.copy, 'Đã sao chép link giới thiệu.')">
                ${this.icon('copy', 20)}
              </button>
            </div>
          </div>

          <div class="modal-actions-column">
            <button class="btn btn-secondary btn-full" data-copy="${this.esc(refUrl)}"
                    onclick="MedigoViews.shareLink(this.dataset.copy)">
              ${this.icon('share', 18)} Chia sẻ link
            </button>
            <button class="btn btn-primary btn-full btn-lg" onclick="MedigoApp.navigate('A10')">Vào dashboard Seller</button>
          </div>
        </div>
      </div>
    `;
  },

  openActivatedModal: function() {
    const modal = document.getElementById('activated-modal');
    if (!modal) return;

    // Từ đây trở đi phiên này chính là seller đó.
    MedigoStore.setAffId(MedigoStore.getSeller().aff_id);

    modal.classList.add('active');
    this._actEsc = (e) => { if (e.key === 'Escape') this.closeActivatedModal(); };
    document.addEventListener('keydown', this._actEsc);
    const first = modal.querySelector('.btn-primary');
    if (first) first.focus();

    if (MedigoApp.currentScreen !== 'A9') MedigoApp.navigate('A9');
  },

  /** Đóng modal — tài khoản đã kích hoạt rồi nên đi tiếp vào dashboard. */
  closeActivatedModal: function() {
    const modal = document.getElementById('activated-modal');
    if (modal) modal.classList.remove('active');
    if (this._actEsc) { document.removeEventListener('keydown', this._actEsc); this._actEsc = null; }
    MedigoApp.navigate('A10');
  },

  // ====================================================
  // A10: Dashboard Seller
  // ====================================================
  renderA10: function(container) {
    const seller = MedigoStore.getSeller();
    const downlines = MedigoStore.getDownlines();
    const history = MedigoStore.getHistory();
    const refUrl = this.referralUrl(seller.aff_id);      // URL thật, bấm được
    const refLink = this.referralLabel(seller.aff_id);   // dạng rút gọn để hiển thị

    // Hạng và tiền hoa hồng đều suy ra từ file cấu hình, không viết cứng.
    const rank = MEDIGO_RULES.rankFor(seller.totalOrders);
    const hasDownline = downlines.some(t => t.memberCount > 0);

    container.innerHTML = `
      <div class="web-wrapper">
        ${this.renderWebHeader('A10')}

        <div class="page-wide">
          <div class="dashboard-header">
            <div>
              <h2 class="page-title">Chào, ${this.esc(seller.fullName)}</h2>
              <div class="text-sm text-muted">Mã giới thiệu (aff_id): <strong class="text-primary">${this.esc(seller.aff_id)}</strong></div>
            </div>
            <button class="btn btn-primary btn-lg" onclick="MedigoApp.navigate('A12')">Yêu cầu rút tiền</button>
          </div>

          <div class="callout callout-info referral-banner">
            <div class="referral-banner-text">
              <div class="text-sm text-muted">Link giới thiệu trực tiếp của bạn:</div>
              <div class="ref-link" title="${this.esc(refLink)}">${this.esc(refLink)}</div>
            </div>
            <div class="referral-banner-actions">
              <button class="btn btn-secondary" data-copy="${this.esc(refUrl)}"
                      onclick="MedigoViews.copyText(this.dataset.copy, 'Đã sao chép link giới thiệu.')">Copy link</button>
              <button class="btn btn-primary" data-copy="${this.esc(refUrl)}"
                      onclick="MedigoViews.shareLink(this.dataset.copy)">Chia sẻ</button>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">Tổng đơn hàng</div>
              <div class="stat-value">${seller.totalOrders}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Điểm tích lũy</div>
              <div class="stat-value">${seller.totalPoints.toLocaleString('vi-VN')}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Hạng hiện tại</div>
              <div class="stat-value"><span class="rank-badge ${rank.badgeClass}">${this.esc(rank.rank)}</span></div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Số dư khả dụng</div>
              <div class="stat-value text-primary">${this.formatMoney(seller.availableBalance)}</div>
            </div>
          </div>

          <div class="dashboard-grid">
            <div>
              <div class="section-card bordered">
                <div class="card-title-row">
                  <h3 class="card-title">Xu hướng hoa hồng</h3>
                  <span class="text-sm text-muted" id="chart-subtitle"></span>
                </div>

                <!-- Bộ lọc khoảng thời gian (theo mockup 26/08: Hôm nay · Tuần · Tháng · Tùy chọn) -->
                <div class="range-tabs" role="group" aria-label="Chọn khoảng thời gian thống kê">
                  ${MEDIGO_CONFIG.statRanges.map(r => `
                    <button class="range-tab ${r.id === this.statRange ? 'active' : ''}"
                            data-range="${r.id}" aria-pressed="${r.id === this.statRange}"
                            onclick="MedigoViews.setStatRange(this.dataset.range)">${this.esc(r.label)}</button>`).join('')}
                </div>

                <div class="range-custom ${this.statRange === 'custom' ? '' : 'is-hidden'}" id="range-custom">
                  <label for="range-from" class="text-sm text-muted">Từ ngày</label>
                  <input type="date" id="range-from" class="form-control" value="${this.esc(this.statFrom)}"
                         onchange="MedigoViews.applyCustomRange()">
                  <label for="range-to" class="text-sm text-muted">đến ngày</label>
                  <input type="date" id="range-to" class="form-control" value="${this.esc(this.statTo)}"
                         onchange="MedigoViews.applyCustomRange()">
                </div>

                <div class="chart-total">
                  Tổng hoa hồng trong kỳ: <strong class="text-success" id="chart-total">—</strong>
                </div>

                <div id="commission-chart-region"></div>
              </div>

              <div class="section-card bordered">
                <h3 class="card-title">Lịch sử phát sinh hoa hồng</h3>
                ${history.length ? history.map(item => {
                  const amount = MEDIGO_RULES.commissionAmount(item.level);
                  return `
                    <div class="history-row">
                      <div>
                        <strong class="text-strong">Đơn #${this.esc(item.id)}</strong>
                        <span class="text-sm text-muted"> · ${this.esc(MEDIGO_RULES.commissionLabel(item.level))}</span>
                        <div class="text-sm text-muted">${this.esc(item.product)} · ${this.esc(item.date)}</div>
                      </div>
                      <div class="text-right">
                        <strong class="text-success history-amount">+${this.formatMoney(amount)}</strong>
                        <div><span class="badge ${this.statusBadgeClass(item.status)}">${this.esc(item.status)}</span></div>
                      </div>
                    </div>`;
                }).join('') : this.emptyState('cash', 'Chưa có hoa hồng phát sinh',
                    'Hoa hồng sẽ xuất hiện tại đây khi đơn hàng của tuyến dưới hoàn tất thanh toán.')}
              </div>
            </div>

            <div>
              <div class="section-card bordered">
                <h3 class="card-title">Mạng lưới tuyến dưới (${MEDIGO_CONFIG.commissionRates.length} Tầng)</h3>
                <p class="text-sm text-muted card-lead">Xem danh sách tổng hợp số lượng &amp; doanh thu theo tầng.</p>

                ${hasDownline ? downlines.map(tier => {
                  // Hoa hồng của tầng = số đơn của tầng × tiền hoa hồng theo tỉ lệ tầng đó.
                  const tierCommission = tier.totalOrders * MEDIGO_RULES.commissionAmount(tier.level);
                  return `
                    <div class="tier-accordion-item" id="tier-item-${tier.level}">
                      <button class="tier-accordion-header" aria-expanded="false"
                              onclick="MedigoViews.toggleTier(${tier.level})">
                        <span>
                          <strong class="text-primary">${MEDIGO_RULES.commissionLabel(tier.level)}</strong>
                          <span class="text-sm text-muted"> · ${tier.memberCount} thành viên · ${tier.totalOrders} đơn</span>
                        </span>
                        <span class="tier-accordion-right">
                          <strong class="text-success">${this.formatMoney(tierCommission)}</strong>
                          ${this.icon('chevron', 18, 'flex-shrink:0')}
                        </span>
                      </button>
                      <div class="tier-accordion-body">
                        ${tier.members.map(m => `
                          <div class="member-mini-row">
                            <strong>${this.esc(m.shortName)}</strong>
                            <span class="text-sm text-muted">Tham gia: ${this.esc(m.joinDate)}</span>
                            <span>${m.orderCount} đơn</span>
                          </div>`).join('')}
                        ${tier.members.length < tier.memberCount ? `
                          <div class="member-mini-more text-sm text-muted">
                            và ${tier.memberCount - tier.members.length} thành viên khác
                          </div>` : ''}
                      </div>
                    </div>`;
                }).join('') : this.emptyState('users', 'Chưa có tuyến dưới',
                    'Chia sẻ link giới thiệu để bắt đầu.',
                    `<button class="btn btn-primary" data-copy="${this.esc(refUrl)}"
                             onclick="MedigoViews.shareLink(this.dataset.copy)">Chia sẻ link</button>`)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Biểu đồ nạp qua khung xương "đang tải" như bảng dữ liệu
    this.withLoading('commission-chart-region', this.chartSkeleton(7), () => this.renderCommissionChart());
  },

  // Trạng thái bộ lọc thống kê của dashboard (A10)
  statRange: MEDIGO_CONFIG.defaultStatRange,
  statFrom: '',
  statTo: '',

  setStatRange: function(rangeId) {
    this.statRange = rangeId;
    document.querySelectorAll('.range-tab').forEach(b => {
      const on = b.dataset.range === rangeId;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    const custom = document.getElementById('range-custom');
    if (custom) custom.classList.toggle('is-hidden', rangeId !== 'custom');
    this.renderCommissionChart();
  },

  applyCustomRange: function() {
    const from = document.getElementById('range-from');
    const to = document.getElementById('range-to');
    this.statFrom = from ? from.value : '';
    this.statTo = to ? to.value : '';
    this.statRange = 'custom';
    this.renderCommissionChart();
  },

  /**
   * Vẽ biểu đồ cột hoa hồng theo khoảng lọc đang chọn.
   * Thang đo lấy theo giá trị lớn nhất thực tế của chính khoảng đó.
   */
  renderCommissionChart: function() {
    const region = document.getElementById('commission-chart-region');
    if (!region) return;

    const series = MedigoStore.getCommissionSeries(this.statRange, this.statFrom, this.statTo);
    const totalEl = document.getElementById('chart-total');
    const subEl = document.getElementById('chart-subtitle');
    if (totalEl) totalEl.textContent = this.formatMoney(series.total);
    if (subEl) subEl.textContent = series.subtitle;

    if (!series.points.length) {
      region.innerHTML = this.emptyState('cash', 'Không có dữ liệu trong khoảng đã chọn',
        'Thử chọn khoảng thời gian khác.');
      return;
    }

    const chartMax = Math.max(1, ...series.points.map(p => p.amount));
    region.innerHTML = `
      <div class="bar-chart" role="img"
           aria-label="Biểu đồ cột hoa hồng — ${this.esc(series.subtitle)}, tổng ${this.formatMoney(series.total)}">
        ${series.points.map(pt => {
          const pct = Math.round((pt.amount / chartMax) * 100);
          return `
            <div class="bar-chart-col" title="${this.esc(pt.label)}: ${this.formatMoney(pt.amount)}">
              <div class="bar-chart-bar" style="height: ${Math.max(4, pct)}%"></div>
              <span class="bar-chart-label">${this.esc(pt.label)}</span>
            </div>`;
        }).join('')}
      </div>`;
  },

  toggleTier: function(level) {
    const item = document.getElementById('tier-item-' + level);
    if (!item) return;
    const open = item.classList.toggle('open');
    const header = item.querySelector('.tier-accordion-header');
    if (header) header.setAttribute('aria-expanded', String(open));
  },

  // ====================================================
  // A11: Đăng nhập Seller
  // ====================================================
  renderA11: function(container) {
    const seller = MedigoStore.getSeller();

    container.innerHTML = `
      <div class="web-wrapper text-center">
        ${this.renderWebHeader()}

        <div class="page-narrow page-narrow-xs">
          <div class="login-intro">
            <h1 class="result-title">Đăng nhập Kênh Seller</h1>
            <p class="page-lead">Dành riêng cho thành viên giới thiệu Medigo</p>
          </div>

          <form onsubmit="event.preventDefault(); MedigoApp.navigate('A7');" class="text-left">
            <div class="form-group">
              <label for="login-phone">Số điện thoại đã đăng ký <span class="required">*</span></label>
              <input type="tel" id="login-phone" class="form-control" value="${this.esc(seller.phone)}" required>
            </div>

            <button type="submit" class="btn btn-primary btn-full btn-lg">Gửi mã OTP đăng nhập</button>
          </form>

          <p class="login-alt">
            <a href="#A6" onclick="event.preventDefault(); MedigoApp.navigate('A6')">Chưa có tài khoản? Đăng ký làm Seller</a>
          </p>
        </div>
      </div>
    `;
  },

  // ====================================================
  // A12: Yêu cầu rút tiền
  // ====================================================
  renderA12: function(container, state = 'form') {
    const seller = MedigoStore.getSeller();
    const w = MEDIGO_CONFIG.withdrawal;

    if (state === 'submitted') {
      const last = MedigoStore.getWithdrawals()[0];
      const calc = MEDIGO_RULES.calcWithdrawal(last ? last.amount : 0);
      container.innerHTML = `
        <div class="web-wrapper text-center">
          ${this.renderWebHeader()}
          <div class="page-narrow page-narrow-sm">
            <div class="result-icon result-icon-success">${this.icon('check', 54)}</div>
            <h1 class="result-title">Đã gửi yêu cầu rút tiền</h1>
            <p class="page-lead">Mã yêu cầu: <strong>${this.esc(last ? last.id : '—')}</strong></p>

            <div class="section-card bordered text-left">
              <div class="summary-line"><span>Trạng thái</span><span class="badge badge-pending">Chờ duyệt</span></div>
              <div class="summary-line"><span>Số tiền yêu cầu</span><strong>${this.formatMoney(calc.amount)}</strong></div>
              <div class="summary-line"><span>Thuế TNCN tạm tính</span><strong class="text-error">${calc.tax ? '-' + this.formatMoney(calc.tax) : 'Không áp dụng'}</strong></div>
              <hr class="divider">
              <div class="summary-total"><span>Thực nhận</span><strong class="text-success">${this.formatMoney(calc.net)}</strong></div>
            </div>

            <p class="page-lead">Thời gian xử lý dự kiến: <strong>${this.esc(w.estimatedProcessingDays)}</strong></p>
            <button class="btn btn-primary btn-full btn-lg" onclick="MedigoApp.navigate('A10')">Về dashboard Seller</button>
          </div>
        </div>
      `;
      return;
    }

    const defaultAmount = Math.min(3000000, seller.availableBalance);

    container.innerHTML = `
      <div class="web-wrapper">
        ${this.renderWebHeader()}

        <div class="page-narrow page-narrow-md">
          <h2 class="page-title">Yêu cầu rút tiền hoa hồng</h2>

          <div class="callout callout-info balance-block">
            <div>
              <span class="text-sm text-muted">Số dư khả dụng hiện tại</span>
              <div class="balance-value">${this.formatMoney(seller.availableBalance)}</div>
            </div>
          </div>

          <form id="withdraw-form" novalidate onsubmit="return MedigoViews.submitWithdrawal(event)">
            <div class="form-group" id="grp-withdraw">
              <div class="label-row">
                <label for="withdraw-amt">Số tiền muốn rút <span class="required">*</span></label>
                <button type="button" class="btn btn-link"
                        onclick="MedigoViews.setWithdrawAmount(${seller.availableBalance})">Rút toàn bộ số dư</button>
              </div>
              <input type="number" id="withdraw-amt" class="form-control"
                     value="${defaultAmount}" min="${w.minAmount}" max="${seller.availableBalance}" step="1000"
                     required oninput="MedigoViews.refreshWithdrawSummary()">
              <span class="text-sm text-muted">
                Ngưỡng tối thiểu mỗi lần rút: ${this.formatMoney(w.minAmount)} ·
                Thuế TNCN ${Math.round(w.taxRate * 100)}% chỉ áp dụng khi rút trên ${this.formatMoney(w.taxThreshold)}
              </span>
              <p class="error-message" id="err-withdraw" hidden></p>
            </div>

            <div class="section-card bordered">
              <div class="card-title-row">
                <strong>Tài khoản ngân hàng thụ hưởng</strong>
                <button class="btn btn-link" onclick="MedigoViews.openChangeBank()">Thay đổi thông tin</button>
              </div>
              <p>Ngân hàng: <strong>${this.esc(seller.bankName)}</strong></p>
              <p>Số tài khoản: <strong>${this.esc(this.maskAccount(seller.bankAccountNo))}</strong></p>
              <p>Chủ tài khoản: <strong>${this.esc(seller.bankAccountOwner)}</strong></p>
            </div>

            <div class="section-card bordered" id="withdraw-summary"></div>

            <button type="submit" class="btn btn-primary btn-full btn-lg">Gửi yêu cầu rút tiền</button>
          </form>
        </div>

        ${this.withdrawConfirmMarkup()}
        ${this.changeBankMarkup()}
      </div>
    `;

    this.refreshWithdrawSummary();
  },

  setWithdrawAmount: function(amount) {
    const input = document.getElementById('withdraw-amt');
    if (!input) return;
    input.value = amount;
    this.refreshWithdrawSummary();
  },

  /** Tính lại tạm tính mỗi khi số tiền đổi — không còn con số cứng trong giao diện. */
  refreshWithdrawSummary: function() {
    const input = document.getElementById('withdraw-amt');
    const box = document.getElementById('withdraw-summary');
    if (!input || !box) return;

    const w = MEDIGO_CONFIG.withdrawal;
    const calc = MEDIGO_RULES.calcWithdrawal(input.value);

    box.innerHTML = `
      <div class="summary-line">
        <span>Số tiền yêu cầu rút:</span>
        <strong class="text-strong">${this.formatMoney(calc.amount)}</strong>
      </div>
      <div class="summary-line">
        <span>Thuế TNCN tạm tính (${Math.round(calc.taxRate * 100)}%):</span>
        <strong class="${calc.taxable ? 'text-error' : 'text-muted'}">
          ${calc.taxable ? '-' + this.formatMoney(calc.tax) : `Không áp dụng (≤ ${this.formatMoney(w.taxThreshold)})`}
        </strong>
      </div>
      <hr class="divider divider-dashed">
      <div class="summary-total">
        <span>Số tiền thực nhận chuyển khoản:</span>
        <strong class="text-success">${this.formatMoney(calc.net)}</strong>
      </div>
    `;

    const seller = MedigoStore.getSeller();
    const check = MEDIGO_RULES.validateWithdrawal(calc.amount, seller.availableBalance);
    this.setWithdrawError(check.ok ? '' : check.message);
  },

  setWithdrawError: function(message) {
    const group = document.getElementById('grp-withdraw');
    const err = document.getElementById('err-withdraw');
    if (!group || !err) return;
    group.classList.toggle('has-error', !!message);
    err.textContent = message || '';
    err.hidden = !message;
  },

  /**
   * Gửi yêu cầu rút tiền: kiểm tra hợp lệ rồi mở modal xác nhận.
   * Trước đây dùng window.confirm() — hộp thoại của trình duyệt hiện tên miền,
   * không theo hệ thiết kế và không định dạng được số tiền cho dễ đọc.
   */
  submitWithdrawal: function(event) {
    event.preventDefault();
    const input = document.getElementById('withdraw-amt');
    const amount = Number(input.value);
    const seller = MedigoStore.getSeller();

    const check = MEDIGO_RULES.validateWithdrawal(amount, seller.availableBalance);
    if (!check.ok) {
      this.setWithdrawError(check.message);
      input.focus();
      return false;
    }

    this.openWithdrawConfirm(amount);
    return false;
  },

  // ====================================================
  // Đổi tài khoản ngân hàng thụ hưởng (mở từ A12)
  //
  // Trước đây liên kết "Thay đổi thông tin" dẫn thẳng vào A6 — bước 1/3 của luồng
  // ĐĂNG KÝ seller — nên người dùng phải khai lại toàn bộ hồ sơ cá nhân, đọc lại
  // điều khoản affiliate, và kết thúc ở màn "Kích hoạt thành công" kèm mã giới thiệu
  // như vừa đăng ký mới. Sai nghiệp vụ: đổi thông tin nhận tiền chỉ cần XÁC THỰC,
  // không tạo lại mã giới thiệu và không đăng ký lại.
  // ====================================================
  changeBankMarkup: function() {
    const seller = MedigoStore.getSeller();
    const banks = MEDIGO_CONFIG.banks;

    return `
      <div id="change-bank-modal" class="modal-backdrop" role="dialog" aria-modal="true"
           aria-labelledby="change-bank-title"
           onclick="if(event.target===this) MedigoViews.closeChangeBank()">
        <div class="modal-card change-bank-card">
          <button class="modal-close modal-close-corner" aria-label="Đóng"
                  onclick="MedigoViews.closeChangeBank()">✕</button>

          <h3 id="change-bank-title" class="modal-title">Đổi tài khoản thụ hưởng</h3>
          <p class="text-sm text-muted" id="change-bank-sub">Cập nhật tài khoản nhận hoa hồng của bạn.</p>

          <!-- Bước 1: nhập thông tin mới -->
          <div id="change-bank-step-form">
            <div class="form-group">
              <label for="cb-bank">Ngân hàng <span class="required">*</span></label>
              <select id="cb-bank" class="form-control">
                ${banks.map(b => `<option ${b === seller.bankName ? 'selected' : ''}>${this.esc(b)}</option>`).join('')}
              </select>
            </div>

            <div class="form-group" id="grp-cb-acc">
              <label for="cb-acc">Số tài khoản <span class="required">*</span></label>
              <input type="text" id="cb-acc" class="form-control" inputmode="numeric"
                     value="${this.esc(seller.bankAccountNo)}"
                     oninput="MedigoViews.clearBankError()">
              <p class="error-message" id="err-cb-acc" hidden></p>
            </div>

            <div class="form-group" id="grp-cb-owner">
              <label for="cb-owner">Chủ tài khoản <span class="required">*</span></label>
              <input type="text" id="cb-owner" class="form-control"
                     value="${this.esc(seller.bankAccountOwner)}"
                     oninput="MedigoViews.clearBankError()">
              <p class="error-message" id="err-cb-owner" hidden></p>
            </div>

            <div class="callout callout-warning">
              ${this.icon('warning', 20)}
              <div>Tên chủ tài khoản phải trùng với hồ sơ CCCD đã đăng ký, nếu không yêu cầu rút tiền sẽ bị từ chối.</div>
            </div>

            <div class="modal-actions">
              <button class="btn btn-secondary btn-lg" onclick="MedigoViews.closeChangeBank()">Hủy</button>
              <button class="btn btn-primary btn-lg" onclick="MedigoViews.startBankOtp()">Tiếp tục</button>
            </div>
          </div>

          <!-- Bước 2: xác thực OTP (KHÔNG tạo lại mã giới thiệu) -->
          <div id="change-bank-step-otp" hidden>
            <p class="modal-text">
              Mã xác nhận đã gửi tới <strong>${this.esc(this.maskPhone(seller.phone))}</strong>
            </p>

            <div id="cb-otp" class="otp-group" onpaste="MedigoViews.handleOtpPaste(event, 'cb-otp')">
              ${this.otpInputsMarkup('cb-otp')}
            </div>
            <p class="error-message text-center" id="cb-otp-error" hidden></p>

            <div class="otp-resend">
              Không nhận được mã?
              <button id="cb-resend-btn" class="btn btn-link" disabled>Gửi lại (${MEDIGO_CONFIG.otp.resendSeconds}s)</button>
            </div>

            <div class="demo-hint">
              <small class="demo-hint-label">[MÔ PHỎNG KIỂM THỬ DEMO]</small>
              Mã hợp lệ: <strong>${this.esc(MEDIGO_CONFIG.otp.mockCode)}</strong>
            </div>

            <div class="modal-actions">
              <button class="btn btn-secondary btn-lg" onclick="MedigoViews.backToBankForm()">Quay lại</button>
              <button class="btn btn-primary btn-lg" id="cb-verify-btn">Xác nhận</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  openChangeBank: function() {
    const modal = document.getElementById('change-bank-modal');
    if (!modal) return;
    this.backToBankForm();
    modal.classList.add('active');
    this._bankEsc = (e) => { if (e.key === 'Escape') this.closeChangeBank(); };
    document.addEventListener('keydown', this._bankEsc);
    const first = document.getElementById('cb-bank');
    if (first) { try { first.focus(); } catch (e) {} }
  },

  closeChangeBank: function() {
    const modal = document.getElementById('change-bank-modal');
    if (modal) modal.classList.remove('active');
    if (window.bankOtpInterval) { clearInterval(window.bankOtpInterval); window.bankOtpInterval = null; }
    if (this._bankEsc) { document.removeEventListener('keydown', this._bankEsc); this._bankEsc = null; }
  },

  backToBankForm: function() {
    const form = document.getElementById('change-bank-step-form');
    const otp = document.getElementById('change-bank-step-otp');
    const sub = document.getElementById('change-bank-sub');
    if (form) form.hidden = false;
    if (otp) otp.hidden = true;
    if (sub) sub.textContent = 'Cập nhật tài khoản nhận hoa hồng của bạn.';
    if (window.bankOtpInterval) { clearInterval(window.bankOtpInterval); window.bankOtpInterval = null; }
    this.clearOtpError('cb-otp');
  },

  clearBankError: function() {
    ['acc', 'owner'].forEach((k) => {
      const g = document.getElementById('grp-cb-' + k);
      const e = document.getElementById('err-cb-' + k);
      if (g) g.classList.remove('has-error');
      if (e) { e.hidden = true; e.textContent = ''; }
    });
  },

  setBankError: function(field, message) {
    const g = document.getElementById('grp-cb-' + field);
    const e = document.getElementById('err-cb-' + field);
    if (g) g.classList.add('has-error');
    if (e) { e.textContent = message; e.hidden = false; }
    const input = document.getElementById('cb-' + field);
    if (input) { try { input.focus(); } catch (err) {} }
  },

  /** Kiểm tra thông tin rồi chuyển sang bước xác thực OTP. */
  startBankOtp: function() {
    this.clearBankError();
    const acc = document.getElementById('cb-acc').value.trim();
    const owner = document.getElementById('cb-owner').value.trim();

    if (!/^\d{6,20}$/.test(acc)) {
      this.setBankError('acc', 'Số tài khoản chỉ gồm chữ số, độ dài 6 đến 20.');
      return;
    }
    if (owner.length < 3) {
      this.setBankError('owner', 'Vui lòng nhập tên chủ tài khoản.');
      return;
    }

    document.getElementById('change-bank-step-form').hidden = true;
    document.getElementById('change-bank-step-otp').hidden = false;
    document.getElementById('change-bank-sub').textContent = 'Xác thực OTP để hoàn tất thay đổi.';

    const verify = document.getElementById('cb-verify-btn');
    verify.onclick = () => this.confirmChangeBank();

    const boxes = this.otpBoxes('cb-otp');
    boxes.forEach(b => { b.value = ''; });
    if (boxes[0]) { try { boxes[0].focus(); } catch (e) {} }

    // Đếm ngược gửi lại mã
    let left = MEDIGO_CONFIG.otp.resendSeconds;
    const btn = document.getElementById('cb-resend-btn');
    btn.disabled = true;
    btn.textContent = `Gửi lại (${left}s)`;
    if (window.bankOtpInterval) clearInterval(window.bankOtpInterval);
    window.bankOtpInterval = setInterval(() => {
      left--;
      const el = document.getElementById('cb-resend-btn');
      if (!el) { clearInterval(window.bankOtpInterval); window.bankOtpInterval = null; return; }
      if (left > 0) {
        el.textContent = `Gửi lại (${left}s)`;
      } else {
        el.disabled = false;
        el.textContent = 'Gửi lại ngay';
        el.onclick = () => this.toast('Đã gửi lại mã xác thực.');
        clearInterval(window.bankOtpInterval);
        window.bankOtpInterval = null;
      }
    }, 1000);
  },

  /**
   * Xác thực xong thì lưu tài khoản mới và quay lại màn rút tiền.
   * Không tạo lại mã giới thiệu, không đụng tới hồ sơ cá nhân.
   */
  confirmChangeBank: function() {
    const code = this.otpBoxes('cb-otp').map(b => b.value).join('');
    if (code !== MEDIGO_CONFIG.otp.mockCode) {
      this.showOtpError('cb-otp', 'Mã không đúng. Vui lòng thử lại.');
      return;
    }

    const affBefore = MedigoStore.getSeller().aff_id;
    MedigoStore.saveSellerBank({
      bankName: document.getElementById('cb-bank').value,
      bankAccountNo: document.getElementById('cb-acc').value.trim(),
      bankAccountOwner: document.getElementById('cb-owner').value.trim()
    });

    this.closeChangeBank();
    this.toast('Đã cập nhật tài khoản thụ hưởng. Mã giới thiệu ' + affBefore + ' giữ nguyên.');
    MedigoApp.render('A12');
  },

  /** Khối HTML của modal xác nhận rút tiền, nhúng sẵn trong A12. */
  withdrawConfirmMarkup: function() {
    return `
      <div id="withdraw-confirm-modal" class="modal-backdrop" role="dialog" aria-modal="true"
           aria-labelledby="withdraw-confirm-title"
           onclick="if(event.target===this) MedigoViews.closeWithdrawConfirm()">
        <div class="modal-card withdraw-modal-card">
          <button class="modal-close modal-close-corner" aria-label="Đóng"
                  onclick="MedigoViews.closeWithdrawConfirm()">✕</button>

          <h3 id="withdraw-confirm-title" class="modal-title">Xác nhận yêu cầu rút tiền</h3>
          <p class="text-sm text-muted">Vui lòng kiểm tra kỹ thông tin trước khi gửi.</p>

          <div class="qr-info" id="withdraw-confirm-figures"></div>

          <div class="drawer-section" id="withdraw-confirm-bank"></div>

          <p class="text-sm text-muted" id="withdraw-confirm-note"></p>

          <div class="modal-actions">
            <button class="btn btn-secondary btn-lg" onclick="MedigoViews.closeWithdrawConfirm()">Hủy</button>
            <button class="btn btn-primary btn-lg" id="withdraw-confirm-btn">Xác nhận gửi</button>
          </div>
        </div>
      </div>
    `;
  },

  openWithdrawConfirm: function(amount) {
    const modal = document.getElementById('withdraw-confirm-modal');
    if (!modal) return;

    const seller = MedigoStore.getSeller();
    const calc = MEDIGO_RULES.calcWithdrawal(amount);
    const w = MEDIGO_CONFIG.withdrawal;

    document.getElementById('withdraw-confirm-figures').innerHTML = `
      <div class="summary-line">
        <span>Số tiền rút</span>
        <strong class="text-strong">${this.formatMoney(calc.amount)}</strong>
      </div>
      <div class="summary-line">
        <span>Thuế TNCN (${Math.round(calc.taxRate * 100)}%)</span>
        <strong class="${calc.taxable ? 'text-error' : 'text-muted'}">
          ${calc.taxable ? '-' + this.formatMoney(calc.tax) : 'Không áp dụng'}
        </strong>
      </div>
      <hr class="divider divider-dashed">
      <div class="summary-total">
        <span>Thực nhận</span>
        <strong class="text-success">${this.formatMoney(calc.net)}</strong>
      </div>`;

    document.getElementById('withdraw-confirm-bank').innerHTML = `
      <h4>${this.icon('bank', 16)} Tài khoản thụ hưởng</h4>
      <p>Ngân hàng: <strong>${this.esc(seller.bankName)}</strong></p>
      <p>Số tài khoản: <strong>${this.esc(this.maskAccount(seller.bankAccountNo))}</strong></p>
      <p>Chủ tài khoản: <strong>${this.esc(seller.bankAccountOwner)}</strong></p>`;

    document.getElementById('withdraw-confirm-note').textContent =
      `Thời gian xử lý dự kiến: ${w.estimatedProcessingDays}.`;

    const btn = document.getElementById('withdraw-confirm-btn');
    btn.disabled = false;
    btn.classList.remove('loading');
    btn.onclick = () => this.confirmWithdraw(amount, btn);

    modal.classList.add('active');
    this._withdrawEsc = (e) => { if (e.key === 'Escape') this.closeWithdrawConfirm(); };
    document.addEventListener('keydown', this._withdrawEsc);
    try { btn.focus(); } catch (err) {}
  },

  closeWithdrawConfirm: function() {
    const modal = document.getElementById('withdraw-confirm-modal');
    if (modal) modal.classList.remove('active');
    if (this._withdrawEsc) {
      document.removeEventListener('keydown', this._withdrawEsc);
      this._withdrawEsc = null;
    }
  },

  confirmWithdraw: function(amount, btn) {
    if (!this.lockButton(btn)) return; // chống bấm hai lần

    const result = MedigoStore.createWithdrawal(amount);
    if (!result.ok) {
      this.closeWithdrawConfirm();
      this.setWithdrawError(result.message);
      return;
    }

    this.closeWithdrawConfirm();
    this.toast('Đã gửi yêu cầu rút tiền.');
    MedigoApp.navigate('A12?state=submitted');
  },

  // ====================================================
  // A13: Đơn hàng & Mã kích hoạt của tôi
  // ====================================================
  renderA13: function(container) {
    const orders = MedigoStore.getOrders();

    container.innerHTML = `
      <div class="web-wrapper">
        ${this.renderWebHeader('A13')}

        <div class="page-narrow">
          <h2 class="page-title">Đơn hàng &amp; Mã kích hoạt của tôi</h2>

          ${orders.length ? orders.map(order => this.renderOrderCard(order)).join('')
            : this.emptyState('box', 'Bạn chưa có đơn hàng nào',
                'Các đơn hàng và mã kích hoạt sẽ hiển thị tại đây.',
                `<button class="btn btn-primary btn-lg" data-go="${MEDIGO_RULES.entryScreen()}"
                          onclick="MedigoApp.navigate(this.dataset.go)">Mua sản phẩm</button>`)}
        </div>

        <div id="activation-modal" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="activation-modal-title"
             onclick="if(event.target===this) MedigoViews.closeModal('activation-modal')">
          <div class="modal-card">
            <button class="modal-close modal-close-corner" aria-label="Đóng" onclick="MedigoViews.closeModal('activation-modal')">✕</button>
            <h3 id="activation-modal-title" class="modal-title">Xác nhận kích hoạt mã phần mềm</h3>
            <p class="modal-text">
              Sau khi kích hoạt, thời hạn ${MEDIGO_CONFIG.product.durationDays} ngày sẽ bắt đầu và bạn sẽ
              <strong>không thể đổi trả sản phẩm</strong>. Bạn chắc chắn muốn kích hoạt?
            </p>
            <p class="modal-text text-sm text-muted" id="activation-modal-order"></p>
            <div class="modal-actions">
              <button class="btn btn-secondary btn-lg" onclick="MedigoViews.closeModal('activation-modal')">Hủy</button>
              <button class="btn btn-primary btn-lg" id="activation-confirm-btn">Xác nhận kích hoạt</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /** Một thẻ đơn hàng: phần vận chuyển đồng hồ + phần mã kích hoạt phần mềm. */
  renderOrderCard: function(order) {
    const steps = ['Chờ đóng gói', 'Đã gửi hàng', 'Đang giao', 'Đã nhận máy'];
    const current = order.shipping.currentStep;

    // Bước đã qua tô --c8, bước đang ở tô --c6 (Spec A13). Bước cuối cùng cũng phải là "đang ở".
    const stepClass = (idx) => {
      const n = idx + 1;
      if (n < current) return 'passed';
      if (n === current) return 'active';
      return '';
    };

    const key = order.activationKey;
    const period = key.activated ? MEDIGO_RULES.activationPeriod(key.activatedDate) : null;
    const status = key.activated ? period.status : 'Chờ kích hoạt';
    const maskedCode = key.code.replace(/^(.*-)(\w{4})(-\w{4})$/, '$1••••$3');

    let keyBody = '';
    if (!key.activated) {
      keyBody = `
        <div class="activation-inline-code">${this.esc(maskedCode)}</div>
        <button class="btn btn-primary btn-full btn-lg"
                data-order="${this.esc(order.orderId)}"
                onclick="MedigoViews.showActivationModal(this.dataset.order)">
          Tôi đã nhận được đồng hồ — Kích hoạt ngay
        </button>
        <p class="text-sm text-muted text-center activation-note">
          Thời hạn ${MEDIGO_CONFIG.product.durationDays} ngày bắt đầu tính từ khi bạn bấm kích hoạt.
        </p>`;
    } else {
      const warn = status !== 'Đã kích hoạt';
      keyBody = `
        <div class="activation-inline-code">${this.esc(key.code)}</div>
        <div class="text-sm text-muted">
          Ngày kích hoạt: ${this.esc(period.activatedDate)} · Ngày hết hạn: ${this.esc(period.expiredDate)}
        </div>
        <div class="progress-track" role="img"
             aria-label="Đã dùng ${period.percentUsed}% thời hạn gói">
          <div class="progress-fill ${warn ? 'is-warning' : ''}" style="width: ${period.percentUsed}%"></div>
        </div>
        <div class="${warn ? 'text-warning' : 'text-success'} activation-remaining">
          ${warn ? 'Cảnh báo: Sắp hết hạn — còn' : 'Thời hạn còn lại:'} ${period.daysRemaining} ngày sử dụng
        </div>
        ${warn ? `<button class="btn btn-primary btn-full btn-lg"
            onclick="MedigoViews.toast('Đã gửi yêu cầu gia hạn gói dịch vụ.')">Gia hạn gói dịch vụ ngay</button>` : ''}`;
    }

    return `
      <div class="section-card bordered order-card">
        <div class="order-card-head">
          <strong class="order-id">Đơn hàng #${this.esc(order.orderId)}</strong>
          <span class="text-sm text-muted">${this.esc(order.orderDate)}</span>
        </div>
        <div class="order-product">${this.esc(order.productName)}</div>

        <div class="order-block order-block-shipping">
          <div class="order-block-title">
            ${this.icon('box', 18)} Giao nhận Đồng hồ HW01 — ${this.esc(order.shipping.carrier)}
          </div>
          <div class="shipping-steps">
            ${steps.map((label, i) => `
              <div class="shipping-step-node ${stepClass(i)}">${this.esc(label)}</div>`).join('')}
          </div>
          <div class="order-block-foot">
            <span class="text-sm text-muted">Mã vận đơn: <strong>${this.esc(order.shipping.trackingCode)}</strong></span>
            <button class="btn btn-secondary" data-track="${this.esc(order.shipping.trackingCode)}"
                    onclick="MedigoViews.toast('Mở trang theo dõi hành trình đơn ' + this.dataset.track + '.')">
              ${this.icon('truck', 16)} Theo dõi đơn vận chuyển
            </button>
          </div>
        </div>

        <div class="order-block order-block-key">
          <div class="order-block-head">
            <strong>${this.icon('key', 18)} Mã phần mềm Bác sĩ 24/7</strong>
            <span class="badge ${this.statusBadgeClass(status)}">${this.esc(status)}</span>
          </div>
          ${keyBody}
        </div>

        <div class="text-center order-card-foot">
          <button class="btn btn-link" onclick="MedigoViews.toast('Mã đã được gửi lại vào email của bạn.')">
            Gửi lại mã kích hoạt qua email
          </button>
        </div>
      </div>
    `;
  },

  showActivationModal: function(orderId) {
    const note = document.getElementById('activation-modal-order');
    if (note) note.textContent = 'Đơn hàng: ' + orderId;

    const btn = document.getElementById('activation-confirm-btn');
    if (btn) btn.onclick = () => this.confirmActivation(orderId);

    this.openModal('activation-modal');
  },

  confirmActivation: function(orderId) {
    const order = MedigoStore.activateOrder(orderId);
    this.closeModal('activation-modal');
    if (!order) {
      this.toast('Mã của đơn này đã được kích hoạt trước đó.');
      return;
    }
    this.toast('Kích hoạt thành công. Thời hạn sử dụng bắt đầu từ hôm nay.');
    MedigoApp.render('A13');
  },

  // ====================================================
  // B1: Đăng nhập Admin
  // ====================================================
  renderB1: function(container) {
    container.innerHTML = `
      <div class="admin-login-wrapper">
        <div class="admin-login-card">
          <div class="admin-login-head">
            ${this.logoMark(56)}
            <h1>Medigo Admin</h1>
            <p class="text-muted">Khu vực vận hành nội bộ GoCare</p>
          </div>

          <form onsubmit="event.preventDefault(); MedigoApp.navigate('B2');">
            <div class="form-group">
              <label for="admin-user">Email / Username</label>
              <input type="text" id="admin-user" class="form-control" value="admin@gocare.vn" required>
            </div>
            <div class="form-group">
              <label for="admin-pass">Mật khẩu</label>
              <div class="password-field">
                <input type="password" id="admin-pass" class="form-control" value="medigo2026" required>
                <button type="button" class="btn btn-secondary password-toggle"
                        onclick="MedigoViews.togglePassword('admin-pass', this)">Hiện</button>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-full btn-lg">Đăng nhập</button>
          </form>

          <p class="admin-login-note text-sm text-muted">
            Hệ thống thao tác tài chính — tách biệt hoàn toàn với đăng nhập seller.
          </p>
        </div>
      </div>
    `;
  },

  togglePassword: function(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.textContent = show ? 'Ẩn' : 'Hiện';
    btn.setAttribute('aria-label', show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
  },

  // ====================================================
  // Khung chung cho khu vực Admin
  // ====================================================
  renderAdminSidebar: function(active) {
    const home = MEDIGO_RULES.entryScreen();
    const item = (code, label, iconName) => `
      <li class="admin-nav-item">
        <a href="#${code}" class="admin-nav-link ${active === code ? 'active' : ''}" data-go="${code}"
           onclick="event.preventDefault(); MedigoApp.navigate(this.dataset.go)">
          ${this.icon(iconName, 18)} <span>${label}</span>
        </a>
      </li>`;

    return `
      <div class="admin-sidebar">
        <a href="#${home}" class="admin-sidebar-brand" data-go="${home}"
           onclick="event.preventDefault(); MedigoApp.navigate(this.dataset.go)">
          ${this.logoMark(24)}
          <span>Medigo Admin</span>
        </a>
        <ul class="admin-nav-list">
          <li class="admin-nav-group">Vận hành</li>
          ${item('B2', 'Thành viên', 'users')}
          ${item('B3', 'Yêu cầu rút tiền', 'cash')}
          ${item('B4', 'Kho hàng & Mã kích hoạt', 'box')}
          <li class="admin-nav-item admin-nav-item-foot">
            <a href="#${home}" class="admin-nav-link" data-go="${home}"
               onclick="event.preventDefault(); MedigoApp.navigate(this.dataset.go)">
              ${this.icon('home', 18)} <span>Về trang bán hàng</span>
            </a>
          </li>
        </ul>
      </div>`;
  },

  // Trạng thái bộ lọc / phân trang của khu vực admin
  adminState: {
    memberSearch: '', memberRank: '', memberStatus: '', memberPage: 1,
    withdrawStatus: '', withdrawFrom: '', withdrawTo: '', withdrawPage: 1,
    stockTab: 'orders', stockSearch: '', stockStatus: '', stockPage: 1
  },

  // ====================================================
  // B2: Quản lý thành viên
  // ====================================================
  renderB2: function(container) {
    const s = this.adminState;

    container.innerHTML = `
      <div class="admin-layout">
        ${this.renderAdminSidebar('B2')}

        <div class="admin-main-content">
          <div class="admin-toolbar">
            <h2>Quản lý thành viên (Seller)</h2>
            <div class="admin-toolbar-controls">
              <div class="admin-search-box">
                ${this.icon('search', 18)}
                <input type="text" id="member-search" class="admin-search-input" value="${this.esc(s.memberSearch)}"
                       aria-label="Tìm thành viên" placeholder="Tìm tên, SĐT, aff_id..."
                       oninput="MedigoViews.applyMemberFilters()">
              </div>
              <select id="member-rank" class="form-control admin-filter" aria-label="Lọc theo hạng" onchange="MedigoViews.applyMemberFilters()">
                <option value="">Tất cả hạng</option>
                ${MEDIGO_CONFIG.memberRanks.map(r =>
                  `<option value="${this.esc(r.rank)}" ${s.memberRank === r.rank ? 'selected' : ''}>${this.esc(r.rank)}</option>`).join('')}
              </select>
              <select id="member-status" class="form-control admin-filter" aria-label="Lọc theo trạng thái" onchange="MedigoViews.applyMemberFilters()">
                <option value="">Tất cả trạng thái</option>
                ${['Đang hoạt động', 'Đã khóa'].map(st =>
                  `<option value="${st}" ${s.memberStatus === st ? 'selected' : ''}>${st}</option>`).join('')}
              </select>
              <button class="btn btn-secondary" onclick="MedigoViews.exportMembers()">Xuất CSV/Excel</button>
            </div>
          </div>

          <div id="member-table-region"></div>
        </div>

        <div id="admin-member-drawer" class="admin-drawer" role="dialog" aria-modal="true" aria-labelledby="member-drawer-title">
          <div class="drawer-header">
            <h3 id="member-drawer-title">Chi tiết hồ sơ thành viên</h3>
            <button class="modal-close" aria-label="Đóng" onclick="MedigoViews.closeDrawer('admin-member-drawer')">✕</button>
          </div>
          <div class="drawer-body" id="drawer-member-content"></div>
          <div class="drawer-footer" id="drawer-member-footer"></div>
        </div>
      </div>
    `;

    // Lần nạp đầu của màn: hiện khung xương "đang tải" trước (Spec mục 5)
    this.withLoading('member-table-region', this.tableSkeleton(8, 5), () => this.renderMemberTable());
  },

  filteredMembers: function() {
    const s = this.adminState;
    const term = s.memberSearch.trim().toLowerCase();

    return MedigoStore.getMembers().filter(m => {
      const rank = MEDIGO_RULES.rankFor(m.totalOrders).rank;
      if (s.memberRank && rank !== s.memberRank) return false;
      if (s.memberStatus && m.status !== s.memberStatus) return false;
      if (!term) return true;
      return [m.fullName, m.phone, m.aff_id, m.email].some(v => String(v).toLowerCase().includes(term));
    });
  },

  applyMemberFilters: function() {
    const s = this.adminState;
    const search = document.getElementById('member-search');
    const rank = document.getElementById('member-rank');
    const status = document.getElementById('member-status');
    if (search) s.memberSearch = search.value;
    if (rank) s.memberRank = rank.value;
    if (status) s.memberStatus = status.value;
    s.memberPage = 1;
    this.renderMemberTable();
  },

  renderMemberTable: function() {
    const region = document.getElementById('member-table-region');
    if (!region) return;

    const s = this.adminState;
    const pageSize = MEDIGO_CONFIG.admin.pageSize;
    const all = this.filteredMembers();
    const totalPages = Math.max(1, Math.ceil(all.length / pageSize));
    s.memberPage = Math.min(s.memberPage, totalPages);
    const rows = all.slice((s.memberPage - 1) * pageSize, s.memberPage * pageSize);

    if (!all.length) {
      region.innerHTML = `
        <div class="data-table-wrapper">
          ${this.emptyState('search', 'Không tìm thấy thành viên nào',
            'Thử bỏ bớt bộ lọc hoặc đổi từ khóa tìm kiếm.',
            `<button class="btn btn-secondary" onclick="MedigoViews.clearMemberFilters()">Xóa bộ lọc</button>`)}
        </div>`;
      return;
    }

    region.innerHTML = `
      <div class="data-table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th scope="col">Tên</th>
              <th scope="col">Liên hệ</th>
              <th scope="col">aff_id</th>
              <th scope="col">Tuyến trên</th>
              <th scope="col">Hạng</th>
              <th scope="col">Ngày tham gia</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(m => {
              const rank = MEDIGO_RULES.rankFor(m.totalOrders);
              return `
                <tr>
                  <td><strong>${this.esc(m.fullName)}</strong></td>
                  <td>${this.esc(this.maskPhone(m.phone))}</td>
                  <td><strong class="text-primary">${this.esc(m.aff_id)}</strong></td>
                  <td>${m.sponsorAffId
                    ? `<a href="javascript:void(0)" data-aff="${this.esc(m.sponsorAffId)}"
                          onclick="MedigoViews.openMemberDrawer(this.dataset.aff)">${this.esc(m.sponsorAffId)}</a>`
                    : '<span class="text-muted">—</span>'}</td>
                  <td><span class="rank-badge ${rank.badgeClass}">${this.esc(rank.rank)}</span></td>
                  <td>${this.esc(m.joinDate)}</td>
                  <td><span class="badge ${this.statusBadgeClass(m.status)}">${this.esc(m.status)}</span></td>
                  <td>
                    <button class="btn btn-secondary" data-aff="${this.esc(m.aff_id)}"
                            onclick="MedigoViews.openMemberDrawer(this.dataset.aff)">Chi tiết ›</button>
                  </td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
      ${this.renderPagination(all.length, s.memberPage, totalPages, 'MedigoViews.gotoMemberPage')}
    `;
  },

  renderPagination: function(total, page, totalPages, handler) {
    const pageSize = MEDIGO_CONFIG.admin.pageSize;
    const from = (page - 1) * pageSize + 1;
    const to = Math.min(total, page * pageSize);
    return `
      <div class="pagination">
        <span class="text-sm text-muted">Hiển thị ${from}–${to} trên tổng ${total} bản ghi</span>
        <div class="pagination-controls">
          <button class="btn btn-secondary" ${page <= 1 ? 'disabled' : ''} onclick="${handler}(${page - 1})">‹ Trước</button>
          <span class="pagination-current">Trang ${page}/${totalPages}</span>
          <button class="btn btn-secondary" ${page >= totalPages ? 'disabled' : ''} onclick="${handler}(${page + 1})">Sau ›</button>
        </div>
      </div>`;
  },

  gotoMemberPage: function(page) {
    this.adminState.memberPage = page;
    this.renderMemberTable();
  },

  clearMemberFilters: function() {
    Object.assign(this.adminState, { memberSearch: '', memberRank: '', memberStatus: '', memberPage: 1 });
    MedigoApp.render('B2');
  },

  exportMembers: function() {
    const rows = this.filteredMembers();
    this.toast(`Đã xuất ${rows.length} bản ghi ra file CSV.`);
  },

  openMemberDrawer: function(affId) {
    const member = MedigoStore.getMembers().find(m => m.aff_id === affId);
    if (!member) { this.toast('Không tìm thấy hồ sơ thành viên này.'); return; }

    const rank = MEDIGO_RULES.rankFor(member.totalOrders);
    const totalCommission = member.totalOrders * MEDIGO_RULES.commissionAmount(1);
    const locked = member.status === 'Đã khóa';

    const renderTree = (nodes, depth) => nodes.map(n => `
      <div class="tree-view-node" style="--tree-depth: ${depth}">
        <span class="tree-view-label">Tầng ${n.level}: <strong>${this.esc(n.shortName)}</strong>
          <span class="text-sm text-muted">(${n.orderCount} đơn)</span></span>
        ${n.children && n.children.length ? renderTree(n.children, depth + 1) : ''}
      </div>`).join('');

    document.getElementById('drawer-member-content').innerHTML = `
      <div class="drawer-title-block">
        <h2>${this.esc(member.fullName)}</h2>
        <div class="drawer-badges">
          <span class="badge ${this.statusBadgeClass(member.status)}">${this.esc(member.status)}</span>
          <span class="rank-badge ${rank.badgeClass}">${this.esc(rank.rank)}</span>
        </div>
      </div>

      <div class="drawer-section">
        <h4>Thông tin cá nhân (chỉ hiển thị đầy đủ trong khu vực quản trị)</h4>
        <p>${this.icon('phone', 16)} SĐT: <strong>${this.esc(member.phone)}</strong></p>
        <p>${this.icon('mail', 16)} Email: <strong>${this.esc(member.email)}</strong></p>
        <p>${this.icon('id', 16)} Số CCCD: <strong>${this.esc(member.cccd)}</strong></p>
        <p>${this.icon('bank', 16)} Ngân hàng: <strong>${this.esc(member.bankName)} - ${this.esc(member.bankAccountNo)}</strong>
           (${this.esc(member.bankAccountOwner)})</p>
        <p>Tuyến trên: <strong>${this.esc(member.sponsorAffId || '—')}</strong> · Ngày tham gia: <strong>${this.esc(member.joinDate)}</strong></p>
      </div>

      <div class="drawer-section">
        <h4>${this.icon('tree', 16)} Sơ đồ tuyến dưới (tối đa ${MEDIGO_CONFIG.commissionRates.length} tầng)</h4>
        <div class="tree-view-root"><strong>${this.esc(member.fullName)}</strong> <span class="text-sm text-muted">(gốc)</span></div>
        ${member.downline && member.downline.length
          ? renderTree(member.downline, 1)
          : `<p class="text-sm text-muted">Thành viên này chưa có tuyến dưới.</p>`}
      </div>

      <div class="drawer-section">
        <h4>Lịch sử đơn hàng &amp; hoa hồng</h4>
        <div class="summary-line"><span>Tổng đơn hàng</span><strong>${member.totalOrders}</strong></div>
        <div class="summary-line"><span>Hoa hồng tích lũy (ước tính tầng 1)</span><strong class="text-success">${this.formatMoney(totalCommission)}</strong></div>
      </div>
    `;

    document.getElementById('drawer-member-footer').innerHTML = locked
      ? `<button class="btn btn-success btn-full btn-lg" data-aff="${this.esc(member.aff_id)}"
                 onclick="MedigoViews.setMemberLock(this.dataset.aff, false, this)">Mở khóa tài khoản</button>`
      : `<button class="btn btn-danger btn-full btn-lg" data-aff="${this.esc(member.aff_id)}"
                 onclick="MedigoViews.setMemberLock(this.dataset.aff, true, this)">Khóa tài khoản</button>`;

    this.openDrawer('admin-member-drawer');
  },

  setMemberLock: function(affId, lock, btn) {
    const member = MedigoStore.getMembers().find(m => m.aff_id === affId);
    if (!member) return;

    const action = lock ? 'KHÓA' : 'MỞ KHÓA';
    if (!window.confirm(`Xác nhận ${action} tài khoản?\n\nThành viên: ${member.fullName} (aff_id ${member.aff_id})`)) return;

    if (!this.lockButton(btn)) return; // chống bấm hai lần

    MedigoStore.setMemberStatus(affId, lock ? 'Đã khóa' : 'Đang hoạt động');
    this.closeDrawer('admin-member-drawer');
    this.toast(lock ? 'Đã khóa tài khoản thành viên.' : 'Đã mở khóa tài khoản thành viên.');
    this.renderMemberTable();
  },

  /**
   * Khóa nút trong lúc xử lý để tránh bấm hai lần (Spec mục 5).
   * Trả về false nếu nút đã đang xử lý — khi đó lời gọi bị bỏ qua.
   */
  lockButton: function(btn) {
    if (!btn) return true;
    if (btn.disabled || btn.classList.contains('loading')) return false;
    btn.disabled = true;
    btn.classList.add('loading');
    // Nếu màn không được vẽ lại (ví dụ thao tác thất bại), tự mở khóa sau 1.2s
    setTimeout(() => {
      if (btn.isConnected) { btn.disabled = false; btn.classList.remove('loading'); }
    }, 1200);
    return true;
  },

  openDrawer: function(id) {
    const d = document.getElementById(id);
    if (!d) return;
    d.classList.add('open');
    this._drawerEsc = (e) => { if (e.key === 'Escape') this.closeDrawer(id); };
    document.addEventListener('keydown', this._drawerEsc);
    const close = d.querySelector('.modal-close');
    if (close) close.focus();
  },

  closeDrawer: function(id) {
    const d = document.getElementById(id);
    if (d) d.classList.remove('open');
    if (this._drawerEsc) {
      document.removeEventListener('keydown', this._drawerEsc);
      this._drawerEsc = null;
    }
  },

  // ====================================================
  // B3: Yêu cầu rút tiền
  // ====================================================
  renderB3: function(container) {
    const s = this.adminState;
    const statuses = ['Chờ duyệt', 'Đã duyệt', 'Đã chi trả', 'Từ chối'];

    container.innerHTML = `
      <div class="admin-layout">
        ${this.renderAdminSidebar('B3')}

        <div class="admin-main-content">
          <div class="admin-toolbar">
            <h2>Yêu cầu rút tiền hoa hồng</h2>
            <div class="admin-toolbar-controls">
              <select id="withdraw-status" class="form-control admin-filter" aria-label="Lọc theo trạng thái" onchange="MedigoViews.applyWithdrawFilters()">
                <option value="">Tất cả trạng thái</option>
                ${statuses.map(st => `<option value="${st}" ${s.withdrawStatus === st ? 'selected' : ''}>${st}</option>`).join('')}
              </select>
              <div class="date-range">
                <label for="withdraw-from" class="text-sm text-muted">Từ</label>
                <input type="date" id="withdraw-from" class="form-control admin-filter" value="${this.esc(s.withdrawFrom)}"
                       onchange="MedigoViews.applyWithdrawFilters()">
                <label for="withdraw-to" class="text-sm text-muted">đến</label>
                <input type="date" id="withdraw-to" class="form-control admin-filter" value="${this.esc(s.withdrawTo)}"
                       onchange="MedigoViews.applyWithdrawFilters()">
              </div>
              <button class="btn btn-secondary" onclick="MedigoViews.exportWithdrawals()">Xuất Excel</button>
            </div>
          </div>

          <div id="withdraw-table-region"></div>
        </div>

        <div id="admin-withdraw-drawer" class="admin-drawer" role="dialog" aria-modal="true" aria-labelledby="withdraw-drawer-title">
          <div class="drawer-header">
            <h3 id="withdraw-drawer-title">Xử lý yêu cầu rút tiền</h3>
            <button class="modal-close" aria-label="Đóng" onclick="MedigoViews.closeDrawer('admin-withdraw-drawer')">✕</button>
          </div>
          <div class="drawer-body" id="drawer-withdraw-content"></div>
        </div>
      </div>
    `;

    this.withLoading('withdraw-table-region', this.tableSkeleton(10, 4), () => this.renderWithdrawTable());
  },

  filteredWithdrawals: function() {
    const s = this.adminState;
    const from = s.withdrawFrom ? new Date(s.withdrawFrom + 'T00:00:00') : null;
    const to = s.withdrawTo ? new Date(s.withdrawTo + 'T23:59:59') : null;

    return MedigoStore.getWithdrawals().filter(r => {
      if (s.withdrawStatus && r.status !== s.withdrawStatus) return false;
      if (from || to) {
        const d = MEDIGO_RULES.parseDate(String(r.requestDate).split(' - ')[0]);
        if (!d) return false;
        if (from && d < from) return false;
        if (to && d > to) return false;
      }
      return true;
    });
  },

  applyWithdrawFilters: function() {
    const s = this.adminState;
    const st = document.getElementById('withdraw-status');
    const from = document.getElementById('withdraw-from');
    const to = document.getElementById('withdraw-to');
    if (st) s.withdrawStatus = st.value;
    if (from) s.withdrawFrom = from.value;
    if (to) s.withdrawTo = to.value;
    s.withdrawPage = 1;
    this.renderWithdrawTable();
  },

  renderWithdrawTable: function() {
    const region = document.getElementById('withdraw-table-region');
    if (!region) return;

    const s = this.adminState;
    const pageSize = MEDIGO_CONFIG.admin.pageSize;
    const all = this.filteredWithdrawals();
    const totalPages = Math.max(1, Math.ceil(all.length / pageSize));
    s.withdrawPage = Math.min(s.withdrawPage, totalPages);
    const rows = all.slice((s.withdrawPage - 1) * pageSize, s.withdrawPage * pageSize);

    if (!all.length) {
      region.innerHTML = `
        <div class="data-table-wrapper">
          ${this.emptyState('cash', 'Không có yêu cầu nào khớp bộ lọc',
            'Thử đổi trạng thái hoặc khoảng thời gian.',
            `<button class="btn btn-secondary" onclick="MedigoViews.clearWithdrawFilters()">Xóa bộ lọc</button>`)}
        </div>`;
      return;
    }

    region.innerHTML = `
      <div class="data-table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th scope="col">Mã YC</th>
              <th scope="col">Seller</th>
              <th scope="col">Số tiền</th>
              <th scope="col">Thực nhận</th>
              <th scope="col">Ngày yêu cầu</th>
              <th scope="col">Số tài khoản nhận</th>
              <th scope="col">Tên ngân hàng</th>
              <th scope="col">Chi nhánh</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(r => {
              const calc = MEDIGO_RULES.calcWithdrawal(r.amount);
              return `
                <tr>
                  <td><strong>${this.esc(r.id)}</strong></td>
                  <td>${this.esc(r.sellerName)} (${this.esc(r.sellerAffId)})</td>
                  <td>${this.formatMoney(calc.amount)}</td>
                  <td><strong class="text-success">${this.formatMoney(calc.net)}</strong></td>
                  <td>${this.esc(r.requestDate)}</td>
                  <td>${this.esc(r.bankAccountNo)}</td>
                  <td>${this.esc(r.bankName)}</td>
                  <td>${this.esc(r.branch)}</td>
                  <td><span class="badge ${this.statusBadgeClass(r.status)}">${this.esc(r.status)}</span></td>
                  <td><button class="btn btn-secondary" data-req="${this.esc(r.id)}"
                              onclick="MedigoViews.openWithdrawDrawer(this.dataset.req)">Chi tiết ›</button></td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
      ${this.renderPagination(all.length, s.withdrawPage, totalPages, 'MedigoViews.gotoWithdrawPage')}
    `;
  },

  gotoWithdrawPage: function(page) {
    this.adminState.withdrawPage = page;
    this.renderWithdrawTable();
  },

  clearWithdrawFilters: function() {
    Object.assign(this.adminState, { withdrawStatus: '', withdrawFrom: '', withdrawTo: '', withdrawPage: 1 });
    MedigoApp.render('B3');
  },

  exportWithdrawals: function() {
    this.toast(`Đã xuất ${this.filteredWithdrawals().length} bản ghi ra file Excel.`);
  },

  openWithdrawDrawer: function(reqId) {
    const r = MedigoStore.getWithdrawals().find(item => item.id === reqId);
    if (!r) { this.toast('Không tìm thấy yêu cầu.'); return; }

    const calc = MEDIGO_RULES.calcWithdrawal(r.amount);
    const seller = MedigoStore.getMembers().find(m => m.aff_id === r.sellerAffId);
    const pending = r.status === 'Chờ duyệt';
    const approved = r.status === 'Đã duyệt';

    document.getElementById('drawer-withdraw-content').innerHTML = `
      <div class="drawer-title-block">
        <h2>Yêu cầu ${this.esc(r.id)}</h2>
        <span class="badge ${this.statusBadgeClass(r.status)}">${this.esc(r.status)}</span>
      </div>

      <div class="drawer-section">
        <h4>Thông tin seller</h4>
        <p>Seller: <strong>${this.esc(r.sellerName)}</strong> (aff_id: ${this.esc(r.sellerAffId)})</p>
        <p>Tổng đơn tích lũy: <strong>${seller ? seller.totalOrders : '—'}</strong></p>
        <p>Ngày yêu cầu: <strong>${this.esc(r.requestDate)}</strong></p>
      </div>

      <div class="drawer-section">
        <h4>Chi tiết tài chính</h4>
        <div class="summary-line"><span>Số tiền rút</span><strong>${this.formatMoney(calc.amount)}</strong></div>
        <div class="summary-line">
          <span>Thuế TNCN tạm tính (${Math.round(calc.taxRate * 100)}%)</span>
          <strong class="${calc.taxable ? 'text-error' : 'text-muted'}">
            ${calc.taxable ? this.formatMoney(calc.tax) : 'Không áp dụng'}</strong>
        </div>
        <hr class="divider">
        <div class="summary-total"><span>Thực nhận chuyển khoản</span><strong class="text-success">${this.formatMoney(calc.net)}</strong></div>
      </div>

      <div class="drawer-section">
        <h4>Thông tin ngân hàng thụ hưởng</h4>
        <p>Ngân hàng: <strong>${this.esc(r.bankName)}</strong></p>
        <p>Số tài khoản: <strong>${this.esc(r.bankAccountNo)}</strong></p>
        <p>Chủ tài khoản: <strong>${this.esc(r.bankAccountOwner)}</strong></p>
        <p>Chi nhánh: <strong>${this.esc(r.branch)}</strong></p>
      </div>

      ${r.rejectReason ? `
        <div class="drawer-section callout callout-error">
          <div><strong>Lý do từ chối:</strong> ${this.esc(r.rejectReason)}</div>
        </div>` : ''}

      ${pending ? `
        <div class="form-group">
          <label for="reject-reason">Lý do từ chối <span class="text-sm text-muted">(bắt buộc khi bấm Từ chối)</span></label>
          <textarea id="reject-reason" class="form-control" rows="3" placeholder="Nhập lý do từ chối nếu có..."></textarea>
        </div>` : ''}

      <div class="drawer-actions">
        <button class="btn btn-primary btn-lg" ${pending ? '' : 'disabled'}
                data-req="${this.esc(r.id)}" data-next="Đã duyệt"
                onclick="MedigoViews.handleWithdrawAction(this.dataset.req, this.dataset.next, this)">Duyệt</button>
        <button class="btn btn-danger btn-lg" ${pending ? '' : 'disabled'}
                data-req="${this.esc(r.id)}" data-next="Từ chối"
                onclick="MedigoViews.handleWithdrawAction(this.dataset.req, this.dataset.next, this)">Từ chối</button>
        <button class="btn btn-success btn-lg" ${approved ? '' : 'disabled'}
                data-req="${this.esc(r.id)}" data-next="Đã chi trả"
                onclick="MedigoViews.handleWithdrawAction(this.dataset.req, this.dataset.next, this)">Đánh dấu đã chi trả</button>
      </div>
      ${!pending && !approved ? `<p class="text-sm text-muted">Yêu cầu đã ở trạng thái cuối, không còn thao tác nào.</p>` : ''}
      ${pending ? `<p class="text-sm text-muted">Chỉ yêu cầu ở trạng thái "Đã duyệt" mới được đánh dấu đã chi trả.</p>` : ''}
    `;

    this.openDrawer('admin-withdraw-drawer');
  },

  // ====================================================
  // B4: Kho hàng & Mã kích hoạt
  // Theo dõi toàn bộ đơn đã bán và vòng đời mã kích hoạt đi kèm.
  // LƯU Ý PHẠM VI: Spec mục 7 xếp phần này vào "ngoài phạm vi bản prototype".
  // Màn này bổ sung theo yêu cầu sau của khách — spec cần được cập nhật lại.
  // ====================================================
  renderB4: function(container) {
    const s = this.adminState;
    const orders = MedigoStore.getAdminOrders();

    // Số liệu tổng quan, suy ra từ chính danh sách đơn
    const revenue = orders.reduce((t, o) => t + o.price * o.qty, 0);
    const shipping = orders.filter(o => o.shipping.currentStep < 4).length;
    const pendingKeys = orders.filter(o => !o.activationKey.activated).length;
    const expiring = orders.filter(o => MedigoStore.keyStatusOf(o).status === 'Sắp hết hạn').length;

    const tab = (id, label) => `
      <button class="range-tab ${s.stockTab === id ? 'active' : ''}" data-tab="${id}"
              aria-pressed="${s.stockTab === id}"
              onclick="MedigoViews.setStockTab(this.dataset.tab)">${label}</button>`;

    container.innerHTML = `
      <div class="admin-layout">
        ${this.renderAdminSidebar('B4')}

        <div class="admin-main-content">
          <div class="admin-toolbar">
            <h2>Kho hàng &amp; Mã kích hoạt</h2>
            <div class="admin-toolbar-controls">
              <div class="admin-search-box">
                ${this.icon('search', 18)}
                <input type="text" id="stock-search" class="admin-search-input" value="${this.esc(s.stockSearch)}"
                       aria-label="Tìm đơn hàng hoặc mã kích hoạt"
                       placeholder="Tìm mã đơn, khách hàng, mã kích hoạt, mã vận đơn..."
                       oninput="MedigoViews.applyStockFilters()">
              </div>
              <select id="stock-status" class="form-control admin-filter" aria-label="Lọc theo trạng thái"
                      onchange="MedigoViews.applyStockFilters()"></select>
              <button class="btn btn-secondary" onclick="MedigoViews.exportStock()">Xuất Excel</button>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">Tổng đơn đã bán</div>
              <div class="stat-value">${orders.length}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Doanh thu</div>
              <div class="stat-value text-primary">${this.formatMoney(revenue)}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Đang giao</div>
              <div class="stat-value">${shipping}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Mã chờ kích hoạt</div>
              <div class="stat-value text-warning">${pendingKeys}</div>
            </div>
          </div>

          ${expiring > 0 ? `
            <div class="callout callout-warning">
              ${this.icon('warning', 20)}
              <div>Có <strong>${expiring}</strong> mã kích hoạt sắp hết hạn trong ${MEDIGO_CONFIG.product.expiringSoonDays} ngày tới.</div>
            </div>` : ''}

          <div class="range-tabs" role="group" aria-label="Chọn bảng dữ liệu">
            ${tab('orders', 'Đơn hàng')}
            ${tab('keys', 'Mã kích hoạt')}
          </div>

          <div id="stock-table-region"></div>
        </div>

        <div id="admin-stock-drawer" class="admin-drawer" role="dialog" aria-modal="true" aria-labelledby="stock-drawer-title">
          <div class="drawer-header">
            <h3 id="stock-drawer-title">Chi tiết đơn hàng</h3>
            <button class="modal-close" aria-label="Đóng" onclick="MedigoViews.closeDrawer('admin-stock-drawer')">✕</button>
          </div>
          <div class="drawer-body" id="drawer-stock-content"></div>
          <div class="drawer-footer" id="drawer-stock-footer"></div>
        </div>
      </div>
    `;

    this.syncStockStatusFilter();
    this.withLoading('stock-table-region', this.tableSkeleton(9, 5), () => this.renderStockTable());
  },

  /** Bộ lọc trạng thái đổi theo tab đang xem. */
  syncStockStatusFilter: function() {
    const sel = document.getElementById('stock-status');
    if (!sel) return;
    const s = this.adminState;
    const options = s.stockTab === 'orders'
      ? ['Chờ đóng gói', 'Đã gửi hàng', 'Đang giao', 'Đã nhận máy']
      : ['Chờ kích hoạt', 'Đã kích hoạt', 'Sắp hết hạn', 'Hết hạn'];
    sel.innerHTML = `<option value="">Tất cả trạng thái</option>` +
      options.map(o => `<option value="${o}" ${s.stockStatus === o ? 'selected' : ''}>${o}</option>`).join('');
  },

  setStockTab: function(tabId) {
    const s = this.adminState;
    s.stockTab = tabId;
    s.stockStatus = '';
    s.stockPage = 1;
    document.querySelectorAll('.range-tabs .range-tab').forEach(b => {
      const on = b.dataset.tab === tabId;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    this.syncStockStatusFilter();
    this.renderStockTable();
  },

  applyStockFilters: function() {
    const s = this.adminState;
    const search = document.getElementById('stock-search');
    const status = document.getElementById('stock-status');
    if (search) s.stockSearch = search.value;
    if (status) s.stockStatus = status.value;
    s.stockPage = 1;
    this.renderStockTable();
  },

  shipLabel: function(step) {
    return ['Chờ đóng gói', 'Đã gửi hàng', 'Đang giao', 'Đã nhận máy'][step - 1] || '—';
  },

  shipBadgeClass: function(step) {
    return step === 4 ? 'badge-active' : (step === 1 ? 'badge-locked' : 'badge-pending');
  },

  filteredStock: function() {
    const s = this.adminState;
    const term = s.stockSearch.trim().toLowerCase();

    return MedigoStore.getAdminOrders().filter(o => {
      if (s.stockStatus) {
        const match = s.stockTab === 'orders'
          ? this.shipLabel(o.shipping.currentStep) === s.stockStatus
          : MedigoStore.keyStatusOf(o).status === s.stockStatus;
        if (!match) return false;
      }
      if (!term) return true;
      return [o.orderId, o.customerName, o.customerPhone, o.customerEmail,
              o.activationKey.code, o.shipping.trackingCode, o.sellerAffId]
        .some(v => String(v).toLowerCase().includes(term));
    });
  },

  renderStockTable: function() {
    const region = document.getElementById('stock-table-region');
    if (!region) return;

    const s = this.adminState;
    const pageSize = MEDIGO_CONFIG.admin.pageSize;
    const all = this.filteredStock();
    const totalPages = Math.max(1, Math.ceil(all.length / pageSize));
    s.stockPage = Math.min(s.stockPage, totalPages);
    const rows = all.slice((s.stockPage - 1) * pageSize, s.stockPage * pageSize);

    if (!all.length) {
      region.innerHTML = `
        <div class="data-table-wrapper">
          ${this.emptyState('box', 'Không có bản ghi nào khớp bộ lọc',
            'Thử đổi trạng thái hoặc từ khóa tìm kiếm.',
            `<button class="btn btn-secondary" onclick="MedigoViews.clearStockFilters()">Xóa bộ lọc</button>`)}
        </div>`;
      return;
    }

    const body = s.stockTab === 'orders'
      ? `
        <thead>
          <tr>
            <th scope="col">Mã đơn</th>
            <th scope="col">Khách hàng</th>
            <th scope="col">Liên hệ</th>
            <th scope="col">Seller giới thiệu</th>
            <th scope="col">Ngày đặt</th>
            <th scope="col">Giá trị</th>
            <th scope="col">Đơn vị vận chuyển</th>
            <th scope="col">Mã vận đơn</th>
            <th scope="col">Trạng thái giao</th>
            <th scope="col">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(o => `
            <tr>
              <td><strong>${this.esc(o.orderId)}</strong></td>
              <td>${this.esc(o.customerName)}</td>
              <td>${this.esc(this.maskPhone(o.customerPhone))}</td>
              <td><strong class="text-primary">${this.esc(o.sellerAffId)}</strong></td>
              <td>${this.esc(o.orderDate)}</td>
              <td><strong>${this.formatMoney(o.price * o.qty)}</strong></td>
              <td>${this.esc(o.shipping.carrier)}</td>
              <td>${this.esc(o.shipping.trackingCode)}</td>
              <td><span class="badge ${this.shipBadgeClass(o.shipping.currentStep)}">${this.esc(this.shipLabel(o.shipping.currentStep))}</span></td>
              <td><button class="btn btn-secondary" data-order="${this.esc(o.orderId)}"
                          onclick="MedigoViews.openStockDrawer(this.dataset.order)">Chi tiết ›</button></td>
            </tr>`).join('')}
        </tbody>`
      : `
        <thead>
          <tr>
            <th scope="col">Mã kích hoạt</th>
            <th scope="col">Đơn hàng</th>
            <th scope="col">Khách hàng</th>
            <th scope="col">Ngày cấp</th>
            <th scope="col">Ngày kích hoạt</th>
            <th scope="col">Ngày hết hạn</th>
            <th scope="col">Còn lại</th>
            <th scope="col">Trạng thái</th>
            <th scope="col">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(o => {
            const k = MedigoStore.keyStatusOf(o);
            return `
            <tr>
              <td><strong class="mono">${this.esc(o.activationKey.code)}</strong></td>
              <td>${this.esc(o.orderId)}</td>
              <td>${this.esc(o.customerName)}</td>
              <td>${this.esc(o.orderDate)}</td>
              <td>${this.esc(k.activatedDate)}</td>
              <td>${this.esc(k.expiredDate)}</td>
              <td>${k.daysRemaining === null ? '—' : k.daysRemaining + ' ngày'}</td>
              <td><span class="badge ${this.statusBadgeClass(k.status)}">${this.esc(k.status)}</span></td>
              <td><button class="btn btn-secondary" data-order="${this.esc(o.orderId)}"
                          onclick="MedigoViews.openStockDrawer(this.dataset.order)">Chi tiết ›</button></td>
            </tr>`;
          }).join('')}
        </tbody>`;

    region.innerHTML = `
      <div class="data-table-wrapper">
        <table class="data-table">${body}</table>
      </div>
      ${this.renderPagination(all.length, s.stockPage, totalPages, 'MedigoViews.gotoStockPage')}
    `;
  },

  gotoStockPage: function(page) {
    this.adminState.stockPage = page;
    this.renderStockTable();
  },

  clearStockFilters: function() {
    Object.assign(this.adminState, { stockSearch: '', stockStatus: '', stockPage: 1 });
    MedigoApp.render('B4');
  },

  exportStock: function() {
    const n = this.filteredStock().length;
    const what = this.adminState.stockTab === 'orders' ? 'đơn hàng' : 'mã kích hoạt';
    this.toast(`Đã xuất ${n} bản ghi ${what} ra file Excel.`);
  },

  openStockDrawer: function(orderId) {
    const o = MedigoStore.getAdminOrders().find(x => x.orderId === orderId);
    if (!o) { this.toast('Không tìm thấy đơn hàng.'); return; }

    const k = MedigoStore.keyStatusOf(o);
    const steps = ['Chờ đóng gói', 'Đã gửi hàng', 'Đang giao', 'Đã nhận máy'];
    const cur = o.shipping.currentStep;
    const stepClass = (idx) => (idx + 1 < cur ? 'passed' : (idx + 1 === cur ? 'active' : ''));

    document.getElementById('drawer-stock-content').innerHTML = `
      <div class="drawer-title-block">
        <h2>${this.esc(o.orderId)}</h2>
        <div class="drawer-badges">
          <span class="badge ${this.shipBadgeClass(cur)}">${this.esc(this.shipLabel(cur))}</span>
          <span class="badge ${this.statusBadgeClass(k.status)}">${this.esc(k.status)}</span>
        </div>
      </div>

      <div class="drawer-section">
        <h4>Khách hàng</h4>
        <p>${this.icon('users', 16)} Họ tên: <strong>${this.esc(o.customerName)}</strong></p>
        <p>${this.icon('phone', 16)} SĐT: <strong>${this.esc(o.customerPhone)}</strong></p>
        <p>${this.icon('mail', 16)} Email: <strong>${this.esc(o.customerEmail)}</strong></p>
        <p>Seller giới thiệu: <strong>${this.esc(o.sellerAffId)}</strong></p>
      </div>

      <div class="drawer-section">
        <h4>Đơn hàng</h4>
        <div class="summary-line"><span>Sản phẩm</span><strong>${this.esc(MEDIGO_CONFIG.product.code)} × ${o.qty}</strong></div>
        <div class="summary-line"><span>Ngày đặt</span><strong>${this.esc(o.orderDate)}</strong></div>
        <hr class="divider">
        <div class="summary-total"><span>Giá trị</span><strong class="text-price">${this.formatMoney(o.price * o.qty)}</strong></div>
      </div>

      <div class="drawer-section">
        <h4>${this.icon('truck', 16)} Vận chuyển — ${this.esc(o.shipping.carrier)}</h4>
        <div class="shipping-steps">
          ${steps.map((label, i) => `<div class="shipping-step-node ${stepClass(i)}">${this.esc(label)}</div>`).join('')}
        </div>
        <p>Mã vận đơn: <strong>${this.esc(o.shipping.trackingCode)}</strong></p>
      </div>

      <div class="drawer-section">
        <h4>${this.icon('key', 16)} Mã kích hoạt phần mềm</h4>
        <p class="stock-key-code">${this.esc(o.activationKey.code)}</p>
        <div class="summary-line"><span>Ngày kích hoạt</span><strong>${this.esc(k.activatedDate)}</strong></div>
        <div class="summary-line"><span>Ngày hết hạn</span><strong>${this.esc(k.expiredDate)}</strong></div>
        <div class="summary-line"><span>Thời hạn còn lại</span>
          <strong class="${k.status === 'Sắp hết hạn' ? 'text-warning' : ''}">${k.daysRemaining === null ? 'Chưa kích hoạt' : k.daysRemaining + ' ngày'}</strong></div>
        ${o.activationKey.activated ? `
          <div class="progress-track">
            <div class="progress-fill ${k.status !== 'Đã kích hoạt' ? 'is-warning' : ''}" style="width: ${k.percentUsed}%"></div>
          </div>` : ''}
      </div>
    `;

    document.getElementById('drawer-stock-footer').innerHTML = `
      <div class="drawer-actions">
        <button class="btn btn-secondary btn-full" data-copy="${this.esc(o.activationKey.code)}"
                onclick="MedigoViews.copyText(this.dataset.copy, 'Đã sao chép mã kích hoạt.')">
          ${this.icon('copy', 18)} Sao chép mã kích hoạt
        </button>
        <button class="btn btn-secondary btn-full" data-email="${this.esc(o.customerEmail)}"
                onclick="MedigoViews.toast('Đã gửi lại mã kích hoạt tới ' + this.dataset.email + '.')">
          ${this.icon('mail', 18)} Gửi lại mã qua email
        </button>
        ${cur < 4 ? `
          <button class="btn btn-success btn-full btn-lg" data-order="${this.esc(o.orderId)}"
                  onclick="MedigoViews.markDelivered(this.dataset.order, this)">Đánh dấu đã giao</button>` : ''}
      </div>
    `;

    const title = document.getElementById('stock-drawer-title');
    if (title) title.textContent = this.adminState.stockTab === 'orders' ? 'Chi tiết đơn hàng' : 'Chi tiết mã kích hoạt';

    this.openDrawer('admin-stock-drawer');
  },

  markDelivered: function(orderId, btn) {
    const o = MedigoStore.getAdminOrders().find(x => x.orderId === orderId);
    if (!o) return;
    const lines = [
      'Xác nhận đơn đã giao tới khách?',
      '',
      'Đơn: ' + o.orderId,
      'Khách: ' + o.customerName,
      'Mã vận đơn: ' + o.shipping.trackingCode
    ];
    if (!window.confirm(lines.join('\n'))) return;
    if (!this.lockButton(btn)) return;

    MedigoStore.markOrderDelivered(orderId);
    this.closeDrawer('admin-stock-drawer');
    this.toast('Đã đánh dấu đơn ' + orderId + ' là đã giao.');
    MedigoApp.render('B4');
  },

  /** Mọi thao tác tài chính đều mở hộp thoại xác nhận nêu rõ số tiền và người nhận (Spec B3). */
  handleWithdrawAction: function(reqId, nextStatus, btn) {
    const r = MedigoStore.getWithdrawals().find(item => item.id === reqId);
    if (!r) return;

    const calc = MEDIGO_RULES.calcWithdrawal(r.amount);
    let reason = '';

    if (nextStatus === 'Từ chối') {
      const field = document.getElementById('reject-reason');
      reason = field ? field.value.trim() : '';
      if (!reason) {
        this.toast('Vui lòng nhập lý do từ chối trước khi thực hiện.');
        if (field) field.focus();
        return;
      }
    }

    const lines = [
      `Xác nhận thao tác: ${nextStatus}`,
      '',
      `Yêu cầu: ${r.id}`,
      `Người nhận: ${r.sellerName} (aff_id ${r.sellerAffId})`,
      `Số tiền rút: ${this.formatMoney(calc.amount)}`,
      `Thực nhận: ${this.formatMoney(calc.net)}`,
      `Tài khoản: ${r.bankName} - ${r.bankAccountNo} (${r.bankAccountOwner})`
    ];
    if (reason) lines.push('', `Lý do từ chối: ${reason}`);
    if (nextStatus === 'Từ chối') lines.push('', 'Số tiền sẽ được hoàn lại vào số dư khả dụng của seller.');

    if (!window.confirm(lines.join('\n'))) return;

    if (!this.lockButton(btn)) return; // chống bấm hai lần trên thao tác tài chính

    const result = MedigoStore.updateWithdrawalStatus(reqId, nextStatus, reason);
    if (!result.ok) { this.toast(result.message); return; }

    this.closeDrawer('admin-withdraw-drawer');
    this.toast(`Đã cập nhật yêu cầu ${reqId} sang trạng thái "${nextStatus}".`);
    this.renderWithdrawTable();
  }
};
