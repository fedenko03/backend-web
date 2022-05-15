document.addEventListener("DOMContentLoaded", (function () {
    !function () {
        if ("requestAnimationFrame" in window && !/Mobile|Android/.test(navigator.userAgent)) {
            var e = [], t = document.querySelectorAll("[data-bss-parallax-bg]");
            for (var n of t) {
                var o = document.createElement("div");
                o.style.backgroundImage = n.style.backgroundImage, o.style.backgroundSize = "cover", o.style.backgroundPosition = "center", o.style.position = "absolute", o.style.height = "200%", o.style.width = "100%", o.style.top = 0, o.style.left = 0, o.style.zIndex = -100, n.appendChild(o), e.push(o), n.style.position = "relative", n.style.background = "transparent", n.style.overflow = "hidden"
            }
            if (e.length) {
                var r, a = [];
                window.addEventListener("scroll", i), window.addEventListener("resize", i), i()
            }
        }

        function i() {
            a.length = 0;
            for (var t = 0; t < e.length; t++) {
                var n = e[t].parentNode.getBoundingClientRect();
                n.bottom > 0 && n.top < window.innerHeight && a.push({rect: n, node: e[t]})
            }
            cancelAnimationFrame(r), a.length && (r = requestAnimationFrame(d))
        }

        function d() {
            for (var e = 0; e < a.length; e++) {
                var t = a[e].rect, n = a[e].node, o = Math.max(t.bottom, 0) / (window.innerHeight + t.height);
                n.style.transform = "translate3d(0, " + -50 * o + "%, 0)"
            }
        }
    }()
}), !1);