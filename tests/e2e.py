"""End-to-end browser tests. Usage:  BASE_URL=https://game-ujian.vercel.app python3 tests/e2e.py
Requires: pip install playwright && python3 -m playwright install chromium"""
import json, os, sys
from playwright.sync_api import sync_playwright

BASE = os.environ.get("BASE_URL", "http://127.0.0.1:8123/").rstrip("/") + "/"
OUT = os.environ.get("OUT_DIR", "/home/user/shots"); os.makedirs(OUT, exist_ok=True)
results = []
def check(name, ok, detail=""):
    results.append((name, bool(ok), detail)); print(("PASS " if ok else "FAIL ") + name + (f"  [{detail}]" if detail and not ok else ""), flush=True)

IGNORE = ("fonts.googleapis.com", "fonts.gstatic.com")
def new_page(browser, viewport=None, storage=None, **kw):
    ctx = browser.new_context(viewport=viewport or {"width": 1280, "height": 800}, **kw)
    if storage is not None:
        ctx.add_init_script("if(!sessionStorage.getItem('__seed')){sessionStorage.setItem('__seed','1');localStorage.setItem(%s,%s)}" % (json.dumps(storage[0]), json.dumps(storage[1])))
    pg = ctx.new_page(); errs = []
    pg.on("pageerror", lambda e: errs.append("pageerror: " + str(e)))
    pg.on("console", lambda m: errs.append("console." + m.type + ": " + m.text) if m.type == "error" and not any(i in m.text for i in IGNORE) else None)
    pg.on("requestfailed", lambda r: errs.append("requestfailed: " + r.url) if not any(i in r.url for i in IGNORE) else None)
    pg.on("response", lambda r: errs.append(f"http {r.status}: {r.url}") if r.status >= 400 and not any(i in r.url for i in IGNORE) else None)
    return ctx, pg, errs

def key(pg, r, i): return pg.evaluate("([r,i])=>window.__treasureQuiz.G.qOf(r,i).answer", [r, i])
def score(pg): return int(pg.locator("#score b").inner_text()) if pg.locator("#score b").count() else None
def state(pg): return pg.evaluate("()=>JSON.parse(JSON.stringify(window.__treasureQuiz.state))")
def total(pg): return pg.evaluate("()=>window.__treasureQuiz.G.overall(window.__treasureQuiz.state).score")
def to_map(pg, name="Dina"):
    pg.click("#start"); pg.fill("#nick", name); pg.click("button[type=submit]"); pg.wait_for_selector(".node")
def play_region(pg, r, pattern=None):
    pat = pattern or [True] * 7
    for i in range(7):
        pg.wait_for_selector(".opt")
        k = key(pg, r, i); pg.locator(".opt").nth(k if pat[i] else (k + 1) % 4).click()
        pg.wait_for_selector(".feedback"); pg.click("[data-action=next]")
    pg.wait_for_selector(".reward")

