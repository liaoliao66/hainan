/* 一张图演示交互：检索、图层、二三维、降级、空态。不改变业务口径。 */
(function () {
  const stage = document.querySelector(".poi-btn")?.closest(".relative");
  const tbody = document.querySelector("tbody");
  const kw = document.getElementById("kw");
  if (!stage || !tbody || !kw) return;

  const filterBar = kw.closest("section");
  const selects = filterBar ? [...filterBar.querySelectorAll("select")] : [];
  const rows = () => [...tbody.querySelectorAll("tr.row-pick")];

  const style = document.createElement("style");
  style.textContent = `
    .poi-btn.is-on span{box-shadow:0 0 0 4px rgba(14,116,240,.45)}
    .map-grid{background-image:linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px);background-size:36px 36px}
    .heat-layer{background:radial-gradient(circle at 30% 48%,rgba(245,63,63,.45),transparent 28%),radial-gradient(circle at 68% 42%,rgba(255,170,0,.4),transparent 22%),radial-gradient(circle at 52% 62%,rgba(14,116,240,.35),transparent 26%)}
  `;
  document.head.appendChild(style);

  const banner = document.createElement("div");
  banner.id = "live-banner";
  banner.className = "hidden mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700";
  banner.textContent = "接口降级：对应图层使用最近一次成功快照，其他主题仍可浏览。";
  const mainCol = document.querySelector("main .max-w-\\[1400px\\]") || document.querySelector("main");
  const header = mainCol?.querySelector("header");
  if (header) header.insertAdjacentElement("afterend", banner);

  let mode3d = true;
  let boxOn = false;
  let heatOn = false;
  let trackOn = false;
  let degrade = false;

  function overlay(id, html, className) {
    let el = stage.querySelector("#" + id);
    if (!el) {
      el = document.createElement("div");
      el.id = id;
      el.className = "absolute inset-0 z-[2] pointer-events-none " + className;
      stage.appendChild(el);
    }
    el.innerHTML = html || "";
    return el;
  }

  function paintStage() {
    const img = stage.querySelector("img");
    if (img) img.style.filter = mode3d ? "" : "grayscale(.35) contrast(1.05)";
    overlay("view-badge", mode3d ? "三维孪生" : "二维 GIS", "inset-auto left-3 bottom-12 w-auto h-auto rounded-lg bg-slate-950/70 text-white text-[11px] px-2 py-1");
    stage.classList.toggle("map-grid", !mode3d);
    const heat = overlay("heat-layer", "", "heat-layer");
    heat.style.display = heatOn ? "block" : "none";
    const track = overlay(
      "track-layer",
      '<svg viewBox="0 0 100 100" class="w-full h-full"><polyline points="72,40 58,48 46,54 30,48" fill="none" stroke="#00E4FF" stroke-width="0.6" stroke-dasharray="1.4 1"/><circle cx="30" cy="48" r="1.1" fill="#00E4FF"/></svg>',
      ""
    );
    track.style.display = trackOn ? "block" : "none";
    const box = overlay("box-layer", "", "");
    box.className = "absolute z-[3] border-2 border-dashed border-cyan-300 bg-cyan-400/10 pointer-events-none";
    box.style.cssText = boxOn ? "left:28%;top:38%;width:26%;height:22%;" : "display:none";
  }

  function setBtnOn(btn, on) {
    btn.classList.toggle("bg-sky-700", on);
    btn.classList.toggle("text-white", on);
  }

  function applyLayers() {
    const blocked = new Set();
    document.querySelectorAll("aside label").forEach((lb) => {
      const cb = lb.querySelector('input[type="checkbox"]');
      if (!cb || cb.checked) return;
      ["泊位", "堆场", "垛位", "卡口", "视频", "告警", "设备", "船舶", "仓库", "道路"].forEach((k) => {
        if (lb.textContent.includes(k)) blocked.add(k);
      });
    });
    document.querySelectorAll(".poi-btn").forEach((p) => {
      const t = p.dataset.type || "";
      const hide =
        [...blocked].some((k) => t.includes(k)) ||
        (blocked.has("堆场") && (t.includes("垛") || t.includes("堆"))) ||
        (blocked.has("垛位") && t.includes("垛"));
      p.style.display = hide ? "none" : "";
    });
  }

  function updateCount(n) {
    const foot = tbody.closest("section")?.querySelector(".border-t");
    if (!foot) return;
    const spans = [...foot.querySelectorAll("span")];
    const target = spans.find((s) => s.textContent.includes("共"));
    if (!target) return;
    const pages = target.querySelectorAll("button");
    target.childNodes[0].textContent = "共 " + n + " 条 · 第 1 / 1 页 ";
    pages.forEach((b) => {
      b.onclick = () => toast(n ? "当前结果仅 1 页" : "无结果");
    });
  }

  function applyFilter() {
    const q = (kw.value || "").trim();
    const conds = selects.map((s) => s.value).filter((v) => v && !v.startsWith("全部"));
    let n = 0;
    rows().forEach((tr) => {
      const text = tr.innerText.replace(/\s+/g, "");
      const ok = (!q || text.includes(q)) && conds.every((c) => text.includes(c));
      tr.classList.toggle("hidden", !ok);
      if (ok) n += 1;
    });
    let empty = tbody.querySelector(".empty-row");
    if (!empty) {
      empty = document.createElement("tr");
      empty.className = "empty-row";
      empty.innerHTML = '<td colspan="6" class="px-3 py-10 text-center text-sm text-slate-400">无匹配对象。调整关键字、类型或状态后重新查询。</td>';
      tbody.appendChild(empty);
    }
    empty.classList.toggle("hidden", n > 0);
    updateCount(n);
    if (n > 0) {
      const first = rows().find((tr) => !tr.classList.contains("hidden"));
      if (first) focusName(first.dataset.name, false);
    }
    return n;
  }

  function focusName(name, ping) {
    const title = document.getElementById("detail-name");
    if (title) title.textContent = name;
    const vm = document.getElementById("vm-title");
    if (vm) vm.textContent = name;
    const tr = rows().find((r) => r.dataset.name === name);
    const pane = document.querySelector('[data-pane="detail"] .space-y-2');
    if (tr && pane) {
      const heads = [...(tr.closest("table")?.querySelectorAll("thead th") || [])].map((th) => th.textContent.trim());
      const vals = [...tr.children].map((td) => td.innerText.trim());
      pane.innerHTML = vals
        .map(
          (v, i) =>
            '<div class="flex justify-between gap-2 border-b border-slate-50 py-1.5"><span class="text-slate-500">' +
            (heads[i] || "字段") +
            '</span><span class="text-right">' +
            v +
            "</span></div>"
        )
        .join("");
    }
    rows().forEach((r) => r.classList.toggle("bg-sky-50", r.dataset.name === name));
    document.querySelectorAll(".poi-btn").forEach((p) => p.classList.toggle("is-on", p.dataset.name === name));
    if (ping) toast("已定位：" + name);
  }

  document.querySelectorAll(".poi-btn,.row-pick").forEach((el) => {
    el.addEventListener("click", () => focusName(el.dataset.name || el.getAttribute("data-name"), false));
  });

  document.querySelectorAll("header button").forEach((btn) => {
    const t = btn.textContent.trim();
    if (t === "二维" || t === "三维") {
      btn.onclick = () => {
        mode3d = t === "三维";
        document.querySelectorAll("header button").forEach((b) => {
          if (b.textContent.trim() === "二维" || b.textContent.trim() === "三维") {
            const on = b.textContent.trim() === t;
            b.className = on
              ? "rounded-xl bg-slate-800 text-white px-3 py-2"
              : "rounded-xl border border-slate-200 bg-white px-3 py-2";
          }
        });
        paintStage();
        toast(mode3d ? "已切换三维孪生，图层与选中对象保持联动" : "已切换二维 GIS，对象位置保持一致");
      };
    }
    if (t === "模拟异常") {
      btn.onclick = () => {
        degrade = !degrade;
        banner.classList.toggle("hidden", !degrade);
        btn.style.background = degrade ? "#fff1f2" : "";
        btn.style.borderColor = degrade ? "#fecdd3" : "";
        toast(degrade ? "已降级：列表与主视保留最近成功快照" : "已恢复实时接入");
      };
    }
  });

  const queryBtn = [...(filterBar?.querySelectorAll("button") || [])].find((b) => b.textContent.includes("查询"));
  const resetBtn = [...(filterBar?.querySelectorAll("button") || [])].find((b) => b.textContent.includes("重置"));
  if (queryBtn) {
    queryBtn.onclick = () => {
      const n = applyFilter();
      toast(n ? "已检索 " + n + " 条，并定位首条" : "无匹配结果");
    };
  }
  if (resetBtn) {
    resetBtn.onclick = () => {
      kw.value = "";
      selects.forEach((s) => (s.selectedIndex = 0));
      applyFilter();
      toast("筛选已重置");
    };
  }
  kw.addEventListener("keydown", (e) => {
    if (e.key === "Enter") queryBtn?.click();
  });

  document.querySelectorAll("aside label input").forEach((cb) => cb.addEventListener("change", applyLayers));

  stage.querySelectorAll("button").forEach((btn) => {
    const t = btn.textContent.trim();
    if (t === "复位") {
      btn.onclick = () => {
        boxOn = heatOn = trackOn = false;
        paintStage();
        toast("视角已复位");
      };
    }
    if (t === "框选") {
      btn.onclick = () => {
        boxOn = !boxOn;
        setBtnOn(btn, boxOn);
        paintStage();
        toast(boxOn ? "框选已开启：范围内对象可在清单中核对" : "框选已关闭");
      };
    }
    if (t === "热力") {
      btn.onclick = () => {
        heatOn = !heatOn;
        setBtnOn(btn, heatOn);
        paintStage();
        toast(heatOn ? "热力已叠加" : "热力已关闭");
      };
    }
    if (t === "轨迹") {
      btn.onclick = () => {
        trackOn = !trackOn;
        setBtnOn(btn, trackOn);
        paintStage();
        toast(trackOn ? "轨迹回放 1 倍速" : "轨迹已关闭");
      };
    }
  });

  document.querySelectorAll('[data-pane="video"] button').forEach((btn) => {
    if (!btn.textContent.includes("离线")) return;
    btn.onclick = (e) => {
      e.preventDefault();
      toast("点位离线，无法播放。可查看编码与最后在线时间。");
    };
  });

  document.querySelectorAll("section").forEach((sec) => {
    const title = sec.querySelector(".text-xs.font-semibold");
    if (!title || !title.textContent.includes("本页功能模块")) return;
    const grid = sec.querySelector(".grid");
    title.textContent = "能力说明（点击展开，汇报时默认收起）";
    title.classList.add("cursor-pointer");
    if (grid) grid.classList.add("hidden");
    title.onclick = () => grid && grid.classList.toggle("hidden");
  });

  const locate = document.querySelector('[data-pane="detail"] .grid button');
  if (locate) {
    locate.onclick = () => {
      const name = document.getElementById("detail-name")?.textContent || "";
      focusName(name, true);
    };
  }

  paintStage();
  applyLayers();
  applyFilter();
})();
