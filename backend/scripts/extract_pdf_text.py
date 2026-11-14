from pathlib import Path

from pypdf import PdfReader

RAW_DIR = Path(__file__).resolve().parents[2] / "data" / "raw" / "reports"
OUT_DIR = RAW_DIR

def extract(pdf_path: Path) -> None:
    reader = PdfReader(pdf_path)
    text = "\n\n".join(page.extract_text() or "" for page in reader.pages)
    out_path = OUT_DIR / f"{pdf_path.stem}.txt"
    out_path.write_text(text, encoding="utf-8")
    print(f"{pdf_path.name}: {len(reader.pages)} pages -> {out_path.name} ({len(text):,} chars)")


if __name__ == "__main__":
    for pdf_path in RAW_DIR.glob("*.pdf"):
        extract(pdf_path)
