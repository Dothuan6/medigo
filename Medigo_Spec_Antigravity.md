# Medigo — Spec giao diện cho Antigravity

Dựng prototype giao diện cho hệ thống bán hàng có chương trình giới thiệu (affiliate) của GoCare / HGTechs.

Đây là **prototype giao diện**, không nối API thật. Mọi dữ liệu dùng dữ liệu mẫu tĩnh trong file. Mọi con số về tỉ lệ hoa hồng, ngưỡng hạng, ngưỡng rút tiền đều là **giá trị mẫu chưa chốt** — bắt buộc để trong một file cấu hình riêng, không được viết thẳng vào giao diện.

---

## 1. Bối cảnh

**Sản phẩm bán:** một gói duy nhất, mã **CN02 — Gói Bác sĩ 24/7 hỗ trợ tư vấn sức khỏe (01 năm + 01 đồng hồ HW01)**, giá **10.000.000đ**.

Gói gồm hai phần giao theo hai đường:

- **Đồng hồ HW01** — giao qua đơn vị vận chuyển
- **Mã kích hoạt phần mềm** — gửi qua email ngay sau khi thanh toán thành công, ở trạng thái *chờ kích hoạt*. Chỉ khi khách nhận được máy và bấm kích hoạt thì mã mới chạy, và thời hạn 1 năm bắt đầu tính từ thời điểm đó.

**Bốn nhóm người dùng:**

| Nhóm | Thiết bị chính | Ghi chú |
|---|---|---|
| Khách hàng | Mobile | Mua hàng, nhận máy, kích hoạt mã |
| Seller / Thành viên | Mobile | Khách đã mua, đăng ký thành seller để hưởng hoa hồng giới thiệu |
| Operation Admin | Desktop | Duyệt thành viên, duyệt rút tiền |
| System Admin | — | **Ngoài phạm vi bản prototype này** |

**Cơ chế giới thiệu:** seller có mã giới thiệu riêng (`aff_id`). Người mua qua link của seller, sau khi thanh toán sẽ được mời đăng ký làm seller và trở thành tuyến dưới. Hệ thống chi hoa hồng tối đa **7 tầng**.

**Đối tượng người dùng cuối phần lớn là người trung niên và cao tuổi.** Đây là ràng buộc thiết kế quan trọng: chữ phải đủ lớn, nút bấm phải to, hướng dẫn phải rõ ràng từng bước, hạn chế thao tác phức tạp.

---

## 2. Design tokens

Lấy nguyên từ hệ thống thiết kế gốc của khách. **Không được tự đổi màu hoặc thêm màu mới.**

```css
:root {
  /* Màu */
  --c1:  #1F1F1F;  /* chữ chính, tiêu đề */
  --c2:  #424242;  /* chữ thân */
  --c3:  #344557;  /* nền tối, sidebar admin */
  --c4:  #414445;  /* chữ phụ đậm */
  --c5:  #939393;  /* chữ mờ, placeholder */
  --c6:  #00ADEE;  /* PRIMARY — nút chính, link, nhấn mạnh */
  --c7:  #AAAAAA;  /* viền, đường kẻ */
  --c8:  #84BE52;  /* trạng thái thành công */
  --c9:  #FFA500;  /* cảnh báo, chờ xử lý */
  --c10: #FBAE40;  /* nhấn phụ */
  --c11: #FFBC40;  /* nhấn phụ nhạt */
  --c12: #FFFFFF;  /* nền, chữ trên nền màu */
  --err: #D9342B;  /* lỗi, từ chối */

  /* Khoảng cách */
  --s1: 5px;   --s2: 6px;   --s3: 8px;   --s4: 10px;
  --s5: 12px;  --s6: 15px;  --s7: 16px;  --s8: 20px;
  --s9: 30px;  --s10: 40px; --s11: 50px;

  /* Bo góc */
  --r-sm: 4px;  --r-md: 5px;  --r-lg: 6px;
  --r-xl: 30px; --r-full: 50%;
}
```

**Font:** `Nunito`, dự phòng `system-ui, -apple-system, sans-serif`. Cần đủ dải 400 / 600 / 700 và hỗ trợ dấu tiếng Việt.

> **Lưu ý về `--err`:** bảng token gốc của khách **không có** màu lỗi. `#D9342B` là màu đề xuất bổ sung, cần khách duyệt. Trong code hãy đánh dấu rõ token này bằng comment `/* ĐỀ XUẤT — chờ duyệt */` để dễ thay.

