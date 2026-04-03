from PIL import Image, ImageDraw, ImageFont
import numpy as np
import math, os

FONTS = "C:/Users/Vivaan/AppData/Roaming/Claude/local-agent-mode-sessions/skills-plugin/0a711f9d-ebca-4f32-a0f4-d6b11ef3d808/0dba5672-e73c-4beb-b20f-64495b53a49a/skills/canvas-design/canvas-fonts"
OUT   = "C:/Users/Vivaan/Downloads/sachin-website/assets/banners"
W, H  = 1200, 630

def font(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), size)

def add_noise(img, strength=18):
    arr = np.array(img).astype(np.int16)
    noise = np.random.randint(-strength, strength, arr.shape, dtype=np.int16)
    arr = np.clip(arr + noise, 0, 255).astype(np.uint8)
    return Image.fromarray(arr)

def hex2rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def draw_text_wrapped(draw, text, x, y, font_obj, fill, max_width):
    words = text.split()
    lines, line = [], ""
    for w in words:
        test = (line + " " + w).strip()
        bb = draw.textbbox((0, 0), test, font=font_obj)
        if bb[2] - bb[0] > max_width and line:
            lines.append(line)
            line = w
        else:
            line = test
    lines.append(line)
    lh = draw.textbbox((0, 0), "Ag", font=font_obj)
    line_h = lh[3] - lh[1] + 8
    for l in lines:
        draw.text((x, y), l, font=font_obj, fill=fill)
        y += line_h
    return y

def pill(draw, x, y, text, fg, bg, font_obj, pad_x=18, pad_y=8):
    bb = draw.textbbox((0, 0), text, font=font_obj)
    tw, th = bb[2]-bb[0], bb[3]-bb[1]
    r = (th + pad_y*2) // 2
    rx0, ry0 = x, y
    rx1, ry1 = x + tw + pad_x*2, y + th + pad_y*2
    draw.rounded_rectangle([rx0, ry0, rx1, ry1], radius=r, fill=bg)
    draw.text((x + pad_x, y + pad_y), text, font=font_obj, fill=fg)

def vignette(img, strength=0.45):
    arr = np.array(img).astype(np.float32)
    rows, cols = arr.shape[:2]
    Y, X = np.ogrid[:rows, :cols]
    cx, cy = cols/2, rows/2
    dist = np.sqrt(((X-cx)/cx)**2 + ((Y-cy)/cy)**2)
    mask = np.clip(1 - dist * strength, 0, 1)
    arr[:,:,:3] *= mask[:,:,np.newaxis]
    return Image.fromarray(arr.astype(np.uint8))

# ─── SHARED FONTS ─────────────────────────────────────────────────────────────
f_title   = font("Lora-Bold.ttf",         62)
f_title_s = font("Lora-Bold.ttf",         48)
f_sub     = font("InstrumentSans-Regular.ttf", 24)
f_label   = font("InstrumentSans-Bold.ttf",    15) if os.path.exists(os.path.join(FONTS,"InstrumentSans-Bold.ttf")) else font("WorkSans-Bold.ttf", 15)
f_meta    = font("InstrumentSans-Regular.ttf", 14)
f_mono    = font("GeistMono-Regular.ttf",  13)
f_huge    = font("Lora-Bold.ttf",         160)

BG   = (7,  9,  15)
SURF = (14, 17, 23)

