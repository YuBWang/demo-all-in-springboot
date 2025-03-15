var rrwebPlayer = function () {
    "use strict";

    function e() {
    }

    function t(e, t) {
        for (const n in t) e[n] = t[n];
        return e
    }

    function n(e) {
        return e()
    }

    function i() {
        return Object.create(null)
    }

    function o(e) {
        e.forEach(n)
    }

    function r(e) {
        return "function" == typeof e
    }

    function s(e, t) {
        return e != e ? t == t : e !== t || e && "object" == typeof e || "function" == typeof e
    }

    function a(e) {
        const t = {};
        for (const n in e) "$" !== n[0] && (t[n] = e[n]);
        return t
    }

    function c(e, t) {
        e.appendChild(t)
    }

    function l(e, t, n) {
        e.insertBefore(t, n || null)
    }

    function u(e) {
        e.parentNode.removeChild(e)
    }

    function d(e, t) {
        for (let n = 0; n < e.length; n += 1) e[n] && e[n].d(t)
    }

    function h(e) {
        return document.createElement(e)
    }

    function p(e) {
        return document.createElementNS("http://www.w3.org/2000/svg", e)
    }

    function m(e) {
        return document.createTextNode(e)
    }

    function f() {
        return m(" ")
    }

    function g(e, t, n, i) {
        return e.addEventListener(t, n, i), () => e.removeEventListener(t, n, i)
    }

    function y(e, t, n) {
        null == n ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n)
    }

    function v(e, t) {
        t = "" + t, e.wholeText !== t && (e.data = t)
    }

    function C(e, t, n, i) {
        e.style.setProperty(t, n, i ? "important" : "")
    }

    function I(e, t, n) {
        e.classList[n ? "add" : "remove"](t)
    }

    let b;

    function N(e) {
        b = e
    }

    function A() {
        if (!b) throw new Error("Function called outside component initialization");
        return b
    }

    function w(e) {
        A().$$.on_mount.push(e)
    }

    function E(e) {
        A().$$.on_destroy.push(e)
    }

    function T() {
        const e = A();
        return (t, n) => {
            const i = e.$$.callbacks[t];
            if (i) {
                const o = function (e, t, n = !1) {
                    const i = document.createEvent("CustomEvent");
                    return i.initCustomEvent(e, n, !1, t), i
                }(t, n);
                i.slice().forEach((t => {
                    t.call(e, o)
                }))
            }
        }
    }

    const S = [], x = [], D = [], R = [], M = Promise.resolve();
    let k = !1;

    function F(e) {
        D.push(e)
    }

    let O = !1;
    const B = new Set;

    function L() {
        if (!O) {
            O = !0;
            do {
                for (let e = 0; e < S.length; e += 1) {
                    const t = S[e];
                    N(t), _(t.$$)
                }
                for (N(null), S.length = 0; x.length;) x.pop()();
                for (let e = 0; e < D.length; e += 1) {
                    const t = D[e];
                    B.has(t) || (B.add(t), t())
                }
                D.length = 0
            } while (S.length);
            for (; R.length;) R.pop()();
            k = !1, O = !1, B.clear()
        }
    }

    function _(e) {
        if (null !== e.fragment) {
            e.update(), o(e.before_update);
            const t = e.dirty;
            e.dirty = [-1], e.fragment && e.fragment.p(e.ctx, t), e.after_update.forEach(F)
        }
    }

    const V = new Set;
    let G;

    function W() {
        G = {r: 0, c: [], p: G}
    }

    function U() {
        G.r || o(G.c), G = G.p
    }

    function Z(e, t) {
        e && e.i && (V.delete(e), e.i(t))
    }

    function $(e, t, n, i) {
        if (e && e.o) {
            if (V.has(e)) return;
            V.add(e), G.c.push((() => {
                V.delete(e), i && (n && e.d(1), i())
            })), e.o(t)
        }
    }

    function P(e) {
        e && e.c()
    }

    function K(e, t, i, s) {
        const {fragment: a, on_mount: c, on_destroy: l, after_update: u} = e.$$;
        a && a.m(t, i), s || F((() => {
            const t = c.map(n).filter(r);
            l ? l.push(...t) : o(t), e.$$.on_mount = []
        })), u.forEach(F)
    }

    function Y(e, t) {
        const n = e.$$;
        null !== n.fragment && (o(n.on_destroy), n.fragment && n.fragment.d(t), n.on_destroy = n.fragment = null, n.ctx = [])
    }

    function J(e, t) {
        -1 === e.$$.dirty[0] && (S.push(e), k || (k = !0, M.then(L)), e.$$.dirty.fill(0)), e.$$.dirty[t / 31 | 0] |= 1 << t % 31
    }

    function X(t, n, r, s, a, c, l, d = [-1]) {
        const h = b;
        N(t);
        const p = t.$$ = {
            fragment: null,
            ctx: null,
            props: c,
            update: e,
            not_equal: a,
            bound: i(),
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(h ? h.$$.context : n.context || []),
            callbacks: i(),
            dirty: d,
            skip_bound: !1,
            root: n.target || h.$$.root
        };
        l && l(p.root);
        let m = !1;
        if (p.ctx = r ? r(t, n.props || {}, ((e, n, ...i) => {
            const o = i.length ? i[0] : n;
            return p.ctx && a(p.ctx[e], p.ctx[e] = o) && (!p.skip_bound && p.bound[e] && p.bound[e](o), m && J(t, e)), n
        })) : [], p.update(), m = !0, o(p.before_update), p.fragment = !!s && s(p.ctx), n.target) {
            if (n.hydrate) {
                const e = function (e) {
                    return Array.from(e.childNodes)
                }(n.target);
                p.fragment && p.fragment.l(e), e.forEach(u)
            } else p.fragment && p.fragment.c();
            n.intro && Z(t.$$.fragment), K(t, n.target, n.anchor, n.customElement), L()
        }
        N(h)
    }

    class j {
        $destroy() {
            Y(this, 1), this.$destroy = e
        }

        $on(e, t) {
            const n = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
            return n.push(t), () => {
                const e = n.indexOf(t);
                -1 !== e && n.splice(e, 1)
            }
        }

        $set(e) {
            var t;
            this.$$set && (t = e, 0 !== Object.keys(t).length) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1)
        }
    }

    var H;

    function z(e) {
        return e.nodeType === e.ELEMENT_NODE
    }

    !function (e) {
        e[e.Document = 0] = "Document", e[e.DocumentType = 1] = "DocumentType", e[e.Element = 2] = "Element", e[e.Text = 3] = "Text", e[e.CDATA = 4] = "CDATA", e[e.Comment = 5] = "Comment"
    }(H || (H = {}));
    var Q = function () {
        function e() {
            this.idNodeMap = new Map, this.nodeMetaMap = new WeakMap
        }

        return e.prototype.getId = function (e) {
            var t;
            if (!e) return -1;
            var n = null === (t = this.getMeta(e)) || void 0 === t ? void 0 : t.id;
            return null != n ? n : -1
        }, e.prototype.getNode = function (e) {
            return this.idNodeMap.get(e) || null
        }, e.prototype.getIds = function () {
            return Array.from(this.idNodeMap.keys())
        }, e.prototype.getMeta = function (e) {
            return this.nodeMetaMap.get(e) || null
        }, e.prototype.removeNodeFromMap = function (e) {
            var t = this, n = this.getId(e);
            this.idNodeMap.delete(n), e.childNodes && e.childNodes.forEach((function (e) {
                return t.removeNodeFromMap(e)
            }))
        }, e.prototype.has = function (e) {
            return this.idNodeMap.has(e)
        }, e.prototype.hasNode = function (e) {
            return this.nodeMetaMap.has(e)
        }, e.prototype.add = function (e, t) {
            var n = t.id;
            this.idNodeMap.set(n, e), this.nodeMetaMap.set(e, t)
        }, e.prototype.replace = function (e, t) {
            this.idNodeMap.set(e, t)
        }, e.prototype.reset = function () {
            this.idNodeMap = new Map, this.nodeMetaMap = new WeakMap
        }, e
    }();

    function q() {
        return new Q
    }

    var ee = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;

    function te(e, t) {
        void 0 === t && (t = {});
        var n = 1, i = 1;

        function o(e) {
            var t = e.match(/\n/g);
            t && (n += t.length);
            var o = e.lastIndexOf("\n");
            i = -1 === o ? i + e.length : e.length - o
        }

        function r() {
            var e = {line: n, column: i};
            return function (t) {
                return t.position = new s(e), p(), t
            }
        }

        var s = function (e) {
            this.start = e, this.end = {line: n, column: i}, this.source = t.source
        };
        s.prototype.content = e;
        var a = [];

        function c(o) {
            var r = new Error("".concat(t.source || "", ":").concat(n, ":").concat(i, ": ").concat(o));
            if (r.reason = o, r.filename = t.source, r.line = n, r.column = i, r.source = e, !t.silent) throw r;
            a.push(r)
        }

        function l() {
            return h(/^{\s*/)
        }

        function u() {
            return h(/^}/)
        }

        function d() {
            var t, n = [];
            for (p(), m(n); e.length && "}" !== e.charAt(0) && (t = E() || T());) !1 !== t && (n.push(t), m(n));
            return n
        }

        function h(t) {
            var n = t.exec(e);
            if (n) {
                var i = n[0];
                return o(i), e = e.slice(i.length), n
            }
        }

        function p() {
            h(/^\s*/)
        }

        function m(e) {
            var t;
            for (void 0 === e && (e = []); t = f();) !1 !== t && e.push(t), t = f();
            return e
        }

        function f() {
            var t = r();
            if ("/" === e.charAt(0) && "*" === e.charAt(1)) {
                for (var n = 2; "" !== e.charAt(n) && ("*" !== e.charAt(n) || "/" !== e.charAt(n + 1));) ++n;
                if (n += 2, "" === e.charAt(n - 1)) return c("End of comment missing");
                var s = e.slice(2, n - 2);
                return i += 2, o(s), e = e.slice(n), i += 2, t({type: "comment", comment: s})
            }
        }

        function g() {
            var e = h(/^([^{]+)/);
            if (e) return ne(e[0]).replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/g, "").replace(/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'/g, (function (e) {
                return e.replace(/,/g, "‌")
            })).split(/\s*(?![^(]*\)),\s*/).map((function (e) {
                return e.replace(/\u200C/g, ",")
            }))
        }

        function y() {
            var e = r(), t = h(/^(\*?[-#\/\*\\\w]+(\[[0-9a-z_-]+\])?)\s*/);
            if (t) {
                var n = ne(t[0]);
                if (!h(/^:\s*/)) return c("property missing ':'");
                var i = h(/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^\)]*?\)|[^};])+)/),
                    o = e({type: "declaration", property: n.replace(ee, ""), value: i ? ne(i[0]).replace(ee, "") : ""});
                return h(/^[;\s]*/), o
            }
        }

        function v() {
            var e, t = [];
            if (!l()) return c("missing '{'");
            for (m(t); e = y();) !1 !== e && (t.push(e), m(t)), e = y();
            return u() ? t : c("missing '}'")
        }

        function C() {
            for (var e, t = [], n = r(); e = h(/^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/);) t.push(e[1]), h(/^,\s*/);
            if (t.length) return n({type: "keyframe", values: t, declarations: v()})
        }

        var I, b = w("import"), N = w("charset"), A = w("namespace");

        function w(e) {
            var t = new RegExp("^@" + e + "\\s*([^;]+);");
            return function () {
                var n = r(), i = h(t);
                if (i) {
                    var o = {type: e};
                    return o[e] = i[1].trim(), n(o)
                }
            }
        }

        function E() {
            if ("@" === e[0]) return function () {
                var e = r(), t = h(/^@([-\w]+)?keyframes\s*/);
                if (t) {
                    var n = t[1];
                    if (!(t = h(/^([-\w]+)\s*/))) return c("@keyframes missing name");
                    var i, o = t[1];
                    if (!l()) return c("@keyframes missing '{'");
                    for (var s = m(); i = C();) s.push(i), s = s.concat(m());
                    return u() ? e({type: "keyframes", name: o, vendor: n, keyframes: s}) : c("@keyframes missing '}'")
                }
            }() || function () {
                var e = r(), t = h(/^@media *([^{]+)/);
                if (t) {
                    var n = ne(t[1]);
                    if (!l()) return c("@media missing '{'");
                    var i = m().concat(d());
                    return u() ? e({type: "media", media: n, rules: i}) : c("@media missing '}'")
                }
            }() || function () {
                var e = r(), t = h(/^@custom-media\s+(--[^\s]+)\s*([^{;]+);/);
                if (t) return e({type: "custom-media", name: ne(t[1]), media: ne(t[2])})
            }() || function () {
                var e = r(), t = h(/^@supports *([^{]+)/);
                if (t) {
                    var n = ne(t[1]);
                    if (!l()) return c("@supports missing '{'");
                    var i = m().concat(d());
                    return u() ? e({type: "supports", supports: n, rules: i}) : c("@supports missing '}'")
                }
            }() || b() || N() || A() || function () {
                var e = r(), t = h(/^@([-\w]+)?document *([^{]+)/);
                if (t) {
                    var n = ne(t[1]), i = ne(t[2]);
                    if (!l()) return c("@document missing '{'");
                    var o = m().concat(d());
                    return u() ? e({type: "document", document: i, vendor: n, rules: o}) : c("@document missing '}'")
                }
            }() || function () {
                var e = r();
                if (h(/^@page */)) {
                    var t = g() || [];
                    if (!l()) return c("@page missing '{'");
                    for (var n, i = m(); n = y();) i.push(n), i = i.concat(m());
                    return u() ? e({type: "page", selectors: t, declarations: i}) : c("@page missing '}'")
                }
            }() || function () {
                var e = r();
                if (h(/^@host\s*/)) {
                    if (!l()) return c("@host missing '{'");
                    var t = m().concat(d());
                    return u() ? e({type: "host", rules: t}) : c("@host missing '}'")
                }
            }() || function () {
                var e = r();
                if (h(/^@font-face\s*/)) {
                    if (!l()) return c("@font-face missing '{'");
                    for (var t, n = m(); t = y();) n.push(t), n = n.concat(m());
                    return u() ? e({type: "font-face", declarations: n}) : c("@font-face missing '}'")
                }
            }()
        }

        function T() {
            var e = r(), t = g();
            return t ? (m(), e({type: "rule", selectors: t, declarations: v()})) : c("selector missing")
        }

        return ie((I = d(), {type: "stylesheet", stylesheet: {source: t.source, rules: I, parsingErrors: a}}))
    }

    function ne(e) {
        return e ? e.replace(/^\s+|\s+$/g, "") : ""
    }

    function ie(e, t) {
        for (var n = e && "string" == typeof e.type, i = n ? e : t, o = 0, r = Object.keys(e); o < r.length; o++) {
            var s = e[r[o]];
            Array.isArray(s) ? s.forEach((function (e) {
                ie(e, i)
            })) : s && "object" == typeof s && ie(s, i)
        }
        return n && Object.defineProperty(e, "parent", {
            configurable: !0,
            writable: !0,
            enumerable: !1,
            value: t || null
        }), e
    }

    var oe = {
        script: "noscript",
        altglyph: "altGlyph",
        altglyphdef: "altGlyphDef",
        altglyphitem: "altGlyphItem",
        animatecolor: "animateColor",
        animatemotion: "animateMotion",
        animatetransform: "animateTransform",
        clippath: "clipPath",
        feblend: "feBlend",
        fecolormatrix: "feColorMatrix",
        fecomponenttransfer: "feComponentTransfer",
        fecomposite: "feComposite",
        feconvolvematrix: "feConvolveMatrix",
        fediffuselighting: "feDiffuseLighting",
        fedisplacementmap: "feDisplacementMap",
        fedistantlight: "feDistantLight",
        fedropshadow: "feDropShadow",
        feflood: "feFlood",
        fefunca: "feFuncA",
        fefuncb: "feFuncB",
        fefuncg: "feFuncG",
        fefuncr: "feFuncR",
        fegaussianblur: "feGaussianBlur",
        feimage: "feImage",
        femerge: "feMerge",
        femergenode: "feMergeNode",
        femorphology: "feMorphology",
        feoffset: "feOffset",
        fepointlight: "fePointLight",
        fespecularlighting: "feSpecularLighting",
        fespotlight: "feSpotLight",
        fetile: "feTile",
        feturbulence: "feTurbulence",
        foreignobject: "foreignObject",
        glyphref: "glyphRef",
        lineargradient: "linearGradient",
        radialgradient: "radialGradient"
    };
    var re = /([^\\]):hover/, se = new RegExp(re.source, "g");

    function ae(e, t) {
        var n = null == t ? void 0 : t.stylesWithHoverClass.get(e);
        if (n) return n;
        var i = te(e, {silent: !0});
        if (!i.stylesheet) return e;
        var o = [];
        if (i.stylesheet.rules.forEach((function (e) {
            "selectors" in e && (e.selectors || []).forEach((function (e) {
                re.test(e) && o.push(e)
            }))
        })), 0 === o.length) return e;
        var r = new RegExp(o.filter((function (e, t) {
            return o.indexOf(e) === t
        })).sort((function (e, t) {
            return t.length - e.length
        })).map((function (e) {
            return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        })).join("|"), "g"), s = e.replace(r, (function (e) {
            var t = e.replace(se, "$1.\\:hover");
            return "".concat(e, ", ").concat(t)
        }));
        return null == t || t.stylesWithHoverClass.set(e, s), s
    }

    function ce() {
        return {stylesWithHoverClass: new Map}
    }

    function le(e, t) {
        var n = t.doc, i = t.hackCss, o = t.cache;
        switch (e.type) {
            case H.Document:
                return n.implementation.createDocument(null, "", null);
            case H.DocumentType:
                return n.implementation.createDocumentType(e.name || "html", e.publicId, e.systemId);
            case H.Element:
                var r, s = function (e) {
                    var t = oe[e.tagName] ? oe[e.tagName] : e.tagName;
                    return "link" === t && e.attributes._cssText && (t = "style"), t
                }(e);
                r = e.isSVG ? n.createElementNS("http://www.w3.org/2000/svg", s) : n.createElement(s);
                var a = function (t) {
                    if (!Object.prototype.hasOwnProperty.call(e.attributes, t)) return "continue";
                    var a = e.attributes[t];
                    if ("option" === s && "selected" === t && !1 === a) return "continue";
                    if (a = "boolean" == typeof a || "number" == typeof a ? "" : a, t.startsWith("rr_")) {
                        if ("canvas" === s && "rr_dataURL" === t) {
                            var c = document.createElement("img");
                            c.onload = function () {
                                var e = r.getContext("2d");
                                e && e.drawImage(c, 0, 0, c.width, c.height)
                            }, c.src = a, r.RRNodeType && (r.rr_dataURL = a)
                        } else if ("img" === s && "rr_dataURL" === t) {
                            var l = r;
                            l.currentSrc.startsWith("data:") || (l.setAttribute("rrweb-original-src", e.attributes.src), l.src = a)
                        }
                        if ("rr_width" === t) r.style.width = a; else if ("rr_height" === t) r.style.height = a; else if ("rr_mediaCurrentTime" === t) r.currentTime = e.attributes.rr_mediaCurrentTime; else if ("rr_mediaState" === t) switch (a) {
                            case"played":
                                r.play().catch((function (e) {
                                    return console.warn("media playback error", e)
                                }));
                                break;
                            case"paused":
                                r.pause()
                        }
                    } else {
                        var u = "textarea" === s && "value" === t, d = "style" === s && "_cssText" === t;
                        if (d && i && (a = ae(a, o)), u || d) {
                            for (var h = n.createTextNode(a), p = 0, m = Array.from(r.childNodes); p < m.length; p++) {
                                var f = m[p];
                                f.nodeType === r.TEXT_NODE && r.removeChild(f)
                            }
                            return r.appendChild(h), "continue"
                        }
                        try {
                            if (e.isSVG && "xlink:href" === t) r.setAttributeNS("http://www.w3.org/1999/xlink", t, a); else if ("onload" === t || "onclick" === t || "onmouse" === t.substring(0, 7)) r.setAttribute("_" + t, a); else {
                                if ("meta" === s && "Content-Security-Policy" === e.attributes["http-equiv"] && "content" === t) return r.setAttribute("csp-content", a), "continue";
                                "link" === s && "preload" === e.attributes.rel && "script" === e.attributes.as || "link" === s && "prefetch" === e.attributes.rel && "string" == typeof e.attributes.href && e.attributes.href.endsWith(".js") || ("img" === s && e.attributes.srcset && e.attributes.rr_dataURL ? r.setAttribute("rrweb-original-srcset", e.attributes.srcset) : r.setAttribute(t, a))
                            }
                        } catch (e) {
                        }
                    }
                };
                for (var c in e.attributes) a(c);
                if (e.isShadowHost) if (r.shadowRoot) for (; r.shadowRoot.firstChild;) r.shadowRoot.removeChild(r.shadowRoot.firstChild); else r.attachShadow({mode: "open"});
                return r;
            case H.Text:
                return n.createTextNode(e.isStyle && i ? ae(e.textContent, o) : e.textContent);
            case H.CDATA:
                return n.createCDATASection(e.textContent);
            case H.Comment:
                return n.createComment(e.textContent);
            default:
                return null
        }
    }

    function ue(e, t) {
        var n = t.doc, i = t.mirror, o = t.skipChild, r = void 0 !== o && o, s = t.hackCss, a = void 0 === s || s,
            c = t.afterAppend, l = t.cache, u = le(e, {doc: n, hackCss: a, cache: l});
        if (!u) return null;
        if (e.rootId && console.assert(i.getNode(e.rootId) === n, "Target document should have the same root id."), e.type === H.Document && (n.close(), n.open(), "BackCompat" === e.compatMode && e.childNodes && e.childNodes[0].type !== H.DocumentType && (e.childNodes[0].type === H.Element && "xmlns" in e.childNodes[0].attributes && "http://www.w3.org/1999/xhtml" === e.childNodes[0].attributes.xmlns ? n.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "">') : n.write('<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "">')), u = n), i.add(u, e), (e.type === H.Document || e.type === H.Element) && !r) for (var d = 0, h = e.childNodes; d < h.length; d++) {
            var p = h[d], m = ue(p, {doc: n, mirror: i, skipChild: !1, hackCss: a, afterAppend: c, cache: l});
            m ? (p.isShadow && z(u) && u.shadowRoot ? u.shadowRoot.appendChild(m) : u.appendChild(m), c && c(m)) : console.warn("Failed to rebuild", p)
        }
        return u
    }

    function de(e, t) {
        var n = t.doc, i = t.onVisit, o = t.hackCss, r = void 0 === o || o, s = t.afterAppend, a = t.cache,
            c = t.mirror, l = void 0 === c ? new Q : c,
            u = ue(e, {doc: n, mirror: l, skipChild: !1, hackCss: r, afterAppend: s, cache: a});
        return function (e, t) {
            for (var n = 0, i = e.getIds(); n < i.length; n++) {
                var o = i[n];
                e.has(o) && t(e.getNode(o))
            }
        }(l, (function (e) {
            i && i(e), function (e, t) {
                var n = t.getMeta(e);
                if ((null == n ? void 0 : n.type) === H.Element) {
                    var i = e;
                    for (var o in n.attributes) if (Object.prototype.hasOwnProperty.call(n.attributes, o) && o.startsWith("rr_")) {
                        var r = n.attributes[o];
                        "rr_scrollLeft" === o && (i.scrollLeft = r), "rr_scrollTop" === o && (i.scrollTop = r)
                    }
                }
            }(e, l)
        })), u
    }

    const he = "Please stop import mirror directly. Instead of that,\r\nnow you can use replayer.getMirror() to access the mirror instance of a replayer,\r\nor you can use record.mirror to access the mirror instance during recording.";
    let pe = {
        map: {},
        getId: () => (console.error(he), -1),
        getNode: () => (console.error(he), null),
        removeNodeFromMap() {
            console.error(he)
        },
        has: () => (console.error(he), !1),
        reset() {
            console.error(he)
        }
    };

    function me(e) {
        const t = {}, n = (e, n) => {
            const i = {value: e, parent: n, children: []};
            return t[e.node.id] = i, i
        }, i = [];
        for (const o of e) {
            const {nextId: e, parentId: r} = o;
            if (e && e in t) {
                const r = t[e];
                if (r.parent) {
                    const e = r.parent.children.indexOf(r);
                    r.parent.children.splice(e, 0, n(o, r.parent))
                } else {
                    const e = i.indexOf(r);
                    i.splice(e, 0, n(o, null))
                }
            } else if (r in t) {
                const e = t[r];
                e.children.push(n(o, e))
            } else i.push(n(o, null))
        }
        return i
    }

    function fe(e, t) {
        t(e.value);
        for (let n = e.children.length - 1; n >= 0; n--) fe(e.children[n], t)
    }

    function ge(e, t) {
        return Boolean("IFRAME" === e.nodeName && t.getMeta(e))
    }

    function ye(e, t) {
        var n, i;
        const o = null === (i = null === (n = e.ownerDocument) || void 0 === n ? void 0 : n.defaultView) || void 0 === i ? void 0 : i.frameElement;
        if (!o || o === t) return {x: 0, y: 0, relativeScale: 1, absoluteScale: 1};
        const r = o.getBoundingClientRect(), s = ye(o, t), a = r.height / o.clientHeight;
        return {
            x: r.x * s.relativeScale + s.x,
            y: r.y * s.relativeScale + s.y,
            relativeScale: a,
            absoluteScale: s.absoluteScale * a
        }
    }

    function ve(e) {
        return Boolean(null == e ? void 0 : e.shadowRoot)
    }

    function Ce(e, t) {
        const n = e[t[0]];
        return 1 === t.length ? n : Ce(n.cssRules[t[1]].cssRules, t.slice(2))
    }

    function Ie(e) {
        const t = [...e], n = t.pop();
        return {positions: t, index: n}
    }

    var be, Ne, Ae, we, Ee, Te;

    /*! *****************************************************************************
        Copyright (c) Microsoft Corporation.

        Permission to use, copy, modify, and/or distribute this software for any
        purpose with or without fee is hereby granted.

        THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
        REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
        AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
        INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
        LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
        OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
        PERFORMANCE OF THIS SOFTWARE.
        ***************************************************************************** */
    function Se(e, t, n, i) {
        return new (n || (n = Promise))((function (o, r) {
            function s(e) {
                try {
                    c(i.next(e))
                } catch (e) {
                    r(e)
                }
            }

            function a(e) {
                try {
                    c(i.throw(e))
                } catch (e) {
                    r(e)
                }
            }

            function c(e) {
                var t;
                e.done ? o(e.value) : (t = e.value, t instanceof n ? t : new n((function (e) {
                    e(t)
                }))).then(s, a)
            }

            c((i = i.apply(e, t || [])).next())
        }))
    }

    "undefined" != typeof window && window.Proxy && window.Reflect && (pe = new Proxy(pe, {get: (e, t, n) => ("map" === t && console.error(he), Reflect.get(e, t, n))})), function (e) {
        e[e.DomContentLoaded = 0] = "DomContentLoaded", e[e.Load = 1] = "Load", e[e.FullSnapshot = 2] = "FullSnapshot", e[e.IncrementalSnapshot = 3] = "IncrementalSnapshot", e[e.Meta = 4] = "Meta", e[e.Custom = 5] = "Custom", e[e.Plugin = 6] = "Plugin"
    }(be || (be = {})), function (e) {
        e[e.Mutation = 0] = "Mutation", e[e.MouseMove = 1] = "MouseMove", e[e.MouseInteraction = 2] = "MouseInteraction", e[e.Scroll = 3] = "Scroll", e[e.ViewportResize = 4] = "ViewportResize", e[e.Input = 5] = "Input", e[e.TouchMove = 6] = "TouchMove", e[e.MediaInteraction = 7] = "MediaInteraction", e[e.StyleSheetRule = 8] = "StyleSheetRule", e[e.CanvasMutation = 9] = "CanvasMutation", e[e.Font = 10] = "Font", e[e.Log = 11] = "Log", e[e.Drag = 12] = "Drag", e[e.StyleDeclaration = 13] = "StyleDeclaration"
    }(Ne || (Ne = {})), function (e) {
        e[e.MouseUp = 0] = "MouseUp", e[e.MouseDown = 1] = "MouseDown", e[e.Click = 2] = "Click", e[e.ContextMenu = 3] = "ContextMenu", e[e.DblClick = 4] = "DblClick", e[e.Focus = 5] = "Focus", e[e.Blur = 6] = "Blur", e[e.TouchStart = 7] = "TouchStart", e[e.TouchMove_Departed = 8] = "TouchMove_Departed", e[e.TouchEnd = 9] = "TouchEnd", e[e.TouchCancel = 10] = "TouchCancel"
    }(Ae || (Ae = {})), function (e) {
        e[e["2D"] = 0] = "2D", e[e.WebGL = 1] = "WebGL", e[e.WebGL2 = 2] = "WebGL2"
    }(we || (we = {})), function (e) {
        e[e.Play = 0] = "Play", e[e.Pause = 1] = "Pause", e[e.Seeked = 2] = "Seeked", e[e.VolumeChange = 3] = "VolumeChange"
    }(Ee || (Ee = {})), function (e) {
        e.Start = "start", e.Pause = "pause", e.Resume = "resume", e.Resize = "resize", e.Finish = "finish", e.FullsnapshotRebuilded = "fullsnapshot-rebuilded", e.LoadStylesheetStart = "load-stylesheet-start", e.LoadStylesheetEnd = "load-stylesheet-end", e.SkipStart = "skip-start", e.SkipEnd = "skip-end", e.MouseInteraction = "mouse-interaction", e.EventCast = "event-cast", e.CustomEvent = "custom-event", e.Flush = "flush", e.StateChange = "state-change", e.PlayBack = "play-back"
    }(Te || (Te = {}));
    for (var xe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", De = "undefined" == typeof Uint8Array ? [] : new Uint8Array(256), Re = 0; Re < xe.length; Re++) De[xe.charCodeAt(Re)] = Re;
    var Me = null;
    try {
        var ke = "undefined" != typeof module && "function" == typeof module.require && module.require("worker_threads") || "function" == typeof __non_webpack_require__ && __non_webpack_require__("worker_threads") || "function" == typeof require && require("worker_threads");
        Me = ke.Worker
    } catch (en) {
    }

    function Fe(e, t, n) {
        var i = void 0 === t ? null : t, o = function (e, t) {
                return Buffer.from(e, "base64").toString(t ? "utf16" : "utf8")
            }(e, void 0 !== n && n), r = o.indexOf("\n", 10) + 1,
            s = o.substring(r) + (i ? "//# sourceMappingURL=" + i : "");
        return function (e) {
            return new Me(s, Object.assign({}, e, {eval: !0}))
        }
    }

    var Oe, Be, Le, _e,
        Ve = "[object process]" === Object.prototype.toString.call("undefined" != typeof process ? process : 0);
    Oe = "Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwooZnVuY3Rpb24gKCkgewogICAgJ3VzZSBzdHJpY3QnOwoKICAgIC8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKg0KICAgIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLg0KDQogICAgUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55DQogICAgcHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLg0KDQogICAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEICJBUyBJUyIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEgNCiAgICBSRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkNCiAgICBBTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsDQogICAgSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NDQogICAgTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1INCiAgICBPVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SDQogICAgUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS4NCiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqLw0KDQogICAgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikgew0KICAgICAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH0NCiAgICAgICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7DQogICAgICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9DQogICAgICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvclsidGhyb3ciXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9DQogICAgICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfQ0KICAgICAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpOw0KICAgICAgICB9KTsNCiAgICB9CgogICAgLyoKICAgICAqIGJhc2U2NC1hcnJheWJ1ZmZlciAxLjAuMSA8aHR0cHM6Ly9naXRodWIuY29tL25pa2xhc3ZoL2Jhc2U2NC1hcnJheWJ1ZmZlcj4KICAgICAqIENvcHlyaWdodCAoYykgMjAyMSBOaWtsYXMgdm9uIEhlcnR6ZW4gPGh0dHBzOi8vaGVydHplbi5jb20+CiAgICAgKiBSZWxlYXNlZCB1bmRlciBNSVQgTGljZW5zZQogICAgICovCiAgICB2YXIgY2hhcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7CiAgICAvLyBVc2UgYSBsb29rdXAgdGFibGUgdG8gZmluZCB0aGUgaW5kZXguCiAgICB2YXIgbG9va3VwID0gdHlwZW9mIFVpbnQ4QXJyYXkgPT09ICd1bmRlZmluZWQnID8gW10gOiBuZXcgVWludDhBcnJheSgyNTYpOwogICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGFycy5sZW5ndGg7IGkrKykgewogICAgICAgIGxvb2t1cFtjaGFycy5jaGFyQ29kZUF0KGkpXSA9IGk7CiAgICB9CiAgICB2YXIgZW5jb2RlID0gZnVuY3Rpb24gKGFycmF5YnVmZmVyKSB7CiAgICAgICAgdmFyIGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXlidWZmZXIpLCBpLCBsZW4gPSBieXRlcy5sZW5ndGgsIGJhc2U2NCA9ICcnOwogICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkgKz0gMykgewogICAgICAgICAgICBiYXNlNjQgKz0gY2hhcnNbYnl0ZXNbaV0gPj4gMl07CiAgICAgICAgICAgIGJhc2U2NCArPSBjaGFyc1soKGJ5dGVzW2ldICYgMykgPDwgNCkgfCAoYnl0ZXNbaSArIDFdID4+IDQpXTsKICAgICAgICAgICAgYmFzZTY0ICs9IGNoYXJzWygoYnl0ZXNbaSArIDFdICYgMTUpIDw8IDIpIHwgKGJ5dGVzW2kgKyAyXSA+PiA2KV07CiAgICAgICAgICAgIGJhc2U2NCArPSBjaGFyc1tieXRlc1tpICsgMl0gJiA2M107CiAgICAgICAgfQogICAgICAgIGlmIChsZW4gJSAzID09PSAyKSB7CiAgICAgICAgICAgIGJhc2U2NCA9IGJhc2U2NC5zdWJzdHJpbmcoMCwgYmFzZTY0Lmxlbmd0aCAtIDEpICsgJz0nOwogICAgICAgIH0KICAgICAgICBlbHNlIGlmIChsZW4gJSAzID09PSAxKSB7CiAgICAgICAgICAgIGJhc2U2NCA9IGJhc2U2NC5zdWJzdHJpbmcoMCwgYmFzZTY0Lmxlbmd0aCAtIDIpICsgJz09JzsKICAgICAgICB9CiAgICAgICAgcmV0dXJuIGJhc2U2NDsKICAgIH07CgogICAgY29uc3QgbGFzdEJsb2JNYXAgPSBuZXcgTWFwKCk7DQogICAgY29uc3QgdHJhbnNwYXJlbnRCbG9iTWFwID0gbmV3IE1hcCgpOw0KICAgIGZ1bmN0aW9uIGdldFRyYW5zcGFyZW50QmxvYkZvcih3aWR0aCwgaGVpZ2h0KSB7DQogICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7DQogICAgICAgICAgICBjb25zdCBpZCA9IGAke3dpZHRofS0ke2hlaWdodH1gOw0KICAgICAgICAgICAgaWYgKHRyYW5zcGFyZW50QmxvYk1hcC5oYXMoaWQpKQ0KICAgICAgICAgICAgICAgIHJldHVybiB0cmFuc3BhcmVudEJsb2JNYXAuZ2V0KGlkKTsNCiAgICAgICAgICAgIGNvbnN0IG9mZnNjcmVlbiA9IG5ldyBPZmZzY3JlZW5DYW52YXMod2lkdGgsIGhlaWdodCk7DQogICAgICAgICAgICBvZmZzY3JlZW4uZ2V0Q29udGV4dCgnMmQnKTsNCiAgICAgICAgICAgIGNvbnN0IGJsb2IgPSB5aWVsZCBvZmZzY3JlZW4uY29udmVydFRvQmxvYigpOw0KICAgICAgICAgICAgY29uc3QgYXJyYXlCdWZmZXIgPSB5aWVsZCBibG9iLmFycmF5QnVmZmVyKCk7DQogICAgICAgICAgICBjb25zdCBiYXNlNjQgPSBlbmNvZGUoYXJyYXlCdWZmZXIpOw0KICAgICAgICAgICAgdHJhbnNwYXJlbnRCbG9iTWFwLnNldChpZCwgYmFzZTY0KTsNCiAgICAgICAgICAgIHJldHVybiBiYXNlNjQ7DQogICAgICAgIH0pOw0KICAgIH0NCiAgICBjb25zdCB3b3JrZXIgPSBzZWxmOw0KICAgIHdvcmtlci5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZSkgew0KICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkgew0KICAgICAgICAgICAgaWYgKCEoJ09mZnNjcmVlbkNhbnZhcycgaW4gZ2xvYmFsVGhpcykpDQogICAgICAgICAgICAgICAgcmV0dXJuIHdvcmtlci5wb3N0TWVzc2FnZSh7IGlkOiBlLmRhdGEuaWQgfSk7DQogICAgICAgICAgICBjb25zdCB7IGlkLCBiaXRtYXAsIHdpZHRoLCBoZWlnaHQgfSA9IGUuZGF0YTsNCiAgICAgICAgICAgIGNvbnN0IHRyYW5zcGFyZW50QmFzZTY0ID0gZ2V0VHJhbnNwYXJlbnRCbG9iRm9yKHdpZHRoLCBoZWlnaHQpOw0KICAgICAgICAgICAgY29uc3Qgb2Zmc2NyZWVuID0gbmV3IE9mZnNjcmVlbkNhbnZhcyh3aWR0aCwgaGVpZ2h0KTsNCiAgICAgICAgICAgIGNvbnN0IGN0eCA9IG9mZnNjcmVlbi5nZXRDb250ZXh0KCcyZCcpOw0KICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShiaXRtYXAsIDAsIDApOw0KICAgICAgICAgICAgYml0bWFwLmNsb3NlKCk7DQogICAgICAgICAgICBjb25zdCBibG9iID0geWllbGQgb2Zmc2NyZWVuLmNvbnZlcnRUb0Jsb2IoKTsNCiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBibG9iLnR5cGU7DQogICAgICAgICAgICBjb25zdCBhcnJheUJ1ZmZlciA9IHlpZWxkIGJsb2IuYXJyYXlCdWZmZXIoKTsNCiAgICAgICAgICAgIGNvbnN0IGJhc2U2NCA9IGVuY29kZShhcnJheUJ1ZmZlcik7DQogICAgICAgICAgICBpZiAoIWxhc3RCbG9iTWFwLmhhcyhpZCkgJiYgKHlpZWxkIHRyYW5zcGFyZW50QmFzZTY0KSA9PT0gYmFzZTY0KSB7DQogICAgICAgICAgICAgICAgbGFzdEJsb2JNYXAuc2V0KGlkLCBiYXNlNjQpOw0KICAgICAgICAgICAgICAgIHJldHVybiB3b3JrZXIucG9zdE1lc3NhZ2UoeyBpZCB9KTsNCiAgICAgICAgICAgIH0NCiAgICAgICAgICAgIGlmIChsYXN0QmxvYk1hcC5nZXQoaWQpID09PSBiYXNlNjQpDQogICAgICAgICAgICAgICAgcmV0dXJuIHdvcmtlci5wb3N0TWVzc2FnZSh7IGlkIH0pOw0KICAgICAgICAgICAgd29ya2VyLnBvc3RNZXNzYWdlKHsNCiAgICAgICAgICAgICAgICBpZCwNCiAgICAgICAgICAgICAgICB0eXBlLA0KICAgICAgICAgICAgICAgIGJhc2U2NCwNCiAgICAgICAgICAgICAgICB3aWR0aCwNCiAgICAgICAgICAgICAgICBoZWlnaHQsDQogICAgICAgICAgICB9KTsNCiAgICAgICAgICAgIGxhc3RCbG9iTWFwLnNldChpZCwgYmFzZTY0KTsNCiAgICAgICAgfSk7DQogICAgfTsKCn0pKCk7Cgo=", Be = null, Le = !1, Ve ? Fe(Oe, Be, Le) : function (e, t, n) {
        var i
    }(Oe, Be, Le), q(), function (e) {
        e[e.Document = 0] = "Document", e[e.DocumentType = 1] = "DocumentType", e[e.Element = 2] = "Element", e[e.Text = 3] = "Text", e[e.CDATA = 4] = "CDATA", e[e.Comment = 5] = "Comment"
    }(_e || (_e = {}));
    var Ge = function () {
        function e() {
            this.idNodeMap = new Map, this.nodeMetaMap = new WeakMap
        }

        return e.prototype.getId = function (e) {
            var t;
            if (!e) return -1;
            var n = null === (t = this.getMeta(e)) || void 0 === t ? void 0 : t.id;
            return null != n ? n : -1
        }, e.prototype.getNode = function (e) {
            return this.idNodeMap.get(e) || null
        }, e.prototype.getIds = function () {
            return Array.from(this.idNodeMap.keys())
        }, e.prototype.getMeta = function (e) {
            return this.nodeMetaMap.get(e) || null
        }, e.prototype.removeNodeFromMap = function (e) {
            var t = this, n = this.getId(e);
            this.idNodeMap.delete(n), e.childNodes && e.childNodes.forEach((function (e) {
                return t.removeNodeFromMap(e)
            }))
        }, e.prototype.has = function (e) {
            return this.idNodeMap.has(e)
        }, e.prototype.hasNode = function (e) {
            return this.nodeMetaMap.has(e)
        }, e.prototype.add = function (e, t) {
            var n = t.id;
            this.idNodeMap.set(n, e), this.nodeMetaMap.set(e, t)
        }, e.prototype.replace = function (e, t) {
            this.idNodeMap.set(e, t)
        }, e.prototype.reset = function () {
            this.idNodeMap = new Map, this.nodeMetaMap = new WeakMap
        }, e
    }();

    function We(e) {
        const t = [];
        for (const n in e) {
            const i = e[n];
            if ("string" != typeof i) continue;
            const o = Ke(n);
            t.push(`${o}: ${i};`)
        }
        return t.join(" ")
    }

    const Ue = /-([a-z])/g, Ze = /^--[a-zA-Z0-9-]+$/,
        $e = e => Ze.test(e) ? e : e.replace(Ue, ((e, t) => t ? t.toUpperCase() : "")), Pe = /\B([A-Z])/g,
        Ke = e => e.replace(Pe, "-$1").toLowerCase();

    class Ye {
        constructor(...e) {
            this.childNodes = [], this.parentElement = null, this.parentNode = null, this.ELEMENT_NODE = qe.ELEMENT_NODE, this.TEXT_NODE = qe.TEXT_NODE
        }

        get firstChild() {
            return this.childNodes[0] || null
        }

        get lastChild() {
            return this.childNodes[this.childNodes.length - 1] || null
        }

        get nextSibling() {
            const e = this.parentNode;
            if (!e) return null;
            const t = e.childNodes, n = t.indexOf(this);
            return t[n + 1] || null
        }

        contains(e) {
            if (e === this) return !0;
            for (const t of this.childNodes) if (t.contains(e)) return !0;
            return !1
        }

        appendChild(e) {
            throw new Error("RRDomException: Failed to execute 'appendChild' on 'RRNode': This RRNode type does not support this method.")
        }

        insertBefore(e, t) {
            throw new Error("RRDomException: Failed to execute 'insertBefore' on 'RRNode': This RRNode type does not support this method.")
        }

        removeChild(e) {
            throw new Error("RRDomException: Failed to execute 'removeChild' on 'RRNode': This RRNode type does not support this method.")
        }

        toString() {
            return "RRNode"
        }
    }

    function Je(e) {
        return class extends e {
            constructor(e, t, n) {
                super(), this.nodeType = qe.DOCUMENT_TYPE_NODE, this.RRNodeType = _e.DocumentType, this.textContent = null, this.name = e, this.publicId = t, this.systemId = n, this.nodeName = e
            }

            toString() {
                return "RRDocumentType"
            }
        }
    }

    function Xe(e) {
        return class extends e {
            constructor(e) {
                super(), this.nodeType = qe.ELEMENT_NODE, this.RRNodeType = _e.Element, this.attributes = {}, this.shadowRoot = null, this.tagName = e.toUpperCase(), this.nodeName = e.toUpperCase()
            }

            get textContent() {
                let e = "";
                return this.childNodes.forEach((t => e += t.textContent)), e
            }

            set textContent(e) {
                this.childNodes = [this.ownerDocument.createTextNode(e)]
            }

            get classList() {
                return new Qe(this.attributes.class, (e => {
                    this.attributes.class = e
                }))
            }

            get id() {
                return this.attributes.id || ""
            }

            get className() {
                return this.attributes.class || ""
            }

            get style() {
                const e = this.attributes.style ? function (e) {
                    const t = {}, n = /:(.+)/;
                    return e.replace(/\/\*.*?\*\//g, "").split(/;(?![^(]*\))/g).forEach((function (e) {
                        if (e) {
                            const i = e.split(n);
                            i.length > 1 && (t[$e(i[0].trim())] = i[1].trim())
                        }
                    })), t
                }(this.attributes.style) : {}, t = /\B([A-Z])/g;
                return e.setProperty = (n, i, o) => {
                    if (t.test(n)) return;
                    const r = $e(n);
                    i ? e[r] = i : delete e[r], "important" === o && (e[r] += " !important"), this.attributes.style = We(e)
                }, e.removeProperty = n => {
                    if (t.test(n)) return "";
                    const i = $e(n), o = e[i] || "";
                    return delete e[i], this.attributes.style = We(e), o
                }, e
            }

            getAttribute(e) {
                return this.attributes[e] || null
            }

            setAttribute(e, t) {
                this.attributes[e] = t
            }

            setAttributeNS(e, t, n) {
                this.setAttribute(t, n)
            }

            removeAttribute(e) {
                delete this.attributes[e]
            }

            appendChild(e) {
                return this.childNodes.push(e), e.parentNode = this, e.parentElement = this, e
            }

            insertBefore(e, t) {
                if (null === t) return this.appendChild(e);
                const n = this.childNodes.indexOf(t);
                if (-1 == n) throw new Error("Failed to execute 'insertBefore' on 'RRNode': The RRNode before which the new node is to be inserted is not a child of this RRNode.");
                return this.childNodes.splice(n, 0, e), e.parentElement = this, e.parentNode = this, e
            }

            removeChild(e) {
                const t = this.childNodes.indexOf(e);
                if (-1 === t) throw new Error("Failed to execute 'removeChild' on 'RRElement': The RRNode to be removed is not a child of this RRNode.");
                return this.childNodes.splice(t, 1), e.parentElement = null, e.parentNode = null, e
            }

            attachShadow(e) {
                const t = this.ownerDocument.createElement("SHADOWROOT");
                return this.shadowRoot = t, t
            }

            dispatchEvent(e) {
                return !0
            }

            toString() {
                let e = "";
                for (const t in this.attributes) e += `${t}="${this.attributes[t]}" `;
                return `${this.tagName} ${e}`
            }
        }
    }

    function je(e) {
        return class extends e {
            constructor(e) {
                super(), this.nodeType = qe.TEXT_NODE, this.nodeName = "#text", this.RRNodeType = _e.Text, this.data = e
            }

            get textContent() {
                return this.data
            }

            set textContent(e) {
                this.data = e
            }

            toString() {
                return `RRText text=${JSON.stringify(this.data)}`
            }
        }
    }

    function He(e) {
        return class extends e {
            constructor(e) {
                super(), this.nodeType = qe.COMMENT_NODE, this.nodeName = "#comment", this.RRNodeType = _e.Comment, this.data = e
            }

            get textContent() {
                return this.data
            }

            set textContent(e) {
                this.data = e
            }

            toString() {
                return `RRComment text=${JSON.stringify(this.data)}`
            }
        }
    }

    function ze(e) {
        return class extends e {
            constructor(e) {
                super(), this.nodeName = "#cdata-section", this.nodeType = qe.CDATA_SECTION_NODE, this.RRNodeType = _e.CDATA, this.data = e
            }

            get textContent() {
                return this.data
            }

            set textContent(e) {
                this.data = e
            }

            toString() {
                return `RRCDATASection data=${JSON.stringify(this.data)}`
            }
        }
    }

    class Qe {
        constructor(e, t) {
            if (this.classes = [], this.add = (...e) => {
                for (const t of e) {
                    const e = String(t);
                    this.classes.indexOf(e) >= 0 || this.classes.push(e)
                }
                this.onChange && this.onChange(this.classes.join(" "))
            }, this.remove = (...e) => {
                this.classes = this.classes.filter((t => -1 === e.indexOf(t))), this.onChange && this.onChange(this.classes.join(" "))
            }, e) {
                const t = e.trim().split(/\s+/);
                this.classes.push(...t)
            }
            this.onChange = t
        }
    }

    var qe;
    !function (e) {
        e[e.PLACEHOLDER = 0] = "PLACEHOLDER", e[e.ELEMENT_NODE = 1] = "ELEMENT_NODE", e[e.ATTRIBUTE_NODE = 2] = "ATTRIBUTE_NODE", e[e.TEXT_NODE = 3] = "TEXT_NODE", e[e.CDATA_SECTION_NODE = 4] = "CDATA_SECTION_NODE", e[e.ENTITY_REFERENCE_NODE = 5] = "ENTITY_REFERENCE_NODE", e[e.ENTITY_NODE = 6] = "ENTITY_NODE", e[e.PROCESSING_INSTRUCTION_NODE = 7] = "PROCESSING_INSTRUCTION_NODE", e[e.COMMENT_NODE = 8] = "COMMENT_NODE", e[e.DOCUMENT_NODE = 9] = "DOCUMENT_NODE", e[e.DOCUMENT_TYPE_NODE = 10] = "DOCUMENT_TYPE_NODE", e[e.DOCUMENT_FRAGMENT_NODE = 11] = "DOCUMENT_FRAGMENT_NODE"
    }(qe || (qe = {}));
    const et = {
        svg: "http://www.w3.org/2000/svg",
        "xlink:href": "http://www.w3.org/1999/xlink",
        xmlns: "http://www.w3.org/2000/xmlns/"
    }, tt = {
        altglyph: "altGlyph",
        altglyphdef: "altGlyphDef",
        altglyphitem: "altGlyphItem",
        animatecolor: "animateColor",
        animatemotion: "animateMotion",
        animatetransform: "animateTransform",
        clippath: "clipPath",
        feblend: "feBlend",
        fecolormatrix: "feColorMatrix",
        fecomponenttransfer: "feComponentTransfer",
        fecomposite: "feComposite",
        feconvolvematrix: "feConvolveMatrix",
        fediffuselighting: "feDiffuseLighting",
        fedisplacementmap: "feDisplacementMap",
        fedistantlight: "feDistantLight",
        fedropshadow: "feDropShadow",
        feflood: "feFlood",
        fefunca: "feFuncA",
        fefuncb: "feFuncB",
        fefuncg: "feFuncG",
        fefuncr: "feFuncR",
        fegaussianblur: "feGaussianBlur",
        feimage: "feImage",
        femerge: "feMerge",
        femergenode: "feMergeNode",
        femorphology: "feMorphology",
        feoffset: "feOffset",
        fepointlight: "fePointLight",
        fespecularlighting: "feSpecularLighting",
        fespotlight: "feSpotLight",
        fetile: "feTile",
        feturbulence: "feTurbulence",
        foreignobject: "foreignObject",
        glyphref: "glyphRef",
        lineargradient: "linearGradient",
        radialgradient: "radialGradient"
    };

    function nt(e, t, n, i) {
        const o = e.childNodes, r = t.childNodes;
        i = i || t.mirror || t.ownerDocument.mirror, (o.length > 0 || r.length > 0) && it(Array.from(o), r, e, n, i);
        let s = null, a = null;
        switch (t.RRNodeType) {
            case _e.Document:
                a = t.scrollData;
                break;
            case _e.Element: {
                const o = e, r = t;
                switch (function (e, t, n) {
                    const i = e.attributes, o = t.attributes;
                    for (const i in o) {
                        const r = o[i], s = n.getMeta(t);
                        if (s && "isSVG" in s && s.isSVG && et[i]) e.setAttributeNS(et[i], i, r); else if ("CANVAS" === t.tagName && "rr_dataURL" === i) {
                            const t = document.createElement("img");
                            t.src = r, t.onload = () => {
                                const n = e.getContext("2d");
                                n && n.drawImage(t, 0, 0, t.width, t.height)
                            }
                        } else e.setAttribute(i, r)
                    }
                    for (const {name: t} of Array.from(i)) t in o || e.removeAttribute(t);
                    t.scrollLeft && (e.scrollLeft = t.scrollLeft), t.scrollTop && (e.scrollTop = t.scrollTop)
                }(o, r, i), a = r.scrollData, s = r.inputData, r.tagName) {
                    case"AUDIO":
                    case"VIDEO": {
                        const t = e, n = r;
                        void 0 !== n.paused && (n.paused ? t.pause() : t.play()), void 0 !== n.muted && (t.muted = n.muted), void 0 !== n.volume && (t.volume = n.volume), void 0 !== n.currentTime && (t.currentTime = n.currentTime);
                        break
                    }
                    case"CANVAS": {
                        const i = t;
                        if (null !== i.rr_dataURL) {
                            const e = document.createElement("img");
                            e.onload = () => {
                                const t = o.getContext("2d");
                                t && t.drawImage(e, 0, 0, e.width, e.height)
                            }, e.src = i.rr_dataURL
                        }
                        i.canvasMutations.forEach((t => n.applyCanvas(t.event, t.mutation, e)))
                    }
                        break;
                    case"STYLE":
                        !function (e, t) {
                            const n = e.sheet;
                            t.forEach((e => {
                                if (e.type === st.Insert) try {
                                    if (Array.isArray(e.index)) {
                                        const {positions: t, index: i} = at(e.index);
                                        rt(n.cssRules, t).insertRule(e.cssText, i)
                                    } else n.insertRule(e.cssText, e.index)
                                } catch (e) {
                                } else if (e.type === st.Remove) try {
                                    if (Array.isArray(e.index)) {
                                        const {positions: t, index: i} = at(e.index);
                                        rt(n.cssRules, t).deleteRule(i || 0)
                                    } else n.deleteRule(e.index)
                                } catch (e) {
                                } else if (e.type === st.SetProperty) {
                                    rt(n.cssRules, e.index).style.setProperty(e.property, e.value, e.priority)
                                } else if (e.type === st.RemoveProperty) {
                                    rt(n.cssRules, e.index).style.removeProperty(e.property)
                                }
                            }))
                        }(o, t.rules)
                }
                if (r.shadowRoot) {
                    o.shadowRoot || o.attachShadow({mode: "open"});
                    const e = o.shadowRoot.childNodes, t = r.shadowRoot.childNodes;
                    (e.length > 0 || t.length > 0) && it(Array.from(e), t, o.shadowRoot, n, i)
                }
                break
            }
            case _e.Text:
            case _e.Comment:
            case _e.CDATA:
                e.textContent !== t.data && (e.textContent = t.data)
        }
        if (a && n.applyScroll(a, !0), s && n.applyInput(s), "IFRAME" === t.nodeName) {
            const o = e.contentDocument, r = t;
            if (o) {
                const e = i.getMeta(r.contentDocument);
                e && n.mirror.add(o, Object.assign({}, e)), nt(o, r.contentDocument, n, i)
            }
        }
    }

    function it(e, t, n, i, o) {
        var r;
        let s, a, c = 0, l = e.length - 1, u = 0, d = t.length - 1, h = e[c], p = e[l], m = t[u], f = t[d];
        for (; c <= l && u <= d;) if (void 0 === h) h = e[++c]; else if (void 0 === p) p = e[--l]; else if (i.mirror.getId(h) === o.getId(m)) nt(h, m, i, o), h = e[++c], m = t[++u]; else if (i.mirror.getId(p) === o.getId(f)) nt(p, f, i, o), p = e[--l], f = t[--d]; else if (i.mirror.getId(h) === o.getId(f)) n.insertBefore(h, p.nextSibling), nt(h, f, i, o), h = e[++c], f = t[--d]; else if (i.mirror.getId(p) === o.getId(m)) n.insertBefore(p, h), nt(p, m, i, o), p = e[--l], m = t[++u]; else {
            if (!s) {
                s = {};
                for (let t = c; t <= l; t++) {
                    const n = e[t];
                    n && i.mirror.hasNode(n) && (s[i.mirror.getId(n)] = t)
                }
            }
            if (a = s[o.getId(m)], a) {
                const t = e[a];
                n.insertBefore(t, h), nt(t, m, i, o), e[a] = void 0
            } else {
                const t = ot(m, i.mirror, o);
                "#document" === n.nodeName && (null === (r = i.mirror.getMeta(t)) || void 0 === r ? void 0 : r.type) === _e.Element && n.documentElement && (n.removeChild(n.documentElement), e[c] = void 0, h = void 0), n.insertBefore(t, h || null), nt(t, m, i, o)
            }
            m = t[++u]
        }
        if (c > l) {
            const e = t[d + 1];
            let r = null;
            for (e && n.childNodes.forEach((t => {
                i.mirror.getId(t) === o.getId(e) && (r = t)
            })); u <= d; ++u) {
                const e = ot(t[u], i.mirror, o);
                n.insertBefore(e, r), nt(e, t[u], i, o)
            }
        } else if (u > d) for (; c <= l; c++) {
            const t = e[c];
            t && (n.removeChild(t), i.mirror.removeNodeFromMap(t))
        }
    }

    function ot(e, t, n) {
        let i = t.getNode(n.getId(e));
        const o = n.getMeta(e);
        if (null !== i) return i;
        switch (e.RRNodeType) {
            case _e.Document:
                i = new Document;
                break;
            case _e.DocumentType:
                i = document.implementation.createDocumentType(e.name, e.publicId, e.systemId);
                break;
            case _e.Element: {
                let t = e.tagName.toLowerCase();
                t = tt[t] || t, i = o && "isSVG" in o && (null == o ? void 0 : o.isSVG) ? document.createElementNS(et.svg, t) : document.createElement(e.tagName);
                break
            }
            case _e.Text:
                i = document.createTextNode(e.data);
                break;
            case _e.Comment:
                i = document.createComment(e.data);
                break;
            case _e.CDATA:
                i = document.createCDATASection(e.data)
        }
        return o && t.add(i, Object.assign({}, o)), i
    }

    function rt(e, t) {
        const n = e[t[0]];
        return 1 === t.length ? n : rt(n.cssRules[t[1]].cssRules, t.slice(2))
    }

    var st;

    function at(e) {
        const t = [...e], n = t.pop();
        return {positions: t, index: n}
    }

    !function (e) {
        e[e.Insert = 0] = "Insert", e[e.Remove = 1] = "Remove", e[e.Snapshot = 2] = "Snapshot", e[e.SetProperty = 3] = "SetProperty", e[e.RemoveProperty = 4] = "RemoveProperty"
    }(st || (st = {}));

    class ct extends (function (e) {
        return class t extends e {
            constructor() {
                super(...arguments), this.nodeType = qe.DOCUMENT_NODE, this.nodeName = "#document", this.compatMode = "CSS1Compat", this.RRNodeType = _e.Document, this.textContent = null
            }

            get documentElement() {
                return this.childNodes.find((e => e.RRNodeType === _e.Element && "HTML" === e.tagName)) || null
            }

            get body() {
                var e;
                return (null === (e = this.documentElement) || void 0 === e ? void 0 : e.childNodes.find((e => e.RRNodeType === _e.Element && "BODY" === e.tagName))) || null
            }

            get head() {
                var e;
                return (null === (e = this.documentElement) || void 0 === e ? void 0 : e.childNodes.find((e => e.RRNodeType === _e.Element && "HEAD" === e.tagName))) || null
            }

            get implementation() {
                return this
            }

            get firstElementChild() {
                return this.documentElement
            }

            appendChild(e) {
                const t = e.RRNodeType;
                if ((t === _e.Element || t === _e.DocumentType) && this.childNodes.some((e => e.RRNodeType === t))) throw new Error(`RRDomException: Failed to execute 'appendChild' on 'RRNode': Only one ${t === _e.Element ? "RRElement" : "RRDoctype"} on RRDocument allowed.`);
                return e.parentElement = null, e.parentNode = this, this.childNodes.push(e), e
            }

            insertBefore(e, t) {
                const n = e.RRNodeType;
                if ((n === _e.Element || n === _e.DocumentType) && this.childNodes.some((e => e.RRNodeType === n))) throw new Error(`RRDomException: Failed to execute 'insertBefore' on 'RRNode': Only one ${n === _e.Element ? "RRElement" : "RRDoctype"} on RRDocument allowed.`);
                if (null === t) return this.appendChild(e);
                const i = this.childNodes.indexOf(t);
                if (-1 == i) throw new Error("Failed to execute 'insertBefore' on 'RRNode': The RRNode before which the new node is to be inserted is not a child of this RRNode.");
                return this.childNodes.splice(i, 0, e), e.parentElement = null, e.parentNode = this, e
            }

            removeChild(e) {
                const t = this.childNodes.indexOf(e);
                if (-1 === t) throw new Error("Failed to execute 'removeChild' on 'RRDocument': The RRNode to be removed is not a child of this RRNode.");
                return this.childNodes.splice(t, 1), e.parentElement = null, e.parentNode = null, e
            }

            open() {
                this.childNodes = []
            }

            close() {
            }

            write(e) {
                let t;
                if ('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "">' === e ? t = "-//W3C//DTD XHTML 1.0 Transitional//EN" : '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "">' === e && (t = "-//W3C//DTD HTML 4.0 Transitional//EN"), t) {
                    const e = this.createDocumentType("html", t, "");
                    this.open(), this.appendChild(e)
                }
            }

            createDocument(e, n, i) {
                return new t
            }

            createDocumentType(e, t, n) {
                const i = new (Je(Ye))(e, t, n);
                return i.ownerDocument = this, i
            }

            createElement(e) {
                const t = new (Xe(Ye))(e);
                return t.ownerDocument = this, t
            }

            createElementNS(e, t) {
                return this.createElement(t)
            }

            createTextNode(e) {
                const t = new (je(Ye))(e);
                return t.ownerDocument = this, t
            }

            createComment(e) {
                const t = new (He(Ye))(e);
                return t.ownerDocument = this, t
            }

            createCDATASection(e) {
                const t = new (ze(Ye))(e);
                return t.ownerDocument = this, t
            }

            toString() {
                return "RRDocument"
            }
        }
    }(Ye)) {
        constructor(e) {
            super(), this._unserializedId = -1, this.mirror = new It, this.scrollData = null, e && (this.mirror = e)
        }

        get unserializedId() {
            return this._unserializedId--
        }

        createDocument(e, t, n) {
            return new ct
        }

        createDocumentType(e, t, n) {
            const i = new lt(e, t, n);
            return i.ownerDocument = this, i
        }

        createElement(e) {
            const t = e.toUpperCase();
            let n;
            switch (t) {
                case"AUDIO":
                case"VIDEO":
                    n = new dt(t);
                    break;
                case"IFRAME":
                    n = new mt(t, this.mirror);
                    break;
                case"CANVAS":
                    n = new ht(t);
                    break;
                case"STYLE":
                    n = new pt(t);
                    break;
                default:
                    n = new ut(t)
            }
            return n.ownerDocument = this, n
        }

        createComment(e) {
            const t = new gt(e);
            return t.ownerDocument = this, t
        }

        createCDATASection(e) {
            const t = new yt(e);
            return t.ownerDocument = this, t
        }

        createTextNode(e) {
            const t = new ft(e);
            return t.ownerDocument = this, t
        }

        destroyTree() {
            this.childNodes = [], this.mirror.reset()
        }

        open() {
            super.open(), this._unserializedId = -1
        }
    }

    const lt = Je(Ye);

    class ut extends (Xe(Ye)) {
        constructor() {
            super(...arguments), this.inputData = null, this.scrollData = null
        }
    }

    class dt extends (function (e) {
        return class extends e {
            attachShadow(e) {
                throw new Error("RRDomException: Failed to execute 'attachShadow' on 'RRElement': This RRElement does not support attachShadow")
            }

            play() {
                this.paused = !1
            }

            pause() {
                this.paused = !0
            }
        }
    }(ut)) {
    }

    class ht extends ut {
        constructor() {
            super(...arguments), this.rr_dataURL = null, this.canvasMutations = []
        }

        getContext() {
            return null
        }
    }

    class pt extends ut {
        constructor() {
            super(...arguments), this.rules = []
        }
    }

    class mt extends ut {
        constructor(e, t) {
            super(e), this.contentDocument = new ct, this.contentDocument.mirror = t
        }
    }

    const ft = je(Ye), gt = He(Ye), yt = ze(Ye);

    function vt(e, t, n, i) {
        let o;
        switch (e.nodeType) {
            case qe.DOCUMENT_NODE:
                i && "IFRAME" === i.nodeName ? o = i.contentDocument : (o = t, o.compatMode = e.compatMode);
                break;
            case qe.DOCUMENT_TYPE_NODE: {
                const n = e;
                o = t.createDocumentType(n.name, n.publicId, n.systemId);
                break
            }
            case qe.ELEMENT_NODE: {
                const n = e, i = function (e) {
                    return e instanceof HTMLFormElement ? "FORM" : e.tagName.toUpperCase()
                }(n);
                o = t.createElement(i);
                const r = o;
                for (const {name: e, value: t} of Array.from(n.attributes)) r.attributes[e] = t;
                n.scrollLeft && (r.scrollLeft = n.scrollLeft), n.scrollTop && (r.scrollTop = n.scrollTop);
                break
            }
            case qe.TEXT_NODE:
                o = t.createTextNode(e.textContent || "");
                break;
            case qe.CDATA_SECTION_NODE:
                o = t.createCDATASection(e.data);
                break;
            case qe.COMMENT_NODE:
                o = t.createComment(e.textContent || "");
                break;
            case qe.DOCUMENT_FRAGMENT_NODE:
                o = i.attachShadow({mode: "open"});
                break;
            default:
                return null
        }
        let r = n.getMeta(e);
        return t instanceof ct && (r || (r = bt(o, t.unserializedId), n.add(e, r)), t.mirror.add(o, Object.assign({}, r))), o
    }

    function Ct(e, t = function () {
        return new Ge
    }(), n = new ct) {
        return function e(i, o) {
            const r = vt(i, n, t, o);
            null !== r && ("IFRAME" !== (null == o ? void 0 : o.nodeName) && i.nodeType !== qe.DOCUMENT_FRAGMENT_NODE && (null == o || o.appendChild(r), r.parentNode = o, r.parentElement = o), "IFRAME" === i.nodeName ? e(i.contentDocument, r) : i.nodeType !== qe.DOCUMENT_NODE && i.nodeType !== qe.ELEMENT_NODE && i.nodeType !== qe.DOCUMENT_FRAGMENT_NODE || (i.nodeType === qe.ELEMENT_NODE && i.shadowRoot && e(i.shadowRoot, r), i.childNodes.forEach((t => e(t, r)))))
        }(e, null), n
    }

    class It {
        constructor() {
            this.idNodeMap = new Map, this.nodeMetaMap = new WeakMap
        }

        getId(e) {
            var t;
            if (!e) return -1;
            const n = null === (t = this.getMeta(e)) || void 0 === t ? void 0 : t.id;
            return null != n ? n : -1
        }

        getNode(e) {
            return this.idNodeMap.get(e) || null
        }

        getIds() {
            return Array.from(this.idNodeMap.keys())
        }

        getMeta(e) {
            return this.nodeMetaMap.get(e) || null
        }

        removeNodeFromMap(e) {
            const t = this.getId(e);
            this.idNodeMap.delete(t), e.childNodes && e.childNodes.forEach((e => this.removeNodeFromMap(e)))
        }

        has(e) {
            return this.idNodeMap.has(e)
        }

        hasNode(e) {
            return this.nodeMetaMap.has(e)
        }

        add(e, t) {
            const n = t.id;
            this.idNodeMap.set(n, e), this.nodeMetaMap.set(e, t)
        }

        replace(e, t) {
            this.idNodeMap.set(e, t)
        }

        reset() {
            this.idNodeMap = new Map, this.nodeMetaMap = new WeakMap
        }
    }

    function bt(e, t) {
        switch (e.RRNodeType) {
            case _e.Document:
                return {id: t, type: e.RRNodeType, childNodes: []};
            case _e.DocumentType: {
                const n = e;
                return {id: t, type: e.RRNodeType, name: n.name, publicId: n.publicId, systemId: n.systemId}
            }
            case _e.Element:
                return {id: t, type: e.RRNodeType, tagName: e.tagName.toLowerCase(), attributes: {}, childNodes: []};
            case _e.Text:
            case _e.Comment:
                return {id: t, type: e.RRNodeType, textContent: e.textContent || ""};
            case _e.CDATA:
                return {id: t, type: e.RRNodeType, textContent: ""}
        }
    }

    var Nt = Uint8Array, At = Uint16Array, wt = Uint32Array,
        Et = new Nt([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0]),
        Tt = new Nt([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0]),
        St = new Nt([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), xt = function (e, t) {
            for (var n = new At(31), i = 0; i < 31; ++i) n[i] = t += 1 << e[i - 1];
            var o = new wt(n[30]);
            for (i = 1; i < 30; ++i) for (var r = n[i]; r < n[i + 1]; ++r) o[r] = r - n[i] << 5 | i;
            return [n, o]
        }, Dt = xt(Et, 2), Rt = Dt[0], Mt = Dt[1];
    Rt[28] = 258, Mt[258] = 28;
    for (var kt = xt(Tt, 0)[0], Ft = new At(32768), Ot = 0; Ot < 32768; ++Ot) {
        var Bt = (43690 & Ot) >>> 1 | (21845 & Ot) << 1;
        Bt = (61680 & (Bt = (52428 & Bt) >>> 2 | (13107 & Bt) << 2)) >>> 4 | (3855 & Bt) << 4, Ft[Ot] = ((65280 & Bt) >>> 8 | (255 & Bt) << 8) >>> 1
    }
    var Lt = function (e, t, n) {
        for (var i = e.length, o = 0, r = new At(t); o < i; ++o) ++r[e[o] - 1];
        var s, a = new At(t);
        for (o = 0; o < t; ++o) a[o] = a[o - 1] + r[o - 1] << 1;
        if (n) {
            s = new At(1 << t);
            var c = 15 - t;
            for (o = 0; o < i; ++o) if (e[o]) for (var l = o << 4 | e[o], u = t - e[o], d = a[e[o] - 1]++ << u, h = d | (1 << u) - 1; d <= h; ++d) s[Ft[d] >>> c] = l
        } else for (s = new At(i), o = 0; o < i; ++o) s[o] = Ft[a[e[o] - 1]++] >>> 15 - e[o];
        return s
    }, _t = new Nt(288);
    for (Ot = 0; Ot < 144; ++Ot) _t[Ot] = 8;
    for (Ot = 144; Ot < 256; ++Ot) _t[Ot] = 9;
    for (Ot = 256; Ot < 280; ++Ot) _t[Ot] = 7;
    for (Ot = 280; Ot < 288; ++Ot) _t[Ot] = 8;
    var Vt = new Nt(32);
    for (Ot = 0; Ot < 32; ++Ot) Vt[Ot] = 5;
    var Gt = Lt(_t, 9, 1), Wt = Lt(Vt, 5, 1), Ut = function (e) {
        for (var t = e[0], n = 1; n < e.length; ++n) e[n] > t && (t = e[n]);
        return t
    }, Zt = function (e, t, n) {
        var i = t / 8 >> 0;
        return (e[i] | e[i + 1] << 8) >>> (7 & t) & n
    }, $t = function (e, t) {
        var n = t / 8 >> 0;
        return (e[n] | e[n + 1] << 8 | e[n + 2] << 16) >>> (7 & t)
    }, Pt = function (e, t, n) {
        (null == t || t < 0) && (t = 0), (null == n || n > e.length) && (n = e.length);
        var i = new (e instanceof At ? At : e instanceof wt ? wt : Nt)(n - t);
        return i.set(e.subarray(t, n)), i
    };

    function Kt(e, t) {
        return function (e, t, n) {
            var i = e.length, o = !t || n, r = !n || n.i;
            n || (n = {}), t || (t = new Nt(3 * i));
            var s, a = function (e) {
                var n = t.length;
                if (e > n) {
                    var i = new Nt(Math.max(2 * n, e));
                    i.set(t), t = i
                }
            }, c = n.f || 0, l = n.p || 0, u = n.b || 0, d = n.l, h = n.d, p = n.m, m = n.n, f = 8 * i;
            do {
                if (!d) {
                    n.f = c = Zt(e, l, 1);
                    var g = Zt(e, l + 1, 3);
                    if (l += 3, !g) {
                        var y = e[(x = ((s = l) / 8 >> 0) + (7 & s && 1) + 4) - 4] | e[x - 3] << 8, v = x + y;
                        if (v > i) {
                            if (r) throw"unexpected EOF";
                            break
                        }
                        o && a(u + y), t.set(e.subarray(x, v), u), n.b = u += y, n.p = l = 8 * v;
                        continue
                    }
                    if (1 == g) d = Gt, h = Wt, p = 9, m = 5; else {
                        if (2 != g) throw"invalid block type";
                        var C = Zt(e, l, 31) + 257, I = Zt(e, l + 10, 15) + 4, b = C + Zt(e, l + 5, 31) + 1;
                        l += 14;
                        for (var N = new Nt(b), A = new Nt(19), w = 0; w < I; ++w) A[St[w]] = Zt(e, l + 3 * w, 7);
                        l += 3 * I;
                        var E = Ut(A), T = (1 << E) - 1;
                        if (!r && l + b * (E + 7) > f) break;
                        var S = Lt(A, E, 1);
                        for (w = 0; w < b;) {
                            var x, D = S[Zt(e, l, T)];
                            if (l += 15 & D, (x = D >>> 4) < 16) N[w++] = x; else {
                                var R = 0, M = 0;
                                for (16 == x ? (M = 3 + Zt(e, l, 3), l += 2, R = N[w - 1]) : 17 == x ? (M = 3 + Zt(e, l, 7), l += 3) : 18 == x && (M = 11 + Zt(e, l, 127), l += 7); M--;) N[w++] = R
                            }
                        }
                        var k = N.subarray(0, C), F = N.subarray(C);
                        p = Ut(k), m = Ut(F), d = Lt(k, p, 1), h = Lt(F, m, 1)
                    }
                    if (l > f) throw"unexpected EOF"
                }
                o && a(u + 131072);
                for (var O = (1 << p) - 1, B = (1 << m) - 1, L = p + m + 18; r || l + L < f;) {
                    var _ = (R = d[$t(e, l) & O]) >>> 4;
                    if ((l += 15 & R) > f) throw"unexpected EOF";
                    if (!R) throw"invalid length/literal";
                    if (_ < 256) t[u++] = _; else {
                        if (256 == _) {
                            d = null;
                            break
                        }
                        var V = _ - 254;
                        if (_ > 264) {
                            var G = Et[w = _ - 257];
                            V = Zt(e, l, (1 << G) - 1) + Rt[w], l += G
                        }
                        var W = h[$t(e, l) & B], U = W >>> 4;
                        if (!W) throw"invalid distance";
                        if (l += 15 & W, F = kt[U], U > 3 && (G = Tt[U], F += $t(e, l) & (1 << G) - 1, l += G), l > f) throw"unexpected EOF";
                        o && a(u + 131072);
                        for (var Z = u + V; u < Z; u += 4) t[u] = t[u - F], t[u + 1] = t[u + 1 - F], t[u + 2] = t[u + 2 - F], t[u + 3] = t[u + 3 - F];
                        u = Z
                    }
                }
                n.l = d, n.p = l, n.b = u, d && (c = 1, n.m = p, n.d = h, n.n = m)
            } while (!c);
            return u == t.length ? t : Pt(t, 0, u)
        }((function (e) {
            if (8 != (15 & e[0]) || e[0] >>> 4 > 7 || (e[0] << 8 | e[1]) % 31) throw"invalid zlib data";
            if (32 & e[1]) throw"invalid zlib data: preset dictionaries not supported"
        }(e), e.subarray(2, -4)), t)
    }

    const Yt = e => {
        if ("string" != typeof e) return e;
        try {
            const t = JSON.parse(e);
            if (t.timestamp) return t
        } catch (e) {
        }
        try {
            const t = JSON.parse(function (e, t) {
                var n = "";
                if (!t && "undefined" != typeof TextDecoder) return (new TextDecoder).decode(e);
                for (var i = 0; i < e.length;) {
                    var o = e[i++];
                    o < 128 || t ? n += String.fromCharCode(o) : o < 224 ? n += String.fromCharCode((31 & o) << 6 | 63 & e[i++]) : o < 240 ? n += String.fromCharCode((15 & o) << 12 | (63 & e[i++]) << 6 | 63 & e[i++]) : (o = ((15 & o) << 18 | (63 & e[i++]) << 12 | (63 & e[i++]) << 6 | 63 & e[i++]) - 65536, n += String.fromCharCode(55296 | o >> 10, 56320 | 1023 & o))
                }
                return n
            }(Kt(function (e, t) {
                var n = e.length;
                if (!t && "undefined" != typeof TextEncoder) return (new TextEncoder).encode(e);
                for (var i = new Nt(e.length + (e.length >>> 1)), o = 0, r = function (e) {
                    i[o++] = e
                }, s = 0; s < n; ++s) {
                    if (o + 5 > i.length) {
                        var a = new Nt(o + 8 + (n - s << 1));
                        a.set(i), i = a
                    }
                    var c = e.charCodeAt(s);
                    c < 128 || t ? r(c) : c < 2048 ? (r(192 | c >>> 6), r(128 | 63 & c)) : c > 55295 && c < 57344 ? (r(240 | (c = 65536 + (1047552 & c) | 1023 & e.charCodeAt(++s)) >>> 18), r(128 | c >>> 12 & 63), r(128 | c >>> 6 & 63), r(128 | 63 & c)) : (r(224 | c >>> 12), r(128 | c >>> 6 & 63), r(128 | 63 & c))
                }
                return Pt(i, 0, o)
            }(e, !0))));
            if ("v1" === t.v) return t;
            throw new Error(`These events were packed with packer ${t.v} which is incompatible with current packer v1.`)
        } catch (e) {
            throw console.error(e), new Error("Unknown data format.")
        }
    };

    function Jt(e) {
        return {
            all: e = e || new Map, on: function (t, n) {
                var i = e.get(t);
                i ? i.push(n) : e.set(t, [n])
            }, off: function (t, n) {
                var i = e.get(t);
                i && (n ? i.splice(i.indexOf(n) >>> 0, 1) : e.set(t, []))
            }, emit: function (t, n) {
                var i = e.get(t);
                i && i.slice().map((function (e) {
                    e(n)
                })), (i = e.get("*")) && i.slice().map((function (e) {
                    e(t, n)
                }))
            }
        }
    }

    var Xt, jt = Object.freeze({__proto__: null, default: Jt});

    function Ht(e = window, t = document) {
        if ("scrollBehavior" in t.documentElement.style && !0 !== e.__forceSmoothScrollPolyfill__) return;
        const n = e.HTMLElement || e.Element, i = {
            scroll: e.scroll || e.scrollTo,
            scrollBy: e.scrollBy,
            elementScroll: n.prototype.scroll || a,
            scrollIntoView: n.prototype.scrollIntoView
        }, o = e.performance && e.performance.now ? e.performance.now.bind(e.performance) : Date.now;
        const r = (s = e.navigator.userAgent, new RegExp(["MSIE ", "Trident/", "Edge/"].join("|")).test(s) ? 1 : 0);
        var s;

        function a(e, t) {
            this.scrollLeft = e, this.scrollTop = t
        }

        function c(e) {
            if (null === e || "object" != typeof e || void 0 === e.behavior || "auto" === e.behavior || "instant" === e.behavior) return !0;
            if ("object" == typeof e && "smooth" === e.behavior) return !1;
            throw new TypeError("behavior member of ScrollOptions " + e.behavior + " is not a valid value for enumeration ScrollBehavior.")
        }

        function l(e, t) {
            return "Y" === t ? e.clientHeight + r < e.scrollHeight : "X" === t ? e.clientWidth + r < e.scrollWidth : void 0
        }

        function u(t, n) {
            const i = e.getComputedStyle(t, null)["overflow" + n];
            return "auto" === i || "scroll" === i
        }

        function d(e) {
            const t = l(e, "Y") && u(e, "Y"), n = l(e, "X") && u(e, "X");
            return t || n
        }

        function h(e) {
            for (; e !== t.body && !1 === d(e);) e = e.parentNode || e.host;
            return e
        }

        function p(t) {
            let n, i, r, s = (o() - t.startTime) / 468;
            var a;
            s = s > 1 ? 1 : s, a = s, n = .5 * (1 - Math.cos(Math.PI * a)), i = t.startX + (t.x - t.startX) * n, r = t.startY + (t.y - t.startY) * n, t.method.call(t.scrollable, i, r), i === t.x && r === t.y || e.requestAnimationFrame(p.bind(e, t))
        }

        function m(n, r, s) {
            let c, l, u, d;
            const h = o();
            n === t.body ? (c = e, l = e.scrollX || e.pageXOffset, u = e.scrollY || e.pageYOffset, d = i.scroll) : (c = n, l = n.scrollLeft, u = n.scrollTop, d = a), p({
                scrollable: c,
                method: d,
                startTime: h,
                startX: l,
                startY: u,
                x: r,
                y: s
            })
        }

        e.scroll = e.scrollTo = function () {
            void 0 !== arguments[0] && (!0 !== c(arguments[0]) ? m.call(e, t.body, void 0 !== arguments[0].left ? ~~arguments[0].left : e.scrollX || e.pageXOffset, void 0 !== arguments[0].top ? ~~arguments[0].top : e.scrollY || e.pageYOffset) : i.scroll.call(e, void 0 !== arguments[0].left ? arguments[0].left : "object" != typeof arguments[0] ? arguments[0] : e.scrollX || e.pageXOffset, void 0 !== arguments[0].top ? arguments[0].top : void 0 !== arguments[1] ? arguments[1] : e.scrollY || e.pageYOffset))
        }, e.scrollBy = function () {
            void 0 !== arguments[0] && (c(arguments[0]) ? i.scrollBy.call(e, void 0 !== arguments[0].left ? arguments[0].left : "object" != typeof arguments[0] ? arguments[0] : 0, void 0 !== arguments[0].top ? arguments[0].top : void 0 !== arguments[1] ? arguments[1] : 0) : m.call(e, t.body, ~~arguments[0].left + (e.scrollX || e.pageXOffset), ~~arguments[0].top + (e.scrollY || e.pageYOffset)))
        }, n.prototype.scroll = n.prototype.scrollTo = function () {
            if (void 0 === arguments[0]) return;
            if (!0 === c(arguments[0])) {
                if ("number" == typeof arguments[0] && void 0 === arguments[1]) throw new SyntaxError("Value could not be converted");
                return void i.elementScroll.call(this, void 0 !== arguments[0].left ? ~~arguments[0].left : "object" != typeof arguments[0] ? ~~arguments[0] : this.scrollLeft, void 0 !== arguments[0].top ? ~~arguments[0].top : void 0 !== arguments[1] ? ~~arguments[1] : this.scrollTop)
            }
            const e = arguments[0].left, t = arguments[0].top;
            m.call(this, this, void 0 === e ? this.scrollLeft : ~~e, void 0 === t ? this.scrollTop : ~~t)
        }, n.prototype.scrollBy = function () {
            void 0 !== arguments[0] && (!0 !== c(arguments[0]) ? this.scroll({
                left: ~~arguments[0].left + this.scrollLeft,
                top: ~~arguments[0].top + this.scrollTop,
                behavior: arguments[0].behavior
            }) : i.elementScroll.call(this, void 0 !== arguments[0].left ? ~~arguments[0].left + this.scrollLeft : ~~arguments[0] + this.scrollLeft, void 0 !== arguments[0].top ? ~~arguments[0].top + this.scrollTop : ~~arguments[1] + this.scrollTop))
        }, n.prototype.scrollIntoView = function () {
            if (!0 === c(arguments[0])) return void i.scrollIntoView.call(this, void 0 === arguments[0] || arguments[0]);
            const n = h(this), o = n.getBoundingClientRect(), r = this.getBoundingClientRect();
            n !== t.body ? (m.call(this, n, n.scrollLeft + r.left - o.left, n.scrollTop + r.top - o.top), "fixed" !== e.getComputedStyle(n).position && e.scrollBy({
                left: o.left,
                top: o.top,
                behavior: "smooth"
            })) : e.scrollBy({left: r.left, top: r.top, behavior: "smooth"})
        }
    }

    class zt {
        constructor(e = [], t) {
            this.timeOffset = 0, this.raf = null, this.actions = e, this.speed = t
        }

        addAction(e) {
            const t = this.findActionIndex(e);
            this.actions.splice(t, 0, e)
        }

        addActions(e) {
            this.actions = this.actions.concat(e)
        }

        start() {
            this.timeOffset = 0;
            let e = performance.now();
            const {actions: t} = this, n = () => {
                const i = performance.now();
                for (this.timeOffset += (i - e) * this.speed, e = i; t.length;) {
                    const e = t[0];
                    if (!(this.timeOffset >= e.delay)) break;
                    t.shift(), e.doAction()
                }
                (t.length > 0 || this.liveMode) && (this.raf = requestAnimationFrame(n))
            };
            this.raf = requestAnimationFrame(n)
        }

        clear() {
            this.raf && (cancelAnimationFrame(this.raf), this.raf = null), this.actions.length = 0
        }

        setSpeed(e) {
            this.speed = e
        }

        toggleLiveMode(e) {
            this.liveMode = e
        }

        isActive() {
            return null !== this.raf
        }

        findActionIndex(e) {
            let t = 0, n = this.actions.length - 1;
            for (; t <= n;) {
                const i = Math.floor((t + n) / 2);
                if (this.actions[i].delay < e.delay) t = i + 1; else {
                    if (!(this.actions[i].delay > e.delay)) return i + 1;
                    n = i - 1
                }
            }
            return t
        }
    }

    function Qt(e, t) {
        if (e.type === be.IncrementalSnapshot && e.data.source === Ne.MouseMove) {
            const n = e.data.positions[0].timeOffset, i = e.timestamp + n;
            return e.delay = i - t, i - t
        }
        return e.delay = e.timestamp - t, e.delay
    }

    /*! *****************************************************************************
        Copyright (c) Microsoft Corporation.

        Permission to use, copy, modify, and/or distribute this software for any
        purpose with or without fee is hereby granted.

        THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
        REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
        AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
        INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
        LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
        OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
        PERFORMANCE OF THIS SOFTWARE.
        ***************************************************************************** */
    function qt(e, t) {
        var n = "function" == typeof Symbol && e[Symbol.iterator];
        if (!n) return e;
        var i, o, r = n.call(e), s = [];
        try {
            for (; (void 0 === t || t-- > 0) && !(i = r.next()).done;) s.push(i.value)
        } catch (e) {
            o = {error: e}
        } finally {
            try {
                i && !i.done && (n = r.return) && n.call(r)
            } finally {
                if (o) throw o.error
            }
        }
        return s
    }

    !function (e) {
        e[e.NotStarted = 0] = "NotStarted", e[e.Running = 1] = "Running", e[e.Stopped = 2] = "Stopped"
    }(Xt || (Xt = {}));
    var en = {type: "xstate.init"};

    function tn(e) {
        return void 0 === e ? [] : [].concat(e)
    }

    function nn(e) {
        return {type: "xstate.assign", assignment: e}
    }

    function on(e, t) {
        return "string" == typeof (e = "string" == typeof e && t && t[e] ? t[e] : e) ? {type: e} : "function" == typeof e ? {
            type: e.name,
            exec: e
        } : e
    }

    function rn(e) {
        return function (t) {
            return e === t
        }
    }

    function sn(e) {
        return "string" == typeof e ? {type: e} : e
    }

    function an(e, t) {
        return {value: e, context: t, actions: [], changed: !1, matches: rn(e)}
    }

    function cn(e, t, n) {
        var i = t, o = !1;
        return [e.filter((function (e) {
            if ("xstate.assign" === e.type) {
                o = !0;
                var t = Object.assign({}, i);
                return "function" == typeof e.assignment ? t = e.assignment(i, n) : Object.keys(e.assignment).forEach((function (o) {
                    t[o] = "function" == typeof e.assignment[o] ? e.assignment[o](i, n) : e.assignment[o]
                })), i = t, !1
            }
            return !0
        })), i, o]
    }

    function ln(e, t) {
        void 0 === t && (t = {});
        var n = qt(cn(tn(e.states[e.initial].entry).map((function (e) {
            return on(e, t.actions)
        })), e.context, en), 2), i = n[0], o = n[1], r = {
            config: e,
            _options: t,
            initialState: {value: e.initial, actions: i, context: o, matches: rn(e.initial)},
            transition: function (t, n) {
                var i, o, s = "string" == typeof t ? {value: t, context: e.context} : t, a = s.value, c = s.context,
                    l = sn(n), u = e.states[a];
                if (u.on) {
                    var d = tn(u.on[l.type]);
                    try {
                        for (var h = function (e) {
                            var t = "function" == typeof Symbol && Symbol.iterator, n = t && e[t], i = 0;
                            if (n) return n.call(e);
                            if (e && "number" == typeof e.length) return {
                                next: function () {
                                    return e && i >= e.length && (e = void 0), {value: e && e[i++], done: !e}
                                }
                            };
                            throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.")
                        }(d), p = h.next(); !p.done; p = h.next()) {
                            var m = p.value;
                            if (void 0 === m) return an(a, c);
                            var f = "string" == typeof m ? {target: m} : m, g = f.target, y = f.actions,
                                v = void 0 === y ? [] : y, C = f.cond, I = void 0 === C ? function () {
                                    return !0
                                } : C, b = void 0 === g, N = null != g ? g : a, A = e.states[N];
                            if (I(c, l)) {
                                var w = qt(cn((b ? tn(v) : [].concat(u.exit, v, A.entry).filter((function (e) {
                                    return e
                                }))).map((function (e) {
                                    return on(e, r._options.actions)
                                })), c, l), 3), E = w[0], T = w[1], S = w[2], x = null != g ? g : a;
                                return {
                                    value: x,
                                    context: T,
                                    actions: E,
                                    changed: g !== a || E.length > 0 || S,
                                    matches: rn(x)
                                }
                            }
                        }
                    } catch (e) {
                        i = {error: e}
                    } finally {
                        try {
                            p && !p.done && (o = h.return) && o.call(h)
                        } finally {
                            if (i) throw i.error
                        }
                    }
                }
                return an(a, c)
            }
        };
        return r
    }

    var un = function (e, t) {
        return e.actions.forEach((function (n) {
            var i = n.exec;
            return i && i(e.context, t)
        }))
    };

    function dn(e) {
        var t = e.initialState, n = Xt.NotStarted, i = new Set, o = {
            _machine: e, send: function (o) {
                n === Xt.Running && (t = e.transition(t, o), un(t, sn(o)), i.forEach((function (e) {
                    return e(t)
                })))
            }, subscribe: function (e) {
                return i.add(e), e(t), {
                    unsubscribe: function () {
                        return i.delete(e)
                    }
                }
            }, start: function (i) {
                if (i) {
                    var r = "object" == typeof i ? i : {context: e.config.context, value: i};
                    t = {value: r.value, actions: [], context: r.context, matches: rn(r.value)}
                }
                return n = Xt.Running, un(t, en), o
            }, stop: function () {
                return n = Xt.Stopped, i.clear(), o
            }, get state() {
                return t
            }, get status() {
                return n
            }
        };
        return o
    }

    function hn(e, {getCastFn: t, applyEventsSynchronously: n, emitter: i}) {
        return dn(ln({
            id: "player",
            context: e,
            initial: "paused",
            states: {
                playing: {
                    on: {
                        PAUSE: {target: "paused", actions: ["pause"]},
                        CAST_EVENT: {target: "playing", actions: "castEvent"},
                        END: {target: "paused", actions: ["resetLastPlayedEvent", "pause"]},
                        ADD_EVENT: {target: "playing", actions: ["addEvent"]}
                    }
                },
                paused: {
                    on: {
                        PLAY: {target: "playing", actions: ["recordTimeOffset", "play"]},
                        CAST_EVENT: {target: "paused", actions: "castEvent"},
                        TO_LIVE: {target: "live", actions: ["startLive"]},
                        ADD_EVENT: {target: "paused", actions: ["addEvent"]}
                    }
                },
                live: {
                    on: {
                        ADD_EVENT: {target: "live", actions: ["addEvent"]},
                        CAST_EVENT: {target: "live", actions: ["castEvent"]}
                    }
                }
            }
        }, {
            actions: {
                castEvent: nn({lastPlayedEvent: (e, t) => "CAST_EVENT" === t.type ? t.payload.event : e.lastPlayedEvent}),
                recordTimeOffset: nn(((e, t) => {
                    let n = e.timeOffset;
                    return "payload" in t && "timeOffset" in t.payload && (n = t.payload.timeOffset), Object.assign(Object.assign({}, e), {
                        timeOffset: n,
                        baselineTime: e.events[0].timestamp + n
                    })
                })),
                play(e) {
                    var o;
                    const {timer: r, events: s, baselineTime: a, lastPlayedEvent: c} = e;
                    r.clear();
                    for (const e of s) Qt(e, a);
                    const l = function (e, t) {
                        for (let n = e.length - 1; n >= 0; n--) {
                            const i = e[n];
                            if (i.type === be.Meta && i.timestamp <= t) return e.slice(n)
                        }
                        return e
                    }(s, a);
                    let u = null == c ? void 0 : c.timestamp;
                    (null == c ? void 0 : c.type) === be.IncrementalSnapshot && c.data.source === Ne.MouseMove && (u = c.timestamp + (null === (o = c.data.positions[0]) || void 0 === o ? void 0 : o.timeOffset)), a < (u || 0) && i.emit(Te.PlayBack);
                    const d = new Array, h = new Array;
                    for (const e of l) if (!(u && u < a && (e.timestamp <= u || e === c))) if (e.timestamp < a) d.push(e); else {
                        const n = t(e, !1);
                        h.push({
                            doAction: () => {
                                n()
                            }, delay: e.delay
                        })
                    }
                    n(d), i.emit(Te.Flush), r.addActions(h), r.start()
                },
                pause(e) {
                    e.timer.clear()
                },
                resetLastPlayedEvent: nn((e => Object.assign(Object.assign({}, e), {lastPlayedEvent: null}))),
                startLive: nn({baselineTime: (e, t) => (e.timer.toggleLiveMode(!0), e.timer.start(), "TO_LIVE" === t.type && t.payload.baselineTime ? t.payload.baselineTime : Date.now())}),
                addEvent: nn(((e, n) => {
                    const {baselineTime: i, timer: o, events: r} = e;
                    if ("ADD_EVENT" === n.type) {
                        const {event: e} = n.payload;
                        Qt(e, i);
                        let s = r.length - 1;
                        if (!r[s] || r[s].timestamp <= e.timestamp) r.push(e); else {
                            let t = -1, n = 0;
                            for (; n <= s;) {
                                const t = Math.floor((n + s) / 2);
                                r[t].timestamp <= e.timestamp ? n = t + 1 : s = t - 1
                            }
                            -1 === t && (t = n), r.splice(t, 0, e)
                        }
                        const a = e.timestamp < i, c = t(e, a);
                        a ? c() : o.isActive() && o.addAction({
                            doAction: () => {
                                c()
                            }, delay: e.delay
                        })
                    }
                    return Object.assign(Object.assign({}, e), {events: r})
                }))
            }
        }))
    }

    const pn = new Map;

    function mn(e, t) {
        let n = pn.get(e);
        return n || (n = new Map, pn.set(e, n)), n.has(t) || n.set(t, []), n.get(t)
    }

    function fn(e, t, n) {
        return i => Se(this, void 0, void 0, (function* () {
            if (i && "object" == typeof i && "rr_type" in i) {
                if (n && (n.isUnchanged = !1), "ImageBitmap" === i.rr_type && "args" in i) {
                    const o = yield fn(e, t, n)(i.args);
                    return yield createImageBitmap.apply(null, o)
                }
                if ("index" in i) {
                    if (n || null === t) return i;
                    const {rr_type: e, index: o} = i;
                    return mn(t, e)[o]
                }
                if ("args" in i) {
                    const {rr_type: o, args: r} = i;
                    return new (0, window[o])(...yield Promise.all(r.map(fn(e, t, n))))
                }
                if ("base64" in i) return function (e) {
                    var t, n, i, o, r, s = .75 * e.length, a = e.length, c = 0;
                    "=" === e[e.length - 1] && (s--, "=" === e[e.length - 2] && s--);
                    var l = new ArrayBuffer(s), u = new Uint8Array(l);
                    for (t = 0; t < a; t += 4) n = De[e.charCodeAt(t)], i = De[e.charCodeAt(t + 1)], o = De[e.charCodeAt(t + 2)], r = De[e.charCodeAt(t + 3)], u[c++] = n << 2 | i >> 4, u[c++] = (15 & i) << 4 | o >> 2, u[c++] = (3 & o) << 6 | 63 & r;
                    return l
                }(i.base64);
                if ("src" in i) {
                    const t = e.get(i.src);
                    if (t) return t;
                    {
                        const t = new Image;
                        return t.src = i.src, e.set(i.src, t), t
                    }
                }
                if ("data" in i && "Blob" === i.rr_type) {
                    const o = yield Promise.all(i.data.map(fn(e, t, n)));
                    return new Blob(o, {type: i.type})
                }
            } else if (Array.isArray(i)) {
                return yield Promise.all(i.map(fn(e, t, n)))
            }
            return i
        }))
    }

    const gn = ["WebGLActiveInfo", "WebGLBuffer", "WebGLFramebuffer", "WebGLProgram", "WebGLRenderbuffer", "WebGLShader", "WebGLShaderPrecisionFormat", "WebGLTexture", "WebGLUniformLocation", "WebGLVertexArrayObject"];

    function yn({mutation: e, target: t, type: n, imageMap: i, errorHandler: o}) {
        return Se(this, void 0, void 0, (function* () {
            try {
                const o = function (e, t) {
                    try {
                        return t === we.WebGL ? e.getContext("webgl") || e.getContext("experimental-webgl") : e.getContext("webgl2")
                    } catch (e) {
                        return null
                    }
                }(t, n);
                if (!o) return;
                if (e.setter) return void (o[e.property] = e.args[0]);
                const r = o[e.property], s = yield Promise.all(e.args.map(fn(i, o)));
                !function (e, t) {
                    if (!(null == t ? void 0 : t.constructor)) return;
                    const {name: n} = t.constructor;
                    if (!gn.includes(n)) return;
                    const i = mn(e, n);
                    i.includes(t) || i.push(t)
                }(o, r.apply(o, s))
            } catch (t) {
                o(e, t)
            }
        }))
    }

    function vn({event: e, mutation: t, target: n, imageMap: i, errorHandler: o}) {
        return Se(this, void 0, void 0, (function* () {
            try {
                const o = n.getContext("2d");
                if (t.setter) return void (o[t.property] = t.args[0]);
                const r = o[t.property];
                if ("drawImage" === t.property && "string" == typeof t.args[0]) i.get(e), r.apply(o, t.args); else {
                    const e = yield Promise.all(t.args.map(fn(i, o)));
                    r.apply(o, e)
                }
            } catch (e) {
                o(t, e)
            }
        }))
    }

    function Cn({event: e, mutation: t, target: n, imageMap: i, canvasEventMap: o, errorHandler: r}) {
        return Se(this, void 0, void 0, (function* () {
            try {
                const s = o.get(e) || t, a = "commands" in s ? s.commands : [s];
                if ([we.WebGL, we.WebGL2].includes(t.type)) {
                    for (let e = 0; e < a.length; e++) {
                        const o = a[e];
                        yield yn({mutation: o, type: t.type, target: n, imageMap: i, errorHandler: r})
                    }
                    return
                }
                for (let t = 0; t < a.length; t++) {
                    const o = a[t];
                    yield vn({event: e, mutation: o, target: n, imageMap: i, errorHandler: r})
                }
            } catch (e) {
                r(t, e)
            }
        }))
    }

    const In = Jt || jt, bn = "[replayer]", Nn = {duration: 500, lineCap: "round", lineWidth: 3, strokeStyle: "red"};

    function An(e) {
        return e.type == be.IncrementalSnapshot && (e.data.source == Ne.TouchMove || e.data.source == Ne.MouseInteraction && e.data.type == Ae.TouchStart)
    }

    class wn {
        constructor(e, t) {
            if (this.usingVirtualDom = !1, this.virtualDom = new ct, this.mouseTail = null, this.tailPositions = [], this.emitter = In(), this.legacy_missingNodeRetryMap = {}, this.cache = ce(), this.imageMap = new Map, this.canvasEventMap = new Map, this.mirror = q(), this.firstFullSnapshot = null, this.newDocumentQueue = [], this.mousePos = null, this.touchActive = null, this.handleResize = e => {
                this.iframe.style.display = "inherit";
                for (const t of [this.mouseTail, this.iframe]) t && (t.setAttribute("width", String(e.width)), t.setAttribute("height", String(e.height)))
            }, this.applyEventsSynchronously = e => {
                for (const t of e) {
                    switch (t.type) {
                        case be.DomContentLoaded:
                        case be.Load:
                        case be.Custom:
                            continue;
                        case be.FullSnapshot:
                        case be.Meta:
                        case be.Plugin:
                        case be.IncrementalSnapshot:
                    }
                    this.getCastFn(t, !0)()
                }
                !0 === this.touchActive ? this.mouse.classList.add("touch-active") : !1 === this.touchActive && this.mouse.classList.remove("touch-active"), this.touchActive = null
            }, this.getCastFn = (e, t = !1) => {
                let n;
                switch (e.type) {
                    case be.DomContentLoaded:
                    case be.Load:
                        break;
                    case be.Custom:
                        n = () => {
                            this.emitter.emit(Te.CustomEvent, e)
                        };
                        break;
                    case be.Meta:
                        n = () => this.emitter.emit(Te.Resize, {width: e.data.width, height: e.data.height});
                        break;
                    case be.FullSnapshot:
                        n = () => {
                            if (this.firstFullSnapshot) {
                                if (this.firstFullSnapshot === e) return void (this.firstFullSnapshot = !0)
                            } else this.firstFullSnapshot = !0;
                            this.rebuildFullSnapshot(e, t), this.iframe.contentWindow.scrollTo(e.data.initialOffset)
                        };
                        break;
                    case be.IncrementalSnapshot:
                        n = () => {
                            if (this.applyIncremental(e, t), !t && (e === this.nextUserInteractionEvent && (this.nextUserInteractionEvent = null, this.backToNormal()), this.config.skipInactive && !this.nextUserInteractionEvent)) {
                                for (const t of this.service.state.context.events) if (!(t.timestamp <= e.timestamp) && this.isUserInteraction(t)) {
                                    t.delay - e.delay > 1e4 * this.speedService.state.context.timer.speed && (this.nextUserInteractionEvent = t);
                                    break
                                }
                                if (this.nextUserInteractionEvent) {
                                    const t = this.nextUserInteractionEvent.delay - e.delay,
                                        n = {speed: Math.min(Math.round(t / 5e3), this.config.maxSpeed)};
                                    this.speedService.send({
                                        type: "FAST_FORWARD",
                                        payload: n
                                    }), this.emitter.emit(Te.SkipStart, n)
                                }
                            }
                        }
                }
                return () => {
                    n && n();
                    for (const n of this.config.plugins || []) n.handler(e, t, {replayer: this});
                    this.service.send({type: "CAST_EVENT", payload: {event: e}});
                    const i = this.service.state.context.events.length - 1;
                    if (e === this.service.state.context.events[i]) {
                        const t = () => {
                            i < this.service.state.context.events.length - 1 || (this.backToNormal(), this.service.send("END"), this.emitter.emit(Te.Finish))
                        };
                        e.type === be.IncrementalSnapshot && e.data.source === Ne.MouseMove && e.data.positions.length ? setTimeout((() => {
                            t()
                        }), Math.max(0, 50 - e.data.positions[0].timeOffset)) : t()
                    }
                    this.emitter.emit(Te.EventCast, e)
                }
            }, !(null == t ? void 0 : t.liveMode) && e.length < 2) throw new Error("Replayer need at least 2 events.");
            const n = {
                speed: 1,
                maxSpeed: 360,
                root: document.body,
                loadTimeout: 0,
                skipInactive: !1,
                showWarning: !0,
                showDebug: !1,
                blockClass: "rr-block",
                liveMode: !1,
                insertStyleRules: [],
                triggerFocus: !0,
                UNSAFE_replayCanvas: !1,
                pauseAnimation: !0,
                mouseTail: Nn,
                useVirtualDom: !0
            };
            this.config = Object.assign({}, n, t), this.handleResize = this.handleResize.bind(this), this.getCastFn = this.getCastFn.bind(this), this.applyEventsSynchronously = this.applyEventsSynchronously.bind(this), this.emitter.on(Te.Resize, this.handleResize), this.setupDom(), this.emitter.on(Te.Flush, (() => {
                if (this.usingVirtualDom) {
                    const e = {
                        mirror: this.mirror, applyCanvas: (e, t, n) => {
                            Cn({
                                event: e,
                                mutation: t,
                                target: n,
                                imageMap: this.imageMap,
                                canvasEventMap: this.canvasEventMap,
                                errorHandler: this.warnCanvasMutationFailed.bind(this)
                            })
                        }, applyInput: this.applyInput.bind(this), applyScroll: this.applyScroll.bind(this)
                    };
                    if (nt(this.iframe.contentDocument, this.virtualDom, e, this.virtualDom.mirror), this.virtualDom.destroyTree(), this.usingVirtualDom = !1, Object.keys(this.legacy_missingNodeRetryMap).length) for (const t in this.legacy_missingNodeRetryMap) try {
                        const n = this.legacy_missingNodeRetryMap[t],
                            i = ot(n.node, this.mirror, this.virtualDom.mirror);
                        nt(i, n.node, e, this.virtualDom.mirror), n.node = i
                    } catch (e) {
                        this.config.showWarning && console.warn(e)
                    }
                }
                this.mousePos && this.moveAndHover(this.mousePos.x, this.mousePos.y, this.mousePos.id, !0, this.mousePos.debugData), this.mousePos = null
            })), this.emitter.on(Te.PlayBack, (() => {
                this.firstFullSnapshot = null, this.mirror.reset()
            }));
            const i = new zt([], (null == t ? void 0 : t.speed) || n.speed);
            this.service = hn({
                events: e.map((e => t && t.unpackFn ? t.unpackFn(e) : e)).sort(((e, t) => e.timestamp - t.timestamp)),
                timer: i,
                timeOffset: 0,
                baselineTime: 0,
                lastPlayedEvent: null
            }, {
                getCastFn: this.getCastFn,
                applyEventsSynchronously: this.applyEventsSynchronously,
                emitter: this.emitter
            }), this.service.start(), this.service.subscribe((e => {
                this.emitter.emit(Te.StateChange, {player: e})
            })), this.speedService = dn(ln({
                id: "speed",
                context: {normalSpeed: -1, timer: i},
                initial: "normal",
                states: {
                    normal: {
                        on: {
                            FAST_FORWARD: {target: "skipping", actions: ["recordSpeed", "setSpeed"]},
                            SET_SPEED: {target: "normal", actions: ["setSpeed"]}
                        }
                    },
                    skipping: {
                        on: {
                            BACK_TO_NORMAL: {target: "normal", actions: ["restoreSpeed"]},
                            SET_SPEED: {target: "normal", actions: ["setSpeed"]}
                        }
                    }
                }
            }, {
                actions: {
                    setSpeed: (e, t) => {
                        "payload" in t && e.timer.setSpeed(t.payload.speed)
                    }, recordSpeed: nn({normalSpeed: e => e.timer.speed}), restoreSpeed: e => {
                        e.timer.setSpeed(e.normalSpeed)
                    }
                }
            })), this.speedService.start(), this.speedService.subscribe((e => {
                this.emitter.emit(Te.StateChange, {speed: e})
            }));
            const o = this.service.state.context.events.find((e => e.type === be.Meta)),
                r = this.service.state.context.events.find((e => e.type === be.FullSnapshot));
            if (o) {
                const {width: e, height: t} = o.data;
                setTimeout((() => {
                    this.emitter.emit(Te.Resize, {width: e, height: t})
                }), 0)
            }
            r && setTimeout((() => {
                this.firstFullSnapshot || (this.firstFullSnapshot = r, this.rebuildFullSnapshot(r), this.iframe.contentWindow.scrollTo(r.data.initialOffset))
            }), 1), this.service.state.context.events.find(An) && this.mouse.classList.add("touch-device")
        }

        get timer() {
            return this.service.state.context.timer
        }

        on(e, t) {
            return this.emitter.on(e, t), this
        }

        off(e, t) {
            return this.emitter.off(e, t), this
        }

        setConfig(e) {
            Object.keys(e).forEach((t => {
                e[t], this.config[t] = e[t]
            })), this.config.skipInactive || this.backToNormal(), void 0 !== e.speed && this.speedService.send({
                type: "SET_SPEED",
                payload: {speed: e.speed}
            }), void 0 !== e.mouseTail && (!1 === e.mouseTail ? this.mouseTail && (this.mouseTail.style.display = "none") : (this.mouseTail || (this.mouseTail = document.createElement("canvas"), this.mouseTail.width = Number.parseFloat(this.iframe.width), this.mouseTail.height = Number.parseFloat(this.iframe.height), this.mouseTail.classList.add("replayer-mouse-tail"), this.wrapper.insertBefore(this.mouseTail, this.iframe)), this.mouseTail.style.display = "inherit"))
        }

        getMetaData() {
            const e = this.service.state.context.events[0],
                t = this.service.state.context.events[this.service.state.context.events.length - 1];
            return {startTime: e.timestamp, endTime: t.timestamp, totalTime: t.timestamp - e.timestamp}
        }

        getCurrentTime() {
            return this.timer.timeOffset + this.getTimeOffset()
        }

        getTimeOffset() {
            const {baselineTime: e, events: t} = this.service.state.context;
            return e - t[0].timestamp
        }

        getMirror() {
            return this.mirror
        }

        play(e = 0) {
            var t, n;
            this.service.state.matches("paused") || this.service.send({type: "PAUSE"}), this.service.send({
                type: "PLAY",
                payload: {timeOffset: e}
            }), null === (n = null === (t = this.iframe.contentDocument) || void 0 === t ? void 0 : t.getElementsByTagName("html")[0]) || void 0 === n || n.classList.remove("rrweb-paused"), this.emitter.emit(Te.Start)
        }

        pause(e) {
            var t, n;
            void 0 === e && this.service.state.matches("playing") && this.service.send({type: "PAUSE"}), "number" == typeof e && (this.play(e), this.service.send({type: "PAUSE"})), null === (n = null === (t = this.iframe.contentDocument) || void 0 === t ? void 0 : t.getElementsByTagName("html")[0]) || void 0 === n || n.classList.add("rrweb-paused"), this.emitter.emit(Te.Pause)
        }

        resume(e = 0) {
            console.warn("The 'resume' will be departed in 1.0. Please use 'play' method which has the same interface."), this.play(e), this.emitter.emit(Te.Resume)
        }

        startLive(e) {
            this.service.send({type: "TO_LIVE", payload: {baselineTime: e}})
        }

        addEvent(e) {
            const t = this.config.unpackFn ? this.config.unpackFn(e) : e;
            An(t) && this.mouse.classList.add("touch-device"), Promise.resolve().then((() => this.service.send({
                type: "ADD_EVENT",
                payload: {event: t}
            })))
        }

        enableInteract() {
            this.iframe.setAttribute("scrolling", "auto"), this.iframe.style.pointerEvents = "auto"
        }

        disableInteract() {
            this.iframe.setAttribute("scrolling", "no"), this.iframe.style.pointerEvents = "none"
        }

        resetCache() {
            this.cache = ce()
        }

        setupDom() {
            this.wrapper = document.createElement("div"), this.wrapper.classList.add("replayer-wrapper"), this.config.root.appendChild(this.wrapper), this.mouse = document.createElement("div"), this.mouse.classList.add("replayer-mouse"), this.wrapper.appendChild(this.mouse), !1 !== this.config.mouseTail && (this.mouseTail = document.createElement("canvas"), this.mouseTail.classList.add("replayer-mouse-tail"), this.mouseTail.style.display = "inherit", this.wrapper.appendChild(this.mouseTail)), this.iframe = document.createElement("iframe");
            const e = ["allow-same-origin"];
            this.config.UNSAFE_replayCanvas && e.push("allow-scripts"), this.iframe.style.display = "none", this.iframe.setAttribute("sandbox", e.join(" ")), this.disableInteract(), this.wrapper.appendChild(this.iframe), this.iframe.contentWindow && this.iframe.contentDocument && (Ht(this.iframe.contentWindow, this.iframe.contentDocument), function (e = window) {
                "NodeList" in e && !e.NodeList.prototype.forEach && (e.NodeList.prototype.forEach = Array.prototype.forEach), "DOMTokenList" in e && !e.DOMTokenList.prototype.forEach && (e.DOMTokenList.prototype.forEach = Array.prototype.forEach), Node.prototype.contains || (Node.prototype.contains = (...e) => {
                    let t = e[0];
                    if (!(0 in e)) throw new TypeError("1 argument is required");
                    do {
                        if (this === t) return !0
                    } while (t = t && t.parentNode);
                    return !1
                })
            }(this.iframe.contentWindow))
        }

        rebuildFullSnapshot(e, t = !1) {
            if (!this.iframe.contentDocument) return console.warn("Looks like your replayer has been destroyed.");
            Object.keys(this.legacy_missingNodeRetryMap).length && console.warn("Found unresolved missing node map", this.legacy_missingNodeRetryMap), this.legacy_missingNodeRetryMap = {};
            const n = [];
            de(e.data.node, {
                doc: this.iframe.contentDocument, afterAppend: e => {
                    this.collectIframeAndAttachDocument(n, e)
                }, cache: this.cache, mirror: this.mirror
            });
            for (const {
                mutationInQueue: e,
                builtNode: t
            } of n) this.attachDocumentToIframe(e, t), this.newDocumentQueue = this.newDocumentQueue.filter((t => t !== e));
            const {documentElement: i, head: o} = this.iframe.contentDocument;
            this.insertStyleRules(i, o), this.service.state.matches("playing") || this.iframe.contentDocument.getElementsByTagName("html")[0].classList.add("rrweb-paused"), this.emitter.emit(Te.FullsnapshotRebuilded, e), t || this.waitForStylesheetLoad(), this.config.UNSAFE_replayCanvas && this.preloadAllImages()
        }

        insertStyleRules(e, t) {
            const n = (i = this.config.blockClass, [`.${i} { background: currentColor }`, "noscript { display: none !important; }"]).concat(this.config.insertStyleRules);
            var i;
            if (this.config.pauseAnimation && n.push("html.rrweb-paused *, html.rrweb-paused *:before, html.rrweb-paused *:after { animation-play-state: paused !important; }"), this.usingVirtualDom) {
                const i = this.virtualDom.createElement("style");
                this.virtualDom.mirror.add(i, bt(i, this.virtualDom.unserializedId)), e.insertBefore(i, t);
                for (let e = 0; e < n.length; e++) i.rules.push({cssText: n[e], type: st.Insert, index: e})
            } else {
                const i = document.createElement("style");
                e.insertBefore(i, t);
                for (let e = 0; e < n.length; e++) i.sheet.insertRule(n[e], e)
            }
        }

        attachDocumentToIframe(e, t) {
            const n = this.usingVirtualDom ? this.virtualDom.mirror : this.mirror, i = [];
            ue(e.node, {
                doc: t.contentDocument, mirror: n, hackCss: !0, skipChild: !1, afterAppend: e => {
                    this.collectIframeAndAttachDocument(i, e);
                    const o = n.getMeta(e);
                    if ((null == o ? void 0 : o.type) === H.Element && "HTML" === (null == o ? void 0 : o.tagName.toUpperCase())) {
                        const {documentElement: e, head: n} = t.contentDocument;
                        this.insertStyleRules(e, n)
                    }
                }, cache: this.cache
            });
            for (const {
                mutationInQueue: e,
                builtNode: t
            } of i) this.attachDocumentToIframe(e, t), this.newDocumentQueue = this.newDocumentQueue.filter((t => t !== e))
        }

        collectIframeAndAttachDocument(e, t) {
            if (ge(t, this.mirror)) {
                const n = this.newDocumentQueue.find((e => e.parentId === this.mirror.getId(t)));
                n && e.push({mutationInQueue: n, builtNode: t})
            }
        }

        waitForStylesheetLoad() {
            var e;
            const t = null === (e = this.iframe.contentDocument) || void 0 === e ? void 0 : e.head;
            if (t) {
                const e = new Set;
                let n, i = this.service.state;
                const o = () => {
                    i = this.service.state
                };
                this.emitter.on(Te.Start, o), this.emitter.on(Te.Pause, o);
                const r = () => {
                    this.emitter.off(Te.Start, o), this.emitter.off(Te.Pause, o)
                };
                t.querySelectorAll('link[rel="stylesheet"]').forEach((t => {
                    t.sheet || (e.add(t), t.addEventListener("load", (() => {
                        e.delete(t), 0 === e.size && -1 !== n && (i.matches("playing") && this.play(this.getCurrentTime()), this.emitter.emit(Te.LoadStylesheetEnd), n && clearTimeout(n), r())
                    })))
                })), e.size > 0 && (this.service.send({type: "PAUSE"}), this.emitter.emit(Te.LoadStylesheetStart), n = setTimeout((() => {
                    i.matches("playing") && this.play(this.getCurrentTime()), n = -1, r()
                }), this.config.loadTimeout))
            }
        }

        preloadAllImages() {
            return Se(this, void 0, void 0, (function* () {
                this.service.state;
                const e = () => {
                    this.service.state
                };
                this.emitter.on(Te.Start, e), this.emitter.on(Te.Pause, e);
                const t = [];
                for (const e of this.service.state.context.events) if (e.type === be.IncrementalSnapshot && e.data.source === Ne.CanvasMutation) {
                    t.push(this.deserializeAndPreloadCanvasEvents(e.data, e));
                    ("commands" in e.data ? e.data.commands : [e.data]).forEach((t => {
                        this.preloadImages(t, e)
                    }))
                }
                return Promise.all(t)
            }))
        }

        preloadImages(e, t) {
            if ("drawImage" === e.property && "string" == typeof e.args[0] && !this.imageMap.has(t)) {
                const t = document.createElement("canvas"), n = t.getContext("2d"),
                    i = null == n ? void 0 : n.createImageData(t.width, t.height);
                null == i || i.data, JSON.parse(e.args[0]), null == n || n.putImageData(i, 0, 0)
            }
        }

        deserializeAndPreloadCanvasEvents(e, t) {
            return Se(this, void 0, void 0, (function* () {
                if (!this.canvasEventMap.has(t)) {
                    const n = {isUnchanged: !0};
                    if ("commands" in e) {
                        const i = yield Promise.all(e.commands.map((e => Se(this, void 0, void 0, (function* () {
                            const t = yield Promise.all(e.args.map(fn(this.imageMap, null, n)));
                            return Object.assign(Object.assign({}, e), {args: t})
                        })))));
                        !1 === n.isUnchanged && this.canvasEventMap.set(t, Object.assign(Object.assign({}, e), {commands: i}))
                    } else {
                        const i = yield Promise.all(e.args.map(fn(this.imageMap, null, n)));
                        !1 === n.isUnchanged && this.canvasEventMap.set(t, Object.assign(Object.assign({}, e), {args: i}))
                    }
                }
            }))
        }

        applyIncremental(e, t) {
            var n, i, o, r, s, a;
            const {data: c} = e;
            switch (c.source) {
                case Ne.Mutation:
                    try {
                        this.applyMutation(c, t)
                    } catch (e) {
                        this.warn(`Exception in mutation ${e.message || e}`, c)
                    }
                    break;
                case Ne.Drag:
                case Ne.TouchMove:
                case Ne.MouseMove:
                    if (t) {
                        const e = c.positions[c.positions.length - 1];
                        this.mousePos = {x: e.x, y: e.y, id: e.id, debugData: c}
                    } else c.positions.forEach((n => {
                        const i = {
                            doAction: () => {
                                this.moveAndHover(n.x, n.y, n.id, t, c)
                            }, delay: n.timeOffset + e.timestamp - this.service.state.context.baselineTime
                        };
                        this.timer.addAction(i)
                    })), this.timer.addAction({
                        doAction() {
                        }, delay: e.delay - (null === (n = c.positions[0]) || void 0 === n ? void 0 : n.timeOffset)
                    });
                    break;
                case Ne.MouseInteraction: {
                    if (-1 === c.id || t) break;
                    const e = new Event(Ae[c.type].toLowerCase()), n = this.mirror.getNode(c.id);
                    if (!n) return this.debugNodeNotFound(c, c.id);
                    this.emitter.emit(Te.MouseInteraction, {type: c.type, target: n});
                    const {triggerFocus: i} = this.config;
                    switch (c.type) {
                        case Ae.Blur:
                            "blur" in n && n.blur();
                            break;
                        case Ae.Focus:
                            i && n.focus && n.focus({preventScroll: !0});
                            break;
                        case Ae.Click:
                        case Ae.TouchStart:
                        case Ae.TouchEnd:
                            t ? (c.type === Ae.TouchStart ? this.touchActive = !0 : c.type === Ae.TouchEnd && (this.touchActive = !1), this.mousePos = {
                                x: c.x,
                                y: c.y,
                                id: c.id,
                                debugData: c
                            }) : (c.type === Ae.TouchStart && (this.tailPositions.length = 0), this.moveAndHover(c.x, c.y, c.id, t, c), c.type === Ae.Click ? (this.mouse.classList.remove("active"), this.mouse.offsetWidth, this.mouse.classList.add("active")) : c.type === Ae.TouchStart ? (this.mouse.offsetWidth, this.mouse.classList.add("touch-active")) : c.type === Ae.TouchEnd && this.mouse.classList.remove("touch-active"));
                            break;
                        case Ae.TouchCancel:
                            t ? this.touchActive = !1 : this.mouse.classList.remove("touch-active");
                            break;
                        default:
                            n.dispatchEvent(e)
                    }
                    break
                }
                case Ne.Scroll:
                    if (-1 === c.id) break;
                    if (this.usingVirtualDom) {
                        const e = this.virtualDom.mirror.getNode(c.id);
                        if (!e) return this.debugNodeNotFound(c, c.id);
                        e.scrollData = c;
                        break
                    }
                    this.applyScroll(c, t);
                    break;
                case Ne.ViewportResize:
                    this.emitter.emit(Te.Resize, {width: c.width, height: c.height});
                    break;
                case Ne.Input:
                    if (-1 === c.id) break;
                    if (this.usingVirtualDom) {
                        const e = this.virtualDom.mirror.getNode(c.id);
                        if (!e) return this.debugNodeNotFound(c, c.id);
                        e.inputData = c;
                        break
                    }
                    this.applyInput(c);
                    break;
                case Ne.MediaInteraction: {
                    const e = this.usingVirtualDom ? this.virtualDom.mirror.getNode(c.id) : this.mirror.getNode(c.id);
                    if (!e) return this.debugNodeNotFound(c, c.id);
                    const t = e;
                    try {
                        c.currentTime && (t.currentTime = c.currentTime), c.volume && (t.volume = c.volume), c.muted && (t.muted = c.muted), 1 === c.type && t.pause(), 0 === c.type && t.play()
                    } catch (e) {
                        this.config.showWarning && console.warn(`Failed to replay media interactions: ${e.message || e}`)
                    }
                    break
                }
                case Ne.StyleSheetRule:
                    if (this.usingVirtualDom) {
                        const e = this.virtualDom.mirror.getNode(c.id);
                        if (!e) return this.debugNodeNotFound(c, c.id);
                        const t = e.rules;
                        null === (i = c.adds) || void 0 === i || i.forEach((({
                                                                                 rule: e,
                                                                                 index: n
                                                                             }) => null == t ? void 0 : t.push({
                            cssText: e,
                            index: n,
                            type: st.Insert
                        }))), null === (o = c.removes) || void 0 === o || o.forEach((({index: e}) => null == t ? void 0 : t.push({
                            index: e,
                            type: st.Remove
                        })))
                    } else {
                        const e = this.mirror.getNode(c.id);
                        if (!e) return this.debugNodeNotFound(c, c.id);
                        const t = e.sheet;
                        null === (r = c.adds) || void 0 === r || r.forEach((({rule: e, index: n}) => {
                            try {
                                if (Array.isArray(n)) {
                                    const {positions: i, index: o} = Ie(n);
                                    Ce(t.cssRules, i).insertRule(e, o)
                                } else {
                                    const i = void 0 === n ? void 0 : Math.min(n, t.cssRules.length);
                                    t.insertRule(e, i)
                                }
                            } catch (e) {
                            }
                        })), null === (s = c.removes) || void 0 === s || s.forEach((({index: e}) => {
                            try {
                                if (Array.isArray(e)) {
                                    const {positions: n, index: i} = Ie(e);
                                    Ce(t.cssRules, n).deleteRule(i || 0)
                                } else null == t || t.deleteRule(e)
                            } catch (e) {
                            }
                        }))
                    }
                    break;
                case Ne.StyleDeclaration:
                    if (this.usingVirtualDom) {
                        const e = this.virtualDom.mirror.getNode(c.id);
                        if (!e) return this.debugNodeNotFound(c, c.id);
                        const t = e.rules;
                        c.set && t.push(Object.assign({
                            type: st.SetProperty,
                            index: c.index
                        }, c.set)), c.remove && t.push(Object.assign({
                            type: st.RemoveProperty,
                            index: c.index
                        }, c.remove))
                    } else {
                        const e = this.mirror.getNode(c.id);
                        if (!e) return this.debugNodeNotFound(c, c.id);
                        const t = e.sheet;
                        if (c.set) {
                            Ce(t.rules, c.index).style.setProperty(c.set.property, c.set.value, c.set.priority)
                        }
                        if (c.remove) {
                            Ce(t.rules, c.index).style.removeProperty(c.remove.property)
                        }
                    }
                    break;
                case Ne.CanvasMutation:
                    if (!this.config.UNSAFE_replayCanvas) return;
                    if (this.usingVirtualDom) {
                        const t = this.virtualDom.mirror.getNode(c.id);
                        if (!t) return this.debugNodeNotFound(c, c.id);
                        t.canvasMutations.push({event: e, mutation: c})
                    } else {
                        const t = this.mirror.getNode(c.id);
                        if (!t) return this.debugNodeNotFound(c, c.id);
                        Cn({
                            event: e,
                            mutation: c,
                            target: t,
                            imageMap: this.imageMap,
                            canvasEventMap: this.canvasEventMap,
                            errorHandler: this.warnCanvasMutationFailed.bind(this)
                        })
                    }
                    break;
                case Ne.Font:
                    try {
                        const e = new FontFace(c.family, c.buffer ? new Uint8Array(JSON.parse(c.fontSource)) : c.fontSource, c.descriptors);
                        null === (a = this.iframe.contentDocument) || void 0 === a || a.fonts.add(e)
                    } catch (e) {
                        this.config.showWarning && console.warn(e)
                    }
            }
        }

        applyMutation(e, t) {
            if (this.config.useVirtualDom && !this.usingVirtualDom && t && (this.usingVirtualDom = !0, Ct(this.iframe.contentDocument, this.mirror, this.virtualDom), Object.keys(this.legacy_missingNodeRetryMap).length)) for (const e in this.legacy_missingNodeRetryMap) try {
                const t = this.legacy_missingNodeRetryMap[e], n = vt(t.node, this.virtualDom, this.mirror);
                n && (t.node = n)
            } catch (e) {
                this.config.showWarning && console.warn(e)
            }
            const n = this.usingVirtualDom ? this.virtualDom.mirror : this.mirror;
            e.removes.forEach((t => {
                var i;
                const o = n.getNode(t.id);
                if (!o) {
                    if (e.removes.find((e => e.id === t.parentId))) return;
                    return this.warnNodeNotFound(e, t.id)
                }
                let r = n.getNode(t.parentId);
                if (!r) return this.warnNodeNotFound(e, t.parentId);
                if (t.isShadow && ve(r) && (r = r.shadowRoot), n.removeNodeFromMap(o), r) try {
                    r.removeChild(o), this.usingVirtualDom && "#text" === o.nodeName && "STYLE" === r.nodeName && (null === (i = r.rules) || void 0 === i ? void 0 : i.length) > 0 && (r.rules = [])
                } catch (t) {
                    if (!(t instanceof DOMException)) throw t;
                    this.warn("parent could not remove child in mutation", r, o, e)
                }
            }));
            const i = Object.assign({}, this.legacy_missingNodeRetryMap), o = [], r = e => {
                var t;
                if (!this.iframe.contentDocument) return console.warn("Looks like your replayer has been destroyed.");
                let r = n.getNode(e.parentId);
                if (!r) return e.node.type === H.Document ? this.newDocumentQueue.push(e) : o.push(e);
                e.node.isShadow && (ve(r) || r.attachShadow({mode: "open"}), r = r.shadowRoot);
                let s = null, a = null;
                if (e.previousId && (s = n.getNode(e.previousId)), e.nextId && (a = n.getNode(e.nextId)), (e => {
                    let t = null;
                    return e.nextId && (t = n.getNode(e.nextId)), null !== e.nextId && void 0 !== e.nextId && -1 !== e.nextId && !t
                })(e)) return o.push(e);
                if (e.node.rootId && !n.getNode(e.node.rootId)) return;
                const c = e.node.rootId ? n.getNode(e.node.rootId) : this.usingVirtualDom ? this.virtualDom : this.iframe.contentDocument;
                if (ge(r, n)) return void this.attachDocumentToIframe(e, r);
                const l = ue(e.node, {doc: c, mirror: n, skipChild: !0, hackCss: !0, cache: this.cache});
                if (-1 === e.previousId || -1 === e.nextId) return void (i[e.node.id] = {node: l, mutation: e});
                const u = n.getMeta(r);
                if (u && u.type === H.Element && "textarea" === u.tagName && e.node.type === H.Text) {
                    const e = Array.isArray(r.childNodes) ? r.childNodes : Array.from(r.childNodes);
                    for (const t of e) t.nodeType === r.TEXT_NODE && r.removeChild(t)
                }
                if (s && s.nextSibling && s.nextSibling.parentNode) r.insertBefore(l, s.nextSibling); else if (a && a.parentNode) r.contains(a) ? r.insertBefore(l, a) : r.insertBefore(l, null); else {
                    if (r === c) for (; c.firstChild;) c.removeChild(c.firstChild);
                    r.appendChild(l)
                }
                if (this.usingVirtualDom && "#text" === l.nodeName && "STYLE" === r.nodeName && (null === (t = r.rules) || void 0 === t ? void 0 : t.length) > 0 && (r.rules = []), ge(l, this.mirror)) {
                    const e = this.mirror.getId(l), t = this.newDocumentQueue.find((t => t.parentId === e));
                    t && (this.attachDocumentToIframe(t, l), this.newDocumentQueue = this.newDocumentQueue.filter((e => e !== t)))
                }
                (e.previousId || e.nextId) && this.legacy_resolveMissingNode(i, r, l, e)
            };
            e.adds.forEach((e => {
                r(e)
            }));
            const s = Date.now();
            for (; o.length;) {
                const e = me(o);
                if (o.length = 0, Date.now() - s > 500) {
                    this.warn("Timeout in the loop, please check the resolve tree data:", e);
                    break
                }
                for (const t of e) {
                    n.getNode(t.value.parentId) ? fe(t, (e => {
                        r(e)
                    })) : this.debug("Drop resolve tree since there is no parent for the root node.", t)
                }
            }
            Object.keys(i).length && Object.assign(this.legacy_missingNodeRetryMap, i), function (e) {
                const t = new Set, n = [];
                for (let i = e.length; i--;) {
                    const o = e[i];
                    t.has(o.id) || (n.push(o), t.add(o.id))
                }
                return n
            }(e.texts).forEach((t => {
                var i;
                const o = n.getNode(t.id);
                if (!o) {
                    if (e.removes.find((e => e.id === t.id))) return;
                    return this.warnNodeNotFound(e, t.id)
                }
                if (o.textContent = t.value, this.usingVirtualDom) {
                    const e = o.parentNode;
                    (null === (i = null == e ? void 0 : e.rules) || void 0 === i ? void 0 : i.length) > 0 && (e.rules = [])
                }
            })), e.attributes.forEach((t => {
                const i = n.getNode(t.id);
                if (!i) {
                    if (e.removes.find((e => e.id === t.id))) return;
                    return this.warnNodeNotFound(e, t.id)
                }
                for (const e in t.attributes) if ("string" == typeof e) {
                    const n = t.attributes[e];
                    if (null === n) i.removeAttribute(e); else if ("string" == typeof n) try {
                        i.setAttribute(e, n)
                    } catch (e) {
                        this.config.showWarning && console.warn("An error occurred may due to the checkout feature.", e)
                    } else if ("style" === e) {
                        const e = n, t = i;
                        for (const n in e) if (!1 === e[n]) t.style.removeProperty(n); else if (e[n] instanceof Array) {
                            const i = e[n];
                            t.style.setProperty(n, i[0], i[1])
                        } else {
                            const i = e[n];
                            t.style.setProperty(n, i)
                        }
                    }
                }
            }))
        }

        applyScroll(e, t) {
            const n = this.mirror.getNode(e.id);
            if (!n) return this.debugNodeNotFound(e, e.id);
            const i = this.mirror.getMeta(n);
            if (n === this.iframe.contentDocument) this.iframe.contentWindow.scrollTo({
                top: e.y,
                left: e.x,
                behavior: t ? "auto" : "smooth"
            }); else if ((null == i ? void 0 : i.type) === H.Document) n.defaultView.scrollTo({
                top: e.y,
                left: e.x,
                behavior: t ? "auto" : "smooth"
            }); else try {
                n.scrollTop = e.y, n.scrollLeft = e.x
            } catch (e) {
            }
        }

        applyInput(e) {
            const t = this.mirror.getNode(e.id);
            if (!t) return this.debugNodeNotFound(e, e.id);
            try {
                t.checked = e.isChecked, t.value = e.text
            } catch (e) {
            }
        }

        legacy_resolveMissingNode(e, t, n, i) {
            const {previousId: o, nextId: r} = i, s = o && e[o], a = r && e[r];
            if (s) {
                const {node: i, mutation: o} = s;
                t.insertBefore(i, n), delete e[o.node.id], delete this.legacy_missingNodeRetryMap[o.node.id], (o.previousId || o.nextId) && this.legacy_resolveMissingNode(e, t, i, o)
            }
            if (a) {
                const {node: i, mutation: o} = a;
                t.insertBefore(i, n.nextSibling), delete e[o.node.id], delete this.legacy_missingNodeRetryMap[o.node.id], (o.previousId || o.nextId) && this.legacy_resolveMissingNode(e, t, i, o)
            }
        }

        moveAndHover(e, t, n, i, o) {
            const r = this.mirror.getNode(n);
            if (!r) return this.debugNodeNotFound(o, n);
            const s = ye(r, this.iframe), a = e * s.absoluteScale + s.x, c = t * s.absoluteScale + s.y;
            this.mouse.style.left = `${a}px`, this.mouse.style.top = `${c}px`, i || this.drawMouseTail({
                x: a,
                y: c
            }), this.hoverElements(r)
        }

        drawMouseTail(e) {
            if (!this.mouseTail) return;
            const {
                lineCap: t,
                lineWidth: n,
                strokeStyle: i,
                duration: o
            } = !0 === this.config.mouseTail ? Nn : Object.assign({}, Nn, this.config.mouseTail), r = () => {
                if (!this.mouseTail) return;
                const e = this.mouseTail.getContext("2d");
                e && this.tailPositions.length && (e.clearRect(0, 0, this.mouseTail.width, this.mouseTail.height), e.beginPath(), e.lineWidth = n, e.lineCap = t, e.strokeStyle = i, e.moveTo(this.tailPositions[0].x, this.tailPositions[0].y), this.tailPositions.forEach((t => e.lineTo(t.x, t.y))), e.stroke())
            };
            this.tailPositions.push(e), r(), setTimeout((() => {
                this.tailPositions = this.tailPositions.filter((t => t !== e)), r()
            }), o / this.speedService.state.context.timer.speed)
        }

        hoverElements(e) {
            var t;
            null === (t = this.iframe.contentDocument) || void 0 === t || t.querySelectorAll(".\\:hover").forEach((e => {
                e.classList.remove(":hover")
            }));
            let n = e;
            for (; n;) n.classList && n.classList.add(":hover"), n = n.parentElement
        }

        isUserInteraction(e) {
            return e.type === be.IncrementalSnapshot && (e.data.source > Ne.Mutation && e.data.source <= Ne.Input)
        }

        backToNormal() {
            this.nextUserInteractionEvent = null, this.speedService.state.matches("normal") || (this.speedService.send({type: "BACK_TO_NORMAL"}), this.emitter.emit(Te.SkipEnd, {speed: this.speedService.state.context.normalSpeed}))
        }

        warnNodeNotFound(e, t) {
            this.warn(`Node with id '${t}' not found. `, e)
        }

        warnCanvasMutationFailed(e, t) {
            this.warn("Has error on canvas update", t, "canvas mutation:", e)
        }

        debugNodeNotFound(e, t) {
            this.debug(bn, `Node with id '${t}' not found. `, e)
        }

        warn(...e) {
            this.config.showWarning && console.warn(bn, ...e)
        }

        debug(...e) {
            this.config.showDebug && console.log(bn, ...e)
        }
    }

    function En(e) {
        let t = "";
        return Object.keys(e).forEach((n => {
            t += `${n}: ${e[n]};`
        })), t
    }

    function Tn(e, t = 2) {
        let n = String(e);
        const i = Math.pow(10, t - 1);
        if (e < i) for (; String(i).length > n.length;) n = `0${e}`;
        return n
    }

    const Sn = 6e4, xn = 36e5;

    function Dn(e) {
        if (e <= 0) return "00:00";
        const t = Math.floor(e / xn);
        e %= xn;
        const n = Math.floor(e / Sn);
        e %= Sn;
        const i = Math.floor(e / 1e3);
        return t ? `${Tn(t)}:${Tn(n)}:${Tn(i)}` : `${Tn(n)}:${Tn(i)}`
    }

    function Rn() {
        return document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement
    }

    function Mn(e) {
        return {
            "[object Boolean]": "boolean",
            "[object Number]": "number",
            "[object String]": "string",
            "[object Function]": "function",
            "[object Array]": "array",
            "[object Date]": "date",
            "[object RegExp]": "regExp",
            "[object Undefined]": "undefined",
            "[object Null]": "null",
            "[object Object]": "object"
        }[Object.prototype.toString.call(e)]
    }

    function kn(t) {
        let n, i, o, r, s, a, d, p, C;
        return {
            c() {
                n = h("div"), i = h("input"), o = f(), r = h("label"), s = f(), a = h("span"), d = m(t[3]), y(i, "type", "checkbox"), y(i, "id", t[2]), i.disabled = t[1], y(i, "class", "svelte-9brlez"), y(r, "for", t[2]), y(r, "class", "svelte-9brlez"), y(a, "class", "label svelte-9brlez"), y(n, "class", "switch svelte-9brlez"), I(n, "disabled", t[1])
            }, m(e, u) {
                l(e, n, u), c(n, i), i.checked = t[0], c(n, o), c(n, r), c(n, s), c(n, a), c(a, d), p || (C = g(i, "change", t[4]), p = !0)
            }, p(e, [t]) {
                4 & t && y(i, "id", e[2]), 2 & t && (i.disabled = e[1]), 1 & t && (i.checked = e[0]), 4 & t && y(r, "for", e[2]), 8 & t && v(d, e[3]), 2 & t && I(n, "disabled", e[1])
            }, i: e, o: e, d(e) {
                e && u(n), p = !1, C()
            }
        }
    }

    function Fn(e, t, n) {
        let {disabled: i} = t, {checked: o} = t, {id: r} = t, {label: s} = t;
        return e.$$set = e => {
            "disabled" in e && n(1, i = e.disabled), "checked" in e && n(0, o = e.checked), "id" in e && n(2, r = e.id), "label" in e && n(3, s = e.label)
        }, [o, i, r, s, function () {
            o = this.checked, n(0, o)
        }]
    }

    class On extends j {
        constructor(e) {
            super(), X(this, e, Fn, kn, s, {disabled: 1, checked: 0, id: 2, label: 3})
        }
    }

    function Bn(e, t, n) {
        const i = e.slice();
        return i[33] = t[n], i
    }

    function Ln(e, t, n) {
        const i = e.slice();
        return i[36] = t[n], i
    }

    function _n(e) {
        let t, n, i, r, s, a, p, b, N, A, w, E, T, S, D, M, k, F, O, B, L, _, V, G, W, U = Dn(e[6]) + "",
            J = Dn(e[8].totalTime) + "", X = e[9], j = [];
        for (let t = 0; t < X.length; t += 1) j[t] = Vn(Ln(e, X, t));

        function H(e, t) {
            return "playing" === e[7] ? Wn : Gn
        }

        let z = H(e), Q = z(e), q = e[3], ee = [];
        for (let t = 0; t < q.length; t += 1) ee[t] = Un(Bn(e, q, t));

        function te(t) {
            e[27](t)
        }

        let ne = {id: "skip", disabled: "skipping" === e[10], label: "skip inactive"};
        return void 0 !== e[0] && (ne.checked = e[0]), O = new On({props: ne}), x.push((() => function (e, t, n) {
            const i = e.$$.props[t];
            void 0 !== i && (e.$$.bound[i] = n, n(e.$$.ctx[i]))
        }(O, "checked", te))), {
            c() {
                t = h("div"), n = h("div"), i = h("span"), r = m(U), s = f(), a = h("div"), p = h("div"), b = f();
                for (let e = 0; e < j.length; e += 1) j[e].c();
                N = f(), A = h("div"), w = f(), E = h("span"), T = m(J), S = f(), D = h("div"), M = h("button"), Q.c(), k = f();
                for (let e = 0; e < ee.length; e += 1) ee[e].c();
                F = f(), P(O.$$.fragment), L = f(), _ = h("button"), _.innerHTML = '<svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16"><defs><style type="text/css"></style></defs><path d="M916 380c-26.4 0-48-21.6-48-48L868 223.2 613.6 477.6c-18.4\n            18.4-48.8 18.4-68 0-18.4-18.4-18.4-48.8 0-68L800 156 692 156c-26.4\n            0-48-21.6-48-48 0-26.4 21.6-48 48-48l224 0c26.4 0 48 21.6 48 48l0\n            224C964 358.4 942.4 380 916 380zM231.2 860l108.8 0c26.4 0 48 21.6 48\n            48s-21.6 48-48 48l-224 0c-26.4 0-48-21.6-48-48l0-224c0-26.4 21.6-48\n            48-48 26.4 0 48 21.6 48 48L164 792l253.6-253.6c18.4-18.4 48.8-18.4\n            68 0 18.4 18.4 18.4 48.8 0 68L231.2 860z" p-id="1286"></path></svg>', y(i, "class", "rr-timeline__time svelte-19ke1iv"), y(p, "class", "rr-progress__step svelte-19ke1iv"), C(p, "width", e[13]), y(A, "class", "rr-progress__handler svelte-19ke1iv"), C(A, "left", e[13]), y(a, "class", "rr-progress svelte-19ke1iv"), I(a, "disabled", "skipping" === e[10]), y(E, "class", "rr-timeline__time svelte-19ke1iv"), y(n, "class", "rr-timeline svelte-19ke1iv"), y(M, "class", "svelte-19ke1iv"), y(_, "class", "svelte-19ke1iv"), y(D, "class", "rr-controller__btns svelte-19ke1iv"), y(t, "class", "rr-controller svelte-19ke1iv")
            }, m(o, u) {
                l(o, t, u), c(t, n), c(n, i), c(i, r), c(n, s), c(n, a), c(a, p), e[24](p), c(a, b);
                for (let e = 0; e < j.length; e += 1) j[e].m(a, null);
                c(a, N), c(a, A), e[25](a), c(n, w), c(n, E), c(E, T), c(t, S), c(t, D), c(D, M), Q.m(M, null), c(D, k);
                for (let e = 0; e < ee.length; e += 1) ee[e].m(D, null);
                c(D, F), K(O, D, null), c(D, L), c(D, _), V = !0, G || (W = [g(a, "click", e[15]), g(M, "click", e[4]), g(_, "click", e[28])], G = !0)
            }, p(e, t) {
                if ((!V || 64 & t[0]) && U !== (U = Dn(e[6]) + "") && v(r, U), (!V || 8192 & t[0]) && C(p, "width", e[13]), 512 & t[0]) {
                    let n;
                    for (X = e[9], n = 0; n < X.length; n += 1) {
                        const i = Ln(e, X, n);
                        j[n] ? j[n].p(i, t) : (j[n] = Vn(i), j[n].c(), j[n].m(a, N))
                    }
                    for (; n < j.length; n += 1) j[n].d(1);
                    j.length = X.length
                }
                if ((!V || 8192 & t[0]) && C(A, "left", e[13]), 1024 & t[0] && I(a, "disabled", "skipping" === e[10]), (!V || 256 & t[0]) && J !== (J = Dn(e[8].totalTime) + "") && v(T, J), z !== (z = H(e)) && (Q.d(1), Q = z(e), Q && (Q.c(), Q.m(M, null))), 1066 & t[0]) {
                    let n;
                    for (q = e[3], n = 0; n < q.length; n += 1) {
                        const i = Bn(e, q, n);
                        ee[n] ? ee[n].p(i, t) : (ee[n] = Un(i), ee[n].c(), ee[n].m(D, F))
                    }
                    for (; n < ee.length; n += 1) ee[n].d(1);
                    ee.length = q.length
                }
                const n = {};
                var i;
                1024 & t[0] && (n.disabled = "skipping" === e[10]), !B && 1 & t[0] && (B = !0, n.checked = e[0], i = () => B = !1, R.push(i)), O.$set(n)
            }, i(e) {
                V || (Z(O.$$.fragment, e), V = !0)
            }, o(e) {
                $(O.$$.fragment, e), V = !1
            }, d(n) {
                n && u(t), e[24](null), d(j, n), e[25](null), Q.d(), d(ee, n), Y(O), G = !1, o(W)
            }
        }
    }

    function Vn(e) {
        let t, n;
        return {
            c() {
                t = h("div"), y(t, "title", n = e[36].name), C(t, "width", "10px"), C(t, "height", "5px"), C(t, "position", "absolute"), C(t, "top", "2px"), C(t, "transform", "translate(-50%, -50%)"), C(t, "background", e[36].background), C(t, "left", e[36].position)
            }, m(e, n) {
                l(e, t, n)
            }, p(e, i) {
                512 & i[0] && n !== (n = e[36].name) && y(t, "title", n), 512 & i[0] && C(t, "background", e[36].background), 512 & i[0] && C(t, "left", e[36].position)
            }, d(e) {
                e && u(t)
            }
        }
    }

    function Gn(e) {
        let t, n;
        return {
            c() {
                t = p("svg"), n = p("path"), y(n, "d", "M170.65984 896l0-768 640 384zM644.66944\n              512l-388.66944-233.32864 0 466.65728z"), y(t, "class", "icon"), y(t, "viewBox", "0 0 1024 1024"), y(t, "version", "1.1"), y(t, "xmlns", "http://www.w3.org/2000/svg"), y(t, "xmlns:xlink", "http://www.w3.org/1999/xlink"), y(t, "width", "16"), y(t, "height", "16")
            }, m(e, i) {
                l(e, t, i), c(t, n)
            }, d(e) {
                e && u(t)
            }
        }
    }

    function Wn(e) {
        let t, n;
        return {
            c() {
                t = p("svg"), n = p("path"), y(n, "d", "M682.65984 128q53.00224 0 90.50112 37.49888t37.49888 90.50112l0\n              512q0 53.00224-37.49888 90.50112t-90.50112\n              37.49888-90.50112-37.49888-37.49888-90.50112l0-512q0-53.00224\n              37.49888-90.50112t90.50112-37.49888zM341.34016 128q53.00224 0\n              90.50112 37.49888t37.49888 90.50112l0 512q0 53.00224-37.49888\n              90.50112t-90.50112\n              37.49888-90.50112-37.49888-37.49888-90.50112l0-512q0-53.00224\n              37.49888-90.50112t90.50112-37.49888zM341.34016 213.34016q-17.67424\n              0-30.16704 12.4928t-12.4928 30.16704l0 512q0 17.67424 12.4928\n              30.16704t30.16704 12.4928 30.16704-12.4928\n              12.4928-30.16704l0-512q0-17.67424-12.4928-30.16704t-30.16704-12.4928zM682.65984\n              213.34016q-17.67424 0-30.16704 12.4928t-12.4928 30.16704l0 512q0\n              17.67424 12.4928 30.16704t30.16704 12.4928 30.16704-12.4928\n              12.4928-30.16704l0-512q0-17.67424-12.4928-30.16704t-30.16704-12.4928z"), y(t, "class", "icon"), y(t, "viewBox", "0 0 1024 1024"), y(t, "version", "1.1"), y(t, "xmlns", "http://www.w3.org/2000/svg"), y(t, "xmlns:xlink", "http://www.w3.org/1999/xlink"), y(t, "width", "16"), y(t, "height", "16")
            }, m(e, i) {
                l(e, t, i), c(t, n)
            }, d(e) {
                e && u(t)
            }
        }
    }

    function Un(e) {
        let t, n, i, o, r, s, a = e[33] + "";

        function d() {
            return e[26](e[33])
        }

        return {
            c() {
                t = h("button"), n = m(a), i = m("x"), t.disabled = o = "skipping" === e[10], y(t, "class", "svelte-19ke1iv"), I(t, "active", e[33] === e[1] && "skipping" !== e[10])
            }, m(e, o) {
                l(e, t, o), c(t, n), c(t, i), r || (s = g(t, "click", d), r = !0)
            }, p(i, r) {
                e = i, 8 & r[0] && a !== (a = e[33] + "") && v(n, a), 1024 & r[0] && o !== (o = "skipping" === e[10]) && (t.disabled = o), 1034 & r[0] && I(t, "active", e[33] === e[1] && "skipping" !== e[10])
            }, d(e) {
                e && u(t), r = !1, s()
            }
        }
    }

    function Zn(e) {
        let t, n, i = e[2] && _n(e);
        return {
            c() {
                i && i.c(), t = m("")
            }, m(e, o) {
                i && i.m(e, o), l(e, t, o), n = !0
            }, p(e, n) {
                e[2] ? i ? (i.p(e, n), 4 & n[0] && Z(i, 1)) : (i = _n(e), i.c(), Z(i, 1), i.m(t.parentNode, t)) : i && (W(), $(i, 1, 1, (() => {
                    i = null
                })), U())
            }, i(e) {
                n || (Z(i), n = !0)
            }, o(e) {
                $(i), n = !1
            }, d(e) {
                i && i.d(e), e && u(t)
            }
        }
    }

    function $n(e, t, n) {
        const i = T();
        let o, r, s, a, c, l, u,
            d, {replayer: h} = t, {showController: p} = t, {autoPlay: m} = t, {skipInactive: f} = t, {speedOption: g} = t, {speed: y = (g.length ? g[0] : 1)} = t, {tags: v = {}} = t,
            C = 0, I = null;
        const b = () => {
            I && (cancelAnimationFrame(I), I = null)
        }, N = () => {
            "paused" === o && (c ? (h.play(), c = !1) : h.play(C))
        }, S = () => {
            "playing" === o && h.pause()
        }, D = (e, t) => {
            n(6, C = e);
            ("boolean" == typeof t ? t : "playing" === o) ? h.play(e) : h.pause(e)
        }, R = e => {
            let t = "playing" === o;
            n(1, y = e), t && h.pause(), h.setConfig({speed: y}), t && h.play(C)
        };
        var M;
        w((() => {
            n(7, o = h.service.state.value), n(10, r = h.speedService.state.value), h.on("state-change", (e => {
                const {player: t, speed: i} = e;
                if ((null == t ? void 0 : t.value) && o !== t.value) switch (n(7, o = t.value), o) {
                    case"playing":
                        b(), I = requestAnimationFrame((function e() {
                            n(6, C = h.getCurrentTime()), C < l.totalTime && (I = requestAnimationFrame(e))
                        }));
                        break;
                    case"paused":
                        b()
                }
                (null == i ? void 0 : i.value) && r !== i.value && n(10, r = i.value)
            })), h.on("finish", (() => {
                c = !0
            })), m && h.play()
        })), M = () => {
            f !== h.config.skipInactive && h.setConfig({skipInactive: f})
        }, A().$$.after_update.push(M), E((() => {
            h.pause(), b()
        }));
        return e.$$set = e => {
            "replayer" in e && n(16, h = e.replayer), "showController" in e && n(2, p = e.showController), "autoPlay" in e && n(17, m = e.autoPlay), "skipInactive" in e && n(0, f = e.skipInactive), "speedOption" in e && n(3, g = e.speedOption), "speed" in e && n(1, y = e.speed), "tags" in e && n(18, v = e.tags)
        }, e.$$.update = () => {
            if (64 & e.$$.dirty[0] && i("ui-update-current-time", {payload: C}), 128 & e.$$.dirty[0] && i("ui-update-player-state", {payload: o}), 65536 & e.$$.dirty[0] && n(8, l = h.getMetaData()), 320 & e.$$.dirty[0]) {
                const e = Math.min(1, C / l.totalTime);
                n(13, u = 100 * e + "%"), i("ui-update-progress", {payload: e})
            }
            327680 & e.$$.dirty[0] && n(9, d = (() => {
                const {context: e} = h.service.state, t = e.events.length, n = e.events[0].timestamp,
                    i = e.events[t - 1].timestamp, o = [];
                return e.events.forEach((e => {
                    if (e.type === be.Custom) {
                        const a = {
                            name: e.data.tag,
                            background: v[e.data.tag] || "rgb(73, 80, 246)",
                            position: `${t = n, r = i, s = e.timestamp, (100 - (r - s) / (r - t) * 100).toFixed(2)}%`
                        };
                        o.push(a)
                    }
                    var t, r, s
                })), o
            })())
        }, [f, y, p, g, () => {
            switch (o) {
                case"playing":
                    S();
                    break;
                case"paused":
                    N()
            }
        }, R, C, o, l, d, r, s, a, u, i, e => {
            if ("skipping" === r) return;
            const t = s.getBoundingClientRect();
            let n = (e.clientX - t.left) / t.width;
            n < 0 ? n = 0 : n > 1 && (n = 1);
            const i = l.totalTime * n;
            c = !1, D(i)
        }, h, m, v, N, S, D, () => {
            n(0, f = !f)
        }, () => Promise.resolve().then((() => {
            n(8, l = h.getMetaData())
        })), function (e) {
            x[e ? "unshift" : "push"]((() => {
                a = e, n(12, a)
            }))
        }, function (e) {
            x[e ? "unshift" : "push"]((() => {
                s = e, n(11, s)
            }))
        }, e => R(e), function (e) {
            f = e, n(0, f)
        }, () => i("fullscreen")]
    }

    class Pn extends j {
        constructor(e) {
            super(), X(this, e, $n, Zn, s, {
                replayer: 16,
                showController: 2,
                autoPlay: 17,
                skipInactive: 0,
                speedOption: 3,
                speed: 1,
                tags: 18,
                toggle: 4,
                play: 19,
                pause: 20,
                goto: 21,
                setSpeed: 5,
                toggleSkipInactive: 22,
                triggerUpdateMeta: 23
            }, null, [-1, -1])
        }

        get toggle() {
            return this.$$.ctx[4]
        }

        get play() {
            return this.$$.ctx[19]
        }

        get pause() {
            return this.$$.ctx[20]
        }

        get goto() {
            return this.$$.ctx[21]
        }

        get setSpeed() {
            return this.$$.ctx[5]
        }

        get toggleSkipInactive() {
            return this.$$.ctx[22]
        }

        get triggerUpdateMeta() {
            return this.$$.ctx[23]
        }
    }

    function Kn(e) {
        let t, n, i = {
            replayer: e[6],
            showController: e[3],
            autoPlay: e[1],
            speedOption: e[2],
            skipInactive: e[0],
            tags: e[4]
        };
        return t = new Pn({props: i}), e[29](t), t.$on("fullscreen", e[30]), {
            c() {
                P(t.$$.fragment)
            }, m(e, i) {
                K(t, e, i), n = !0
            }, p(e, n) {
                const i = {};
                64 & n[0] && (i.replayer = e[6]), 8 & n[0] && (i.showController = e[3]), 2 & n[0] && (i.autoPlay = e[1]), 4 & n[0] && (i.speedOption = e[2]), 1 & n[0] && (i.skipInactive = e[0]), 16 & n[0] && (i.tags = e[4]), t.$set(i)
            }, i(e) {
                n || (Z(t.$$.fragment, e), n = !0)
            }, o(e) {
                $(t.$$.fragment, e), n = !1
            }, d(n) {
                e[29](null), Y(t, n)
            }
        }
    }

    function Yn(e) {
        let t, n, i, o, r = e[6] && Kn(e);
        return {
            c() {
                t = h("div"), n = h("div"), i = f(), r && r.c(), y(n, "class", "rr-player__frame"), y(n, "style", e[10]), y(t, "class", "rr-player"), y(t, "style", e[11])
            }, m(s, a) {
                l(s, t, a), c(t, n), e[28](n), c(t, i), r && r.m(t, null), e[31](t), o = !0
            }, p(e, i) {
                (!o || 1024 & i[0]) && y(n, "style", e[10]), e[6] ? r ? (r.p(e, i), 64 & i[0] && Z(r, 1)) : (r = Kn(e), r.c(), Z(r, 1), r.m(t, null)) : r && (W(), $(r, 1, 1, (() => {
                    r = null
                })), U()), (!o || 2048 & i[0]) && y(t, "style", e[11])
            }, i(e) {
                o || (Z(r), o = !0)
            }, o(e) {
                $(r), o = !1
            }, d(n) {
                n && u(t), e[28](null), r && r.d(), e[31](null)
            }
        }
    }

    function Jn(e, n, i) {
        let o, {width: r = 1024} = n, {height: s = 576} = n, {events: c = []} = n, {skipInactive: l = !0} = n, {autoPlay: u = !0} = n, {speedOption: d = [1, 2, 4, 8]} = n, {speed: h = 1} = n, {showController: p = !0} = n, {tags: m = {}} = n;
        let f, g, y, v, C, I, b = r, N = s;
        const A = (e, t) => {
            const n = r / t.width, i = s / t.height;
            e.style.transform = `scale(${Math.min(n, i, 1)})translate(-50%, -50%)`
        }, T = () => {
            var e;
            f && (Rn() ? document.exitFullscreen ? document.exitFullscreen() : document.mozExitFullscreen ? document.mozExitFullscreen() : document.webkitExitFullscreen ? document.webkitExitFullscreen() : document.msExitFullscreen && document.msExitFullscreen() : (e = f).requestFullscreen ? e.requestFullscreen() : e.mozRequestFullScreen ? e.mozRequestFullScreen() : e.webkitRequestFullscreen ? e.webkitRequestFullscreen() : e.msRequestFullscreen && e.msRequestFullscreen())
        };
        w((() => {
            if (void 0 !== d && "array" !== Mn(d)) throw new Error("speedOption must be array");
            if (d.forEach((e => {
                if ("number" !== Mn(e)) throw new Error("item of speedOption must be number")
            })), d.indexOf(h) < 0) throw new Error(`speed must be one of speedOption,\n        current config:\n        {\n          ...\n          speed: ${h},\n          speedOption: [${d.toString()}]\n          ...\n        }\n        `);
            var e;
            i(6, o = new wn(c, Object.assign({speed: h, root: g, unpackFn: Yt}, n))), o.on("resize", (e => {
                A(o.wrapper, e)
            })), e = () => {
                Rn() ? setTimeout((() => {
                    b = r, N = s, i(12, r = f.offsetWidth), i(13, s = f.offsetHeight), A(o.wrapper, {
                        width: o.iframe.offsetWidth,
                        height: o.iframe.offsetHeight
                    })
                }), 0) : (i(12, r = b), i(13, s = N), A(o.wrapper, {
                    width: o.iframe.offsetWidth,
                    height: o.iframe.offsetHeight
                }))
            }, document.addEventListener("fullscreenchange", e), document.addEventListener("webkitfullscreenchange", e), document.addEventListener("mozfullscreenchange", e), document.addEventListener("MSFullscreenChange", e), y = () => {
                document.removeEventListener("fullscreenchange", e), document.removeEventListener("webkitfullscreenchange", e), document.removeEventListener("mozfullscreenchange", e), document.removeEventListener("MSFullscreenChange", e)
            }
        })), E((() => {
            y && y()
        }));
        return e.$$set = e => {
            i(36, n = t(t({}, n), a(e))), "width" in e && i(12, r = e.width), "height" in e && i(13, s = e.height), "events" in e && i(14, c = e.events), "skipInactive" in e && i(0, l = e.skipInactive), "autoPlay" in e && i(1, u = e.autoPlay), "speedOption" in e && i(2, d = e.speedOption), "speed" in e && i(15, h = e.speed), "showController" in e && i(3, p = e.showController), "tags" in e && i(4, m = e.tags)
        }, e.$$.update = () => {
            12288 & e.$$.dirty[0] && i(10, C = En({
                width: `${r}px`,
                height: `${s}px`
            })), 12296 & e.$$.dirty[0] && i(11, I = En({width: `${r}px`, height: `${s + (p ? 80 : 0)}px`}))
        }, n = a(n), [l, u, d, p, m, T, o, f, g, v, C, I, r, s, c, h, () => o.getMirror(), () => {
            A(o.wrapper, {width: o.iframe.offsetWidth, height: o.iframe.offsetHeight})
        }, (e, t) => {
            switch (o.on(e, t), e) {
                case"ui-update-current-time":
                case"ui-update-progress":
                case"ui-update-player-state":
                    v.$on(e, (({detail: e}) => t(e)))
            }
        }, e => {
            o.addEvent(e), v.triggerUpdateMeta()
        }, () => o.getMetaData(), () => o, () => {
            v.toggle()
        }, e => {
            v.setSpeed(e)
        }, () => {
            v.toggleSkipInactive()
        }, () => {
            v.play()
        }, () => {
            v.pause()
        }, (e, t) => {
            v.goto(e, t)
        }, function (e) {
            x[e ? "unshift" : "push"]((() => {
                g = e, i(8, g)
            }))
        }, function (e) {
            x[e ? "unshift" : "push"]((() => {
                v = e, i(9, v)
            }))
        }, () => T(), function (e) {
            x[e ? "unshift" : "push"]((() => {
                f = e, i(7, f)
            }))
        }]
    }

    class Xn extends j {
        constructor(e) {
            super(), X(this, e, Jn, Yn, s, {
                width: 12,
                height: 13,
                events: 14,
                skipInactive: 0,
                autoPlay: 1,
                speedOption: 2,
                speed: 15,
                showController: 3,
                tags: 4,
                getMirror: 16,
                triggerResize: 17,
                toggleFullscreen: 5,
                addEventListener: 18,
                addEvent: 19,
                getMetaData: 20,
                getReplayer: 21,
                toggle: 22,
                setSpeed: 23,
                toggleSkipInactive: 24,
                play: 25,
                pause: 26,
                goto: 27
            }, null, [-1, -1])
        }

        get getMirror() {
            return this.$$.ctx[16]
        }

        get triggerResize() {
            return this.$$.ctx[17]
        }

        get toggleFullscreen() {
            return this.$$.ctx[5]
        }

        get addEventListener() {
            return this.$$.ctx[18]
        }

        get addEvent() {
            return this.$$.ctx[19]
        }

        get getMetaData() {
            return this.$$.ctx[20]
        }

        get getReplayer() {
            return this.$$.ctx[21]
        }

        get toggle() {
            return this.$$.ctx[22]
        }

        get setSpeed() {
            return this.$$.ctx[23]
        }

        get toggleSkipInactive() {
            return this.$$.ctx[24]
        }

        get play() {
            return this.$$.ctx[25]
        }

        get pause() {
            return this.$$.ctx[26]
        }

        get goto() {
            return this.$$.ctx[27]
        }
    }

    return class extends Xn {
        constructor(e) {
            super({target: e.target, props: e.data || e.props})
        }
    }
}();
//# sourceMappingURL=index.js.map