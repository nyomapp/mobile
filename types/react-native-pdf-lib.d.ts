declare module "react-native-pdf-lib" {
  export interface PDFPage {
    setMediaBox(width: number, height: number): PDFPage;
    drawImage(
      path: string,
      format: "jpg" | "png",
      options: { x: number; y: number; width: number; height: number }
    ): PDFPage;
  }

  export interface PDFDocument {
    addPages(...pages: PDFPage[]): PDFDocument;
    write(): Promise<string>;
  }

  export const PDFPage: { create(): PDFPage };
  export const PDFDocument: { create(path: string): PDFDocument };

  const _default: { PDFPage: typeof PDFPage; PDFDocument: typeof PDFDocument };
  export default _default;
}