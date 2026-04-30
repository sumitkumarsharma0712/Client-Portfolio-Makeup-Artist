import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('gallery_html.txt', 'r', encoding='utf-8') as f:
    snippets = f.read()

gallery_part = snippets.split('=== TRANSFORM ===')[0].replace('=== GALLERY ===\n', '').strip()
transform_part = snippets.split('=== TRANSFORM ===')[1].split('=== BTS ===')[0].strip()
bts_part = snippets.split('=== BTS ===')[1].strip()

# Replace Gallery
gallery_start = html.find('<div class="gallery-grid"')
gallery_start = html.find('>', gallery_start) + 1
gallery_end = html.find('</section>', gallery_start)
gallery_end = html.rfind('</div>', gallery_start, gallery_end - 10)

new_html = html[:gallery_start] + '\n' + gallery_part + '\n            ' + html[gallery_end:]

# Replace Transformations
transform_start_search = '<div class="gallery-grid">'
transform_start_idx = new_html.find(transform_start_search, gallery_end)
if transform_start_idx != -1:
    # it's the second gallery-grid
    transform_start = transform_start_idx + len(transform_start_search)
    
    transform_end = new_html.find('</section>', transform_start)
    transform_end = new_html.rfind('</div>', transform_start, transform_end - 10)
    
    # Change class to transform-grid
    new_html = new_html[:transform_start_idx] + '<div class="transform-grid">' + '\n' + transform_part + '\n                ' + new_html[transform_end:]

# Add BTS Section before Testimonials
bts_section = f'''
    <!-- Behind the Scenes & Academy -->
    <section id="bts" class="portfolio section">
        <div class="container">
            <h2 class="section-title text-center brush-underline mb-2" style="font-size: 3rem; display:block; margin:auto; width:fit-content;">Behind the Scenes & Academy</h2>
            <p class="text-center text-muted mb-2" style="margin-top:1rem;">Moments with clients, artists, and certification achievements.</p>
            <div class="gallery-grid" style="margin-top:2rem;">
{bts_part}
            </div>
        </div>
    </section>
'''

testimo_idx = new_html.find('<!-- Testimonials Section -->')
if testimo_idx != -1:
    new_html = new_html[:testimo_idx] + bts_section + '\n    ' + new_html[testimo_idx:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)
