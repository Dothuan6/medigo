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
    cart:     '<path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>',
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
    truck:    '<path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1"/>'
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
    const cartQty = MedigoStore.getCartQty();

    const navItem = (code, label) =>
      `<li><a href="#${code}" class="web-nav-link ${activeTab === code ? 'active-nav' : ''}"
         onclick="event.preventDefault(); MedigoApp.navigate('${code}')">${label}</a></li>`;

    return `
      ${affId ? `
      <div class="aff-notice-bar">
        ${this.icon('info', 18)}
        <span>Bạn đang xem qua link giới thiệu của thành viên <strong>${this.esc(affId)}</strong></span>
      </div>` : ''}

      <header class="app-header">
        <a href="#A0" class="logo-brand" onclick="event.preventDefault(); MedigoApp.navigate('A0')">
          ${this.logoMark(34)}
          <span>MEDIGO</span>
        </a>

        <ul class="web-nav-links">
          ${navItem('A0', 'Trang chủ Sản phẩm')}
          ${navItem('A13', 'Đơn hàng &amp; Mã của tôi')}
          ${navItem('A10', 'Kênh Seller (Affiliate)')}
          ${navItem('B2', 'Admin Vận hành')}
        </ul>

        <div class="app-header-actions">
          <button class="cart-icon-btn" onclick="MedigoApp.navigate('A1')" aria-label="Giỏ hàng, ${cartQty} sản phẩm">
            ${this.icon('cart', 22)}
            ${cartQty > 0 ? `<span class="cart-badge-count">${cartQty}</span>` : ''}
          </button>
        </div>
      </header>
    `;
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
          <div>
            <div class="product-carousel">
              <img id="carousel-img" src="${p.images[0]}" alt="Đồng hồ GoCare HW01">
              <div class="carousel-dots">
                ${p.images.map((_, i) => `
                  <button class="carousel-dot ${i === 0 ? 'active' : ''}" aria-label="Xem ảnh ${i + 1}"
                          onclick="MedigoViews.switchCarousel(${i})"></button>`).join('')}
              </div>
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
              <button class="btn btn-secondary btn-lg" onclick="MedigoViews.addToCart()">Thêm vào giỏ hàng</button>
              <button class="btn btn-primary btn-lg" onclick="MedigoViews.buyNow()">MUA NGAY</button>
            </div>

            <button class="btn btn-secondary btn-full" onclick="MedigoViews.copyText(MedigoViews.referralLink(), 'Đã sao chép link chia sẻ sản phẩm.')">
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
  },

  referralLink: function() {
    const affId = MedigoStore.getAffId() || MedigoStore.getSeller().aff_id;
    return `gocare.vn/san-pham/${MEDIGO_CONFIG.product.code}?aff_id=${affId}`;
  },

  switchCarousel: function(index) {
    const img = document.getElementById('carousel-img');
    if (img) img.src = MEDIGO_CONFIG.product.images[index];
    document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  },

  changeQty: function(delta) {
    const input = document.getElementById('product-qty');
    if (!input) return;
    const val = Math.max(1, (parseInt(input.value, 10) || 1) + delta);
    input.value = val;
    return val;
  },

  addToCart: function() {
    const input = document.getElementById('product-qty');
    const qty = input ? (parseInt(input.value, 10) || 1) : 1;
    MedigoStore.setCartQty(qty);
    MedigoApp.navigate('A1');
  },

  buyNow: function() {
    this.addToCart();
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
  // A1: Giỏ hàng
  // ====================================================
  renderA1: function(container, forceEmpty = false) {
    const p = MEDIGO_CONFIG.product;
    const qty = forceEmpty ? 0 : MedigoStore.getCartQty();

    if (qty <= 0) {
      container.innerHTML = `
        <div class="web-wrapper">
          ${this.renderWebHeader()}
          <div class="page-narrow">
            ${this.emptyState('cart', 'Giỏ hàng của bạn đang trống',
              'Hãy tham khảo gói sản phẩm sức khỏe tiêu chuẩn của GoCare.',
              `<button class="btn btn-primary btn-lg" onclick="MedigoApp.navigate('A0')">Xem sản phẩm ngay</button>`)}
          </div>
          ${this.renderFooter()}
        </div>
      `;
      return;
    }

    const subtotal = p.price * qty;

    container.innerHTML = `
      <div class="web-wrapper">
        ${this.renderWebHeader()}

        <div class="page-narrow">
          <h2 class="page-title">Giỏ hàng của bạn</h2>

          <div class="section-card bordered cart-row">
            <img src="${p.images[0]}" alt="${this.esc(p.shortName)}" class="cart-thumb">
            <div class="cart-row-main">
              <div class="cart-row-name">${this.esc(p.shortName)}</div>
              <div class="text-price cart-row-price">${this.formatMoney(p.price)}</div>
              <div class="quantity-control">
                <button class="qty-btn" onclick="MedigoViews.updateCartQty(-1)" aria-label="Giảm số lượng">−</button>
                <input type="text" id="product-qty" class="qty-input" value="${qty}" readonly aria-label="Số lượng">
                <button class="qty-btn" onclick="MedigoViews.updateCartQty(1)" aria-label="Tăng số lượng">+</button>
              </div>
            </div>
            <button class="btn btn-danger cart-row-remove" onclick="MedigoViews.removeFromCart()">Xóa khỏi giỏ</button>
          </div>

          <div class="section-card bordered">
            <div class="summary-line">
              <span>Tạm tính</span>
              <span class="text-bold">${this.formatMoney(subtotal)}</span>
            </div>
            <div class="summary-line">
              <span>Phí vận chuyển</span>
              <span class="text-muted">Sẽ tính ở bước thanh toán</span>
            </div>
            <hr class="divider">
            <div class="summary-total">
              <span>Thành tiền</span>
              <span class="text-price">${this.formatMoney(subtotal)}</span>
            </div>
          </div>
        </div>

        <div class="sticky-bottom-bar">
          <div class="sticky-bottom-inner">
            <div class="sticky-bottom-total">
              <span class="text-sm text-muted">Thành tiền</span>
              <strong class="text-price">${this.formatMoney(subtotal)}</strong>
            </div>
            <button class="btn btn-primary btn-lg sticky-bottom-cta" onclick="MedigoApp.navigate('A2')">Tiến hành thanh toán</button>
          </div>
        </div>
      </div>
    `;
  },

  updateCartQty: function(delta) {
    const qty = this.changeQty(delta);
    MedigoStore.setCartQty(qty);
    MedigoApp.render('A1');
  },

  removeFromCart: function() {
    MedigoStore.clearCart();
    MedigoApp.render('A1');
  },

  // ====================================================
  // A2: Thông tin nhận hàng
  // ====================================================
  renderA2: function(container) {
    const p = MEDIGO_CONFIG.product;
    const seller = MedigoStore.getSeller();
    const affId = MedigoStore.getAffId();
    const qty = Math.max(1, MedigoStore.getCartQty());
    const total = p.price * qty;

    container.innerHTML = `
      <div class="web-wrapper">
        ${this.renderWebHeader()}

        <div class="page-narrow page-narrow-md">
          <h2 class="page-title">Thông tin nhận hàng &amp; Thanh toán</h2>

          <form id="checkout-form" novalidate onsubmit="return MedigoViews.submitCheckout(event)">
            <div class="section-card bordered">
              <h3 class="card-title">1. Thông tin người nhận</h3>

              <div class="form-grid-2">
                <div class="form-group">
                  <label for="ck-name">Họ và tên <span class="required">*</span></label>
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
                <div class="form-group" id="grp-email-2">
                  <label for="email-2">Nhập lại Email xác nhận <span class="required">*</span></label>
                  <input type="email" id="email-2" class="form-control" value="${this.esc(seller.email)}" required
                         onpaste="return false" oninput="MedigoViews.validateEmailPair()">
                  <p class="error-message" id="err-email-2" hidden></p>
                </div>
              </div>

              <div class="callout callout-warning">
                ${this.icon('warning', 20)}
                <div><strong>Lưu ý quan trọng:</strong> Mã kích hoạt phần mềm sẽ được gửi trực tiếp tới Email này.
                Vui lòng kiểm tra thật kỹ trước khi thanh toán.</div>
              </div>

              <div class="form-group">
                <label for="ck-address">Địa chỉ giao hàng <span class="required">*</span></label>
                <input type="text" id="ck-address" class="form-control" value="${this.esc(seller.address)}" required>
              </div>

              <div class="form-grid-3">
                <div class="form-group">
                  <label for="ck-city">Tỉnh/Thành phố <span class="required">*</span></label>
                  <select id="ck-city" class="form-control" onchange="MedigoViews.onCityChange()">
                    <option>Hà Nội</option>
                    <option>TP. Hồ Chí Minh</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="ck-district">Quận/Huyện <span class="required">*</span></label>
                  <select id="ck-district" class="form-control" onchange="MedigoViews.onDistrictChange()"></select>
                </div>
                <div class="form-group">
                  <label for="ck-ward">Phường/Xã <span class="required">*</span></label>
                  <select id="ck-ward" class="form-control"></select>
                </div>
              </div>
            </div>

            <div class="section-card bordered">
              <h3 class="card-title">2. Mã giới thiệu</h3>
              <div class="form-group">
                <label for="ck-aff">Mã giới thiệu (aff_id)</label>
                <input type="text" id="ck-aff" class="form-control" value="${this.esc(affId)}">
                <span class="text-sm text-muted">Để trống nếu bạn không được ai giới thiệu.</span>
              </div>
            </div>

            <div class="section-card bordered">
              <h3 class="card-title">3. Hình thức thanh toán</h3>
              <label class="payment-option" for="ck-pay-qr">
                <input type="radio" id="ck-pay-qr" name="payment" checked>
                <span>
                  <strong>Chuyển khoản qua Mã QR (VietQR)</strong>
                  <span class="text-sm text-muted">Mã QR tự động xác nhận tức thì sau khi chuyển tiền thành công</span>
                </span>
              </label>
            </div>

            <div class="section-card bordered">
              <h3 class="card-title">4. Tóm tắt đơn hàng</h3>
              <div class="summary-line">
                <span>${this.esc(p.shortName)} × ${qty}</span>
                <span class="text-bold">${this.formatMoney(total)}</span>
              </div>
              <hr class="divider">
              <div class="summary-total">
                <span>Tổng tiền thanh toán</span>
                <span class="text-price">${this.formatMoney(total)}</span>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-full btn-lg">Thanh toán ngay</button>
          </form>
        </div>
      </div>
    `;

    this.onCityChange();
  },

  // Dữ liệu địa giới rút gọn cho prototype (select phụ thuộc nhau theo Spec A2).
  addressTree: {
    'Hà Nội': {
      'Quận Thanh Xuân': ['Phường Thanh Xuân Trung', 'Phường Nhân Chính', 'Phường Khương Đình'],
      'Quận Hà Đông': ['Phường Mộ Lao', 'Phường Văn Quán', 'Phường Quang Trung'],
      'Quận Cầu Giấy': ['Phường Dịch Vọng', 'Phường Quan Hoa', 'Phường Nghĩa Tân']
    },
    'TP. Hồ Chí Minh': {
      'Quận 1': ['Phường Bến Nghé', 'Phường Bến Thành', 'Phường Đa Kao'],
      'Quận Bình Thạnh': ['Phường 1', 'Phường 12', 'Phường 25'],
      'Thành phố Thủ Đức': ['Phường Linh Trung', 'Phường Hiệp Bình Chánh']
    }
  },

  onCityChange: function() {
    const city = document.getElementById('ck-city');
    const district = document.getElementById('ck-district');
    if (!city || !district) return;
    const districts = Object.keys(this.addressTree[city.value] || {});
    district.innerHTML = districts.map(d => `<option>${this.esc(d)}</option>`).join('');
    this.onDistrictChange();
  },

  onDistrictChange: function() {
    const city = document.getElementById('ck-city');
    const district = document.getElementById('ck-district');
    const ward = document.getElementById('ck-ward');
    if (!city || !district || !ward) return;
    const wards = (this.addressTree[city.value] || {})[district.value] || [];
    ward.innerHTML = wards.map(w => `<option>${this.esc(w)}</option>`).join('');
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

    const aff = document.getElementById('ck-aff');
    if (aff && aff.value.trim()) MedigoStore.setAffId(aff.value.trim());

    MedigoApp.navigate('A3');
    return false;
  },

  // ====================================================
  // A3: Thanh toán QR + Đếm ngược
  // ====================================================
  renderA3: function(container) {
    const config = MEDIGO_CONFIG;
    const qty = Math.max(1, MedigoStore.getCartQty());
    const total = config.product.price * qty;
    const orderRef = 'MDG88492';
    let secondsLeft = config.qrPayment.timeoutSeconds;

    const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const ss = String(secondsLeft % 60).padStart(2, '0');

    container.innerHTML = `
      <div class="web-wrapper text-center">
        ${this.renderWebHeader()}

        <div class="page-narrow page-narrow-sm">
          <h2 class="page-title">Quét mã QR để thanh toán</h2>
          <p class="page-lead">Sử dụng ứng dụng Ngân hàng hoặc Ví điện tử của bạn</p>

          <div class="qr-frame">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=GOCARE_${orderRef}"
                 alt="Mã QR thanh toán đơn ${orderRef}" width="220" height="220">
          </div>

          <div class="qr-timer-block">
            <span class="text-muted">Mã QR hết hạn sau:</span>
            <div id="qr-timer" class="qr-timer" role="timer" aria-live="off">${mm}:${ss}</div>
          </div>

          <div class="section-card bordered text-left">
            <div class="summary-line">
              <span>Số tiền:</span>
              <strong class="text-price summary-strong">${this.formatMoney(total)}</strong>
            </div>
            <div class="summary-line">
              <span>Nội dung CK:</span>
              <span class="copy-inline">
                <strong>${orderRef}</strong>
                <button class="btn btn-secondary btn-compact" onclick="MedigoViews.copyText('${orderRef}', 'Đã sao chép nội dung chuyển khoản.')">Copy</button>
              </span>
            </div>
            <div class="summary-line">
              <span>Người nhận:</span>
              <strong>GoCare Medigo</strong>
            </div>
          </div>

          <div class="waiting-row">
            <span class="btn loading waiting-spinner"></span>
            <span>Đang chờ nhận tín hiệu thanh toán...</span>
          </div>

          <div class="mt-lg">
            <button class="btn btn-link" onclick="MedigoApp.navigate('A5?state=expired')">Hủy đơn hàng này</button>
          </div>

          <div class="demo-hint">
            <small class="demo-hint-label">[MÔ PHỎNG KIỂM THỬ DEMO]</small>
            <button class="btn btn-success" onclick="MedigoApp.navigate('A4')">Mô phỏng Thanh toán Thành công → màn A4</button>
          </div>
        </div>
      </div>
    `;

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

  // ====================================================
  // A4: Thanh toán Thành công + Popup Mời Seller
  // ====================================================
  renderA4: function(container) {
    const p = MEDIGO_CONFIG.product;
    const seller = MedigoStore.getSeller();
    const orders = MedigoStore.getOrders();
    const order = orders[0];
    const qty = Math.max(1, MedigoStore.getCartQty());

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
            <button class="btn btn-secondary" onclick="MedigoViews.copyText('${this.esc(order.activationKey.code)}', 'Đã sao chép mã kích hoạt.')">
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

    MedigoStore.clearCart();

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
          <button class="btn btn-secondary btn-full" onclick="MedigoApp.navigate('A1')">Quay lại giỏ hàng</button>`
      },
      failed: {
        variant: 'error',
        title: 'Thanh toán không thành công',
        desc: 'Giao dịch bị gián đoạn hoặc không thành công. Vui lòng kiểm tra lại tài khoản.',
        buttons: `
          <button class="btn btn-primary btn-full btn-lg" onclick="MedigoApp.navigate('A3')">Thử lại</button>
          <button class="btn btn-secondary btn-full" onclick="MedigoViews.toast('Tổng đài hỗ trợ: ${config.company.hotline}')">Liên hệ hỗ trợ</button>`
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
          <h2 class="page-title text-center">Bước 1/3 · Thông tin cá nhân &amp; Nhận hoa hồng</h2>

          <div class="callout callout-info">
            ${this.icon('info', 20)}
            <div>Chúng tôi đã điền sẵn thông tin từ đơn hàng của bạn. Vui lòng kiểm tra lại.</div>
          </div>

          <form onsubmit="event.preventDefault(); MedigoApp.navigate('A7');">
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

              <div class="form-grid-3">
                <div class="form-group">
                  <label for="sg-city">Tỉnh/Thành phố <span class="required">*</span></label>
                  <select id="sg-city" class="form-control"><option>${this.esc(seller.city)}</option></select>
                </div>
                <div class="form-group">
                  <label for="sg-district">Quận/Huyện <span class="required">*</span></label>
                  <select id="sg-district" class="form-control"><option>${this.esc(seller.district)}</option></select>
                </div>
                <div class="form-group">
                  <label for="sg-ward">Phường/Xã <span class="required">*</span></label>
                  <select id="sg-ward" class="form-control"><option>${this.esc(seller.ward)}</option></select>
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
                    ${['Vietcombank', 'BIDV', 'Techcombank', 'MBBank', 'VietinBank'].map(b =>
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

          <h2 class="page-title">Xác thực OTP</h2>
          <p class="page-lead">Bước 2/3 · Mã xác nhận đã gửi tới <strong>${this.esc(this.maskPhone(seller.phone))}</strong></p>

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

  otpBoxes: function() {
    return Array.from(document.querySelectorAll('#otp-container .otp-box'));
  },

  handleOtpInput: function(input, index) {
    input.value = input.value.replace(/\D/g, '').slice(0, 1);
    this.clearOtpError();
    if (input.value) {
      const boxes = this.otpBoxes();
      if (boxes[index + 1]) boxes[index + 1].focus();
    }
  },

  handleOtpKey: function(event, index) {
    const boxes = this.otpBoxes();
    if (event.key === 'Backspace' && !event.target.value && boxes[index - 1]) {
      boxes[index - 1].focus();
      event.preventDefault();
    }
    if (event.key === 'ArrowLeft' && boxes[index - 1]) boxes[index - 1].focus();
    if (event.key === 'ArrowRight' && boxes[index + 1]) boxes[index + 1].focus();
  },

  /** Dán cả chuỗi OTP một lần (Spec A7). */
  handleOtpPaste: function(event) {
    event.preventDefault();
    const text = (event.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
    const boxes = this.otpBoxes();
    boxes.forEach((b, i) => { b.value = text[i] || ''; });
    this.clearOtpError();
    const nextEmpty = boxes.find(b => !b.value) || boxes[boxes.length - 1];
    nextEmpty.focus();
  },

  clearOtpError: function() {
    const group = document.getElementById('otp-container');
    const err = document.getElementById('otp-error');
    if (group) group.classList.remove('error');
    if (err) { err.hidden = true; err.textContent = ''; }
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

          <h2 class="page-title text-center">Bước 3/3 · Vui lòng đọc và xác nhận điều khoản</h2>

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
            <button id="confirm-act-btn" class="btn btn-primary btn-lg" disabled onclick="MedigoApp.navigate('A9')">
              Xác nhận &amp; Kích hoạt tài khoản
            </button>
          </div>
        </div>
      </div>
    `;
  },

  renderA9: function(container) {
    const seller = MedigoStore.getSeller();
    const refLink = `gocare.vn/san-pham/${MEDIGO_CONFIG.product.code}?aff_id=${seller.aff_id}`;

    // Từ đây trở đi phiên này chính là seller đó.
    MedigoStore.setAffId(seller.aff_id);

    container.innerHTML = `
      <div class="web-wrapper text-center">
        ${this.renderWebHeader()}

        <div class="page-narrow page-narrow-sm">
          <div class="result-icon result-icon-success">${this.icon('check', 54)}</div>

          <h1 class="result-title">Kích hoạt thành công</h1>
          <p class="page-lead">Bạn đã chính thức là seller Medigo</p>

          <div class="section-card bordered text-left">
            <div class="ref-block">
              <span class="text-sm text-muted">Mã giới thiệu (aff_id)</span>
              <div class="ref-code-row">
                <span class="ref-code">${this.esc(seller.aff_id)}</span>
                <button class="btn btn-secondary" onclick="MedigoViews.copyText('${this.esc(seller.aff_id)}', 'Đã sao chép mã giới thiệu.')">Sao chép mã</button>
              </div>
            </div>

            <div>
              <span class="text-sm text-muted">Link giới thiệu sản phẩm</span>
              <div class="ref-link" title="${this.esc(refLink)}">${this.esc(refLink)}</div>
              <div class="ref-actions">
                <button class="btn btn-secondary" onclick="MedigoViews.copyText('${this.esc(refLink)}', 'Đã sao chép link giới thiệu.')">Sao chép link</button>
                <button class="btn btn-primary" onclick="MedigoViews.shareLink('${this.esc(refLink)}')">Chia sẻ link</button>
              </div>
            </div>
          </div>

          <button class="btn btn-primary btn-full btn-lg" onclick="MedigoApp.navigate('A10')">Vào dashboard Seller</button>
        </div>
      </div>
    `;
  },

  shareLink: function(link) {
    const url = 'https://' + link;
    if (navigator.share) {
      navigator.share({ title: 'Medigo GoCare', url: url }).catch(() => {});
    } else {
      this.copyText(url, 'Trình duyệt chưa hỗ trợ chia sẻ. Đã sao chép link vào bộ nhớ tạm.');
    }
  },

  // ====================================================
  // A10: Dashboard Seller
  // ====================================================
  renderA10: function(container) {
    const seller = MedigoStore.getSeller();
    const downlines = MedigoStore.getDownlines();
    const history = MedigoStore.getHistory();
    const trend = MedigoStore.getTrend();
    const refLink = `gocare.vn/san-pham/${MEDIGO_CONFIG.product.code}?aff_id=${seller.aff_id}`;

    // Hạng và tiền hoa hồng đều suy ra từ file cấu hình, không viết cứng.
    const rank = MEDIGO_RULES.rankFor(seller.totalOrders);
    const hasDownline = downlines.some(t => t.memberCount > 0);
    const chartMax = Math.max(1, ...trend.map(t => t.amount));

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
              <button class="btn btn-secondary" onclick="MedigoViews.copyText('${this.esc(refLink)}', 'Đã sao chép link giới thiệu.')">Copy link</button>
              <button class="btn btn-primary" onclick="MedigoViews.shareLink('${this.esc(refLink)}')">Chia sẻ</button>
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
                <h3 class="card-title">Xu hướng hoa hồng · 7 ngày qua</h3>
                <div class="bar-chart" role="img" aria-label="Biểu đồ cột hoa hồng 7 ngày gần nhất">
                  ${trend.map(item => {
                    const pct = Math.round((item.amount / chartMax) * 100);
                    return `
                      <div class="bar-chart-col" title="${this.esc(item.day)}: ${this.formatMoney(item.amount)}">
                        <div class="bar-chart-bar" style="height: ${Math.max(4, pct)}%"></div>
                        <span class="bar-chart-label">${this.esc(item.day.split(' ')[0])}</span>
                      </div>`;
                  }).join('')}
                </div>
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
                    `<button class="btn btn-primary" onclick="MedigoViews.shareLink('${this.esc(refLink)}')">Chia sẻ link</button>`)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
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
            <a href="#A0" onclick="event.preventDefault(); MedigoApp.navigate('A0')">Chưa có tài khoản? Tìm hiểu cách tham gia</a>
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
                <a href="#A6" onclick="event.preventDefault(); MedigoApp.navigate('A6')">Thay đổi thông tin</a>
              </div>
              <p>Ngân hàng: <strong>${this.esc(seller.bankName)}</strong></p>
              <p>Số tài khoản: <strong>${this.esc(this.maskAccount(seller.bankAccountNo))}</strong></p>
              <p>Chủ tài khoản: <strong>${this.esc(seller.bankAccountOwner)}</strong></p>
            </div>

            <div class="section-card bordered" id="withdraw-summary"></div>

            <button type="submit" class="btn btn-primary btn-full btn-lg">Gửi yêu cầu rút tiền</button>
          </form>
        </div>
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

    const calc = MEDIGO_RULES.calcWithdrawal(amount);
    const ok = window.confirm(
      `Xác nhận gửi yêu cầu rút tiền?\n\n` +
      `Số tiền rút: ${this.formatMoney(calc.amount)}\n` +
      `Thuế TNCN: ${calc.taxable ? this.formatMoney(calc.tax) : 'Không áp dụng'}\n` +
      `Thực nhận: ${this.formatMoney(calc.net)}\n` +
      `Tài khoản: ${seller.bankName} - ${this.maskAccount(seller.bankAccountNo)} (${seller.bankAccountOwner})`
    );
    if (!ok) return false;

    const submitBtn = event.target.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.classList.add('loading'); }

    const result = MedigoStore.createWithdrawal(amount);
    if (!result.ok) {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.classList.remove('loading'); }
      this.setWithdrawError(result.message);
      return false;
    }

    this.toast('Đã gửi yêu cầu rút tiền.');
    MedigoApp.navigate('A12?state=submitted');
    return false;
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
                `<button class="btn btn-primary btn-lg" onclick="MedigoApp.navigate('A0')">Xem sản phẩm</button>`)}
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
                onclick="MedigoViews.showActivationModal('${this.esc(order.orderId)}')">
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
            <button class="btn btn-secondary" onclick="MedigoViews.toast('Mở trang theo dõi hành trình đơn ${this.esc(order.shipping.trackingCode)}.')">
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
    const item = (code, label, iconName) => `
      <li class="admin-nav-item">
        <a href="#${code}" class="admin-nav-link ${active === code ? 'active' : ''}"
           onclick="event.preventDefault(); MedigoApp.navigate('${code}')">
          ${this.icon(iconName, 18)} <span>${label}</span>
        </a>
      </li>`;

    return `
      <div class="admin-sidebar">
        <a href="#A0" class="admin-sidebar-brand" onclick="event.preventDefault(); MedigoApp.navigate('A0')">
          ${this.logoMark(24)}
          <span>Medigo Admin</span>
        </a>
        <ul class="admin-nav-list">
          <li class="admin-nav-group">Vận hành</li>
          ${item('B2', 'Thành viên', 'users')}
          ${item('B3', 'Yêu cầu rút tiền', 'cash')}
          <li class="admin-nav-item admin-nav-item-foot">
            <a href="#A0" class="admin-nav-link" onclick="event.preventDefault(); MedigoApp.navigate('A0')">
              ${this.icon('home', 18)} <span>Về trang sản phẩm</span>
            </a>
          </li>
        </ul>
      </div>`;
  },

  // Trạng thái bộ lọc / phân trang của khu vực admin
  adminState: {
    memberSearch: '', memberRank: '', memberStatus: '', memberPage: 1,
    withdrawStatus: '', withdrawFrom: '', withdrawTo: '', withdrawPage: 1
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

    this.renderMemberTable();
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
                    ? `<a href="javascript:void(0)" onclick="MedigoViews.openMemberDrawer('${this.esc(m.sponsorAffId)}')">${this.esc(m.sponsorAffId)}</a>`
                    : '<span class="text-muted">—</span>'}</td>
                  <td><span class="rank-badge ${rank.badgeClass}">${this.esc(rank.rank)}</span></td>
                  <td>${this.esc(m.joinDate)}</td>
                  <td><span class="badge ${this.statusBadgeClass(m.status)}">${this.esc(m.status)}</span></td>
                  <td>
                    <button class="btn btn-secondary" onclick="MedigoViews.openMemberDrawer('${this.esc(m.aff_id)}')">Chi tiết ›</button>
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
      ? `<button class="btn btn-success btn-full btn-lg" onclick="MedigoViews.setMemberLock('${this.esc(member.aff_id)}', false)">Mở khóa tài khoản</button>`
      : `<button class="btn btn-danger btn-full btn-lg" onclick="MedigoViews.setMemberLock('${this.esc(member.aff_id)}', true)">Khóa tài khoản</button>`;

    this.openDrawer('admin-member-drawer');
  },

  setMemberLock: function(affId, lock) {
    const member = MedigoStore.getMembers().find(m => m.aff_id === affId);
    if (!member) return;

    const action = lock ? 'KHÓA' : 'MỞ KHÓA';
    if (!window.confirm(`Xác nhận ${action} tài khoản?\n\nThành viên: ${member.fullName} (aff_id ${member.aff_id})`)) return;

    MedigoStore.setMemberStatus(affId, lock ? 'Đã khóa' : 'Đang hoạt động');
    this.closeDrawer('admin-member-drawer');
    this.toast(lock ? 'Đã khóa tài khoản thành viên.' : 'Đã mở khóa tài khoản thành viên.');
    this.renderMemberTable();
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

    this.renderWithdrawTable();
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
                  <td><button class="btn btn-secondary" onclick="MedigoViews.openWithdrawDrawer('${this.esc(r.id)}')">Chi tiết ›</button></td>
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
                onclick="MedigoViews.handleWithdrawAction('${this.esc(r.id)}', 'Đã duyệt')">Duyệt</button>
        <button class="btn btn-danger btn-lg" ${pending ? '' : 'disabled'}
                onclick="MedigoViews.handleWithdrawAction('${this.esc(r.id)}', 'Từ chối')">Từ chối</button>
        <button class="btn btn-success btn-lg" ${approved ? '' : 'disabled'}
                onclick="MedigoViews.handleWithdrawAction('${this.esc(r.id)}', 'Đã chi trả')">Đánh dấu đã chi trả</button>
      </div>
      ${!pending && !approved ? `<p class="text-sm text-muted">Yêu cầu đã ở trạng thái cuối, không còn thao tác nào.</p>` : ''}
      ${pending ? `<p class="text-sm text-muted">Chỉ yêu cầu ở trạng thái "Đã duyệt" mới được đánh dấu đã chi trả.</p>` : ''}
    `;

    this.openDrawer('admin-withdraw-drawer');
  },

  /** Mọi thao tác tài chính đều mở hộp thoại xác nhận nêu rõ số tiền và người nhận (Spec B3). */
  handleWithdrawAction: function(reqId, nextStatus) {
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

    const result = MedigoStore.updateWithdrawalStatus(reqId, nextStatus, reason);
    if (!result.ok) { this.toast(result.message); return; }

    this.closeDrawer('admin-withdraw-drawer');
    this.toast(`Đã cập nhật yêu cầu ${reqId} sang trạng thái "${nextStatus}".`);
    this.renderWithdrawTable();
  }
};
