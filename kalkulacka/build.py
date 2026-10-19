"""Vloží kalkulačku (ceny.js, kalkulacka.js, kalkulacka.css) do ../index.html. Lze spouštět opakovaně – po úpravě ceníku stačí `python3 build.py`."""
import pathlib, re
here = pathlib.Path(__file__).parent
page = here.parent / "index.html"
s = page.read_text(encoding="utf-8")
block = ("<!--KALK-START--><style>\n" + (here / "kalkulacka.css").read_text(encoding="utf-8") + "</style>\n<script>\n"
         + (here / "ceny.js").read_text(encoding="utf-8") + "\n" + (here / "kalkulacka.js").read_text(encoding="utf-8") + "</script><!--KALK-END-->\n")
if "<!--KALK-START-->" in s:
    s = re.sub(r"<!--KALK-START-->.*?<!--KALK-END-->\n", lambda m: block, s, flags=re.S)
else:
    s = s.replace('<div id="stage" class="stage"></div>\n', '<div id="stage" class="stage"></div>\n' + block, 1)
    for old, new in (("+ cards + about +", "+ cards + KALK.html() + about +"),
                     ('<li><a href="#sluzby">Služby</a></li>', '<li><a href="#sluzby">Služby</a></li><li><a href="#kalkulacka">Kalkulačka</a></li>'),
                     ("\nrender();\n", "\nrender();\nKALK.mount();\n")):
        assert s.count(old) == 1, old
        s = s.replace(old, new)
page.write_text(s, encoding="utf-8")
print("hotovo", len(s))
