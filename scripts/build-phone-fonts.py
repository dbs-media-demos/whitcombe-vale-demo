"""Phone fonts: Libre Caslon Display + Libre Caslon Text Italic as two subset woff2 files, Latin + Serbian Latin.
Source TTFs come from google/fonts (ofl/librecaslondisplay, ofl/librecaslontext); pass their folder as the first argument."""
import sys
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools import subset
from fontTools.varLib import instancer

SRC = Path(sys.argv[1])
OUT = Path(__file__).resolve().parent.parent / "public" / "fonts"
FACES = {
    "caslon-display-phone.woff2": "LibreCaslonDisplay-Regular.ttf",
    "caslon-italic-phone.woff2": "LibreCaslonText-Italic[wght].ttf",
}
# ASCII, the accented letters the copy uses (Sofía, Español) and č ć đ š ž, plus typographic punctuation
EXTRA = "00A0 00A7 00A9 00B7 00D7 00C1 00C9 00CD 00D1 00D3 00DA 00E1 00E9 00ED 00F1 00F3 00FA 0106 0107 010C 010D 0110 0111 0160 0161 017D 017E 2013 2014 2018 2019 201A 201C 201D 201E 2026"
UNICODES = list(range(0x20, 0x7F)) + [int(u, 16) for u in EXTRA.split()]

for out, name in FACES.items():
    font = TTFont(SRC / name)
    if "fvar" in font:  # the italic is variable: phones only ever need weight 400
        instancer.instantiateVariableFont(font, {"wght": 400}, inplace=True)
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["kern", "ccmp", "locl", "onum", "pnum", "mark", "mkmk"]
    opts.notdef_outline = True
    opts.hinting = False
    s = subset.Subsetter(opts)
    s.populate(unicodes=UNICODES)
    s.subset(font)
    font.flavor = "woff2"
    font.save(OUT / out)
    print(out, (OUT / out).stat().st_size)
