import os
import shutil
import subprocess

WORKSPACE = r"D:\code\cambridge-lichu-2026-pre-a1-starters"
VOL1_MP3 = os.path.join(WORKSPACE, r"pre-a1-starters-a1-movers-a2-flyers-vol-1\starters-sample-listening-2018.mp3")
VOL2_DIR = os.path.join(WORKSPACE, r"pre-a1-starters-a1-movers-a2-flyers-vol-2")

OUT_AUDIO_V1 = os.path.join(WORKSPACE, r"assets\audio\vol1")
OUT_AUDIO_V2 = os.path.join(WORKSPACE, r"assets\audio\vol2")
os.makedirs(OUT_AUDIO_V1, exist_ok=True)
os.makedirs(OUT_AUDIO_V2, exist_ok=True)

# Split Vol 1 into 4 parts at exact 5s silence midpoints:
# Part 1: 0 to 323.5s
# Part 2: 323.5s to 627.5s
# Part 3: 627.5s to 950.0s
# Part 4: 950.0s to end
splits = [
    ("part1.mp3", "0", "323.5"),
    ("part2.mp3", "323.5", "627.5"),
    ("part3.mp3", "627.5", "950.0"),
    ("part4.mp3", "950.0", None),
]

for fname, start, end in splits:
    out_p = os.path.join(OUT_AUDIO_V1, fname)
    cmd = ["ffmpeg", "-y", "-i", VOL1_MP3, "-ss", start]
    if end:
        cmd += ["-to", end]
    cmd += ["-c", "copy", out_p]
    subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    print(f"Created Vol 1 {fname} ({os.path.getsize(out_p)/1024:.1f} KB)")

# Copy Vol 2 tracks with clean URL-safe names
for idx in range(1, 5):
    src = os.path.join(VOL2_DIR, f"YLE CEPSSU Starters R154 - Track {idx} 128kbps.mp3")
    dst = os.path.join(OUT_AUDIO_V2, f"part{idx}.mp3")
    shutil.copy2(src, dst)
    print(f"Copied Vol 2 part{idx}.mp3 ({os.path.getsize(dst)/1024:.1f} KB)")

print("Audio preparation complete!")
