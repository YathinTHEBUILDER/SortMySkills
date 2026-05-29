"""One-off: import interview_questions_900.xlsx into src/data/interview-packs/*.ts"""
import openpyxl
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
XLSX = os.path.join(os.path.dirname(ROOT), "interview_questions_900.xlsx")
if not os.path.isfile(XLSX):
    XLSX = r"c:\Users\harsh\Downloads\interview_questions_900.xlsx"
OUT = os.path.join(ROOT, "src", "data", "interview-packs")

SHEETS = [
    ("Backend", "backend-engineer", "backend", "Backend Engineer", "backend.ts"),
    ("Frontend", "frontend-engineer", "frontend", "Frontend Engineer", "frontend.ts"),
    ("UX Designer", "ux-designer", "uxDesigner", "UX Designer", "ux-designer.ts"),
    ("Data Analyst", "data-analyst", "dataAnalyst", "Data Analyst", "data-analyst.ts"),
    ("ML Engineer", "ml-engineer", "mlEngineer", "ML Engineer", "ml-engineer.ts"),
    ("Product Manager", "product-manager", "productManager", "Product Manager", "product-manager.ts"),
]


def esc(s: str) -> str:
    return (
        str(s)
        .replace("\\", "\\\\")
        .replace('"', '\\"')
        .replace("\n", " ")
        .replace("\r", " ")
        .strip()
    )


def main() -> None:
    wb = openpyxl.load_workbook(XLSX, read_only=True)
    diff_order = {"Easy": 0, "Medium": 1, "Hard": 2}

    for sheet_name, slug, export_name, title, filename in SHEETS:
        ws = wb[sheet_name]
        rows = []
        for row in ws.iter_rows(min_row=2, values_only=True):
            if not row or not row[2]:
                continue
            diff = str(row[1]).strip()
            q = esc(row[2])
            rows.append((diff_order.get(diff, 9), diff, q))

        rows.sort(key=lambda x: (x[0], x[2].lower()))
        easy = [r[2] for r in rows if r[1] == "Easy"]
        medium = [r[2] for r in rows if r[1] == "Medium"]
        hard = [r[2] for r in rows if r[1] == "Hard"]

        def arr_block(items: list[str]) -> str:
            lines = "\n".join(f'  "{item}",' for item in items)
            return f"[\n{lines}\n]"

        content = f'''import {{ buildPack }} from "./types";

const EASY = {arr_block(easy)};

const MEDIUM = {arr_block(medium)};

const HARD = {arr_block(hard)};

export const {export_name}Pack = buildPack(
  "{slug}",
  "{title}",
  "150 curated interview questions for {title} roles — sorted Easy, Medium, Hard.",
  EASY,
  MEDIUM,
  HARD
);
'''
        path = os.path.join(OUT, filename)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"wrote {filename}: {len(easy)} easy, {len(medium)} med, {len(hard)} hard")


if __name__ == "__main__":
    main()
