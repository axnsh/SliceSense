from PIL import Image
from pathlib import Path

# Your fruit images are here
FRUIT_FOLDER = Path("public/images/fruits")

for image_path in FRUIT_FOLDER.glob("*.png"):

    # Skip already-generated halves
    if image_path.stem.endswith("_left") or image_path.stem.endswith("_right"):
        continue

    img = Image.open(image_path).convert("RGBA")

    width, height = img.size
    mid = width // 2

    # -------------------------
    # Left Half
    # -------------------------
    left = Image.new("RGBA", (width, height), (0, 0, 0, 0))

    left_part = img.crop((0, 0, mid, height))

    left.paste(left_part, (0, 0))

    left.save(
        FRUIT_FOLDER / f"{image_path.stem}_left.png"
    )

    # -------------------------
    # Right Half
    # -------------------------
    right = Image.new("RGBA", (width, height), (0, 0, 0, 0))

    right_part = img.crop((mid, 0, width, height))

    right.paste(right_part, (mid, 0))

    right.save(
        FRUIT_FOLDER / f"{image_path.stem}_right.png"
    )

print("Finished generating fruit halves!")