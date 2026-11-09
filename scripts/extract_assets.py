import os
import fitz  # PyMuPDF
from PIL import Image

WORKSPACE = r"D:\code\cambridge-lichu-2026-pre-a1-starters"
VOL1_PDF = os.path.join(WORKSPACE, r"pre-a1-starters-a1-movers-a2-flyers-vol-1\young-learners-sample-papers-2018-vol1.pdf")
VOL2_PDF = os.path.join(WORKSPACE, r"pre-a1-starters-a1-movers-a2-flyers-vol-2\young-learners-sample-papers-2018-vol2.pdf")

OUT_VOL1 = os.path.join(WORKSPACE, r"assets\images\vol1")
OUT_VOL2 = os.path.join(WORKSPACE, r"assets\images\vol2")
os.makedirs(OUT_VOL1, exist_ok=True)
os.makedirs(OUT_VOL2, exist_ok=True)

def save_crop(doc, pno_1b, rect_coords, out_path, dpi=240, rotate_cw=False):
    page = doc[pno_1b - 1]
    clip = fitz.Rect(*rect_coords)
    pix = page.get_pixmap(clip=clip, dpi=dpi, alpha=False)
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    if rotate_cw:
        img = img.transpose(Image.Transpose.ROTATE_270)
    img.save(out_path, "WEBP", quality=90)
    return img.size

def extract_vol1():
    doc = fitz.open(VOL1_PDF)
    print("Extracting Volume 1 images...")

    # Listening Part 1 & 2 & 4
    save_crop(doc, 5, [75, 142, 515, 720], os.path.join(OUT_VOL1, "l_p1_scene.webp"), dpi=240)
    save_crop(doc, 6, [95, 188, 502, 583], os.path.join(OUT_VOL1, "l_p2_scene.webp"), dpi=240)
    save_crop(doc, 10, [50, 158, 535, 762], os.path.join(OUT_VOL1, "l_p4_scene.webp"), dpi=240)

    # Listening Part 3 (PDF P8: ex, q1, q2; PDF P9: q3, q4, q5)
    p3_p8_rows = [("ex", 195.0, 326.5), ("q1", 413.2, 544.6), ("q2", 617.8, 749.8)]
    p3_p8_cols = [("A", 91.0, 222.5), ("B", 232.8, 364.2), ("C", 374.4, 505.8)]
    for qid, y0, y1 in p3_p8_rows:
        for opt, x0, x1 in p3_p8_cols:
            save_crop(doc, 8, [x0, y0, x1, y1], os.path.join(OUT_VOL1, f"l_p3_{qid}_{opt}.webp"), dpi=220)

    p3_p9_rows = [("q3", 119.8, 251.4), ("q4", 324.2, 455.8), ("q5", 528.8, 660.2)]
    p3_p9_cols = [("A", 99.2, 230.6), ("B", 240.8, 372.2), ("C", 382.6, 514.0)]
    for qid, y0, y1 in p3_p9_rows:
        for opt, x0, x1 in p3_p9_cols:
            save_crop(doc, 9, [x0, y0, x1, y1], os.path.join(OUT_VOL1, f"l_p3_{qid}_{opt}.webp"), dpi=220)

    # R&W Part 1 (PDF P17 & P18)
    save_crop(doc, 17, [139.0, 211.8, 324.5, 366.2], os.path.join(OUT_VOL1, "rw_p1_ex1.webp"), dpi=220)
    save_crop(doc, 17, [138.8, 389.5, 324.8, 545.5], os.path.join(OUT_VOL1, "rw_p1_ex2.webp"), dpi=220)
    save_crop(doc, 17, [138.8, 622.8, 324.8, 777.2], os.path.join(OUT_VOL1, "rw_p1_q1.webp"), dpi=220)
    save_crop(doc, 18, [131.2, 87.2, 316.2, 241.5], os.path.join(OUT_VOL1, "rw_p1_q2.webp"), dpi=220)
    save_crop(doc, 18, [131.2, 265.5, 318.2, 420.5], os.path.join(OUT_VOL1, "rw_p1_q3.webp"), dpi=220)
    save_crop(doc, 18, [130.8, 444.8, 316.6, 598.4], os.path.join(OUT_VOL1, "rw_p1_q4.webp"), dpi=220)
    save_crop(doc, 18, [130.8, 622.8, 316.0, 777.5], os.path.join(OUT_VOL1, "rw_p1_q5.webp"), dpi=220)

    # R&W Part 2 (PDF P19)
    save_crop(doc, 19, [96.5, 148.5, 495.5, 441.5], os.path.join(OUT_VOL1, "rw_p2_scene.webp"), dpi=240)

    # R&W Part 3 (PDF P20)
    p3_rw_rows = [
        ("ex", [102, 174, 212, 258], [412, 170, 486, 258]),
        ("q1", [108, 276, 196, 368], [412, 276, 486, 366]),
        ("q2", [106, 370, 204, 452], [412, 368, 486, 454]),
        ("q3", [106, 460, 210, 542], [410, 458, 486, 544]),
        ("q4", [108, 548, 204, 634], [412, 548, 486, 634]),
        ("q5", [112, 636, 192, 720], [410, 636, 488, 722]),
    ]
    for qid, img_rect, let_rect in p3_rw_rows:
        save_crop(doc, 20, img_rect, os.path.join(OUT_VOL1, f"rw_p3_{qid}_img.webp"), dpi=220)
        save_crop(doc, 20, let_rect, os.path.join(OUT_VOL1, f"rw_p3_{qid}_letters.webp"), dpi=220)

    # R&W Part 4 (PDF P21)
    save_crop(doc, 21, [213.5, 196.5, 414.5, 326.8], os.path.join(OUT_VOL1, "rw_p4_main.webp"), dpi=240)
    p4_cards_v1 = [
        ("animals", [84, 596, 185, 683]),
        ("tail",    [199, 596, 300, 683]),
        ("balloon", [314, 596, 416, 683]),
        ("trees",   [429, 596, 531, 683]),
        ("legs",    [84, 693, 185, 780]),
        ("spiders", [199, 693, 300, 780]),
        ("teacher", [314, 693, 416, 780]),
        ("sand",    [429, 693, 531, 780]),
    ]
    for word, rect in p4_cards_v1:
        save_crop(doc, 21, rect, os.path.join(OUT_VOL1, f"rw_p4_{word}.webp"), dpi=220)

    # R&W Part 5 (PDF P22 & P23)
    save_crop(doc, 22, [75.5, 179.0, 503.0, 493.5], os.path.join(OUT_VOL1, "rw_p5_scene1.webp"), dpi=240)
    save_crop(doc, 23, [89.5, 79.5, 517.5, 292.0], os.path.join(OUT_VOL1, "rw_p5_scene2.webp"), dpi=240)
    save_crop(doc, 23, [90.0, 430.5, 518.0, 643.0], os.path.join(OUT_VOL1, "rw_p5_scene3.webp"), dpi=240)

    # Speaking (PDF P26 Scene rotated 90° CW; PDF P27 8 Object cards)
    save_crop(doc, 26, [55, 42, 535, 775], os.path.join(OUT_VOL1, "sp_scene.webp"), dpi=240, rotate_cw=True)
    sp_cards_v1 = [
        (1, [68, 44, 243, 218]),
        (2, [337, 44, 512, 218]),
        (3, [68, 232, 243, 407]),
        (4, [338, 232, 512, 407]),
        (5, [68, 422, 243, 597]),
        (6, [338, 422, 512, 597]),
        (7, [68, 611, 243, 784]),
        (8, [337, 611, 512, 784]),
    ]
    for idx, rect in sp_cards_v1:
        save_crop(doc, 27, rect, os.path.join(OUT_VOL1, f"sp_card_{idx}.webp"), dpi=220)

    print("Volume 1 extraction complete!")