def part_a(browser):
    # 1. landing + design applied
    ctx, pg, errs = new_page(browser)
    pg.goto(BASE, wait_until="networkidle")
    check("landing: title + headline render", "Treasure Quiz" in pg.title() and "Lost Treasure" in pg.locator("h1").inner_text())
    css = pg.evaluate("""()=>({art:getComputedStyle(document.querySelector('.hero-art')).backgroundImage,body:getComputedStyle(document.body).backgroundImage,lm:document.querySelectorAll('.lm svg').length})""")
    check("landing: gradients applied (not 'none') + 5 landmark illustrations", css["art"] != "none" and css["body"] != "none" and css["lm"] == 5, str(css))
    check("landing: start button visible & large", pg.locator("#start").bounding_box()["height"] >= 44)
    pg.screenshot(path=f"{OUT}/01_landing_desktop.png")
    # 2. profile
    pg.click("#start"); pg.wait_for_selector("form[data-form=profile]")
    pg.click("button[type=submit]")
    check("profile: empty nickname -> friendly error, stays on profile", "nama panggilan" in pg.locator("#nickErr").inner_text().lower() and pg.locator("form[data-form=profile]").count() == 1)
    check("profile: nickname limited to 14 chars", pg.locator("#nick").get_attribute("maxlength") == "14")
    pg.locator(".avatar").nth(3).click()
    check("profile: avatar selection works (aria-pressed)", pg.locator(".avatar").nth(3).get_attribute("aria-pressed") == "true")
    pg.fill("#nick", "  Dina  "); pg.click("button[type=submit]"); pg.wait_for_selector(".node")
    st = state(pg); check("profile: saved trimmed name + avatar", st["name"] == "Dina" and st["avatar"] == "🐰", str(st))
    # 3. map
    nodes = pg.locator(".node"); check("map: 5 regions rendered", nodes.count() == 5)
    classes = [nodes.nth(i).get_attribute("class") for i in range(5)]
    check("map: only Grammar Village available, others locked", "available" in classes[0] and all("locked" in c for c in classes[1:]), str(classes))
    pg.screenshot(path=f"{OUT}/02_map_desktop.png")
    pg.locator(".node[data-r='1']").click(force=True)   # aria-disabled (not 'disabled'): a child can still tap it
    check("map: locked region -> hint, quiz does NOT start", pg.locator(".question").count() == 0 and "Grammar Village" in pg.locator("#toast").inner_text())
    # 4. CRITICAL
    pg.locator(".node[data-r='0']").click(); pg.wait_for_selector(".question", timeout=3000)
    check("CRITICAL: clicking Grammar Village opens question 1", pg.locator(".opt").count() == 4 and "Tantangan 1 dari 7" in pg.locator(".topic").inner_text())
    # 5. wrong answer
    k = key(pg, 0, 0); wrong = (k + 1) % 4
    pg.locator(".opt").nth(wrong).click(); pg.wait_for_selector(".feedback")
    check("wrong: soft encouraging feedback, +0 poin", pg.locator(".feedback.try").count() == 1 and "+0 poin" in pg.locator(".feedback").inner_text())
    check("wrong: correct option highlighted + explanation shown", pg.locator(".opt.correct").count() == 1 and "correct" in pg.locator(".opt").nth(k).get_attribute("class") and "Penjelasan" in pg.locator(".feedback").inner_text())
    check("wrong: chosen option marked wrong", "wrong" in pg.locator(".opt").nth(wrong).get_attribute("class"))
    check("wrong: all options disabled after answering", all(pg.locator(".opt").nth(i).is_disabled() for i in range(4)))
    check("wrong: score stays 0", score(pg) == 0)
    pg.click("[data-action=next]"); pg.wait_for_selector("text=Tantangan 2 dari 7")
    # 6. correct + anti-inflation
    k = key(pg, 0, 1)
    for _ in range(6): pg.evaluate("(k)=>document.querySelectorAll('.opt')[k].click()", k)
    pg.wait_for_selector(".feedback.good")
    check("correct: +100 exactly once despite 6 rapid clicks", score(pg) == 100 and "+100 poin" in pg.locator(".feedback").inner_text(), str(score(pg)))
    for j in range(4): pg.evaluate("(j)=>document.querySelectorAll('.opt')[j].click()", j)
    check("anti-inflation: clicking options after answering changes nothing", score(pg) == 100 and total(pg) == 100)
    pg.click("[data-action=next]"); pg.wait_for_selector("text=Tantangan 3 dari 7")
    pg.keyboard.press("ABCD"[key(pg, 0, 2)]); pg.wait_for_selector(".feedback.good")
    check("keyboard: pressing a letter answers the question", score(pg) == 200)
    # 7. persistence / resume
    pg.reload(wait_until="networkidle"); pg.click("#start"); pg.wait_for_selector(".node")
    check("persist: reload keeps progress (3/7 on node, 200 pts)", "3/7" in pg.locator(".node[data-r='0']").inner_text() and "200" in pg.locator(".stats").inner_text())
    pg.locator(".node[data-r='0']").click(); pg.wait_for_selector(".question")
    check("persist: resumes at first unanswered question (4/7)", "Tantangan 4 dari 7" in pg.locator(".topic").inner_text())
    for i in range(3, 7):
        k = key(pg, 0, i); pg.locator(".opt").nth(k).click(); pg.wait_for_selector(".feedback")
        if i == 6: check("last question: button reads 'Selesaikan Wilayah'", "Selesaikan" in pg.locator("[data-action=next]").inner_text())
        pg.click("[data-action=next]")
    pg.wait_for_selector(".reward")
    # 8. reward + review + unlock
    t = pg.locator(".reward").inner_text()
    check("reward: +600, 6/7, Bronze Key, unlock Enchanted Forest", "+600" in t and "6/7" in t and "Bronze Key" in t and "Enchanted Forest" in t, t[:200])
    pg.screenshot(path=f"{OUT}/03_reward_desktop.png")
    pg.click("[data-action=review]"); pg.wait_for_selector(".rv")
    check("review: 7 items, each with explanation", pg.locator(".rv").count() == 7 and pg.locator(".rv .why").count() == 7)
    check("review: wrong item shows 'Jawaban benar'", pg.locator(".rv.try").count() == 1 and "Jawaban benar" in pg.locator(".rv.try").inner_text())
    pg.click("[data-f=wrong]"); check("review: 'perlu dipelajari' filter -> 1 item", pg.locator(".rv").count() == 1)
    pg.screenshot(path=f"{OUT}/04_review_desktop.png")
    pg.click("[data-action=reviewBack]"); pg.wait_for_selector(".reward")
    pg.click("[data-action=goMap]"); pg.wait_for_selector(".node")
    classes = [pg.locator(".node").nth(i).get_attribute("class") for i in range(5)]
    check("unlock: R1 completed, R2 available, R3-5 locked", "completed" in classes[0] and "available" in classes[1] and all("locked" in c for c in classes[2:]), str(classes))
    pg.locator(".node[data-r='0']").click(); pg.wait_for_selector(".rv")
    check("completed region click -> review (never blank)", pg.locator(".rv").count() == 7)
    pg.click("[data-action=reviewBack]"); pg.wait_for_selector(".node")
    # 9. sound
    before = pg.evaluate("()=>window.__treasureQuiz.played.length")
    pg.click(".topbar [data-action=sound]")
    check("sound: toggle off (aria-pressed=false, persisted)", pg.locator(".topbar [data-action=sound]").get_attribute("aria-pressed") == "false" and state(pg)["sound"] is False)
    pg.locator(".node[data-r='1']").click(); pg.wait_for_selector(".opt"); pg.locator(".opt").nth(key(pg, 1, 0)).click(); pg.wait_for_selector(".feedback")
    check("sound: no effects played while muted", pg.evaluate("()=>window.__treasureQuiz.played.length") == before)
    pg.click("[data-action=next]"); pg.click(".topbar [data-action=sound]")
    pg.locator(".opt").nth(key(pg, 1, 1)).click(); pg.wait_for_selector(".feedback")
    check("sound: effect plays again when unmuted", "correct" in pg.evaluate("()=>window.__treasureQuiz.played.slice(-3)"))
    pg.click("[data-action=next]")
    return ctx, pg, errs