Nếu dựng bằng Tailwind hoặc framework khác, map toàn bộ token trên vào cấu hình theme thay vì viết giá trị màu trực tiếp trong component.

---

## 3. Quy tắc chung

### Responsive

**Nhóm A (khách hàng + seller) — mobile-first.**
Kiểm tra ở **360px** (nhỏ nhất) và **430px** (lớn nhất trong nhóm mobile). Các thẻ số liệu tổng quan xếp **2×2**, chuyển sang **4×1** khi màn hình ≥600px. Trên desktop, giới hạn chiều rộng nội dung tối đa 480px và căn giữa.

**Nhóm B (admin) — desktop-first.**
Kiểm tra ở **1280px** và **1920px**. Sidebar cố định rộng **220px**. Bảng dữ liệu cuộn ngang trong khung riêng khi màn hình dưới **1024px** — phần thân trang không bao giờ được cuộn ngang.

### Định dạng số và tiền

- Tiền: dấu chấm ngăn cách hàng nghìn, hậu tố `đ` — `10.000.000đ`
- Ngày: `dd/mm/yyyy`
- Số điện thoại hiển thị rút gọn ở danh sách công khai: `090•••123`

### Trạng thái component

Mọi nút và ô nhập phải dựng đủ các trạng thái: `default`, `hover`, `focus-visible`, `active`, `disabled`, `loading`.

Ô nhập cần thêm trạng thái `error` kèm dòng thông báo lỗi bên dưới, dùng `--err`.

### Badge trạng thái

| Nhãn | Màu nền |
|---|---|
| Chờ duyệt | `--c9` |
| Đã duyệt | `--c6` |
| Từ chối | `--err` |
| Đã chi trả | `--c8` |
| Đã khóa | `--c5` |
| Đang hoạt động | `--c8` |
| Chờ kích hoạt | `--c9` |
| Đã kích hoạt | `--c8` |
| Hết hạn | `--c5` |

### Khả năng tiếp cận

- Cỡ chữ thân tối thiểu **16px**, không dùng dưới 14px ở bất kỳ đâu
- Vùng bấm tối thiểu **44×44px**
- Mọi ô nhập phải có `<label>` thật, không chỉ dựa vào placeholder
- Viền `focus-visible` rõ ràng, tương phản đủ
- Không truyền đạt thông tin chỉ bằng màu — badge luôn có chữ đi kèm

### Ngôn ngữ

Toàn bộ giao diện tiếng Việt. Giọng văn lịch sự, ngắn gọn, tránh từ chuyên ngành. Không dùng emoji.

---

## 4. Danh sách màn hình

Tổng **16 màn**. Nhóm A mobile, nhóm B desktop.

### A0 — Landing sản phẩm CN02

Trang khách nhìn thấy đầu tiên khi bấm link giới thiệu của seller (`.../san-pham/CN02?aff_id=923983`).

Bố cục từ trên xuống:

1. Header: logo GoCare, giỏ hàng có badge số lượng
2. Ảnh sản phẩm — băng chuyền ảnh, có chấm chỉ vị trí, vuốt ngang được
3. Tên sản phẩm: **CN02 - Gói Bác sĩ 24/7 hỗ trợ tư vấn sức khỏe (01 năm + 01 đồng hồ HW01)**
4. Mã: `CN02` · Tình trạng: `Còn hàng` (dùng `--c8`)
5. Giá: **10.000.000 đ** — cỡ chữ lớn, dùng `--err` cho đúng cách trình bày hiện tại của khách
6. Chọn số lượng (nút trừ / ô số / nút cộng) + hai nút: `Thêm vào giỏ` (viền, phụ) và `Mua Ngay` (nền `--c6`, chính)
7. Khối "Chi tiết sản phẩm" — nội dung 8 mục bên dưới
8. Nút chia sẻ
9. Footer: thông tin công ty, danh sách chính sách

**Nếu URL có `aff_id`:** hiện một dải nhỏ ngay dưới header, nền `--c11` nhạt: *"Bạn đang xem qua giới thiệu của thành viên 923983"*. Đây là tín hiệu để khách biết link đã được ghi nhận.

**Nội dung chi tiết sản phẩm** (dùng nguyên văn, đã sửa lỗi chính tả so với bản trên web):

