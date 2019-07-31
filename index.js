let htmlVoidElements = require("./html-void.json");
let htmlValueElements = ["input", "textarea"];
let attrs = {};
class NodeHTMLElement {
  constructor(tag) {
    this.id = "";
    this.className = "";
    this.style = {};
    if (!!htmlValueElements.find(v => v === tag)) this.value = "";
    else this.innerHTML = "";
    this.localName = tag;
    this.hidden = false;
  }
  get classList() {
    let that = this;
    return {
      add(...items) {
        items.forEach(item => {
          if (!this.contains(item)) that.className += " " + item;
        });
      },
      remove(...items) {
        items.forEach(item => {
          if (this.contains(item))
            that.className = that.className.replace(" " + item, "");
        });
      },
      toggle(...items) {
        items.forEach(item => {
          if (!this.contains(item)) that.className += " " + item;
          else that.className = that.className.replace(" " + item, "");
        });
      },
      contains(item) {
        return that.className.includes(item);
      }
    };
  }
  get outerHTML() {
    let style = Object.keys(this.style);
    let styleArg =
      style.length > 0
        ? ' style="' +
          style
            .map(
              n =>
                n.replace(/[A-Z]/g, "-$1").toLowerCase() + ":" + this.style[n]
            )
            .join("") +
          '"'
        : "";
    let classArg = !!this.className
      ? ' class="' + this.className.slice(1) + '"'
      : "";
    let valueArg = !!this.value ? ' value="' + this.value + '"' : "";
    let idArg = !!this.id ? ' id="' + this.id + '"' : "";
    let hiddenArg = this.hidden ? " hidden" : "";
    let otherArgs = [];
    for (const attrName in attrs) {
      otherArgs.push(
        ` ${attrName}${
          typeof attrs[attrName] === "boolean"
            ? ""
            : '="' + attrs[attrName] + '"'
        }`
      );
    }

    let isVoidElement = !!htmlVoidElements.find(v => v === this.localName);
    let isValueElement = htmlValueElements.find(v => v === this.localName);
    if (isVoidElement)
      return `<${this.localName}${hiddenArg}${styleArg}${classArg}${idArg}${
        isValueElement ? valueArg : ""
      }${otherArgs.join("")}/>`;
    return `<${
      this.localName
    }${hiddenArg}${styleArg}${classArg}${idArg}${otherArgs.join("")}>${
      isValueElement ? this.value : this.innerHTML
    }</${this.localName}>`;
  }
  appendChild(child) {
    this.innerHTML += child.outerHTML;
    return child;
  }
  cloneNode(deep) {
    let newElement = Object.assign({}, this);
    if (!deep) newElement.innerHTML = "";
    return newElement;
  }
  setAttribute(qualifiedName, value) {
    attrs[qualifiedName] = value;
  }
  getAttribute(qualifiedName) {
    return !!attrs[qualifiedName];
  }
  hasAttribute(qualifiedName) {
    return qualifiedName in attrs;
  }
  removeAttribute(qualifiedName) {
    return delete attrs[qualifiedName];
  }
}
function createElement(tag) {
  return new NodeHTMLElement(tag);
}
module.exports = { createElement };