def part_b(pg, ctx, errs):
    # 10. finish whole game (continues from region 2, question 3)
    for i in range(2, 7):
        pg.locator(".opt").nth(key(pg, 1, i)).click(); pg.wait_for_selector(".feedback"); pg.click("[data-action=next]")
    pg.wait_for_selector(".reward"); pg.click("[data-action=goMap]"); pg.wait_for_selector(".node")
    for r in (2, 3, 4):
        pg.locator(f".node[data-r='{r}']").click(); pg.wait_for_selector(".opt")
        play_region(pg, r, [True, False, True, True, False, True, True] if r == 4 else None)
        if r < 4: pg.click("[data-action=goMap]"); pg.wait_for_selector(".node")
    check("final: last region reward offers the treasure", pg.locator("[data-action=final]").count() == 1)
    pg.click("[data-action=final]"); pg.wait_for_selector(".final")
    exp = 3500 - 100 - 200   # region 1: one wrong; region 5: two wrong
    ft = pg.locator(".final").inner_text()
    check("final: accurate score 3200 / 3500", total(pg) == exp and str(exp) in ft and "3500" in ft, ft[:160])
    check("final: 32/35 correct, 5/5 regions, 5 breakdown rows", "32/35" in ft and "5/5" in ft and pg.locator(".breakdown li").count() == 5)
    pg.wait_for_timeout(600)
    check("final: treasure chest opens", "open" in (pg.locator("#chest").get_attribute("class") or ""))
    pg.screenshot(path=f"{OUT}/05_final_desktop.png")
    pg.click("[data-action=review][data-scope=all]"); pg.wait_for_selector(".rv")
    check("final review: all 35 questions listed", pg.locator(".rv").count() == 35)
    pg.click("[data-action=reviewBack]"); pg.wait_for_selector(".final")
    # 11. restart
    pg.click("[data-action=restart]"); pg.wait_for_selector(".modal"); pg.click(".modal [data-action=closeModal]")
    check("restart: cancel keeps score", total(pg) == exp and pg.locator(".modal").count() == 0)
    pg.click("[data-action=restart]"); pg.keyboard.press("Escape")
    check("restart: Escape closes dialog", pg.locator(".modal").count() == 0)
    pg.click("[data-action=restart]"); pg.click("[data-action=confirmRestart]"); pg.wait_for_selector(".node")
    st = state(pg); classes = [pg.locator(".node").nth(i).get_attribute("class") for i in range(5)]
    check("restart: answers cleared, profile kept, only R1 available", st["answers"] == {} and st["name"] == "Dina" and "available" in classes[0] and all("locked" in c for c in classes[1:]), str(classes))
    pg.locator(".node[data-r='0']").click(); pg.wait_for_selector(".opt")
    check("restart: new game playable immediately (score 0)", "Tantangan 1 dari 7" in pg.locator(".topic").inner_text() and score(pg) == 0)
    check("console: no errors across the whole flow (desktop)", not errs, "; ".join(errs[:5]))
    ctx.close()