> Gói dịch vụ GOCARE - Bác sĩ 24/7 hỗ trợ, tư vấn sức khỏe (Ký hiệu CN02) được thiết kế với mục đích cung cấp cho người dùng những tính năng nâng cao của nền tảng và dịch vụ GOCARE. Với gói CN02, người dùng ngoài việc tự theo dõi sức khỏe cá nhân, được Trợ lý sức khỏe theo dõi 24/7 còn được hỗ trợ tư vấn trực tuyến từ đội ngũ bác sĩ 24/7 của GOCARE, đồng thời khi xảy ra các tình huống bất thường khẩn cấp thì hệ thống sẽ tự động thực hiện cuộc gọi tới người thân thông báo thông tin bất thường và vị trí của người dùng để người thân có thể hỗ trợ kịp thời.

Tám mục tính năng, mỗi mục là một khối có tiêu đề đậm và danh sách gạch đầu dòng:

1. **Theo dõi, quản lý sức khỏe cá nhân** — Người dùng được sử dụng nền tảng GOCARE để theo dõi, quản lý dữ liệu sức khỏe cá nhân với các tính năng nâng cao.
2. **Các tính năng thu nhận dữ liệu vào APP** — Thu nhận dữ liệu từ thiết bị đo kết nối đến APP · Nhập dữ liệu thông tin sức khỏe thủ công · Tải hồ sơ sức khỏe · Nhập dữ liệu hồ sơ sức khỏe bằng chụp OCR.
3. **Lưu trữ dữ liệu sức khỏe** — Thời gian lưu trữ kéo dài 10 năm · Dung lượng lưu trữ tối đa 50MB.
4. **Chia sẻ thông tin sức khỏe online** — Chia sẻ dữ liệu sức khỏe với Trung tâm theo dõi, chăm sóc sức khỏe TT247 GOCARE · Thêm không giới hạn người thân theo dõi · Không cho phép thêm Bác sĩ theo dõi.
5. **Cảnh báo và hỗ trợ khẩn cấp (SOS)** — Hệ thống tự động gửi cảnh báo khi có chỉ số sức khỏe bất thường qua thông báo trên ứng dụng · Cuộc gọi tự động Callbot thông báo tình trạng sức khỏe bất thường nghiêm trọng đến người thân · Nút SOS trên APP để yêu cầu hỗ trợ từ TT247 GOCARE và người thân.
6. **Theo dõi và chăm sóc sức khỏe từ xa** — Gọi lên TT247 GOCARE để được Trợ lý sức khỏe giải đáp thông tin về dịch vụ và tư vấn sức khỏe trong phạm vi được hướng dẫn · TT247 GOCARE chủ động theo dõi sức khỏe và hỗ trợ từ xa khi có bất thường nghiêm trọng hoặc khi nhấn nút SOS.
7. **Dịch vụ Bác sĩ từ GOCARE** — Bác sĩ 24/7 hỗ trợ khi người dùng gặp bất thường nghiêm trọng về sức khỏe hoặc nhấn nút SOS trên ứng dụng GOCARE.
8. **Tính năng nâng cao của nền tảng GOCARE** — Nhắc lịch uống thuốc · Người thân theo dõi lịch uống thuốc · Phân tích dữ liệu bằng AI theo tuần, tháng, năm để đưa ra xu hướng bệnh lý và nguy cơ tiềm ẩn, kèm tư vấn của bác sĩ.

**Footer** — thông tin công ty:

```
CÔNG TY TNHH GIẢI PHÁP CÔNG NGHỆ HUY GIÁP (HGTECHS CO.,LTD)
Địa chỉ: Liền kề 18, 114 Đường Thanh Bình, Phường Mộ Lao, Quận Hà Đông, TP. Hà Nội
Điện thoại: +84 982466668 · +84 943013331
Email: info@hgtechs.vn
Giấy chứng nhận đăng ký kinh doanh số: 0108294845; Ngày cấp: 28/05/2018
```

Danh sách liên kết chính sách (chỉ cần link tĩnh, chưa cần nội dung): Chính sách bảo hành · Chính sách đổi trả và hoàn tiền · Quy chế hoạt động website · Chính sách vận chuyển và giao nhận · Chính sách thanh toán · Chính sách bảo mật thông tin · Chính sách kiểm hàng.

---

### A1 — Giỏ hàng

Danh sách sản phẩm trong giỏ: ảnh nhỏ, tên, đơn giá, ô chỉnh số lượng, nút xóa.

