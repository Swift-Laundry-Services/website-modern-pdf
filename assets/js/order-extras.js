/*!
 * Swift Laundry Services website
 * Designed & developed by Innocent Christo
 * © 2026 Innocent Christo. All rights reserved.
 */
/* Order page extras: load quantities with a running total, 1-hour pickup time slots.
   Prices come from pricing.washFold and slots from pickup in site-config.js. */
(function () {
  "use strict";
  var form = document.querySelector('form[data-form="order"]');
  if (!form) return;
  var CFG = window.SWIFT_CONFIG || {}, PR = (CFG.pricing && CFG.pricing.washFold) || [], PK = CFG.pickup || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var money = function (n) { return "$" + n.toFixed(2); };

  /* ---------- Loads ---------- */
  var box = $("[data-ox-loads]", form);
  if (box) {
    var rows = [];
    PR.forEach(function (it, i) {
      var row = document.createElement("div"); row.className = "ox-row";
      var cap = [it.size, it.weight].filter(Boolean).join(" · ");
      row.innerHTML = '<div class="ox-info"><strong></strong><span></span></div><div class="ox-price"></div>' +
        '<div class="ox-qty" role="group"><button type="button" class="ox-btn" data-dec>−</button><input class="ox-in" type="number" min="0" max="20" value="0" inputmode="numeric"><button type="button" class="ox-btn" data-inc>+</button></div>';
      $("strong", row).textContent = it.name; $(".ox-info span", row).textContent = cap || "Per item"; $(".ox-price", row).textContent = money(it.price);
      var inp = $(".ox-in", row);
      inp.setAttribute("aria-label", it.name + " quantity"); $("[data-dec]", row).setAttribute("aria-label", "Fewer " + it.name); $("[data-inc]", row).setAttribute("aria-label", "More " + it.name);
      var set = function (v) { v = Math.max(0, Math.min(20, v || 0)); inp.value = v; upd(); };
      $("[data-dec]", row).addEventListener("click", function () { set((parseInt(inp.value, 10) || 0) - 1); });
      $("[data-inc]", row).addEventListener("click", function () { set((parseInt(inp.value, 10) || 0) + 1); });
      inp.addEventListener("input", upd); inp.addEventListener("change", function () { set(parseInt(inp.value, 10)); });
      box.appendChild(row); rows.push({ row: row, inp: inp, it: it });
    });
    var lines = function () {
      var out = [], t = 0;
      rows.forEach(function (r) { var q = parseInt(r.inp.value, 10) || 0; if (q > 0) { out.push(q + " × " + r.it.name + (r.it.size || r.it.weight ? " (" + [r.it.size, r.it.weight].filter(Boolean).join(" · ") + ")" : "") + " at " + money(r.it.price) + " = " + money(q * r.it.price)); t += q * r.it.price; } });
      return { out: out, total: t };
    };
    var err = $("[data-ox-error]", form);
    function upd() {
      var L = lines();
      rows.forEach(function (r) { r.row.classList.toggle("is-on", (parseInt(r.inp.value, 10) || 0) > 0); });
      $("[data-ox-total]", form).textContent = money(L.total);
      $("[data-ox-lines]", form).value = L.out.join("; ");
      $("[data-ox-totalval]", form).value = L.out.length ? money(L.total) + " (estimate; final price confirmed at pickup)" : "";
      if (L.out.length && err) err.textContent = "";
    }
    try { var tq = new URLSearchParams(location.search).get("tier"); var map = { single: 0, couple: 1, family: 2, duvet: 3 }; if (tq in map && rows[map[tq]]) rows[map[tq]].inp.value = 1; } catch (x) {}
    upd();
    /* Capture phase: runs before the site's own submit handler. Wash & Fold needs at least one load. */
    form.addEventListener("submit", function (e) {
      var wf = $('input[name="service"][value="wash-fold"]', form);
      if (wf && wf.checked && !lines().out.length) {
        e.preventDefault(); e.stopImmediatePropagation();
        if (err) err.textContent = "Please choose at least one load for Wash & Fold.";
        rows[0].row.scrollIntoView({ block: "center" }); $("[data-inc]", rows[0].row).focus();
      }
    }, true);
  }

  /* ---------- Pickup slots (1 hour each) ---------- */
  var dur = PK.slotMinutes || 60;
  var parse = function (t) { var m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(t); return m ? ((+m[1] % 12) + (/pm/i.test(m[3]) ? 12 : 0)) * 60 + +m[2] : null; };
  var fmt = function (n) { var h = Math.floor(n / 60) % 24, m = n % 60, ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12; return h + ":" + (m < 10 ? "0" : "") + m + " " + ap; };
  var fill = function (sel, list) {
    var host = $(sel, form); if (!host) return;
    list.forEach(function (t) {
      var s = parse(t); if (s == null) return;
      var label = fmt(s) + " – " + fmt(s + dur), l = document.createElement("label"); l.className = "ox-slot";
      l.innerHTML = '<input type="radio" name="o-slot" value="' + label + '" data-label="' + label + '"><span>' + label + "</span>";
      host.appendChild(l);
    });
  };
  fill("[data-ox-morning]", PK.morning || ["9:00 AM", "10:00 AM", "11:00 AM"]);
  fill("[data-ox-afternoon]", PK.afternoon || ["1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]);
})();