# ══════════════════════════════════════════════════════════════════════════════
# 1. AEO GUIDE — neural network / citation graph
# ══════════════════════════════════════════════════════════════════════════════
def banner_aeo():
    img = Image.new("RGB", (W, H), BG)
    d   = ImageDraw.Draw(img, "RGBA")

    # background gradient wash
    for i in range(H):
        t = i / H
        r = int(7  + t * 20)
        g = int(9  + t * 5)
        b = int(15 + t * 40)
        d.line([(0,i),(W,i)], fill=(r,g,b))

    # large ghost "AEO" watermark, right side
    d.text((620, 130), "AEO", font=f_huge, fill=(108, 92, 231, 22))

    # node positions for neural net
    rng = np.random.default_rng(42)
    nodes = [(int(x), int(y)) for x,y in rng.uniform([550,60],[1170,570], (28,2))]
    # draw edges
    for i, (x1,y1) in enumerate(nodes):
        for j, (x2,y2) in enumerate(nodes):
            if j <= i: continue
            dist = math.hypot(x2-x1, y2-y1)
            if dist < 190:
                alpha = max(20, int(80 * (1 - dist/190)))
                d.line([(x1,y1),(x2,y2)], fill=(108,92,231,alpha), width=1)
    # draw nodes
    for i,(x,y) in enumerate(nodes):
        col = (0,212,170) if i%5==0 else (108,92,231)
        r = 5 if i%5==0 else 3
        d.ellipse([x-r,y-r,x+r,y+r], fill=col+(255,))
        # glow ring
        d.ellipse([x-r-4,y-r-4,x+r+4,y+r+4], outline=col+(40,), width=1)

    # horizontal rule
    d.line([(60,290),(540,290)], fill=(108,92,231,90), width=1)

    # pill
    pill(d, 60, 52, "AEO / GEO", (200,190,255), (40,30,80), f_label)

    # title
    draw_text_wrapped(d, "Answer Engine Optimization in 2026", 60, 100, f_title_s, (255,255,255), 520)

    # subtitle
    draw_text_wrapped(d, "How to get your brand cited by ChatGPT, Perplexity & Google SGE", 60, 310, f_sub, (180,190,200), 480)

    # bottom meta
    d.text((60, H-44), "sachindevmurari.com", font=f_mono, fill=(80,90,105))
    bb = d.textbbox((0,0),"Sachin Devmurari", font=f_meta)
    d.text((W-60-(bb[2]-bb[0]), H-44), "Sachin Devmurari", font=f_meta, fill=(140,150,165))

    # accent line bottom
    d.rectangle([0, H-3, W, H], fill=(108,92,231))

    img = add_noise(vignette(img))
    img.save(os.path.join(OUT, "banner-aeo-guide-2026.png"))
    print("✓ banner-aeo-guide-2026.png")

# ══════════════════════════════════════════════════════════════════════════════
# 2. GEO EXPLAINED — flowing streams / generative lines
# ══════════════════════════════════════════════════════════════════════════════
def banner_geo():
    img = Image.new("RGB", (W, H), BG)
    d   = ImageDraw.Draw(img, "RGBA")

    for i in range(H):
        t = i/H
        d.line([(0,i),(W,i)], fill=(int(7+t*10), int(9+t*18), int(15+t*55)))

    # flowing wave lines on right 2/3
    for lane in range(18):
        base_y = 40 + lane * 33
        pts = []
        for xp in range(560, W+1, 6):
            amp = 12 + lane * 2
            freq = 0.012 + lane * 0.001
            yp = base_y + amp * math.sin(freq * xp + lane * 0.8)
            pts.append((xp, int(yp)))
        alpha = max(15, 70 - lane * 3)
        col = (0,212,170,alpha) if lane%3==0 else (0,102,255,alpha)
        if len(pts) > 1:
            d.line(pts, fill=col, width=1)

    # vertical divider
    for y in range(0, H, 4):
        d.line([(550,y),(550,y+2)], fill=(0,212,170,50))

    pill(d, 60, 52, "AEO / GEO", (180,230,255), (10,30,60), f_label)

    # big ghost "GEO"
    d.text((590, 200), "GEO", font=f_huge, fill=(0,102,255,18))

    draw_text_wrapped(d, "What is GEO?", 60, 100, f_title, (255,255,255), 480)
    draw_text_wrapped(d, "Generative Engine Optimization explained for B2B brands", 60, 310, f_sub, (170,185,205), 460)

    d.text((60, H-44), "sachindevmurari.com", font=f_mono, fill=(70,85,100))
    bb = d.textbbox((0,0),"Sachin Devmurari", font=f_meta)
    d.text((W-60-(bb[2]-bb[0]), H-44), "Sachin Devmurari", font=f_meta, fill=(130,145,165))
    d.rectangle([0, H-3, W, H], fill=(0,212,170))

    img = add_noise(vignette(img))
    img.save(os.path.join(OUT, "banner-geo-explained.png"))
    print("✓ banner-geo-explained.png")