Khối tổng tiền: Tạm tính · Phí vận chuyển (để `Sẽ tính ở bước sau`) · **Thành tiền**.

Nút `Tiến hành thanh toán` — full width, nền `--c6`, cố định dưới đáy màn hình khi cuộn.

**Trạng thái rỗng:** biểu tượng giỏ hàng mờ, dòng chữ *"Giỏ hàng của bạn đang trống"*, nút `Xem sản phẩm`.

---

### A2 — Thông tin nhận hàng

Form nhập thông tin giao hàng, chia thành các nhóm có tiêu đề.

**Nhóm "Thông tin nhận hàng":**

| Trường | Bắt buộc | Kiểu |
|---|---|---|
| Họ tên | ✔ | text |
| Số điện thoại | ✔ | tel |
| Email | ✔ | email |
| Địa chỉ | ✔ | text |
| Tỉnh/Thành phố | ✔ | select |
| Quận/Huyện | ✔ | select, phụ thuộc tỉnh |
| Phường/Xã | ✔ | select, phụ thuộc quận |

**Nhóm "Mã giới thiệu":** một ô text, tự điền sẵn nếu URL có `aff_id`, cho phép sửa. Ghi chú nhỏ bên dưới: *"Để trống nếu bạn không được ai giới thiệu."*

**Nhóm "Hình thức thanh toán":** hiện phương thức chuyển khoản qua mã QR, đã chọn sẵn.

**Khối "Thông tin đơn hàng"** cố định hoặc ở cuối: ảnh sản phẩm, tên, `Giá: 10.000.000đ x 1`, Tạm tính, Thành tiền.

Nút `Thanh toán` — full width, nền `--c6`.

> **Cảnh báo quan trọng — email là kênh giao hàng.**
> Mã kích hoạt chỉ được gửi qua email, nên nhập sai email đồng nghĩa khách trả 10 triệu mà không nhận được hàng. Bắt buộc:
> - Ô email phải có bước **nhập lại email để xác nhận**, hoặc xác thực bằng OTP trước khi cho thanh toán
> - Hiện cảnh báo nổi bật ngay dưới ô email: *"Mã kích hoạt sẽ được gửi tới email này. Vui lòng kiểm tra kỹ."*

---

### A3 — Màn thanh toán QR

- Tiêu đề: `Quét mã để thanh toán`
- Khung mã QR lớn, đặt giữa, nền trắng, viền `--c7`
- Bên dưới QR: **Số tiền** `10.000.000đ` · **Nội dung CK** (mã đơn, có nút sao chép) · **Người nhận** `GoCare Medigo`
- **Đồng hồ đếm ngược** thời gian hiệu lực của mã QR, hiển thị dạng `mm:ss`. Khi còn dưới 60 giây thì đổi sang `--err`
- Dòng trạng thái: *"Đang chờ thanh toán..."* kèm hiệu ứng loading
- Nút phụ dạng chữ: `Hủy đơn hàng`

---

### A4 — Thanh toán thành công + mời đăng ký

Nội dung chính:

- Biểu tượng dấu tích lớn, màu `--c8`
- Tiêu đề `Thanh toán thành công`
- Mã đơn hàng
- **Khối mã kích hoạt** — nền `--c11` nhạt, viền `--c9`:
  - Nhãn `Mã kích hoạt phần mềm`
  - Mã hiển thị cỡ lớn, phông chữ đều (monospace), có nút sao chép
  - Badge `Chờ kích hoạt`
  - Dòng giải thích: *"Mã đã được gửi tới email của bạn. Mã sẽ được kích hoạt khi bạn nhận được đồng hồ. Thời hạn sử dụng 1 năm tính từ ngày kích hoạt."*
- Tóm tắt đơn hàng và địa chỉ giao

**Popup mời đăng ký seller** — hiện tự động sau khoảng 1 giây:

- Tiêu đề: `Đăng ký thành viên`
- Nội dung: *"Bạn có muốn đăng ký làm seller Medigo để nhận hoa hồng giới thiệu không?"*
- Nút chính: `Đăng ký thành viên` (nền `--c6`)
- Nút phụ: `Không, thoát ra` (dạng chữ, màu `--c5`)
- Đóng được bằng nút X và bằng cách bấm ra ngoài

---

### A5 — Thanh toán thất bại / QR hết hạn

Ba biến thể trên cùng một khung màn hình, chuyển bằng tham số:

| Biến thể | Tiêu đề | Nút |
|---|---|---|
| Hết hạn QR | `Mã QR đã hết hạn` | `Tạo mã mới` · `Quay lại giỏ hàng` |
| Thanh toán thất bại | `Thanh toán không thành công` | `Thử lại` · `Liên hệ hỗ trợ` |
| Đang xác nhận | `Đang xác nhận thanh toán` | (không có nút, hiện loading) |

Biểu tượng dùng `--err` cho hai biến thể đầu, `--c9` cho biến thể thứ ba. Luôn hiện số hotline hỗ trợ ở cuối màn.

---

### A6 — Đăng ký thành viên, bước 1/3

Thanh tiến trình 3 bước ở đầu màn, bước hiện tại tô `--c6`.

Tiêu đề phụ: `Bước 1/3 · Thông tin cá nhân & nhận hoa hồng`

**Nhóm "Thông tin cá nhân"** — tự điền sẵn từ dữ liệu khách đã nhập ở A2, khách chỉ xem lại và sửa nếu cần. Hiện dải thông báo nhẹ ở đầu: *"Chúng tôi đã điền sẵn thông tin từ đơn hàng của bạn. Vui lòng kiểm tra lại."*

Họ và tên · Số điện thoại · Email · Số CCCD · Địa chỉ · Tỉnh/Thành phố · Quận/Huyện · Phường/Xã · Ngày sinh · Giới tính (Nam / Nữ / Khác)

**Nhóm "Thông tin nhận hoa hồng"**

Ngân hàng (select) · Số tài khoản nhận hoa hồng · Chủ tài khoản

Ghi chú bảo mật dưới nhóm này, chữ nhỏ màu `--c5`: *"Chỉ hiển thị đầy đủ trong khu vực quản trị nội bộ."*

Nút `Tiếp tục` — full width, nền `--c6`.

---

### A7 — Đăng ký thành viên, bước 2/3 (OTP)

- Tiêu đề: `Xác thực OTP`
- Tiêu đề phụ: `Bước 2/3 · Mã đã gửi tới 090•••123`
- 6 ô nhập mã, tự nhảy sang ô kế tiếp, dán được cả chuỗi
- Dòng gửi lại: `Không nhận được mã?` + `Gửi lại (30s)` — nút bị vô hiệu hóa và đếm ngược, sau đó mới bấm được
- Hai nút: `Quay lại` (phụ) · `Xác nhận` (chính)
- Trạng thái nhập sai: viền các ô chuyển `--err`, hiện thông báo *"Mã không đúng. Vui lòng thử lại."*

---

### A8 — Đăng ký thành viên, bước 3/3 (Điều khoản)

- Tiêu đề: `Điều khoản tham gia`
- Tiêu đề phụ: `Bước 3/3 · Vui lòng đọc và xác nhận`
- Khung nội dung điều khoản cuộn được, chiều cao cố định, viền `--c7`. Nội dung tạm:

> Điều khoản chương trình affiliate Medigo — GoCare. Bằng việc tích chọn xác nhận, bạn đồng ý với chính sách hoa hồng, quy định về tuyến trên/tuyến dưới, và các điều kiện rút tiền được GoCare quy định. Nội dung đầy đủ do bộ phận Pháp lý cung cấp trước khi go-live.

- Ô tích: *"Tôi đã đọc và đồng ý với điều khoản tham gia chương trình affiliate Medigo."*
- Nút `Xác nhận & kích hoạt` **bị vô hiệu hóa** cho tới khi tích ô đồng ý
- Nút `Quay lại`

---

### A9 — Kích hoạt thành công

- Biểu tượng dấu tích lớn `--c8`
- Tiêu đề `Kích hoạt thành công`
- Dòng phụ: `Bạn đã chính thức là seller Medigo`
- **Khối mã giới thiệu** nổi bật:
  - Nhãn `Mã giới thiệu (aff_id)` → giá trị `923983`, cỡ chữ lớn, có nút sao chép
  - Nhãn `Link giới thiệu` → `gocare.vn/san-pham/CN02?aff_id=923983`, cắt bớt bằng dấu ba chấm nếu dài, có nút sao chép
  - Nút `Chia sẻ link` gọi chia sẻ của hệ điều hành
- Nút `Vào dashboard` — full width, nền `--c6`

---

### A10 — Dashboard seller

Màn quan trọng nhất của nhóm A.

**Header:** `Chào, Nguyễn Văn A` · dòng phụ `aff_id: 923983` · biểu tượng tài khoản

