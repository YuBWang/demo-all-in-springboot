var rrweb = (function (exports) {
    'use strict';

    var NodeType$2;
    (function(NodeType2) {
        NodeType2[NodeType2["Document"] = 0] = "Document";
        NodeType2[NodeType2["DocumentType"] = 1] = "DocumentType";
        NodeType2[NodeType2["Element"] = 2] = "Element";
        NodeType2[NodeType2["Text"] = 3] = "Text";
        NodeType2[NodeType2["CDATA"] = 4] = "CDATA";
        NodeType2[NodeType2["Comment"] = 5] = "Comment";
    })(NodeType$2 || (NodeType$2 = {}));
    function isElement(n) {
        return n.nodeType === n.ELEMENT_NODE;
    }
    function isShadowRoot(n) {
        var host = n === null || n === void 0 ? void 0 : n.host;
        return Boolean((host === null || host === void 0 ? void 0 : host.shadowRoot) === n);
    }
    function isNativeShadowDom(shadowRoot) {
        return Object.prototype.toString.call(shadowRoot) === "[object ShadowRoot]";
    }
    var Mirror$2 = function() {
        function Mirror2() {
            this.idNodeMap = /* @__PURE__ */ new Map();
            this.nodeMetaMap = /* @__PURE__ */ new WeakMap();
        }
        Mirror2.prototype.getId = function(n) {
            var _a;
            if (!n)
                return -1;
            var id = (_a = this.getMeta(n)) === null || _a === void 0 ? void 0 : _a.id;
            return id !== null && id !== void 0 ? id : -1;
        };
        Mirror2.prototype.getNode = function(id) {
            return this.idNodeMap.get(id) || null;
        };
        Mirror2.prototype.getIds = function() {
            return Array.from(this.idNodeMap.keys());
        };
        Mirror2.prototype.getMeta = function(n) {
            return this.nodeMetaMap.get(n) || null;
        };
        Mirror2.prototype.removeNodeFromMap = function(n) {
            var _this = this;
            var id = this.getId(n);
            this.idNodeMap["delete"](id);
            if (n.childNodes) {
                n.childNodes.forEach(function(childNode) {
                    return _this.removeNodeFromMap(childNode);
                });
            }
        };
        Mirror2.prototype.has = function(id) {
            return this.idNodeMap.has(id);
        };
        Mirror2.prototype.hasNode = function(node) {
            return this.nodeMetaMap.has(node);
        };
        Mirror2.prototype.add = function(n, meta) {
            var id = meta.id;
            this.idNodeMap.set(id, n);
            this.nodeMetaMap.set(n, meta);
        };
        Mirror2.prototype.replace = function(id, n) {
            this.idNodeMap.set(id, n);
        };
        Mirror2.prototype.reset = function() {
            this.idNodeMap = /* @__PURE__ */ new Map();
            this.nodeMetaMap = /* @__PURE__ */ new WeakMap();
        };
        return Mirror2;
    }();
    function createMirror$2() {
        return new Mirror$2();
    }
    function maskInputValue(_a) {
        var maskInputOptions = _a.maskInputOptions, tagName = _a.tagName, type = _a.type, value = _a.value, maskInputFn = _a.maskInputFn;
        var text = value || "";
        if (maskInputOptions[tagName.toLowerCase()] || maskInputOptions[type]) {
            if (maskInputFn) {
                text = maskInputFn(text);
            } else {
                text = "*".repeat(text.length);
            }
        }
        return text;
    }
    var ORIGINAL_ATTRIBUTE_NAME$1 = "__rrweb_original__";
    function is2DCanvasBlank(canvas) {
        var ctx = canvas.getContext("2d");
        if (!ctx)
            return true;
        var chunkSize = 50;
        for (var x = 0; x < canvas.width; x += chunkSize) {
            for (var y = 0; y < canvas.height; y += chunkSize) {
                var getImageData = ctx.getImageData;
                var originalGetImageData = ORIGINAL_ATTRIBUTE_NAME$1 in getImageData ? getImageData[ORIGINAL_ATTRIBUTE_NAME$1] : getImageData;
                var pixelBuffer = new Uint32Array(originalGetImageData.call(ctx, x, y, Math.min(chunkSize, canvas.width - x), Math.min(chunkSize, canvas.height - y)).data.buffer);
                if (pixelBuffer.some(function(pixel) {
                    return pixel !== 0;
                }))
                    return false;
            }
        }
        return true;
    }
    var _id = 1;
    var tagNameRegex = new RegExp("[^a-z0-9-_:]");
    var IGNORED_NODE = -2;
    function genId() {
        return _id++;
    }
    function getValidTagName$1(element) {
        if (element instanceof HTMLFormElement) {
            return "form";
        }
        var processedTagName = element.tagName.toLowerCase().trim();
        if (tagNameRegex.test(processedTagName)) {
            return "div";
        }
        return processedTagName;
    }
    function getCssRulesString(s) {
        try {
            var rules = s.rules || s.cssRules;
            return rules ? Array.from(rules).map(getCssRuleString).join("") : null;
        } catch (error) {
            return null;
        }
    }
    function getCssRuleString(rule) {
        var cssStringified = rule.cssText;
        if (isCSSImportRule(rule)) {
            try {
                cssStringified = getCssRulesString(rule.styleSheet) || cssStringified;
            } catch (_a) {
            }
        }
        return cssStringified;
    }
    function isCSSImportRule(rule) {
        return "styleSheet" in rule;
    }
    function stringifyStyleSheet(sheet) {
        return sheet.cssRules ? Array.from(sheet.cssRules).map(function(rule) {
            return rule.cssText || "";
        }).join("") : "";
    }
    function extractOrigin(url) {
        var origin = "";
        if (url.indexOf("//") > -1) {
            origin = url.split("/").slice(0, 3).join("/");
        } else {
            origin = url.split("/")[0];
        }
        origin = origin.split("?")[0];
        return origin;
    }
    var canvasService;
    var canvasCtx;
    var URL_IN_CSS_REF = /url\((?:(')([^']*)'|(")(.*?)"|([^)]*))\)/gm;
    var RELATIVE_PATH = /^(?!www\.|(?:http|ftp)s?:\/\/|[A-Za-z]:\\|\/\/|#).*/;
    var DATA_URI = /^(data:)([^,]*),(.*)/i;
    function absoluteToStylesheet(cssText, href) {
        return (cssText || "").replace(URL_IN_CSS_REF, function(origin, quote1, path1, quote2, path2, path3) {
            var filePath = path1 || path2 || path3;
            var maybeQuote = quote1 || quote2 || "";
            if (!filePath) {
                return origin;
            }
            if (!RELATIVE_PATH.test(filePath)) {
                return "url(".concat(maybeQuote).concat(filePath).concat(maybeQuote, ")");
            }
            if (DATA_URI.test(filePath)) {
                return "url(".concat(maybeQuote).concat(filePath).concat(maybeQuote, ")");
            }
            if (filePath[0] === "/") {
                return "url(".concat(maybeQuote).concat(extractOrigin(href) + filePath).concat(maybeQuote, ")");
            }
            var stack = href.split("/");
            var parts = filePath.split("/");
            stack.pop();
            for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
                var part = parts_1[_i];
                if (part === ".") {
                    continue;
                } else if (part === "..") {
                    stack.pop();
                } else {
                    stack.push(part);
                }
            }
            return "url(".concat(maybeQuote).concat(stack.join("/")).concat(maybeQuote, ")");
        });
    }
    var SRCSET_NOT_SPACES = /^[^ \t\n\r\u000c]+/;
    var SRCSET_COMMAS_OR_SPACES = /^[, \t\n\r\u000c]+/;
    function getAbsoluteSrcsetString(doc, attributeValue) {
        if (attributeValue.trim() === "") {
            return attributeValue;
        }
        var pos = 0;
        function collectCharacters(regEx) {
            var chars;
            var match = regEx.exec(attributeValue.substring(pos));
            if (match) {
                chars = match[0];
                pos += chars.length;
                return chars;
            }
            return "";
        }
        var output = [];
        while (true) {
            collectCharacters(SRCSET_COMMAS_OR_SPACES);
            if (pos >= attributeValue.length) {
                break;
            }
            var url = collectCharacters(SRCSET_NOT_SPACES);
            if (url.slice(-1) === ",") {
                url = absoluteToDoc(doc, url.substring(0, url.length - 1));
                output.push(url);
            } else {
                var descriptorsStr = "";
                url = absoluteToDoc(doc, url);
                var inParens = false;
                while (true) {
                    var c = attributeValue.charAt(pos);
                    if (c === "") {
                        output.push((url + descriptorsStr).trim());
                        break;
                    } else if (!inParens) {
                        if (c === ",") {
                            pos += 1;
                            output.push((url + descriptorsStr).trim());
                            break;
                        } else if (c === "(") {
                            inParens = true;
                        }
                    } else {
                        if (c === ")") {
                            inParens = false;
                        }
                    }
                    descriptorsStr += c;
                    pos += 1;
                }
            }
        }
        return output.join(", ");
    }
    function absoluteToDoc(doc, attributeValue) {
        if (!attributeValue || attributeValue.trim() === "") {
            return attributeValue;
        }
        var a = doc.createElement("a");
        a.href = attributeValue;
        return a.href;
    }
    function isSVGElement(el) {
        return Boolean(el.tagName === "svg" || el.ownerSVGElement);
    }
    function getHref() {
        var a = document.createElement("a");
        a.href = "";
        return a.href;
    }
    function transformAttribute(doc, tagName, name, value) {
        if (name === "src" || name === "href" && value && !(tagName === "use" && value[0] === "#")) {
            return absoluteToDoc(doc, value);
        } else if (name === "xlink:href" && value && value[0] !== "#") {
            return absoluteToDoc(doc, value);
        } else if (name === "background" && value && (tagName === "table" || tagName === "td" || tagName === "th")) {
            return absoluteToDoc(doc, value);
        } else if (name === "srcset" && value) {
            return getAbsoluteSrcsetString(doc, value);
        } else if (name === "style" && value) {
            return absoluteToStylesheet(value, getHref());
        } else if (tagName === "object" && name === "data" && value) {
            return absoluteToDoc(doc, value);
        } else {
            return value;
        }
    }
    function _isBlockedElement(element, blockClass, blockSelector) {
        if (typeof blockClass === "string") {
            if (element.classList.contains(blockClass)) {
                return true;
            }
        } else {
            for (var eIndex = element.classList.length; eIndex--; ) {
                var className = element.classList[eIndex];
                if (blockClass.test(className)) {
                    return true;
                }
            }
        }
        if (blockSelector) {
            return element.matches(blockSelector);
        }
        return false;
    }
    function classMatchesRegex(node, regex, checkAncestors) {
        if (!node)
            return false;
        if (node.nodeType !== node.ELEMENT_NODE) {
            if (!checkAncestors)
                return false;
            return classMatchesRegex(node.parentNode, regex, checkAncestors);
        }
        for (var eIndex = node.classList.length; eIndex--; ) {
            var className = node.classList[eIndex];
            if (regex.test(className)) {
                return true;
            }
        }
        if (!checkAncestors)
            return false;
        return classMatchesRegex(node.parentNode, regex, checkAncestors);
    }
    function needMaskingText(node, maskTextClass, maskTextSelector) {
        var el = node.nodeType === node.ELEMENT_NODE ? node : node.parentElement;
        if (el === null)
            return false;
        if (typeof maskTextClass === "string") {
            if (el.classList.contains(maskTextClass))
                return true;
            if (el.closest(".".concat(maskTextClass)))
                return true;
        } else {
            if (classMatchesRegex(el, maskTextClass, true))
                return true;
        }
        if (maskTextSelector) {
            if (el.matches(maskTextSelector))
                return true;
            if (el.closest(maskTextSelector))
                return true;
        }
        return false;
    }
    function onceIframeLoaded(iframeEl, listener, iframeLoadTimeout) {
        var win = iframeEl.contentWindow;
        if (!win) {
            return;
        }
        var fired = false;
        var readyState;
        try {
            readyState = win.document.readyState;
        } catch (error) {
            return;
        }
        if (readyState !== "complete") {
            var timer_1 = setTimeout(function() {
                if (!fired) {
                    listener();
                    fired = true;
                }
            }, iframeLoadTimeout);
            iframeEl.addEventListener("load", function() {
                clearTimeout(timer_1);
                fired = true;
                listener();
            });
            return;
        }
        var blankUrl = "about:blank";
        if (win.location.href !== blankUrl || iframeEl.src === blankUrl || iframeEl.src === "") {
            setTimeout(listener, 0);
            return;
        }
        iframeEl.addEventListener("load", listener);
    }
    function isStylesheetLoaded(link) {
        if (!link.getAttribute("href"))
            return true;
        return link.sheet !== null;
    }
    function onceStylesheetLoaded(link, listener, styleSheetLoadTimeout) {
        var fired = false;
        var styleSheetLoaded;
        try {
            styleSheetLoaded = link.sheet;
        } catch (error) {
            return;
        }
        if (styleSheetLoaded)
            return;
        var timer = setTimeout(function() {
            if (!fired) {
                listener();
                fired = true;
            }
        }, styleSheetLoadTimeout);
        link.addEventListener("load", function() {
            clearTimeout(timer);
            fired = true;
            listener();
        });
    }
    function serializeNode(n, options) {
        var doc = options.doc, mirror = options.mirror, blockClass = options.blockClass, blockSelector = options.blockSelector, maskTextClass = options.maskTextClass, maskTextSelector = options.maskTextSelector, inlineStylesheet = options.inlineStylesheet, _a = options.maskInputOptions, maskInputOptions = _a === void 0 ? {} : _a, maskTextFn = options.maskTextFn, maskInputFn = options.maskInputFn, _b = options.dataURLOptions, dataURLOptions = _b === void 0 ? {} : _b, inlineImages = options.inlineImages, recordCanvas = options.recordCanvas, keepIframeSrcFn = options.keepIframeSrcFn, _c = options.newlyAddedElement, newlyAddedElement = _c === void 0 ? false : _c;
        var rootId = getRootId(doc, mirror);
        switch (n.nodeType) {
            case n.DOCUMENT_NODE:
                if (n.compatMode !== "CSS1Compat") {
                    return {
                        type: NodeType$2.Document,
                        childNodes: [],
                        compatMode: n.compatMode,
                        rootId
                    };
                } else {
                    return {
                        type: NodeType$2.Document,
                        childNodes: [],
                        rootId
                    };
                }
            case n.DOCUMENT_TYPE_NODE:
                return {
                    type: NodeType$2.DocumentType,
                    name: n.name,
                    publicId: n.publicId,
                    systemId: n.systemId,
                    rootId
                };
            case n.ELEMENT_NODE:
                return serializeElementNode(n, {
                    doc,
                    blockClass,
                    blockSelector,
                    inlineStylesheet,
                    maskInputOptions,
                    maskInputFn,
                    dataURLOptions,
                    inlineImages,
                    recordCanvas,
                    keepIframeSrcFn,
                    newlyAddedElement,
                    rootId
                });
            case n.TEXT_NODE:
                return serializeTextNode(n, {
                    maskTextClass,
                    maskTextSelector,
                    maskTextFn,
                    rootId
                });
            case n.CDATA_SECTION_NODE:
                return {
                    type: NodeType$2.CDATA,
                    textContent: "",
                    rootId
                };
            case n.COMMENT_NODE:
                return {
                    type: NodeType$2.Comment,
                    textContent: n.textContent || "",
                    rootId
                };
            default:
                return false;
        }
    }
    function getRootId(doc, mirror) {
        if (!mirror.hasNode(doc))
            return void 0;
        var docId = mirror.getId(doc);
        return docId === 1 ? void 0 : docId;
    }
    function serializeTextNode(n, options) {
        var _a;
        var maskTextClass = options.maskTextClass, maskTextSelector = options.maskTextSelector, maskTextFn = options.maskTextFn, rootId = options.rootId;
        var parentTagName = n.parentNode && n.parentNode.tagName;
        var textContent = n.textContent;
        var isStyle = parentTagName === "STYLE" ? true : void 0;
        var isScript = parentTagName === "SCRIPT" ? true : void 0;
        if (isStyle && textContent) {
            try {
                if (n.nextSibling || n.previousSibling) {
                } else if ((_a = n.parentNode.sheet) === null || _a === void 0 ? void 0 : _a.cssRules) {
                    textContent = stringifyStyleSheet(n.parentNode.sheet);
                }
            } catch (err) {
                console.warn("Cannot get CSS styles from text's parentNode. Error: ".concat(err), n);
            }
            textContent = absoluteToStylesheet(textContent, getHref());
        }
        if (isScript) {
            textContent = "SCRIPT_PLACEHOLDER";
        }
        if (!isStyle && !isScript && textContent && needMaskingText(n, maskTextClass, maskTextSelector)) {
            textContent = maskTextFn ? maskTextFn(textContent) : textContent.replace(/[\S]/g, "*");
        }
        return {
            type: NodeType$2.Text,
            textContent: textContent || "",
            isStyle,
            rootId
        };
    }
    function serializeElementNode(n, options) {
        var doc = options.doc, blockClass = options.blockClass, blockSelector = options.blockSelector, inlineStylesheet = options.inlineStylesheet, _a = options.maskInputOptions, maskInputOptions = _a === void 0 ? {} : _a, maskInputFn = options.maskInputFn, _b = options.dataURLOptions, dataURLOptions = _b === void 0 ? {} : _b, inlineImages = options.inlineImages, recordCanvas = options.recordCanvas, keepIframeSrcFn = options.keepIframeSrcFn, _c = options.newlyAddedElement, newlyAddedElement = _c === void 0 ? false : _c, rootId = options.rootId;
        var needBlock = _isBlockedElement(n, blockClass, blockSelector);
        var tagName = getValidTagName$1(n);
        var attributes = {};
        var len = n.attributes.length;
        for (var i = 0; i < len; i++) {
            var attr = n.attributes[i];
            attributes[attr.name] = transformAttribute(doc, tagName, attr.name, attr.value);
        }
        if (tagName === "link" && inlineStylesheet) {
            var stylesheet = Array.from(doc.styleSheets).find(function(s) {
                return s.href === n.href;
            });
            var cssText = null;
            if (stylesheet) {
                cssText = getCssRulesString(stylesheet);
            }
            if (cssText) {
                delete attributes.rel;
                delete attributes.href;
                attributes._cssText = absoluteToStylesheet(cssText, stylesheet.href);
            }
        }
        if (tagName === "style" && n.sheet && !(n.innerText || n.textContent || "").trim().length) {
            var cssText = getCssRulesString(n.sheet);
            if (cssText) {
                attributes._cssText = absoluteToStylesheet(cssText, getHref());
            }
        }
        if (tagName === "input" || tagName === "textarea" || tagName === "select") {
            var value = n.value;
            if (attributes.type !== "radio" && attributes.type !== "checkbox" && attributes.type !== "submit" && attributes.type !== "button" && value) {
                attributes.value = maskInputValue({
                    type: attributes.type,
                    tagName,
                    value,
                    maskInputOptions,
                    maskInputFn
                });
            } else if (n.checked) {
                attributes.checked = n.checked;
            }
        }
        if (tagName === "option") {
            if (n.selected && !maskInputOptions["select"]) {
                attributes.selected = true;
            } else {
                delete attributes.selected;
            }
        }
        if (tagName === "canvas" && recordCanvas) {
            if (n.__context === "2d") {
                if (!is2DCanvasBlank(n)) {
                    attributes.rr_dataURL = n.toDataURL(dataURLOptions.type, dataURLOptions.quality);
                }
            } else if (!("__context" in n)) {
                var canvasDataURL = n.toDataURL(dataURLOptions.type, dataURLOptions.quality);
                var blankCanvas = document.createElement("canvas");
                blankCanvas.width = n.width;
                blankCanvas.height = n.height;
                var blankCanvasDataURL = blankCanvas.toDataURL(dataURLOptions.type, dataURLOptions.quality);
                if (canvasDataURL !== blankCanvasDataURL) {
                    attributes.rr_dataURL = canvasDataURL;
                }
            }
        }
        if (tagName === "img" && inlineImages) {
            if (!canvasService) {
                canvasService = doc.createElement("canvas");
                canvasCtx = canvasService.getContext("2d");
            }
            var image_1 = n;
            var oldValue_1 = image_1.crossOrigin;
            image_1.crossOrigin = "anonymous";
            var recordInlineImage = function() {
                try {
                    canvasService.width = image_1.naturalWidth;
                    canvasService.height = image_1.naturalHeight;
                    canvasCtx.drawImage(image_1, 0, 0);
                    attributes.rr_dataURL = canvasService.toDataURL(dataURLOptions.type, dataURLOptions.quality);
                } catch (err) {
                    console.warn("Cannot inline img src=".concat(image_1.currentSrc, "! Error: ").concat(err));
                }
                oldValue_1 ? attributes.crossOrigin = oldValue_1 : image_1.removeAttribute("crossorigin");
            };
            if (image_1.complete && image_1.naturalWidth !== 0)
                recordInlineImage();
            else
                image_1.onload = recordInlineImage;
        }
        if (tagName === "audio" || tagName === "video") {
            attributes.rr_mediaState = n.paused ? "paused" : "played";
            attributes.rr_mediaCurrentTime = n.currentTime;
        }
        if (!newlyAddedElement) {
            if (n.scrollLeft) {
                attributes.rr_scrollLeft = n.scrollLeft;
            }
            if (n.scrollTop) {
                attributes.rr_scrollTop = n.scrollTop;
            }
        }
        if (needBlock) {
            var _d = n.getBoundingClientRect(), width = _d.width, height = _d.height;
            attributes = {
                "class": attributes["class"],
                rr_width: "".concat(width, "px"),
                rr_height: "".concat(height, "px")
            };
        }
        if (tagName === "iframe" && !keepIframeSrcFn(attributes.src)) {
            if (!n.contentDocument) {
                attributes.rr_src = attributes.src;
            }
            delete attributes.src;
        }
        return {
            type: NodeType$2.Element,
            tagName,
            attributes,
            childNodes: [],
            isSVG: isSVGElement(n) || void 0,
            needBlock,
            rootId
        };
    }
    function lowerIfExists(maybeAttr) {
        if (maybeAttr === void 0) {
            return "";
        } else {
            return maybeAttr.toLowerCase();
        }
    }
    function slimDOMExcluded(sn, slimDOMOptions) {
        if (slimDOMOptions.comment && sn.type === NodeType$2.Comment) {
            return true;
        } else if (sn.type === NodeType$2.Element) {
            if (slimDOMOptions.script && (sn.tagName === "script" || sn.tagName === "link" && sn.attributes.rel === "preload" && sn.attributes.as === "script" || sn.tagName === "link" && sn.attributes.rel === "prefetch" && typeof sn.attributes.href === "string" && sn.attributes.href.endsWith(".js"))) {
                return true;
            } else if (slimDOMOptions.headFavicon && (sn.tagName === "link" && sn.attributes.rel === "shortcut icon" || sn.tagName === "meta" && (lowerIfExists(sn.attributes.name).match(/^msapplication-tile(image|color)$/) || lowerIfExists(sn.attributes.name) === "application-name" || lowerIfExists(sn.attributes.rel) === "icon" || lowerIfExists(sn.attributes.rel) === "apple-touch-icon" || lowerIfExists(sn.attributes.rel) === "shortcut icon"))) {
                return true;
            } else if (sn.tagName === "meta") {
                if (slimDOMOptions.headMetaDescKeywords && lowerIfExists(sn.attributes.name).match(/^description|keywords$/)) {
                    return true;
                } else if (slimDOMOptions.headMetaSocial && (lowerIfExists(sn.attributes.property).match(/^(og|twitter|fb):/) || lowerIfExists(sn.attributes.name).match(/^(og|twitter):/) || lowerIfExists(sn.attributes.name) === "pinterest")) {
                    return true;
                } else if (slimDOMOptions.headMetaRobots && (lowerIfExists(sn.attributes.name) === "robots" || lowerIfExists(sn.attributes.name) === "googlebot" || lowerIfExists(sn.attributes.name) === "bingbot")) {
                    return true;
                } else if (slimDOMOptions.headMetaHttpEquiv && sn.attributes["http-equiv"] !== void 0) {
                    return true;
                } else if (slimDOMOptions.headMetaAuthorship && (lowerIfExists(sn.attributes.name) === "author" || lowerIfExists(sn.attributes.name) === "generator" || lowerIfExists(sn.attributes.name) === "framework" || lowerIfExists(sn.attributes.name) === "publisher" || lowerIfExists(sn.attributes.name) === "progid" || lowerIfExists(sn.attributes.property).match(/^article:/) || lowerIfExists(sn.attributes.property).match(/^product:/))) {
                    return true;
                } else if (slimDOMOptions.headMetaVerification && (lowerIfExists(sn.attributes.name) === "google-site-verification" || lowerIfExists(sn.attributes.name) === "yandex-verification" || lowerIfExists(sn.attributes.name) === "csrf-token" || lowerIfExists(sn.attributes.name) === "p:domain_verify" || lowerIfExists(sn.attributes.name) === "verify-v1" || lowerIfExists(sn.attributes.name) === "verification" || lowerIfExists(sn.attributes.name) === "shopify-checkout-api-token")) {
                    return true;
                }
            }
        }
        return false;
    }
    function serializeNodeWithId(n, options) {
        var doc = options.doc, mirror = options.mirror, blockClass = options.blockClass, blockSelector = options.blockSelector, maskTextClass = options.maskTextClass, maskTextSelector = options.maskTextSelector, _a = options.skipChild, skipChild = _a === void 0 ? false : _a, _b = options.inlineStylesheet, inlineStylesheet = _b === void 0 ? true : _b, _c = options.maskInputOptions, maskInputOptions = _c === void 0 ? {} : _c, maskTextFn = options.maskTextFn, maskInputFn = options.maskInputFn, slimDOMOptions = options.slimDOMOptions, _d = options.dataURLOptions, dataURLOptions = _d === void 0 ? {} : _d, _e = options.inlineImages, inlineImages = _e === void 0 ? false : _e, _f = options.recordCanvas, recordCanvas = _f === void 0 ? false : _f, onSerialize = options.onSerialize, onIframeLoad = options.onIframeLoad, _g = options.iframeLoadTimeout, iframeLoadTimeout = _g === void 0 ? 5e3 : _g, onStylesheetLoad = options.onStylesheetLoad, _h = options.stylesheetLoadTimeout, stylesheetLoadTimeout = _h === void 0 ? 5e3 : _h, _j = options.keepIframeSrcFn, keepIframeSrcFn = _j === void 0 ? function() {
            return false;
        } : _j, _k = options.newlyAddedElement, newlyAddedElement = _k === void 0 ? false : _k;
        var _l = options.preserveWhiteSpace, preserveWhiteSpace = _l === void 0 ? true : _l;
        var _serializedNode = serializeNode(n, {
            doc,
            mirror,
            blockClass,
            blockSelector,
            maskTextClass,
            maskTextSelector,
            inlineStylesheet,
            maskInputOptions,
            maskTextFn,
            maskInputFn,
            dataURLOptions,
            inlineImages,
            recordCanvas,
            keepIframeSrcFn,
            newlyAddedElement
        });
        if (!_serializedNode) {
            console.warn(n, "not serialized");
            return null;
        }
        var id;
        if (mirror.hasNode(n)) {
            id = mirror.getId(n);
        } else if (slimDOMExcluded(_serializedNode, slimDOMOptions) || !preserveWhiteSpace && _serializedNode.type === NodeType$2.Text && !_serializedNode.isStyle && !_serializedNode.textContent.replace(/^\s+|\s+$/gm, "").length) {
            id = IGNORED_NODE;
        } else {
            id = genId();
        }
        if (id === IGNORED_NODE) {
            return null;
        }
        var serializedNode = Object.assign(_serializedNode, { id });
        mirror.add(n, serializedNode);
        if (onSerialize) {
            onSerialize(n);
        }
        var recordChild = !skipChild;
        if (serializedNode.type === NodeType$2.Element) {
            recordChild = recordChild && !serializedNode.needBlock;
            delete serializedNode.needBlock;
            var shadowRoot = n.shadowRoot;
            if (shadowRoot && isNativeShadowDom(shadowRoot))
                serializedNode.isShadowHost = true;
        }
        if ((serializedNode.type === NodeType$2.Document || serializedNode.type === NodeType$2.Element) && recordChild) {
            if (slimDOMOptions.headWhitespace && serializedNode.type === NodeType$2.Element && serializedNode.tagName === "head") {
                preserveWhiteSpace = false;
            }
            var bypassOptions = {
                doc,
                mirror,
                blockClass,
                blockSelector,
                maskTextClass,
                maskTextSelector,
                skipChild,
                inlineStylesheet,
                maskInputOptions,
                maskTextFn,
                maskInputFn,
                slimDOMOptions,
                dataURLOptions,
                inlineImages,
                recordCanvas,
                preserveWhiteSpace,
                onSerialize,
                onIframeLoad,
                iframeLoadTimeout,
                onStylesheetLoad,
                stylesheetLoadTimeout,
                keepIframeSrcFn
            };
            for (var _i = 0, _m = Array.from(n.childNodes); _i < _m.length; _i++) {
                var childN = _m[_i];
                var serializedChildNode = serializeNodeWithId(childN, bypassOptions);
                if (serializedChildNode) {
                    serializedNode.childNodes.push(serializedChildNode);
                }
            }
            if (isElement(n) && n.shadowRoot) {
                for (var _o = 0, _p = Array.from(n.shadowRoot.childNodes); _o < _p.length; _o++) {
                    var childN = _p[_o];
                    var serializedChildNode = serializeNodeWithId(childN, bypassOptions);
                    if (serializedChildNode) {
                        isNativeShadowDom(n.shadowRoot) && (serializedChildNode.isShadow = true);
                        serializedNode.childNodes.push(serializedChildNode);
                    }
                }
            }
        }
        if (n.parentNode && isShadowRoot(n.parentNode) && isNativeShadowDom(n.parentNode)) {
            serializedNode.isShadow = true;
        }
        if (serializedNode.type === NodeType$2.Element && serializedNode.tagName === "iframe") {
            onceIframeLoaded(n, function() {
                var iframeDoc = n.contentDocument;
                if (iframeDoc && onIframeLoad) {
                    var serializedIframeNode = serializeNodeWithId(iframeDoc, {
                        doc: iframeDoc,
                        mirror,
                        blockClass,
                        blockSelector,
                        maskTextClass,
                        maskTextSelector,
                        skipChild: false,
                        inlineStylesheet,
                        maskInputOptions,
                        maskTextFn,
                        maskInputFn,
                        slimDOMOptions,
                        dataURLOptions,
                        inlineImages,
                        recordCanvas,
                        preserveWhiteSpace,
                        onSerialize,
                        onIframeLoad,
                        iframeLoadTimeout,
                        onStylesheetLoad,
                        stylesheetLoadTimeout,
                        keepIframeSrcFn
                    });
                    if (serializedIframeNode) {
                        onIframeLoad(n, serializedIframeNode);
                    }
                }
            }, iframeLoadTimeout);
        }
        if (serializedNode.type === NodeType$2.Element && serializedNode.tagName === "link" && serializedNode.attributes.rel === "stylesheet") {
            onceStylesheetLoaded(n, function() {
                if (onStylesheetLoad) {
                    var serializedLinkNode = serializeNodeWithId(n, {
                        doc,
                        mirror,
                        blockClass,
                        blockSelector,
                        maskTextClass,
                        maskTextSelector,
                        skipChild: false,
                        inlineStylesheet,
                        maskInputOptions,
                        maskTextFn,
                        maskInputFn,
                        slimDOMOptions,
                        dataURLOptions,
                        inlineImages,
                        recordCanvas,
                        preserveWhiteSpace,
                        onSerialize,
                        onIframeLoad,
                        iframeLoadTimeout,
                        onStylesheetLoad,
                        stylesheetLoadTimeout,
                        keepIframeSrcFn
                    });
                    if (serializedLinkNode) {
                        onStylesheetLoad(n, serializedLinkNode);
                    }
                }
            }, stylesheetLoadTimeout);
            if (isStylesheetLoaded(n) === false)
                return null;
        }
        return serializedNode;
    }
    function snapshot(n, options) {
        var _a = options || {}, _b = _a.mirror, mirror = _b === void 0 ? new Mirror$2() : _b, _c = _a.blockClass, blockClass = _c === void 0 ? "rr-block" : _c, _d = _a.blockSelector, blockSelector = _d === void 0 ? null : _d, _e = _a.maskTextClass, maskTextClass = _e === void 0 ? "rr-mask" : _e, _f = _a.maskTextSelector, maskTextSelector = _f === void 0 ? null : _f, _g = _a.inlineStylesheet, inlineStylesheet = _g === void 0 ? true : _g, _h = _a.inlineImages, inlineImages = _h === void 0 ? false : _h, _j = _a.recordCanvas, recordCanvas = _j === void 0 ? false : _j, _k = _a.maskAllInputs, maskAllInputs = _k === void 0 ? false : _k, maskTextFn = _a.maskTextFn, maskInputFn = _a.maskInputFn, _l = _a.slimDOM, slimDOM = _l === void 0 ? false : _l, dataURLOptions = _a.dataURLOptions, preserveWhiteSpace = _a.preserveWhiteSpace, onSerialize = _a.onSerialize, onIframeLoad = _a.onIframeLoad, iframeLoadTimeout = _a.iframeLoadTimeout, onStylesheetLoad = _a.onStylesheetLoad, stylesheetLoadTimeout = _a.stylesheetLoadTimeout, _m = _a.keepIframeSrcFn, keepIframeSrcFn = _m === void 0 ? function() {
            return false;
        } : _m;
        var maskInputOptions = maskAllInputs === true ? {
            color: true,
            date: true,
            "datetime-local": true,
            email: true,
            month: true,
            number: true,
            range: true,
            search: true,
            tel: true,
            text: true,
            time: true,
            url: true,
            week: true,
            textarea: true,
            select: true,
            password: true
        } : maskAllInputs === false ? {
            password: true
        } : maskAllInputs;
        var slimDOMOptions = slimDOM === true || slimDOM === "all" ? {
            script: true,
            comment: true,
            headFavicon: true,
            headWhitespace: true,
            headMetaDescKeywords: slimDOM === "all",
            headMetaSocial: true,
            headMetaRobots: true,
            headMetaHttpEquiv: true,
            headMetaAuthorship: true,
            headMetaVerification: true
        } : slimDOM === false ? {} : slimDOM;
        return serializeNodeWithId(n, {
            doc: n,
            mirror,
            blockClass,
            blockSelector,
            maskTextClass,
            maskTextSelector,
            skipChild: false,
            inlineStylesheet,
            maskInputOptions,
            maskTextFn,
            maskInputFn,
            slimDOMOptions,
            dataURLOptions,
            inlineImages,
            recordCanvas,
            preserveWhiteSpace,
            onSerialize,
            onIframeLoad,
            iframeLoadTimeout,
            onStylesheetLoad,
            stylesheetLoadTimeout,
            keepIframeSrcFn,
            newlyAddedElement: false
        });
    }
    var commentre = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;
    function parse(css, options) {
        if (options === void 0) {
            options = {};
        }
        var lineno = 1;
        var column = 1;
        function updatePosition(str) {
            var lines = str.match(/\n/g);
            if (lines) {
                lineno += lines.length;
            }
            var i = str.lastIndexOf("\n");
            column = i === -1 ? column + str.length : str.length - i;
        }
        function position() {
            var start = { line: lineno, column };
            return function(node) {
                node.position = new Position(start);
                whitespace();
                return node;
            };
        }
        var Position = function() {
            function Position2(start) {
                this.start = start;
                this.end = { line: lineno, column };
                this.source = options.source;
            }
            return Position2;
        }();
        Position.prototype.content = css;
        var errorsList = [];
        function error(msg) {
            var err = new Error("".concat(options.source || "", ":").concat(lineno, ":").concat(column, ": ").concat(msg));
            err.reason = msg;
            err.filename = options.source;
            err.line = lineno;
            err.column = column;
            err.source = css;
            if (options.silent) {
                errorsList.push(err);
            } else {
                throw err;
            }
        }
        function stylesheet() {
            var rulesList = rules();
            return {
                type: "stylesheet",
                stylesheet: {
                    source: options.source,
                    rules: rulesList,
                    parsingErrors: errorsList
                }
            };
        }
        function open() {
            return match(/^{\s*/);
        }
        function close() {
            return match(/^}/);
        }
        function rules() {
            var node;
            var rules2 = [];
            whitespace();
            comments(rules2);
            while (css.length && css.charAt(0) !== "}" && (node = atrule() || rule())) {
                if (node !== false) {
                    rules2.push(node);
                    comments(rules2);
                }
            }
            return rules2;
        }
        function match(re) {
            var m = re.exec(css);
            if (!m) {
                return;
            }
            var str = m[0];
            updatePosition(str);
            css = css.slice(str.length);
            return m;
        }
        function whitespace() {
            match(/^\s*/);
        }
        function comments(rules2) {
            if (rules2 === void 0) {
                rules2 = [];
            }
            var c;
            while (c = comment()) {
                if (c !== false) {
                    rules2.push(c);
                }
                c = comment();
            }
            return rules2;
        }
        function comment() {
            var pos = position();
            if (css.charAt(0) !== "/" || css.charAt(1) !== "*") {
                return;
            }
            var i = 2;
            while (css.charAt(i) !== "" && (css.charAt(i) !== "*" || css.charAt(i + 1) !== "/")) {
                ++i;
            }
            i += 2;
            if (css.charAt(i - 1) === "") {
                return error("End of comment missing");
            }
            var str = css.slice(2, i - 2);
            column += 2;
            updatePosition(str);
            css = css.slice(i);
            column += 2;
            return pos({
                type: "comment",
                comment: str
            });
        }
        function selector() {
            var m = match(/^([^{]+)/);
            if (!m) {
                return;
            }
            return trim(m[0]).replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/g, "").replace(/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'/g, function(m2) {
                return m2.replace(/,/g, "\u200C");
            }).split(/\s*(?![^(]*\)),\s*/).map(function(s) {
                return s.replace(/\u200C/g, ",");
            });
        }
        function declaration() {
            var pos = position();
            var propMatch = match(/^(\*?[-#\/\*\\\w]+(\[[0-9a-z_-]+\])?)\s*/);
            if (!propMatch) {
                return;
            }
            var prop = trim(propMatch[0]);
            if (!match(/^:\s*/)) {
                return error("property missing ':'");
            }
            var val = match(/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^\)]*?\)|[^};])+)/);
            var ret = pos({
                type: "declaration",
                property: prop.replace(commentre, ""),
                value: val ? trim(val[0]).replace(commentre, "") : ""
            });
            match(/^[;\s]*/);
            return ret;
        }
        function declarations() {
            var decls = [];
            if (!open()) {
                return error("missing '{'");
            }
            comments(decls);
            var decl;
            while (decl = declaration()) {
                if (decl !== false) {
                    decls.push(decl);
                    comments(decls);
                }
                decl = declaration();
            }
            if (!close()) {
                return error("missing '}'");
            }
            return decls;
        }
        function keyframe() {
            var m;
            var vals = [];
            var pos = position();
            while (m = match(/^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/)) {
                vals.push(m[1]);
                match(/^,\s*/);
            }
            if (!vals.length) {
                return;
            }
            return pos({
                type: "keyframe",
                values: vals,
                declarations: declarations()
            });
        }
        function atkeyframes() {
            var pos = position();
            var m = match(/^@([-\w]+)?keyframes\s*/);
            if (!m) {
                return;
            }
            var vendor = m[1];
            m = match(/^([-\w]+)\s*/);
            if (!m) {
                return error("@keyframes missing name");
            }
            var name = m[1];
            if (!open()) {
                return error("@keyframes missing '{'");
            }
            var frame;
            var frames = comments();
            while (frame = keyframe()) {
                frames.push(frame);
                frames = frames.concat(comments());
            }
            if (!close()) {
                return error("@keyframes missing '}'");
            }
            return pos({
                type: "keyframes",
                name,
                vendor,
                keyframes: frames
            });
        }
        function atsupports() {
            var pos = position();
            var m = match(/^@supports *([^{]+)/);
            if (!m) {
                return;
            }
            var supports = trim(m[1]);
            if (!open()) {
                return error("@supports missing '{'");
            }
            var style = comments().concat(rules());
            if (!close()) {
                return error("@supports missing '}'");
            }
            return pos({
                type: "supports",
                supports,
                rules: style
            });
        }
        function athost() {
            var pos = position();
            var m = match(/^@host\s*/);
            if (!m) {
                return;
            }
            if (!open()) {
                return error("@host missing '{'");
            }
            var style = comments().concat(rules());
            if (!close()) {
                return error("@host missing '}'");
            }
            return pos({
                type: "host",
                rules: style
            });
        }
        function atmedia() {
            var pos = position();
            var m = match(/^@media *([^{]+)/);
            if (!m) {
                return;
            }
            var media = trim(m[1]);
            if (!open()) {
                return error("@media missing '{'");
            }
            var style = comments().concat(rules());
            if (!close()) {
                return error("@media missing '}'");
            }
            return pos({
                type: "media",
                media,
                rules: style
            });
        }
        function atcustommedia() {
            var pos = position();
            var m = match(/^@custom-media\s+(--[^\s]+)\s*([^{;]+);/);
            if (!m) {
                return;
            }
            return pos({
                type: "custom-media",
                name: trim(m[1]),
                media: trim(m[2])
            });
        }
        function atpage() {
            var pos = position();
            var m = match(/^@page */);
            if (!m) {
                return;
            }
            var sel = selector() || [];
            if (!open()) {
                return error("@page missing '{'");
            }
            var decls = comments();
            var decl;
            while (decl = declaration()) {
                decls.push(decl);
                decls = decls.concat(comments());
            }
            if (!close()) {
                return error("@page missing '}'");
            }
            return pos({
                type: "page",
                selectors: sel,
                declarations: decls
            });
        }
        function atdocument() {
            var pos = position();
            var m = match(/^@([-\w]+)?document *([^{]+)/);
            if (!m) {
                return;
            }
            var vendor = trim(m[1]);
            var doc = trim(m[2]);
            if (!open()) {
                return error("@document missing '{'");
            }
            var style = comments().concat(rules());
            if (!close()) {
                return error("@document missing '}'");
            }
            return pos({
                type: "document",
                document: doc,
                vendor,
                rules: style
            });
        }
        function atfontface() {
            var pos = position();
            var m = match(/^@font-face\s*/);
            if (!m) {
                return;
            }
            if (!open()) {
                return error("@font-face missing '{'");
            }
            var decls = comments();
            var decl;
            while (decl = declaration()) {
                decls.push(decl);
                decls = decls.concat(comments());
            }
            if (!close()) {
                return error("@font-face missing '}'");
            }
            return pos({
                type: "font-face",
                declarations: decls
            });
        }
        var atimport = _compileAtrule("import");
        var atcharset = _compileAtrule("charset");
        var atnamespace = _compileAtrule("namespace");
        function _compileAtrule(name) {
            var re = new RegExp("^@" + name + "\\s*([^;]+);");
            return function() {
                var pos = position();
                var m = match(re);
                if (!m) {
                    return;
                }
                var ret = { type: name };
                ret[name] = m[1].trim();
                return pos(ret);
            };
        }
        function atrule() {
            if (css[0] !== "@") {
                return;
            }
            return atkeyframes() || atmedia() || atcustommedia() || atsupports() || atimport() || atcharset() || atnamespace() || atdocument() || atpage() || athost() || atfontface();
        }
        function rule() {
            var pos = position();
            var sel = selector();
            if (!sel) {
                return error("selector missing");
            }
            comments();
            return pos({
                type: "rule",
                selectors: sel,
                declarations: declarations()
            });
        }
        return addParent(stylesheet());
    }
    function trim(str) {
        return str ? str.replace(/^\s+|\s+$/g, "") : "";
    }
    function addParent(obj, parent) {
        var isNode = obj && typeof obj.type === "string";
        var childParent = isNode ? obj : parent;
        for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
            var k = _a[_i];
            var value = obj[k];
            if (Array.isArray(value)) {
                value.forEach(function(v) {
                    addParent(v, childParent);
                });
            } else if (value && typeof value === "object") {
                addParent(value, childParent);
            }
        }
        if (isNode) {
            Object.defineProperty(obj, "parent", {
                configurable: true,
                writable: true,
                enumerable: false,
                value: parent || null
            });
        }
        return obj;
    }
    var tagMap = {
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
    function getTagName(n) {
        var tagName = tagMap[n.tagName] ? tagMap[n.tagName] : n.tagName;
        if (tagName === "link" && n.attributes._cssText) {
            tagName = "style";
        }
        return tagName;
    }
    function escapeRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    var HOVER_SELECTOR = /([^\\]):hover/;
    var HOVER_SELECTOR_GLOBAL = new RegExp(HOVER_SELECTOR.source, "g");
    function addHoverClass(cssText, cache) {
        var cachedStyle = cache === null || cache === void 0 ? void 0 : cache.stylesWithHoverClass.get(cssText);
        if (cachedStyle)
            return cachedStyle;
        var ast = parse(cssText, {
            silent: true
        });
        if (!ast.stylesheet) {
            return cssText;
        }
        var selectors = [];
        ast.stylesheet.rules.forEach(function(rule) {
            if ("selectors" in rule) {
                (rule.selectors || []).forEach(function(selector) {
                    if (HOVER_SELECTOR.test(selector)) {
                        selectors.push(selector);
                    }
                });
            }
        });
        if (selectors.length === 0) {
            return cssText;
        }
        var selectorMatcher = new RegExp(selectors.filter(function(selector, index) {
            return selectors.indexOf(selector) === index;
        }).sort(function(a, b) {
            return b.length - a.length;
        }).map(function(selector) {
            return escapeRegExp(selector);
        }).join("|"), "g");
        var result = cssText.replace(selectorMatcher, function(selector) {
            var newSelector = selector.replace(HOVER_SELECTOR_GLOBAL, "$1.\\:hover");
            return "".concat(selector, ", ").concat(newSelector);
        });
        cache === null || cache === void 0 ? void 0 : cache.stylesWithHoverClass.set(cssText, result);
        return result;
    }
    function createCache() {
        var stylesWithHoverClass = /* @__PURE__ */ new Map();
        return {
            stylesWithHoverClass
        };
    }
    function buildNode(n, options) {
        var doc = options.doc, hackCss = options.hackCss, cache = options.cache;
        switch (n.type) {
            case NodeType$2.Document:
                return doc.implementation.createDocument(null, "", null);
            case NodeType$2.DocumentType:
                return doc.implementation.createDocumentType(n.name || "html", n.publicId, n.systemId);
            case NodeType$2.Element: {
                var tagName = getTagName(n);
                var node_1;
                if (n.isSVG) {
                    node_1 = doc.createElementNS("http://www.w3.org/2000/svg", tagName);
                } else {
                    node_1 = doc.createElement(tagName);
                }
                var _loop_1 = function(name_12) {
                    if (!Object.prototype.hasOwnProperty.call(n.attributes, name_12)) {
                        return "continue";
                    }
                    var value = n.attributes[name_12];
                    if (tagName === "option" && name_12 === "selected" && value === false) {
                        return "continue";
                    }
                    value = typeof value === "boolean" || typeof value === "number" ? "" : value;
                    if (!name_12.startsWith("rr_")) {
                        var isTextarea = tagName === "textarea" && name_12 === "value";
                        var isRemoteOrDynamicCss = tagName === "style" && name_12 === "_cssText";
                        if (isRemoteOrDynamicCss && hackCss) {
                            value = addHoverClass(value, cache);
                        }
                        if (isTextarea || isRemoteOrDynamicCss) {
                            var child = doc.createTextNode(value);
                            for (var _i = 0, _a = Array.from(node_1.childNodes); _i < _a.length; _i++) {
                                var c = _a[_i];
                                if (c.nodeType === node_1.TEXT_NODE) {
                                    node_1.removeChild(c);
                                }
                            }
                            node_1.appendChild(child);
                            return "continue";
                        }
                        try {
                            if (n.isSVG && name_12 === "xlink:href") {
                                node_1.setAttributeNS("http://www.w3.org/1999/xlink", name_12, value);
                            } else if (name_12 === "onload" || name_12 === "onclick" || name_12.substring(0, 7) === "onmouse") {
                                node_1.setAttribute("_" + name_12, value);
                            } else if (tagName === "meta" && n.attributes["http-equiv"] === "Content-Security-Policy" && name_12 === "content") {
                                node_1.setAttribute("csp-content", value);
                                return "continue";
                            } else if (tagName === "link" && n.attributes.rel === "preload" && n.attributes.as === "script") {
                            } else if (tagName === "link" && n.attributes.rel === "prefetch" && typeof n.attributes.href === "string" && n.attributes.href.endsWith(".js")) {
                            } else if (tagName === "img" && n.attributes.srcset && n.attributes.rr_dataURL) {
                                node_1.setAttribute("rrweb-original-srcset", n.attributes.srcset);
                            } else {
                                node_1.setAttribute(name_12, value);
                            }
                        } catch (error) {
                        }
                    } else {
                        if (tagName === "canvas" && name_12 === "rr_dataURL") {
                            var image_1 = document.createElement("img");
                            image_1.onload = function() {
                                var ctx = node_1.getContext("2d");
                                if (ctx) {
                                    ctx.drawImage(image_1, 0, 0, image_1.width, image_1.height);
                                }
                            };
                            image_1.src = value;
                            if (node_1.RRNodeType)
                                node_1.rr_dataURL = value;
                        } else if (tagName === "img" && name_12 === "rr_dataURL") {
                            var image = node_1;
                            if (!image.currentSrc.startsWith("data:")) {
                                image.setAttribute("rrweb-original-src", n.attributes.src);
                                image.src = value;
                            }
                        }
                        if (name_12 === "rr_width") {
                            node_1.style.width = value;
                        } else if (name_12 === "rr_height") {
                            node_1.style.height = value;
                        } else if (name_12 === "rr_mediaCurrentTime") {
                            node_1.currentTime = n.attributes.rr_mediaCurrentTime;
                        } else if (name_12 === "rr_mediaState") {
                            switch (value) {
                                case "played":
                                    node_1.play()["catch"](function(e) {
                                        return console.warn("media playback error", e);
                                    });
                                    break;
                                case "paused":
                                    node_1.pause();
                                    break;
                            }
                        }
                    }
                };
                for (var name_1 in n.attributes) {
                    _loop_1(name_1);
                }
                if (n.isShadowHost) {
                    if (!node_1.shadowRoot) {
                        node_1.attachShadow({ mode: "open" });
                    } else {
                        while (node_1.shadowRoot.firstChild) {
                            node_1.shadowRoot.removeChild(node_1.shadowRoot.firstChild);
                        }
                    }
                }
                return node_1;
            }
            case NodeType$2.Text:
                return doc.createTextNode(n.isStyle && hackCss ? addHoverClass(n.textContent, cache) : n.textContent);
            case NodeType$2.CDATA:
                return doc.createCDATASection(n.textContent);
            case NodeType$2.Comment:
                return doc.createComment(n.textContent);
            default:
                return null;
        }
    }
    function buildNodeWithSN(n, options) {
        var doc = options.doc, mirror = options.mirror, _a = options.skipChild, skipChild = _a === void 0 ? false : _a, _b = options.hackCss, hackCss = _b === void 0 ? true : _b, afterAppend = options.afterAppend, cache = options.cache;
        var node = buildNode(n, { doc, hackCss, cache });
        if (!node) {
            return null;
        }
        if (n.rootId) {
            console.assert(mirror.getNode(n.rootId) === doc, "Target document should have the same root id.");
        }
        if (n.type === NodeType$2.Document) {
            doc.close();
            doc.open();
            if (n.compatMode === "BackCompat" && n.childNodes && n.childNodes[0].type !== NodeType$2.DocumentType) {
                if (n.childNodes[0].type === NodeType$2.Element && "xmlns" in n.childNodes[0].attributes && n.childNodes[0].attributes.xmlns === "http://www.w3.org/1999/xhtml") {
                    doc.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "">');
                } else {
                    doc.write('<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "">');
                }
            }
            node = doc;
        }
        mirror.add(node, n);
        if ((n.type === NodeType$2.Document || n.type === NodeType$2.Element) && !skipChild) {
            for (var _i = 0, _c = n.childNodes; _i < _c.length; _i++) {
                var childN = _c[_i];
                var childNode = buildNodeWithSN(childN, {
                    doc,
                    mirror,
                    skipChild: false,
                    hackCss,
                    afterAppend,
                    cache
                });
                if (!childNode) {
                    console.warn("Failed to rebuild", childN);
                    continue;
                }
                if (childN.isShadow && isElement(node) && node.shadowRoot) {
                    node.shadowRoot.appendChild(childNode);
                } else {
                    node.appendChild(childNode);
                }
                if (afterAppend) {
                    afterAppend(childNode);
                }
            }
        }
        return node;
    }
    function visit(mirror, onVisit) {
        function walk(node) {
            onVisit(node);
        }
        for (var _i = 0, _a = mirror.getIds(); _i < _a.length; _i++) {
            var id = _a[_i];
            if (mirror.has(id)) {
                walk(mirror.getNode(id));
            }
        }
    }
    function handleScroll(node, mirror) {
        var n = mirror.getMeta(node);
        if ((n === null || n === void 0 ? void 0 : n.type) !== NodeType$2.Element) {
            return;
        }
        var el = node;
        for (var name_2 in n.attributes) {
            if (!(Object.prototype.hasOwnProperty.call(n.attributes, name_2) && name_2.startsWith("rr_"))) {
                continue;
            }
            var value = n.attributes[name_2];
            if (name_2 === "rr_scrollLeft") {
                el.scrollLeft = value;
            }
            if (name_2 === "rr_scrollTop") {
                el.scrollTop = value;
            }
        }
    }
    function rebuild(n, options) {
        var doc = options.doc, onVisit = options.onVisit, _a = options.hackCss, hackCss = _a === void 0 ? true : _a, afterAppend = options.afterAppend, cache = options.cache, _b = options.mirror, mirror = _b === void 0 ? new Mirror$2() : _b;
        var node = buildNodeWithSN(n, {
            doc,
            mirror,
            skipChild: false,
            hackCss,
            afterAppend,
            cache
        });
        visit(mirror, function(visitedNode) {
            if (onVisit) {
                onVisit(visitedNode);
            }
            handleScroll(visitedNode, mirror);
        });
        return node;
    }

    function on(type, fn, target = document) {
        const options = { capture: true, passive: true };
        target.addEventListener(type, fn, options);
        return () => target.removeEventListener(type, fn, options);
    }
    const DEPARTED_MIRROR_ACCESS_WARNING = "Please stop import mirror directly. Instead of that,\r\nnow you can use replayer.getMirror() to access the mirror instance of a replayer,\r\nor you can use record.mirror to access the mirror instance during recording.";
    exports.mirror = {
        map: {},
        getId() {
            console.error(DEPARTED_MIRROR_ACCESS_WARNING);
            return -1;
        },
        getNode() {
            console.error(DEPARTED_MIRROR_ACCESS_WARNING);
            return null;
        },
        removeNodeFromMap() {
            console.error(DEPARTED_MIRROR_ACCESS_WARNING);
        },
        has() {
            console.error(DEPARTED_MIRROR_ACCESS_WARNING);
            return false;
        },
        reset() {
            console.error(DEPARTED_MIRROR_ACCESS_WARNING);
        }
    };
    if (typeof window !== "undefined" && window.Proxy && window.Reflect) {
        exports.mirror = new Proxy(exports.mirror, {
            get(target, prop, receiver) {
                if (prop === "map") {
                    console.error(DEPARTED_MIRROR_ACCESS_WARNING);
                }
                return Reflect.get(target, prop, receiver);
            }
        });
    }
    function throttle(func, wait, options = {}) {
        let timeout = null;
        let previous = 0;
        return function(...args) {
            const now = Date.now();
            if (!previous && options.leading === false) {
                previous = now;
            }
            const remaining = wait - (now - previous);
            const context = this;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                func.apply(context, args);
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(() => {
                    previous = options.leading === false ? 0 : Date.now();
                    timeout = null;
                    func.apply(context, args);
                }, remaining);
            }
        };
    }
    function hookSetter(target, key, d, isRevoked, win = window) {
        const original = win.Object.getOwnPropertyDescriptor(target, key);
        win.Object.defineProperty(target, key, isRevoked ? d : {
            set(value) {
                setTimeout(() => {
                    d.set.call(this, value);
                }, 0);
                if (original && original.set) {
                    original.set.call(this, value);
                }
            }
        });
        return () => hookSetter(target, key, original || {}, true);
    }
    function patch(source, name, replacement) {
        try {
            if (!(name in source)) {
                return () => {
                };
            }
            const original = source[name];
            const wrapped = replacement(original);
            if (typeof wrapped === "function") {
                wrapped.prototype = wrapped.prototype || {};
                Object.defineProperties(wrapped, {
                    __rrweb_original__: {
                        enumerable: false,
                        value: original
                    }
                });
            }
            source[name] = wrapped;
            return () => {
                source[name] = original;
            };
        } catch (e) {
            return () => {
            };
        }
    }
    function getWindowHeight() {
        return window.innerHeight || document.documentElement && document.documentElement.clientHeight || document.body && document.body.clientHeight;
    }
    function getWindowWidth() {
        return window.innerWidth || document.documentElement && document.documentElement.clientWidth || document.body && document.body.clientWidth;
    }
    function isBlocked(node, blockClass, checkAncestors) {
        if (!node) {
            return false;
        }
        const el = node.nodeType === node.ELEMENT_NODE ? node : node.parentElement;
        if (!el)
            return false;
        if (typeof blockClass === "string") {
            if (el.classList.contains(blockClass))
                return true;
            if (checkAncestors && el.closest("." + blockClass) !== null)
                return true;
        } else {
            if (classMatchesRegex(el, blockClass, checkAncestors))
                return true;
        }
        return false;
    }
    function isSerialized(n, mirror) {
        return mirror.getId(n) !== -1;
    }
    function isIgnored(n, mirror) {
        return mirror.getId(n) === IGNORED_NODE;
    }
    function isAncestorRemoved(target, mirror) {
        if (isShadowRoot(target)) {
            return false;
        }
        const id = mirror.getId(target);
        if (!mirror.has(id)) {
            return true;
        }
        if (target.parentNode && target.parentNode.nodeType === target.DOCUMENT_NODE) {
            return false;
        }
        if (!target.parentNode) {
            return true;
        }
        return isAncestorRemoved(target.parentNode, mirror);
    }
    function isTouchEvent(event) {
        return Boolean(event.changedTouches);
    }
    function polyfill$1(win = window) {
        if ("NodeList" in win && !win.NodeList.prototype.forEach) {
            win.NodeList.prototype.forEach = Array.prototype.forEach;
        }
        if ("DOMTokenList" in win && !win.DOMTokenList.prototype.forEach) {
            win.DOMTokenList.prototype.forEach = Array.prototype.forEach;
        }
        if (!Node.prototype.contains) {
            Node.prototype.contains = (...args) => {
                let node = args[0];
                if (!(0 in args)) {
                    throw new TypeError("1 argument is required");
                }
                do {
                    if (this === node) {
                        return true;
                    }
                } while (node = node && node.parentNode);
                return false;
            };
        }
    }
    function queueToResolveTrees(queue) {
        const queueNodeMap = {};
        const putIntoMap = (m, parent) => {
            const nodeInTree = {
                value: m,
                parent,
                children: []
            };
            queueNodeMap[m.node.id] = nodeInTree;
            return nodeInTree;
        };
        const queueNodeTrees = [];
        for (const mutation of queue) {
            const { nextId, parentId } = mutation;
            if (nextId && nextId in queueNodeMap) {
                const nextInTree = queueNodeMap[nextId];
                if (nextInTree.parent) {
                    const idx = nextInTree.parent.children.indexOf(nextInTree);
                    nextInTree.parent.children.splice(idx, 0, putIntoMap(mutation, nextInTree.parent));
                } else {
                    const idx = queueNodeTrees.indexOf(nextInTree);
                    queueNodeTrees.splice(idx, 0, putIntoMap(mutation, null));
                }
                continue;
            }
            if (parentId in queueNodeMap) {
                const parentInTree = queueNodeMap[parentId];
                parentInTree.children.push(putIntoMap(mutation, parentInTree));
                continue;
            }
            queueNodeTrees.push(putIntoMap(mutation, null));
        }
        return queueNodeTrees;
    }
    function iterateResolveTree(tree, cb) {
        cb(tree.value);
        for (let i = tree.children.length - 1; i >= 0; i--) {
            iterateResolveTree(tree.children[i], cb);
        }
    }
    function isSerializedIframe(n, mirror) {
        return Boolean(n.nodeName === "IFRAME" && mirror.getMeta(n));
    }
    function isSerializedStylesheet(n, mirror) {
        return Boolean(n.nodeName === "LINK" && n.nodeType === n.ELEMENT_NODE && n.getAttribute && n.getAttribute("rel") === "stylesheet" && mirror.getMeta(n));
    }
    function getBaseDimension(node, rootIframe) {
        var _a, _b;
        const frameElement = (_b = (_a = node.ownerDocument) == null ? void 0 : _a.defaultView) == null ? void 0 : _b.frameElement;
        if (!frameElement || frameElement === rootIframe) {
            return {
                x: 0,
                y: 0,
                relativeScale: 1,
                absoluteScale: 1
            };
        }
        const frameDimension = frameElement.getBoundingClientRect();
        const frameBaseDimension = getBaseDimension(frameElement, rootIframe);
        const relativeScale = frameDimension.height / frameElement.clientHeight;
        return {
            x: frameDimension.x * frameBaseDimension.relativeScale + frameBaseDimension.x,
            y: frameDimension.y * frameBaseDimension.relativeScale + frameBaseDimension.y,
            relativeScale,
            absoluteScale: frameBaseDimension.absoluteScale * relativeScale
        };
    }
    function hasShadowRoot(n) {
        return Boolean(n == null ? void 0 : n.shadowRoot);
    }
    function getNestedRule$1(rules, position) {
        const rule = rules[position[0]];
        if (position.length === 1) {
            return rule;
        } else {
            return getNestedRule$1(rule.cssRules[position[1]].cssRules, position.slice(2));
        }
    }
    function getPositionsAndIndex$1(nestedIndex) {
        const positions = [...nestedIndex];
        const index = positions.pop();
        return { positions, index };
    }
    function uniqueTextMutations(mutations) {
        const idSet = /* @__PURE__ */ new Set();
        const uniqueMutations = [];
        for (let i = mutations.length; i--; ) {
            const mutation = mutations[i];
            if (!idSet.has(mutation.id)) {
                uniqueMutations.push(mutation);
                idSet.add(mutation.id);
            }
        }
        return uniqueMutations;
    }

    var utils = /*#__PURE__*/Object.freeze({
        __proto__: null,
        on: on,
        get _mirror () { return exports.mirror; },
        throttle: throttle,
        hookSetter: hookSetter,
        patch: patch,
        getWindowHeight: getWindowHeight,
        getWindowWidth: getWindowWidth,
        isBlocked: isBlocked,
        isSerialized: isSerialized,
        isIgnored: isIgnored,
        isAncestorRemoved: isAncestorRemoved,
        isTouchEvent: isTouchEvent,
        polyfill: polyfill$1,
        queueToResolveTrees: queueToResolveTrees,
        iterateResolveTree: iterateResolveTree,
        isSerializedIframe: isSerializedIframe,
        isSerializedStylesheet: isSerializedStylesheet,
        getBaseDimension: getBaseDimension,
        hasShadowRoot: hasShadowRoot,
        getNestedRule: getNestedRule$1,
        getPositionsAndIndex: getPositionsAndIndex$1,
        uniqueTextMutations: uniqueTextMutations
    });

    var EventType = /* @__PURE__ */ ((EventType2) => {
        EventType2[EventType2["DomContentLoaded"] = 0] = "DomContentLoaded";
        EventType2[EventType2["Load"] = 1] = "Load";
        EventType2[EventType2["FullSnapshot"] = 2] = "FullSnapshot";
        EventType2[EventType2["IncrementalSnapshot"] = 3] = "IncrementalSnapshot";
        EventType2[EventType2["Meta"] = 4] = "Meta";
        EventType2[EventType2["Custom"] = 5] = "Custom";
        EventType2[EventType2["Plugin"] = 6] = "Plugin";
        return EventType2;
    })(EventType || {});
    var IncrementalSource = /* @__PURE__ */ ((IncrementalSource2) => {
        IncrementalSource2[IncrementalSource2["Mutation"] = 0] = "Mutation";
        IncrementalSource2[IncrementalSource2["MouseMove"] = 1] = "MouseMove";
        IncrementalSource2[IncrementalSource2["MouseInteraction"] = 2] = "MouseInteraction";
        IncrementalSource2[IncrementalSource2["Scroll"] = 3] = "Scroll";
        IncrementalSource2[IncrementalSource2["ViewportResize"] = 4] = "ViewportResize";
        IncrementalSource2[IncrementalSource2["Input"] = 5] = "Input";
        IncrementalSource2[IncrementalSource2["TouchMove"] = 6] = "TouchMove";
        IncrementalSource2[IncrementalSource2["MediaInteraction"] = 7] = "MediaInteraction";
        IncrementalSource2[IncrementalSource2["StyleSheetRule"] = 8] = "StyleSheetRule";
        IncrementalSource2[IncrementalSource2["CanvasMutation"] = 9] = "CanvasMutation";
        IncrementalSource2[IncrementalSource2["Font"] = 10] = "Font";
        IncrementalSource2[IncrementalSource2["Log"] = 11] = "Log";
        IncrementalSource2[IncrementalSource2["Drag"] = 12] = "Drag";
        IncrementalSource2[IncrementalSource2["StyleDeclaration"] = 13] = "StyleDeclaration";
        return IncrementalSource2;
    })(IncrementalSource || {});
    var MouseInteractions = /* @__PURE__ */ ((MouseInteractions2) => {
        MouseInteractions2[MouseInteractions2["MouseUp"] = 0] = "MouseUp";
        MouseInteractions2[MouseInteractions2["MouseDown"] = 1] = "MouseDown";
        MouseInteractions2[MouseInteractions2["Click"] = 2] = "Click";
        MouseInteractions2[MouseInteractions2["ContextMenu"] = 3] = "ContextMenu";
        MouseInteractions2[MouseInteractions2["DblClick"] = 4] = "DblClick";
        MouseInteractions2[MouseInteractions2["Focus"] = 5] = "Focus";
        MouseInteractions2[MouseInteractions2["Blur"] = 6] = "Blur";
        MouseInteractions2[MouseInteractions2["TouchStart"] = 7] = "TouchStart";
        MouseInteractions2[MouseInteractions2["TouchMove_Departed"] = 8] = "TouchMove_Departed";
        MouseInteractions2[MouseInteractions2["TouchEnd"] = 9] = "TouchEnd";
        MouseInteractions2[MouseInteractions2["TouchCancel"] = 10] = "TouchCancel";
        return MouseInteractions2;
    })(MouseInteractions || {});
    var CanvasContext = /* @__PURE__ */ ((CanvasContext2) => {
        CanvasContext2[CanvasContext2["2D"] = 0] = "2D";
        CanvasContext2[CanvasContext2["WebGL"] = 1] = "WebGL";
        CanvasContext2[CanvasContext2["WebGL2"] = 2] = "WebGL2";
        return CanvasContext2;
    })(CanvasContext || {});
    var MediaInteractions = /* @__PURE__ */ ((MediaInteractions2) => {
        MediaInteractions2[MediaInteractions2["Play"] = 0] = "Play";
        MediaInteractions2[MediaInteractions2["Pause"] = 1] = "Pause";
        MediaInteractions2[MediaInteractions2["Seeked"] = 2] = "Seeked";
        MediaInteractions2[MediaInteractions2["VolumeChange"] = 3] = "VolumeChange";
        return MediaInteractions2;
    })(MediaInteractions || {});
    var ReplayerEvents = /* @__PURE__ */ ((ReplayerEvents2) => {
        ReplayerEvents2["Start"] = "start";
        ReplayerEvents2["Pause"] = "pause";
        ReplayerEvents2["Resume"] = "resume";
        ReplayerEvents2["Resize"] = "resize";
        ReplayerEvents2["Finish"] = "finish";
        ReplayerEvents2["FullsnapshotRebuilded"] = "fullsnapshot-rebuilded";
        ReplayerEvents2["LoadStylesheetStart"] = "load-stylesheet-start";
        ReplayerEvents2["LoadStylesheetEnd"] = "load-stylesheet-end";
        ReplayerEvents2["SkipStart"] = "skip-start";
        ReplayerEvents2["SkipEnd"] = "skip-end";
        ReplayerEvents2["MouseInteraction"] = "mouse-interaction";
        ReplayerEvents2["EventCast"] = "event-cast";
        ReplayerEvents2["CustomEvent"] = "custom-event";
        ReplayerEvents2["Flush"] = "flush";
        ReplayerEvents2["StateChange"] = "state-change";
        ReplayerEvents2["PlayBack"] = "play-back";
        return ReplayerEvents2;
    })(ReplayerEvents || {});

    function isNodeInLinkedList(n) {
        return "__ln" in n;
    }
    class DoubleLinkedList {
        constructor() {
            this.length = 0;
            this.head = null;
        }
        get(position) {
            if (position >= this.length) {
                throw new Error("Position outside of list range");
            }
            let current = this.head;
            for (let index = 0; index < position; index++) {
                current = (current == null ? void 0 : current.next) || null;
            }
            return current;
        }
        addNode(n) {
            const node = {
                value: n,
                previous: null,
                next: null
            };
            n.__ln = node;
            if (n.previousSibling && isNodeInLinkedList(n.previousSibling)) {
                const current = n.previousSibling.__ln.next;
                node.next = current;
                node.previous = n.previousSibling.__ln;
                n.previousSibling.__ln.next = node;
                if (current) {
                    current.previous = node;
                }
            } else if (n.nextSibling && isNodeInLinkedList(n.nextSibling) && n.nextSibling.__ln.previous) {
                const current = n.nextSibling.__ln.previous;
                node.previous = current;
                node.next = n.nextSibling.__ln;
                n.nextSibling.__ln.previous = node;
                if (current) {
                    current.next = node;
                }
            } else {
                if (this.head) {
                    this.head.previous = node;
                }
                node.next = this.head;
                this.head = node;
            }
            this.length++;
        }
        removeNode(n) {
            const current = n.__ln;
            if (!this.head) {
                return;
            }
            if (!current.previous) {
                this.head = current.next;
                if (this.head) {
                    this.head.previous = null;
                }
            } else {
                current.previous.next = current.next;
                if (current.next) {
                    current.next.previous = current.previous;
                }
            }
            if (n.__ln) {
                delete n.__ln;
            }
            this.length--;
        }
    }
    const moveKey = (id, parentId) => `${id}@${parentId}`;
    class MutationBuffer {
        constructor() {
            this.frozen = false;
            this.locked = false;
            this.texts = [];
            this.attributes = [];
            this.removes = [];
            this.mapRemoves = [];
            this.movedMap = {};
            this.addedSet = /* @__PURE__ */ new Set();
            this.movedSet = /* @__PURE__ */ new Set();
            this.droppedSet = /* @__PURE__ */ new Set();
            this.processMutations = (mutations) => {
                mutations.forEach(this.processMutation);
                this.emit();
            };
            this.emit = () => {
                if (this.frozen || this.locked) {
                    return;
                }
                const adds = [];
                const addList = new DoubleLinkedList();
                const getNextId = (n) => {
                    let ns = n;
                    let nextId = IGNORED_NODE;
                    while (nextId === IGNORED_NODE) {
                        ns = ns && ns.nextSibling;
                        nextId = ns && this.mirror.getId(ns);
                    }
                    return nextId;
                };
                const pushAdd = (n) => {
                    var _a, _b, _c, _d, _e;
                    const shadowHost = n.getRootNode ? (_a = n.getRootNode()) == null ? void 0 : _a.host : null;
                    let rootShadowHost = shadowHost;
                    while ((_c = (_b = rootShadowHost == null ? void 0 : rootShadowHost.getRootNode) == null ? void 0 : _b.call(rootShadowHost)) == null ? void 0 : _c.host)
                        rootShadowHost = ((_e = (_d = rootShadowHost == null ? void 0 : rootShadowHost.getRootNode) == null ? void 0 : _d.call(rootShadowHost)) == null ? void 0 : _e.host) || null;
                    const notInDoc = !this.doc.contains(n) && (!rootShadowHost || !this.doc.contains(rootShadowHost));
                    if (!n.parentNode || notInDoc) {
                        return;
                    }
                    const parentId = isShadowRoot(n.parentNode) ? this.mirror.getId(shadowHost) : this.mirror.getId(n.parentNode);
                    const nextId = getNextId(n);
                    if (parentId === -1 || nextId === -1) {
                        return addList.addNode(n);
                    }
                    const sn = serializeNodeWithId(n, {
                        doc: this.doc,
                        mirror: this.mirror,
                        blockClass: this.blockClass,
                        blockSelector: this.blockSelector,
                        maskTextClass: this.maskTextClass,
                        maskTextSelector: this.maskTextSelector,
                        skipChild: true,
                        newlyAddedElement: true,
                        inlineStylesheet: this.inlineStylesheet,
                        maskInputOptions: this.maskInputOptions,
                        maskTextFn: this.maskTextFn,
                        maskInputFn: this.maskInputFn,
                        slimDOMOptions: this.slimDOMOptions,
                        recordCanvas: this.recordCanvas,
                        inlineImages: this.inlineImages,
                        onSerialize: (currentN) => {
                            if (isSerializedIframe(currentN, this.mirror)) {
                                this.iframeManager.addIframe(currentN);
                            }
                            if (isSerializedStylesheet(currentN, this.mirror)) {
                                this.stylesheetManager.addStylesheet(currentN);
                            }
                            if (hasShadowRoot(n)) {
                                this.shadowDomManager.addShadowRoot(n.shadowRoot, document);
                            }
                        },
                        onIframeLoad: (iframe, childSn) => {
                            this.iframeManager.attachIframe(iframe, childSn, this.mirror);
                            this.shadowDomManager.observeAttachShadow(iframe);
                        },
                        onStylesheetLoad: (link, childSn) => {
                            this.stylesheetManager.attachStylesheet(link, childSn, this.mirror);
                        }
                    });
                    if (sn) {
                        adds.push({
                            parentId,
                            nextId,
                            node: sn
                        });
                    }
                };
                while (this.mapRemoves.length) {
                    this.mirror.removeNodeFromMap(this.mapRemoves.shift());
                }
                for (const n of Array.from(this.movedSet.values())) {
                    if (isParentRemoved(this.removes, n, this.mirror) && !this.movedSet.has(n.parentNode)) {
                        continue;
                    }
                    pushAdd(n);
                }
                for (const n of Array.from(this.addedSet.values())) {
                    if (!isAncestorInSet(this.droppedSet, n) && !isParentRemoved(this.removes, n, this.mirror)) {
                        pushAdd(n);
                    } else if (isAncestorInSet(this.movedSet, n)) {
                        pushAdd(n);
                    } else {
                        this.droppedSet.add(n);
                    }
                }
                let candidate = null;
                while (addList.length) {
                    let node = null;
                    if (candidate) {
                        const parentId = this.mirror.getId(candidate.value.parentNode);
                        const nextId = getNextId(candidate.value);
                        if (parentId !== -1 && nextId !== -1) {
                            node = candidate;
                        }
                    }
                    if (!node) {
                        for (let index = addList.length - 1; index >= 0; index--) {
                            const _node = addList.get(index);
                            if (_node) {
                                const parentId = this.mirror.getId(_node.value.parentNode);
                                const nextId = getNextId(_node.value);
                                if (parentId !== -1 && nextId !== -1) {
                                    node = _node;
                                    break;
                                }
                            }
                        }
                    }
                    if (!node) {
                        while (addList.head) {
                            addList.removeNode(addList.head.value);
                        }
                        break;
                    }
                    candidate = node.previous;
                    addList.removeNode(node.value);
                    pushAdd(node.value);
                }
                const payload = {
                    texts: this.texts.map((text) => ({
                        id: this.mirror.getId(text.node),
                        value: text.value
                    })).filter((text) => this.mirror.has(text.id)),
                    attributes: this.attributes.map((attribute) => ({
                        id: this.mirror.getId(attribute.node),
                        attributes: attribute.attributes
                    })).filter((attribute) => this.mirror.has(attribute.id)),
                    removes: this.removes,
                    adds
                };
                if (!payload.texts.length && !payload.attributes.length && !payload.removes.length && !payload.adds.length) {
                    return;
                }
                this.texts = [];
                this.attributes = [];
                this.removes = [];
                this.addedSet = /* @__PURE__ */ new Set();
                this.movedSet = /* @__PURE__ */ new Set();
                this.droppedSet = /* @__PURE__ */ new Set();
                this.movedMap = {};
                this.mutationCb(payload);
            };
            this.processMutation = (m) => {
                if (isIgnored(m.target, this.mirror)) {
                    return;
                }
                switch (m.type) {
                    case "characterData": {
                        const value = m.target.textContent;
                        if (!isBlocked(m.target, this.blockClass, false) && value !== m.oldValue) {
                            this.texts.push({
                                value: needMaskingText(m.target, this.maskTextClass, this.maskTextSelector) && value ? this.maskTextFn ? this.maskTextFn(value) : value.replace(/[\S]/g, "*") : value,
                                node: m.target
                            });
                        }
                        break;
                    }
                    case "attributes": {
                        const target = m.target;
                        let value = m.target.getAttribute(m.attributeName);
                        if (m.attributeName === "value") {
                            value = maskInputValue({
                                maskInputOptions: this.maskInputOptions,
                                tagName: m.target.tagName,
                                type: m.target.getAttribute("type"),
                                value,
                                maskInputFn: this.maskInputFn
                            });
                        }
                        if (isBlocked(m.target, this.blockClass, false) || value === m.oldValue) {
                            return;
                        }
                        let item = this.attributes.find((a) => a.node === m.target);
                        if (!item) {
                            item = {
                                node: m.target,
                                attributes: {}
                            };
                            this.attributes.push(item);
                        }
                        if (m.attributeName === "style") {
                            const old = this.doc.createElement("span");
                            if (m.oldValue) {
                                old.setAttribute("style", m.oldValue);
                            }
                            if (item.attributes.style === void 0 || item.attributes.style === null) {
                                item.attributes.style = {};
                            }
                            const styleObj = item.attributes.style;
                            for (const pname of Array.from(target.style)) {
                                const newValue = target.style.getPropertyValue(pname);
                                const newPriority = target.style.getPropertyPriority(pname);
                                if (newValue !== old.style.getPropertyValue(pname) || newPriority !== old.style.getPropertyPriority(pname)) {
                                    if (newPriority === "") {
                                        styleObj[pname] = newValue;
                                    } else {
                                        styleObj[pname] = [newValue, newPriority];
                                    }
                                }
                            }
                            for (const pname of Array.from(old.style)) {
                                if (target.style.getPropertyValue(pname) === "") {
                                    styleObj[pname] = false;
                                }
                            }
                        } else {
                            item.attributes[m.attributeName] = transformAttribute(this.doc, m.target.tagName, m.attributeName, value);
                        }
                        break;
                    }
                    case "childList": {
                        if (isBlocked(m.target, this.blockClass, true))
                            return;
                        m.addedNodes.forEach((n) => this.genAdds(n, m.target));
                        m.removedNodes.forEach((n) => {
                            const nodeId = this.mirror.getId(n);
                            const parentId = isShadowRoot(m.target) ? this.mirror.getId(m.target.host) : this.mirror.getId(m.target);
                            if (isBlocked(m.target, this.blockClass, false) || isIgnored(n, this.mirror) || !isSerialized(n, this.mirror)) {
                                return;
                            }
                            if (this.addedSet.has(n)) {
                                deepDelete(this.addedSet, n);
                                this.droppedSet.add(n);
                            } else if (this.addedSet.has(m.target) && nodeId === -1) ; else if (isAncestorRemoved(m.target, this.mirror)) ; else if (this.movedSet.has(n) && this.movedMap[moveKey(nodeId, parentId)]) {
                                deepDelete(this.movedSet, n);
                            } else {
                                this.removes.push({
                                    parentId,
                                    id: nodeId,
                                    isShadow: isShadowRoot(m.target) && isNativeShadowDom(m.target) ? true : void 0
                                });
                            }
                            this.mapRemoves.push(n);
                        });
                        break;
                    }
                }
            };
            this.genAdds = (n, target) => {
                if (this.mirror.hasNode(n)) {
                    if (isIgnored(n, this.mirror)) {
                        return;
                    }
                    this.movedSet.add(n);
                    let targetId = null;
                    if (target && this.mirror.hasNode(target)) {
                        targetId = this.mirror.getId(target);
                    }
                    if (targetId && targetId !== -1) {
                        this.movedMap[moveKey(this.mirror.getId(n), targetId)] = true;
                    }
                } else {
                    this.addedSet.add(n);
                    this.droppedSet.delete(n);
                }
                if (!isBlocked(n, this.blockClass, false))
                    n.childNodes.forEach((childN) => this.genAdds(childN));
            };
        }
        init(options) {
            [
                "mutationCb",
                "blockClass",
                "blockSelector",
                "maskTextClass",
                "maskTextSelector",
                "inlineStylesheet",
                "maskInputOptions",
                "maskTextFn",
                "maskInputFn",
                "recordCanvas",
                "inlineImages",
                "slimDOMOptions",
                "doc",
                "mirror",
                "iframeManager",
                "stylesheetManager",
                "shadowDomManager",
                "canvasManager"
            ].forEach((key) => {
                this[key] = options[key];
            });
        }
        freeze() {
            this.frozen = true;
            this.canvasManager.freeze();
        }
        unfreeze() {
            this.frozen = false;
            this.canvasManager.unfreeze();
            this.emit();
        }
        isFrozen() {
            return this.frozen;
        }
        lock() {
            this.locked = true;
            this.canvasManager.lock();
        }
        unlock() {
            this.locked = false;
            this.canvasManager.unlock();
            this.emit();
        }
        reset() {
            this.shadowDomManager.reset();
            this.canvasManager.reset();
        }
    }
    function deepDelete(addsSet, n) {
        addsSet.delete(n);
        n.childNodes.forEach((childN) => deepDelete(addsSet, childN));
    }
    function isParentRemoved(removes, n, mirror) {
        if (removes.length === 0)
            return false;
        return _isParentRemoved(removes, n, mirror);
    }
    function _isParentRemoved(removes, n, mirror) {
        const { parentNode } = n;
        if (!parentNode) {
            return false;
        }
        const parentId = mirror.getId(parentNode);
        if (removes.some((r) => r.id === parentId)) {
            return true;
        }
        return _isParentRemoved(removes, parentNode, mirror);
    }
    function isAncestorInSet(set, n) {
        if (set.size === 0)
            return false;
        return _isAncestorInSet(set, n);
    }
    function _isAncestorInSet(set, n) {
        const { parentNode } = n;
        if (!parentNode) {
            return false;
        }
        if (set.has(parentNode)) {
            return true;
        }
        return _isAncestorInSet(set, parentNode);
    }

    var __defProp$5 = Object.defineProperty;
    var __defProps$5 = Object.defineProperties;
    var __getOwnPropDescs$5 = Object.getOwnPropertyDescriptors;
    var __getOwnPropSymbols$6 = Object.getOwnPropertySymbols;
    var __hasOwnProp$6 = Object.prototype.hasOwnProperty;
    var __propIsEnum$6 = Object.prototype.propertyIsEnumerable;
    var __defNormalProp$5 = (obj, key, value) => key in obj ? __defProp$5(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
    var __spreadValues$5 = (a, b) => {
        for (var prop in b || (b = {}))
            if (__hasOwnProp$6.call(b, prop))
                __defNormalProp$5(a, prop, b[prop]);
        if (__getOwnPropSymbols$6)
            for (var prop of __getOwnPropSymbols$6(b)) {
                if (__propIsEnum$6.call(b, prop))
                    __defNormalProp$5(a, prop, b[prop]);
            }
        return a;
    };
    var __spreadProps$5 = (a, b) => __defProps$5(a, __getOwnPropDescs$5(b));
    const mutationBuffers = [];
    const isCSSGroupingRuleSupported = typeof CSSGroupingRule !== "undefined";
    const isCSSMediaRuleSupported = typeof CSSMediaRule !== "undefined";
    const isCSSSupportsRuleSupported = typeof CSSSupportsRule !== "undefined";
    const isCSSConditionRuleSupported = typeof CSSConditionRule !== "undefined";
    function getEventTarget(event) {
        try {
            if ("composedPath" in event) {
                const path = event.composedPath();
                if (path.length) {
                    return path[0];
                }
            } else if ("path" in event && event.path.length) {
                return event.path[0];
            }
            return event.target;
        } catch (e) {
            return event.target;
        }
    }
    function initMutationObserver(options, rootEl) {
        var _a, _b;
        const mutationBuffer = new MutationBuffer();
        mutationBuffers.push(mutationBuffer);
        mutationBuffer.init(options);
        let mutationObserverCtor = window.MutationObserver || window.__rrMutationObserver;
        const angularZoneSymbol = (_b = (_a = window == null ? void 0 : window.Zone) == null ? void 0 : _a.__symbol__) == null ? void 0 : _b.call(_a, "MutationObserver");
        if (angularZoneSymbol && window[angularZoneSymbol]) {
            mutationObserverCtor = window[angularZoneSymbol];
        }
        const observer = new mutationObserverCtor(mutationBuffer.processMutations.bind(mutationBuffer));
        observer.observe(rootEl, {
            attributes: true,
            attributeOldValue: true,
            characterData: true,
            characterDataOldValue: true,
            childList: true,
            subtree: true
        });
        return observer;
    }
    function initMoveObserver({
                                  mousemoveCb,
                                  sampling,
                                  doc,
                                  mirror
                              }) {
        if (sampling.mousemove === false) {
            return () => {
            };
        }
        const threshold = typeof sampling.mousemove === "number" ? sampling.mousemove : 50;
        const callbackThreshold = typeof sampling.mousemoveCallback === "number" ? sampling.mousemoveCallback : 500;
        let positions = [];
        let timeBaseline;
        const wrappedCb = throttle((source) => {
            const totalOffset = Date.now() - timeBaseline;
            mousemoveCb(positions.map((p) => {
                p.timeOffset -= totalOffset;
                return p;
            }), source);
            positions = [];
            timeBaseline = null;
        }, callbackThreshold);
        const updatePosition = throttle((evt) => {
            const target = getEventTarget(evt);
            const { clientX, clientY } = isTouchEvent(evt) ? evt.changedTouches[0] : evt;
            if (!timeBaseline) {
                timeBaseline = Date.now();
            }
            positions.push({
                x: clientX,
                y: clientY,
                id: mirror.getId(target),
                timeOffset: Date.now() - timeBaseline
            });
            wrappedCb(typeof DragEvent !== "undefined" && evt instanceof DragEvent ? IncrementalSource.Drag : evt instanceof MouseEvent ? IncrementalSource.MouseMove : IncrementalSource.TouchMove);
        }, threshold, {
            trailing: false
        });
        const handlers = [
            on("mousemove", updatePosition, doc),
            on("touchmove", updatePosition, doc),
            on("drag", updatePosition, doc)
        ];
        return () => {
            handlers.forEach((h) => h());
        };
    }
    function initMouseInteractionObserver({
                                              mouseInteractionCb,
                                              doc,
                                              mirror,
                                              blockClass,
                                              sampling
                                          }) {
        if (sampling.mouseInteraction === false) {
            return () => {
            };
        }
        const disableMap = sampling.mouseInteraction === true || sampling.mouseInteraction === void 0 ? {} : sampling.mouseInteraction;
        const handlers = [];
        const getHandler = (eventKey) => {
            return (event) => {
                const target = getEventTarget(event);
                if (isBlocked(target, blockClass, true)) {
                    return;
                }
                const e = isTouchEvent(event) ? event.changedTouches[0] : event;
                if (!e) {
                    return;
                }
                const id = mirror.getId(target);
                const { clientX, clientY } = e;
                mouseInteractionCb({
                    type: MouseInteractions[eventKey],
                    id,
                    x: clientX,
                    y: clientY
                });
            };
        };
        Object.keys(MouseInteractions).filter((key) => Number.isNaN(Number(key)) && !key.endsWith("_Departed") && disableMap[key] !== false).forEach((eventKey) => {
            const eventName = eventKey.toLowerCase();
            const handler = getHandler(eventKey);
            handlers.push(on(eventName, handler, doc));
        });
        return () => {
            handlers.forEach((h) => h());
        };
    }
    function initScrollObserver({
                                    scrollCb,
                                    doc,
                                    mirror,
                                    blockClass,
                                    sampling
                                }) {
        const updatePosition = throttle((evt) => {
            const target = getEventTarget(evt);
            if (!target || isBlocked(target, blockClass, true)) {
                return;
            }
            const id = mirror.getId(target);
            if (target === doc) {
                const scrollEl = doc.scrollingElement || doc.documentElement;
                scrollCb({
                    id,
                    x: scrollEl.scrollLeft,
                    y: scrollEl.scrollTop
                });
            } else {
                scrollCb({
                    id,
                    x: target.scrollLeft,
                    y: target.scrollTop
                });
            }
        }, sampling.scroll || 100);
        return on("scroll", updatePosition, doc);
    }
    function initViewportResizeObserver({
                                            viewportResizeCb
                                        }) {
        let lastH = -1;
        let lastW = -1;
        const updateDimension = throttle(() => {
            const height = getWindowHeight();
            const width = getWindowWidth();
            if (lastH !== height || lastW !== width) {
                viewportResizeCb({
                    width: Number(width),
                    height: Number(height)
                });
                lastH = height;
                lastW = width;
            }
        }, 200);
        return on("resize", updateDimension, window);
    }
    function wrapEventWithUserTriggeredFlag(v, enable) {
        const value = __spreadValues$5({}, v);
        if (!enable)
            delete value.userTriggered;
        return value;
    }
    const INPUT_TAGS = ["INPUT", "TEXTAREA", "SELECT"];
    const lastInputValueMap = /* @__PURE__ */ new WeakMap();
    function initInputObserver({
                                   inputCb,
                                   doc,
                                   mirror,
                                   blockClass,
                                   ignoreClass,
                                   maskInputOptions,
                                   maskInputFn,
                                   sampling,
                                   userTriggeredOnInput
                               }) {
        function eventHandler(event) {
            let target = getEventTarget(event);
            const userTriggered = event.isTrusted;
            if (target && target.tagName === "OPTION")
                target = target.parentElement;
            if (!target || !target.tagName || INPUT_TAGS.indexOf(target.tagName) < 0 || isBlocked(target, blockClass, true)) {
                return;
            }
            const type = target.type;
            if (target.classList.contains(ignoreClass)) {
                return;
            }
            let text = target.value;
            let isChecked = false;
            if (type === "radio" || type === "checkbox") {
                isChecked = target.checked;
            } else if (maskInputOptions[target.tagName.toLowerCase()] || maskInputOptions[type]) {
                text = maskInputValue({
                    maskInputOptions,
                    tagName: target.tagName,
                    type,
                    value: text,
                    maskInputFn
                });
            }
            cbWithDedup(target, wrapEventWithUserTriggeredFlag({ text, isChecked, userTriggered }, userTriggeredOnInput));
            const name = target.name;
            if (type === "radio" && name && isChecked) {
                doc.querySelectorAll(`input[type="radio"][name="${name}"]`).forEach((el) => {
                    if (el !== target) {
                        cbWithDedup(el, wrapEventWithUserTriggeredFlag({
                            text: el.value,
                            isChecked: !isChecked,
                            userTriggered: false
                        }, userTriggeredOnInput));
                    }
                });
            }
        }
        function cbWithDedup(target, v) {
            const lastInputValue = lastInputValueMap.get(target);
            if (!lastInputValue || lastInputValue.text !== v.text || lastInputValue.isChecked !== v.isChecked) {
                lastInputValueMap.set(target, v);
                const id = mirror.getId(target);
                inputCb(__spreadProps$5(__spreadValues$5({}, v), {
                    id
                }));
            }
        }
        const events = sampling.input === "last" ? ["change"] : ["input", "change"];
        const handlers = events.map((eventName) => on(eventName, eventHandler, doc));
        const propertyDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
        const hookProperties = [
            [HTMLInputElement.prototype, "value"],
            [HTMLInputElement.prototype, "checked"],
            [HTMLSelectElement.prototype, "value"],
            [HTMLTextAreaElement.prototype, "value"],
            [HTMLSelectElement.prototype, "selectedIndex"],
            [HTMLOptionElement.prototype, "selected"]
        ];
        if (propertyDescriptor && propertyDescriptor.set) {
            handlers.push(...hookProperties.map((p) => hookSetter(p[0], p[1], {
                set() {
                    eventHandler({ target: this });
                }
            })));
        }
        return () => {
            handlers.forEach((h) => h());
        };
    }
    function getNestedCSSRulePositions(rule) {
        const positions = [];
        function recurse(childRule, pos) {
            if (isCSSGroupingRuleSupported && childRule.parentRule instanceof CSSGroupingRule || isCSSMediaRuleSupported && childRule.parentRule instanceof CSSMediaRule || isCSSSupportsRuleSupported && childRule.parentRule instanceof CSSSupportsRule || isCSSConditionRuleSupported && childRule.parentRule instanceof CSSConditionRule) {
                const rules = Array.from(childRule.parentRule.cssRules);
                const index = rules.indexOf(childRule);
                pos.unshift(index);
            } else {
                const rules = Array.from(childRule.parentStyleSheet.cssRules);
                const index = rules.indexOf(childRule);
                pos.unshift(index);
            }
            return pos;
        }
        return recurse(rule, positions);
    }
    function initStyleSheetObserver({ styleSheetRuleCb, mirror }, { win }) {
        const insertRule = win.CSSStyleSheet.prototype.insertRule;
        win.CSSStyleSheet.prototype.insertRule = function(rule, index) {
            const id = mirror.getId(this.ownerNode);
            if (id !== -1) {
                styleSheetRuleCb({
                    id,
                    adds: [{ rule, index }]
                });
            }
            return insertRule.apply(this, [rule, index]);
        };
        const deleteRule = win.CSSStyleSheet.prototype.deleteRule;
        win.CSSStyleSheet.prototype.deleteRule = function(index) {
            const id = mirror.getId(this.ownerNode);
            if (id !== -1) {
                styleSheetRuleCb({
                    id,
                    removes: [{ index }]
                });
            }
            return deleteRule.apply(this, [index]);
        };
        const supportedNestedCSSRuleTypes = {};
        if (isCSSGroupingRuleSupported) {
            supportedNestedCSSRuleTypes.CSSGroupingRule = win.CSSGroupingRule;
        } else {
            if (isCSSMediaRuleSupported) {
                supportedNestedCSSRuleTypes.CSSMediaRule = win.CSSMediaRule;
            }
            if (isCSSConditionRuleSupported) {
                supportedNestedCSSRuleTypes.CSSConditionRule = win.CSSConditionRule;
            }
            if (isCSSSupportsRuleSupported) {
                supportedNestedCSSRuleTypes.CSSSupportsRule = win.CSSSupportsRule;
            }
        }
        const unmodifiedFunctions = {};
        Object.entries(supportedNestedCSSRuleTypes).forEach(([typeKey, type]) => {
            unmodifiedFunctions[typeKey] = {
                insertRule: type.prototype.insertRule,
                deleteRule: type.prototype.deleteRule
            };
            type.prototype.insertRule = function(rule, index) {
                const id = mirror.getId(this.parentStyleSheet.ownerNode);
                if (id !== -1) {
                    styleSheetRuleCb({
                        id,
                        adds: [
                            {
                                rule,
                                index: [
                                    ...getNestedCSSRulePositions(this),
                                    index || 0
                                ]
                            }
                        ]
                    });
                }
                return unmodifiedFunctions[typeKey].insertRule.apply(this, [rule, index]);
            };
            type.prototype.deleteRule = function(index) {
                const id = mirror.getId(this.parentStyleSheet.ownerNode);
                if (id !== -1) {
                    styleSheetRuleCb({
                        id,
                        removes: [
                            { index: [...getNestedCSSRulePositions(this), index] }
                        ]
                    });
                }
                return unmodifiedFunctions[typeKey].deleteRule.apply(this, [index]);
            };
        });
        return () => {
            win.CSSStyleSheet.prototype.insertRule = insertRule;
            win.CSSStyleSheet.prototype.deleteRule = deleteRule;
            Object.entries(supportedNestedCSSRuleTypes).forEach(([typeKey, type]) => {
                type.prototype.insertRule = unmodifiedFunctions[typeKey].insertRule;
                type.prototype.deleteRule = unmodifiedFunctions[typeKey].deleteRule;
            });
        };
    }
    function initStyleDeclarationObserver({ styleDeclarationCb, mirror }, { win }) {
        const setProperty = win.CSSStyleDeclaration.prototype.setProperty;
        win.CSSStyleDeclaration.prototype.setProperty = function(property, value, priority) {
            var _a, _b;
            const id = mirror.getId((_b = (_a = this.parentRule) == null ? void 0 : _a.parentStyleSheet) == null ? void 0 : _b.ownerNode);
            if (id !== -1) {
                styleDeclarationCb({
                    id,
                    set: {
                        property,
                        value,
                        priority
                    },
                    index: getNestedCSSRulePositions(this.parentRule)
                });
            }
            return setProperty.apply(this, [property, value, priority]);
        };
        const removeProperty = win.CSSStyleDeclaration.prototype.removeProperty;
        win.CSSStyleDeclaration.prototype.removeProperty = function(property) {
            var _a, _b;
            const id = mirror.getId((_b = (_a = this.parentRule) == null ? void 0 : _a.parentStyleSheet) == null ? void 0 : _b.ownerNode);
            if (id !== -1) {
                styleDeclarationCb({
                    id,
                    remove: {
                        property
                    },
                    index: getNestedCSSRulePositions(this.parentRule)
                });
            }
            return removeProperty.apply(this, [property]);
        };
        return () => {
            win.CSSStyleDeclaration.prototype.setProperty = setProperty;
            win.CSSStyleDeclaration.prototype.removeProperty = removeProperty;
        };
    }
    function initMediaInteractionObserver({
                                              mediaInteractionCb,
                                              blockClass,
                                              mirror,
                                              sampling
                                          }) {
        const handler = (type) => throttle((event) => {
            const target = getEventTarget(event);
            if (!target || isBlocked(target, blockClass, true)) {
                return;
            }
            const { currentTime, volume, muted } = target;
            mediaInteractionCb({
                type,
                id: mirror.getId(target),
                currentTime,
                volume,
                muted
            });
        }, sampling.media || 500);
        const handlers = [
            on("play", handler(MediaInteractions.Play)),
            on("pause", handler(MediaInteractions.Pause)),
            on("seeked", handler(MediaInteractions.Seeked)),
            on("volumechange", handler(MediaInteractions.VolumeChange))
        ];
        return () => {
            handlers.forEach((h) => h());
        };
    }
    function initFontObserver({ fontCb, doc }) {
        const win = doc.defaultView;
        if (!win) {
            return () => {
            };
        }
        const handlers = [];
        const fontMap = /* @__PURE__ */ new WeakMap();
        const originalFontFace = win.FontFace;
        win.FontFace = function FontFace(family, source, descriptors) {
            const fontFace = new originalFontFace(family, source, descriptors);
            fontMap.set(fontFace, {
                family,
                buffer: typeof source !== "string",
                descriptors,
                fontSource: typeof source === "string" ? source : JSON.stringify(Array.from(new Uint8Array(source)))
            });
            return fontFace;
        };
        const restoreHandler = patch(doc.fonts, "add", function(original) {
            return function(fontFace) {
                setTimeout(() => {
                    const p = fontMap.get(fontFace);
                    if (p) {
                        fontCb(p);
                        fontMap.delete(fontFace);
                    }
                }, 0);
                return original.apply(this, [fontFace]);
            };
        });
        handlers.push(() => {
            win.FontFace = originalFontFace;
        });
        handlers.push(restoreHandler);
        return () => {
            handlers.forEach((h) => h());
        };
    }
    function mergeHooks(o, hooks) {
        const {
            mutationCb,
            mousemoveCb,
            mouseInteractionCb,
            scrollCb,
            viewportResizeCb,
            inputCb,
            mediaInteractionCb,
            styleSheetRuleCb,
            styleDeclarationCb,
            canvasMutationCb,
            fontCb
        } = o;
        o.mutationCb = (...p) => {
            if (hooks.mutation) {
                hooks.mutation(...p);
            }
            mutationCb(...p);
        };
        o.mousemoveCb = (...p) => {
            if (hooks.mousemove) {
                hooks.mousemove(...p);
            }
            mousemoveCb(...p);
        };
        o.mouseInteractionCb = (...p) => {
            if (hooks.mouseInteraction) {
                hooks.mouseInteraction(...p);
            }
            mouseInteractionCb(...p);
        };
        o.scrollCb = (...p) => {
            if (hooks.scroll) {
                hooks.scroll(...p);
            }
            scrollCb(...p);
        };
        o.viewportResizeCb = (...p) => {
            if (hooks.viewportResize) {
                hooks.viewportResize(...p);
            }
            viewportResizeCb(...p);
        };
        o.inputCb = (...p) => {
            if (hooks.input) {
                hooks.input(...p);
            }
            inputCb(...p);
        };
        o.mediaInteractionCb = (...p) => {
            if (hooks.mediaInteaction) {
                hooks.mediaInteaction(...p);
            }
            mediaInteractionCb(...p);
        };
        o.styleSheetRuleCb = (...p) => {
            if (hooks.styleSheetRule) {
                hooks.styleSheetRule(...p);
            }
            styleSheetRuleCb(...p);
        };
        o.styleDeclarationCb = (...p) => {
            if (hooks.styleDeclaration) {
                hooks.styleDeclaration(...p);
            }
            styleDeclarationCb(...p);
        };
        o.canvasMutationCb = (...p) => {
            if (hooks.canvasMutation) {
                hooks.canvasMutation(...p);
            }
            canvasMutationCb(...p);
        };
        o.fontCb = (...p) => {
            if (hooks.font) {
                hooks.font(...p);
            }
            fontCb(...p);
        };
    }
    function initObservers(o, hooks = {}) {
        const currentWindow = o.doc.defaultView;
        if (!currentWindow) {
            return () => {
            };
        }
        mergeHooks(o, hooks);
        const mutationObserver = initMutationObserver(o, o.doc);
        const mousemoveHandler = initMoveObserver(o);
        const mouseInteractionHandler = initMouseInteractionObserver(o);
        const scrollHandler = initScrollObserver(o);
        const viewportResizeHandler = initViewportResizeObserver(o);
        const inputHandler = initInputObserver(o);
        const mediaInteractionHandler = initMediaInteractionObserver(o);
        const styleSheetObserver = initStyleSheetObserver(o, { win: currentWindow });
        const styleDeclarationObserver = initStyleDeclarationObserver(o, {
            win: currentWindow
        });
        const fontObserver = o.collectFonts ? initFontObserver(o) : () => {
        };
        const pluginHandlers = [];
        for (const plugin of o.plugins) {
            pluginHandlers.push(plugin.observer(plugin.callback, currentWindow, plugin.options));
        }
        return () => {
            mutationBuffers.forEach((b) => b.reset());
            mutationObserver.disconnect();
            mousemoveHandler();
            mouseInteractionHandler();
            scrollHandler();
            viewportResizeHandler();
            inputHandler();
            mediaInteractionHandler();
            styleSheetObserver();
            styleDeclarationObserver();
            fontObserver();
            pluginHandlers.forEach((h) => h());
        };
    }

    class IframeManager {
        constructor(options) {
            this.iframes = /* @__PURE__ */ new WeakMap();
            this.mutationCb = options.mutationCb;
        }
        addIframe(iframeEl) {
            this.iframes.set(iframeEl, true);
        }
        addLoadListener(cb) {
            this.loadListener = cb;
        }
        attachIframe(iframeEl, childSn, mirror) {
            var _a;
            this.mutationCb({
                adds: [
                    {
                        parentId: mirror.getId(iframeEl),
                        nextId: null,
                        node: childSn
                    }
                ],
                removes: [],
                texts: [],
                attributes: [],
                isAttachIframe: true
            });
            (_a = this.loadListener) == null ? void 0 : _a.call(this, iframeEl);
        }
    }

    var __defProp$4 = Object.defineProperty;
    var __defProps$4 = Object.defineProperties;
    var __getOwnPropDescs$4 = Object.getOwnPropertyDescriptors;
    var __getOwnPropSymbols$5 = Object.getOwnPropertySymbols;
    var __hasOwnProp$5 = Object.prototype.hasOwnProperty;
    var __propIsEnum$5 = Object.prototype.propertyIsEnumerable;
    var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
    var __spreadValues$4 = (a, b) => {
        for (var prop in b || (b = {}))
            if (__hasOwnProp$5.call(b, prop))
                __defNormalProp$4(a, prop, b[prop]);
        if (__getOwnPropSymbols$5)
            for (var prop of __getOwnPropSymbols$5(b)) {
                if (__propIsEnum$5.call(b, prop))
                    __defNormalProp$4(a, prop, b[prop]);
            }
        return a;
    };
    var __spreadProps$4 = (a, b) => __defProps$4(a, __getOwnPropDescs$4(b));
    class ShadowDomManager {
        constructor(options) {
            this.restorePatches = [];
            this.mutationCb = options.mutationCb;
            this.scrollCb = options.scrollCb;
            this.bypassOptions = options.bypassOptions;
            this.mirror = options.mirror;
            const manager = this;
            this.restorePatches.push(patch(HTMLElement.prototype, "attachShadow", function(original) {
                return function(option) {
                    const shadowRoot = original.call(this, option);
                    if (this.shadowRoot)
                        manager.addShadowRoot(this.shadowRoot, this.ownerDocument);
                    return shadowRoot;
                };
            }));
        }
        addShadowRoot(shadowRoot, doc) {
            if (!isNativeShadowDom(shadowRoot))
                return;
            initMutationObserver(__spreadProps$4(__spreadValues$4({}, this.bypassOptions), {
                doc,
                mutationCb: this.mutationCb,
                mirror: this.mirror,
                shadowDomManager: this
            }), shadowRoot);
            initScrollObserver(__spreadProps$4(__spreadValues$4({}, this.bypassOptions), {
                scrollCb: this.scrollCb,
                doc: shadowRoot,
                mirror: this.mirror
            }));
        }
        observeAttachShadow(iframeElement) {
            if (iframeElement.contentWindow) {
                const manager = this;
                this.restorePatches.push(patch(iframeElement.contentWindow.HTMLElement.prototype, "attachShadow", function(original) {
                    return function(option) {
                        const shadowRoot = original.call(this, option);
                        if (this.shadowRoot)
                            manager.addShadowRoot(this.shadowRoot, iframeElement.contentDocument);
                        return shadowRoot;
                    };
                }));
            }
        }
        reset() {
            this.restorePatches.forEach((restorePatch) => restorePatch());
        }
    }

    /*
     * base64-arraybuffer 1.0.1 <https://github.com/niklasvh/base64-arraybuffer>
     * Copyright (c) 2021 Niklas von Hertzen <https://hertzen.com>
     * Released under MIT License
     */
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    // Use a lookup table to find the index.
    var lookup = typeof Uint8Array === 'undefined' ? [] : new Uint8Array(256);
    for (var i$2 = 0; i$2 < chars.length; i$2++) {
        lookup[chars.charCodeAt(i$2)] = i$2;
    }
    var encode = function (arraybuffer) {
        var bytes = new Uint8Array(arraybuffer), i, len = bytes.length, base64 = '';
        for (i = 0; i < len; i += 3) {
            base64 += chars[bytes[i] >> 2];
            base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
            base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
            base64 += chars[bytes[i + 2] & 63];
        }
        if (len % 3 === 2) {
            base64 = base64.substring(0, base64.length - 1) + '=';
        }
        else if (len % 3 === 1) {
            base64 = base64.substring(0, base64.length - 2) + '==';
        }
        return base64;
    };
    var decode = function (base64) {
        var bufferLength = base64.length * 0.75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
        if (base64[base64.length - 1] === '=') {
            bufferLength--;
            if (base64[base64.length - 2] === '=') {
                bufferLength--;
            }
        }
        var arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
        for (i = 0; i < len; i += 4) {
            encoded1 = lookup[base64.charCodeAt(i)];
            encoded2 = lookup[base64.charCodeAt(i + 1)];
            encoded3 = lookup[base64.charCodeAt(i + 2)];
            encoded4 = lookup[base64.charCodeAt(i + 3)];
            bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
            bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
            bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
        }
        return arraybuffer;
    };

    const canvasVarMap = /* @__PURE__ */ new Map();
    function variableListFor$1(ctx, ctor) {
        let contextMap = canvasVarMap.get(ctx);
        if (!contextMap) {
            contextMap = /* @__PURE__ */ new Map();
            canvasVarMap.set(ctx, contextMap);
        }
        if (!contextMap.has(ctor)) {
            contextMap.set(ctor, []);
        }
        return contextMap.get(ctor);
    }
    const saveWebGLVar = (value, win, ctx) => {
        if (!value || !(isInstanceOfWebGLObject(value, win) || typeof value === "object"))
            return;
        const name = value.constructor.name;
        const list = variableListFor$1(ctx, name);
        let index = list.indexOf(value);
        if (index === -1) {
            index = list.length;
            list.push(value);
        }
        return index;
    };
    function serializeArg(value, win, ctx) {
        if (value instanceof Array) {
            return value.map((arg) => serializeArg(arg, win, ctx));
        } else if (value === null) {
            return value;
        } else if (value instanceof Float32Array || value instanceof Float64Array || value instanceof Int32Array || value instanceof Uint32Array || value instanceof Uint8Array || value instanceof Uint16Array || value instanceof Int16Array || value instanceof Int8Array || value instanceof Uint8ClampedArray) {
            const name = value.constructor.name;
            return {
                rr_type: name,
                args: [Object.values(value)]
            };
        } else if (value instanceof ArrayBuffer) {
            const name = value.constructor.name;
            const base64 = encode(value);
            return {
                rr_type: name,
                base64
            };
        } else if (value instanceof DataView) {
            const name = value.constructor.name;
            return {
                rr_type: name,
                args: [
                    serializeArg(value.buffer, win, ctx),
                    value.byteOffset,
                    value.byteLength
                ]
            };
        } else if (value instanceof HTMLImageElement) {
            const name = value.constructor.name;
            const { src } = value;
            return {
                rr_type: name,
                src
            };
        } else if (value instanceof HTMLCanvasElement) {
            const name = "HTMLImageElement";
            const src = value.toDataURL();
            return {
                rr_type: name,
                src
            };
        } else if (value instanceof ImageData) {
            const name = value.constructor.name;
            return {
                rr_type: name,
                args: [serializeArg(value.data, win, ctx), value.width, value.height]
            };
        } else if (isInstanceOfWebGLObject(value, win) || typeof value === "object") {
            const name = value.constructor.name;
            const index = saveWebGLVar(value, win, ctx);
            return {
                rr_type: name,
                index
            };
        }
        return value;
    }
    const serializeArgs = (args, win, ctx) => {
        return [...args].map((arg) => serializeArg(arg, win, ctx));
    };
    const isInstanceOfWebGLObject = (value, win) => {
        const webGLConstructorNames = [
            "WebGLActiveInfo",
            "WebGLBuffer",
            "WebGLFramebuffer",
            "WebGLProgram",
            "WebGLRenderbuffer",
            "WebGLShader",
            "WebGLShaderPrecisionFormat",
            "WebGLTexture",
            "WebGLUniformLocation",
            "WebGLVertexArrayObject",
            "WebGLVertexArrayObjectOES"
        ];
        const supportedWebGLConstructorNames = webGLConstructorNames.filter((name) => typeof win[name] === "function");
        return Boolean(supportedWebGLConstructorNames.find((name) => value instanceof win[name]));
    };

    function initCanvas2DMutationObserver(cb, win, blockClass2, mirror) {
        const handlers = [];
        const props2D = Object.getOwnPropertyNames(win.CanvasRenderingContext2D.prototype);
        for (const prop of props2D) {
            try {
                if (typeof win.CanvasRenderingContext2D.prototype[prop] !== "function") {
                    continue;
                }
                const restoreHandler = patch(win.CanvasRenderingContext2D.prototype, prop, function(original) {
                    return function(...args) {
                        if (!isBlocked(this.canvas, blockClass2, true)) {
                            setTimeout(() => {
                                const recordArgs = serializeArgs([...args], win, this);
                                cb(this.canvas, {
                                    type: CanvasContext["2D"],
                                    property: prop,
                                    args: recordArgs
                                });
                            }, 0);
                        }
                        return original.apply(this, args);
                    };
                });
                handlers.push(restoreHandler);
            } catch (e) {
                const hookHandler = hookSetter(win.CanvasRenderingContext2D.prototype, prop, {
                    set(v) {
                        cb(this.canvas, {
                            type: CanvasContext["2D"],
                            property: prop,
                            args: [v],
                            setter: true
                        });
                    }
                });
                handlers.push(hookHandler);
            }
        }
        return () => {
            handlers.forEach((h) => h());
        };
    }

    function initCanvasContextObserver(win, blockClass) {
        const handlers = [];
        try {
            const restoreHandler = patch(win.HTMLCanvasElement.prototype, "getContext", function(original) {
                return function(contextType, ...args) {
                    if (!isBlocked(this, blockClass, true)) {
                        if (!("__context" in this))
                            this.__context = contextType;
                    }
                    return original.apply(this, [contextType, ...args]);
                };
            });
            handlers.push(restoreHandler);
        } catch (e) {
            console.error("failed to patch HTMLCanvasElement.prototype.getContext");
        }
        return () => {
            handlers.forEach((h) => h());
        };
    }

    function patchGLPrototype(prototype, type, cb, blockClass2, mirror, win) {
        const handlers = [];
        const props = Object.getOwnPropertyNames(prototype);
        for (const prop of props) {
            try {
                if (typeof prototype[prop] !== "function") {
                    continue;
                }
                const restoreHandler = patch(prototype, prop, function(original) {
                    return function(...args) {
                        const result = original.apply(this, args);
                        saveWebGLVar(result, win, prototype);
                        if (!isBlocked(this.canvas, blockClass2, true)) {
                            const recordArgs = serializeArgs([...args], win, prototype);
                            const mutation = {
                                type,
                                property: prop,
                                args: recordArgs
                            };
                            cb(this.canvas, mutation);
                        }
                        return result;
                    };
                });
                handlers.push(restoreHandler);
            } catch (e) {
                const hookHandler = hookSetter(prototype, prop, {
                    set(v) {
                        cb(this.canvas, {
                            type,
                            property: prop,
                            args: [v],
                            setter: true
                        });
                    }
                });
                handlers.push(hookHandler);
            }
        }
        return handlers;
    }
    function initCanvasWebGLMutationObserver(cb, win, blockClass2, mirror) {
        const handlers = [];
        handlers.push(...patchGLPrototype(win.WebGLRenderingContext.prototype, CanvasContext.WebGL, cb, blockClass2, mirror, win));
        if (typeof win.WebGL2RenderingContext !== "undefined") {
            handlers.push(...patchGLPrototype(win.WebGL2RenderingContext.prototype, CanvasContext.WebGL2, cb, blockClass2, mirror, win));
        }
        return () => {
            handlers.forEach((h) => h());
        };
    }

    function decodeBase64(base64, enableUnicode) {
        var binaryString = atob(base64);
        if (enableUnicode) {
            var binaryView = new Uint8Array(binaryString.length);
            for (var i = 0, n = binaryString.length; i < n; ++i) {
                binaryView[i] = binaryString.charCodeAt(i);
            }
            return String.fromCharCode.apply(null, new Uint16Array(binaryView.buffer));
        }
        return binaryString;
    }

    function createURL(base64, sourcemapArg, enableUnicodeArg) {
        var sourcemap = sourcemapArg === undefined ? null : sourcemapArg;
        var enableUnicode = enableUnicodeArg === undefined ? false : enableUnicodeArg;
        var source = decodeBase64(base64, enableUnicode);
        var start = source.indexOf('\n', 10) + 1;
        var body = source.substring(start) + (sourcemap ? '\/\/# sourceMappingURL=' + sourcemap : '');
        var blob = new Blob([body], { type: 'application/javascript' });
        return URL.createObjectURL(blob);
    }

    function createBase64WorkerFactory(base64, sourcemapArg, enableUnicodeArg) {
        var url;
        return function WorkerFactory(options) {
            url = url || createURL(base64, sourcemapArg, enableUnicodeArg);
            return new Worker(url, options);
        };
    }

    var WorkerFactory = createBase64WorkerFactory('Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwooZnVuY3Rpb24gKCkgewogICAgJ3VzZSBzdHJpY3QnOwoKICAgIC8qCiAgICAgKiBiYXNlNjQtYXJyYXlidWZmZXIgMS4wLjEgPGh0dHBzOi8vZ2l0aHViLmNvbS9uaWtsYXN2aC9iYXNlNjQtYXJyYXlidWZmZXI+CiAgICAgKiBDb3B5cmlnaHQgKGMpIDIwMjEgTmlrbGFzIHZvbiBIZXJ0emVuIDxodHRwczovL2hlcnR6ZW4uY29tPgogICAgICogUmVsZWFzZWQgdW5kZXIgTUlUIExpY2Vuc2UKICAgICAqLwogICAgdmFyIGNoYXJzID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nOwogICAgLy8gVXNlIGEgbG9va3VwIHRhYmxlIHRvIGZpbmQgdGhlIGluZGV4LgogICAgdmFyIGxvb2t1cCA9IHR5cGVvZiBVaW50OEFycmF5ID09PSAndW5kZWZpbmVkJyA/IFtdIDogbmV3IFVpbnQ4QXJyYXkoMjU2KTsKICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hhcnMubGVuZ3RoOyBpKyspIHsKICAgICAgICBsb29rdXBbY2hhcnMuY2hhckNvZGVBdChpKV0gPSBpOwogICAgfQogICAgdmFyIGVuY29kZSA9IGZ1bmN0aW9uIChhcnJheWJ1ZmZlcikgewogICAgICAgIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KGFycmF5YnVmZmVyKSwgaSwgbGVuID0gYnl0ZXMubGVuZ3RoLCBiYXNlNjQgPSAnJzsKICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpICs9IDMpIHsKICAgICAgICAgICAgYmFzZTY0ICs9IGNoYXJzW2J5dGVzW2ldID4+IDJdOwogICAgICAgICAgICBiYXNlNjQgKz0gY2hhcnNbKChieXRlc1tpXSAmIDMpIDw8IDQpIHwgKGJ5dGVzW2kgKyAxXSA+PiA0KV07CiAgICAgICAgICAgIGJhc2U2NCArPSBjaGFyc1soKGJ5dGVzW2kgKyAxXSAmIDE1KSA8PCAyKSB8IChieXRlc1tpICsgMl0gPj4gNildOwogICAgICAgICAgICBiYXNlNjQgKz0gY2hhcnNbYnl0ZXNbaSArIDJdICYgNjNdOwogICAgICAgIH0KICAgICAgICBpZiAobGVuICUgMyA9PT0gMikgewogICAgICAgICAgICBiYXNlNjQgPSBiYXNlNjQuc3Vic3RyaW5nKDAsIGJhc2U2NC5sZW5ndGggLSAxKSArICc9JzsKICAgICAgICB9CiAgICAgICAgZWxzZSBpZiAobGVuICUgMyA9PT0gMSkgewogICAgICAgICAgICBiYXNlNjQgPSBiYXNlNjQuc3Vic3RyaW5nKDAsIGJhc2U2NC5sZW5ndGggLSAyKSArICc9PSc7CiAgICAgICAgfQogICAgICAgIHJldHVybiBiYXNlNjQ7CiAgICB9OwoKICAgIGNvbnN0IGxhc3RCbG9iTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTsKICAgIGNvbnN0IHRyYW5zcGFyZW50QmxvYk1hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7CiAgICBhc3luYyBmdW5jdGlvbiBnZXRUcmFuc3BhcmVudEJsb2JGb3Iod2lkdGgsIGhlaWdodCkgewogICAgICBjb25zdCBpZCA9IGAke3dpZHRofS0ke2hlaWdodH1gOwogICAgICBpZiAodHJhbnNwYXJlbnRCbG9iTWFwLmhhcyhpZCkpCiAgICAgICAgcmV0dXJuIHRyYW5zcGFyZW50QmxvYk1hcC5nZXQoaWQpOwogICAgICBjb25zdCBvZmZzY3JlZW4gPSBuZXcgT2Zmc2NyZWVuQ2FudmFzKHdpZHRoLCBoZWlnaHQpOwogICAgICBvZmZzY3JlZW4uZ2V0Q29udGV4dCgiMmQiKTsKICAgICAgY29uc3QgYmxvYiA9IGF3YWl0IG9mZnNjcmVlbi5jb252ZXJ0VG9CbG9iKCk7CiAgICAgIGNvbnN0IGFycmF5QnVmZmVyID0gYXdhaXQgYmxvYi5hcnJheUJ1ZmZlcigpOwogICAgICBjb25zdCBiYXNlNjQgPSBlbmNvZGUoYXJyYXlCdWZmZXIpOwogICAgICB0cmFuc3BhcmVudEJsb2JNYXAuc2V0KGlkLCBiYXNlNjQpOwogICAgICByZXR1cm4gYmFzZTY0OwogICAgfQogICAgY29uc3Qgd29ya2VyID0gc2VsZjsKICAgIHdvcmtlci5vbm1lc3NhZ2UgPSBhc3luYyBmdW5jdGlvbihlKSB7CiAgICAgIGlmICghKCJPZmZzY3JlZW5DYW52YXMiIGluIGdsb2JhbFRoaXMpKQogICAgICAgIHJldHVybiB3b3JrZXIucG9zdE1lc3NhZ2UoeyBpZDogZS5kYXRhLmlkIH0pOwogICAgICBjb25zdCB7IGlkLCBiaXRtYXAsIHdpZHRoLCBoZWlnaHQgfSA9IGUuZGF0YTsKICAgICAgY29uc3QgdHJhbnNwYXJlbnRCYXNlNjQgPSBnZXRUcmFuc3BhcmVudEJsb2JGb3Iod2lkdGgsIGhlaWdodCk7CiAgICAgIGNvbnN0IG9mZnNjcmVlbiA9IG5ldyBPZmZzY3JlZW5DYW52YXMod2lkdGgsIGhlaWdodCk7CiAgICAgIGNvbnN0IGN0eCA9IG9mZnNjcmVlbi5nZXRDb250ZXh0KCIyZCIpOwogICAgICBjdHguZHJhd0ltYWdlKGJpdG1hcCwgMCwgMCk7CiAgICAgIGJpdG1hcC5jbG9zZSgpOwogICAgICBjb25zdCBibG9iID0gYXdhaXQgb2Zmc2NyZWVuLmNvbnZlcnRUb0Jsb2IoKTsKICAgICAgY29uc3QgdHlwZSA9IGJsb2IudHlwZTsKICAgICAgY29uc3QgYXJyYXlCdWZmZXIgPSBhd2FpdCBibG9iLmFycmF5QnVmZmVyKCk7CiAgICAgIGNvbnN0IGJhc2U2NCA9IGVuY29kZShhcnJheUJ1ZmZlcik7CiAgICAgIGlmICghbGFzdEJsb2JNYXAuaGFzKGlkKSAmJiBhd2FpdCB0cmFuc3BhcmVudEJhc2U2NCA9PT0gYmFzZTY0KSB7CiAgICAgICAgbGFzdEJsb2JNYXAuc2V0KGlkLCBiYXNlNjQpOwogICAgICAgIHJldHVybiB3b3JrZXIucG9zdE1lc3NhZ2UoeyBpZCB9KTsKICAgICAgfQogICAgICBpZiAobGFzdEJsb2JNYXAuZ2V0KGlkKSA9PT0gYmFzZTY0KQogICAgICAgIHJldHVybiB3b3JrZXIucG9zdE1lc3NhZ2UoeyBpZCB9KTsKICAgICAgd29ya2VyLnBvc3RNZXNzYWdlKHsKICAgICAgICBpZCwKICAgICAgICB0eXBlLAogICAgICAgIGJhc2U2NCwKICAgICAgICB3aWR0aCwKICAgICAgICBoZWlnaHQKICAgICAgfSk7CiAgICAgIGxhc3RCbG9iTWFwLnNldChpZCwgYmFzZTY0KTsKICAgIH07Cgp9KSgpOwoK', null, false);
    /* eslint-enable */

    var __getOwnPropSymbols$4 = Object.getOwnPropertySymbols;
    var __hasOwnProp$4 = Object.prototype.hasOwnProperty;
    var __propIsEnum$4 = Object.prototype.propertyIsEnumerable;
    var __objRest = (source, exclude) => {
        var target = {};
        for (var prop in source)
            if (__hasOwnProp$4.call(source, prop) && exclude.indexOf(prop) < 0)
                target[prop] = source[prop];
        if (source != null && __getOwnPropSymbols$4)
            for (var prop of __getOwnPropSymbols$4(source)) {
                if (exclude.indexOf(prop) < 0 && __propIsEnum$4.call(source, prop))
                    target[prop] = source[prop];
            }
        return target;
    };
    var __async$5 = (__this, __arguments, generator) => {
        return new Promise((resolve, reject) => {
            var fulfilled = (value) => {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            };
            var rejected = (value) => {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            };
            var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
            step((generator = generator.apply(__this, __arguments)).next());
        });
    };
    class CanvasManager {
        constructor(options) {
            this.pendingCanvasMutations = /* @__PURE__ */ new Map();
            this.rafStamps = { latestId: 0, invokeId: null };
            this.frozen = false;
            this.locked = false;
            this.processMutation = (target, mutation) => {
                const newFrame = this.rafStamps.invokeId && this.rafStamps.latestId !== this.rafStamps.invokeId;
                if (newFrame || !this.rafStamps.invokeId)
                    this.rafStamps.invokeId = this.rafStamps.latestId;
                if (!this.pendingCanvasMutations.has(target)) {
                    this.pendingCanvasMutations.set(target, []);
                }
                this.pendingCanvasMutations.get(target).push(mutation);
            };
            const { sampling = "all", win, blockClass, recordCanvas } = options;
            this.mutationCb = options.mutationCb;
            this.mirror = options.mirror;
            if (recordCanvas && sampling === "all")
                this.initCanvasMutationObserver(win, blockClass);
            if (recordCanvas && typeof sampling === "number")
                this.initCanvasFPSObserver(sampling, win, blockClass);
        }
        reset() {
            this.pendingCanvasMutations.clear();
            this.resetObservers && this.resetObservers();
        }
        freeze() {
            this.frozen = true;
        }
        unfreeze() {
            this.frozen = false;
        }
        lock() {
            this.locked = true;
        }
        unlock() {
            this.locked = false;
        }
        initCanvasFPSObserver(fps, win, blockClass) {
            const canvasContextReset = initCanvasContextObserver(win, blockClass);
            const snapshotInProgressMap = /* @__PURE__ */ new Map();
            const worker = new WorkerFactory();
            worker.onmessage = (e) => {
                const { id } = e.data;
                snapshotInProgressMap.set(id, false);
                if (!("base64" in e.data))
                    return;
                const { base64, type, width, height } = e.data;
                this.mutationCb({
                    id,
                    type: CanvasContext["2D"],
                    commands: [
                        {
                            property: "clearRect",
                            args: [0, 0, width, height]
                        },
                        {
                            property: "drawImage",
                            args: [
                                {
                                    rr_type: "ImageBitmap",
                                    args: [
                                        {
                                            rr_type: "Blob",
                                            data: [{ rr_type: "ArrayBuffer", base64 }],
                                            type
                                        }
                                    ]
                                },
                                0,
                                0
                            ]
                        }
                    ]
                });
            };
            const timeBetweenSnapshots = 1e3 / fps;
            let lastSnapshotTime = 0;
            let rafId;
            const takeCanvasSnapshots = (timestamp) => {
                if (lastSnapshotTime && timestamp - lastSnapshotTime < timeBetweenSnapshots) {
                    rafId = requestAnimationFrame(takeCanvasSnapshots);
                    return;
                }
                lastSnapshotTime = timestamp;
                win.document.querySelectorAll(`canvas:not(.${blockClass} *)`).forEach((canvas) => __async$5(this, null, function* () {
                    var _a;
                    const id = this.mirror.getId(canvas);
                    if (snapshotInProgressMap.get(id))
                        return;
                    snapshotInProgressMap.set(id, true);
                    if (["webgl", "webgl2"].includes(canvas.__context)) {
                        const context = canvas.getContext(canvas.__context);
                        if (((_a = context == null ? void 0 : context.getContextAttributes()) == null ? void 0 : _a.preserveDrawingBuffer) === false) {
                            context == null ? void 0 : context.clear(context.COLOR_BUFFER_BIT);
                        }
                    }
                    const bitmap = yield createImageBitmap(canvas);
                    worker.postMessage({
                        id,
                        bitmap,
                        width: canvas.width,
                        height: canvas.height
                    }, [bitmap]);
                }));
                rafId = requestAnimationFrame(takeCanvasSnapshots);
            };
            rafId = requestAnimationFrame(takeCanvasSnapshots);
            this.resetObservers = () => {
                canvasContextReset();
                cancelAnimationFrame(rafId);
            };
        }
        initCanvasMutationObserver(win, blockClass) {
            this.startRAFTimestamping();
            this.startPendingCanvasMutationFlusher();
            const canvasContextReset = initCanvasContextObserver(win, blockClass);
            const canvas2DReset = initCanvas2DMutationObserver(this.processMutation.bind(this), win, blockClass, this.mirror);
            const canvasWebGL1and2Reset = initCanvasWebGLMutationObserver(this.processMutation.bind(this), win, blockClass, this.mirror);
            this.resetObservers = () => {
                canvasContextReset();
                canvas2DReset();
                canvasWebGL1and2Reset();
            };
        }
        startPendingCanvasMutationFlusher() {
            requestAnimationFrame(() => this.flushPendingCanvasMutations());
        }
        startRAFTimestamping() {
            const setLatestRAFTimestamp = (timestamp) => {
                this.rafStamps.latestId = timestamp;
                requestAnimationFrame(setLatestRAFTimestamp);
            };
            requestAnimationFrame(setLatestRAFTimestamp);
        }
        flushPendingCanvasMutations() {
            this.pendingCanvasMutations.forEach((values, canvas) => {
                const id = this.mirror.getId(canvas);
                this.flushPendingCanvasMutationFor(canvas, id);
            });
            requestAnimationFrame(() => this.flushPendingCanvasMutations());
        }
        flushPendingCanvasMutationFor(canvas, id) {
            if (this.frozen || this.locked) {
                return;
            }
            const valuesWithType = this.pendingCanvasMutations.get(canvas);
            if (!valuesWithType || id === -1)
                return;
            const values = valuesWithType.map((value) => {
                const _a = value, rest = __objRest(_a, ["type"]);
                return rest;
            });
            const { type } = valuesWithType[0];
            this.mutationCb({ id, type, commands: values });
            this.pendingCanvasMutations.delete(canvas);
        }
    }

    class StylesheetManager {
        constructor(options) {
            this.trackedStylesheets = /* @__PURE__ */ new WeakSet();
            this.mutationCb = options.mutationCb;
        }
        addStylesheet(linkEl) {
            if (this.trackedStylesheets.has(linkEl))
                return;
            this.trackedStylesheets.add(linkEl);
            this.trackStylesheet(linkEl);
        }
        trackStylesheet(linkEl) {
        }
        attachStylesheet(linkEl, childSn, mirror) {
            this.mutationCb({
                adds: [
                    {
                        parentId: mirror.getId(linkEl),
                        nextId: null,
                        node: childSn
                    }
                ],
                removes: [],
                texts: [],
                attributes: []
            });
            this.addStylesheet(linkEl);
        }
    }

    var __defProp$3 = Object.defineProperty;
    var __defProps$3 = Object.defineProperties;
    var __getOwnPropDescs$3 = Object.getOwnPropertyDescriptors;
    var __getOwnPropSymbols$3 = Object.getOwnPropertySymbols;
    var __hasOwnProp$3 = Object.prototype.hasOwnProperty;
    var __propIsEnum$3 = Object.prototype.propertyIsEnumerable;
    var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
    var __spreadValues$3 = (a, b) => {
        for (var prop in b || (b = {}))
            if (__hasOwnProp$3.call(b, prop))
                __defNormalProp$3(a, prop, b[prop]);
        if (__getOwnPropSymbols$3)
            for (var prop of __getOwnPropSymbols$3(b)) {
                if (__propIsEnum$3.call(b, prop))
                    __defNormalProp$3(a, prop, b[prop]);
            }
        return a;
    };
    var __spreadProps$3 = (a, b) => __defProps$3(a, __getOwnPropDescs$3(b));
    function wrapEvent(e) {
        return __spreadProps$3(__spreadValues$3({}, e), {
            timestamp: Date.now()
        });
    }
    let wrappedEmit;
    let takeFullSnapshot;
    const mirror = createMirror$2();
    function record(options = {}) {
        const {
            emit,
            checkoutEveryNms,
            checkoutEveryNth,
            blockClass = "rr-block",
            blockSelector = null,
            ignoreClass = "rr-ignore",
            maskTextClass = "rr-mask",
            maskTextSelector = null,
            inlineStylesheet = true,
            maskAllInputs,
            maskInputOptions: _maskInputOptions,
            slimDOMOptions: _slimDOMOptions,
            maskInputFn,
            maskTextFn,
            hooks,
            packFn,
            sampling = {},
            mousemoveWait,
            recordCanvas = false,
            userTriggeredOnInput = false,
            collectFonts = false,
            inlineImages = false,
            plugins,
            keepIframeSrcFn = () => false
        } = options;
        if (!emit) {
            throw new Error("emit function is required");
        }
        if (mousemoveWait !== void 0 && sampling.mousemove === void 0) {
            sampling.mousemove = mousemoveWait;
        }
        mirror.reset();
        const maskInputOptions = maskAllInputs === true ? {
            color: true,
            date: true,
            "datetime-local": true,
            email: true,
            month: true,
            number: true,
            range: true,
            search: true,
            tel: true,
            text: true,
            time: true,
            url: true,
            week: true,
            textarea: true,
            select: true,
            password: true
        } : _maskInputOptions !== void 0 ? _maskInputOptions : { password: true };
        const slimDOMOptions = _slimDOMOptions === true || _slimDOMOptions === "all" ? {
            script: true,
            comment: true,
            headFavicon: true,
            headWhitespace: true,
            headMetaSocial: true,
            headMetaRobots: true,
            headMetaHttpEquiv: true,
            headMetaVerification: true,
            headMetaAuthorship: _slimDOMOptions === "all",
            headMetaDescKeywords: _slimDOMOptions === "all"
        } : _slimDOMOptions ? _slimDOMOptions : {};
        polyfill$1();
        let lastFullSnapshotEvent;
        let incrementalSnapshotCount = 0;
        const eventProcessor = (e) => {
            for (const plugin of plugins || []) {
                if (plugin.eventProcessor) {
                    e = plugin.eventProcessor(e);
                }
            }
            if (packFn) {
                e = packFn(e);
            }
            return e;
        };
        wrappedEmit = (e, isCheckout) => {
            var _a;
            if (((_a = mutationBuffers[0]) == null ? void 0 : _a.isFrozen()) && e.type !== EventType.FullSnapshot && !(e.type === EventType.IncrementalSnapshot && e.data.source === IncrementalSource.Mutation)) {
                mutationBuffers.forEach((buf) => buf.unfreeze());
            }
            emit(eventProcessor(e), isCheckout);
            if (e.type === EventType.FullSnapshot) {
                lastFullSnapshotEvent = e;
                incrementalSnapshotCount = 0;
            } else if (e.type === EventType.IncrementalSnapshot) {
                if (e.data.source === IncrementalSource.Mutation && e.data.isAttachIframe) {
                    return;
                }
                incrementalSnapshotCount++;
                const exceedCount = checkoutEveryNth && incrementalSnapshotCount >= checkoutEveryNth;
                const exceedTime = checkoutEveryNms && e.timestamp - lastFullSnapshotEvent.timestamp > checkoutEveryNms;
                if (exceedCount || exceedTime) {
                    takeFullSnapshot(true);
                }
            }
        };
        const wrappedMutationEmit = (m) => {
            wrappedEmit(wrapEvent({
                type: EventType.IncrementalSnapshot,
                data: __spreadValues$3({
                    source: IncrementalSource.Mutation
                }, m)
            }));
        };
        const wrappedScrollEmit = (p) => wrappedEmit(wrapEvent({
            type: EventType.IncrementalSnapshot,
            data: __spreadValues$3({
                source: IncrementalSource.Scroll
            }, p)
        }));
        const wrappedCanvasMutationEmit = (p) => wrappedEmit(wrapEvent({
            type: EventType.IncrementalSnapshot,
            data: __spreadValues$3({
                source: IncrementalSource.CanvasMutation
            }, p)
        }));
        const iframeManager = new IframeManager({
            mutationCb: wrappedMutationEmit
        });
        const stylesheetManager = new StylesheetManager({
            mutationCb: wrappedMutationEmit
        });
        const canvasManager = new CanvasManager({
            recordCanvas,
            mutationCb: wrappedCanvasMutationEmit,
            win: window,
            blockClass,
            mirror,
            sampling: sampling.canvas
        });
        const shadowDomManager = new ShadowDomManager({
            mutationCb: wrappedMutationEmit,
            scrollCb: wrappedScrollEmit,
            bypassOptions: {
                blockClass,
                blockSelector,
                maskTextClass,
                maskTextSelector,
                inlineStylesheet,
                maskInputOptions,
                maskTextFn,
                maskInputFn,
                recordCanvas,
                inlineImages,
                sampling,
                slimDOMOptions,
                iframeManager,
                stylesheetManager,
                canvasManager
            },
            mirror
        });
        takeFullSnapshot = (isCheckout = false) => {
            var _a, _b, _c, _d;
            wrappedEmit(wrapEvent({
                type: EventType.Meta,
                data: {
                    href: window.location.href,
                    width: getWindowWidth(),
                    height: getWindowHeight()
                }
            }), isCheckout);
            mutationBuffers.forEach((buf) => buf.lock());
            const node = snapshot(document, {
                mirror,
                blockClass,
                blockSelector,
                maskTextClass,
                maskTextSelector,
                inlineStylesheet,
                maskAllInputs: maskInputOptions,
                maskTextFn,
                slimDOM: slimDOMOptions,
                recordCanvas,
                inlineImages,
                onSerialize: (n) => {
                    if (isSerializedIframe(n, mirror)) {
                        iframeManager.addIframe(n);
                    }
                    if (isSerializedStylesheet(n, mirror)) {
                        stylesheetManager.addStylesheet(n);
                    }
                    if (hasShadowRoot(n)) {
                        shadowDomManager.addShadowRoot(n.shadowRoot, document);
                    }
                },
                onIframeLoad: (iframe, childSn) => {
                    iframeManager.attachIframe(iframe, childSn, mirror);
                    shadowDomManager.observeAttachShadow(iframe);
                },
                onStylesheetLoad: (linkEl, childSn) => {
                    stylesheetManager.attachStylesheet(linkEl, childSn, mirror);
                },
                keepIframeSrcFn
            });
            if (!node) {
                return console.warn("Failed to snapshot the document");
            }
            wrappedEmit(wrapEvent({
                type: EventType.FullSnapshot,
                data: {
                    node,
                    initialOffset: {
                        left: window.pageXOffset !== void 0 ? window.pageXOffset : (document == null ? void 0 : document.documentElement.scrollLeft) || ((_b = (_a = document == null ? void 0 : document.body) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.scrollLeft) || (document == null ? void 0 : document.body.scrollLeft) || 0,
                        top: window.pageYOffset !== void 0 ? window.pageYOffset : (document == null ? void 0 : document.documentElement.scrollTop) || ((_d = (_c = document == null ? void 0 : document.body) == null ? void 0 : _c.parentElement) == null ? void 0 : _d.scrollTop) || (document == null ? void 0 : document.body.scrollTop) || 0
                    }
                }
            }));
            mutationBuffers.forEach((buf) => buf.unlock());
        };
        try {
            const handlers = [];
            handlers.push(on("DOMContentLoaded", () => {
                wrappedEmit(wrapEvent({
                    type: EventType.DomContentLoaded,
                    data: {}
                }));
            }));
            const observe = (doc) => {
                var _a;
                return initObservers({
                    mutationCb: wrappedMutationEmit,
                    mousemoveCb: (positions, source) => wrappedEmit(wrapEvent({
                        type: EventType.IncrementalSnapshot,
                        data: {
                            source,
                            positions
                        }
                    })),
                    mouseInteractionCb: (d) => wrappedEmit(wrapEvent({
                        type: EventType.IncrementalSnapshot,
                        data: __spreadValues$3({
                            source: IncrementalSource.MouseInteraction
                        }, d)
                    })),
                    scrollCb: wrappedScrollEmit,
                    viewportResizeCb: (d) => wrappedEmit(wrapEvent({
                        type: EventType.IncrementalSnapshot,
                        data: __spreadValues$3({
                            source: IncrementalSource.ViewportResize
                        }, d)
                    })),
                    inputCb: (v) => wrappedEmit(wrapEvent({
                        type: EventType.IncrementalSnapshot,
                        data: __spreadValues$3({
                            source: IncrementalSource.Input
                        }, v)
                    })),
                    mediaInteractionCb: (p) => wrappedEmit(wrapEvent({
                        type: EventType.IncrementalSnapshot,
                        data: __spreadValues$3({
                            source: IncrementalSource.MediaInteraction
                        }, p)
                    })),
                    styleSheetRuleCb: (r) => wrappedEmit(wrapEvent({
                        type: EventType.IncrementalSnapshot,
                        data: __spreadValues$3({
                            source: IncrementalSource.StyleSheetRule
                        }, r)
                    })),
                    styleDeclarationCb: (r) => wrappedEmit(wrapEvent({
                        type: EventType.IncrementalSnapshot,
                        data: __spreadValues$3({
                            source: IncrementalSource.StyleDeclaration
                        }, r)
                    })),
                    canvasMutationCb: wrappedCanvasMutationEmit,
                    fontCb: (p) => wrappedEmit(wrapEvent({
                        type: EventType.IncrementalSnapshot,
                        data: __spreadValues$3({
                            source: IncrementalSource.Font
                        }, p)
                    })),
                    blockClass,
                    ignoreClass,
                    maskTextClass,
                    maskTextSelector,
                    maskInputOptions,
                    inlineStylesheet,
                    sampling,
                    recordCanvas,
                    inlineImages,
                    userTriggeredOnInput,
                    collectFonts,
                    doc,
                    maskInputFn,
                    maskTextFn,
                    blockSelector,
                    slimDOMOptions,
                    mirror,
                    iframeManager,
                    stylesheetManager,
                    shadowDomManager,
                    canvasManager,
                    plugins: ((_a = plugins == null ? void 0 : plugins.filter((p) => p.observer)) == null ? void 0 : _a.map((p) => ({
                        observer: p.observer,
                        options: p.options,
                        callback: (payload) => wrappedEmit(wrapEvent({
                            type: EventType.Plugin,
                            data: {
                                plugin: p.name,
                                payload
                            }
                        }))
                    }))) || []
                }, hooks);
            };
            iframeManager.addLoadListener((iframeEl) => {
                handlers.push(observe(iframeEl.contentDocument));
            });
            const init = () => {
                takeFullSnapshot();
                handlers.push(observe(document));
            };
            if (document.readyState === "interactive" || document.readyState === "complete") {
                init();
            } else {
                handlers.push(on("load", () => {
                    wrappedEmit(wrapEvent({
                        type: EventType.Load,
                        data: {}
                    }));
                    init();
                }, window));
            }
            return () => {
                handlers.forEach((h) => h());
            };
        } catch (error) {
            console.warn(error);
        }
    }
    record.addCustomEvent = (tag, payload) => {
        if (!wrappedEmit) {
            throw new Error("please add custom event after start recording");
        }
        wrappedEmit(wrapEvent({
            type: EventType.Custom,
            data: {
                tag,
                payload
            }
        }));
    };
    record.freezePage = () => {
        mutationBuffers.forEach((buf) => buf.freeze());
    };
    record.takeFullSnapshot = (isCheckout) => {
        if (!takeFullSnapshot) {
            throw new Error("please take full snapshot after start recording");
        }
        takeFullSnapshot(isCheckout);
    };
    record.mirror = mirror;

    var NodeType$1;
    (function(NodeType2) {
        NodeType2[NodeType2["Document"] = 0] = "Document";
        NodeType2[NodeType2["DocumentType"] = 1] = "DocumentType";
        NodeType2[NodeType2["Element"] = 2] = "Element";
        NodeType2[NodeType2["Text"] = 3] = "Text";
        NodeType2[NodeType2["CDATA"] = 4] = "CDATA";
        NodeType2[NodeType2["Comment"] = 5] = "Comment";
    })(NodeType$1 || (NodeType$1 = {}));
    var Mirror$1 = function() {
        function Mirror2() {
            this.idNodeMap = /* @__PURE__ */ new Map();
            this.nodeMetaMap = /* @__PURE__ */ new WeakMap();
        }
        Mirror2.prototype.getId = function(n) {
            var _a;
            if (!n)
                return -1;
            var id = (_a = this.getMeta(n)) === null || _a === void 0 ? void 0 : _a.id;
            return id !== null && id !== void 0 ? id : -1;
        };
        Mirror2.prototype.getNode = function(id) {
            return this.idNodeMap.get(id) || null;
        };
        Mirror2.prototype.getIds = function() {
            return Array.from(this.idNodeMap.keys());
        };
        Mirror2.prototype.getMeta = function(n) {
            return this.nodeMetaMap.get(n) || null;
        };
        Mirror2.prototype.removeNodeFromMap = function(n) {
            var _this = this;
            var id = this.getId(n);
            this.idNodeMap["delete"](id);
            if (n.childNodes) {
                n.childNodes.forEach(function(childNode) {
                    return _this.removeNodeFromMap(childNode);
                });
            }
        };
        Mirror2.prototype.has = function(id) {
            return this.idNodeMap.has(id);
        };
        Mirror2.prototype.hasNode = function(node) {
            return this.nodeMetaMap.has(node);
        };
        Mirror2.prototype.add = function(n, meta) {
            var id = meta.id;
            this.idNodeMap.set(id, n);
            this.nodeMetaMap.set(n, meta);
        };
        Mirror2.prototype.replace = function(id, n) {
            this.idNodeMap.set(id, n);
        };
        Mirror2.prototype.reset = function() {
            this.idNodeMap = /* @__PURE__ */ new Map();
            this.nodeMetaMap = /* @__PURE__ */ new WeakMap();
        };
        return Mirror2;
    }();
    function createMirror$1() {
        return new Mirror$1();
    }
    function parseCSSText(cssText) {
        const res = {};
        const listDelimiter = /;(?![^(]*\))/g;
        const propertyDelimiter = /:(.+)/;
        const comment = /\/\*.*?\*\//g;
        cssText.replace(comment, "").split(listDelimiter).forEach(function(item) {
            if (item) {
                const tmp = item.split(propertyDelimiter);
                tmp.length > 1 && (res[camelize(tmp[0].trim())] = tmp[1].trim());
            }
        });
        return res;
    }
    function toCSSText(style) {
        const properties = [];
        for (const name in style) {
            const value = style[name];
            if (typeof value !== "string")
                continue;
            const normalizedName = hyphenate(name);
            properties.push(`${normalizedName}: ${value};`);
        }
        return properties.join(" ");
    }
    const camelizeRE = /-([a-z])/g;
    const CUSTOM_PROPERTY_REGEX = /^--[a-zA-Z0-9-]+$/;
    const camelize = (str) => {
        if (CUSTOM_PROPERTY_REGEX.test(str))
            return str;
        return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
    };
    const hyphenateRE = /\B([A-Z])/g;
    const hyphenate = (str) => {
        return str.replace(hyphenateRE, "-$1").toLowerCase();
    };
    class BaseRRNode {
        constructor(..._args) {
            this.childNodes = [];
            this.parentElement = null;
            this.parentNode = null;
            this.ELEMENT_NODE = NodeType.ELEMENT_NODE;
            this.TEXT_NODE = NodeType.TEXT_NODE;
        }
        get firstChild() {
            return this.childNodes[0] || null;
        }
        get lastChild() {
            return this.childNodes[this.childNodes.length - 1] || null;
        }
        get nextSibling() {
            const parentNode = this.parentNode;
            if (!parentNode)
                return null;
            const siblings = parentNode.childNodes;
            const index = siblings.indexOf(this);
            return siblings[index + 1] || null;
        }
        contains(node) {
            if (node === this)
                return true;
            for (const child of this.childNodes) {
                if (child.contains(node))
                    return true;
            }
            return false;
        }
        appendChild(_newChild) {
            throw new Error(`RRDomException: Failed to execute 'appendChild' on 'RRNode': This RRNode type does not support this method.`);
        }
        insertBefore(_newChild, _refChild) {
            throw new Error(`RRDomException: Failed to execute 'insertBefore' on 'RRNode': This RRNode type does not support this method.`);
        }
        removeChild(_node) {
            throw new Error(`RRDomException: Failed to execute 'removeChild' on 'RRNode': This RRNode type does not support this method.`);
        }
        toString() {
            return "RRNode";
        }
    }
    function BaseRRDocumentImpl(RRNodeClass) {
        return class BaseRRDocument extends RRNodeClass {
            constructor() {
                super(...arguments);
                this.nodeType = NodeType.DOCUMENT_NODE;
                this.nodeName = "#document";
                this.compatMode = "CSS1Compat";
                this.RRNodeType = NodeType$1.Document;
                this.textContent = null;
            }
            get documentElement() {
                return this.childNodes.find((node) => node.RRNodeType === NodeType$1.Element && node.tagName === "HTML") || null;
            }
            get body() {
                var _a;
                return ((_a = this.documentElement) === null || _a === void 0 ? void 0 : _a.childNodes.find((node) => node.RRNodeType === NodeType$1.Element && node.tagName === "BODY")) || null;
            }
            get head() {
                var _a;
                return ((_a = this.documentElement) === null || _a === void 0 ? void 0 : _a.childNodes.find((node) => node.RRNodeType === NodeType$1.Element && node.tagName === "HEAD")) || null;
            }
            get implementation() {
                return this;
            }
            get firstElementChild() {
                return this.documentElement;
            }
            appendChild(childNode) {
                const nodeType = childNode.RRNodeType;
                if (nodeType === NodeType$1.Element || nodeType === NodeType$1.DocumentType) {
                    if (this.childNodes.some((s) => s.RRNodeType === nodeType)) {
                        throw new Error(`RRDomException: Failed to execute 'appendChild' on 'RRNode': Only one ${nodeType === NodeType$1.Element ? "RRElement" : "RRDoctype"} on RRDocument allowed.`);
                    }
                }
                childNode.parentElement = null;
                childNode.parentNode = this;
                this.childNodes.push(childNode);
                return childNode;
            }
            insertBefore(newChild, refChild) {
                const nodeType = newChild.RRNodeType;
                if (nodeType === NodeType$1.Element || nodeType === NodeType$1.DocumentType) {
                    if (this.childNodes.some((s) => s.RRNodeType === nodeType)) {
                        throw new Error(`RRDomException: Failed to execute 'insertBefore' on 'RRNode': Only one ${nodeType === NodeType$1.Element ? "RRElement" : "RRDoctype"} on RRDocument allowed.`);
                    }
                }
                if (refChild === null)
                    return this.appendChild(newChild);
                const childIndex = this.childNodes.indexOf(refChild);
                if (childIndex == -1)
                    throw new Error("Failed to execute 'insertBefore' on 'RRNode': The RRNode before which the new node is to be inserted is not a child of this RRNode.");
                this.childNodes.splice(childIndex, 0, newChild);
                newChild.parentElement = null;
                newChild.parentNode = this;
                return newChild;
            }
            removeChild(node) {
                const indexOfChild = this.childNodes.indexOf(node);
                if (indexOfChild === -1)
                    throw new Error("Failed to execute 'removeChild' on 'RRDocument': The RRNode to be removed is not a child of this RRNode.");
                this.childNodes.splice(indexOfChild, 1);
                node.parentElement = null;
                node.parentNode = null;
                return node;
            }
            open() {
                this.childNodes = [];
            }
            close() {
            }
            write(content) {
                let publicId;
                if (content === '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "">')
                    publicId = "-//W3C//DTD XHTML 1.0 Transitional//EN";
                else if (content === '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "">')
                    publicId = "-//W3C//DTD HTML 4.0 Transitional//EN";
                if (publicId) {
                    const doctype = this.createDocumentType("html", publicId, "");
                    this.open();
                    this.appendChild(doctype);
                }
            }
            createDocument(_namespace, _qualifiedName, _doctype) {
                return new BaseRRDocument();
            }
            createDocumentType(qualifiedName, publicId, systemId) {
                const doctype = new (BaseRRDocumentTypeImpl(BaseRRNode))(qualifiedName, publicId, systemId);
                doctype.ownerDocument = this;
                return doctype;
            }
            createElement(tagName) {
                const element = new (BaseRRElementImpl(BaseRRNode))(tagName);
                element.ownerDocument = this;
                return element;
            }
            createElementNS(_namespaceURI, qualifiedName) {
                return this.createElement(qualifiedName);
            }
            createTextNode(data) {
                const text = new (BaseRRTextImpl(BaseRRNode))(data);
                text.ownerDocument = this;
                return text;
            }
            createComment(data) {
                const comment = new (BaseRRCommentImpl(BaseRRNode))(data);
                comment.ownerDocument = this;
                return comment;
            }
            createCDATASection(data) {
                const CDATASection = new (BaseRRCDATASectionImpl(BaseRRNode))(data);
                CDATASection.ownerDocument = this;
                return CDATASection;
            }
            toString() {
                return "RRDocument";
            }
        };
    }
    function BaseRRDocumentTypeImpl(RRNodeClass) {
        return class BaseRRDocumentType extends RRNodeClass {
            constructor(qualifiedName, publicId, systemId) {
                super();
                this.nodeType = NodeType.DOCUMENT_TYPE_NODE;
                this.RRNodeType = NodeType$1.DocumentType;
                this.textContent = null;
                this.name = qualifiedName;
                this.publicId = publicId;
                this.systemId = systemId;
                this.nodeName = qualifiedName;
            }
            toString() {
                return "RRDocumentType";
            }
        };
    }
    function BaseRRElementImpl(RRNodeClass) {
        return class BaseRRElement extends RRNodeClass {
            constructor(tagName) {
                super();
                this.nodeType = NodeType.ELEMENT_NODE;
                this.RRNodeType = NodeType$1.Element;
                this.attributes = {};
                this.shadowRoot = null;
                this.tagName = tagName.toUpperCase();
                this.nodeName = tagName.toUpperCase();
            }
            get textContent() {
                let result = "";
                this.childNodes.forEach((node) => result += node.textContent);
                return result;
            }
            set textContent(textContent) {
                this.childNodes = [this.ownerDocument.createTextNode(textContent)];
            }
            get classList() {
                return new ClassList(this.attributes.class, (newClassName) => {
                    this.attributes.class = newClassName;
                });
            }
            get id() {
                return this.attributes.id || "";
            }
            get className() {
                return this.attributes.class || "";
            }
            get style() {
                const style = this.attributes.style ? parseCSSText(this.attributes.style) : {};
                const hyphenateRE2 = /\B([A-Z])/g;
                style.setProperty = (name, value, priority) => {
                    if (hyphenateRE2.test(name))
                        return;
                    const normalizedName = camelize(name);
                    if (!value)
                        delete style[normalizedName];
                    else
                        style[normalizedName] = value;
                    if (priority === "important")
                        style[normalizedName] += " !important";
                    this.attributes.style = toCSSText(style);
                };
                style.removeProperty = (name) => {
                    if (hyphenateRE2.test(name))
                        return "";
                    const normalizedName = camelize(name);
                    const value = style[normalizedName] || "";
                    delete style[normalizedName];
                    this.attributes.style = toCSSText(style);
                    return value;
                };
                return style;
            }
            getAttribute(name) {
                return this.attributes[name] || null;
            }
            setAttribute(name, attribute) {
                this.attributes[name] = attribute;
            }
            setAttributeNS(_namespace, qualifiedName, value) {
                this.setAttribute(qualifiedName, value);
            }
            removeAttribute(name) {
                delete this.attributes[name];
            }
            appendChild(newChild) {
                this.childNodes.push(newChild);
                newChild.parentNode = this;
                newChild.parentElement = this;
                return newChild;
            }
            insertBefore(newChild, refChild) {
                if (refChild === null)
                    return this.appendChild(newChild);
                const childIndex = this.childNodes.indexOf(refChild);
                if (childIndex == -1)
                    throw new Error("Failed to execute 'insertBefore' on 'RRNode': The RRNode before which the new node is to be inserted is not a child of this RRNode.");
                this.childNodes.splice(childIndex, 0, newChild);
                newChild.parentElement = this;
                newChild.parentNode = this;
                return newChild;
            }
            removeChild(node) {
                const indexOfChild = this.childNodes.indexOf(node);
                if (indexOfChild === -1)
                    throw new Error("Failed to execute 'removeChild' on 'RRElement': The RRNode to be removed is not a child of this RRNode.");
                this.childNodes.splice(indexOfChild, 1);
                node.parentElement = null;
                node.parentNode = null;
                return node;
            }
            attachShadow(_init) {
                const shadowRoot = this.ownerDocument.createElement("SHADOWROOT");
                this.shadowRoot = shadowRoot;
                return shadowRoot;
            }
            dispatchEvent(_event) {
                return true;
            }
            toString() {
                let attributeString = "";
                for (const attribute in this.attributes) {
                    attributeString += `${attribute}="${this.attributes[attribute]}" `;
                }
                return `${this.tagName} ${attributeString}`;
            }
        };
    }
    function BaseRRMediaElementImpl(RRElementClass) {
        return class BaseRRMediaElement extends RRElementClass {
            attachShadow(_init) {
                throw new Error(`RRDomException: Failed to execute 'attachShadow' on 'RRElement': This RRElement does not support attachShadow`);
            }
            play() {
                this.paused = false;
            }
            pause() {
                this.paused = true;
            }
        };
    }
    function BaseRRTextImpl(RRNodeClass) {
        return class BaseRRText extends RRNodeClass {
            constructor(data) {
                super();
                this.nodeType = NodeType.TEXT_NODE;
                this.nodeName = "#text";
                this.RRNodeType = NodeType$1.Text;
                this.data = data;
            }
            get textContent() {
                return this.data;
            }
            set textContent(textContent) {
                this.data = textContent;
            }
            toString() {
                return `RRText text=${JSON.stringify(this.data)}`;
            }
        };
    }
    function BaseRRCommentImpl(RRNodeClass) {
        return class BaseRRComment extends RRNodeClass {
            constructor(data) {
                super();
                this.nodeType = NodeType.COMMENT_NODE;
                this.nodeName = "#comment";
                this.RRNodeType = NodeType$1.Comment;
                this.data = data;
            }
            get textContent() {
                return this.data;
            }
            set textContent(textContent) {
                this.data = textContent;
            }
            toString() {
                return `RRComment text=${JSON.stringify(this.data)}`;
            }
        };
    }
    function BaseRRCDATASectionImpl(RRNodeClass) {
        return class BaseRRCDATASection extends RRNodeClass {
            constructor(data) {
                super();
                this.nodeName = "#cdata-section";
                this.nodeType = NodeType.CDATA_SECTION_NODE;
                this.RRNodeType = NodeType$1.CDATA;
                this.data = data;
            }
            get textContent() {
                return this.data;
            }
            set textContent(textContent) {
                this.data = textContent;
            }
            toString() {
                return `RRCDATASection data=${JSON.stringify(this.data)}`;
            }
        };
    }
    class ClassList {
        constructor(classText, onChange) {
            this.classes = [];
            this.add = (...classNames) => {
                for (const item of classNames) {
                    const className = String(item);
                    if (this.classes.indexOf(className) >= 0)
                        continue;
                    this.classes.push(className);
                }
                this.onChange && this.onChange(this.classes.join(" "));
            };
            this.remove = (...classNames) => {
                this.classes = this.classes.filter((item) => classNames.indexOf(item) === -1);
                this.onChange && this.onChange(this.classes.join(" "));
            };
            if (classText) {
                const classes = classText.trim().split(/\s+/);
                this.classes.push(...classes);
            }
            this.onChange = onChange;
        }
    }
    var NodeType;
    (function(NodeType2) {
        NodeType2[NodeType2["PLACEHOLDER"] = 0] = "PLACEHOLDER";
        NodeType2[NodeType2["ELEMENT_NODE"] = 1] = "ELEMENT_NODE";
        NodeType2[NodeType2["ATTRIBUTE_NODE"] = 2] = "ATTRIBUTE_NODE";
        NodeType2[NodeType2["TEXT_NODE"] = 3] = "TEXT_NODE";
        NodeType2[NodeType2["CDATA_SECTION_NODE"] = 4] = "CDATA_SECTION_NODE";
        NodeType2[NodeType2["ENTITY_REFERENCE_NODE"] = 5] = "ENTITY_REFERENCE_NODE";
        NodeType2[NodeType2["ENTITY_NODE"] = 6] = "ENTITY_NODE";
        NodeType2[NodeType2["PROCESSING_INSTRUCTION_NODE"] = 7] = "PROCESSING_INSTRUCTION_NODE";
        NodeType2[NodeType2["COMMENT_NODE"] = 8] = "COMMENT_NODE";
        NodeType2[NodeType2["DOCUMENT_NODE"] = 9] = "DOCUMENT_NODE";
        NodeType2[NodeType2["DOCUMENT_TYPE_NODE"] = 10] = "DOCUMENT_TYPE_NODE";
        NodeType2[NodeType2["DOCUMENT_FRAGMENT_NODE"] = 11] = "DOCUMENT_FRAGMENT_NODE";
    })(NodeType || (NodeType = {}));
    const NAMESPACES = {
        svg: "http://www.w3.org/2000/svg",
        "xlink:href": "http://www.w3.org/1999/xlink",
        xmlns: "http://www.w3.org/2000/xmlns/"
    };
    const SVGTagMap = {
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
    function diff(oldTree, newTree, replayer, rrnodeMirror) {
        const oldChildren = oldTree.childNodes;
        const newChildren = newTree.childNodes;
        rrnodeMirror = rrnodeMirror || newTree.mirror || newTree.ownerDocument.mirror;
        if (oldChildren.length > 0 || newChildren.length > 0) {
            diffChildren(Array.from(oldChildren), newChildren, oldTree, replayer, rrnodeMirror);
        }
        let inputDataToApply = null, scrollDataToApply = null;
        switch (newTree.RRNodeType) {
            case NodeType$1.Document: {
                const newRRDocument = newTree;
                scrollDataToApply = newRRDocument.scrollData;
                break;
            }
            case NodeType$1.Element: {
                const oldElement = oldTree;
                const newRRElement = newTree;
                diffProps(oldElement, newRRElement, rrnodeMirror);
                scrollDataToApply = newRRElement.scrollData;
                inputDataToApply = newRRElement.inputData;
                switch (newRRElement.tagName) {
                    case "AUDIO":
                    case "VIDEO": {
                        const oldMediaElement = oldTree;
                        const newMediaRRElement = newRRElement;
                        if (newMediaRRElement.paused !== void 0)
                            newMediaRRElement.paused ? void oldMediaElement.pause() : void oldMediaElement.play();
                        if (newMediaRRElement.muted !== void 0)
                            oldMediaElement.muted = newMediaRRElement.muted;
                        if (newMediaRRElement.volume !== void 0)
                            oldMediaElement.volume = newMediaRRElement.volume;
                        if (newMediaRRElement.currentTime !== void 0)
                            oldMediaElement.currentTime = newMediaRRElement.currentTime;
                        break;
                    }
                    case "CANVAS":
                    {
                        const rrCanvasElement = newTree;
                        if (rrCanvasElement.rr_dataURL !== null) {
                            const image = document.createElement("img");
                            image.onload = () => {
                                const ctx = oldElement.getContext("2d");
                                if (ctx) {
                                    ctx.drawImage(image, 0, 0, image.width, image.height);
                                }
                            };
                            image.src = rrCanvasElement.rr_dataURL;
                        }
                        rrCanvasElement.canvasMutations.forEach((canvasMutation) => replayer.applyCanvas(canvasMutation.event, canvasMutation.mutation, oldTree));
                    }
                        break;
                    case "STYLE":
                        applyVirtualStyleRulesToNode(oldElement, newTree.rules);
                        break;
                }
                if (newRRElement.shadowRoot) {
                    if (!oldElement.shadowRoot)
                        oldElement.attachShadow({ mode: "open" });
                    const oldChildren2 = oldElement.shadowRoot.childNodes;
                    const newChildren2 = newRRElement.shadowRoot.childNodes;
                    if (oldChildren2.length > 0 || newChildren2.length > 0)
                        diffChildren(Array.from(oldChildren2), newChildren2, oldElement.shadowRoot, replayer, rrnodeMirror);
                }
                break;
            }
            case NodeType$1.Text:
            case NodeType$1.Comment:
            case NodeType$1.CDATA:
                if (oldTree.textContent !== newTree.data)
                    oldTree.textContent = newTree.data;
                break;
        }
        scrollDataToApply && replayer.applyScroll(scrollDataToApply, true);
        inputDataToApply && replayer.applyInput(inputDataToApply);
        if (newTree.nodeName === "IFRAME") {
            const oldContentDocument = oldTree.contentDocument;
            const newIFrameElement = newTree;
            if (oldContentDocument) {
                const sn = rrnodeMirror.getMeta(newIFrameElement.contentDocument);
                if (sn) {
                    replayer.mirror.add(oldContentDocument, Object.assign({}, sn));
                }
                diff(oldContentDocument, newIFrameElement.contentDocument, replayer, rrnodeMirror);
            }
        }
    }
    function diffProps(oldTree, newTree, rrnodeMirror) {
        const oldAttributes = oldTree.attributes;
        const newAttributes = newTree.attributes;
        for (const name in newAttributes) {
            const newValue = newAttributes[name];
            const sn = rrnodeMirror.getMeta(newTree);
            if (sn && "isSVG" in sn && sn.isSVG && NAMESPACES[name])
                oldTree.setAttributeNS(NAMESPACES[name], name, newValue);
            else if (newTree.tagName === "CANVAS" && name === "rr_dataURL") {
                const image = document.createElement("img");
                image.src = newValue;
                image.onload = () => {
                    const ctx = oldTree.getContext("2d");
                    if (ctx) {
                        ctx.drawImage(image, 0, 0, image.width, image.height);
                    }
                };
            } else
                oldTree.setAttribute(name, newValue);
        }
        for (const { name } of Array.from(oldAttributes))
            if (!(name in newAttributes))
                oldTree.removeAttribute(name);
        newTree.scrollLeft && (oldTree.scrollLeft = newTree.scrollLeft);
        newTree.scrollTop && (oldTree.scrollTop = newTree.scrollTop);
    }
    function diffChildren(oldChildren, newChildren, parentNode, replayer, rrnodeMirror) {
        var _a;
        let oldStartIndex = 0, oldEndIndex = oldChildren.length - 1, newStartIndex = 0, newEndIndex = newChildren.length - 1;
        let oldStartNode = oldChildren[oldStartIndex], oldEndNode = oldChildren[oldEndIndex], newStartNode = newChildren[newStartIndex], newEndNode = newChildren[newEndIndex];
        let oldIdToIndex = void 0, indexInOld;
        while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
            if (oldStartNode === void 0) {
                oldStartNode = oldChildren[++oldStartIndex];
            } else if (oldEndNode === void 0) {
                oldEndNode = oldChildren[--oldEndIndex];
            } else if (replayer.mirror.getId(oldStartNode) === rrnodeMirror.getId(newStartNode)) {
                diff(oldStartNode, newStartNode, replayer, rrnodeMirror);
                oldStartNode = oldChildren[++oldStartIndex];
                newStartNode = newChildren[++newStartIndex];
            } else if (replayer.mirror.getId(oldEndNode) === rrnodeMirror.getId(newEndNode)) {
                diff(oldEndNode, newEndNode, replayer, rrnodeMirror);
                oldEndNode = oldChildren[--oldEndIndex];
                newEndNode = newChildren[--newEndIndex];
            } else if (replayer.mirror.getId(oldStartNode) === rrnodeMirror.getId(newEndNode)) {
                parentNode.insertBefore(oldStartNode, oldEndNode.nextSibling);
                diff(oldStartNode, newEndNode, replayer, rrnodeMirror);
                oldStartNode = oldChildren[++oldStartIndex];
                newEndNode = newChildren[--newEndIndex];
            } else if (replayer.mirror.getId(oldEndNode) === rrnodeMirror.getId(newStartNode)) {
                parentNode.insertBefore(oldEndNode, oldStartNode);
                diff(oldEndNode, newStartNode, replayer, rrnodeMirror);
                oldEndNode = oldChildren[--oldEndIndex];
                newStartNode = newChildren[++newStartIndex];
            } else {
                if (!oldIdToIndex) {
                    oldIdToIndex = {};
                    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
                        const oldChild = oldChildren[i];
                        if (oldChild && replayer.mirror.hasNode(oldChild))
                            oldIdToIndex[replayer.mirror.getId(oldChild)] = i;
                    }
                }
                indexInOld = oldIdToIndex[rrnodeMirror.getId(newStartNode)];
                if (indexInOld) {
                    const nodeToMove = oldChildren[indexInOld];
                    parentNode.insertBefore(nodeToMove, oldStartNode);
                    diff(nodeToMove, newStartNode, replayer, rrnodeMirror);
                    oldChildren[indexInOld] = void 0;
                } else {
                    const newNode = createOrGetNode(newStartNode, replayer.mirror, rrnodeMirror);
                    if (parentNode.nodeName === "#document" && ((_a = replayer.mirror.getMeta(newNode)) === null || _a === void 0 ? void 0 : _a.type) === NodeType$1.Element && parentNode.documentElement) {
                        parentNode.removeChild(parentNode.documentElement);
                        oldChildren[oldStartIndex] = void 0;
                        oldStartNode = void 0;
                    }
                    parentNode.insertBefore(newNode, oldStartNode || null);
                    diff(newNode, newStartNode, replayer, rrnodeMirror);
                }
                newStartNode = newChildren[++newStartIndex];
            }
        }
        if (oldStartIndex > oldEndIndex) {
            const referenceRRNode = newChildren[newEndIndex + 1];
            let referenceNode = null;
            if (referenceRRNode)
                parentNode.childNodes.forEach((child) => {
                    if (replayer.mirror.getId(child) === rrnodeMirror.getId(referenceRRNode))
                        referenceNode = child;
                });
            for (; newStartIndex <= newEndIndex; ++newStartIndex) {
                const newNode = createOrGetNode(newChildren[newStartIndex], replayer.mirror, rrnodeMirror);
                parentNode.insertBefore(newNode, referenceNode);
                diff(newNode, newChildren[newStartIndex], replayer, rrnodeMirror);
            }
        } else if (newStartIndex > newEndIndex) {
            for (; oldStartIndex <= oldEndIndex; oldStartIndex++) {
                const node = oldChildren[oldStartIndex];
                if (node) {
                    parentNode.removeChild(node);
                    replayer.mirror.removeNodeFromMap(node);
                }
            }
        }
    }
    function createOrGetNode(rrNode, domMirror, rrnodeMirror) {
        let node = domMirror.getNode(rrnodeMirror.getId(rrNode));
        const sn = rrnodeMirror.getMeta(rrNode);
        if (node !== null)
            return node;
        switch (rrNode.RRNodeType) {
            case NodeType$1.Document:
                node = new Document();
                break;
            case NodeType$1.DocumentType:
                node = document.implementation.createDocumentType(rrNode.name, rrNode.publicId, rrNode.systemId);
                break;
            case NodeType$1.Element: {
                let tagName = rrNode.tagName.toLowerCase();
                tagName = SVGTagMap[tagName] || tagName;
                if (sn && "isSVG" in sn && (sn === null || sn === void 0 ? void 0 : sn.isSVG)) {
                    node = document.createElementNS(NAMESPACES["svg"], tagName);
                } else
                    node = document.createElement(rrNode.tagName);
                break;
            }
            case NodeType$1.Text:
                node = document.createTextNode(rrNode.data);
                break;
            case NodeType$1.Comment:
                node = document.createComment(rrNode.data);
                break;
            case NodeType$1.CDATA:
                node = document.createCDATASection(rrNode.data);
                break;
        }
        if (sn)
            domMirror.add(node, Object.assign({}, sn));
        return node;
    }
    function getNestedRule(rules, position) {
        const rule = rules[position[0]];
        if (position.length === 1) {
            return rule;
        } else {
            return getNestedRule(rule.cssRules[position[1]].cssRules, position.slice(2));
        }
    }
    var StyleRuleType;
    (function(StyleRuleType2) {
        StyleRuleType2[StyleRuleType2["Insert"] = 0] = "Insert";
        StyleRuleType2[StyleRuleType2["Remove"] = 1] = "Remove";
        StyleRuleType2[StyleRuleType2["Snapshot"] = 2] = "Snapshot";
        StyleRuleType2[StyleRuleType2["SetProperty"] = 3] = "SetProperty";
        StyleRuleType2[StyleRuleType2["RemoveProperty"] = 4] = "RemoveProperty";
    })(StyleRuleType || (StyleRuleType = {}));
    function getPositionsAndIndex(nestedIndex) {
        const positions = [...nestedIndex];
        const index = positions.pop();
        return { positions, index };
    }
    function applyVirtualStyleRulesToNode(styleNode, virtualStyleRules) {
        const sheet = styleNode.sheet;
        virtualStyleRules.forEach((rule) => {
            if (rule.type === StyleRuleType.Insert) {
                try {
                    if (Array.isArray(rule.index)) {
                        const { positions, index } = getPositionsAndIndex(rule.index);
                        const nestedRule = getNestedRule(sheet.cssRules, positions);
                        nestedRule.insertRule(rule.cssText, index);
                    } else {
                        sheet.insertRule(rule.cssText, rule.index);
                    }
                } catch (e) {
                }
            } else if (rule.type === StyleRuleType.Remove) {
                try {
                    if (Array.isArray(rule.index)) {
                        const { positions, index } = getPositionsAndIndex(rule.index);
                        const nestedRule = getNestedRule(sheet.cssRules, positions);
                        nestedRule.deleteRule(index || 0);
                    } else {
                        sheet.deleteRule(rule.index);
                    }
                } catch (e) {
                }
            } else if (rule.type === StyleRuleType.SetProperty) {
                const nativeRule = getNestedRule(sheet.cssRules, rule.index);
                nativeRule.style.setProperty(rule.property, rule.value, rule.priority);
            } else if (rule.type === StyleRuleType.RemoveProperty) {
                const nativeRule = getNestedRule(sheet.cssRules, rule.index);
                nativeRule.style.removeProperty(rule.property);
            }
        });
    }
    class RRDocument extends BaseRRDocumentImpl(BaseRRNode) {
        constructor(mirror) {
            super();
            this._unserializedId = -1;
            this.mirror = createMirror();
            this.scrollData = null;
            if (mirror) {
                this.mirror = mirror;
            }
        }
        get unserializedId() {
            return this._unserializedId--;
        }
        createDocument(_namespace, _qualifiedName, _doctype) {
            return new RRDocument();
        }
        createDocumentType(qualifiedName, publicId, systemId) {
            const documentTypeNode = new RRDocumentType(qualifiedName, publicId, systemId);
            documentTypeNode.ownerDocument = this;
            return documentTypeNode;
        }
        createElement(tagName) {
            const upperTagName = tagName.toUpperCase();
            let element;
            switch (upperTagName) {
                case "AUDIO":
                case "VIDEO":
                    element = new RRMediaElement(upperTagName);
                    break;
                case "IFRAME":
                    element = new RRIFrameElement(upperTagName, this.mirror);
                    break;
                case "CANVAS":
                    element = new RRCanvasElement(upperTagName);
                    break;
                case "STYLE":
                    element = new RRStyleElement(upperTagName);
                    break;
                default:
                    element = new RRElement(upperTagName);
                    break;
            }
            element.ownerDocument = this;
            return element;
        }
        createComment(data) {
            const commentNode = new RRComment(data);
            commentNode.ownerDocument = this;
            return commentNode;
        }
        createCDATASection(data) {
            const sectionNode = new RRCDATASection(data);
            sectionNode.ownerDocument = this;
            return sectionNode;
        }
        createTextNode(data) {
            const textNode = new RRText(data);
            textNode.ownerDocument = this;
            return textNode;
        }
        destroyTree() {
            this.childNodes = [];
            this.mirror.reset();
        }
        open() {
            super.open();
            this._unserializedId = -1;
        }
    }
    const RRDocumentType = BaseRRDocumentTypeImpl(BaseRRNode);
    class RRElement extends BaseRRElementImpl(BaseRRNode) {
        constructor() {
            super(...arguments);
            this.inputData = null;
            this.scrollData = null;
        }
    }
    class RRMediaElement extends BaseRRMediaElementImpl(RRElement) {
    }
    class RRCanvasElement extends RRElement {
        constructor() {
            super(...arguments);
            this.rr_dataURL = null;
            this.canvasMutations = [];
        }
        getContext() {
            return null;
        }
    }
    class RRStyleElement extends RRElement {
        constructor() {
            super(...arguments);
            this.rules = [];
        }
    }
    class RRIFrameElement extends RRElement {
        constructor(upperTagName, mirror) {
            super(upperTagName);
            this.contentDocument = new RRDocument();
            this.contentDocument.mirror = mirror;
        }
    }
    const RRText = BaseRRTextImpl(BaseRRNode);
    const RRComment = BaseRRCommentImpl(BaseRRNode);
    const RRCDATASection = BaseRRCDATASectionImpl(BaseRRNode);
    function getValidTagName(element) {
        if (element instanceof HTMLFormElement) {
            return "FORM";
        }
        return element.tagName.toUpperCase();
    }
    function buildFromNode(node, rrdom, domMirror, parentRRNode) {
        let rrNode;
        switch (node.nodeType) {
            case NodeType.DOCUMENT_NODE:
                if (parentRRNode && parentRRNode.nodeName === "IFRAME")
                    rrNode = parentRRNode.contentDocument;
                else {
                    rrNode = rrdom;
                    rrNode.compatMode = node.compatMode;
                }
                break;
            case NodeType.DOCUMENT_TYPE_NODE: {
                const documentType = node;
                rrNode = rrdom.createDocumentType(documentType.name, documentType.publicId, documentType.systemId);
                break;
            }
            case NodeType.ELEMENT_NODE: {
                const elementNode = node;
                const tagName = getValidTagName(elementNode);
                rrNode = rrdom.createElement(tagName);
                const rrElement = rrNode;
                for (const { name, value } of Array.from(elementNode.attributes)) {
                    rrElement.attributes[name] = value;
                }
                elementNode.scrollLeft && (rrElement.scrollLeft = elementNode.scrollLeft);
                elementNode.scrollTop && (rrElement.scrollTop = elementNode.scrollTop);
                break;
            }
            case NodeType.TEXT_NODE:
                rrNode = rrdom.createTextNode(node.textContent || "");
                break;
            case NodeType.CDATA_SECTION_NODE:
                rrNode = rrdom.createCDATASection(node.data);
                break;
            case NodeType.COMMENT_NODE:
                rrNode = rrdom.createComment(node.textContent || "");
                break;
            case NodeType.DOCUMENT_FRAGMENT_NODE:
                rrNode = parentRRNode.attachShadow({ mode: "open" });
                break;
            default:
                return null;
        }
        let sn = domMirror.getMeta(node);
        if (rrdom instanceof RRDocument) {
            if (!sn) {
                sn = getDefaultSN(rrNode, rrdom.unserializedId);
                domMirror.add(node, sn);
            }
            rrdom.mirror.add(rrNode, Object.assign({}, sn));
        }
        return rrNode;
    }
    function buildFromDom(dom, domMirror = createMirror$1(), rrdom = new RRDocument()) {
        function walk2(node, parentRRNode) {
            const rrNode = buildFromNode(node, rrdom, domMirror, parentRRNode);
            if (rrNode === null)
                return;
            if ((parentRRNode === null || parentRRNode === void 0 ? void 0 : parentRRNode.nodeName) !== "IFRAME" && node.nodeType !== NodeType.DOCUMENT_FRAGMENT_NODE) {
                parentRRNode === null || parentRRNode === void 0 ? void 0 : parentRRNode.appendChild(rrNode);
                rrNode.parentNode = parentRRNode;
                rrNode.parentElement = parentRRNode;
            }
            if (node.nodeName === "IFRAME") {
                walk2(node.contentDocument, rrNode);
            } else if (node.nodeType === NodeType.DOCUMENT_NODE || node.nodeType === NodeType.ELEMENT_NODE || node.nodeType === NodeType.DOCUMENT_FRAGMENT_NODE) {
                if (node.nodeType === NodeType.ELEMENT_NODE && node.shadowRoot)
                    walk2(node.shadowRoot, rrNode);
                node.childNodes.forEach((childNode) => walk2(childNode, rrNode));
            }
        }
        walk2(dom, null);
        return rrdom;
    }
    function createMirror() {
        return new Mirror();
    }
    class Mirror {
        constructor() {
            this.idNodeMap = /* @__PURE__ */ new Map();
            this.nodeMetaMap = /* @__PURE__ */ new WeakMap();
        }
        getId(n) {
            var _a;
            if (!n)
                return -1;
            const id = (_a = this.getMeta(n)) === null || _a === void 0 ? void 0 : _a.id;
            return id !== null && id !== void 0 ? id : -1;
        }
        getNode(id) {
            return this.idNodeMap.get(id) || null;
        }
        getIds() {
            return Array.from(this.idNodeMap.keys());
        }
        getMeta(n) {
            return this.nodeMetaMap.get(n) || null;
        }
        removeNodeFromMap(n) {
            const id = this.getId(n);
            this.idNodeMap.delete(id);
            if (n.childNodes) {
                n.childNodes.forEach((childNode) => this.removeNodeFromMap(childNode));
            }
        }
        has(id) {
            return this.idNodeMap.has(id);
        }
        hasNode(node) {
            return this.nodeMetaMap.has(node);
        }
        add(n, meta) {
            const id = meta.id;
            this.idNodeMap.set(id, n);
            this.nodeMetaMap.set(n, meta);
        }
        replace(id, n) {
            this.idNodeMap.set(id, n);
        }
        reset() {
            this.idNodeMap = /* @__PURE__ */ new Map();
            this.nodeMetaMap = /* @__PURE__ */ new WeakMap();
        }
    }
    function getDefaultSN(node, id) {
        switch (node.RRNodeType) {
            case NodeType$1.Document:
                return {
                    id,
                    type: node.RRNodeType,
                    childNodes: []
                };
            case NodeType$1.DocumentType: {
                const doctype = node;
                return {
                    id,
                    type: node.RRNodeType,
                    name: doctype.name,
                    publicId: doctype.publicId,
                    systemId: doctype.systemId
                };
            }
            case NodeType$1.Element:
                return {
                    id,
                    type: node.RRNodeType,
                    tagName: node.tagName.toLowerCase(),
                    attributes: {},
                    childNodes: []
                };
            case NodeType$1.Text:
                return {
                    id,
                    type: node.RRNodeType,
                    textContent: node.textContent || ""
                };
            case NodeType$1.Comment:
                return {
                    id,
                    type: node.RRNodeType,
                    textContent: node.textContent || ""
                };
            case NodeType$1.CDATA:
                return {
                    id,
                    type: node.RRNodeType,
                    textContent: ""
                };
        }
    }

    function mitt$1(n){return {all:n=n||new Map,on:function(t,e){var i=n.get(t);i?i.push(e):n.set(t,[e]);},off:function(t,e){var i=n.get(t);i&&(e?i.splice(i.indexOf(e)>>>0,1):n.set(t,[]));},emit:function(t,e){var i=n.get(t);i&&i.slice().map(function(n){n(e);}),(i=n.get("*"))&&i.slice().map(function(n){n(t,e);});}}}

    var mittProxy = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': mitt$1
    });

    function polyfill(w = window, d = document) {
        if ("scrollBehavior" in d.documentElement.style && w.__forceSmoothScrollPolyfill__ !== true) {
            return;
        }
        const Element = w.HTMLElement || w.Element;
        const SCROLL_TIME = 468;
        const original = {
            scroll: w.scroll || w.scrollTo,
            scrollBy: w.scrollBy,
            elementScroll: Element.prototype.scroll || scrollElement,
            scrollIntoView: Element.prototype.scrollIntoView
        };
        const now = w.performance && w.performance.now ? w.performance.now.bind(w.performance) : Date.now;
        function isMicrosoftBrowser(userAgent) {
            const userAgentPatterns = ["MSIE ", "Trident/", "Edge/"];
            return new RegExp(userAgentPatterns.join("|")).test(userAgent);
        }
        const ROUNDING_TOLERANCE = isMicrosoftBrowser(w.navigator.userAgent) ? 1 : 0;
        function scrollElement(x, y) {
            this.scrollLeft = x;
            this.scrollTop = y;
        }
        function ease(k) {
            return 0.5 * (1 - Math.cos(Math.PI * k));
        }
        function shouldBailOut(firstArg) {
            if (firstArg === null || typeof firstArg !== "object" || firstArg.behavior === void 0 || firstArg.behavior === "auto" || firstArg.behavior === "instant") {
                return true;
            }
            if (typeof firstArg === "object" && firstArg.behavior === "smooth") {
                return false;
            }
            throw new TypeError("behavior member of ScrollOptions " + firstArg.behavior + " is not a valid value for enumeration ScrollBehavior.");
        }
        function hasScrollableSpace(el, axis) {
            if (axis === "Y") {
                return el.clientHeight + ROUNDING_TOLERANCE < el.scrollHeight;
            }
            if (axis === "X") {
                return el.clientWidth + ROUNDING_TOLERANCE < el.scrollWidth;
            }
        }
        function canOverflow(el, axis) {
            const overflowValue = w.getComputedStyle(el, null)["overflow" + axis];
            return overflowValue === "auto" || overflowValue === "scroll";
        }
        function isScrollable(el) {
            const isScrollableY = hasScrollableSpace(el, "Y") && canOverflow(el, "Y");
            const isScrollableX = hasScrollableSpace(el, "X") && canOverflow(el, "X");
            return isScrollableY || isScrollableX;
        }
        function findScrollableParent(el) {
            while (el !== d.body && isScrollable(el) === false) {
                el = el.parentNode || el.host;
            }
            return el;
        }
        function step(context) {
            const time = now();
            let value;
            let currentX;
            let currentY;
            let elapsed = (time - context.startTime) / SCROLL_TIME;
            elapsed = elapsed > 1 ? 1 : elapsed;
            value = ease(elapsed);
            currentX = context.startX + (context.x - context.startX) * value;
            currentY = context.startY + (context.y - context.startY) * value;
            context.method.call(context.scrollable, currentX, currentY);
            if (currentX !== context.x || currentY !== context.y) {
                w.requestAnimationFrame(step.bind(w, context));
            }
        }
        function smoothScroll(el, x, y) {
            let scrollable;
            let startX;
            let startY;
            let method;
            const startTime = now();
            if (el === d.body) {
                scrollable = w;
                startX = w.scrollX || w.pageXOffset;
                startY = w.scrollY || w.pageYOffset;
                method = original.scroll;
            } else {
                scrollable = el;
                startX = el.scrollLeft;
                startY = el.scrollTop;
                method = scrollElement;
            }
            step({
                scrollable,
                method,
                startTime,
                startX,
                startY,
                x,
                y
            });
        }
        w.scroll = w.scrollTo = function() {
            if (arguments[0] === void 0) {
                return;
            }
            if (shouldBailOut(arguments[0]) === true) {
                original.scroll.call(w, arguments[0].left !== void 0 ? arguments[0].left : typeof arguments[0] !== "object" ? arguments[0] : w.scrollX || w.pageXOffset, arguments[0].top !== void 0 ? arguments[0].top : arguments[1] !== void 0 ? arguments[1] : w.scrollY || w.pageYOffset);
                return;
            }
            smoothScroll.call(w, d.body, arguments[0].left !== void 0 ? ~~arguments[0].left : w.scrollX || w.pageXOffset, arguments[0].top !== void 0 ? ~~arguments[0].top : w.scrollY || w.pageYOffset);
        };
        w.scrollBy = function() {
            if (arguments[0] === void 0) {
                return;
            }
            if (shouldBailOut(arguments[0])) {
                original.scrollBy.call(w, arguments[0].left !== void 0 ? arguments[0].left : typeof arguments[0] !== "object" ? arguments[0] : 0, arguments[0].top !== void 0 ? arguments[0].top : arguments[1] !== void 0 ? arguments[1] : 0);
                return;
            }
            smoothScroll.call(w, d.body, ~~arguments[0].left + (w.scrollX || w.pageXOffset), ~~arguments[0].top + (w.scrollY || w.pageYOffset));
        };
        Element.prototype.scroll = Element.prototype.scrollTo = function() {
            if (arguments[0] === void 0) {
                return;
            }
            if (shouldBailOut(arguments[0]) === true) {
                if (typeof arguments[0] === "number" && arguments[1] === void 0) {
                    throw new SyntaxError("Value could not be converted");
                }
                original.elementScroll.call(this, arguments[0].left !== void 0 ? ~~arguments[0].left : typeof arguments[0] !== "object" ? ~~arguments[0] : this.scrollLeft, arguments[0].top !== void 0 ? ~~arguments[0].top : arguments[1] !== void 0 ? ~~arguments[1] : this.scrollTop);
                return;
            }
            const left = arguments[0].left;
            const top = arguments[0].top;
            smoothScroll.call(this, this, typeof left === "undefined" ? this.scrollLeft : ~~left, typeof top === "undefined" ? this.scrollTop : ~~top);
        };
        Element.prototype.scrollBy = function() {
            if (arguments[0] === void 0) {
                return;
            }
            if (shouldBailOut(arguments[0]) === true) {
                original.elementScroll.call(this, arguments[0].left !== void 0 ? ~~arguments[0].left + this.scrollLeft : ~~arguments[0] + this.scrollLeft, arguments[0].top !== void 0 ? ~~arguments[0].top + this.scrollTop : ~~arguments[1] + this.scrollTop);
                return;
            }
            this.scroll({
                left: ~~arguments[0].left + this.scrollLeft,
                top: ~~arguments[0].top + this.scrollTop,
                behavior: arguments[0].behavior
            });
        };
        Element.prototype.scrollIntoView = function() {
            if (shouldBailOut(arguments[0]) === true) {
                original.scrollIntoView.call(this, arguments[0] === void 0 ? true : arguments[0]);
                return;
            }
            const scrollableParent = findScrollableParent(this);
            const parentRects = scrollableParent.getBoundingClientRect();
            const clientRects = this.getBoundingClientRect();
            if (scrollableParent !== d.body) {
                smoothScroll.call(this, scrollableParent, scrollableParent.scrollLeft + clientRects.left - parentRects.left, scrollableParent.scrollTop + clientRects.top - parentRects.top);
                if (w.getComputedStyle(scrollableParent).position !== "fixed") {
                    w.scrollBy({
                        left: parentRects.left,
                        top: parentRects.top,
                        behavior: "smooth"
                    });
                }
            } else {
                w.scrollBy({
                    left: clientRects.left,
                    top: clientRects.top,
                    behavior: "smooth"
                });
            }
        };
    }

    class Timer {
        constructor(actions = [], speed) {
            this.timeOffset = 0;
            this.raf = null;
            this.actions = actions;
            this.speed = speed;
        }
        addAction(action) {
            const index = this.findActionIndex(action);
            this.actions.splice(index, 0, action);
        }
        addActions(actions) {
            this.actions = this.actions.concat(actions);
        }
        start() {
            this.timeOffset = 0;
            let lastTimestamp = performance.now();
            const { actions } = this;
            const check = () => {
                const time = performance.now();
                this.timeOffset += (time - lastTimestamp) * this.speed;
                lastTimestamp = time;
                while (actions.length) {
                    const action = actions[0];
                    if (this.timeOffset >= action.delay) {
                        actions.shift();
                        action.doAction();
                    } else {
                        break;
                    }
                }
                if (actions.length > 0 || this.liveMode) {
                    this.raf = requestAnimationFrame(check);
                }
            };
            this.raf = requestAnimationFrame(check);
        }
        clear() {
            if (this.raf) {
                cancelAnimationFrame(this.raf);
                this.raf = null;
            }
            this.actions.length = 0;
        }
        setSpeed(speed) {
            this.speed = speed;
        }
        toggleLiveMode(mode) {
            this.liveMode = mode;
        }
        isActive() {
            return this.raf !== null;
        }
        findActionIndex(action) {
            let start = 0;
            let end = this.actions.length - 1;
            while (start <= end) {
                const mid = Math.floor((start + end) / 2);
                if (this.actions[mid].delay < action.delay) {
                    start = mid + 1;
                } else if (this.actions[mid].delay > action.delay) {
                    end = mid - 1;
                } else {
                    return mid + 1;
                }
            }
            return start;
        }
    }
    function addDelay(event, baselineTime) {
        if (event.type === EventType.IncrementalSnapshot && event.data.source === IncrementalSource.MouseMove) {
            const firstOffset = event.data.positions[0].timeOffset;
            const firstTimestamp = event.timestamp + firstOffset;
            event.delay = firstTimestamp - baselineTime;
            return firstTimestamp - baselineTime;
        }
        event.delay = event.timestamp - baselineTime;
        return event.delay;
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
    function t(t,n){var e="function"==typeof Symbol&&t[Symbol.iterator];if(!e)return t;var r,o,i=e.call(t),a=[];try{for(;(void 0===n||n-- >0)&&!(r=i.next()).done;)a.push(r.value);}catch(t){o={error:t};}finally{try{r&&!r.done&&(e=i.return)&&e.call(i);}finally{if(o)throw o.error}}return a}var n;!function(t){t[t.NotStarted=0]="NotStarted",t[t.Running=1]="Running",t[t.Stopped=2]="Stopped";}(n||(n={}));var e={type:"xstate.init"};function r(t){return void 0===t?[]:[].concat(t)}function o(t){return {type:"xstate.assign",assignment:t}}function i$1(t,n){return "string"==typeof(t="string"==typeof t&&n&&n[t]?n[t]:t)?{type:t}:"function"==typeof t?{type:t.name,exec:t}:t}function a(t){return function(n){return t===n}}function u(t){return "string"==typeof t?{type:t}:t}function c(t,n){return {value:t,context:n,actions:[],changed:!1,matches:a(t)}}function f(t,n,e){var r=n,o=!1;return [t.filter((function(t){if("xstate.assign"===t.type){o=!0;var n=Object.assign({},r);return "function"==typeof t.assignment?n=t.assignment(r,e):Object.keys(t.assignment).forEach((function(o){n[o]="function"==typeof t.assignment[o]?t.assignment[o](r,e):t.assignment[o];})),r=n,!1}return !0})),r,o]}function s(n,o){void 0===o&&(o={});var s=t(f(r(n.states[n.initial].entry).map((function(t){return i$1(t,o.actions)})),n.context,e),2),l=s[0],v=s[1],y={config:n,_options:o,initialState:{value:n.initial,actions:l,context:v,matches:a(n.initial)},transition:function(e,o){var s,l,v="string"==typeof e?{value:e,context:n.context}:e,p=v.value,g=v.context,d=u(o),x=n.states[p];if(x.on){var m=r(x.on[d.type]);try{for(var h=function(t){var n="function"==typeof Symbol&&Symbol.iterator,e=n&&t[n],r=0;if(e)return e.call(t);if(t&&"number"==typeof t.length)return {next:function(){return t&&r>=t.length&&(t=void 0),{value:t&&t[r++],done:!t}}};throw new TypeError(n?"Object is not iterable.":"Symbol.iterator is not defined.")}(m),b=h.next();!b.done;b=h.next()){var S=b.value;if(void 0===S)return c(p,g);var w="string"==typeof S?{target:S}:S,j=w.target,E=w.actions,R=void 0===E?[]:E,N=w.cond,O=void 0===N?function(){return !0}:N,_=void 0===j,k=null!=j?j:p,T=n.states[k];if(O(g,d)){var q=t(f((_?r(R):[].concat(x.exit,R,T.entry).filter((function(t){return t}))).map((function(t){return i$1(t,y._options.actions)})),g,d),3),z=q[0],A=q[1],B=q[2],C=null!=j?j:p;return {value:C,context:A,actions:z,changed:j!==p||z.length>0||B,matches:a(C)}}}}catch(t){s={error:t};}finally{try{b&&!b.done&&(l=h.return)&&l.call(h);}finally{if(s)throw s.error}}}return c(p,g)}};return y}var l=function(t,n){return t.actions.forEach((function(e){var r=e.exec;return r&&r(t.context,n)}))};function v(t){var r=t.initialState,o=n.NotStarted,i=new Set,c={_machine:t,send:function(e){o===n.Running&&(r=t.transition(r,e),l(r,u(e)),i.forEach((function(t){return t(r)})));},subscribe:function(t){return i.add(t),t(r),{unsubscribe:function(){return i.delete(t)}}},start:function(i){if(i){var u="object"==typeof i?i:{context:t.config.context,value:i};r={value:u.value,actions:[],context:u.context,matches:a(u.value)};}return o=n.Running,l(r,e),c},stop:function(){return o=n.Stopped,i.clear(),c},get state(){return r},get status(){return o}};return c}

    var __defProp$2 = Object.defineProperty;
    var __defProps$2 = Object.defineProperties;
    var __getOwnPropDescs$2 = Object.getOwnPropertyDescriptors;
    var __getOwnPropSymbols$2 = Object.getOwnPropertySymbols;
    var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
    var __propIsEnum$2 = Object.prototype.propertyIsEnumerable;
    var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
    var __spreadValues$2 = (a, b) => {
        for (var prop in b || (b = {}))
            if (__hasOwnProp$2.call(b, prop))
                __defNormalProp$2(a, prop, b[prop]);
        if (__getOwnPropSymbols$2)
            for (var prop of __getOwnPropSymbols$2(b)) {
                if (__propIsEnum$2.call(b, prop))
                    __defNormalProp$2(a, prop, b[prop]);
            }
        return a;
    };
    var __spreadProps$2 = (a, b) => __defProps$2(a, __getOwnPropDescs$2(b));
    function discardPriorSnapshots(events, baselineTime) {
        for (let idx = events.length - 1; idx >= 0; idx--) {
            const event = events[idx];
            if (event.type === EventType.Meta) {
                if (event.timestamp <= baselineTime) {
                    return events.slice(idx);
                }
            }
        }
        return events;
    }
    function createPlayerService(context, { getCastFn, applyEventsSynchronously, emitter }) {
        const playerMachine = s({
            id: "player",
            context,
            initial: "paused",
            states: {
                playing: {
                    on: {
                        PAUSE: {
                            target: "paused",
                            actions: ["pause"]
                        },
                        CAST_EVENT: {
                            target: "playing",
                            actions: "castEvent"
                        },
                        END: {
                            target: "paused",
                            actions: ["resetLastPlayedEvent", "pause"]
                        },
                        ADD_EVENT: {
                            target: "playing",
                            actions: ["addEvent"]
                        }
                    }
                },
                paused: {
                    on: {
                        PLAY: {
                            target: "playing",
                            actions: ["recordTimeOffset", "play"]
                        },
                        CAST_EVENT: {
                            target: "paused",
                            actions: "castEvent"
                        },
                        TO_LIVE: {
                            target: "live",
                            actions: ["startLive"]
                        },
                        ADD_EVENT: {
                            target: "paused",
                            actions: ["addEvent"]
                        }
                    }
                },
                live: {
                    on: {
                        ADD_EVENT: {
                            target: "live",
                            actions: ["addEvent"]
                        },
                        CAST_EVENT: {
                            target: "live",
                            actions: ["castEvent"]
                        }
                    }
                }
            }
        }, {
            actions: {
                castEvent: o({
                    lastPlayedEvent: (ctx, event) => {
                        if (event.type === "CAST_EVENT") {
                            return event.payload.event;
                        }
                        return ctx.lastPlayedEvent;
                    }
                }),
                recordTimeOffset: o((ctx, event) => {
                    let timeOffset = ctx.timeOffset;
                    if ("payload" in event && "timeOffset" in event.payload) {
                        timeOffset = event.payload.timeOffset;
                    }
                    return __spreadProps$2(__spreadValues$2({}, ctx), {
                        timeOffset,
                        baselineTime: ctx.events[0].timestamp + timeOffset
                    });
                }),
                play(ctx) {
                    var _a;
                    const { timer, events, baselineTime, lastPlayedEvent } = ctx;
                    timer.clear();
                    for (const event of events) {
                        addDelay(event, baselineTime);
                    }
                    const neededEvents = discardPriorSnapshots(events, baselineTime);
                    let lastPlayedTimestamp = lastPlayedEvent == null ? void 0 : lastPlayedEvent.timestamp;
                    if ((lastPlayedEvent == null ? void 0 : lastPlayedEvent.type) === EventType.IncrementalSnapshot && lastPlayedEvent.data.source === IncrementalSource.MouseMove) {
                        lastPlayedTimestamp = lastPlayedEvent.timestamp + ((_a = lastPlayedEvent.data.positions[0]) == null ? void 0 : _a.timeOffset);
                    }
                    if (baselineTime < (lastPlayedTimestamp || 0)) {
                        emitter.emit(ReplayerEvents.PlayBack);
                    }
                    const syncEvents = new Array();
                    const actions = new Array();
                    for (const event of neededEvents) {
                        if (lastPlayedTimestamp && lastPlayedTimestamp < baselineTime && (event.timestamp <= lastPlayedTimestamp || event === lastPlayedEvent)) {
                            continue;
                        }
                        if (event.timestamp < baselineTime) {
                            syncEvents.push(event);
                        } else {
                            const castFn = getCastFn(event, false);
                            actions.push({
                                doAction: () => {
                                    castFn();
                                },
                                delay: event.delay
                            });
                        }
                    }
                    applyEventsSynchronously(syncEvents);
                    emitter.emit(ReplayerEvents.Flush);
                    timer.addActions(actions);
                    timer.start();
                },
                pause(ctx) {
                    ctx.timer.clear();
                },
                resetLastPlayedEvent: o((ctx) => {
                    return __spreadProps$2(__spreadValues$2({}, ctx), {
                        lastPlayedEvent: null
                    });
                }),
                startLive: o({
                    baselineTime: (ctx, event) => {
                        ctx.timer.toggleLiveMode(true);
                        ctx.timer.start();
                        if (event.type === "TO_LIVE" && event.payload.baselineTime) {
                            return event.payload.baselineTime;
                        }
                        return Date.now();
                    }
                }),
                addEvent: o((ctx, machineEvent) => {
                    const { baselineTime, timer, events } = ctx;
                    if (machineEvent.type === "ADD_EVENT") {
                        const { event } = machineEvent.payload;
                        addDelay(event, baselineTime);
                        let end = events.length - 1;
                        if (!events[end] || events[end].timestamp <= event.timestamp) {
                            events.push(event);
                        } else {
                            let insertionIndex = -1;
                            let start = 0;
                            while (start <= end) {
                                const mid = Math.floor((start + end) / 2);
                                if (events[mid].timestamp <= event.timestamp) {
                                    start = mid + 1;
                                } else {
                                    end = mid - 1;
                                }
                            }
                            if (insertionIndex === -1) {
                                insertionIndex = start;
                            }
                            events.splice(insertionIndex, 0, event);
                        }
                        const isSync = event.timestamp < baselineTime;
                        const castFn = getCastFn(event, isSync);
                        if (isSync) {
                            castFn();
                        } else if (timer.isActive()) {
                            timer.addAction({
                                doAction: () => {
                                    castFn();
                                },
                                delay: event.delay
                            });
                        }
                    }
                    return __spreadProps$2(__spreadValues$2({}, ctx), { events });
                })
            }
        });
        return v(playerMachine);
    }
    function createSpeedService(context) {
        const speedMachine = s({
            id: "speed",
            context,
            initial: "normal",
            states: {
                normal: {
                    on: {
                        FAST_FORWARD: {
                            target: "skipping",
                            actions: ["recordSpeed", "setSpeed"]
                        },
                        SET_SPEED: {
                            target: "normal",
                            actions: ["setSpeed"]
                        }
                    }
                },
                skipping: {
                    on: {
                        BACK_TO_NORMAL: {
                            target: "normal",
                            actions: ["restoreSpeed"]
                        },
                        SET_SPEED: {
                            target: "normal",
                            actions: ["setSpeed"]
                        }
                    }
                }
            }
        }, {
            actions: {
                setSpeed: (ctx, event) => {
                    if ("payload" in event) {
                        ctx.timer.setSpeed(event.payload.speed);
                    }
                },
                recordSpeed: o({
                    normalSpeed: (ctx) => ctx.timer.speed
                }),
                restoreSpeed: (ctx) => {
                    ctx.timer.setSpeed(ctx.normalSpeed);
                }
            }
        });
        return v(speedMachine);
    }

    const rules = (blockClass) => [
        `.${blockClass} { background: currentColor }`,
        "noscript { display: none !important; }"
    ];

    var __async$4 = (__this, __arguments, generator) => {
        return new Promise((resolve, reject) => {
            var fulfilled = (value) => {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            };
            var rejected = (value) => {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            };
            var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
            step((generator = generator.apply(__this, __arguments)).next());
        });
    };
    const webGLVarMap = /* @__PURE__ */ new Map();
    function variableListFor(ctx, ctor) {
        let contextMap = webGLVarMap.get(ctx);
        if (!contextMap) {
            contextMap = /* @__PURE__ */ new Map();
            webGLVarMap.set(ctx, contextMap);
        }
        if (!contextMap.has(ctor)) {
            contextMap.set(ctor, []);
        }
        return contextMap.get(ctor);
    }
    function deserializeArg(imageMap, ctx, preload) {
        return (arg) => __async$4(this, null, function* () {
            if (arg && typeof arg === "object" && "rr_type" in arg) {
                if (preload)
                    preload.isUnchanged = false;
                if (arg.rr_type === "ImageBitmap" && "args" in arg) {
                    const args = yield deserializeArg(imageMap, ctx, preload)(arg.args);
                    return yield createImageBitmap.apply(null, args);
                } else if ("index" in arg) {
                    if (preload || ctx === null)
                        return arg;
                    const { rr_type: name, index } = arg;
                    return variableListFor(ctx, name)[index];
                } else if ("args" in arg) {
                    const { rr_type: name, args } = arg;
                    const ctor = window[name];
                    return new ctor(...yield Promise.all(args.map(deserializeArg(imageMap, ctx, preload))));
                } else if ("base64" in arg) {
                    return decode(arg.base64);
                } else if ("src" in arg) {
                    const image = imageMap.get(arg.src);
                    if (image) {
                        return image;
                    } else {
                        const image2 = new Image();
                        image2.src = arg.src;
                        imageMap.set(arg.src, image2);
                        return image2;
                    }
                } else if ("data" in arg && arg.rr_type === "Blob") {
                    const blobContents = yield Promise.all(arg.data.map(deserializeArg(imageMap, ctx, preload)));
                    const blob = new Blob(blobContents, {
                        type: arg.type
                    });
                    return blob;
                }
            } else if (Array.isArray(arg)) {
                const result = yield Promise.all(arg.map(deserializeArg(imageMap, ctx, preload)));
                return result;
            }
            return arg;
        });
    }

    var __async$3 = (__this, __arguments, generator) => {
        return new Promise((resolve, reject) => {
            var fulfilled = (value) => {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            };
            var rejected = (value) => {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            };
            var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
            step((generator = generator.apply(__this, __arguments)).next());
        });
    };
    function getContext(target, type) {
        try {
            if (type === CanvasContext.WebGL) {
                return target.getContext("webgl") || target.getContext("experimental-webgl");
            }
            return target.getContext("webgl2");
        } catch (e) {
            return null;
        }
    }
    const WebGLVariableConstructorsNames = [
        "WebGLActiveInfo",
        "WebGLBuffer",
        "WebGLFramebuffer",
        "WebGLProgram",
        "WebGLRenderbuffer",
        "WebGLShader",
        "WebGLShaderPrecisionFormat",
        "WebGLTexture",
        "WebGLUniformLocation",
        "WebGLVertexArrayObject"
    ];
    function saveToWebGLVarMap(ctx, result) {
        if (!(result == null ? void 0 : result.constructor))
            return;
        const { name } = result.constructor;
        if (!WebGLVariableConstructorsNames.includes(name))
            return;
        const variables = variableListFor(ctx, name);
        if (!variables.includes(result))
            variables.push(result);
    }
    function webglMutation(_0) {
        return __async$3(this, arguments, function* ({
                                                         mutation,
                                                         target,
                                                         type,
                                                         imageMap,
                                                         errorHandler
                                                     }) {
            try {
                const ctx = getContext(target, type);
                if (!ctx)
                    return;
                if (mutation.setter) {
                    ctx[mutation.property] = mutation.args[0];
                    return;
                }
                const original = ctx[mutation.property];
                const args = yield Promise.all(mutation.args.map(deserializeArg(imageMap, ctx)));
                const result = original.apply(ctx, args);
                saveToWebGLVarMap(ctx, result);
                const debugMode = false;
                if (debugMode) ;
            } catch (error) {
                errorHandler(mutation, error);
            }
        });
    }

    var __async$2 = (__this, __arguments, generator) => {
        return new Promise((resolve, reject) => {
            var fulfilled = (value) => {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            };
            var rejected = (value) => {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            };
            var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
            step((generator = generator.apply(__this, __arguments)).next());
        });
    };
    function canvasMutation$1(_0) {
        return __async$2(this, arguments, function* ({
                                                         event,
                                                         mutation,
                                                         target,
                                                         imageMap,
                                                         errorHandler
                                                     }) {
            try {
                const ctx = target.getContext("2d");
                if (mutation.setter) {
                    ctx[mutation.property] = mutation.args[0];
                    return;
                }
                const original = ctx[mutation.property];
                if (mutation.property === "drawImage" && typeof mutation.args[0] === "string") {
                    imageMap.get(event);
                    original.apply(ctx, mutation.args);
                } else {
                    const args = yield Promise.all(mutation.args.map(deserializeArg(imageMap, ctx)));
                    original.apply(ctx, args);
                }
            } catch (error) {
                errorHandler(mutation, error);
            }
        });
    }

    var __async$1 = (__this, __arguments, generator) => {
        return new Promise((resolve, reject) => {
            var fulfilled = (value) => {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            };
            var rejected = (value) => {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            };
            var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
            step((generator = generator.apply(__this, __arguments)).next());
        });
    };
    function canvasMutation(_0) {
        return __async$1(this, arguments, function* ({
                                                         event,
                                                         mutation,
                                                         target,
                                                         imageMap,
                                                         canvasEventMap,
                                                         errorHandler
                                                     }) {
            try {
                const precomputedMutation = canvasEventMap.get(event) || mutation;
                const commands = "commands" in precomputedMutation ? precomputedMutation.commands : [precomputedMutation];
                if ([CanvasContext.WebGL, CanvasContext.WebGL2].includes(mutation.type)) {
                    for (let i = 0; i < commands.length; i++) {
                        const command = commands[i];
                        yield webglMutation({
                            mutation: command,
                            type: mutation.type,
                            target,
                            imageMap,
                            errorHandler
                        });
                    }
                    return;
                }
                for (let i = 0; i < commands.length; i++) {
                    const command = commands[i];
                    yield canvasMutation$1({
                        event,
                        mutation: command,
                        target,
                        imageMap,
                        errorHandler
                    });
                }
            } catch (error) {
                errorHandler(mutation, error);
            }
        });
    }

    var __defProp$1 = Object.defineProperty;
    var __defProps$1 = Object.defineProperties;
    var __getOwnPropDescs$1 = Object.getOwnPropertyDescriptors;
    var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
    var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
    var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
    var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
    var __spreadValues$1 = (a, b) => {
        for (var prop in b || (b = {}))
            if (__hasOwnProp$1.call(b, prop))
                __defNormalProp$1(a, prop, b[prop]);
        if (__getOwnPropSymbols$1)
            for (var prop of __getOwnPropSymbols$1(b)) {
                if (__propIsEnum$1.call(b, prop))
                    __defNormalProp$1(a, prop, b[prop]);
            }
        return a;
    };
    var __spreadProps$1 = (a, b) => __defProps$1(a, __getOwnPropDescs$1(b));
    var __async = (__this, __arguments, generator) => {
        return new Promise((resolve, reject) => {
            var fulfilled = (value) => {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            };
            var rejected = (value) => {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            };
            var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
            step((generator = generator.apply(__this, __arguments)).next());
        });
    };
    const SKIP_TIME_THRESHOLD = 10 * 1e3;
    const SKIP_TIME_INTERVAL = 5 * 1e3;
    const mitt = mitt$1 || mittProxy;
    const REPLAY_CONSOLE_PREFIX = "[replayer]";
    const defaultMouseTailConfig = {
        duration: 500,
        lineCap: "round",
        lineWidth: 3,
        strokeStyle: "red"
    };
    function indicatesTouchDevice(e) {
        return e.type == EventType.IncrementalSnapshot && (e.data.source == IncrementalSource.TouchMove || e.data.source == IncrementalSource.MouseInteraction && e.data.type == MouseInteractions.TouchStart);
    }
    class Replayer {
        constructor(events, config) {
            this.usingVirtualDom = false;
            this.virtualDom = new RRDocument();
            this.mouseTail = null;
            this.tailPositions = [];
            this.emitter = mitt();
            this.legacy_missingNodeRetryMap = {};
            this.cache = createCache();
            this.imageMap = /* @__PURE__ */ new Map();
            this.canvasEventMap = /* @__PURE__ */ new Map();
            this.mirror = createMirror$2();
            this.firstFullSnapshot = null;
            this.newDocumentQueue = [];
            this.mousePos = null;
            this.touchActive = null;
            this.handleResize = (dimension) => {
                this.iframe.style.display = "inherit";
                for (const el of [this.mouseTail, this.iframe]) {
                    if (!el) {
                        continue;
                    }
                    el.setAttribute("width", String(dimension.width));
                    el.setAttribute("height", String(dimension.height));
                }
            };
            this.applyEventsSynchronously = (events) => {
                for (const event of events) {
                    switch (event.type) {
                        case EventType.DomContentLoaded:
                        case EventType.Load:
                        case EventType.Custom:
                            continue;
                        case EventType.FullSnapshot:
                        case EventType.Meta:
                        case EventType.Plugin:
                        case EventType.IncrementalSnapshot:
                            break;
                    }
                    const castFn = this.getCastFn(event, true);
                    castFn();
                }
                if (this.touchActive === true) {
                    this.mouse.classList.add("touch-active");
                } else if (this.touchActive === false) {
                    this.mouse.classList.remove("touch-active");
                }
                this.touchActive = null;
            };
            this.getCastFn = (event, isSync = false) => {
                let castFn;
                switch (event.type) {
                    case EventType.DomContentLoaded:
                    case EventType.Load:
                        break;
                    case EventType.Custom:
                        castFn = () => {
                            this.emitter.emit(ReplayerEvents.CustomEvent, event);
                        };
                        break;
                    case EventType.Meta:
                        castFn = () => this.emitter.emit(ReplayerEvents.Resize, {
                            width: event.data.width,
                            height: event.data.height
                        });
                        break;
                    case EventType.FullSnapshot:
                        castFn = () => {
                            if (this.firstFullSnapshot) {
                                if (this.firstFullSnapshot === event) {
                                    this.firstFullSnapshot = true;
                                    return;
                                }
                            } else {
                                this.firstFullSnapshot = true;
                            }
                            this.rebuildFullSnapshot(event, isSync);
                            this.iframe.contentWindow.scrollTo(event.data.initialOffset);
                        };
                        break;
                    case EventType.IncrementalSnapshot:
                        castFn = () => {
                            this.applyIncremental(event, isSync);
                            if (isSync) {
                                return;
                            }
                            if (event === this.nextUserInteractionEvent) {
                                this.nextUserInteractionEvent = null;
                                this.backToNormal();
                            }
                            if (this.config.skipInactive && !this.nextUserInteractionEvent) {
                                for (const _event of this.service.state.context.events) {
                                    if (_event.timestamp <= event.timestamp) {
                                        continue;
                                    }
                                    if (this.isUserInteraction(_event)) {
                                        if (_event.delay - event.delay > SKIP_TIME_THRESHOLD * this.speedService.state.context.timer.speed) {
                                            this.nextUserInteractionEvent = _event;
                                        }
                                        break;
                                    }
                                }
                                if (this.nextUserInteractionEvent) {
                                    const skipTime = this.nextUserInteractionEvent.delay - event.delay;
                                    const payload = {
                                        speed: Math.min(Math.round(skipTime / SKIP_TIME_INTERVAL), this.config.maxSpeed)
                                    };
                                    this.speedService.send({ type: "FAST_FORWARD", payload });
                                    this.emitter.emit(ReplayerEvents.SkipStart, payload);
                                }
                            }
                        };
                        break;
                }
                const wrappedCastFn = () => {
                    if (castFn) {
                        castFn();
                    }
                    for (const plugin of this.config.plugins || []) {
                        plugin.handler(event, isSync, { replayer: this });
                    }
                    this.service.send({ type: "CAST_EVENT", payload: { event } });
                    const last_index = this.service.state.context.events.length - 1;
                    if (event === this.service.state.context.events[last_index]) {
                        const finish = () => {
                            if (last_index < this.service.state.context.events.length - 1) {
                                return;
                            }
                            this.backToNormal();
                            this.service.send("END");
                            this.emitter.emit(ReplayerEvents.Finish);
                        };
                        if (event.type === EventType.IncrementalSnapshot && event.data.source === IncrementalSource.MouseMove && event.data.positions.length) {
                            setTimeout(() => {
                                finish();
                            }, Math.max(0, -event.data.positions[0].timeOffset + 50));
                        } else {
                            finish();
                        }
                    }
                    this.emitter.emit(ReplayerEvents.EventCast, event);
                };
                return wrappedCastFn;
            };
            if (!(config == null ? void 0 : config.liveMode) && events.length < 2) {
                throw new Error("Replayer need at least 2 events.");
            }
            const defaultConfig = {
                speed: 1,
                maxSpeed: 360,
                root: document.body,
                loadTimeout: 0,
                skipInactive: false,
                showWarning: true,
                showDebug: false,
                blockClass: "rr-block",
                liveMode: false,
                insertStyleRules: [],
                triggerFocus: true,
                UNSAFE_replayCanvas: false,
                pauseAnimation: true,
                mouseTail: defaultMouseTailConfig,
                useVirtualDom: true
            };
            this.config = Object.assign({}, defaultConfig, config);
            this.handleResize = this.handleResize.bind(this);
            this.getCastFn = this.getCastFn.bind(this);
            this.applyEventsSynchronously = this.applyEventsSynchronously.bind(this);
            this.emitter.on(ReplayerEvents.Resize, this.handleResize);
            this.setupDom();
            this.emitter.on(ReplayerEvents.Flush, () => {
                if (this.usingVirtualDom) {
                    const replayerHandler = {
                        mirror: this.mirror,
                        applyCanvas: (canvasEvent, canvasMutationData2, target) => {
                            void canvasMutation({
                                event: canvasEvent,
                                mutation: canvasMutationData2,
                                target,
                                imageMap: this.imageMap,
                                canvasEventMap: this.canvasEventMap,
                                errorHandler: this.warnCanvasMutationFailed.bind(this)
                            });
                        },
                        applyInput: this.applyInput.bind(this),
                        applyScroll: this.applyScroll.bind(this)
                    };
                    diff(this.iframe.contentDocument, this.virtualDom, replayerHandler, this.virtualDom.mirror);
                    this.virtualDom.destroyTree();
                    this.usingVirtualDom = false;
                    if (Object.keys(this.legacy_missingNodeRetryMap).length) {
                        for (const key in this.legacy_missingNodeRetryMap) {
                            try {
                                const value = this.legacy_missingNodeRetryMap[key];
                                const realNode = createOrGetNode(value.node, this.mirror, this.virtualDom.mirror);
                                diff(realNode, value.node, replayerHandler, this.virtualDom.mirror);
                                value.node = realNode;
                            } catch (error) {
                                if (this.config.showWarning) {
                                    console.warn(error);
                                }
                            }
                        }
                    }
                }
                if (this.mousePos) {
                    this.moveAndHover(this.mousePos.x, this.mousePos.y, this.mousePos.id, true, this.mousePos.debugData);
                }
                this.mousePos = null;
            });
            this.emitter.on(ReplayerEvents.PlayBack, () => {
                this.firstFullSnapshot = null;
                this.mirror.reset();
            });
            const timer = new Timer([], (config == null ? void 0 : config.speed) || defaultConfig.speed);
            this.service = createPlayerService({
                events: events.map((e) => {
                    if (config && config.unpackFn) {
                        return config.unpackFn(e);
                    }
                    return e;
                }).sort((a1, a2) => a1.timestamp - a2.timestamp),
                timer,
                timeOffset: 0,
                baselineTime: 0,
                lastPlayedEvent: null
            }, {
                getCastFn: this.getCastFn,
                applyEventsSynchronously: this.applyEventsSynchronously,
                emitter: this.emitter
            });
            this.service.start();
            this.service.subscribe((state) => {
                this.emitter.emit(ReplayerEvents.StateChange, {
                    player: state
                });
            });
            this.speedService = createSpeedService({
                normalSpeed: -1,
                timer
            });
            this.speedService.start();
            this.speedService.subscribe((state) => {
                this.emitter.emit(ReplayerEvents.StateChange, {
                    speed: state
                });
            });
            const firstMeta = this.service.state.context.events.find((e) => e.type === EventType.Meta);
            const firstFullsnapshot = this.service.state.context.events.find((e) => e.type === EventType.FullSnapshot);
            if (firstMeta) {
                const { width, height } = firstMeta.data;
                setTimeout(() => {
                    this.emitter.emit(ReplayerEvents.Resize, {
                        width,
                        height
                    });
                }, 0);
            }
            if (firstFullsnapshot) {
                setTimeout(() => {
                    if (this.firstFullSnapshot) {
                        return;
                    }
                    this.firstFullSnapshot = firstFullsnapshot;
                    this.rebuildFullSnapshot(firstFullsnapshot);
                    this.iframe.contentWindow.scrollTo(firstFullsnapshot.data.initialOffset);
                }, 1);
            }
            if (this.service.state.context.events.find(indicatesTouchDevice)) {
                this.mouse.classList.add("touch-device");
            }
        }
        get timer() {
            return this.service.state.context.timer;
        }
        on(event, handler) {
            this.emitter.on(event, handler);
            return this;
        }
        off(event, handler) {
            this.emitter.off(event, handler);
            return this;
        }
        setConfig(config) {
            Object.keys(config).forEach((key) => {
                config[key];
                this.config[key] = config[key];
            });
            if (!this.config.skipInactive) {
                this.backToNormal();
            }
            if (typeof config.speed !== "undefined") {
                this.speedService.send({
                    type: "SET_SPEED",
                    payload: {
                        speed: config.speed
                    }
                });
            }
            if (typeof config.mouseTail !== "undefined") {
                if (config.mouseTail === false) {
                    if (this.mouseTail) {
                        this.mouseTail.style.display = "none";
                    }
                } else {
                    if (!this.mouseTail) {
                        this.mouseTail = document.createElement("canvas");
                        this.mouseTail.width = Number.parseFloat(this.iframe.width);
                        this.mouseTail.height = Number.parseFloat(this.iframe.height);
                        this.mouseTail.classList.add("replayer-mouse-tail");
                        this.wrapper.insertBefore(this.mouseTail, this.iframe);
                    }
                    this.mouseTail.style.display = "inherit";
                }
            }
        }
        getMetaData() {
            const firstEvent = this.service.state.context.events[0];
            const lastEvent = this.service.state.context.events[this.service.state.context.events.length - 1];
            return {
                startTime: firstEvent.timestamp,
                endTime: lastEvent.timestamp,
                totalTime: lastEvent.timestamp - firstEvent.timestamp
            };
        }
        getCurrentTime() {
            return this.timer.timeOffset + this.getTimeOffset();
        }
        getTimeOffset() {
            const { baselineTime, events } = this.service.state.context;
            return baselineTime - events[0].timestamp;
        }
        getMirror() {
            return this.mirror;
        }
        play(timeOffset = 0) {
            var _a, _b;
            if (this.service.state.matches("paused")) {
                this.service.send({ type: "PLAY", payload: { timeOffset } });
            } else {
                this.service.send({ type: "PAUSE" });
                this.service.send({ type: "PLAY", payload: { timeOffset } });
            }
            (_b = (_a = this.iframe.contentDocument) == null ? void 0 : _a.getElementsByTagName("html")[0]) == null ? void 0 : _b.classList.remove("rrweb-paused");
            this.emitter.emit(ReplayerEvents.Start);
        }
        pause(timeOffset) {
            var _a, _b;
            if (timeOffset === void 0 && this.service.state.matches("playing")) {
                this.service.send({ type: "PAUSE" });
            }
            if (typeof timeOffset === "number") {
                this.play(timeOffset);
                this.service.send({ type: "PAUSE" });
            }
            (_b = (_a = this.iframe.contentDocument) == null ? void 0 : _a.getElementsByTagName("html")[0]) == null ? void 0 : _b.classList.add("rrweb-paused");
            this.emitter.emit(ReplayerEvents.Pause);
        }
        resume(timeOffset = 0) {
            console.warn(`The 'resume' will be departed in 1.0. Please use 'play' method which has the same interface.`);
            this.play(timeOffset);
            this.emitter.emit(ReplayerEvents.Resume);
        }
        startLive(baselineTime) {
            this.service.send({ type: "TO_LIVE", payload: { baselineTime } });
        }
        addEvent(rawEvent) {
            const event = this.config.unpackFn ? this.config.unpackFn(rawEvent) : rawEvent;
            if (indicatesTouchDevice(event)) {
                this.mouse.classList.add("touch-device");
            }
            void Promise.resolve().then(() => this.service.send({ type: "ADD_EVENT", payload: { event } }));
        }
        enableInteract() {
            this.iframe.setAttribute("scrolling", "auto");
            this.iframe.style.pointerEvents = "auto";
        }
        disableInteract() {
            this.iframe.setAttribute("scrolling", "no");
            this.iframe.style.pointerEvents = "none";
        }
        resetCache() {
            this.cache = createCache();
        }
        setupDom() {
            this.wrapper = document.createElement("div");
            this.wrapper.classList.add("replayer-wrapper");
            this.config.root.appendChild(this.wrapper);
            this.mouse = document.createElement("div");
            this.mouse.classList.add("replayer-mouse");
            this.wrapper.appendChild(this.mouse);
            if (this.config.mouseTail !== false) {
                this.mouseTail = document.createElement("canvas");
                this.mouseTail.classList.add("replayer-mouse-tail");
                this.mouseTail.style.display = "inherit";
                this.wrapper.appendChild(this.mouseTail);
            }
            this.iframe = document.createElement("iframe");
            const attributes = ["allow-same-origin"];
            if (this.config.UNSAFE_replayCanvas) {
                attributes.push("allow-scripts");
            }
            this.iframe.style.display = "none";
            this.iframe.setAttribute("sandbox", attributes.join(" "));
            this.disableInteract();
            this.wrapper.appendChild(this.iframe);
            if (this.iframe.contentWindow && this.iframe.contentDocument) {
                polyfill(this.iframe.contentWindow, this.iframe.contentDocument);
                polyfill$1(this.iframe.contentWindow);
            }
        }
        rebuildFullSnapshot(event, isSync = false) {
            if (!this.iframe.contentDocument) {
                return console.warn("Looks like your replayer has been destroyed.");
            }
            if (Object.keys(this.legacy_missingNodeRetryMap).length) {
                console.warn("Found unresolved missing node map", this.legacy_missingNodeRetryMap);
            }
            this.legacy_missingNodeRetryMap = {};
            const collected = [];
            rebuild(event.data.node, {
                doc: this.iframe.contentDocument,
                afterAppend: (builtNode) => {
                    this.collectIframeAndAttachDocument(collected, builtNode);
                },
                cache: this.cache,
                mirror: this.mirror
            });
            for (const { mutationInQueue, builtNode } of collected) {
                this.attachDocumentToIframe(mutationInQueue, builtNode);
                this.newDocumentQueue = this.newDocumentQueue.filter((m) => m !== mutationInQueue);
            }
            const { documentElement, head } = this.iframe.contentDocument;
            this.insertStyleRules(documentElement, head);
            if (!this.service.state.matches("playing")) {
                this.iframe.contentDocument.getElementsByTagName("html")[0].classList.add("rrweb-paused");
            }
            this.emitter.emit(ReplayerEvents.FullsnapshotRebuilded, event);
            if (!isSync) {
                this.waitForStylesheetLoad();
            }
            if (this.config.UNSAFE_replayCanvas) {
                void this.preloadAllImages();
            }
        }
        insertStyleRules(documentElement, head) {
            const injectStylesRules = rules(this.config.blockClass).concat(this.config.insertStyleRules);
            if (this.config.pauseAnimation) {
                injectStylesRules.push("html.rrweb-paused *, html.rrweb-paused *:before, html.rrweb-paused *:after { animation-play-state: paused !important; }");
            }
            if (this.usingVirtualDom) {
                const styleEl = this.virtualDom.createElement("style");
                this.virtualDom.mirror.add(styleEl, getDefaultSN(styleEl, this.virtualDom.unserializedId));
                documentElement.insertBefore(styleEl, head);
                for (let idx = 0; idx < injectStylesRules.length; idx++) {
                    styleEl.rules.push({
                        cssText: injectStylesRules[idx],
                        type: StyleRuleType.Insert,
                        index: idx
                    });
                }
            } else {
                const styleEl = document.createElement("style");
                documentElement.insertBefore(styleEl, head);
                for (let idx = 0; idx < injectStylesRules.length; idx++) {
                    styleEl.sheet.insertRule(injectStylesRules[idx], idx);
                }
            }
        }
        attachDocumentToIframe(mutation, iframeEl) {
            const mirror = this.usingVirtualDom ? this.virtualDom.mirror : this.mirror;
            const collected = [];
            buildNodeWithSN(mutation.node, {
                doc: iframeEl.contentDocument,
                mirror,
                hackCss: true,
                skipChild: false,
                afterAppend: (builtNode) => {
                    this.collectIframeAndAttachDocument(collected, builtNode);
                    const sn = mirror.getMeta(builtNode);
                    if ((sn == null ? void 0 : sn.type) === NodeType$2.Element && (sn == null ? void 0 : sn.tagName.toUpperCase()) === "HTML") {
                        const { documentElement, head } = iframeEl.contentDocument;
                        this.insertStyleRules(documentElement, head);
                    }
                },
                cache: this.cache
            });
            for (const { mutationInQueue, builtNode } of collected) {
                this.attachDocumentToIframe(mutationInQueue, builtNode);
                this.newDocumentQueue = this.newDocumentQueue.filter((m) => m !== mutationInQueue);
            }
        }
        collectIframeAndAttachDocument(collected, builtNode) {
            if (isSerializedIframe(builtNode, this.mirror)) {
                const mutationInQueue = this.newDocumentQueue.find((m) => m.parentId === this.mirror.getId(builtNode));
                if (mutationInQueue) {
                    collected.push({
                        mutationInQueue,
                        builtNode
                    });
                }
            }
        }
        waitForStylesheetLoad() {
            var _a;
            const head = (_a = this.iframe.contentDocument) == null ? void 0 : _a.head;
            if (head) {
                const unloadSheets = /* @__PURE__ */ new Set();
                let timer;
                let beforeLoadState = this.service.state;
                const stateHandler = () => {
                    beforeLoadState = this.service.state;
                };
                this.emitter.on(ReplayerEvents.Start, stateHandler);
                this.emitter.on(ReplayerEvents.Pause, stateHandler);
                const unsubscribe = () => {
                    this.emitter.off(ReplayerEvents.Start, stateHandler);
                    this.emitter.off(ReplayerEvents.Pause, stateHandler);
                };
                head.querySelectorAll('link[rel="stylesheet"]').forEach((css) => {
                    if (!css.sheet) {
                        unloadSheets.add(css);
                        css.addEventListener("load", () => {
                            unloadSheets.delete(css);
                            if (unloadSheets.size === 0 && timer !== -1) {
                                if (beforeLoadState.matches("playing")) {
                                    this.play(this.getCurrentTime());
                                }
                                this.emitter.emit(ReplayerEvents.LoadStylesheetEnd);
                                if (timer) {
                                    clearTimeout(timer);
                                }
                                unsubscribe();
                            }
                        });
                    }
                });
                if (unloadSheets.size > 0) {
                    this.service.send({ type: "PAUSE" });
                    this.emitter.emit(ReplayerEvents.LoadStylesheetStart);
                    timer = setTimeout(() => {
                        if (beforeLoadState.matches("playing")) {
                            this.play(this.getCurrentTime());
                        }
                        timer = -1;
                        unsubscribe();
                    }, this.config.loadTimeout);
                }
            }
        }
        preloadAllImages() {
            return __async(this, null, function* () {
                this.service.state;
                const stateHandler = () => {
                    this.service.state;
                };
                this.emitter.on(ReplayerEvents.Start, stateHandler);
                this.emitter.on(ReplayerEvents.Pause, stateHandler);
                const promises = [];
                for (const event of this.service.state.context.events) {
                    if (event.type === EventType.IncrementalSnapshot && event.data.source === IncrementalSource.CanvasMutation) {
                        promises.push(this.deserializeAndPreloadCanvasEvents(event.data, event));
                        const commands = "commands" in event.data ? event.data.commands : [event.data];
                        commands.forEach((c) => {
                            this.preloadImages(c, event);
                        });
                    }
                }
                return Promise.all(promises);
            });
        }
        preloadImages(data, event) {
            if (data.property === "drawImage" && typeof data.args[0] === "string" && !this.imageMap.has(event)) {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                const imgd = ctx == null ? void 0 : ctx.createImageData(canvas.width, canvas.height);
                imgd == null ? void 0 : imgd.data;
                JSON.parse(data.args[0]);
                ctx == null ? void 0 : ctx.putImageData(imgd, 0, 0);
            }
        }
        deserializeAndPreloadCanvasEvents(data, event) {
            return __async(this, null, function* () {
                if (!this.canvasEventMap.has(event)) {
                    const status = {
                        isUnchanged: true
                    };
                    if ("commands" in data) {
                        const commands = yield Promise.all(data.commands.map((c) => __async(this, null, function* () {
                            const args = yield Promise.all(c.args.map(deserializeArg(this.imageMap, null, status)));
                            return __spreadProps$1(__spreadValues$1({}, c), { args });
                        })));
                        if (status.isUnchanged === false)
                            this.canvasEventMap.set(event, __spreadProps$1(__spreadValues$1({}, data), { commands }));
                    } else {
                        const args = yield Promise.all(data.args.map(deserializeArg(this.imageMap, null, status)));
                        if (status.isUnchanged === false)
                            this.canvasEventMap.set(event, __spreadProps$1(__spreadValues$1({}, data), { args }));
                    }
                }
            });
        }
        applyIncremental(e, isSync) {
            var _a, _b, _c, _d, _e, _f;
            const { data: d } = e;
            switch (d.source) {
                case IncrementalSource.Mutation: {
                    try {
                        this.applyMutation(d, isSync);
                    } catch (error) {
                        this.warn(`Exception in mutation ${error.message || error}`, d);
                    }
                    break;
                }
                case IncrementalSource.Drag:
                case IncrementalSource.TouchMove:
                case IncrementalSource.MouseMove:
                    if (isSync) {
                        const lastPosition = d.positions[d.positions.length - 1];
                        this.mousePos = {
                            x: lastPosition.x,
                            y: lastPosition.y,
                            id: lastPosition.id,
                            debugData: d
                        };
                    } else {
                        d.positions.forEach((p) => {
                            const action = {
                                doAction: () => {
                                    this.moveAndHover(p.x, p.y, p.id, isSync, d);
                                },
                                delay: p.timeOffset + e.timestamp - this.service.state.context.baselineTime
                            };
                            this.timer.addAction(action);
                        });
                        this.timer.addAction({
                            doAction() {
                            },
                            delay: e.delay - ((_a = d.positions[0]) == null ? void 0 : _a.timeOffset)
                        });
                    }
                    break;
                case IncrementalSource.MouseInteraction: {
                    if (d.id === -1 || isSync) {
                        break;
                    }
                    const event = new Event(MouseInteractions[d.type].toLowerCase());
                    const target = this.mirror.getNode(d.id);
                    if (!target) {
                        return this.debugNodeNotFound(d, d.id);
                    }
                    this.emitter.emit(ReplayerEvents.MouseInteraction, {
                        type: d.type,
                        target
                    });
                    const { triggerFocus } = this.config;
                    switch (d.type) {
                        case MouseInteractions.Blur:
                            if ("blur" in target) {
                                target.blur();
                            }
                            break;
                        case MouseInteractions.Focus:
                            if (triggerFocus && target.focus) {
                                target.focus({
                                    preventScroll: true
                                });
                            }
                            break;
                        case MouseInteractions.Click:
                        case MouseInteractions.TouchStart:
                        case MouseInteractions.TouchEnd:
                            if (isSync) {
                                if (d.type === MouseInteractions.TouchStart) {
                                    this.touchActive = true;
                                } else if (d.type === MouseInteractions.TouchEnd) {
                                    this.touchActive = false;
                                }
                                this.mousePos = {
                                    x: d.x,
                                    y: d.y,
                                    id: d.id,
                                    debugData: d
                                };
                            } else {
                                if (d.type === MouseInteractions.TouchStart) {
                                    this.tailPositions.length = 0;
                                }
                                this.moveAndHover(d.x, d.y, d.id, isSync, d);
                                if (d.type === MouseInteractions.Click) {
                                    this.mouse.classList.remove("active");
                                    void this.mouse.offsetWidth;
                                    this.mouse.classList.add("active");
                                } else if (d.type === MouseInteractions.TouchStart) {
                                    void this.mouse.offsetWidth;
                                    this.mouse.classList.add("touch-active");
                                } else if (d.type === MouseInteractions.TouchEnd) {
                                    this.mouse.classList.remove("touch-active");
                                }
                            }
                            break;
                        case MouseInteractions.TouchCancel:
                            if (isSync) {
                                this.touchActive = false;
                            } else {
                                this.mouse.classList.remove("touch-active");
                            }
                            break;
                        default:
                            target.dispatchEvent(event);
                    }
                    break;
                }
                case IncrementalSource.Scroll: {
                    if (d.id === -1) {
                        break;
                    }
                    if (this.usingVirtualDom) {
                        const target = this.virtualDom.mirror.getNode(d.id);
                        if (!target) {
                            return this.debugNodeNotFound(d, d.id);
                        }
                        target.scrollData = d;
                        break;
                    }
                    this.applyScroll(d, isSync);
                    break;
                }
                case IncrementalSource.ViewportResize:
                    this.emitter.emit(ReplayerEvents.Resize, {
                        width: d.width,
                        height: d.height
                    });
                    break;
                case IncrementalSource.Input: {
                    if (d.id === -1) {
                        break;
                    }
                    if (this.usingVirtualDom) {
                        const target = this.virtualDom.mirror.getNode(d.id);
                        if (!target) {
                            return this.debugNodeNotFound(d, d.id);
                        }
                        target.inputData = d;
                        break;
                    }
                    this.applyInput(d);
                    break;
                }
                case IncrementalSource.MediaInteraction: {
                    const target = this.usingVirtualDom ? this.virtualDom.mirror.getNode(d.id) : this.mirror.getNode(d.id);
                    if (!target) {
                        return this.debugNodeNotFound(d, d.id);
                    }
                    const mediaEl = target;
                    try {
                        if (d.currentTime) {
                            mediaEl.currentTime = d.currentTime;
                        }
                        if (d.volume) {
                            mediaEl.volume = d.volume;
                        }
                        if (d.muted) {
                            mediaEl.muted = d.muted;
                        }
                        if (d.type === MediaInteractions.Pause) {
                            mediaEl.pause();
                        }
                        if (d.type === MediaInteractions.Play) {
                            void mediaEl.play();
                        }
                    } catch (error) {
                        if (this.config.showWarning) {
                            console.warn(`Failed to replay media interactions: ${error.message || error}`);
                        }
                    }
                    break;
                }
                case IncrementalSource.StyleSheetRule: {
                    if (this.usingVirtualDom) {
                        const target = this.virtualDom.mirror.getNode(d.id);
                        if (!target) {
                            return this.debugNodeNotFound(d, d.id);
                        }
                        const rules = target.rules;
                        (_b = d.adds) == null ? void 0 : _b.forEach(({ rule, index: nestedIndex }) => rules == null ? void 0 : rules.push({
                            cssText: rule,
                            index: nestedIndex,
                            type: StyleRuleType.Insert
                        }));
                        (_c = d.removes) == null ? void 0 : _c.forEach(({ index: nestedIndex }) => rules == null ? void 0 : rules.push({ index: nestedIndex, type: StyleRuleType.Remove }));
                    } else {
                        const target = this.mirror.getNode(d.id);
                        if (!target) {
                            return this.debugNodeNotFound(d, d.id);
                        }
                        const styleSheet = target.sheet;
                        (_d = d.adds) == null ? void 0 : _d.forEach(({ rule, index: nestedIndex }) => {
                            try {
                                if (Array.isArray(nestedIndex)) {
                                    const { positions, index } = getPositionsAndIndex$1(nestedIndex);
                                    const nestedRule = getNestedRule$1(styleSheet.cssRules, positions);
                                    nestedRule.insertRule(rule, index);
                                } else {
                                    const index = nestedIndex === void 0 ? void 0 : Math.min(nestedIndex, styleSheet.cssRules.length);
                                    styleSheet.insertRule(rule, index);
                                }
                            } catch (e2) {
                            }
                        });
                        (_e = d.removes) == null ? void 0 : _e.forEach(({ index: nestedIndex }) => {
                            try {
                                if (Array.isArray(nestedIndex)) {
                                    const { positions, index } = getPositionsAndIndex$1(nestedIndex);
                                    const nestedRule = getNestedRule$1(styleSheet.cssRules, positions);
                                    nestedRule.deleteRule(index || 0);
                                } else {
                                    styleSheet == null ? void 0 : styleSheet.deleteRule(nestedIndex);
                                }
                            } catch (e2) {
                            }
                        });
                    }
                    break;
                }
                case IncrementalSource.StyleDeclaration: {
                    if (this.usingVirtualDom) {
                        const target = this.virtualDom.mirror.getNode(d.id);
                        if (!target) {
                            return this.debugNodeNotFound(d, d.id);
                        }
                        const rules = target.rules;
                        d.set && rules.push(__spreadValues$1({
                            type: StyleRuleType.SetProperty,
                            index: d.index
                        }, d.set));
                        d.remove && rules.push(__spreadValues$1({
                            type: StyleRuleType.RemoveProperty,
                            index: d.index
                        }, d.remove));
                    } else {
                        const target = this.mirror.getNode(d.id);
                        if (!target) {
                            return this.debugNodeNotFound(d, d.id);
                        }
                        const styleSheet = target.sheet;
                        if (d.set) {
                            const rule = getNestedRule$1(styleSheet.rules, d.index);
                            rule.style.setProperty(d.set.property, d.set.value, d.set.priority);
                        }
                        if (d.remove) {
                            const rule = getNestedRule$1(styleSheet.rules, d.index);
                            rule.style.removeProperty(d.remove.property);
                        }
                    }
                    break;
                }
                case IncrementalSource.CanvasMutation: {
                    if (!this.config.UNSAFE_replayCanvas) {
                        return;
                    }
                    if (this.usingVirtualDom) {
                        const target = this.virtualDom.mirror.getNode(d.id);
                        if (!target) {
                            return this.debugNodeNotFound(d, d.id);
                        }
                        target.canvasMutations.push({
                            event: e,
                            mutation: d
                        });
                    } else {
                        const target = this.mirror.getNode(d.id);
                        if (!target) {
                            return this.debugNodeNotFound(d, d.id);
                        }
                        void canvasMutation({
                            event: e,
                            mutation: d,
                            target,
                            imageMap: this.imageMap,
                            canvasEventMap: this.canvasEventMap,
                            errorHandler: this.warnCanvasMutationFailed.bind(this)
                        });
                    }
                    break;
                }
                case IncrementalSource.Font: {
                    try {
                        const fontFace = new FontFace(d.family, d.buffer ? new Uint8Array(JSON.parse(d.fontSource)) : d.fontSource, d.descriptors);
                        (_f = this.iframe.contentDocument) == null ? void 0 : _f.fonts.add(fontFace);
                    } catch (error) {
                        if (this.config.showWarning) {
                            console.warn(error);
                        }
                    }
                    break;
                }
            }
        }
        applyMutation(d, isSync) {
            if (this.config.useVirtualDom && !this.usingVirtualDom && isSync) {
                this.usingVirtualDom = true;
                buildFromDom(this.iframe.contentDocument, this.mirror, this.virtualDom);
                if (Object.keys(this.legacy_missingNodeRetryMap).length) {
                    for (const key in this.legacy_missingNodeRetryMap) {
                        try {
                            const value = this.legacy_missingNodeRetryMap[key];
                            const virtualNode = buildFromNode(value.node, this.virtualDom, this.mirror);
                            if (virtualNode)
                                value.node = virtualNode;
                        } catch (error) {
                            if (this.config.showWarning) {
                                console.warn(error);
                            }
                        }
                    }
                }
            }
            const mirror = this.usingVirtualDom ? this.virtualDom.mirror : this.mirror;
            d.removes.forEach((mutation) => {
                var _a;
                const target = mirror.getNode(mutation.id);
                if (!target) {
                    if (d.removes.find((r) => r.id === mutation.parentId)) {
                        return;
                    }
                    return this.warnNodeNotFound(d, mutation.id);
                }
                let parent = mirror.getNode(mutation.parentId);
                if (!parent) {
                    return this.warnNodeNotFound(d, mutation.parentId);
                }
                if (mutation.isShadow && hasShadowRoot(parent)) {
                    parent = parent.shadowRoot;
                }
                mirror.removeNodeFromMap(target);
                if (parent)
                    try {
                        parent.removeChild(target);
                        if (this.usingVirtualDom && target.nodeName === "#text" && parent.nodeName === "STYLE" && ((_a = parent.rules) == null ? void 0 : _a.length) > 0)
                            parent.rules = [];
                    } catch (error) {
                        if (error instanceof DOMException) {
                            this.warn("parent could not remove child in mutation", parent, target, d);
                        } else {
                            throw error;
                        }
                    }
            });
            const legacy_missingNodeMap = __spreadValues$1({}, this.legacy_missingNodeRetryMap);
            const queue = [];
            const nextNotInDOM = (mutation) => {
                let next = null;
                if (mutation.nextId) {
                    next = mirror.getNode(mutation.nextId);
                }
                if (mutation.nextId !== null && mutation.nextId !== void 0 && mutation.nextId !== -1 && !next) {
                    return true;
                }
                return false;
            };
            const appendNode = (mutation) => {
                var _a;
                if (!this.iframe.contentDocument) {
                    return console.warn("Looks like your replayer has been destroyed.");
                }
                let parent = mirror.getNode(mutation.parentId);
                if (!parent) {
                    if (mutation.node.type === NodeType$2.Document) {
                        return this.newDocumentQueue.push(mutation);
                    }
                    return queue.push(mutation);
                }
                if (mutation.node.isShadow) {
                    if (!hasShadowRoot(parent)) {
                        parent.attachShadow({ mode: "open" });
                        parent = parent.shadowRoot;
                    } else
                        parent = parent.shadowRoot;
                }
                let previous = null;
                let next = null;
                if (mutation.previousId) {
                    previous = mirror.getNode(mutation.previousId);
                }
                if (mutation.nextId) {
                    next = mirror.getNode(mutation.nextId);
                }
                if (nextNotInDOM(mutation)) {
                    return queue.push(mutation);
                }
                if (mutation.node.rootId && !mirror.getNode(mutation.node.rootId)) {
                    return;
                }
                const targetDoc = mutation.node.rootId ? mirror.getNode(mutation.node.rootId) : this.usingVirtualDom ? this.virtualDom : this.iframe.contentDocument;
                if (isSerializedIframe(parent, mirror)) {
                    this.attachDocumentToIframe(mutation, parent);
                    return;
                }
                const target = buildNodeWithSN(mutation.node, {
                    doc: targetDoc,
                    mirror,
                    skipChild: true,
                    hackCss: true,
                    cache: this.cache
                });
                if (mutation.previousId === -1 || mutation.nextId === -1) {
                    legacy_missingNodeMap[mutation.node.id] = {
                        node: target,
                        mutation
                    };
                    return;
                }
                const parentSn = mirror.getMeta(parent);
                if (parentSn && parentSn.type === NodeType$2.Element && parentSn.tagName === "textarea" && mutation.node.type === NodeType$2.Text) {
                    const childNodeArray = Array.isArray(parent.childNodes) ? parent.childNodes : Array.from(parent.childNodes);
                    for (const c of childNodeArray) {
                        if (c.nodeType === parent.TEXT_NODE) {
                            parent.removeChild(c);
                        }
                    }
                }
                if (previous && previous.nextSibling && previous.nextSibling.parentNode) {
                    parent.insertBefore(target, previous.nextSibling);
                } else if (next && next.parentNode) {
                    parent.contains(next) ? parent.insertBefore(target, next) : parent.insertBefore(target, null);
                } else {
                    if (parent === targetDoc) {
                        while (targetDoc.firstChild) {
                            targetDoc.removeChild(targetDoc.firstChild);
                        }
                    }
                    parent.appendChild(target);
                }
                if (this.usingVirtualDom && target.nodeName === "#text" && parent.nodeName === "STYLE" && ((_a = parent.rules) == null ? void 0 : _a.length) > 0)
                    parent.rules = [];
                if (isSerializedIframe(target, this.mirror)) {
                    const targetId = this.mirror.getId(target);
                    const mutationInQueue = this.newDocumentQueue.find((m) => m.parentId === targetId);
                    if (mutationInQueue) {
                        this.attachDocumentToIframe(mutationInQueue, target);
                        this.newDocumentQueue = this.newDocumentQueue.filter((m) => m !== mutationInQueue);
                    }
                }
                if (mutation.previousId || mutation.nextId) {
                    this.legacy_resolveMissingNode(legacy_missingNodeMap, parent, target, mutation);
                }
            };
            d.adds.forEach((mutation) => {
                appendNode(mutation);
            });
            const startTime = Date.now();
            while (queue.length) {
                const resolveTrees = queueToResolveTrees(queue);
                queue.length = 0;
                if (Date.now() - startTime > 500) {
                    this.warn("Timeout in the loop, please check the resolve tree data:", resolveTrees);
                    break;
                }
                for (const tree of resolveTrees) {
                    const parent = mirror.getNode(tree.value.parentId);
                    if (!parent) {
                        this.debug("Drop resolve tree since there is no parent for the root node.", tree);
                    } else {
                        iterateResolveTree(tree, (mutation) => {
                            appendNode(mutation);
                        });
                    }
                }
            }
            if (Object.keys(legacy_missingNodeMap).length) {
                Object.assign(this.legacy_missingNodeRetryMap, legacy_missingNodeMap);
            }
            uniqueTextMutations(d.texts).forEach((mutation) => {
                var _a;
                const target = mirror.getNode(mutation.id);
                if (!target) {
                    if (d.removes.find((r) => r.id === mutation.id)) {
                        return;
                    }
                    return this.warnNodeNotFound(d, mutation.id);
                }
                target.textContent = mutation.value;
                if (this.usingVirtualDom) {
                    const parent = target.parentNode;
                    if (((_a = parent == null ? void 0 : parent.rules) == null ? void 0 : _a.length) > 0)
                        parent.rules = [];
                }
            });
            d.attributes.forEach((mutation) => {
                const target = mirror.getNode(mutation.id);
                if (!target) {
                    if (d.removes.find((r) => r.id === mutation.id)) {
                        return;
                    }
                    return this.warnNodeNotFound(d, mutation.id);
                }
                for (const attributeName in mutation.attributes) {
                    if (typeof attributeName === "string") {
                        const value = mutation.attributes[attributeName];
                        if (value === null) {
                            target.removeAttribute(attributeName);
                        } else if (typeof value === "string") {
                            try {
                                target.setAttribute(attributeName, value);
                            } catch (error) {
                                if (this.config.showWarning) {
                                    console.warn("An error occurred may due to the checkout feature.", error);
                                }
                            }
                        } else if (attributeName === "style") {
                            const styleValues = value;
                            const targetEl = target;
                            for (const s in styleValues) {
                                if (styleValues[s] === false) {
                                    targetEl.style.removeProperty(s);
                                } else if (styleValues[s] instanceof Array) {
                                    const svp = styleValues[s];
                                    targetEl.style.setProperty(s, svp[0], svp[1]);
                                } else {
                                    const svs = styleValues[s];
                                    targetEl.style.setProperty(s, svs);
                                }
                            }
                        }
                    }
                }
            });
        }
        applyScroll(d, isSync) {
            const target = this.mirror.getNode(d.id);
            if (!target) {
                return this.debugNodeNotFound(d, d.id);
            }
            const sn = this.mirror.getMeta(target);
            if (target === this.iframe.contentDocument) {
                this.iframe.contentWindow.scrollTo({
                    top: d.y,
                    left: d.x,
                    behavior: isSync ? "auto" : "smooth"
                });
            } else if ((sn == null ? void 0 : sn.type) === NodeType$2.Document) {
                target.defaultView.scrollTo({
                    top: d.y,
                    left: d.x,
                    behavior: isSync ? "auto" : "smooth"
                });
            } else {
                try {
                    target.scrollTop = d.y;
                    target.scrollLeft = d.x;
                } catch (error) {
                }
            }
        }
        applyInput(d) {
            const target = this.mirror.getNode(d.id);
            if (!target) {
                return this.debugNodeNotFound(d, d.id);
            }
            try {
                target.checked = d.isChecked;
                target.value = d.text;
            } catch (error) {
            }
        }
        legacy_resolveMissingNode(map, parent, target, targetMutation) {
            const { previousId, nextId } = targetMutation;
            const previousInMap = previousId && map[previousId];
            const nextInMap = nextId && map[nextId];
            if (previousInMap) {
                const { node, mutation } = previousInMap;
                parent.insertBefore(node, target);
                delete map[mutation.node.id];
                delete this.legacy_missingNodeRetryMap[mutation.node.id];
                if (mutation.previousId || mutation.nextId) {
                    this.legacy_resolveMissingNode(map, parent, node, mutation);
                }
            }
            if (nextInMap) {
                const { node, mutation } = nextInMap;
                parent.insertBefore(node, target.nextSibling);
                delete map[mutation.node.id];
                delete this.legacy_missingNodeRetryMap[mutation.node.id];
                if (mutation.previousId || mutation.nextId) {
                    this.legacy_resolveMissingNode(map, parent, node, mutation);
                }
            }
        }
        moveAndHover(x, y, id, isSync, debugData) {
            const target = this.mirror.getNode(id);
            if (!target) {
                return this.debugNodeNotFound(debugData, id);
            }
            const base = getBaseDimension(target, this.iframe);
            const _x = x * base.absoluteScale + base.x;
            const _y = y * base.absoluteScale + base.y;
            this.mouse.style.left = `${_x}px`;
            this.mouse.style.top = `${_y}px`;
            if (!isSync) {
                this.drawMouseTail({ x: _x, y: _y });
            }
            this.hoverElements(target);
        }
        drawMouseTail(position) {
            if (!this.mouseTail) {
                return;
            }
            const { lineCap, lineWidth, strokeStyle, duration } = this.config.mouseTail === true ? defaultMouseTailConfig : Object.assign({}, defaultMouseTailConfig, this.config.mouseTail);
            const draw = () => {
                if (!this.mouseTail) {
                    return;
                }
                const ctx = this.mouseTail.getContext("2d");
                if (!ctx || !this.tailPositions.length) {
                    return;
                }
                ctx.clearRect(0, 0, this.mouseTail.width, this.mouseTail.height);
                ctx.beginPath();
                ctx.lineWidth = lineWidth;
                ctx.lineCap = lineCap;
                ctx.strokeStyle = strokeStyle;
                ctx.moveTo(this.tailPositions[0].x, this.tailPositions[0].y);
                this.tailPositions.forEach((p) => ctx.lineTo(p.x, p.y));
                ctx.stroke();
            };
            this.tailPositions.push(position);
            draw();
            setTimeout(() => {
                this.tailPositions = this.tailPositions.filter((p) => p !== position);
                draw();
            }, duration / this.speedService.state.context.timer.speed);
        }
        hoverElements(el) {
            var _a;
            (_a = this.iframe.contentDocument) == null ? void 0 : _a.querySelectorAll(".\\:hover").forEach((hoveredEl) => {
                hoveredEl.classList.remove(":hover");
            });
            let currentEl = el;
            while (currentEl) {
                if (currentEl.classList) {
                    currentEl.classList.add(":hover");
                }
                currentEl = currentEl.parentElement;
            }
        }
        isUserInteraction(event) {
            if (event.type !== EventType.IncrementalSnapshot) {
                return false;
            }
            return event.data.source > IncrementalSource.Mutation && event.data.source <= IncrementalSource.Input;
        }
        backToNormal() {
            this.nextUserInteractionEvent = null;
            if (this.speedService.state.matches("normal")) {
                return;
            }
            this.speedService.send({ type: "BACK_TO_NORMAL" });
            this.emitter.emit(ReplayerEvents.SkipEnd, {
                speed: this.speedService.state.context.normalSpeed
            });
        }
        warnNodeNotFound(d, id) {
            this.warn(`Node with id '${id}' not found. `, d);
        }
        warnCanvasMutationFailed(d, error) {
            this.warn(`Has error on canvas update`, error, "canvas mutation:", d);
        }
        debugNodeNotFound(d, id) {
            this.debug(REPLAY_CONSOLE_PREFIX, `Node with id '${id}' not found. `, d);
        }
        warn(...args) {
            if (!this.config.showWarning) {
                return;
            }
            console.warn(REPLAY_CONSOLE_PREFIX, ...args);
        }
        debug(...args) {
            if (!this.config.showDebug) {
                return;
            }
            console.log(REPLAY_CONSOLE_PREFIX, ...args);
        }
    }

    const { addCustomEvent } = record;
    const { freezePage } = record;

    // DEFLATE is a complex format; to read this code, you should probably check the RFC first:

    // aliases for shorter compressed code (most minifers don't do this)
    var u8 = Uint8Array, u16 = Uint16Array, u32 = Uint32Array;
    // fixed length extra bits
    var fleb = new u8([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, /* unused */ 0, 0, /* impossible */ 0]);
    // fixed distance extra bits
    // see fleb note
    var fdeb = new u8([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, /* unused */ 0, 0]);
    // code length index map
    var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
    // get base, reverse index map from extra bits
    var freb = function (eb, start) {
        var b = new u16(31);
        for (var i = 0; i < 31; ++i) {
            b[i] = start += 1 << eb[i - 1];
        }
        // numbers here are at max 18 bits
        var r = new u32(b[30]);
        for (var i = 1; i < 30; ++i) {
            for (var j = b[i]; j < b[i + 1]; ++j) {
                r[j] = ((j - b[i]) << 5) | i;
            }
        }
        return [b, r];
    };
    var _a = freb(fleb, 2), fl = _a[0], revfl = _a[1];
    // we can ignore the fact that the other numbers are wrong; they never happen anyway
    fl[28] = 258, revfl[258] = 28;
    var _b = freb(fdeb, 0), fd = _b[0], revfd = _b[1];
    // map of value to reverse (assuming 16 bits)
    var rev = new u16(32768);
    for (var i = 0; i < 32768; ++i) {
        // reverse table algorithm from SO
        var x = ((i & 0xAAAA) >>> 1) | ((i & 0x5555) << 1);
        x = ((x & 0xCCCC) >>> 2) | ((x & 0x3333) << 2);
        x = ((x & 0xF0F0) >>> 4) | ((x & 0x0F0F) << 4);
        rev[i] = (((x & 0xFF00) >>> 8) | ((x & 0x00FF) << 8)) >>> 1;
    }
    // create huffman tree from u8 "map": index -> code length for code index
    // mb (max bits) must be at most 15
    // TODO: optimize/split up?
    var hMap = (function (cd, mb, r) {
        var s = cd.length;
        // index
        var i = 0;
        // u16 "map": index -> # of codes with bit length = index
        var l = new u16(mb);
        // length of cd must be 288 (total # of codes)
        for (; i < s; ++i)
            ++l[cd[i] - 1];
        // u16 "map": index -> minimum code for bit length = index
        var le = new u16(mb);
        for (i = 0; i < mb; ++i) {
            le[i] = (le[i - 1] + l[i - 1]) << 1;
        }
        var co;
        if (r) {
            // u16 "map": index -> number of actual bits, symbol for code
            co = new u16(1 << mb);
            // bits to remove for reverser
            var rvb = 15 - mb;
            for (i = 0; i < s; ++i) {
                // ignore 0 lengths
                if (cd[i]) {
                    // num encoding both symbol and bits read
                    var sv = (i << 4) | cd[i];
                    // free bits
                    var r_1 = mb - cd[i];
                    // start value
                    var v = le[cd[i] - 1]++ << r_1;
                    // m is end value
                    for (var m = v | ((1 << r_1) - 1); v <= m; ++v) {
                        // every 16 bit value starting with the code yields the same result
                        co[rev[v] >>> rvb] = sv;
                    }
                }
            }
        }
        else {
            co = new u16(s);
            for (i = 0; i < s; ++i)
                co[i] = rev[le[cd[i] - 1]++] >>> (15 - cd[i]);
        }
        return co;
    });
    // fixed length tree
    var flt = new u8(288);
    for (var i = 0; i < 144; ++i)
        flt[i] = 8;
    for (var i = 144; i < 256; ++i)
        flt[i] = 9;
    for (var i = 256; i < 280; ++i)
        flt[i] = 7;
    for (var i = 280; i < 288; ++i)
        flt[i] = 8;
    // fixed distance tree
    var fdt = new u8(32);
    for (var i = 0; i < 32; ++i)
        fdt[i] = 5;
    // fixed length map
    var flm = /*#__PURE__*/ hMap(flt, 9, 0), flrm = /*#__PURE__*/ hMap(flt, 9, 1);
    // fixed distance map
    var fdm = /*#__PURE__*/ hMap(fdt, 5, 0), fdrm = /*#__PURE__*/ hMap(fdt, 5, 1);
    // find max of array
    var max = function (a) {
        var m = a[0];
        for (var i = 1; i < a.length; ++i) {
            if (a[i] > m)
                m = a[i];
        }
        return m;
    };
    // read d, starting at bit p and mask with m
    var bits = function (d, p, m) {
        var o = (p / 8) >> 0;
        return ((d[o] | (d[o + 1] << 8)) >>> (p & 7)) & m;
    };
    // read d, starting at bit p continuing for at least 16 bits
    var bits16 = function (d, p) {
        var o = (p / 8) >> 0;
        return ((d[o] | (d[o + 1] << 8) | (d[o + 2] << 16)) >>> (p & 7));
    };
    // get end of byte
    var shft = function (p) { return ((p / 8) >> 0) + (p & 7 && 1); };
    // typed array slice - allows garbage collector to free original reference,
    // while being more compatible than .slice
    var slc = function (v, s, e) {
        if (s == null || s < 0)
            s = 0;
        if (e == null || e > v.length)
            e = v.length;
        // can't use .constructor in case user-supplied
        var n = new (v instanceof u16 ? u16 : v instanceof u32 ? u32 : u8)(e - s);
        n.set(v.subarray(s, e));
        return n;
    };
    // expands raw DEFLATE data
    var inflt = function (dat, buf, st) {
        // source length
        var sl = dat.length;
        // have to estimate size
        var noBuf = !buf || st;
        // no state
        var noSt = !st || st.i;
        if (!st)
            st = {};
        // Assumes roughly 33% compression ratio average
        if (!buf)
            buf = new u8(sl * 3);
        // ensure buffer can fit at least l elements
        var cbuf = function (l) {
            var bl = buf.length;
            // need to increase size to fit
            if (l > bl) {
                // Double or set to necessary, whichever is greater
                var nbuf = new u8(Math.max(bl * 2, l));
                nbuf.set(buf);
                buf = nbuf;
            }
        };
        //  last chunk         bitpos           bytes
        var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
        // total bits
        var tbts = sl * 8;
        do {
            if (!lm) {
                // BFINAL - this is only 1 when last chunk is next
                st.f = final = bits(dat, pos, 1);
                // type: 0 = no compression, 1 = fixed huffman, 2 = dynamic huffman
                var type = bits(dat, pos + 1, 3);
                pos += 3;
                if (!type) {
                    // go to end of byte boundary
                    var s = shft(pos) + 4, l = dat[s - 4] | (dat[s - 3] << 8), t = s + l;
                    if (t > sl) {
                        if (noSt)
                            throw 'unexpected EOF';
                        break;
                    }
                    // ensure size
                    if (noBuf)
                        cbuf(bt + l);
                    // Copy over uncompressed data
                    buf.set(dat.subarray(s, t), bt);
                    // Get new bitpos, update byte count
                    st.b = bt += l, st.p = pos = t * 8;
                    continue;
                }
                else if (type == 1)
                    lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
                else if (type == 2) {
                    //  literal                            lengths
                    var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
                    var tl = hLit + bits(dat, pos + 5, 31) + 1;
                    pos += 14;
                    // length+distance tree
                    var ldt = new u8(tl);
                    // code length tree
                    var clt = new u8(19);
                    for (var i = 0; i < hcLen; ++i) {
                        // use index map to get real code
                        clt[clim[i]] = bits(dat, pos + i * 3, 7);
                    }
                    pos += hcLen * 3;
                    // code lengths bits
                    var clb = max(clt), clbmsk = (1 << clb) - 1;
                    if (!noSt && pos + tl * (clb + 7) > tbts)
                        break;
                    // code lengths map
                    var clm = hMap(clt, clb, 1);
                    for (var i = 0; i < tl;) {
                        var r = clm[bits(dat, pos, clbmsk)];
                        // bits read
                        pos += r & 15;
                        // symbol
                        var s = r >>> 4;
                        // code length to copy
                        if (s < 16) {
                            ldt[i++] = s;
                        }
                        else {
                            //  copy   count
                            var c = 0, n = 0;
                            if (s == 16)
                                n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
                            else if (s == 17)
                                n = 3 + bits(dat, pos, 7), pos += 3;
                            else if (s == 18)
                                n = 11 + bits(dat, pos, 127), pos += 7;
                            while (n--)
                                ldt[i++] = c;
                        }
                    }
                    //    length tree                 distance tree
                    var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
                    // max length bits
                    lbt = max(lt);
                    // max dist bits
                    dbt = max(dt);
                    lm = hMap(lt, lbt, 1);
                    dm = hMap(dt, dbt, 1);
                }
                else
                    throw 'invalid block type';
                if (pos > tbts)
                    throw 'unexpected EOF';
            }
            // Make sure the buffer can hold this + the largest possible addition
            // Maximum chunk size (practically, theoretically infinite) is 2^17;
            if (noBuf)
                cbuf(bt + 131072);
            var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
            var mxa = lbt + dbt + 18;
            while (noSt || pos + mxa < tbts) {
                // bits read, code
                var c = lm[bits16(dat, pos) & lms], sym = c >>> 4;
                pos += c & 15;
                if (pos > tbts)
                    throw 'unexpected EOF';
                if (!c)
                    throw 'invalid length/literal';
                if (sym < 256)
                    buf[bt++] = sym;
                else if (sym == 256) {
                    lm = null;
                    break;
                }
                else {
                    var add = sym - 254;
                    // no extra bits needed if less
                    if (sym > 264) {
                        // index
                        var i = sym - 257, b = fleb[i];
                        add = bits(dat, pos, (1 << b) - 1) + fl[i];
                        pos += b;
                    }
                    // dist
                    var d = dm[bits16(dat, pos) & dms], dsym = d >>> 4;
                    if (!d)
                        throw 'invalid distance';
                    pos += d & 15;
                    var dt = fd[dsym];
                    if (dsym > 3) {
                        var b = fdeb[dsym];
                        dt += bits16(dat, pos) & ((1 << b) - 1), pos += b;
                    }
                    if (pos > tbts)
                        throw 'unexpected EOF';
                    if (noBuf)
                        cbuf(bt + 131072);
                    var end = bt + add;
                    for (; bt < end; bt += 4) {
                        buf[bt] = buf[bt - dt];
                        buf[bt + 1] = buf[bt + 1 - dt];
                        buf[bt + 2] = buf[bt + 2 - dt];
                        buf[bt + 3] = buf[bt + 3 - dt];
                    }
                    bt = end;
                }
            }
            st.l = lm, st.p = pos, st.b = bt;
            if (lm)
                final = 1, st.m = lbt, st.d = dm, st.n = dbt;
        } while (!final);
        return bt == buf.length ? buf : slc(buf, 0, bt);
    };
    // starting at p, write the minimum number of bits that can hold v to d
    var wbits = function (d, p, v) {
        v <<= p & 7;
        var o = (p / 8) >> 0;
        d[o] |= v;
        d[o + 1] |= v >>> 8;
    };
    // starting at p, write the minimum number of bits (>8) that can hold v to d
    var wbits16 = function (d, p, v) {
        v <<= p & 7;
        var o = (p / 8) >> 0;
        d[o] |= v;
        d[o + 1] |= v >>> 8;
        d[o + 2] |= v >>> 16;
    };
    // creates code lengths from a frequency table
    var hTree = function (d, mb) {
        // Need extra info to make a tree
        var t = [];
        for (var i = 0; i < d.length; ++i) {
            if (d[i])
                t.push({ s: i, f: d[i] });
        }
        var s = t.length;
        var t2 = t.slice();
        if (!s)
            return [new u8(0), 0];
        if (s == 1) {
            var v = new u8(t[0].s + 1);
            v[t[0].s] = 1;
            return [v, 1];
        }
        t.sort(function (a, b) { return a.f - b.f; });
        // after i2 reaches last ind, will be stopped
        // freq must be greater than largest possible number of symbols
        t.push({ s: -1, f: 25001 });
        var l = t[0], r = t[1], i0 = 0, i1 = 1, i2 = 2;
        t[0] = { s: -1, f: l.f + r.f, l: l, r: r };
        // efficient algorithm from UZIP.js
        // i0 is lookbehind, i2 is lookahead - after processing two low-freq
        // symbols that combined have high freq, will start processing i2 (high-freq,
        // non-composite) symbols instead
        // see https://reddit.com/r/photopea/comments/ikekht/uzipjs_questions/
        while (i1 != s - 1) {
            l = t[t[i0].f < t[i2].f ? i0++ : i2++];
            r = t[i0 != i1 && t[i0].f < t[i2].f ? i0++ : i2++];
            t[i1++] = { s: -1, f: l.f + r.f, l: l, r: r };
        }
        var maxSym = t2[0].s;
        for (var i = 1; i < s; ++i) {
            if (t2[i].s > maxSym)
                maxSym = t2[i].s;
        }
        // code lengths
        var tr = new u16(maxSym + 1);
        // max bits in tree
        var mbt = ln(t[i1 - 1], tr, 0);
        if (mbt > mb) {
            // more algorithms from UZIP.js
            // TODO: find out how this code works (debt)
            //  ind    debt
            var i = 0, dt = 0;
            //    left            cost
            var lft = mbt - mb, cst = 1 << lft;
            t2.sort(function (a, b) { return tr[b.s] - tr[a.s] || a.f - b.f; });
            for (; i < s; ++i) {
                var i2_1 = t2[i].s;
                if (tr[i2_1] > mb) {
                    dt += cst - (1 << (mbt - tr[i2_1]));
                    tr[i2_1] = mb;
                }
                else
                    break;
            }
            dt >>>= lft;
            while (dt > 0) {
                var i2_2 = t2[i].s;
                if (tr[i2_2] < mb)
                    dt -= 1 << (mb - tr[i2_2]++ - 1);
                else
                    ++i;
            }
            for (; i >= 0 && dt; --i) {
                var i2_3 = t2[i].s;
                if (tr[i2_3] == mb) {
                    --tr[i2_3];
                    ++dt;
                }
            }
            mbt = mb;
        }
        return [new u8(tr), mbt];
    };
    // get the max length and assign length codes
    var ln = function (n, l, d) {
        return n.s == -1
            ? Math.max(ln(n.l, l, d + 1), ln(n.r, l, d + 1))
            : (l[n.s] = d);
    };
    // length codes generation
    var lc = function (c) {
        var s = c.length;
        // Note that the semicolon was intentional
        while (s && !c[--s])
            ;
        var cl = new u16(++s);
        //  ind      num         streak
        var cli = 0, cln = c[0], cls = 1;
        var w = function (v) { cl[cli++] = v; };
        for (var i = 1; i <= s; ++i) {
            if (c[i] == cln && i != s)
                ++cls;
            else {
                if (!cln && cls > 2) {
                    for (; cls > 138; cls -= 138)
                        w(32754);
                    if (cls > 2) {
                        w(cls > 10 ? ((cls - 11) << 5) | 28690 : ((cls - 3) << 5) | 12305);
                        cls = 0;
                    }
                }
                else if (cls > 3) {
                    w(cln), --cls;
                    for (; cls > 6; cls -= 6)
                        w(8304);
                    if (cls > 2)
                        w(((cls - 3) << 5) | 8208), cls = 0;
                }
                while (cls--)
                    w(cln);
                cls = 1;
                cln = c[i];
            }
        }
        return [cl.subarray(0, cli), s];
    };
    // calculate the length of output from tree, code lengths
    var clen = function (cf, cl) {
        var l = 0;
        for (var i = 0; i < cl.length; ++i)
            l += cf[i] * cl[i];
        return l;
    };
    // writes a fixed block
    // returns the new bit pos
    var wfblk = function (out, pos, dat) {
        // no need to write 00 as type: TypedArray defaults to 0
        var s = dat.length;
        var o = shft(pos + 2);
        out[o] = s & 255;
        out[o + 1] = s >>> 8;
        out[o + 2] = out[o] ^ 255;
        out[o + 3] = out[o + 1] ^ 255;
        for (var i = 0; i < s; ++i)
            out[o + i + 4] = dat[i];
        return (o + 4 + s) * 8;
    };
    // writes a block
    var wblk = function (dat, out, final, syms, lf, df, eb, li, bs, bl, p) {
        wbits(out, p++, final);
        ++lf[256];
        var _a = hTree(lf, 15), dlt = _a[0], mlb = _a[1];
        var _b = hTree(df, 15), ddt = _b[0], mdb = _b[1];
        var _c = lc(dlt), lclt = _c[0], nlc = _c[1];
        var _d = lc(ddt), lcdt = _d[0], ndc = _d[1];
        var lcfreq = new u16(19);
        for (var i = 0; i < lclt.length; ++i)
            lcfreq[lclt[i] & 31]++;
        for (var i = 0; i < lcdt.length; ++i)
            lcfreq[lcdt[i] & 31]++;
        var _e = hTree(lcfreq, 7), lct = _e[0], mlcb = _e[1];
        var nlcc = 19;
        for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
            ;
        var flen = (bl + 5) << 3;
        var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
        var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + (2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18]);
        if (flen <= ftlen && flen <= dtlen)
            return wfblk(out, p, dat.subarray(bs, bs + bl));
        var lm, ll, dm, dl;
        wbits(out, p, 1 + (dtlen < ftlen)), p += 2;
        if (dtlen < ftlen) {
            lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
            var llm = hMap(lct, mlcb, 0);
            wbits(out, p, nlc - 257);
            wbits(out, p + 5, ndc - 1);
            wbits(out, p + 10, nlcc - 4);
            p += 14;
            for (var i = 0; i < nlcc; ++i)
                wbits(out, p + 3 * i, lct[clim[i]]);
            p += 3 * nlcc;
            var lcts = [lclt, lcdt];
            for (var it = 0; it < 2; ++it) {
                var clct = lcts[it];
                for (var i = 0; i < clct.length; ++i) {
                    var len = clct[i] & 31;
                    wbits(out, p, llm[len]), p += lct[len];
                    if (len > 15)
                        wbits(out, p, (clct[i] >>> 5) & 127), p += clct[i] >>> 12;
                }
            }
        }
        else {
            lm = flm, ll = flt, dm = fdm, dl = fdt;
        }
        for (var i = 0; i < li; ++i) {
            if (syms[i] > 255) {
                var len = (syms[i] >>> 18) & 31;
                wbits16(out, p, lm[len + 257]), p += ll[len + 257];
                if (len > 7)
                    wbits(out, p, (syms[i] >>> 23) & 31), p += fleb[len];
                var dst = syms[i] & 31;
                wbits16(out, p, dm[dst]), p += dl[dst];
                if (dst > 3)
                    wbits16(out, p, (syms[i] >>> 5) & 8191), p += fdeb[dst];
            }
            else {
                wbits16(out, p, lm[syms[i]]), p += ll[syms[i]];
            }
        }
        wbits16(out, p, lm[256]);
        return p + ll[256];
    };
    // deflate options (nice << 13) | chain
    var deo = /*#__PURE__*/ new u32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
    // empty
    var et = /*#__PURE__*/ new u8(0);
    // compresses data into a raw DEFLATE buffer
    var dflt = function (dat, lvl, plvl, pre, post, lst) {
        var s = dat.length;
        var o = new u8(pre + s + 5 * (1 + Math.floor(s / 7000)) + post);
        // writing to this writes to the output buffer
        var w = o.subarray(pre, o.length - post);
        var pos = 0;
        if (!lvl || s < 8) {
            for (var i = 0; i <= s; i += 65535) {
                // end
                var e = i + 65535;
                if (e < s) {
                    // write full block
                    pos = wfblk(w, pos, dat.subarray(i, e));
                }
                else {
                    // write final block
                    w[i] = lst;
                    pos = wfblk(w, pos, dat.subarray(i, s));
                }
            }
        }
        else {
            var opt = deo[lvl - 1];
            var n = opt >>> 13, c = opt & 8191;
            var msk_1 = (1 << plvl) - 1;
            //    prev 2-byte val map    curr 2-byte val map
            var prev = new u16(32768), head = new u16(msk_1 + 1);
            var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
            var hsh = function (i) { return (dat[i] ^ (dat[i + 1] << bs1_1) ^ (dat[i + 2] << bs2_1)) & msk_1; };
            // 24576 is an arbitrary number of maximum symbols per block
            // 424 buffer for last block
            var syms = new u32(25000);
            // length/literal freq   distance freq
            var lf = new u16(288), df = new u16(32);
            //  l/lcnt  exbits  index  l/lind  waitdx  bitpos
            var lc_1 = 0, eb = 0, i = 0, li = 0, wi = 0, bs = 0;
            for (; i < s; ++i) {
                // hash value
                var hv = hsh(i);
                // index mod 32768
                var imod = i & 32767;
                // previous index with this value
                var pimod = head[hv];
                prev[imod] = pimod;
                head[hv] = imod;
                // We always should modify head and prev, but only add symbols if
                // this data is not yet processed ("wait" for wait index)
                if (wi <= i) {
                    // bytes remaining
                    var rem = s - i;
                    if ((lc_1 > 7000 || li > 24576) && rem > 423) {
                        pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i - bs, pos);
                        li = lc_1 = eb = 0, bs = i;
                        for (var j = 0; j < 286; ++j)
                            lf[j] = 0;
                        for (var j = 0; j < 30; ++j)
                            df[j] = 0;
                    }
                    //  len    dist   chain
                    var l = 2, d = 0, ch_1 = c, dif = (imod - pimod) & 32767;
                    if (rem > 2 && hv == hsh(i - dif)) {
                        var maxn = Math.min(n, rem) - 1;
                        var maxd = Math.min(32767, i);
                        // max possible length
                        // not capped at dif because decompressors implement "rolling" index population
                        var ml = Math.min(258, rem);
                        while (dif <= maxd && --ch_1 && imod != pimod) {
                            if (dat[i + l] == dat[i + l - dif]) {
                                var nl = 0;
                                for (; nl < ml && dat[i + nl] == dat[i + nl - dif]; ++nl)
                                    ;
                                if (nl > l) {
                                    l = nl, d = dif;
                                    // break out early when we reach "nice" (we are satisfied enough)
                                    if (nl > maxn)
                                        break;
                                    // now, find the rarest 2-byte sequence within this
                                    // length of literals and search for that instead.
                                    // Much faster than just using the start
                                    var mmd = Math.min(dif, nl - 2);
                                    var md = 0;
                                    for (var j = 0; j < mmd; ++j) {
                                        var ti = (i - dif + j + 32768) & 32767;
                                        var pti = prev[ti];
                                        var cd = (ti - pti + 32768) & 32767;
                                        if (cd > md)
                                            md = cd, pimod = ti;
                                    }
                                }
                            }
                            // check the previous match
                            imod = pimod, pimod = prev[imod];
                            dif += (imod - pimod + 32768) & 32767;
                        }
                    }
                    // d will be nonzero only when a match was found
                    if (d) {
                        // store both dist and len data in one Uint32
                        // Make sure this is recognized as a len/dist with 28th bit (2^28)
                        syms[li++] = 268435456 | (revfl[l] << 18) | revfd[d];
                        var lin = revfl[l] & 31, din = revfd[d] & 31;
                        eb += fleb[lin] + fdeb[din];
                        ++lf[257 + lin];
                        ++df[din];
                        wi = i + l;
                        ++lc_1;
                    }
                    else {
                        syms[li++] = dat[i];
                        ++lf[dat[i]];
                    }
                }
            }
            pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i - bs, pos);
            // this is the easiest way to avoid needing to maintain state
            if (!lst)
                pos = wfblk(w, pos, et);
        }
        return slc(o, 0, pre + shft(pos) + post);
    };
    // Alder32
    var adler = function () {
        var a = 1, b = 0;
        return {
            p: function (d) {
                // closures have awful performance
                var n = a, m = b;
                var l = d.length;
                for (var i = 0; i != l;) {
                    var e = Math.min(i + 5552, l);
                    for (; i < e; ++i)
                        n += d[i], m += n;
                    n %= 65521, m %= 65521;
                }
                a = n, b = m;
            },
            d: function () { return ((a >>> 8) << 16 | (b & 255) << 8 | (b >>> 8)) + ((a & 255) << 23) * 2; }
        };
    };
    // deflate with opts
    var dopt = function (dat, opt, pre, post, st) {
        return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : (12 + opt.mem), pre, post, !st);
    };
    // write bytes
    var wbytes = function (d, b, v) {
        for (; v; ++b)
            d[b] = v, v >>>= 8;
    };
    // zlib header
    var zlh = function (c, o) {
        var lv = o.level, fl = lv == 0 ? 0 : lv < 6 ? 1 : lv == 9 ? 3 : 2;
        c[0] = 120, c[1] = (fl << 6) | (fl ? (32 - 2 * fl) : 1);
    };
    // zlib valid
    var zlv = function (d) {
        if ((d[0] & 15) != 8 || (d[0] >>> 4) > 7 || ((d[0] << 8 | d[1]) % 31))
            throw 'invalid zlib data';
        if (d[1] & 32)
            throw 'invalid zlib data: preset dictionaries not supported';
    };
    /**
     * Compress data with Zlib
     * @param data The data to compress
     * @param opts The compression options
     * @returns The zlib-compressed version of the data
     */
    function zlibSync(data, opts) {
        if (opts === void 0) { opts = {}; }
        var a = adler();
        a.p(data);
        var d = dopt(data, opts, 2, 4);
        return zlh(d, opts), wbytes(d, d.length - 4, a.d()), d;
    }
    /**
     * Expands Zlib data
     * @param data The data to decompress
     * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
     * @returns The decompressed version of the data
     */
    function unzlibSync(data, out) {
        return inflt((zlv(data), data.subarray(2, -4)), out);
    }
    /**
     * Converts a string into a Uint8Array for use with compression/decompression methods
     * @param str The string to encode
     * @param latin1 Whether or not to interpret the data as Latin-1. This should
     *               not need to be true unless decoding a binary string.
     * @returns The string encoded in UTF-8/Latin-1 binary
     */
    function strToU8(str, latin1) {
        var l = str.length;
        if (!latin1 && typeof TextEncoder != 'undefined')
            return new TextEncoder().encode(str);
        var ar = new u8(str.length + (str.length >>> 1));
        var ai = 0;
        var w = function (v) { ar[ai++] = v; };
        for (var i = 0; i < l; ++i) {
            if (ai + 5 > ar.length) {
                var n = new u8(ai + 8 + ((l - i) << 1));
                n.set(ar);
                ar = n;
            }
            var c = str.charCodeAt(i);
            if (c < 128 || latin1)
                w(c);
            else if (c < 2048)
                w(192 | (c >>> 6)), w(128 | (c & 63));
            else if (c > 55295 && c < 57344)
                c = 65536 + (c & 1023 << 10) | (str.charCodeAt(++i) & 1023),
                    w(240 | (c >>> 18)), w(128 | ((c >>> 12) & 63)), w(128 | ((c >>> 6) & 63)), w(128 | (c & 63));
            else
                w(224 | (c >>> 12)), w(128 | ((c >>> 6) & 63)), w(128 | (c & 63));
        }
        return slc(ar, 0, ai);
    }
    /**
     * Converts a Uint8Array to a string
     * @param dat The data to decode to string
     * @param latin1 Whether or not to interpret the data as Latin-1. This should
     *               not need to be true unless encoding to binary string.
     * @returns The original UTF-8/Latin-1 string
     */
    function strFromU8(dat, latin1) {
        var r = '';
        if (!latin1 && typeof TextDecoder != 'undefined')
            return new TextDecoder().decode(dat);
        for (var i = 0; i < dat.length;) {
            var c = dat[i++];
            if (c < 128 || latin1)
                r += String.fromCharCode(c);
            else if (c < 224)
                r += String.fromCharCode((c & 31) << 6 | (dat[i++] & 63));
            else if (c < 240)
                r += String.fromCharCode((c & 15) << 12 | (dat[i++] & 63) << 6 | (dat[i++] & 63));
            else
                c = ((c & 15) << 18 | (dat[i++] & 63) << 12 | (dat[i++] & 63) << 6 | (dat[i++] & 63)) - 65536,
                    r += String.fromCharCode(55296 | (c >> 10), 56320 | (c & 1023));
        }
        return r;
    }

    const MARK = "v1";

    var __defProp = Object.defineProperty;
    var __defProps = Object.defineProperties;
    var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
    var __getOwnPropSymbols = Object.getOwnPropertySymbols;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __propIsEnum = Object.prototype.propertyIsEnumerable;
    var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
    var __spreadValues = (a, b) => {
        for (var prop in b || (b = {}))
            if (__hasOwnProp.call(b, prop))
                __defNormalProp(a, prop, b[prop]);
        if (__getOwnPropSymbols)
            for (var prop of __getOwnPropSymbols(b)) {
                if (__propIsEnum.call(b, prop))
                    __defNormalProp(a, prop, b[prop]);
            }
        return a;
    };
    var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
    const pack = (event) => {
        const _e = __spreadProps(__spreadValues({}, event), {
            v: MARK
        });
        return strFromU8(zlibSync(strToU8(JSON.stringify(_e))), true);
    };

    const unpack = (raw) => {
        if (typeof raw !== "string") {
            return raw;
        }
        try {
            const e = JSON.parse(raw);
            if (e.timestamp) {
                return e;
            }
        } catch (error) {
        }
        try {
            const e = JSON.parse(strFromU8(unzlibSync(strToU8(raw, true))));
            if (e.v === MARK) {
                return e;
            }
            throw new Error(`These events were packed with packer ${e.v} which is incompatible with current packer ${MARK}.`);
        } catch (error) {
            console.error(error);
            throw new Error("Unknown data format.");
        }
    };

    class StackFrame {
        constructor(obj) {
            this.fileName = obj.fileName || "";
            this.functionName = obj.functionName || "";
            this.lineNumber = obj.lineNumber;
            this.columnNumber = obj.columnNumber;
        }
        toString() {
            const lineNumber = this.lineNumber || "";
            const columnNumber = this.columnNumber || "";
            if (this.functionName)
                return `${this.functionName} (${this.fileName}:${lineNumber}:${columnNumber})`;
            return `${this.fileName}:${lineNumber}:${columnNumber}`;
        }
    }
    const FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+:\d+/;
    const CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m;
    const SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code])?$/;
    const ErrorStackParser = {
        parse: function(error) {
            if (!error) {
                return [];
            }
            if (typeof error.stacktrace !== "undefined" || typeof error["opera#sourceloc"] !== "undefined") {
                return this.parseOpera(error);
            } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
                return this.parseV8OrIE(error);
            } else if (error.stack) {
                return this.parseFFOrSafari(error);
            } else {
                throw new Error("Cannot parse given Error object");
            }
        },
        extractLocation: function(urlLike) {
            if (urlLike.indexOf(":") === -1) {
                return [urlLike];
            }
            const regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
            const parts = regExp.exec(urlLike.replace(/[()]/g, ""));
            if (!parts)
                throw new Error(`Cannot parse given url: ${urlLike}`);
            return [parts[1], parts[2] || void 0, parts[3] || void 0];
        },
        parseV8OrIE: function(error) {
            const filtered = error.stack.split("\n").filter(function(line) {
                return !!line.match(CHROME_IE_STACK_REGEXP);
            }, this);
            return filtered.map(function(line) {
                if (line.indexOf("(eval ") > -1) {
                    line = line.replace(/eval code/g, "eval").replace(/(\(eval at [^()]*)|(\),.*$)/g, "");
                }
                let sanitizedLine = line.replace(/^\s+/, "").replace(/\(eval code/g, "(");
                const location = sanitizedLine.match(/ (\((.+):(\d+):(\d+)\)$)/);
                sanitizedLine = location ? sanitizedLine.replace(location[0], "") : sanitizedLine;
                const tokens = sanitizedLine.split(/\s+/).slice(1);
                const locationParts = this.extractLocation(location ? location[1] : tokens.pop());
                const functionName = tokens.join(" ") || void 0;
                const fileName = ["eval", "<anonymous>"].indexOf(locationParts[0]) > -1 ? void 0 : locationParts[0];
                return new StackFrame({
                    functionName,
                    fileName,
                    lineNumber: locationParts[1],
                    columnNumber: locationParts[2]
                });
            }, this);
        },
        parseFFOrSafari: function(error) {
            const filtered = error.stack.split("\n").filter(function(line) {
                return !line.match(SAFARI_NATIVE_CODE_REGEXP);
            }, this);
            return filtered.map(function(line) {
                if (line.indexOf(" > eval") > -1) {
                    line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ":$1");
                }
                if (line.indexOf("@") === -1 && line.indexOf(":") === -1) {
                    return new StackFrame({
                        functionName: line
                    });
                } else {
                    const functionNameRegex = /((.*".+"[^@]*)?[^@]*)(?:@)/;
                    const matches = line.match(functionNameRegex);
                    const functionName = matches && matches[1] ? matches[1] : void 0;
                    const locationParts = this.extractLocation(line.replace(functionNameRegex, ""));
                    return new StackFrame({
                        functionName,
                        fileName: locationParts[0],
                        lineNumber: locationParts[1],
                        columnNumber: locationParts[2]
                    });
                }
            }, this);
        },
        parseOpera: function(e) {
            if (!e.stacktrace || e.message.indexOf("\n") > -1 && e.message.split("\n").length > e.stacktrace.split("\n").length) {
                return this.parseOpera9(e);
            } else if (!e.stack) {
                return this.parseOpera10(e);
            } else {
                return this.parseOpera11(e);
            }
        },
        parseOpera9: function(e) {
            const lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
            const lines = e.message.split("\n");
            const result = [];
            for (let i = 2, len = lines.length; i < len; i += 2) {
                const match = lineRE.exec(lines[i]);
                if (match) {
                    result.push(new StackFrame({
                        fileName: match[2],
                        lineNumber: parseFloat(match[1])
                    }));
                }
            }
            return result;
        },
        parseOpera10: function(e) {
            const lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
            const lines = e.stacktrace.split("\n");
            const result = [];
            for (let i = 0, len = lines.length; i < len; i += 2) {
                const match = lineRE.exec(lines[i]);
                if (match) {
                    result.push(new StackFrame({
                        functionName: match[3] || void 0,
                        fileName: match[2],
                        lineNumber: parseFloat(match[1])
                    }));
                }
            }
            return result;
        },
        parseOpera11: function(error) {
            const filtered = error.stack.split("\n").filter(function(line) {
                return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) && !line.match(/^Error created at/);
            }, this);
            return filtered.map(function(line) {
                const tokens = line.split("@");
                const locationParts = this.extractLocation(tokens.pop());
                const functionCall = tokens.shift() || "";
                const functionName = functionCall.replace(/<anonymous function(: (\w+))?>/, "$2").replace(/\([^)]*\)/g, "") || void 0;
                return new StackFrame({
                    functionName,
                    fileName: locationParts[0],
                    lineNumber: locationParts[1],
                    columnNumber: locationParts[2]
                });
            }, this);
        }
    };

    function pathToSelector(node) {
        if (!node || !node.outerHTML) {
            return "";
        }
        let path = "";
        while (node.parentElement) {
            let name = node.localName;
            if (!name) {
                break;
            }
            name = name.toLowerCase();
            const parent = node.parentElement;
            const domSiblings = [];
            if (parent.children && parent.children.length > 0) {
                for (let i = 0; i < parent.children.length; i++) {
                    const sibling = parent.children[i];
                    if (sibling.localName && sibling.localName.toLowerCase) {
                        if (sibling.localName.toLowerCase() === name) {
                            domSiblings.push(sibling);
                        }
                    }
                }
            }
            if (domSiblings.length > 1) {
                name += `:eq(${domSiblings.indexOf(node)})`;
            }
            path = name + (path ? ">" + path : "");
            node = parent;
        }
        return path;
    }
    function isObject(obj) {
        return Object.prototype.toString.call(obj) === "[object Object]";
    }
    function isObjTooDeep(obj, limit) {
        if (limit === 0) {
            return true;
        }
        const keys = Object.keys(obj);
        for (const key of keys) {
            if (isObject(obj[key]) && isObjTooDeep(obj[key], limit - 1)) {
                return true;
            }
        }
        return false;
    }
    function stringify(obj, stringifyOptions) {
        const options = {
            numOfKeysLimit: 50,
            depthOfLimit: 4
        };
        Object.assign(options, stringifyOptions);
        const stack = [];
        const keys = [];
        return JSON.stringify(obj, function(key, value) {
            if (stack.length > 0) {
                const thisPos = stack.indexOf(this);
                ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
                ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);
                if (~stack.indexOf(value)) {
                    if (stack[0] === value) {
                        value = "[Circular ~]";
                    } else {
                        value = "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]";
                    }
                }
            } else {
                stack.push(value);
            }
            if (value === null)
                return value;
            if (value === void 0)
                return "undefined";
            if (shouldIgnore(value)) {
                return toString(value);
            }
            if (value instanceof Event) {
                const eventResult = {};
                for (const eventKey in value) {
                    const eventValue = value[eventKey];
                    if (Array.isArray(eventValue)) {
                        eventResult[eventKey] = pathToSelector(eventValue.length ? eventValue[0] : null);
                    } else {
                        eventResult[eventKey] = eventValue;
                    }
                }
                return eventResult;
            } else if (value instanceof Node) {
                if (value instanceof HTMLElement) {
                    return value ? value.outerHTML : "";
                }
                return value.nodeName;
            } else if (value instanceof Error) {
                return value.stack ? value.stack + "\nEnd of stack for Error object" : value.name + ": " + value.message;
            }
            return value;
        });
        function shouldIgnore(_obj) {
            if (isObject(_obj) && Object.keys(_obj).length > options.numOfKeysLimit) {
                return true;
            }
            if (typeof _obj === "function") {
                return true;
            }
            if (isObject(_obj) && isObjTooDeep(_obj, options.depthOfLimit)) {
                return true;
            }
            return false;
        }
        function toString(_obj) {
            let str = _obj.toString();
            if (options.stringLengthLimit && str.length > options.stringLengthLimit) {
                str = `${str.slice(0, options.stringLengthLimit)}...`;
            }
            return str;
        }
    }

    const defaultLogOptions = {
        level: [
            "assert",
            "clear",
            "count",
            "countReset",
            "debug",
            "dir",
            "dirxml",
            "error",
            "group",
            "groupCollapsed",
            "groupEnd",
            "info",
            "log",
            "table",
            "time",
            "timeEnd",
            "timeLog",
            "trace",
            "warn"
        ],
        lengthThreshold: 1e3,
        logger: "console"
    };
    function initLogObserver(cb, win, options) {
        const logOptions = options ? Object.assign({}, defaultLogOptions, options) : defaultLogOptions;
        const loggerType = logOptions.logger;
        if (!loggerType) {
            return () => {
            };
        }
        let logger;
        if (typeof loggerType === "string") {
            logger = win[loggerType];
        } else {
            logger = loggerType;
        }
        let logCount = 0;
        const cancelHandlers = [];
        if (logOptions.level.includes("error")) {
            if (window) {
                const errorHandler = (event) => {
                    const message = event.message, error = event.error;
                    const trace = ErrorStackParser.parse(error).map((stackFrame) => stackFrame.toString());
                    const payload = [stringify(message, logOptions.stringifyOptions)];
                    cb({
                        level: "error",
                        trace,
                        payload
                    });
                };
                window.addEventListener("error", errorHandler);
                cancelHandlers.push(() => {
                    if (window)
                        window.removeEventListener("error", errorHandler);
                });
            }
        }
        for (const levelType of logOptions.level) {
            cancelHandlers.push(replace(logger, levelType));
        }
        return () => {
            cancelHandlers.forEach((h) => h());
        };
        function replace(_logger, level) {
            if (!_logger[level]) {
                return () => {
                };
            }
            return patch(_logger, level, (original) => {
                return (...args) => {
                    original.apply(this, args);
                    try {
                        const trace = ErrorStackParser.parse(new Error()).map((stackFrame) => stackFrame.toString()).splice(1);
                        const payload = args.map((s) => stringify(s, logOptions.stringifyOptions));
                        logCount++;
                        if (logCount < logOptions.lengthThreshold) {
                            cb({
                                level,
                                trace,
                                payload
                            });
                        } else if (logCount === logOptions.lengthThreshold) {
                            cb({
                                level: "warn",
                                trace: [],
                                payload: [
                                    stringify("The number of log records reached the threshold.")
                                ]
                            });
                        }
                    } catch (error) {
                        original("rrweb logger error:", error, ...args);
                    }
                };
            });
        }
    }
    const PLUGIN_NAME = "rrweb/console@1";
    const getRecordConsolePlugin = (options) => ({
        name: PLUGIN_NAME,
        observer: initLogObserver,
        options
    });

    const ORIGINAL_ATTRIBUTE_NAME = "__rrweb_original__";
    const defaultLogConfig = {
        level: [
            "assert",
            "clear",
            "count",
            "countReset",
            "debug",
            "dir",
            "dirxml",
            "error",
            "group",
            "groupCollapsed",
            "groupEnd",
            "info",
            "log",
            "table",
            "time",
            "timeEnd",
            "timeLog",
            "trace",
            "warn"
        ],
        replayLogger: void 0
    };
    class LogReplayPlugin {
        constructor(config) {
            this.config = Object.assign(defaultLogConfig, config);
        }
        getConsoleLogger() {
            const replayLogger = {};
            for (const level of this.config.level) {
                if (level === "trace") {
                    replayLogger[level] = (data) => {
                        const logger = console.log[ORIGINAL_ATTRIBUTE_NAME] ? console.log[ORIGINAL_ATTRIBUTE_NAME] : console.log;
                        logger(...data.payload.map((s) => JSON.parse(s)), this.formatMessage(data));
                    };
                } else {
                    replayLogger[level] = (data) => {
                        const logger = console[level][ORIGINAL_ATTRIBUTE_NAME] ? console[level][ORIGINAL_ATTRIBUTE_NAME] : console[level];
                        logger(...data.payload.map((s) => JSON.parse(s)), this.formatMessage(data));
                    };
                }
            }
            return replayLogger;
        }
        formatMessage(data) {
            if (data.trace.length === 0) {
                return "";
            }
            const stackPrefix = "\n	at ";
            let result = stackPrefix;
            result += data.trace.join(stackPrefix);
            return result;
        }
    }
    const getReplayConsolePlugin = (options) => {
        const replayLogger = (options == null ? void 0 : options.replayLogger) || new LogReplayPlugin(options).getConsoleLogger();
        return {
            handler(event, _isSync, context) {
                let logData = null;
                if (event.type === EventType.IncrementalSnapshot && event.data.source === IncrementalSource.Log) {
                    logData = event.data;
                } else if (event.type === EventType.Plugin && event.data.plugin === PLUGIN_NAME) {
                    logData = event.data.payload;
                }
                if (logData) {
                    try {
                        if (typeof replayLogger[logData.level] === "function") {
                            replayLogger[logData.level](logData);
                        }
                    } catch (error) {
                        if (context.replayer.config.showWarning) {
                            console.warn(error);
                        }
                    }
                }
            }
        };
    };

    exports.EventType = EventType;
    exports.IncrementalSource = IncrementalSource;
    exports.MouseInteractions = MouseInteractions;
    exports.PLUGIN_NAME = PLUGIN_NAME;
    exports.Replayer = Replayer;
    exports.ReplayerEvents = ReplayerEvents;
    exports.addCustomEvent = addCustomEvent;
    exports.freezePage = freezePage;
    exports.getRecordConsolePlugin = getRecordConsolePlugin;
    exports.getReplayConsolePlugin = getReplayConsolePlugin;
    exports.pack = pack;
    exports.record = record;
    exports.unpack = unpack;
    exports.utils = utils;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});