# ══════════════════════════════════════════════════════════════════════════════
# 3. TOPICAL AUTHORITY — content cluster / hub-spoke
# ══════════════════════════════════════════════════════════════════════════════
def banner_topical():
    img = Image.new("RGB", (W, H), BG)
    d   = ImageDraw.Draw(img, "RGBA")

    for i in range(H):
        t = i/H
        d.line([(0,i),(W,i)], fill=(int(7+t*8), int(9+t*28), int(15+t*12)))

    # hub-spoke diagram
    cx, cy = 920, 315
    spokes = [
        ("AEO", 0), ("GEO", 45), ("Topical\nAuth", 90), ("SEO", 135),
        ("Schema", 180), ("Links", 225), ("Content\nDepth", 270), ("Entity", 315),
    ]
    hub_r = 48
    # outer rings
    for r in [140, 220, 300]:
        d.ellipse([cx-r, cy-r, cx+r, cy+r], outline=(0,200,83, 25), width=1)

    # spokes & satellite nodes
    for label, angle in spokes:
        rad = math.radians(angle)
        sx = cx + 220 * math.cos(rad)
        sy = cy + 220 * math.sin(rad)
        d.line([(cx,cy),(int(sx),int(sy))], fill=(0,200,83,55), width=1)
        sr = 6
        d.ellipse([sx-sr,sy-sr,sx+sr,sy+sr], fill=(0,200,83,200))
        # mid node
        mx = cx + 140 * math.cos(rad)
        my = cy + 140 * math.sin(rad)
        d.ellipse([mx-3,my-3,mx+3,my+3], fill=(108,92,231,160))

    # hub center
    for r in [hub_r+10, hub_r]:
        d.ellipse([cx-r,cy-r,cx+r,cy+r], outline=(0,200,83,80), width=2)
    d.ellipse([cx-hub_r,cy-hub_r,cx+hub_r,cy+hub_r], fill=(14,40,22))
    d.text((cx-22, cy-14), "HUB", font=font("InstrumentSans-Bold.ttf" if os.path.exists(os.path.join(FONTS,"InstrumentSans-Bold.ttf")) else "WorkSans-Bold.ttf", 18), fill=(0,200,83,220))

    pill(d, 60, 52, "SEO", (180,255,200), (10,45,22), f_label)

    draw_text_wrapped(d, "The Topical Authority Playbook", 60, 100, f_title_s, (255,255,255), 480)
    draw_text_wrapped(d, "How B2B SaaS brands dominate organic search", 60, 300, f_sub, (160,185,175), 450)

    d.text((60, H-44), "sachindevmurari.com", font=f_mono, fill=(70,90,75))
    bb = d.textbbox((0,0),"Sachin Devmurari", font=f_meta)
    d.text((W-60-(bb[2]-bb[0]), H-44), "Sachin Devmurari", font=f_meta, fill=(130,155,140))
    d.rectangle([0, H-3, W, H], fill=(0,200,83))

    img = add_noise(vignette(img))
    img.save(os.path.join(OUT, "banner-topical-authority.png"))
    print("✓ banner-topical-authority.png")

