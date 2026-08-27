"""
Sinh ảnh thumbnail nhẹ cho dải chọn ảnh ở màn A0.

Vì sao cần: ảnh gốc trong mock/assets là 1890x1063 (~600KB-1.1MB mỗi tấm), trong khi
thumbnail chỉ hiển thị ở 96-128px. Nếu dùng thẳng ảnh gốc thì mở màn A0 phải tải
khoảng 5MB chỉ để vẽ 6 ô nhỏ.

Chạy:  python tools/make_thumbs.py

Đọc  : mock/assets/*.png
Ghi  : mock/assets/thumbs/<tên gốc>.png  (rộng 320px, giữ nguyên tỉ lệ)
       mock/assets/og-cover.png          (1200x630, ảnh thẻ chia sẻ Zalo/Facebook)

Chạy lại được nhiều lần, ghi đè bản cũ. Ảnh gốc không bị đụng tới.
"""

import os
import sys

try:
    from PIL import Image
except ImportError:
    print('Thieu thu vien Pillow. Chay: pip install Pillow')
    sys.exit(1)

THUMB_WIDTH = 320

# Ảnh thẻ chia sẻ: 1200x630 là tỉ lệ Facebook/Zalo dựng khung xem trước.
# Tên file cố tình không có dấu cách và ngoặc — một số trình thu thập dữ liệu
# xử lý %20 và dấu ngoặc trong URL không ổn định.
OG_SIZE = (1200, 630)
OG_NAME = 'og-cover.png'

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = os.path.join(ROOT, 'mock', 'assets')
OUT_DIR = os.path.join(SRC_DIR, 'thumbs')


def main():
    if not os.path.isdir(SRC_DIR):
        print('Khong thay thu muc: ' + SRC_DIR)
        sys.exit(1)

    os.makedirs(OUT_DIR, exist_ok=True)

    names = sorted(n for n in os.listdir(SRC_DIR) if n.lower().endswith('.png'))
    if not names:
        print('Khong co file .png nao trong ' + SRC_DIR)
        return

    total_src = 0
    total_out = 0

    for name in names:
        src = os.path.join(SRC_DIR, name)
        out = os.path.join(OUT_DIR, name)

        with Image.open(src) as im:
            w, h = im.size
            new_h = max(1, round(h * THUMB_WIDTH / w))
            im = im.convert('RGB')
            im = im.resize((THUMB_WIDTH, new_h), Image.LANCZOS)
            im.save(out, 'PNG', optimize=True)

        s_kb = os.path.getsize(src) / 1024
        o_kb = os.path.getsize(out) / 1024
        total_src += s_kb
        total_out += o_kb
        print('%-14s %5dx%-5d %7.0f KB  ->  %dx%d %6.1f KB  (giam %.0f%%)'
              % (name, w, h, s_kb, THUMB_WIDTH, new_h, o_kb, 100 - o_kb / s_kb * 100))

    print('-' * 72)
    print('Tong: %.0f KB  ->  %.0f KB  (giam %.0f%%)'
          % (total_src, total_out, 100 - total_out / total_src * 100))
    print('Da ghi vao: ' + OUT_DIR)

    make_og_cover(os.path.join(SRC_DIR, names[0]))


def make_og_cover(src_path):
    """Dựng ảnh thẻ chia sẻ 1200x630 từ ảnh đầu tiên, nền trắng, không cắt mất chữ."""
    out = os.path.join(SRC_DIR, OG_NAME)
    with Image.open(src_path) as im:
        im = im.convert('RGB')
        im.thumbnail(OG_SIZE, Image.LANCZOS)          # co vừa khung, giữ tỉ lệ
        canvas = Image.new('RGB', OG_SIZE, (255, 255, 255))
        canvas.paste(im, ((OG_SIZE[0] - im.width) // 2, (OG_SIZE[1] - im.height) // 2))
        canvas.save(out, 'PNG', optimize=True)
    print('Anh the chia se: %s  %dx%d  %.0f KB'
          % (OG_NAME, OG_SIZE[0], OG_SIZE[1], os.path.getsize(out) / 1024))


if __name__ == '__main__':
    main()
