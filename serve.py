"""
Dev server cho prototype Medigo.

Chạy:  python serve.py          (mặc định cổng 5173)
       python serve.py 8080

Khác `python -m http.server` ở một điểm quan trọng: server này gửi
`Cache-Control: no-store`, nên mỗi lần bấm refresh là trình duyệt nạp lại
đúng file vừa sửa. Dùng http.server thường thì trình duyệt hay giữ bản
JS/CSS cũ trong bộ nhớ đệm và bạn sẽ tưởng là code không ăn.
"""

import sys
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler


class NoCacheHandler(SimpleHTTPRequestHandler):
    # Bắt buộc dùng ThreadingHTTPServer: server đơn luồng sẽ treo khi trình duyệt
    # giữ kết nối keep-alive, các request sau xếp hàng vô hạn.
    protocol_version = "HTTP/1.1"

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):
        # Bớt ồn: chỉ log lỗi, bỏ qua 200/304
        if args and str(args[1]).startswith(("4", "5")):
            super().log_message(fmt, *args)


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5173
    handler = partial(NoCacheHandler, directory=".")
    server = ThreadingHTTPServer(("127.0.0.1", port), handler)
    server.daemon_threads = True
    print(f"Medigo prototype: http://localhost:{port}/index.html")
    print("Ctrl+C de dung.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nDa dung server.")


if __name__ == "__main__":
    main()