# ══════════════════════════════════════════════════════════════════════════════
# 4. DISTRIBUTION MOAT — concentric broadcast rings
# ══════════════════════════════════════════════════════════════════════════════
def banner_dist():
    img = Image.new("RGB", (W, H), BG)
    d   = ImageDraw.Draw(img, "RGBA")

    for i in range(H):
        t = i/H
        d.line([(0,i),(W,i)], fill=(int(7+t*25), int(9+t*15), int(15+t*5)))

    cx, cy = 880, 315
    # concentric rings with decreasing opacity
    for idx, r in enumerate(range(40, 420, 42)):
        alpha = max(12, 85 - idx*10)
        col_amber = (245,158,11,alpha)
        d.ellipse([cx-r,cy-r,cx+r,cy+r], outline=col_amber, width=1)

    # broadcast lines (signal rays)
    for angle in range(0, 360, 22):
        rad = math.radians(angle)
        x1 = cx + 55 * math.cos(rad)
        y1 = cy + 55 * math.sin(rad)
        x2 = cx + 380 * math.cos(rad)
        y2 = cy + 380 * math.sin(rad)
        d.line([(int(x1),int(y1)),(int(x2),int(y2))], fill=(255,107,53,18), width=1)

    # center dot
    d.ellipse([cx-20,cy-20,cx+20,cy+20], fill=(245,158,11))
    d.ellipse([cx-8, cy-8, cx+8, cy+8],  fill=(255,255,255))

    pill(d, 60, 52, "SaaS Growth", (255,230,180), (55,35,5), f_label)

    draw_text_wrapped(d, "Distribution Is the New Moat", 60, 100, f_title_s, (255,255,255), 500)
    draw_text_wrapped(d, "How SaaS brands build owned audiences that compound over time", 60, 300, f_sub, (185,170,140), 460)

    d.text((60, H-44), "sachindevmurari.com", font=f_mono, fill=(90,80,55))
    bb = d.textbbox((0,0),"Sachin Devmurari", font=f_meta)
    d.text((W-60-(bb[2]-bb[0]), H-44), "Sachin Devmurari", font=f_meta, fill=(160,145,110))
    d.rectangle([0, H-3, W, H], fill=(245,158,11))

    img = add_noise(vignette(img))
    img.save(os.path.join(OUT, "banner-distribution-saas.png"))
    print("✓ banner-distribution-saas.png")

# ══════════════════════════════════════════════════════════════════════════════
# 5. LINKEDIN BRAND — connection graph + rising bars
# ══════════════════════════════════════════════════════════════════════════════
def banner_li():
    img = Image.new("RGB", (W, H), BG)
    d   = ImageDraw.Draw(img, "RGBA")

    for i in range(H):
        t = i/H
        d.line([(0,i),(W,i)], fill=(int(7+t*5), int(9+t*12), int(15+t*45)))

    # connection graph
    rng = np.random.default_rng(7)
    nodes_li = [(int(x),int(y)) for x,y in rng.uniform([560,50],[1160,560],(20,2))]
    for i,(x1,y1) in enumerate(nodes_li):
        for j,(x2,y2) in enumerate(nodes_li):
            if j<=i: continue
            if math.hypot(x2-x1,y2-y1) < 200:
                d.line([(x1,y1),(x2,y2)], fill=(10,102,194,35), width=1)
    for i,(x,y) in enumerate(nodes_li):
        c = (10,102,194) if i%4!=0 else (108,92,231)
        r = 7 if i%4==0 else 4
        d.ellipse([x-r,y-r,x+r,y+r], fill=c+(220,))
        d.ellipse([x-r-5,y-r-5,x+r+5,y+r+5], outline=c+(40,), width=1)

    # rising bar chart (bottom right)
    bars = [40,65,55,80,72,95,88,100]
    bx, by = 700, 490
    bw, bh_max, gap = 28, 140, 12
    for i,pct in enumerate(bars):
        bh = int(bh_max * pct/100)
        x0 = bx + i*(bw+gap)
        col = (10,102,194,180) if i < 6 else (108,92,231,220)
        d.rectangle([x0, by-bh, x0+bw, by], fill=col)

    pill(d, 60, 52, "LinkedIn", (180,210,255), (5,20,55), f_label)

    draw_text_wrapped(d, "LinkedIn Personal Brand", 60, 100, f_title_s, (255,255,255), 480)
    draw_text_wrapped(d, "How to generate inbound leads from LinkedIn", 60, 300, f_sub, (165,180,210), 450)

    d.text((60, H-44), "sachindevmurari.com", font=f_mono, fill=(65,78,105))
    bb = d.textbbox((0,0),"Sachin Devmurari", font=f_meta)
    d.text((W-60-(bb[2]-bb[0]), H-44), "Sachin Devmurari", font=f_meta, fill=(130,145,180))
    d.rectangle([0, H-3, W, H], fill=(10,102,194))

    img = add_noise(vignette(img))
    img.save(os.path.join(OUT, "banner-linkedin-brand.png"))
    print("✓ banner-linkedin-brand.png")

