import urllib.parse
bridal = ['Bengali look full.png', 'south indian look full.png', 'bridal look front 2.png', 'Bridal 4 full look.png', 'Bridal look 3.png', 'baridal 3 look full.png', 'bridal 2 full.png', 'bridal 4 full.png', 'bridal look front.png', 'bridal look left side.png', 'bridal look selfi.png', 'bridal model 2.png', 'bridal model look full.png', 'bridal model look.png', 'side look bridal 2.png']
editorial = ['Anime look full.png', 'Garba look full.png', 'Karva chauth full.png', 'rajasthani look front.png', 'rajasthani look.png', 'Ethnic Look side.png', 'Ethnic Look.png']
glam = ['party 5 full.png', 'party look 2 full.png', 'party look 3 full.png', 'party look 4 full.png', 'party look 6 full.png', 'party look.png']
natural = ['haldi look.png', 'mehndi front look.png', 'mehndi side look.png', 'Groom look full.png']

html_gallery = ''
for cat, items in [('bridal', bridal), ('editorial', editorial), ('glam', glam), ('natural', natural)]:
    for item in items:
        enc = urllib.parse.quote(item)
        name = item.replace('.png', '').title()
        html_gallery += f'''                <div class="gallery-item item-{cat} reveal">
                    <div class="image-wrapper">
                        <img src="{enc}" loading="lazy" alt="{name}">
                        <div class="overlay">
                            <h3>{name}</h3>
                        </div>
                    </div>
                </div>\n'''

transformations = ['Anime look before & after.png', 'Bengali look Before & After.png', 'Bridal look 3 Before & after.png', 'Garba look before & after.png', 'Groom look before & after.png', 'Karva chauth look before & After.png', 'haldi look before & after.png', 'mehndi look before & after.png', 'model 2 look before & after.png', 'party 5 before & after.png', 'party look 2 before & after.png', 'party look 3 before & after.png', 'party look 4 before & after.png', 'party look 6 before & after.png', 'party look before & after.png', 'rajasthani look before & after.png', 'south indian look before & after.png']

html_transform = ''
for item in transformations:
    enc = urllib.parse.quote(item)
    name = item.replace('.png', '').title()
    html_transform += f'''                    <div class="transform-item reveal">
                        <img src="{enc}" loading="lazy" alt="{name}">
                    </div>\n'''

bts = ['Bengali look with artist.png', 'Bridal look with artists.png', 'bridal 4 with artist.png', 'bridal model 2 with artist.png', 'pro makeup artist certificate with model.png', 'pro makeup artist certificate.png', 'pro makeup artist group photo in academy.png', 'rajasthani look with makeup artist.png', 'south indian look with artist.png']

html_bts = ''
for item in bts:
    enc = urllib.parse.quote(item)
    name = item.replace('.png', '').title()
    html_bts += f'''                    <div class="gallery-item reveal">
                        <div class="image-wrapper">
                            <img src="{enc}" loading="lazy" alt="{name}">
                        </div>
                    </div>\n'''

with open('gallery_html.txt', 'w', encoding='utf-8') as f:
    f.write('=== GALLERY ===\n' + html_gallery + '\n=== TRANSFORM ===\n' + html_transform + '\n=== BTS ===\n' + html_bts)
