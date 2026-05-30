import os
from PIL import Image, ImageDraw

def generate_assets():
    src_path = 'public/favicon.ico'
    print(f"Reading source image from {src_path}...")
    
    # We must first read the source image. Since we will overwrite public/favicon.ico at the end, 
    # we load it into memory and close the file handle.
    with Image.open(src_path) as img:
        img_rgb = img.convert('RGB')
        
    # Crop the central 716x716 region where the dark circular logo is located
    # Bounding box is (154, 154, 870, 870)
    left, top, right, bottom = 154, 154, 870, 870
    cropped = img_rgb.crop((left, top, right, bottom))
    w, h = cropped.size
    print(f"Cropping central region: {w}x{h}")
    
    # Create a high-quality circular transparency mask.
    # To avoid jagged edges, we draw the circle exactly to the crop edges.
    mask = Image.new('L', (w, h), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, w - 1, h - 1), fill=255)
    
    # Combine cropped RGB image with the circular transparency mask
    rgba = cropped.convert('RGBA')
    rgba.putalpha(mask)
    
    def make_padded_icon(base_img, target_size, padding_ratio=0.1):
        # Calculate padding
        pad = int(target_size * padding_ratio)
        # Ensure padding is at least 1 pixel for small icons, but not too large
        if target_size <= 16:
            pad = 1
        elif target_size <= 32:
            pad = 2
            
        inner_size = target_size - 2 * pad
        # Resize circular image to inner_size using LANCZOS filter for superb quality
        resized_inner = base_img.resize((inner_size, inner_size), Image.Resampling.LANCZOS)
        # Create transparent canvas
        canvas = Image.new('RGBA', (target_size, target_size), (0, 0, 0, 0))
        # Paste resized inner circle in the center
        canvas.paste(resized_inner, (pad, pad), resized_inner)
        return canvas

    # Make the 512x512 high-resolution brand mark
    print("Generating 512x512 brand mark...")
    mark_512 = make_padded_icon(rgba, 512, padding_ratio=0.08) # 8% padding
    os.makedirs('public/brand', exist_ok=True)
    mark_512.save('public/brand/sortmyskills-mark.png', 'PNG')
    
    # Generate all other PNGs
    print("Generating other PNG sizes...")
    
    # Apple touch icon: 180x180
    apple_icon = make_padded_icon(rgba, 180, padding_ratio=0.08)
    apple_icon.save('public/apple-touch-icon.png', 'PNG')
    
    # Favicon PNG 16x16
    fav_16 = make_padded_icon(rgba, 16, padding_ratio=0.08)
    fav_16.save('public/favicon-16x16.png', 'PNG')
    
    # Favicon PNG 32x32
    fav_32 = make_padded_icon(rgba, 32, padding_ratio=0.08)
    fav_32.save('public/favicon-32x32.png', 'PNG')
    
    # Manifest icons
    icon_192 = make_padded_icon(rgba, 192, padding_ratio=0.08)
    icon_192.save('public/icon-192.png', 'PNG')
    
    icon_512 = make_padded_icon(rgba, 512, padding_ratio=0.08)
    icon_512.save('public/icon-512.png', 'PNG')
    
    # Create the true multi-resolution ICO file
    print("Generating multi-resolution ICO file...")
    # ICO standard sizes: 16x16, 32x32, 48x48
    ico_16 = make_padded_icon(rgba, 16, padding_ratio=0.08)
    ico_32 = make_padded_icon(rgba, 32, padding_ratio=0.08)
    ico_48 = make_padded_icon(rgba, 48, padding_ratio=0.08)
    
    # In Pillow, to save a multi-resolution ICO file:
    # Save the first image, and append the others
    ico_images = [ico_16, ico_32, ico_48]
    ico_images[0].save(
        'public/favicon.ico',
        format='ICO',
        append_images=ico_images[1:]
    )
    print("All favicon and app icon assets generated successfully!")

if __name__ == '__main__':
    generate_assets()