# ══════════════════════════════════════════════════════════════════════════════
# 6. CONTENT STRATEGY VS MARKETING — split composition
# ══════════════════════════════════════════════════════════════════════════════
def banner_cs():
    img = Image.new("RGB", (W, H), BG)
    d   = ImageDraw.Draw(img, "RGBA")

    # left half red tint
    for i in range(H):
        t = i/H
        d.line([(0,i),(600,i)], fill=(int(18+t*20), int(9+t*5), int(15+t*5)))
    # right half purple tint
    for i in range(H):
        t = i/H
        d.line([(600,i),(W,i)], fill=(int(12+t*15), int(9+t*8), int(20+t*35)))

    # glowing divider line
    for y in range(0, H, 1):
        alpha = int(180 * math.sin(math.pi * y / H) + 40)
        d.line([(598,y),(602,y)], fill=(255,71,87,alpha))
    # glow blur via multiple lines
    for offset, a in [(-4,15),(-3,25),(-2,45),(-1,70),(1,70),(2,45),(3,25),(4,15)]:
        for y in range(0,H,2):
            alpha = int(a * math.sin(math.pi * y / H))
            d.line([(600+offset,y),(600+offset,y+1)], fill=(255,71,87,alpha))

    # LEFT: strategy grid
    for row in range(4):
        for col in range(4):
            x0 = 80 + col*100
            y0 = 120 + row*80
            d.rectangle([x0,y0,x0+80,y0+60], outline=(255,71,87,55), width=1)
            # filled indicator
            if (row+col)%3==0:
                d.rectangle([x0+4,y0+4,x0+76,y0+56], fill=(255,71,87,22))

    # RIGHT: content blocks (marketing execution)
    for i in range(5):
        bx = 660
        by = 100 + i*88
        bw2 = 200 + (i%3)*80
        bh2 = 50
        d.rounded_rectangle([bx,by,bx+bw2,by+bh2], radius=6, fill=(108,92,231,30), outline=(108,92,231,60), width=1)
        # chevron
        d.text((bx+bw2+12, by+12), "→", font=font("InstrumentSans-Regular.ttf",20), fill=(108,92,231,140))

    pill(d, 60, 52, "Content Strategy", (255,200,210), (55,10,18), f_label)

    draw_text_wrapped(d, "Strategy vs. Marketing", 60, 100, f_title_s, (255,255,255), 490)
    draw_text_wrapped(d, "The difference that changes everything for B2B brands", 60, 300, f_sub, (190,170,175), 460)

    d.text((60, H-44), "sachindevmurari.com", font=f_mono, fill=(90,72,75))
    bb = d.textbbox((0,0),"Sachin Devmurari", font=f_meta)
    d.text((W-60-(bb[2]-bb[0]), H-44), "Sachin Devmurari", font=f_meta, fill=(165,140,145))
    d.rectangle([0, H-3, int(W/2), H], fill=(255,71,87))
    d.rectangle([int(W/2), H-3, W, H], fill=(108,92,231))

    img = add_noise(vignette(img))
    img.save(os.path.join(OUT, "banner-content-strategy.png"))
    print("✓ banner-content-strategy.png")

# ── RUN ALL ───────────────────────────────────────────────────────────────────
os.makedirs(OUT, exist_ok=True)
banner_aeo()
banner_geo()
banner_topical()
banner_dist()
banner_li()
banner_cs()
print("\nAll 6 banners saved to:", OUT)
