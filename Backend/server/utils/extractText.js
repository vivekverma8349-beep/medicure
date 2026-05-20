// utils/extractText.js

import { PDFParse } from "pdf-parse";
import Tesseract from "tesseract.js";

const extractText = async (file) => {
  try {
    const mimeType = file.mimetype;

    if (mimeType === "application/pdf") {
      // pdf-parse v2 uses a class-based API: new PDFParse({ data }) then .getText()
      const parser = new PDFParse({ data: file.buffer });
      const result = await parser.getText();
      const text = typeof result.text === "string" ? result.text.trim() : "";
      console.log("PDF text extracted, length:", text.length);
      await parser.destroy();
      return text;
    }

    if (mimeType.startsWith("image/")) {
      const { data } = await Tesseract.recognize(file.buffer, "eng", {
        logger: () => {},
      });
      return typeof data.text === "string" ? data.text : "";
    }

    return "";
  } catch (err) {
    console.error("extractText error:", err.message);
    return "";
  }
};

export default extractText;