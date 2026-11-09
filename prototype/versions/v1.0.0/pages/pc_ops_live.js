/* 模型管理、接口状态：把提示补成可演示的结果面板 */
(function () {
  function toast(m) {
    if (typeof window.toast === "function") window.toast(m);
  }
  function modal(id, title, bodyHtml, onOk, okText) {
    let box = document.getElementById(id);
    if (!box) {
      box = document.createElement("div");
      box.id = id;
      box.className = "hidden fixed inset-0 z-40 bg-slate-900/40 flex items-center justify-center p-4";
      box.innerHTML =
        '<div class="bg-white rounded-2xl w-full max-w-lg p-5 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">' +
        '<h3 class="font-semibold text-lg"></h3><div class="mt-3 text-sm text-slate-600 space-y-3 js-body"></div>' +
        '<div class="mt-5 flex justify-end gap-2"><button type="button" class="rounded-xl border px-4 py-2 js-cancel">取消</button>' +
        '<button type="button" class="rounded-xl bg-slate-800 text-white px-4 py-2 js-ok">确定</button></div></div>';
      document.body.appendChild(box);
      box.querySelector(".js-cancel").onclick = () => box.classList.add("hidden");
    }
    box.querySelector("h3").textContent = title;
    box.querySelector(".js-body").innerHTML = bodyHtml;
    const ok = box.querySelector(".js-ok");
    ok.textContent = okText || "确定";
    ok.onclick = () => {
      if (onOk && onOk() === false) return;
      box.classList.add("hidden");
    };
    box.classList.remove("hidden");
  }

  const page = location.pathname.split("/").pop();

  if (page === "pc_model_manage.html") {
    document.querySelectorAll("tbody tr").forEach((tr) => {
      tr.addEventListener("click", (e) => {
        if (e.target.closest("button")) return;
        document.querySelectorAll("tbody tr").forEach((r) => r.classList.remove("bg-sky-50"));
        tr.classList.add("bg-sky-50");
      });
    });
    document.querySelectorAll("tbody button").forEach((btn) => {
      const act = btn.textContent.trim();
      btn.onclick = (e) => {
        e.stopPropagation();
        const tr = btn.closest("tr");
        const name = tr?.children[0]?.textContent.trim() || "模型";
        const statusCell = tr?.children[5];
        const checkCell = tr?.children[4];
        if (act === "预览") {
          modal(
            "m-preview",
            "模型预览 · " + name,
            '<div class="rounded-xl bg-slate-900 text-slate-200 h-40 flex items-center justify-center">港区场景预览（演示）<br>' +
              name +
              "</div><p>预览仅检查摆放与贴图，不替代发布。</p>",
            null,
            "关闭"
          );
          return;
        }
        if (act === "校准") {
          modal(
            "m-cal",
            "坐标校准 · " + name,
            '<label class="block text-xs text-slate-500">平面偏移（米）</label><input id="cal-off" type="number" value="1.8" step="0.1" class="w-full rounded-xl border px-3 py-2"><p class="text-xs text-slate-400">保存后写入待发布，不直接改已上线场景。</p>',
            () => {
              const v = document.getElementById("cal-off")?.value || "0";
              if (tr.children[3]) tr.children[3].textContent = "已校准 / 偏移 " + v + "m";
              if (checkCell) {
                checkCell.textContent = "通过";
                checkCell.className = "px-3 py-2 text-emerald-600";
              }
              if (statusCell) statusCell.textContent = "待发布";
              toast(name + " 已校准，可发布到场景");
            },
            "保存校准"
          );
          return;
        }
        if (act === "报告") {
          modal(
            "m-rep",
            "自检报告 · " + name,
            "<ul class='list-disc pl-4 space-y-1'><li>材质贴图缺失 2 张</li><li>陆域道路分区未闭合</li><li>坐标系可识别，高程待复核</li></ul><p>失败项未清除前不可发布。</p>",
            null,
            "知道了"
          );
          return;
        }
        if (act === "发布") {
          if (statusCell) statusCell.textContent = "已发布";
          toast(name + " 已发布，港区概览将加载该模型");
          return;
        }
        if (act === "下架") {
          if (statusCell) statusCell.textContent = "已下架";
          toast(name + " 已从场景下架，历史版本保留");
        }
      };
    });
    const start = [...document.querySelectorAll("#imp button")].find((b) => b.textContent.includes("开始自检"));
    if (start) {
      start.onclick = () => {
        const name = document.querySelector("#imp input")?.value.trim() || "新导入模型";
        document.getElementById("imp").classList.add("hidden");
        const tb = document.querySelector("tbody");
        const tr = document.createElement("tr");
        tr.className = "border-t bg-amber-50";
        tr.innerHTML =
          "<td class='px-3 py-2'>" +
          name +
          "</td><td class='px-3 py-2'>待识别</td><td class='px-3 py-2'>未分区</td><td class='px-3 py-2'>—</td><td class='px-3 py-2 text-amber-600'>自检中</td><td class='px-3 py-2'>队列</td><td class='px-3 py-2 text-slate-400'>请稍后查看报告</td>";
        tb.prepend(tr);
        toast(name + " 已进入自检队列");
      };
    }
  }

  if (page === "pc_data_status.html") {
    document.querySelectorAll("tbody button").forEach((btn) => {
      btn.onclick = () => {
        const tr = btn.closest("tr");
        const name = tr.children[0].textContent.trim();
        const time = tr.children[2];
        const delay = tr.children[3];
        const state = tr.children[4];
        const act = btn.textContent.trim();
        if (act === "重试" && name.includes("地磅")) {
          time.textContent = "18分钟前";
          delay.textContent = "—";
          state.textContent = "仍中断";
          state.className = "px-3 py-2 text-rose-600";
          toast("地磅重试失败，集疏运过磅保持最后成功快照");
          return;
        }
        time.textContent = "刚刚";
        delay.textContent = act === "重连" ? "2.1s" : "0.9s";
        state.textContent = act === "重连" ? "恢复" : "正常";
        state.className = "px-3 py-2 text-emerald-600";
        toast(name + (act === "重连" ? " 已重连" : " 拉取成功"));
      };
    });
  }
})();
