/* eslint-disable no-restricted-globals */

/**
 * This file contains the tracking sdk for users.
 * Minify this file before pasting it in sdkSnippet.ts
 */

(function () {
    // cuid js
    // eslint-disable-next-line
    !function (e) { if ("object" == typeof exports && "undefined" != typeof module) module.exports = e(); else if ("function" == typeof define && define.amd) define([], e); else { ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).cuid = e() } }(function () { return function o(f, u, s) { function a(n, e) { if (!u[n]) { if (!f[n]) { var t = "function" == typeof require && require; if (!e && t) return t(n, !0); if (l) return l(n, !0); var r = new Error("Cannot find module '" + n + "'"); throw r.code = "MODULE_NOT_FOUND", r } var i = u[n] = { exports: {} }; f[n][0].call(i.exports, function (e) { return a(f[n][1][e] || e) }, i, i.exports, o, f, u, s) } return u[n].exports } for (var l = "function" == typeof require && require, e = 0; e < s.length; e++)a(s[e]); return a }({ 1: [function (e, n, t) { var i = e("./lib/fingerprint.js"), r = e("./lib/pad.js"), o = e("./lib/getRandomValue.js"), f = 0, u = 4, s = 36, a = Math.pow(s, u); function l() { return r((o() * a << 0).toString(s), u) } function d() { return f = f < a ? f : 0, ++f - 1 } function p() { return "c" + (new Date).getTime().toString(s) + r(d().toString(s), u) + i() + (l() + l()) } p.slug = function () { var e = (new Date).getTime().toString(36), n = d().toString(36).slice(-4), t = i().slice(0, 1) + i().slice(-1), r = l().slice(-2); return e.slice(-2) + n + t + r }, p.isCuid = function (e) { return "string" == typeof e && !!e.startsWith("c") }, p.isSlug = function (e) { if ("string" != typeof e) return !1; var n = e.length; return 7 <= n && n <= 10 }, p.fingerprint = i, n.exports = p }, { "./lib/fingerprint.js": 2, "./lib/getRandomValue.js": 3, "./lib/pad.js": 4 }], 2: [function (e, n, t) { var r = e("./pad.js"), i = "object" == typeof window ? window : self, o = Object.keys(i).length, f = r(((navigator.mimeTypes ? navigator.mimeTypes.length : 0) + navigator.userAgent.length).toString(36) + o.toString(36), 4); n.exports = function () { return f } }, { "./pad.js": 4 }], 3: [function (e, n, t) { var r, i = "undefined" != typeof window && (window.crypto || window.msCrypto) || "undefined" != typeof self && self.crypto; if (i) { var o = Math.pow(2, 32) - 1; r = function () { return Math.abs(i.getRandomValues(new Uint32Array(1))[0] / o) } } else r = Math.random; n.exports = r }, {}], 4: [function (e, n, t) { n.exports = function (e, n) { var t = "000000000" + e; return t.substr(t.length - n) } }, {}] }, {}, [1])(1) });

    var sessionIdKey = "__trk_session_id"
    var userIdKey = "__trk_user_id"

    if (!sessionStorage.getItem(sessionIdKey)) {
        sessionStorage.setItem(sessionIdKey, Date.now() + window.cuid())
    }
    var userId = getUserId()

    function getUserId() {
        if (!localStorage.getItem(userIdKey)) {
            localStorage.setItem(userIdKey, 'temp:' + Date.now() + window.cuid())
        }

        return localStorage.getItem(userIdKey)
    }

    function trackEvent(data) {
        data.apiKey = "{{API_KEY}}"
        data.userId = data.userId !== undefined ? userId : userId
        data.referrer = data.referrer !== undefined ? data.referrer : document.referrer
        data.page = data.page !== undefined ? data.page : window.location.href
        data.eventTime = data.eventTime !== undefined ? data.eventTime : Date.now()
        data.sessionId = data.sessionId !== undefined ? data.sessionId : sessionStorage.getItem(sessionIdKey)
        return fetch("{{BASE_URL}}/api/tracking-service/v1/public/events/", {
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data),
            method: "POST"
        })
    }

    var _wr = function (type) {
        var orig = history[type];
        return function () {
            var rv = orig.apply(this, arguments);
            var e = new Event(type);
            e.arguments = arguments;
            window.dispatchEvent(e);
            return rv;
        };
    };
    history.pushState = _wr('pushState');
    history.replaceState = _wr('replaceState');

    var onPageNavigate = function (event) {
        trackEvent({
            eventName: "PAGE_VIEW",
            context: {},
        })
    }

    window.addEventListener("popstate", onPageNavigate);
    window.addEventListener("pushState", onPageNavigate);
    window.addEventListener("replaceState", onPageNavigate);
    window.addEventListener("load", onPageNavigate)

    window.__trk = {
        setUserId: function (id) {
            userId = (id && id.toString()) || getUserId()
            if (id) {
                localStorage.removeItem(userIdKey)
            }
        },
        trackEvent: trackEvent
    }
})()