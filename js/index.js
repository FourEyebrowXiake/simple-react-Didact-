const Didact = importFromBelow();

const stories = [
  { name: "Didact introduction", url: "http://bit.ly/2pX7HNn" },
  { name: "Rendering DOM elements ", url: "http://bit.ly/2qCOejH" },
  { name: "Element creation and JSX", url: "http://bit.ly/2qGbw8S" },
  { name: "Instances and reconciliation", url: "http://bit.ly/2q4A746" },
  { name: "Components and state", url: "http://bit.ly/2rE16nh" }
];

const appElement = Didact.createElement("div", null,
  Didact.createElement("ul", null, ...stories.map(storyElement))
)

function storyElement({ name, url }) {
  const likes = Math.ceil(Math.random() * 100);
  return (
    Didact.createElement("li",null,
      Didact.createElement("button", null, likes, "\u2764\uFE0F"),
      Didact.createElement("a", {href: url}, name)
    )
  )
}

Didact.render(appElement, document.getElementById("root"));

/** ⬇️⬇️⬇️⬇️⬇️ 🌼Didact🌼 ⬇️⬇️⬇️⬇️⬇️ **/

function importFromBelow() {
  var TEXT_ELEMENT = "TEXT_ELEMENT"
  function render(element, parentDom) {
    const { type, props } = element;
    const isTextElement = type === TEXT_ELEMENT;
    const dom = isTextElement
        ? document.createTextNode('')
        : document.createElement(type);

    const isListener = name => name.startsWith("on");
    Object.keys(props).filter(isListener).forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, props[name])
    })

    const isAttribute = name => !isListener(name) && name != "children"
    Object.keys(props).filter(isAttribute).forEach(name => {
      dom[name] = props[name]
    })

    const childElements = props.children || [];
    childElements.forEach(childElement => render(childElement, dom))

    parentDom.appendChild(dom)
  }

  function createElement(type, confing, ...args) {
    const props = Object.assign({}, confing)
    const hasChildern = args.length > 0
    const rawChildren = hasChildern ? [].concat(args) : [];
    props.children = rawChildren
        .filter(c => c != null && c !== false )
        .map( c => c instanceof Object ? c : createTextElement(c) )
    return { type, props}
  }
  
  function createTextElement(value) {
    return createElement(TEXT_ELEMENT, { nodeValue: value })
  }

  return {
    render,
    createElement
  };
}