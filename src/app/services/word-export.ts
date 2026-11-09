import { Recipe } from '../models/recipe';
import type { Paragraph as ParagraphT, TextRun as TextRunT } from 'docx';

/** Builds a right-to-left Word (.docx) file for a recipe and downloads it. */
export async function exportRecipeToWord(r: Recipe): Promise<void> {
  // Loaded only when someone clicks export, so it doesn't weigh down the site.
  const { AlignmentType, BorderStyle, Document, ImageRun, Packer, Paragraph, TextRun } =
    await import('docx');

  const FONT = 'Arial';
  const ACCENT = 'E8590C';

  const text = (value: string, opts: { bold?: boolean; size?: number; color?: string } = {}) =>
    new TextRun({
      text: value,
      rightToLeft: true,
      font: FONT,
      bold: opts.bold,
      boldComplexScript: opts.bold,
      size: opts.size ?? 24,
      sizeComplexScript: opts.size ?? 24,
      color: opts.color,
    });

  const para = (children: TextRunT[], spacingAfter = 120) =>
    new Paragraph({ bidirectional: true, alignment: AlignmentType.START, spacing: { after: spacingAfter }, children });

  const heading = (value: string) =>
    new Paragraph({
      bidirectional: true,
      spacing: { before: 360, after: 160 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: ACCENT, space: 4 } },
      children: [text(value, { bold: true, size: 32, color: ACCENT })],
    });

  const children: ParagraphT[] = [];

  const image = await loadImage(r.imageUrl);
  if (image) {
    const width = 600;
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: [
          new ImageRun({
            type: 'jpg',
            data: image.data,
            transformation: { width, height: Math.round((width * image.height) / image.width) },
          }),
        ],
      }),
    );
  }

  children.push(para([text(r.title, { bold: true, size: 48 })], 80));
  if (r.description) children.push(para([text(r.description, { size: 26, color: '555555' })], 160));
  children.push(
    para(
      [
        text('קטגוריה: ', { bold: true }), text(r.category),
        text('   |   זמן הכנה: ', { bold: true }), text(`${r.prepMinutes} דקות`),
        text('   |   מנות: ', { bold: true }), text(String(r.servings)),
      ],
      120,
    ),
  );

  children.push(heading('מצרכים'));
  for (const i of r.ingredients) children.push(para([text('•  ', { color: ACCENT, bold: true }), text(i)]));

  children.push(heading('אופן ההכנה'));
  r.steps.forEach((s, idx) =>
    children.push(para([text(`${idx + 1}.  `, { color: ACCENT, bold: true }), text(s)], 160)),
  );

  const doc = new Document({
    creator: 'סבתא מלכה מבשלת',
    title: r.title,
    sections: [{ properties: {}, children }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${r.title.replace(/[\\/:*?"<>|]/g, '').trim() || 'recipe'}.docx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Fetches the recipe image and re-encodes it as JPEG (Word doesn't accept every format). */
async function loadImage(src: string): Promise<{ data: ArrayBuffer; width: number; height: number } | null> {
  if (!src) return null;
  try {
    const res = await fetch(src, { mode: 'cors' });
    if (!res.ok) return null;
    const bitmap = await createImageBitmap(await res.blob());
    const scale = Math.min(1, 1200 / bitmap.width);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const jpeg = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85));
    if (!jpeg) return null;
    return { data: await jpeg.arrayBuffer(), width: canvas.width, height: canvas.height };
  } catch {
    return null; // e.g. the image host blocks cross-origin requests — export without it
  }
}
