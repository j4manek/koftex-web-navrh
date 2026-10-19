/* Kalkulačka ceny oděvů s výšivkou. Ceny se berou z window.KALK_CENY (ceny.js). */
(function () {
  var C = window.KALK_CENY, V = C.vysivani;
  var S = { cat: "tricko", prod: C.produkty.tricko[0].id, colors: ["cerna"], qty: {}, deco: [{ pos: "prso-l", size: "m" }] };

  function $(id) { return document.getElementById(id); }
  function money(n) { return new Intl.NumberFormat("cs-CZ").format(Math.round(n)) + " Kč"; }
  function product() { return C.produkty[S.cat].find(function (p) { return p.id === S.prod; }); }
  function color(id) { return C.barvy.find(function (c) { return c.id === id; }); }
  function key(c, s) { return c + "|" + s; }
  function qtyOf(c, s) { return S.qty[key(c, s)] || 0; }
  function tierAt(list, n) { return list.reduce(function (acc, t) { return n >= t[0] ? t : acc; }, null); }

  function calc() {
    var p = product(), total = 0, goodsFull = 0;
    S.colors.forEach(function (c) {
      C.velikosti.forEach(function (s) {
        var q = qtyOf(c, s);
        total += q;
        goodsFull += q * (p.cena + (p.priplatek[s] || 0));
      });
    });
    var disc = tierAt(C.sleva, total), pct = disc ? disc[1] : 0;
    var next = C.sleva.find(function (t) { return t[0] > total; });
    var goods = goodsFull * (1 - pct / 100);
    var rate = tierAt(V.sazba, Math.max(total, 1));
    var rows = S.deco.map(function (d) {
      var sz = V.velikosti[d.size];
      return { pos: V.umisteni[d.pos].n, size: sz.n, perPiece: Math.max(rate[2], Math.round(sz.stehy / 1000 * rate[1])), program: sz.program, stehy: sz.stehy };
    });
    var deco = rows.reduce(function (a, r) { return a + r.perPiece * total; }, 0);
    var program = total ? rows.reduce(function (a, r) { return a + r.program; }, 0) : 0;
    var sum = goods + deco + program;
    return { p: p, total: total, pct: pct, next: next, goodsFull: goodsFull, goods: goods, rows: rows, deco: deco, program: program, sum: sum, vat: sum * (1 + C.dph) };
  }

  function summaryText(r) {
    var parts = S.colors.map(function (c) {
      var sizes = C.velikosti.filter(function (s) { return qtyOf(c, s) > 0; }).map(function (s) { return s + " " + qtyOf(c, s); });
      return sizes.length ? color(c).n + ": " + sizes.join(", ") : "";
    }).filter(Boolean).join("; ");
    var deco = r.rows.length ? r.rows.map(function (d) { return d.pos + " (" + d.size.toLowerCase() + ")"; }).join(", ") : "bez výšivky";
    return "Kalkulace z webu: " + r.p.n + ", " + r.total + " ks (" + parts + "). Výšivka: " + deco + ". Orientační cena " + money(r.sum) + " bez DPH (" + money(r.vat) + " s DPH).";
  }

  function productsHtml() {
    return C.produkty[S.cat].map(function (p) {
      return '<button type="button" class="kc-prod' + (p.id === S.prod ? " on" : "") + '" data-kc-prod="' + p.id + '" aria-pressed="' + (p.id === S.prod) + '"><b>' + p.n + '</b><span>' + p.popis + '</span><em>' + money(p.cena) + ' / ks</em></button>';
    }).join("");
  }

  function colorsHtml() {
    var sw = C.barvy.map(function (c) {
      var on = S.colors.indexOf(c.id) > -1;
      return '<button type="button" class="kc-sw' + (on ? " on" : "") + '" data-kc-color="' + c.id + '" aria-pressed="' + on + '" aria-label="' + c.n + '" title="' + c.n + '" style="--c:' + c.hex + '"></button>';
    }).join("");
    var blocks = S.colors.map(function (id) {
      var c = color(id), p = product();
      var grid = C.velikosti.map(function (s) {
        var plus = p.priplatek[s];
        return '<label class="kc-sz"><span>' + s + (plus ? ' <small>+' + plus + '</small>' : "") + '</span><input type="number" min="0" max="9999" inputmode="numeric" placeholder="0" data-kc-q="' + key(id, s) + '" value="' + (qtyOf(id, s) || "") + '"></label>';
      }).join("");
      return '<div class="kc-col"><div class="kc-colh"><i style="--c:' + c.hex + '"></i><b>' + c.n + '</b><span id="kc-n-' + id + '"></span><button type="button" class="kc-x" data-kc-color="' + id + '" aria-label="Odebrat barvu ' + c.n + '">×</button></div><div class="kc-grid">' + grid + '</div></div>';
    }).join("");
    return '<div class="kc-sws" role="group" aria-label="Barvy">' + sw + '</div>' + (blocks || '<p class="kc-hint">Vyberte aspoň jednu barvu.</p>');
  }

  function decoHtml() {
    var rows = S.deco.map(function (d, i) {
      var posOpt = Object.keys(V.umisteni).map(function (k) { return '<option value="' + k + '"' + (k === d.pos ? " selected" : "") + '>' + V.umisteni[k].n + '</option>'; }).join("");
      var szOpt = V.umisteni[d.pos].velikosti.map(function (k) { return '<option value="' + k + '"' + (k === d.size ? " selected" : "") + '>' + V.velikosti[k].n + '</option>'; }).join("");
      return '<div class="kc-drow"><label>Umístění<select data-kc-pos="' + i + '">' + posOpt + '</select></label><label>Velikost výšivky<select data-kc-dsize="' + i + '">' + szOpt + '</select></label><button type="button" class="kc-x" data-kc-del="' + i + '" aria-label="Odebrat výšivku">×</button></div>';
    }).join("");
    var add = S.deco.length < V.maxPozic ? '<button type="button" class="btn ghost kc-add" data-kc-add>+ Přidat další místo výšivky</button>' : "";
    return (rows || '<p class="kc-hint">Bez výšivky – počítáme jen textil.</p>') + add;
  }

  function sumHtml(r) {
    if (!r.total) return '<h3>Orientační cena</h3><p class="kc-hint">Zadejte počty kusů v tabulce velikostí a cena se spočítá hned.</p>';
    var h = '<h3>Orientační cena</h3><dl>' +
      '<dt>' + r.p.n + ' · ' + r.total + ' ks' + (r.pct ? '<small>množstevní sleva ' + r.pct + ' %</small>' : "") + '</dt><dd>' + money(r.goods) + '</dd>';
    if (r.rows.length) {
      h += '<dt>Vyšívání · ' + r.total + ' ks' + r.rows.map(function (d) { return '<small>' + d.pos + ' – ' + money(d.perPiece) + ' / ks</small>'; }).join("") + '</dt><dd>' + money(r.deco) + '</dd>' +
        '<dt>Vyšívací program (jednorázově)<small>orientačně, platí se jednou – u stejné výšivky už nikdy znovu</small></dt><dd>' + money(r.program) + '</dd>';
    }
    h += '</dl><div class="kc-total"><span>Celkem bez DPH</span><b>' + money(r.sum) + '</b></div><div class="kc-vat">' + money(r.vat) + ' vč. DPH · ' + money(r.sum / r.total) + ' bez DPH za 1 ks</div>';
    if (r.next) h += '<p class="kc-next">Přidejte ještě <b>' + (r.next[0] - r.total) + ' ks</b> a sleva na textil vzroste na ' + r.next[1] + ' %.</p>';
    return h;
  }

  function renderSummary() {
    var r = calc();
    $("kc-sum").innerHTML = sumHtml(r) +
      '<div class="kc-acts"><button type="button" class="btn" data-kc-send' + (r.total ? "" : " disabled") + '>Poslat poptávku s kalkulací</button><button type="button" class="btn ghost" data-kc-copy' + (r.total ? "" : " disabled") + '>Zkopírovat shrnutí</button></div>' +
      '<p class="kc-note">Cena je orientační. Konečnou nabídku potvrdíme po posouzení loga a materiálu, cena výšivky se může po zpracování ještě snížit.</p>';
    $("kc-bar").innerHTML = r.total ? '<span>Celkem bez DPH</span><b>' + money(r.sum) + '</b><a href="#kc-sum">Detail</a>' : '<span>Zadejte počty kusů</span>';
    S.colors.forEach(function (c) {
      var n = C.velikosti.reduce(function (a, s) { return a + qtyOf(c, s); }, 0), el = $("kc-n-" + c);
      if (el) el.textContent = n ? n + " ks" : "";
    });
  }

  function renderAll() {
    $("kc-cats").querySelectorAll("[data-kc-cat]").forEach(function (b) { var on = b.dataset.kcCat === S.cat; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
    $("kc-prods").innerHTML = productsHtml();
    $("kc-colors").innerHTML = colorsHtml();
    $("kc-deco").innerHTML = decoHtml();
    renderSummary();
  }

  function onClick(e) {
    var t = e.target.closest("[data-kc-cat],[data-kc-prod],[data-kc-color],[data-kc-add],[data-kc-del],[data-kc-send],[data-kc-copy]");
    if (!t || !t.closest("#kalkulacka")) return;
    var d = t.dataset;
    if (d.kcCat) { S.cat = d.kcCat; S.prod = C.produkty[S.cat][0].id; renderAll(); }
    else if (d.kcProd) { S.prod = d.kcProd; renderAll(); }
    else if (d.kcColor) { var i = S.colors.indexOf(d.kcColor); if (i > -1) S.colors.splice(i, 1); else S.colors.push(d.kcColor); renderAll(); }
    else if ("kcAdd" in d) { S.deco.push({ pos: "zada", size: "l" }); $("kc-deco").innerHTML = decoHtml(); renderSummary(); }
    else if (d.kcDel) { S.deco.splice(+d.kcDel, 1); $("kc-deco").innerHTML = decoHtml(); renderSummary(); }
    else if ("kcSend" in d) {
      var msg = $("f-zprava"); if (!msg) return;
      msg.value = summaryText(calc()); $("poptavka").scrollIntoView({ behavior: "smooth", block: "start" }); msg.focus({ preventScroll: true });
    } else if ("kcCopy" in d) {
      var done = function (ok) { t.textContent = ok ? "Zkopírováno ✓" : "Kopírování se nepovedlo"; setTimeout(function () { t.textContent = "Zkopírovat shrnutí"; }, 2000); };
      try { navigator.clipboard.writeText(summaryText(calc())).then(function () { done(true); }, function () { done(false); }); } catch (x) { done(false); }
    }
  }

  function onInput(e) {
    var t = e.target; if (!t.closest("#kalkulacka")) return;
    if (t.dataset.kcQ !== undefined) { S.qty[t.dataset.kcQ] = Math.max(0, parseInt(t.value, 10) || 0); renderSummary(); }
  }

  function onChange(e) {
    var t = e.target; if (!t.closest("#kalkulacka")) return;
    if (t.dataset.kcPos !== undefined) {
      var d = S.deco[+t.dataset.kcPos]; d.pos = t.value;
      if (V.umisteni[d.pos].velikosti.indexOf(d.size) < 0) d.size = V.umisteni[d.pos].velikosti[0];
      $("kc-deco").innerHTML = decoHtml(); renderSummary();
    } else if (t.dataset.kcDsize !== undefined) { S.deco[+t.dataset.kcDsize].size = t.value; renderSummary(); }
  }

  window.KALK = {
    html: function () {
      return '<section class="sec kcalc" id="kalkulacka"><h2 class="t">Kalkulačka ceny</h2>' +
        '<p class="kc-lead">Spočítejte si orientační cenu oděvů s vyšitým logem. Bez čekání na nabídku, cena se přepočítává při každé změně.</p>' +
        '<div class="kc-layout"><div class="kc-steps">' +
        '<div class="kc-step"><h3><i>1</i>Textil</h3><div class="kc-cats" id="kc-cats"><button type="button" data-kc-cat="tricko">Trička</button><button type="button" data-kc-cat="mikina">Mikiny</button></div><div class="kc-prods" id="kc-prods"></div></div>' +
        '<div class="kc-step"><h3><i>2</i>Barvy a velikosti</h3><div id="kc-colors"></div></div>' +
        '<div class="kc-step"><h3><i>3</i>Vyšívání loga</h3><div id="kc-deco"></div></div></div>' +
        '<aside class="kc-side"><div class="kc-sum" id="kc-sum"></div></aside></div>' +
        '<div class="kc-bar" id="kc-bar"></div></section>';
    },
    mount: function () {
      renderAll();
      document.addEventListener("click", onClick);
      document.addEventListener("input", onInput);
      document.addEventListener("change", onChange);
    }
  };
})();
