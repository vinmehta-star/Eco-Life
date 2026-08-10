from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class EcoLifeHandler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".js": "text/javascript",
        ".mjs": "text/javascript",
        ".css": "text/css",
        ".html": "text/html; charset=utf-8",
        ".json": "application/json",
        ".svg": "image/svg+xml",
    }


def main():
    host = "localhost"
    port = 8766
    root = Path(__file__).resolve().parent
    server = ThreadingHTTPServer((host, port), EcoLifeHandler)
    print(f"Serving EcoLife from {root}")
    print(f"Open http://{host}:{port}/")
    server.serve_forever()


if __name__ == "__main__":
    main()