def extract_vol2():
    doc = fitz.open(VOL2_PDF)
    print("Extracting Volume 2 images...")

    # Listening Part 1 & 2 & 4
    save_crop(doc, 5, [75, 140, 538, 682], os.path.join(OUT_VOL2, "l_p1_scene.webp"), dpi=240)
    save_crop(doc, 6, [107, 194, 481, 568], os.path.join(OUT_VOL2, "l_p2_scene.webp"), dpi=240)
    save_crop(doc, 10, [59, 147, 529, 753], os.path.join(OUT_VOL2, "l_p4_scene.webp"), dpi=240)

    # Listening Part 3 (PDF P8: ex, q1, q2; PDF P9: q3, q4, q5)
    p3_p8_rows = [("ex", 177.5, 310.0), ("q1", 391.2, 521.0), ("q2", 604.8, 734.8)]
    p3_p8_cols = [("A", 94.2, 224.5), ("B", 234.2, 364.2), ("C", 372.5, 502.8)]
    for qid, y0, y1 in p3_p8_rows:
        for opt, x0, x1 in p3_p8_cols:
            save_crop(doc, 8, [x0, y0, x1, y1], os.path.join(OUT_VOL2, f"l_p3_{qid}_{opt}.webp"), dpi=220)

    p3_p9_rows = [("q3", 117.5, 246.8), ("q4", 330.5, 459.0), ("q5", 542.6, 672.0)]
    p3_p9_cols = [("A", 98.5, 227.8), ("B", 238.5, 367.8), ("C", 376.5, 506.0)]
    for qid, y0, y1 in p3_p9_rows:
        for opt, x0, x1 in p3_p9_cols:
            save_crop(doc, 9, [x0, y0, x1, y1], os.path.join(OUT_VOL2, f"l_p3_{qid}_{opt}.webp"), dpi=220)

    # R&W Part 1 (PDF P17 & P18)
    save_crop(doc, 17, [109.8, 195.8, 294.8, 349.2], os.path.join(OUT_VOL2, "rw_p1_ex1.webp"), dpi=220)
    save_crop(doc, 17, [109.8, 373.2, 295.4, 528.0], os.path.join(OUT_VOL2, "rw_p1_ex2.webp"), dpi=220)
    save_crop(doc, 17, [110.5, 590.5, 283.5, 731.2], os.path.join(OUT_VOL2, "rw_p1_q1.webp"), dpi=220)
    save_crop(doc, 18, [95.6, 62.2, 279.2, 215.4], os.path.join(OUT_VOL2, "rw_p1_q2.webp"), dpi=220)
    save_crop(doc, 18, [96.0, 240.0, 280.6, 392.2], os.path.join(OUT_VOL2, "rw_p1_q3.webp"), dpi=220)
    save_crop(doc, 18, [97.0, 416.8, 278.8, 569.6], os.path.join(OUT_VOL2, "rw_p1_q4.webp"), dpi=220)
    save_crop(doc, 18, [96.0, 595.0, 280.4, 747.0], os.path.join(OUT_VOL2, "rw_p1_q5.webp"), dpi=220)

    # R&W Part 2 (PDF P19)
    save_crop(doc, 19, [121.0, 135.5, 517.5, 426.5], os.path.join(OUT_VOL2, "rw_p2_scene.webp"), dpi=240)

    # R&W Part 3 (PDF P20)
    p3_rw_rows = [
        ("ex", [122, 148, 232, 236], [406, 148, 524, 236]),
        ("q1", [132, 262, 220, 350], [406, 260, 524, 348]),
        ("q2", [124, 368, 226, 450], [406, 368, 524, 452]),
        ("q3", [120, 478, 230, 556], [406, 470, 524, 560]),
        ("q4", [120, 576, 232, 662], [406, 574, 524, 662]),
        ("q5", [106, 680, 238, 770], [406, 680, 526, 770]),
    ]
    for qid, img_rect, let_rect in p3_rw_rows:
        save_crop(doc, 20, img_rect, os.path.join(OUT_VOL2, f"rw_p3_{qid}_img.webp"), dpi=220)
        save_crop(doc, 20, let_rect, os.path.join(OUT_VOL2, f"rw_p3_{qid}_letters.webp"), dpi=220)

    # R&W Part 4 (PDF P21)
    save_crop(doc, 21, [195.8, 193.0, 395.0, 305.8], os.path.join(OUT_VOL2, "rw_p4_main.webp"), dpi=240)
    p4_cards_v2 = [
        ("legs",    [78, 574, 174, 658]),
        ("people",  [202, 574, 292, 658]),
        ("food",    [317, 574, 416, 658]),
        ("balloon", [432, 574, 531, 658]),
        ("eyes",    [78, 665, 174, 750]),
        ("door",    [202, 665, 294, 750]),
        ("day",     [322, 665, 415, 750]),
        ("tail",    [441, 665, 523, 750]),
    ]
    for word, rect in p4_cards_v2:
        save_crop(doc, 21, rect, os.path.join(OUT_VOL2, f"rw_p4_{word}.webp"), dpi=220)

    # R&W Part 5 (PDF P22 & P23)
    save_crop(doc, 22, [79.5, 165.0, 503.5, 448.0], os.path.join(OUT_VOL2, "rw_p5_scene1.webp"), dpi=240)
    save_crop(doc, 23, [96.0, 96.5, 519.5, 306.0], os.path.join(OUT_VOL2, "rw_p5_scene2.webp"), dpi=240)
    save_crop(doc, 23, [95.5, 425.5, 518.5, 635.0], os.path.join(OUT_VOL2, "rw_p5_scene3.webp"), dpi=240)

    # Speaking (PDF P26 8 Object cards; PDF P27 Scene rotated 90° CW)
    sp_cards_v2 = [
        (1, [90, 48, 268, 226]),
        (2, [314, 48, 492, 226]),
        (3, [90, 232, 268, 411]),
        (4, [314, 232, 492, 411]),
        (5, [90, 417, 268, 595]),
        (6, [314, 417, 492, 595]),
        (7, [90, 601, 268, 780]),
        (8, [314, 601, 492, 780]),
    ]
    for idx, rect in sp_cards_v2:
        save_crop(doc, 26, rect, os.path.join(OUT_VOL2, f"sp_card_{idx}.webp"), dpi=220)
    save_crop(doc, 27, [69, 61, 530, 755], os.path.join(OUT_VOL2, "sp_scene.webp"), dpi=240, rotate_cw=True)

    print("Volume 2 extraction complete!")

if __name__ == "__main__":
    extract_vol1()
    extract_vol2()
    v1_files = os.listdir(OUT_VOL1)
    v2_files = os.listdir(OUT_VOL2)
    print(f"Done! Vol 1: {len(v1_files)} images, Vol 2: {len(v2_files)} images.")