**Khối link giới thiệu** — đặt ngay dưới header, luôn nhìn thấy: link rút gọn + nút sao chép + nút chia sẻ.

**Bốn thẻ số liệu** — xếp 2×2 trên mobile, 4×1 khi ≥600px:

| Nhãn | Giá trị mẫu |
|---|---|
| Tổng đơn hàng | 128 |
| Điểm tích lũy | 3.420 |
| Hạng hiện tại | Bạc |
| Số dư khả dụng | 4.850.000đ |

**Biểu đồ** — tiêu đề `Xu hướng hoa hồng · 7 ngày`, biểu đồ đường hoặc cột đơn giản, màu `--c6`.

**Khối tuyến dưới** — tiêu đề `Tuyến dưới của bạn`.

> **Thay đổi so với mockup gốc.** Mockup vẽ "Sơ đồ tuyến dưới (2 cấp)" nhưng hệ thống thực tế có **7 tầng**, không thể vẽ dạng cây trên màn 360px. Thay bằng **danh sách tổng hợp theo tầng**:
>
> Mỗi dòng là một tầng, hiện: `Tầng 1` · số thành viên · số đơn · hoa hồng nhận được từ tầng đó · mũi tên mở rộng. Bấm vào mở danh sách thành viên của tầng đó.
>
> **Trong danh sách thành viên chỉ hiện: tên viết tắt (ví dụ "Nguyễn Văn A" → "Nguyễn V. A"), ngày tham gia, số đơn.** Tuyệt đối không hiện số điện thoại, email, địa chỉ hay bất kỳ thông tin liên hệ nào của tuyến dưới — đây là dữ liệu cá nhân của người khác.

**Trạng thái rỗng:** *"Chưa có tuyến dưới. Chia sẻ link giới thiệu để bắt đầu."* kèm nút `Chia sẻ link`.

**Khối `Lịch sử đơn hàng & hoa hồng`** — danh sách, mỗi dòng: `Đơn #10234 — CN02` · ngày · tầng phát sinh · số tiền hoa hồng · badge trạng thái (`Chờ duyệt` / `Đã duyệt` / `Đã chi trả`).

**Nút `Yêu cầu rút tiền`** — nền `--c6`, dẫn sang A12.

---

### A11 — Đăng nhập seller

Màn hoàn toàn mới, mockup chưa có. Seller cần đường quay lại sau khi thoát.

- Logo Medigo / GoCare
- Ô `Số điện thoại`
- Nút `Gửi mã OTP` → chuyển sang màn nhập OTP dùng lại giao diện A7
- Liên kết phụ: `Chưa có tài khoản? Tìm hiểu cách tham gia`

Đăng nhập bằng OTP thay vì mật khẩu, vì đối tượng người dùng lớn tuổi thường quên mật khẩu.

---

### A12 — Yêu cầu rút tiền

- Hiện `Số dư khả dụng` cỡ lớn ở đầu màn
- Ô nhập số tiền muốn rút, kèm nút nhanh `Rút toàn bộ`
- Ghi chú ngưỡng tối thiểu (dùng giá trị mẫu, để trong file cấu hình)
- **Khối thông tin nhận tiền** — chỉ đọc, lấy từ hồ sơ: Ngân hàng · Số tài khoản (che bớt) · Chủ tài khoản. Kèm liên kết `Thay đổi thông tin`
- **Khối tạm tính** — Số tiền rút · Thuế thu nhập cá nhân (giá trị mẫu) · **Thực nhận**
- Nút `Gửi yêu cầu`
- Sau khi gửi: màn xác nhận với badge `Chờ duyệt` và ghi chú thời gian xử lý dự kiến

---

### A13 — Đơn hàng & mã kích hoạt của tôi

Màn hoàn toàn mới. Nơi khách theo dõi máy và kích hoạt mã.

Mỗi đơn hàng là một thẻ gồm hai phần rõ rệt:

**Phần 1 — Đồng hồ HW01**

Các bước tiến trình theo hàng ngang: `Chờ đóng gói` → `Đã gửi` → `Đang giao` → `Đã nhận`. Bước hiện tại tô `--c6`, các bước đã qua tô `--c8`. Kèm mã vận đơn và nút `Theo dõi đơn`.

**Phần 2 — Mã kích hoạt phần mềm**

Ba trạng thái, mỗi trạng thái một giao diện riêng:

| Trạng thái | Hiển thị |
|---|---|
| `Chờ kích hoạt` | Mã (che một phần) · badge `--c9` · nút lớn `Tôi đã nhận được đồng hồ — Kích hoạt ngay` · dòng giải thích *"Thời hạn 1 năm bắt đầu tính từ khi bạn kích hoạt."* |
| `Đã kích hoạt` | Badge `--c8` · ngày kích hoạt · ngày hết hạn · thanh tiến trình thời gian còn lại · dòng `Còn 287 ngày` |
| `Sắp hết hạn` | Như trên nhưng thanh tiến trình và chữ dùng `--c9` · thêm nút `Gia hạn` |

**Hộp thoại xác nhận kích hoạt:** *"Sau khi kích hoạt, thời hạn 1 năm sẽ bắt đầu và bạn sẽ không thể đổi trả sản phẩm. Bạn chắc chắn muốn kích hoạt?"* — hai nút `Hủy` · `Xác nhận kích hoạt`.

Luôn có nút phụ ở cuối: `Gửi lại mã qua email`.

---

### B1 — Đăng nhập admin

Desktop, nền `--c3` phủ toàn màn, khung đăng nhập trắng đặt giữa.

- Tiêu đề `Medigo Admin`
- Dòng phụ `Khu vực vận hành nội bộ GoCare`
- Ô `Email/username` · ô `Mật khẩu` (có nút hiện/ẩn)
- Nút `Đăng nhập` — nền `--c6`, full width
- Dòng ghi chú cuối khung, chữ nhỏ `--c5`: *"Hệ thống thao tác tài chính — tách biệt hoàn toàn với đăng nhập seller."*

---

### B2 — Quản lý thành viên

**Bố cục:** sidebar trái 220px nền `--c3` + vùng nội dung phải.

**Sidebar:** logo, nhóm mục `Vận hành` gồm `Thành viên` và `Yêu cầu rút tiền`. Mục đang mở tô nền `--c6`.

**Thanh công cụ:** tiêu đề `Quản lý thành viên` · ô tìm kiếm · bộ lọc `Tất cả hạng` (Đồng / Bạc / Vàng) · bộ lọc `Tất cả trạng thái` (Đang hoạt động / Đã khóa) · nút `Xuất CSV/Excel`

**Bảng dữ liệu** — các cột:

`Tên` · `Liên hệ` · `aff_id` · `Tuyến trên` · `Hạng` · `Ngày tham gia` · `Trạng thái` · `Chi tiết ›`

Cột `Liên hệ` chỉ hiện dạng rút gọn `090•••123`. Cột `Tuyến trên` hiện `aff_id` của người giới thiệu, bấm được để nhảy tới hồ sơ đó.

**Panel chi tiết** — trượt vào từ bên phải khi bấm `Chi tiết ›`:

- Thông tin cá nhân đầy đủ, **bao gồm số điện thoại, CCCD và số tài khoản dạng đầy đủ** — chỉ ở panel này
- Sơ đồ tuyến dưới, hiển thị được tối đa 7 tầng dạng cây thu gọn (desktop đủ chỗ)
- Lịch sử đơn hàng & hoa hồng
- Nút thao tác: `Khóa tài khoản` (viền `--err`)

**Phân trang** ở cuối bảng. **Trạng thái rỗng** khi bộ lọc không ra kết quả.

---

### B3 — Yêu cầu rút tiền

Cùng bố cục sidebar với B2.

**Thanh công cụ:** tiêu đề `Yêu cầu rút tiền` · bộ lọc trạng thái · bộ lọc khoảng thời gian · nút `Xuất file Excel`

**Bảng dữ liệu** — các cột:

`Seller` · `Số tiền` · `Ngày yêu cầu` · `Số tài khoản nhận` · `Tên ngân hàng` · `Chi nhánh` · `Trạng thái` · `Chi tiết ›`

**Panel chi tiết:**

- Thông tin seller và số dư hiện tại
- Số tiền yêu cầu · thuế tạm tính · thực nhận
- Thông tin ngân hàng đầy đủ: `Ngân hàng` `Vietcombank` · `Số tài khoản` `0123456789` · `Chủ tài khoản`
- Ô nhập `Lý do từ chối (nếu có)` — bắt buộc điền khi bấm Từ chối
- Ba nút thao tác: `Duyệt` (nền `--c6`) · `Từ chối` (viền `--err`) · `Đánh dấu đã chi trả` (nền `--c8`)

