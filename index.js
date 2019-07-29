class NodeHTMLElement{
  constructor(tag){
    this.id = ""
    this.className = ""
    this.style = {}
    this.innerHTML = ""
    this.localName = tag
  }
  get classList(){
    let that = this
    return {
      add(...items){
        items.forEach((item) =>{
          if(!this.contains(item)) that.className += " " + item
        })
      },
      remove(...items){
        items.forEach((item) =>{
          if(this.contains(item)) that.className = that.className.replace(" " + item, "")
        })
      },
      toggle(...items){
        items.forEach((item) =>{
          if(!this.contains(item)) that.className += " " + item
          else that.className = that.className.replace(" " + item, "")
        })
      },
      contains(item){
        return that.className.includes(item)
      }
    }
  }
  get outerHTML(){
    let style = Object.keys(this.style)
    let styleArg = style.length > 0 ? " style=\"" + style.map((n) =>n.replace(/[A-Z]/g, "-$1").toLowerCase() + ":" + this.style[n]).join(";") + "\"" : ""
    let classArg = !!this.className ? " class=\"" + this.className.slice(1) + "\"" : ""
    let idArg = !!this.id ? " id=\"" + this.id + "\"" : ""
    return `<${this.localName}${styleArg}${classArg}${idArg}>${this.innerHTML}</${this.localName}>`
  }
  appendChild(child){
    this.innerHTML += child.outerHTML
    return child
  }
}
function createElement(tag){return new NodeHTMLElement(tag)}
module.exports = {createElement}