def part_c(browser):
    # 12. stale / corrupt saves
    bad = {
        "legacy completed, no attempts": ("treasureQuiz_v02", {"name": "Tes", "avatar": "🦊", "totalScore": 0, "completedRegions": [0], "regionScores": {}, "attempts": {}}),
        "legacy out-of-order": ("treasureQuiz_v02", {"name": "Tes", "completedRegions": [1], "attempts": {}}),
        "legacy all 5 done, no attempts": ("treasureQuiz_v02", {"name": "Tes", "completedRegions": [0, 1, 2, 3, 4], "attempts": {}, "totalScore": 3500}),
        "v3 garbage": ("treasureQuiz_v3", {"answers": {"1": {"choice": 99}, "2": None}, "name": 123}),
        "v3 skipped region": ("treasureQuiz_v3", {"name": "Tes", "answers": {"15": {"choice": 1}, "20": {"choice": 1}}}),
        "not json": ("treasureQuiz_v3", "{{{{"),
    }
    for label, (k_, v_) in bad.items():
        val = v_ if isinstance(v_, str) else json.dumps(v_)
        c2, p2, e2 = new_page(browser, storage=(k_, val))
        p2.goto(BASE, wait_until="networkidle"); p2.click("#start")
        if p2.locator("form[data-form=profile]").count(): p2.fill("#nick", "Tes"); p2.click("button[type=submit]")
        p2.wait_for_selector(".node"); p2.locator(".node[data-r='0']").click()
        check(f"stale save [{label}]: Grammar Village opens question 1", p2.locator(".opt").count() == 4 and not e2, "; ".join(e2[:3]))
        c2.close()
    good = {"name": "Sari", "avatar": "🐼", "completedRegions": [0], "attempts": {"0": [{"id": i, "choice": 0, "ok": False} for i in range(1, 8)]}}
    c3, p3, e3 = new_page(browser, storage=("treasureQuiz_v02", json.dumps(good)))
    p3.goto(BASE, wait_until="networkidle"); p3.click("#start"); p3.wait_for_selector(".node")
    check("legacy save with real attempts migrates (R1 completed, name kept)", "completed" in p3.locator(".node[data-r='0']").get_attribute("class") and "Sari" in p3.locator(".player").inner_text())
    c3.close()
    # 13. responsive
    for label, vp in {"mobile": {"width": 375, "height": 667}, "tablet": {"width": 768, "height": 1024}, "desktop": {"width": 1280, "height": 800}}.items():
        c4, p4, e4 = new_page(browser, viewport=vp, has_touch=(label != "desktop"), is_mobile=(label == "mobile"))
        p4.goto(BASE, wait_until="networkidle")
        ov = lambda: p4.evaluate("()=>document.documentElement.scrollWidth-window.innerWidth")
        check(f"{label}: landing no horizontal overflow", ov() <= 1, str(ov()))
        to_map(p4)
        check(f"{label}: map no horizontal overflow", ov() <= 1, str(ov()))
        geo = p4.evaluate("""()=>{const m=document.querySelector('.map-wrap').getBoundingClientRect();
          const ns=[...document.querySelectorAll('.node')].map(n=>n.getBoundingClientRect());
          let overlap=0;for(let i=0;i<ns.length;i++)for(let j=i+1;j<ns.length;j++){const a=ns[i],b=ns[j];if(a.left<b.right&&b.left<a.right&&a.top<b.bottom&&b.top<a.bottom)overlap++}
          const inside=ns.every(n=>n.left>=m.left-1&&n.right<=m.right+1&&n.top>=m.top-1&&n.bottom<=m.bottom+1);
          return {overlap,inside,minW:Math.min(...ns.map(n=>n.width)),minH:Math.min(...ns.map(n=>n.height))}}""")
        check(f"{label}: map nodes don't overlap, stay inside map, tap target >= 44px", geo["overlap"] == 0 and geo["inside"] and geo["minW"] >= 44 and geo["minH"] >= 44, str(geo))
        p4.screenshot(path=f"{OUT}/map_{label}.png", full_page=True)
        (p4.locator(".node[data-r='0']").tap() if label != "desktop" else p4.locator(".node[data-r='0']").click()); p4.wait_for_selector(".opt")
        check(f"{label}: quiz no overflow, options >= 44px tall", ov() <= 1 and p4.locator(".opt").first.bounding_box()["height"] >= 44, str(ov()))
        clipped = p4.evaluate("()=>[...document.querySelectorAll('.opt,.btn,.question')].filter(e=>e.scrollWidth>e.clientWidth+1).length")
        check(f"{label}: no clipped text in quiz controls", clipped == 0, str(clipped))
        p4.screenshot(path=f"{OUT}/quiz_{label}.png", full_page=True)
        check(f"{label}: no console errors", not e4, "; ".join(e4[:4]))
        c4.close()
    # 14. service worker
    c5, p5, e5 = new_page(browser)
    p5.goto(BASE, wait_until="networkidle"); p5.wait_for_timeout(1500)
    sw = p5.evaluate("async()=>{const r=await navigator.serviceWorker.getRegistration();return {reg:!!r,keys:await caches.keys()}}")
    check("service worker registered with versioned cache", sw["reg"] and any("2026-11-23-v3" in k for k in sw["keys"]), str(sw))
    src = p5.evaluate("async()=>(await fetch('./sw.js',{cache:'no-store'})).text()")
    check("service worker is network-first", "fetch(req" in src and src.index("fetch(req") < src.index("caches.match(req)"))
    c5.close()

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx, pg, errs = part_a(browser)
        part_b(pg, ctx, errs)
        part_c(browser)
        browser.close()
    fails = [r for r in results if not r[1]]
    print(f"\n{len(results)-len(fails)}/{len(results)} checks passed")
    for n, _, d in fails: print("FAILED:", n, d)
    sys.exit(1 if fails else 0)
main()