> **Quy tắc bắt buộc:** nút `Đánh dấu đã chi trả` chỉ được bật khi yêu cầu đã ở trạng thái `Đã duyệt`. Không cho phép nhảy thẳng từ `Chờ duyệt` sang `Đã chi trả`.

Mỗi thao tác đều mở hộp thoại xác nhận, nêu rõ số tiền và tên người nhận trước khi thực hiện.

---

## 5. Trường hợp biên bắt buộc xử lý

- **Trạng thái rỗng** cho: giỏ hàng, danh sách tuyến dưới, lịch sử đơn hàng, kết quả lọc ở bảng admin
- **Tên dài và link giới thiệu dài** — cắt bằng dấu ba chấm, không được vỡ khung
- **Số tiền lớn** — định dạng dấu chấm, không xuống dòng giữa số
- **Thông tin nhạy cảm** — số điện thoại, CCCD, số tài khoản chỉ hiện đầy đủ trong panel chi tiết của admin; mọi danh sách khác đều rút gọn
- **Trạng thái đang tải** cho mọi bảng và biểu đồ
- **Bảng trên màn hẹp** — cuộn ngang trong khung riêng, thân trang không cuộn ngang
- **Nút đang xử lý** — hiện spinner và khóa nút, tránh bấm hai lần

---

## 6. Thay đổi đề xuất so với mockup gốc

Ba điểm dưới đây khác mockup khách đã xem. Đã có lý do cụ thể, nhưng **cần khách duyệt** — nếu khách không đồng ý thì quay lại như mockup.

1. **Sơ đồ tuyến dưới: từ cây 2 cấp → danh sách tổng hợp theo 7 tầng.** Lý do: hệ thống thực tế 7 tầng, không vẽ cây được trên màn 360px.

2. **Dashboard seller không hiện thông tin liên hệ của tuyến dưới.** Lý do: đó là dữ liệu cá nhân của người khác, chia sẻ giữa các cá nhân cần cơ sở pháp lý riêng.

3. **Bỏ nhóm "Thông tin nhận hoa hồng" (ngân hàng, số tài khoản) khỏi màn A2.** Mockup gốc đặt các trường này ngay trong form mua hàng. Lý do bỏ: lúc đó khách mới chỉ là người mua, chưa phải seller — thu số tài khoản ngân hàng ở bước này vừa làm form dài ra gây giảm tỉ lệ hoàn tất đơn, vừa là thu thập dữ liệu vượt quá mục đích. Các trường này đã có đầy đủ ở màn A6.

---

## 7. Ngoài phạm vi bản này

Không dựng trong prototype lần này:

- Màn hình của System Admin (cấu hình tỉ lệ hoa hồng, ngưỡng hạng, phân quyền)
- Quản lý kho hàng và vận đơn phía admin
- Quản lý kho mã kích hoạt phía admin
- Luồng gia hạn sau năm thứ nhất
- Trang nội dung của các chính sách (chỉ cần link)
- Kết nối API thật, cổng thanh toán thật, gửi email và SMS thật

---

## 8. Yêu cầu kỹ thuật khi dựng

- **Không hard-code** các con số nghiệp vụ. Tỉ lệ hoa hồng 7 tầng, ngưỡng thăng hạng, ngưỡng rút tiền tối thiểu, thuế suất, thời hạn gói — tất cả để trong một file cấu hình riêng, ví dụ `config/business-rules`. Các giá trị hiện tại đều là số mẫu chưa được duyệt.
- **Dữ liệu mẫu tách riêng** khỏi component, để trong `mock/` hoặc tương đương.
- **Tất cả màu lấy từ token**, không viết mã màu trực tiếp trong component.
- **Trang sản phẩm A0 phải render được nội dung mà không cần JavaScript**, hoặc tối thiểu có đủ thẻ Open Graph (tiêu đề, mô tả, ảnh, giá). Lý do: toàn bộ doanh số đến từ việc seller chia sẻ link lên Zalo và Facebook — link không hiện được ảnh và giá là mất chuyển đổi ngay tại bước đầu tiên.
- **Tham số `aff_id` phải được lưu vào cookie hoặc session ngay khi khách vào trang A0**, không đọc lại từ URL ở các bước sau. Luồng thanh toán sẽ chuyển hướng ra cổng thanh toán rồi quay về, tham số trên URL gần như chắc chắn bị mất.
