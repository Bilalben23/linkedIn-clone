import pdfplumber

# تحديد مسار ملف PDF المدخل
pdf_path = "./pdf.pdf"

# تحديد مسار ملف النص الناتج
output_txt_path = "./extracted_text.txt"

# فتح ملف PDF واستخراج النص
with pdfplumber.open(pdf_path) as pdf:
    with open(output_txt_path, "w", encoding="utf-8") as txt_file:
        for i, page in enumerate(pdf.pages, start=1):
            txt_file.write(f"\n\n### Page {i} ###\n\n")  # الإشارة إلى رقم الصفحة
            text = page.extract_text()
            if text:
                txt_file.write(text + "\n")

# طباعة مسار الملف النصي الناتج
print(f"تم استخراج النص وحفظه في: {output_txt_path}")
